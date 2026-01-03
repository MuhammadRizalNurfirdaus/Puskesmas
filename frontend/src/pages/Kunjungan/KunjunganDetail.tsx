import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Kunjungan } from '../../types';

export default function KunjunganDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [kunjungan, setKunjungan] = useState<Kunjungan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchKunjunganDetail();
    }
  }, [id]);

  const fetchKunjunganDetail = async () => {
    try {
      const response = await api.get(`/kunjungan/${id}`);
      console.log('Kunjungan data:', response.data);
      // Backend returns data directly, not wrapped in { data: ... }
      setKunjungan(response.data);
    } catch (error: any) {
      console.error('Error fetching kunjungan:', error);
      if (error.response?.status === 404) {
        alert('Kunjungan tidak ditemukan');
      } else {
        alert('Gagal memuat data kunjungan');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      terdaftar: 'bg-brand-100 text-brand-800 border-brand-200',
      pemeriksaan: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      farmasi: 'bg-purple-100 text-purple-800 border-purple-300',
      selesai: 'bg-green-100 text-green-800 border-green-300',
      batal: 'bg-red-100 text-red-800 border-red-300'
    };
    return badges[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!kunjungan) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Data kunjungan tidak ditemukan</p>
        <button onClick={() => navigate('/kunjungan')} className="btn btn-primary mt-4">
          Kembali ke Daftar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-700 to-brand-900 rounded-2xl shadow-sm ring-1 ring-black/5 p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Detail Kunjungan
            </h1>
            <p className="text-white/80 mt-2 text-lg">No. Kunjungan: {kunjungan.noKunjungan}</p>
          </div>
          <button
            onClick={() => navigate('/kunjungan')}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-brand-800 shadow-sm ring-1 ring-black/5 transition hover:bg-white/90"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </button>
        </div>
      </div>

      {/* Info Kunjungan */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Informasi Kunjungan
          </h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">No. Kunjungan</label>
              <p className="text-lg font-bold text-gray-900">{kunjungan.noKunjungan}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Status</label>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border ${getStatusBadge(kunjungan.status)}`}>
                {kunjungan.status.toUpperCase()}
              </span>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Tanggal Kunjungan</label>
              <p className="text-lg font-semibold text-gray-900">{new Date(kunjungan.tanggalKunjungan).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Jam Kunjungan</label>
              <p className="text-lg font-semibold text-gray-900">{kunjungan.jamKunjungan}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Jenis Kunjungan</label>
              <p className="text-lg font-semibold text-gray-900 capitalize">{kunjungan.jenisKunjungan.replace('_', ' ')}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Petugas Pendaftaran</label>
              <p className="text-lg font-semibold text-gray-900">{kunjungan.petugasPendaftaran?.namaLengkap || '-'}</p>
            </div>
          </div>

          {kunjungan.keluhan && (
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Keluhan</label>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-gray-900">{kunjungan.keluhan}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Pasien */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Informasi Pasien
          </h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">No. Rekam Medis</label>
              <p className="text-lg font-bold text-gray-900">{kunjungan.pasien.noRekamMedis}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">NIK</label>
              <p className="text-lg font-semibold text-gray-900">{kunjungan.pasien.nik}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Nama Lengkap</label>
              <p className="text-lg font-semibold text-gray-900">{kunjungan.pasien.namaLengkap}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Tanggal Lahir</label>
              <p className="text-lg font-semibold text-gray-900">{new Date(kunjungan.pasien.tanggalLahir).toLocaleDateString('id-ID')}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Jenis Kelamin</label>
              <p className="text-lg font-semibold text-gray-900">{kunjungan.pasien.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">No. Telepon</label>
              <p className="text-lg font-semibold text-gray-900">{kunjungan.pasien.noTelp}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-600 mb-1">Alamat</label>
              <p className="text-lg font-semibold text-gray-900">{kunjungan.pasien.alamat}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rekam Medis */}
      {kunjungan.rekamMedis ? (
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Rekam Medis
            </h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Dokter Pemeriksa</label>
                <p className="text-lg font-semibold text-gray-900">{kunjungan.rekamMedis.dokter?.namaLengkap || '-'}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {kunjungan.rekamMedis.tekananDarah && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <label className="block text-xs font-semibold text-blue-700 mb-1">Tekanan Darah</label>
                    <p className="text-lg font-bold text-blue-900">{kunjungan.rekamMedis.tekananDarah}</p>
                  </div>
                )}
                {kunjungan.rekamMedis.beratBadan && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <label className="block text-xs font-semibold text-green-700 mb-1">Berat Badan</label>
                    <p className="text-lg font-bold text-green-900">{kunjungan.rekamMedis.beratBadan} kg</p>
                  </div>
                )}
                {kunjungan.rekamMedis.tinggiBadan && (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <label className="block text-xs font-semibold text-purple-700 mb-1">Tinggi Badan</label>
                    <p className="text-lg font-bold text-purple-900">{kunjungan.rekamMedis.tinggiBadan} cm</p>
                  </div>
                )}
                {kunjungan.rekamMedis.suhuTubuh && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <label className="block text-xs font-semibold text-orange-700 mb-1">Suhu Tubuh</label>
                    <p className="text-lg font-bold text-orange-900">{kunjungan.rekamMedis.suhuTubuh}°C</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Anamnesa</label>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{kunjungan.rekamMedis.anamnesa}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Pemeriksaan Fisik</label>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{kunjungan.rekamMedis.pemeriksaanFisik}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Diagnosis</label>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-gray-900 font-semibold">{kunjungan.rekamMedis.diagnosis}</p>
                </div>
              </div>

              {kunjungan.rekamMedis.tindakan && (
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Tindakan</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">{kunjungan.rekamMedis.tindakan}</p>
                  </div>
                </div>
              )}

              {kunjungan.rekamMedis.catatan && (
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Catatan</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">{kunjungan.rekamMedis.catatan}</p>
                  </div>
                </div>
              )}

              {kunjungan.rekamMedis.resep && kunjungan.rekamMedis.resep.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Resep Obat
                  </h3>
                  <div className="space-y-3">
                    {kunjungan.rekamMedis.resep.map((resep) => (
                      <div
                        key={resep.idResep}
                        className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-bold text-gray-900 text-lg">{resep.noResep}</p>
                            <p className="text-sm text-gray-500">
                              Tanggal: {new Date(resep.tanggalResep).toLocaleDateString('id-ID')}
                            </p>
                            {resep.tanggalDilayani && (
                              <p className="text-sm text-gray-500">
                                Dilayani: {new Date(resep.tanggalDilayani).toLocaleDateString('id-ID')}
                              </p>
                            )}
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${resep.status === 'selesai' ? 'bg-green-100 text-green-800' :
                              resep.status === 'diproses' ? 'bg-blue-100 text-blue-800' :
                                resep.status === 'batal' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                            }`}>
                            {resep.status.toUpperCase()}
                          </span>
                        </div>

                        {resep.detail && resep.detail.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-700">Daftar Obat:</p>
                            {resep.detail.map((detail) => (
                              <div key={detail.idResepDetail} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{detail.obat.namaObat}</p>
                                    <p className="text-sm text-gray-600">Jumlah: {detail.jumlah} {detail.obat.satuan}</p>
                                    <p className="text-sm text-brand-600 font-medium mt-1">{detail.aturanPakai}</p>
                                    {detail.keterangan && (
                                      <p className="text-xs text-gray-500 mt-1">Keterangan: {detail.keterangan}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {resep.catatan && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Catatan:</span> {resep.catatan}
                            </p>
                          </div>
                        )}

                        {resep.apoteker && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Apoteker:</span> {resep.apoteker.namaLengkap}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Rekam Medis
            </h2>
          </div>
          <div className="card-body">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 text-lg font-medium mb-2">Belum ada rekam medis</p>
              <p className="text-gray-400 text-sm">Pasien belum diperiksa oleh dokter</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
