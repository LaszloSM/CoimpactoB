import { useState, useEffect, useMemo } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Info, XCircle, Loader2 } from 'lucide-react'
import { acaps, credits, members, trainings, monthlyTrends, aiAlerts, zones } from '../../data/mockData'

// ── helpers ──────────────────────────────────────────────────────────
function fmt(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)    return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

function cellColor(value, thresholds, invert = false) {
  const [good, warn] = thresholds
  const isGood = invert ? value <= good : value >= good
  const isWarn = invert ? value <= warn : value >= warn
  if (isGood) return 'bg-green-100 text-green-800'
  if (isWarn) return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
}

const PRIORITY_COLORS = {
  alta:  { badge: 'bg-red-100 text-red-700 border border-red-200',   dot: '#EF4444' },
  media: { badge: 'bg-amber-100 text-amber-700 border border-amber-200', dot: '#F59E0B' },
  baja:  { badge: 'bg-blue-100 text-blue-700 border border-blue-200',  dot: '#0891B2' },
}

const ALERT_ICONS = {
  success: <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />,
  info:    <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />,
  danger:  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
}

// ── projected months ─────────────────────────────────────────────────
const MONTHS_PROJ = ['May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct']
const lastSavings  = monthlyTrends[monthlyTrends.length - 1].savings
const projected = MONTHS_PROJ.map((month, i) => ({
  month,
  actual:    null,
  proyectado: Math.round(lastSavings * Math.pow(1.05, i + 1)),
  projected: true,
}))
const areaData = [
  ...monthlyTrends.map(m => ({ month: m.month, actual: m.savings, proyectado: null, projected: false })),
  ...projected,
]

// ── zone savings bar data ─────────────────────────────────────────────
function buildZoneData() {
  const map = {}
  acaps.forEach(a => {
    if (!map[a.zoneId]) map[a.zoneId] = 0
    map[a.zoneId] += a.totalSaved
  })
  return zones.map(z => ({
    zone: z.name.replace('Zona ', ''),
    actual:    map[z.id] || 0,
    potencial: Math.round((map[z.id] || 0) * 1.2),
  }))
}
const zoneData = buildZoneData()

// ── risk heatmap data ─────────────────────────────────────────────────
function buildRiskData() {
  const moraCounts = {}
  credits.forEach(c => { if (c.status === 'En mora') moraCounts[c.zoneId] = (moraCounts[c.zoneId] || 0) + 1 })
  const totalByZone = {}
  credits.forEach(c => { totalByZone[c.zoneId] = (totalByZone[c.zoneId] || 0) + 1 })

  // avg paymentCompliance by zone
  const compMap = {}; const compCount = {}
  members.forEach(m => {
    compMap[m.zoneId]   = (compMap[m.zoneId] || 0) + m.paymentCompliance
    compCount[m.zoneId] = (compCount[m.zoneId] || 0) + 1
  })

  // avg attendance from trainings (use acap cycleAchieved as proxy for attendance)
  const attMap = {}; const attCount = {}
  acaps.forEach(a => {
    attMap[a.zoneId]   = (attMap[a.zoneId] || 0) + a.cycleAchieved
    attCount[a.zoneId] = (attCount[a.zoneId] || 0) + 1
  })

  return zones.map(z => {
    const moraCount = moraCounts[z.id] || 0
    const total     = totalByZone[z.id] || 1
    const moraPct   = Math.round((moraCount / total) * 100)
    const cumpl     = Math.round((compMap[z.id] || 0) / (compCount[z.id] || 1))
    const asist     = Math.round((attMap[z.id] || 0) / (attCount[z.id] || 1))
    const score     = Math.round((cumpl + asist) / 2)
    return { zone: z.name, moraPct, cumpl, asist, score }
  })
}
const riskData = buildRiskData()

// ── extra AI recs ─────────────────────────────────────────────────────
const extraRecs = [
  {
    id: 101, type: 'success', priority: 'alta',
    title: 'Expansión Zona Norte',
    message: 'Zona Norte: crecimiento del 23% en ahorro. Crear 2 nuevas ACAP para capitalizar el impulso.',
    action: 'Iniciar expansión',
    metric: '+23% ahorro trimestral',
  },
  {
    id: 102, type: 'warning', priority: 'media',
    title: 'Baja cobertura formativa',
    message: 'Módulo Educación Financiera: baja cobertura en Zona Sur (34%). Programar capacitación urgente.',
    action: 'Agendar sesión',
    metric: '34% cobertura Zona Sur',
  },
]
const allRecs = [
  ...aiAlerts.map(a => ({ ...a, metric: a.acapId || a.zoneId || 'General' })),
  ...extraRecs,
].slice(0, 6)

