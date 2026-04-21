import { useState } from 'react'
import {
  LayoutDashboard,
  PiggyBank,
  CreditCard,
  FolderKanban,
  GraduationCap,
  Brain,
  ClipboardCheck,
  FileBarChart,
  Search,
  Bell,
  Settings,
  ChevronDown,
} from 'lucide-react'

import DashboardModule from './modules/DashboardModule'
import AhorroModule from './modules/AhorroModule'
import CreditoModule from './modules/CreditoModule'
import ProyectosModule from './modules/ProyectosModule'
import CapacitacionesModule from './modules/CapacitacionesModule'
import AnalisisModule from './modules/AnalisisModule'
import EvaluacionesModule from './modules/EvaluacionesModule'
import ReportesModule from './modules/ReportesModule'

import DashboardGerencia from './dashboards/DashboardGerencia'
import DashboardEmpresasBancos from './dashboards/DashboardEmpresasBancos'
import DashboardUsuarios from './dashboards/DashboardUsuarios'

const NAV_ITEMS = [
  { id: 'dashboard',      label: 'Dashboard',       icon: LayoutDashboard },
  { id: 'ahorro',         label: 'Ahorro ACAP',     icon: PiggyBank       },
  { id: 'credito',        label: 'Crédito',         icon: CreditCard      },
  { id: 'proyectos',      label: 'Proyectos',       icon: FolderKanban    },
  { id: 'capacitaciones', label: 'Capacitaciones',  icon: GraduationCap   },
  { id: 'analisis',       label: 'Análisis IA',     icon: Brain           },
  { id: 'evaluaciones',   label: 'Evaluaciones',    icon: ClipboardCheck  },
  { id: 'reportes',       label: 'Reportes',        icon: FileBarChart    },
]

const MODULE_TITLES = {
  dashboard:      'Dashboard',
  ahorro:         'Ahorro ACAP',
  credito:        'Crédito',
  proyectos:      'Proyectos',
  capacitaciones: 'Capacitaciones',
  analisis:       'Análisis IA',
  evaluaciones:   'Evaluaciones',
  reportes:       'Reportes',
}

const ROLE_LABELS = {
  gerencia: 'Gerencia',
  empresa:  'Empresa / Banco',
  usuario:  'Miembro ACAP',
}

function renderModule(activeModule, setActiveModule, userRole) {
  const sharedProps = { activeModule, setActiveModule }

  if (activeModule === 'dashboard') {
    if (userRole === 'gerencia') return <DashboardGerencia {...sharedProps} />
    if (userRole === 'empresa')  return <DashboardEmpresasBancos {...sharedProps} />
    if (userRole === 'usuario')  return <DashboardUsuarios {...sharedProps} />
    return <DashboardGerencia {...sharedProps} />
  }

  switch (activeModule) {
    case 'ahorro':         return <AhorroModule         {...sharedProps} />
    case 'credito':        return <CreditoModule        {...sharedProps} />
    case 'proyectos':      return <ProyectosModule      {...sharedProps} />
    case 'capacitaciones': return <CapacitacionesModule {...sharedProps} />
    case 'analisis':       return <AnalisisModule       {...sharedProps} />
    case 'evaluaciones':   return <EvaluacionesModule   {...sharedProps} />
    case 'reportes':       return <ReportesModule       {...sharedProps} />
    default:               return <DashboardGerencia    {...sharedProps} />
  }
}

