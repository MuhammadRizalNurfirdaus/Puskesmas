import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="app-shell">
      <div className="flex min-h-screen">
        <Navbar />

        <div className="flex-1">
          <header className="sticky top-0 z-10 border-b border-slate-200/60 bg-white/85 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
              <div>
                <p className="text-xs font-semibold tracking-wide text-slate-500">Sistem Informasi</p>
                <h2 className="text-lg font-extrabold text-slate-900">Puskesmas</h2>
              </div>
              <div className="hidden sm:flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-2 ring-1 ring-slate-200/60">
                <span className="h-2 w-2 rounded-full bg-brand-500" />
                <span className="text-sm font-semibold text-slate-700">Layanan siap digunakan</span>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-7xl px-6 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
