import { useState } from 'react'
import DashboardPitch from './DashboardPitch'
import Platform from './components/Platform'

export default function App() {
  const [view, setView]         = useState('pitch')
  const [userRole, setUserRole] = useState('usuario')

  return (
    <>
      {/* Toggle principal Pitch / Plataforma */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-1 bg-[#1a3c6e] rounded-full shadow-2xl shadow-navy/40 p-1.5 border border-white/10">
        <button
          onClick={() => setView('pitch')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
            view === 'pitch'
              ? 'bg-[#F97316] text-white shadow-md'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          Presentación
        </button>
        <button
          onClick={() => setView('platform')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
            view === 'platform'
              ? 'bg-[#F97316] text-white shadow-md'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          Plataforma
        </button>
      </div>

      {/* Selector de rol — visible solo en la plataforma */}
      {view === 'platform' && (
        <div className="fixed top-4 right-4 z-[9998] bg-white rounded-xl shadow-lg px-4 py-3 border border-slate-200">
          <label htmlFor="role-select" className="text-xs font-semibold text-slate-500 block mb-1.5 uppercase tracking-wide">
            Vista · Rol
          </label>
          <select
            id="role-select"
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            className="text-sm px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#F97316] bg-slate-50 cursor-pointer"
          >
            <option value="usuario">Usuario (ACAP)</option>
            <option value="gerencia">Gerencia</option>
            <option value="empresa">Empresa / Banco</option>
          </select>
        </div>
      )}

      {/* Vistas */}
      {view === 'pitch' ? <DashboardPitch /> : <Platform userRole={userRole} />}
    </>
  )
}
