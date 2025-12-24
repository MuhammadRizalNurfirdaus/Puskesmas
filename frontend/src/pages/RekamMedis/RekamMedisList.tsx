// Placeholder - implementasi lengkap tersedia

export default function RekamMedisList() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-brand-700 to-brand-900 rounded-2xl shadow-sm ring-1 ring-black/5 p-8 text-white">
        <h1 className="text-3xl font-extrabold">Rekam Medis</h1>
        <p className="mt-2 text-white/80">Gunakan menu Kunjungan untuk membuat rekam medis dari kunjungan pasien.</p>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 ring-1 ring-brand-100">
              <svg className="h-6 w-6 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-slate-900">Cara membuat Rekam Medis</p>
              <p className="mt-1 text-sm text-slate-600">Buka menu Kunjungan, lalu klik tombol Periksa untuk kunjungan yang statusnya terdaftar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
