import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts'
import { BookOpen, Star } from 'lucide-react'
import { acaps, trainings } from '../../data/mockData'

const CAT_COLORS = {
  'Educación financiera': '#0891B2',
  'Liderazgo':            '#8B5CF6',
  'Ventas':               '#16A34A',
  'Emprendimiento':       '#F97316',
  'Técnico':              '#0891B2',
}

const CAT_BADGE = {
  'Educación financiera': 'bg-cyan-100 text-cyan-700',
  'Liderazgo':            'bg-purple-100 text-purple-700',
  'Ventas':               'bg-green-100 text-green-700',
  'Emprendimiento':       'bg-orange-100 text-orange-700',
  'Técnico':              'bg-teal-100 text-teal-700',
}

function StarRating({ score }) {
  const full = Math.floor(score)
  const half = score - full >= 0.5
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          className="w-3.5 h-3.5"
          fill={i <= full ? '#F59E0B' : (i === full + 1 && half ? '#F59E0B' : 'none')}
          stroke="#F59E0B"
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">{score.toFixed(1)}</span>
    </div>
  )
}

function KpiCard({ label, value, sub }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold text-[#1a3c6e]">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function CapacitacionesModule() {
  const [search, setSearch] = useState('')

  // KPIs
  const totalCap    = trainings.length
  const totalAttend = trainings.reduce((s, t) => s + t.attendees, 0)
  const avgAttend   = Math.round(totalAttend / totalCap)
  const avgScore    = (trainings.reduce((s, t) => s + t.avgScore, 0) / totalCap).toFixed(1)

  // Bar chart — sorted desc by attendees
  const attendChart = useMemo(() =>
    [...trainings]
      .sort((a, b) => b.attendees - a.attendees)
      .map(t => ({ name: t.topic.length > 28 ? t.topic.slice(0, 28) + '…' : t.topic, asistentes: t.attendees, fullName: t.topic })),
    [])

  // Radar chart — count by category
  const catCounts = useMemo(() => {
    const m = {}
    trainings.forEach(t => { m[t.category] = (m[t.category] || 0) + 1 })
    return Object.entries(m).map(([cat, count]) => ({ cat, count }))
  }, [])

  // ACAP coverage
  const acapCoverage = useMemo(() => {
    return [...acaps]
      .map(a => ({ name: a.name, taken: a.coursesTaken, pct: Math.min(100, Math.round((a.coursesTaken / totalCap) * 100)) }))
      .sort((a, b) => b.taken - a.taken)
  }, [totalCap])

  // Training status helper
  const today = new Date()
  function trainingStatus(dateStr) {
    return new Date(dateStr) <= today ? 'Completada' : 'Próxima'
  }

  // Filtered trainings
  const filtered = useMemo(() =>
    trainings.filter(t => !search || t.topic.toLowerCase().includes(search.toLowerCase()) || t.facilitator.toLowerCase().includes(search.toLowerCase())),
    [search])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0891B2' }}>
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#1a3c6e]">Programa de Capacitaciones</h1>
          <p className="text-xs text-gray-500">Coimpacto Academy — Formación para el desarrollo comunitario</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Total Capacitaciones"  value={totalCap}                     sub="sesiones realizadas" />
        <KpiCard label="Personas Capacitadas"  value={totalAttend.toLocaleString()} sub="participantes totales" />
        <KpiCard label="Promedio por Sesión"   value={avgAttend}                    sub="personas / sesión" />
        <KpiCard label="Calificación Promedio" value={`${avgScore} / 5.0`}          sub="promedio general" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-[#1a3c6e] mb-4">Asistentes por Capacitación</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={attendChart} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={150} />
              <Tooltip
                formatter={(v) => [v, 'Asistentes']}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''}
              />
              <Bar dataKey="asistentes" fill="#0891B2" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-[#1a3c6e] mb-4">Distribución por Categoría</h2>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={catCounts} cx="50%" cy="50%" outerRadius={100}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="cat" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 4]} tick={{ fontSize: 10 }} tickCount={5} />
              <Radar name="Sesiones" dataKey="count" stroke="#F97316" fill="#F97316" fillOpacity={0.3} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trainings table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-sm font-semibold text-[#1a3c6e]">Sesiones de Capacitación</h2>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar tema o facilitador…"
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]/30 min-w-56"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Tema', 'Categoría', 'Fecha', 'Asistentes', 'Comunidades', 'Facilitador', 'Duración', 'Calificación', 'Estado'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(t => {
                const status = trainingStatus(t.date)
                return (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800 max-w-xs" title={t.topic}>
                      {t.topic.length > 40 ? t.topic.slice(0, 40) + '…' : t.topic}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CAT_BADGE[t.category] || 'bg-gray-100 text-gray-600'}`}>
                        {t.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{t.date}</td>
                    <td className="px-4 py-3 text-center font-semibold text-[#1a3c6e]">{t.attendees}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs max-w-40" title={t.communities.join(', ')}>
                      {t.communities.join(', ').length > 36 ? t.communities.join(', ').slice(0, 36) + '…' : t.communities.join(', ')}
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{t.facilitator}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{t.duration}h</td>
                    <td className="px-4 py-3"><StarRating score={t.avgScore} /></td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status === 'Completada' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ACAP Coverage */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-[#1a3c6e] mb-1">Cobertura de Formación por ACAP</h2>
        <p className="text-xs text-gray-400 mb-4">Cursos completados sobre el total de sesiones disponibles ({totalCap})</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          {acapCoverage.map(a => (
            <div key={a.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-gray-700">{a.name}</span>
                <span className="text-gray-500">{a.taken} / {totalCap} ({a.pct}%)</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${a.pct}%`,
                    backgroundColor: a.pct >= 70 ? '#16A34A' : a.pct >= 40 ? '#F59E0B' : '#EF4444',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
