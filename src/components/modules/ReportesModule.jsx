import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts'
import {
  FileText, BarChart2, Users, BookOpen, TrendingUp, Star,
  Download, Eye, RefreshCw, ToggleLeft, ToggleRight, Clock
} from 'lucide-react'
import { acaps, members, projects, trainings, credits, monthlyTrends, portfolioSummary } from '../../data/mockData'

// ── helpers ──────────────────────────────────────────────────────────
function fmt(n) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
}

let _toastEl = null
let _toastTimeout = null
function showToast(msg) {
  if (!_toastEl) {
    _toastEl = document.createElement('div')
    _toastEl.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#1a3c6e;color:#fff;padding:12px 20px;border-radius:10px;font-size:14px;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.25);transition:opacity .3s'
    document.body.appendChild(_toastEl)
  }
  _toastEl.textContent = msg
  _toastEl.style.opacity = '1'
  clearTimeout(_toastTimeout)
  _toastTimeout = setTimeout(() => { _toastEl.style.opacity = '0' }, 2600)
}

// ── report definitions ───────────────────────────────────────────────
const REPORTS = [
  {
    id: 'general',
    icon: <FileText className="w-6 h-6" />,
    title: 'Estado General',
    description: 'Resumen completo de ahorro, crédito y desempeño de todas las ACAP.',
    formats: ['PDF', 'Excel'],
    color: '#1a3c6e',
  },
  {
    id: 'cartera',
    icon: <BarChart2 className="w-6 h-6" />,
    title: 'Análisis de Cartera',
    description: 'Descomposición de cartera por zona, ACAP y período con indicadores de mora.',
    formats: ['PDF', 'Excel', 'CSV'],
    color: '#F97316',
  },
  {
    id: 'social',
    icon: <Users className="w-6 h-6" />,
    title: 'Impacto Social',
    description: 'Empleos generados, ingresos estimados y evolución de membresías activas.',
    formats: ['PDF', 'Excel'],
    color: '#16A34A',
  },
  {
    id: 'capacitaciones',
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Desempeño Capacitaciones',
    description: 'Asistencia, calificaciones promedio y cobertura por ACAP y categoría.',
    formats: ['PDF', 'CSV'],
    color: '#0891B2',
  },
  {
    id: 'proyecciones',
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Proyecciones Financieras',
    description: 'Pronósticos de ahorro y crédito a 3, 6 y 12 meses con modelos predictivos.',
    formats: ['PDF', 'Excel'],
    color: '#8B5CF6',
  },
  {
    id: 'ejecutivo',
    icon: <Star className="w-6 h-6" />,
    title: 'Reporte Ejecutivo',
    description: 'KPIs principales resumidos para directivos y junta directiva de Credimpacto.',
    formats: ['PDF'],
    color: '#F59E0B',
  },
]

// ── mini charts per report ────────────────────────────────────────────
const PIE_COLORS = ['#16A34A', '#94a3b8', '#EF4444', '#F97316', '#0891B2', '#8B5CF6', '#F59E0B']