// ─────────────────────────────────────────────────────────────────────
export default function AnalisisModule() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#8B5CF6' }}>
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#1a3c6e]">Análisis e Inteligencia Artificial</h1>
          <p className="text-xs text-gray-500">Motor predictivo sobre el Data Lake de Credimpacto</p>
        </div>
      </div>

      {/* AI banner */}
      <div className={`rounded-xl border px-5 py-4 flex items-center gap-3 transition-all ${loading ? 'bg-purple-50 border-purple-200' : 'bg-green-50 border-green-200'}`}>
        {loading
          ? <Loader2 className="w-5 h-5 text-purple-600 animate-spin flex-shrink-0" />
          : <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
        }
        <div>
          <p className="text-sm font-semibold" style={{ color: loading ? '#7C3AED' : '#16A34A' }}>
            {loading ? 'Agentes de IA procesando datos del Data Lake…' : 'Análisis completado — resultados listos'}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {loading ? 'Por favor espere mientras se generan predicciones y alertas.' : 'Datos procesados al 7 de abril 2026. Próxima actualización: 14 abr.'}
          </p>
        </div>
      </div>

      {!loading && (
        <>
          {/* Section 1: Predicciones */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1a3c6e] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#F97316]" /> Predicciones
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Area chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-[#1a3c6e] mb-1">Proyección de Ahorro (próximos 6 meses)</h3>
                <p className="text-xs text-gray-400 mb-4">Crecimiento proyectado al 5% mensual desde abril 2026</p>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={areaData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#F97316" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#F97316" stopOpacity={0}   />
                      </linearGradient>
                      <linearGradient id="gradProj" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#1a3c6e" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#1a3c6e" stopOpacity={0}   />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={v => v ? `$${(v/1e6).toFixed(0)}M` : ''} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={v => v ? [`$${(v/1e6).toFixed(2)}M`, ''] : ['-', '']} />
                    <ReferenceLine x="Abr" stroke="#F97316" strokeDasharray="4 2" label={{ value: 'Hoy', fontSize: 10, fill: '#F97316' }} />
                    <Area type="monotone" dataKey="actual"     stroke="#F97316" fill="url(#gradActual)" strokeWidth={2} name="Real" connectNulls={false} />
                    <Area type="monotone" dataKey="proyectado" stroke="#1a3c6e" fill="url(#gradProj)"  strokeWidth={2} strokeDasharray="5 3" name="Proyectado" connectNulls={false} />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Zone bar chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-[#1a3c6e] mb-1">Potencial de Crecimiento por Zona</h3>
                <p className="text-xs text-gray-400 mb-4">Ahorro actual vs. potencial +20%</p>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={zoneData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="zone" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={v => `$${(v/1e6).toFixed(1)}M`} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={v => [`$${(v/1e6).toFixed(2)}M`, '']} />
                    <Legend />
                    <Bar dataKey="actual"    name="Ahorro actual"   fill="#1a3c6e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="potencial" name="Potencial +20%"  fill="#F97316" fillOpacity={0.5} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Section 2: Risk heatmap */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1a3c6e] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#EF4444]" /> Análisis de Riesgo
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 overflow-x-auto">
              <h3 className="text-sm font-semibold text-[#1a3c6e] mb-4">Riesgo por Zona</h3>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Zona</th>
                    <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Tasa Morosidad %</th>
                    <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Cumplimiento Meta</th>
                    <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Asistencia Capacit.</th>
                    <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Score Promedio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {riskData.map(r => (
                    <tr key={r.zone} className="hover:bg-gray-50">
                      <td className="py-3 px-3 font-medium text-gray-800 whitespace-nowrap">{r.zone}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cellColor(r.moraPct, [5, 10], true)}`}>
                          {r.moraPct}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cellColor(r.cumpl, [90, 75])}`}>
                          {r.cumpl}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cellColor(r.asist, [95, 88])}`}>
                          {r.asist}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cellColor(r.score, [85, 70])}`}>
                          {r.score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-200 inline-block" /> Bueno</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-200 inline-block" /> Alerta</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-200 inline-block" /> Crítico</span>
              </div>
            </div>
          </section>

          {/* Section 3: AI Recommendations */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1a3c6e] flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-500" /> Recomendaciones IA
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {allRecs.map(rec => {
                const pc = PRIORITY_COLORS[rec.priority] || PRIORITY_COLORS.baja
                return (
                  <div key={rec.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {ALERT_ICONS[rec.type]}
                        <span className="text-sm font-semibold text-gray-800">{rec.title}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 flex items-center gap-1 ${pc.badge}`}>
                        <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ backgroundColor: pc.dot }} />
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed flex-1">{rec.message}</p>
                    {rec.metric && (
                      <p className="text-xs text-gray-400 italic">{rec.metric}</p>
                    )}
                    <button
                      className="self-start text-xs px-3 py-1.5 rounded-lg font-medium text-white transition-opacity hover:opacity-80"
                      style={{ backgroundColor: '#1a3c6e' }}
                      onClick={() => {}}
                    >
                      {rec.action || 'Ver detalles'}
                    </button>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Section 4: KPIs proyectados */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1a3c6e]">KPIs Proyectados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: '3 meses', color: '#0891B2',
                  items: [
                    { metric: 'Ahorro proyectado',  value: '+15%',   icon: '↑' },
                    { metric: 'Nuevos créditos',     value: '+3',     icon: '+' },
                    { metric: 'Morosidad objetivo',  value: '8%',     icon: '▼' },
                  ],
                },
                {
                  label: '6 meses', color: '#F97316',
                  items: [
                    { metric: 'Ahorro proyectado',  value: '+32%',   icon: '↑' },
                    { metric: 'Nuevos créditos',     value: '+8',     icon: '+' },
                    { metric: 'Morosidad objetivo',  value: '6%',     icon: '▼' },
                  ],
                },
                {
                  label: '12 meses', color: '#16A34A',
                  items: [
                    { metric: 'Ahorro proyectado',  value: '+68%',   icon: '↑' },
                    { metric: 'Nuevos créditos',     value: '+18',    icon: '+' },
                    { metric: 'Morosidad objetivo',  value: '4%',     icon: '▼' },
                  ],
                },
              ].map(col => (
                <div key={col.label} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-5 py-3 text-white text-sm font-semibold" style={{ backgroundColor: col.color }}>
                    Horizonte {col.label}
                  </div>
                  <div className="p-5 space-y-3">
                    {col.items.map(item => (
                      <div key={item.metric} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.metric}</span>
                        <span className="text-base font-bold" style={{ color: col.color }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
