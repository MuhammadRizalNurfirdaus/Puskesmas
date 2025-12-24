import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import api from '../../services/api';
import { formatIDShortDate, groupKunjunganPerDay, toISODateOnly } from '../../utils/reporting';

type StatistikPasienResponse = {
  statistik: {
    total: number;
    umum: number;
    bpjs: number;
    lakiLaki: number;
    perempuan: number;
  };
};

type LaporanKunjunganResponse = {
  data: Array<any>;
  statistik: {
    total: number;
    umum: number;
    bpjs: number;
  };
};

type LaporanObatResponse = {
  data: Array<{ namaObat: string; stok: number; stokMinimal: number; isActive?: boolean; kodeObat?: string; idObat?: number }>;
  statistik: {
    totalObat: number;
    stokRendah: number;
    stokHabis: number;
  };
};

const COLORS = {
  brand: '#158a68',
  brandLight: '#1fad81',
  sky: '#0ea5e9',
  amber: '#f59e0b',
  rose: '#e11d48',
  slate: '#334155',
};

export default function LaporanV2() {
  const todayISO = useMemo(() => toISODateOnly(new Date()), []);
  const defaultStartISO = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 29);
    return toISODateOnly(d);
  }, []);

  const [laporanKunjungan, setLaporanKunjungan] = useState<LaporanKunjunganResponse | null>(null);
  const [statistikPasien, setStatistikPasien] = useState<StatistikPasienResponse | null>(null);
  const [laporanObat, setLaporanObat] = useState<LaporanObatResponse | null>(null);

  const [startDate, setStartDate] = useState(defaultStartISO);
  const [endDate, setEndDate] = useState(todayISO);

  const [loadingKunjungan, setLoadingKunjungan] = useState(false);
  const [loadingRingkasan, setLoadingRingkasan] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchLaporanKunjungan = async () => {
    try {
      setError('');
      setLoadingKunjungan(true);
      const response = await api.get('/laporan/kunjungan', {
        params: { startDate, endDate },
      });
      setLaporanKunjungan(response.data);
    } catch (err) {
      console.error('Error:', err);
      setError('Gagal memuat laporan kunjungan. Coba lagi.');
    } finally {
      setLoadingKunjungan(false);
    }
  };

  const fetchRingkasan = async () => {
    try {
      setError('');
      setLoadingRingkasan(true);
      const [pasienRes, obatRes] = await Promise.all([api.get('/laporan/pasien'), api.get('/laporan/obat')]);
      setStatistikPasien(pasienRes.data);
      setLaporanObat(obatRes.data);
    } catch (err) {
      console.error('Error:', err);
      setError('Gagal memuat ringkasan laporan.');
    } finally {
      setLoadingRingkasan(false);
    }
  };

  useEffect(() => {
    fetchRingkasan();
  }, []);

  useEffect(() => {
    fetchLaporanKunjungan();
  }, []);

  const kunjunganSeries = useMemo(() => {
    const data = laporanKunjungan?.data ?? [];
    return groupKunjunganPerDay(data, startDate, endDate);
  }, [laporanKunjungan, startDate, endDate]);

  const pasienDistribusi = useMemo(() => {
    const s = statistikPasien?.statistik;
    if (!s) return [];
    return [
      { name: 'Umum', value: s.umum, fill: COLORS.brand },
      { name: 'BPJS', value: s.bpjs, fill: COLORS.sky },
    ];
  }, [statistikPasien]);

  const genderDistribusi = useMemo(() => {
    const s = statistikPasien?.statistik;
    if (!s) return [];
    return [
      { name: 'Laki-laki', value: s.lakiLaki, fill: COLORS.slate },
      { name: 'Perempuan', value: s.perempuan, fill: COLORS.rose },
    ];
  }, [statistikPasien]);

  const obatTerendah = useMemo(() => {
    const list = laporanObat?.data ?? [];
    return [...list]
      .sort((a, b) => (a.stok ?? 0) - (b.stok ?? 0))
      .slice(0, 10)
      .map((o) => ({
        name: o.namaObat,
        stok: o.stok ?? 0,
        minimal: o.stokMinimal ?? 0,
      }));
  }, [laporanObat]);

  const kunjunganPreview = useMemo(() => {
    return (laporanKunjungan?.data ?? []).slice(0, 10);
  }, [laporanKunjungan]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-brand-700 to-brand-900 rounded-2xl shadow-sm ring-1 ring-black/5 p-8 text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">Laporan & Statistik</h1>
            <p className="mt-2 text-white/80">Monitoring, analisis, dan ringkasan pelayanan Puskesmas.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div>
              <label className="label text-white/90">Tanggal mulai</label>
              <input
                type="date"
                className="input"
                value={startDate}
                max={endDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="label text-white/90">Tanggal akhir</label>
              <input
                type="date"
                className="input"
                value={endDate}
                min={startDate}
                max={todayISO}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button
              className="btn bg-white text-brand-800 hover:bg-white/90"
              onClick={fetchLaporanKunjungan}
              disabled={loadingKunjungan || !startDate || !endDate}
            >
              {loadingKunjungan ? 'Memuat…' : 'Tampilkan'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="card">
          <div className="card-body">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total pasien</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">{loadingRingkasan ? '…' : statistikPasien?.statistik.total ?? 0}</p>
            <p className="mt-1 text-sm text-slate-600">Pasien terdaftar</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Kunjungan (periode)</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">{loadingKunjungan ? '…' : laporanKunjungan?.statistik.total ?? 0}</p>
            <p className="mt-1 text-sm text-slate-600">Umum {laporanKunjungan?.statistik.umum ?? 0} • BPJS {laporanKunjungan?.statistik.bpjs ?? 0}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Stok rendah</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">{loadingRingkasan ? '…' : laporanObat?.statistik.stokRendah ?? 0}</p>
            <p className="mt-1 text-sm text-slate-600">Perlu perhatian apotek</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Stok habis</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">{loadingRingkasan ? '…' : laporanObat?.statistik.stokHabis ?? 0}</p>
            <p className="mt-1 text-sm text-slate-600">Prioritas pengadaan</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="card-header">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Tren Kunjungan</h3>
              <p className="mt-1 text-sm text-slate-600">Per hari ({startDate} s.d. {endDate})</p>
            </div>
          </div>
          <div className="card-body">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kunjunganSeries} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="umumFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.brandLight} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={COLORS.brandLight} stopOpacity={0.06} />
                    </linearGradient>
                    <linearGradient id="bpjsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.sky} stopOpacity={0.28} />
                      <stop offset="100%" stopColor={COLORS.sky} stopOpacity={0.06} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatIDShortDate} minTickGap={18} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="umum" name="Umum" stroke={COLORS.brandLight} fill="url(#umumFill)" />
                  <Area type="monotone" dataKey="bpjs" name="BPJS" stroke={COLORS.sky} fill="url(#bpjsFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Komposisi Pasien</h3>
              <p className="mt-1 text-sm text-slate-600">Umum vs BPJS</p>
            </div>
          </div>
          <div className="card-body">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Legend />
                  <Pie data={pasienDistribusi} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                    {pasienDistribusi.map((entry) => (
                      <Cell key={entry.name} fill={(entry as any).fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-brand-50 px-4 py-3 ring-1 ring-brand-100">
                <p className="text-xs font-semibold text-brand-700">Umum</p>
                <p className="mt-1 text-xl font-extrabold text-brand-900">{statistikPasien?.statistik.umum ?? 0}</p>
              </div>
              <div className="rounded-xl bg-sky-50 px-4 py-3 ring-1 ring-sky-100">
                <p className="text-xs font-semibold text-sky-700">BPJS</p>
                <p className="mt-1 text-xl font-extrabold text-sky-900">{statistikPasien?.statistik.bpjs ?? 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Jenis Kelamin</h3>
              <p className="mt-1 text-sm text-slate-600">Distribusi pasien</p>
            </div>
          </div>
          <div className="card-body">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Legend />
                  <Pie data={genderDistribusi} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={2}>
                    {genderDistribusi.map((entry) => (
                      <Cell key={entry.name} fill={(entry as any).fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card lg:col-span-2">
          <div className="card-header">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Obat Prioritas</h3>
              <p className="mt-1 text-sm text-slate-600">Top 10 stok terendah vs stok minimal</p>
            </div>
          </div>
          <div className="card-body">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={obatTerendah} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-10} height={70} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="stok" name="Stok" fill={COLORS.rose} radius={[8, 8, 0, 0]} />
                  <Bar dataKey="minimal" name="Stok Minimal" fill={COLORS.amber} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Detail Kunjungan (Preview)</h3>
              <p className="mt-1 text-sm text-slate-600">10 data teratas untuk audit cepat</p>
            </div>
          </div>
          <div className="card-body">
            {!kunjunganPreview.length ? (
              <div className="rounded-2xl bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-600 ring-1 ring-slate-200/60">
                Tidak ada data kunjungan pada rentang tanggal ini.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      <th className="py-3 pr-4">Tanggal</th>
                      <th className="py-3 pr-4">Nama Pasien</th>
                      <th className="py-3 pr-4">Pembayaran</th>
                      <th className="py-3 pr-4">Keluhan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {kunjunganPreview.map((k: any, idx: number) => {
                      const status = String(k.pasien?.statusPembayaran ?? '').toLowerCase();
                      const pembayaranClass =
                        status === 'bpjs'
                          ? 'bg-sky-50 text-sky-700 ring-sky-100'
                          : 'bg-brand-50 text-brand-800 ring-brand-100';

                      return (
                        <tr key={k.idKunjungan ?? k.id ?? idx} className="text-slate-700">
                          <td className="py-3 pr-4 font-semibold">{String(k.tanggalKunjungan ?? '-')}</td>
                          <td className="py-3 pr-4">{String(k.pasien?.namaLengkap ?? k.pasien?.nama ?? '-')}</td>
                          <td className="py-3 pr-4">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${pembayaranClass}`}>
                              {String(k.pasien?.statusPembayaran ?? '-').toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-slate-600">{String(k.keluhan ?? '-')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Stok Obat (Ringkas)</h3>
              <p className="mt-1 text-sm text-slate-600">Fokus pada obat stok rendah/habis</p>
            </div>
          </div>
          <div className="card-body">
            {!laporanObat?.data?.length ? (
              <div className="rounded-2xl bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-600 ring-1 ring-slate-200/60">
                Belum ada data obat.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      <th className="py-3 pr-4">Obat</th>
                      <th className="py-3 pr-4">Stok</th>
                      <th className="py-3 pr-4">Minimal</th>
                      <th className="py-3 pr-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {laporanObat.data
                      .filter((o) => (o.stok ?? 0) <= (o.stokMinimal ?? 0) || (o.stok ?? 0) === 0)
                      .slice(0, 10)
                      .map((o, idx) => {
                        const stok = o.stok ?? 0;
                        const min = o.stokMinimal ?? 0;
                        const status = stok === 0 ? 'Habis' : stok <= min ? 'Rendah' : 'Aman';
                        const pill =
                          status === 'Habis'
                            ? 'bg-rose-50 text-rose-700 ring-rose-100'
                            : status === 'Rendah'
                              ? 'bg-amber-50 text-amber-800 ring-amber-100'
                              : 'bg-emerald-50 text-emerald-700 ring-emerald-100';

                        return (
                          <tr key={o.idObat ?? o.kodeObat ?? idx} className="text-slate-700">
                            <td className="py-3 pr-4 font-semibold">{o.namaObat}</td>
                            <td className="py-3 pr-4">{stok}</td>
                            <td className="py-3 pr-4">{min}</td>
                            <td className="py-3 pr-4">
                              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${pill}`}>{status}</span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