export default function Platform({ userRole = 'usuario' }) {
  const [activeModule, setActiveModule]           = useState('dashboard')
  const [notifications, setNotifications]         = useState(2)
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F8FAFC', color: '#1E293B' }}>

      {/* ── SIDEBAR ─────────────────────────────────────────────── */}
      <aside
        className="fixed left-0 top-0 h-screen w-60 flex flex-col z-30"
        style={{ backgroundColor: '#1a3c6e' }}
      >
        {/* Logo area */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div
            className="flex items-center justify-center rounded-full w-9 h-9 shrink-0 font-bold text-white text-lg select-none"
            style={{ backgroundColor: '#F97316' }}
          >
            C
          </div>
          <span className="text-white font-semibold text-base leading-tight tracking-wide">
            Cred<span style={{ color: '#F97316' }} className="font-bold">impacto</span>
          </span>
        </div>

        {/* Rol badge */}
        <div className="px-4 pt-3 pb-1">
          <span className="text-xs text-white/40 uppercase tracking-wider">Vista:</span>
          <p className="text-white/80 text-xs font-semibold mt-0.5">{ROLE_LABELS[userRole] || 'Plataforma'}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeModule === id
            return (
              <button
                key={id}
                onClick={() => setActiveModule(id)}
                className={[
                  'w-full flex items-center gap-3 px-3 rounded-lg mb-0.5 cursor-pointer transition-all duration-150 text-left',
                  'min-h-[44px]',
                  isActive
                    ? 'bg-white border-l-2 border-[#F97316]'
                    : 'bg-transparent border-l-2 border-transparent hover:bg-white/10',
                ].join(' ')}
                style={isActive ? { color: '#1a3c6e' } : { color: 'rgba(255,255,255,0.7)' }}
              >
                <Icon
                  size={18}
                  className="shrink-0"
                  style={isActive ? { color: '#F97316' } : {}}
                  aria-hidden="true"
                />
                <span className={`text-sm font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {label}
                </span>
              </button>
            )
          })}
        </nav>

        {/* Bottom user area */}
        <div className="border-t border-white/10 px-4 py-4 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-white text-sm select-none"
            style={{ backgroundColor: '#0891B2' }}
          >
            MG
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate leading-tight">
              María González
            </p>
            <p className="text-white/50 text-xs truncate leading-tight">Directora</p>
          </div>
          <button
            className="text-white/50 hover:text-white transition-colors duration-150 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/10"
            title="Configuración"
            aria-label="Configuración"
          >
            <Settings size={16} aria-hidden="true" />
          </button>
        </div>
      </aside>

      {/* ── TOPBAR ──────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-60 right-0 h-16 bg-white border-b border-slate-200 shadow-sm flex items-center px-6 gap-4 z-20"
      >
        <h1 className="text-base font-semibold flex-1 truncate" style={{ color: '#1E293B' }}>
          {MODULE_TITLES[activeModule]}
        </h1>

        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors duration-150 cursor-pointer text-sm font-medium min-h-[44px]"
          style={{ color: '#1E293B' }}
        >
          Abril 2026
          <ChevronDown size={14} className="text-slate-400" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-1">
          <button
            className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors duration-150 cursor-pointer text-slate-500 hover:text-slate-700"
            title="Buscar"
            aria-label="Buscar"
          >
            <Search size={18} aria-hidden="true" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors duration-150 cursor-pointer text-slate-500 hover:text-slate-700"
              title="Notificaciones"
              aria-label={`Notificaciones${notifications > 0 ? `, ${notifications} sin leer` : ''}`}
            >
              <Bell size={18} aria-hidden="true" />
              {notifications > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 min-w-[16px] h-4 flex items-center justify-center rounded-full text-[10px] font-bold text-white px-0.5"
                  style={{ backgroundColor: '#EF4444' }}
                  aria-hidden="true"
                >
                  {notifications}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-72 bg-white rounded-xl border border-slate-200 shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: '#1E293B' }}>
                    Alertas prioritarias
                  </span>
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: '#EF4444' }}
                  >
                    {notifications}
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors duration-150">
                    <p className="text-sm font-medium" style={{ color: '#1E293B' }}>
                      Revisión de crédito pendiente
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Hace 2 horas</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors duration-150">
                    <p className="text-sm font-medium" style={{ color: '#1E293B' }}>
                      Evaluación vencida — Proyecto Alpha
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Hace 5 horas</p>
                  </div>
                </div>
                <div className="px-4 py-2.5 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setNotifications(0)
                      setShowNotifications(false)
                    }}
                    className="text-xs font-medium cursor-pointer hover:underline transition-colors duration-150"
                    style={{ color: '#0891B2' }}
                  >
                    Marcar todas como leídas
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="ml-2 pl-3 border-l border-slate-200 flex items-center min-h-[44px]">
            <span className="text-sm font-medium" style={{ color: '#1E293B' }}>
              Hola,{' '}
              <span className="font-semibold" style={{ color: '#1a3c6e' }}>
                María
              </span>
            </span>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ────────────────────────────────────────── */}
      <main className="ml-60 pt-16 min-h-screen w-full" style={{ backgroundColor: '#F8FAFC' }}>
        {showNotifications && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowNotifications(false)}
          />
        )}

        <div key={`${activeModule}-${userRole}`}>
          {renderModule(activeModule, setActiveModule, userRole)}
        </div>
      </main>

    </div>
  )
}
