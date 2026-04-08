import { useState } from 'react'
import DashboardPitch from './DashboardPitch'
import Platform from './components/Platform'

export default function App() {
  const [view, setView] = useState('pitch') // 'pitch' | 'platform'

  return (
    <>
      {/* Toggle Bar */}
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

      {/* Views */}
      {view === 'pitch' ? <DashboardPitch /> : <Platform />}
    </>
  )
}