function MiniChart({ reportId }) {
  const totalEmpleos = projects.reduce((s, p) => s + p.estimatedJobs, 0)
  const activeMembers = members.filter(m => m.status === 'Activo').length
  const totalAttend   = trainings.reduce((s, t) => s + t.attendees, 0)

  if (reportId === 'general') {
    return (
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={monthlyTrends} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 10 }} />
          <YAxis tickFormatter={v => `$${(v/1e6).toFixed(0)}M`} tick={{ fontSize: 10 }} />
          <Tooltip formatter={v => [`$${(v/1e6).toFixed(2)}M`, '']} />
          <Area type="monotone" dataKey="savings" stroke="#1a3c6e" fill="#1a3c6e22" name="Ahorro" />
          <Area type="monotone" dataKey="credits"  stroke="#F97316" fill="#F9731622" name="Crédito" />
          <Legend />
        </AreaChart>
      </ResponsiveContainer>
    )
  }
  if (reportId === 'cartera') {
    const zoneData = ['Z1','Z2','Z3','Z4','Z5'].map(z => {
      const zCredit = credits.filter(c => c.zoneId === z)
      const mora    = zCredit.filter(c => c.status === 'En mora').length
      return { zone: z.replace('Z','Zona '), mora, total: zCredit.length }
    })
    return (
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={zoneData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="zone" tick={{ fontSize: 10 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
          <Tooltip />
          <Bar dataKey="total" name="Créditos" fill="#F97316" radius={[3,3,0,0]} />
          <Bar dataKey="mora"  name="En mora"  fill="#EF4444" radius={[3,3,0,0]} />
          <Legend />
        </BarChart>
      </ResponsiveContainer>
    )
  }
  if (reportId === 'social') {
    const catData = {}
    projects.forEach(p => { catData[p.category] = (catData[p.category] || 0) + p.estimatedJobs })
    const pd = Object.entries(catData).map(([name, value]) => ({ name, value }))
    return (
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie data={pd} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} label={({ name, value }) => `${value}`}>
            {pd.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend iconSize={10} wrapperStyle={{ fontSize: 10 }} />
        </PieChart>
      </ResponsiveContainer>
    )
  }
  if (reportId === 'capacitaciones') {
    const td = [...trainings].sort((a,b) => b.attendees - a.attendees).slice(0, 6).map(t => ({
      name: t.topic.slice(0, 18) + (t.topic.length > 18 ? '…' : ''),
      asistentes: t.attendees,
    }))
    return (
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={td} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <XAxis type="number" tick={{ fontSize: 10 }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={110} />
          <Tooltip />
          <Bar dataKey="asistentes" fill="#0891B2" radius={[0,3,3,0]} />
        </BarChart>
      </ResponsiveContainer>
    )
  }
  if (reportId === 'proyecciones') {
    const lastSavings = monthlyTrends[monthlyTrends.length - 1].savings
    const projData = ['May','Jun','Jul','Ago','Sep','Oct'].map((month, i) => ({
      month,
      proyectado: Math.round(lastSavings * Math.pow(1.05, i + 1)),
    }))
    return (
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={[...monthlyTrends.map(m => ({ month: m.month, proyectado: m.savings })), ...projData]} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 10 }} />
          <YAxis tickFormatter={v => `$${(v/1e6).toFixed(0)}M`} tick={{ fontSize: 10 }} />
          <Tooltip formatter={v => [`$${(v/1e6).toFixed(2)}M`, 'Proyectado']} />
          <Line type="monotone" dataKey="proyectado" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    )
  }
  if (reportId === 'ejecutivo') {
    const kpiData = [
      { kpi: 'ACAP activas', valor: acaps.filter(a => a.status === 'Activa').length },
      { kpi: 'Miembros',     valor: activeMembers },
      { kpi: 'Proyectos',    valor: projects.length },
      { kpi: 'Capacitac.',   valor: trainings.length },
    ]
    return (
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={kpiData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="kpi" tick={{ fontSize: 10 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
          <Tooltip />
          <Bar dataKey="valor" fill="#F59E0B" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    )
  }
  return null
}

function PreviewStats({ reportId }) {
  const totalSaved     = acaps.reduce((s, a) => s + a.totalSaved, 0)
  const totalEmpleos   = projects.reduce((s, p) => s + p.estimatedJobs, 0)
  const activeMembers  = members.filter(m => m.status === 'Activo').length
  const totalAttend    = trainings.reduce((s, t) => s + t.attendees, 0)

  const statsByReport = {
    general:       [{ label: 'Ahorro total',      value: fmt(totalSaved) }, { label: 'Créditos activos', value: credits.filter(c => c.status !== 'Pagado').length }, { label: 'ACAP activas', value: acaps.filter(a => a.status === 'Activa').length }],
    cartera:       [{ label: 'Cartera total',      value: fmt(portfolioSummary.totalDisbursed) }, { label: 'Saldo vigente', value: fmt(portfolioSummary.totalBalance) }, { label: 'Tasa mora', value: `${portfolioSummary.overdueRate.toFixed(1)}%` }],
    social:        [{ label: 'Empleos generados',  value: totalEmpleos }, { label: 'Miembros activos', value: activeMembers }, { label: 'Proyectos activos', value: projects.filter(p => p.status === 'En ejecución').length }],
    capacitaciones:[{ label: 'Sesiones',           value: trainings.length }, { label: 'Personas capacitadas', value: totalAttend }, { label: 'Calificación prom.', value: `${(trainings.reduce((s,t) => s+t.avgScore,0)/trainings.length).toFixed(1)}/5` }],
    proyecciones:  [{ label: 'Ahorro proyectado +3m', value: fmt(Math.round(totalSaved * 1.15)) }, { label: '+6m', value: fmt(Math.round(totalSaved * 1.32)) }, { label: '+12m', value: fmt(Math.round(totalSaved * 1.68)) }],
    ejecutivo:     [{ label: 'Total ACAP',          value: acaps.length }, { label: 'Total miembros', value: members.length }, { label: 'Crecimiento trim.', value: `+${portfolioSummary.portfolioGrowth}%` }],
  }

  return (
    <div className="flex gap-4 flex-wrap mt-3">
      {(statsByReport[reportId] || []).map(s => (
        <div key={s.label} className="bg-gray-50 rounded-lg px-4 py-2">
          <p className="text-xs text-gray-400">{s.label}</p>
          <p className="text-sm font-bold text-[#1a3c6e]">{s.value}</p>
        </div>
      ))}
    </div>
  )
}

// ── main component ────────────────────────────────────────────────────
export default function ReportesModule() {
  const [selected,  setSelected]  = useState(null)
  const [scheduled, setScheduled] = useState([
    { id: 1, name: 'Reporte Semanal Cartera',  freq: 'Lunes 8:00 am',          active: true  },
    { id: 2, name: 'Resumen Mensual',           freq: '1ro de cada mes',         active: true  },
    { id: 3, name: 'Alerta Mora',               freq: 'Diario si mora > 5%',     active: true  },
  ])

  function toggleScheduled(id) {
    setScheduled(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
  }

  const selectedReport = REPORTS.find(r => r.id === selected)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F97316' }}>
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#1a3c6e]">Reportes y Exportación</h1>
          <p className="text-xs text-gray-500">Genera, previsualiza y descarga reportes del sistema Credimpacto</p>
        </div>
      </div>

      {/* Report cards + preview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Cards grid */}
        <div className="xl:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REPORTS.map(r => (
              <div
                key={r.id}
                onClick={() => setSelected(r.id === selected ? null : r.id)}
                className={`bg-white rounded-xl shadow-sm border p-5 cursor-pointer transition-all hover:shadow-md ${selected === r.id ? 'border-2' : 'border-gray-100'}`}
                style={selected === r.id ? { borderColor: r.color } : {}}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${r.color}18` }}>
                    <span style={{ color: r.color }}>{r.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">{r.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{r.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {r.formats.map(f => (
                      <span key={f} className="px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">{f}</span>
                    ))}
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); showToast(`Generando ${r.title}…`) }}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium text-white transition-opacity hover:opacity-80"
                    style={{ backgroundColor: r.color }}
                  >
                    <RefreshCw className="w-3 h-3" /> Generar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview panel */}
        <div className="xl:col-span-1">
          {selectedReport ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-4">
              {/* Branding header */}
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
                <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: '#1a3c6e' }}>
                  <span className="text-white text-xs font-bold">CR</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1a3c6e]">CREDIMPACTO</p>
                  <p className="text-xs text-gray-400">Coimpacto B</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: selectedReport.color }}>{selectedReport.icon}</span>
                <h3 className="text-sm font-bold text-gray-800">{selectedReport.title}</h3>
              </div>
              <p className="text-xs text-gray-500 mb-3">{selectedReport.description}</p>

              {/* Stats */}
              <PreviewStats reportId={selectedReport.id} />

              {/* Mini chart */}
              <div className="mt-4">
                <MiniChart reportId={selectedReport.id} />
              </div>

              <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Generado el 8 abril 2026
              </p>

              {/* Download buttons */}
              <div className="flex gap-2 mt-4 flex-wrap">
                {selectedReport.formats.map(f => (
                  <button
                    key={f}
                    onClick={() => showToast(`Descargando ${f}…`)}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors hover:bg-gray-50"
                    style={{ borderColor: selectedReport.color, color: selectedReport.color }}
                  >
                    <Download className="w-3 h-3" /> {f}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border border-gray-200 border-dashed p-8 flex flex-col items-center justify-center text-center h-48">
              <Eye className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">Selecciona un reporte para previsualizar</p>
            </div>
          )}
        </div>
      </div>

      {/* Scheduled reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-[#1a3c6e]" />
          <h2 className="text-sm font-semibold text-[#1a3c6e]">Reportes Programados</h2>
        </div>
        <div className="space-y-3">
          {scheduled.map(s => (
            <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div>
                <p className="text-sm font-medium text-gray-800">{s.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.freq}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                  {s.active ? 'Activo' : 'Inactivo'}
                </span>
                <button
                  onClick={() => toggleScheduled(s.id)}
                  className="transition-colors"
                  title={s.active ? 'Desactivar' : 'Activar'}
                >
                  {s.active
                    ? <ToggleRight className="w-6 h-6 text-green-500" />
                    : <ToggleLeft  className="w-6 h-6 text-gray-400" />
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
