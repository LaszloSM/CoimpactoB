import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { Users, Search, ChevronUp, ChevronDown } from 'lucide-react'
import { acaps, members } from '../../data/mockData'

// ── helpers ──────────────────────────────────────────────────────────
const ACAP_MAP = Object.fromEntries(acaps.map(a => [a.id, a.name]))
const ZONE_LABELS = { Z1: 'Norte', Z2: 'Sur', Z3: 'Centro', Z4: 'Oriente', Z5: 'Occidente' }

function overallLabel(compliance, attendance) {
  const avg = (compliance + attendance) / 2
  if (avg >= 90) return { label: 'Excelente', color: 'text-green-700', bg: 'bg-green-100' }
  if (avg >= 75) return { label: 'Bueno',     color: 'text-blue-700',  bg: 'bg-blue-100'  }
  if (avg >= 60) return { label: 'Regular',   color: 'text-amber-700', bg: 'bg-amber-100' }
  return                { label: 'Bajo',       color: 'text-red-700',   bg: 'bg-red-100'   }
}

function StatusBadge({ status }) {
  const cfg = {
    Activo:     'bg-green-100 text-green-700',
    Inactivo:   'bg-gray-100 text-gray-500',
    Suspendido: 'bg-red-100 text-red-700',
  }
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg[status] || cfg.Inactivo}`}>{status}</span>
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

const PIE_COLORS = ['#16A34A', '#94a3b8', '#EF4444']

// ── component ────────────────────────────────────────────────────────
export default function EvaluacionesModule() {
  const [acapFilter,   setAcapFilter]   = useState('Todos')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [search,       setSearch]       = useState('')
  const [sortDir,      setSortDir]      = useState('desc') // by paymentCompliance

  // KPIs
  const activeMembers = useMemo(() => members.filter(m => m.status === 'Activo').length, [])
  const avgCompliance = useMemo(() => {
    const vals = members.map(m => m.paymentCompliance)
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
  }, [])

  // Bar chart: avg compliance per ACAP
  const acapCompliance = useMemo(() => {
    const sums = {}; const counts = {}
    members.forEach(m => {
      sums[m.acapId]   = (sums[m.acapId] || 0)   + m.paymentCompliance
      counts[m.acapId] = (counts[m.acapId] || 0) + 1
    })
    return acaps.map(a => ({
      name:       a.name.length > 14 ? a.name.slice(0, 14) + '…' : a.name,
      fullName:   a.name,
      cumplimiento: Math.round((sums[a.id] || 0) / (counts[a.id] || 1)),
    })).sort((a, b) => b.cumplimiento - a.cumplimiento)
  }, [])

  // Pie chart: status counts
  const statusCounts = useMemo(() => {
    const m = {}
    members.forEach(mb => { m[mb.status] = (m[mb.status] || 0) + 1 })
    return Object.entries(m).map(([name, value]) => ({ name, value }))
  }, [])

  // Filtered + sorted members
  const filtered = useMemo(() => {
    let list = [...members]
    if (acapFilter !== 'Todos') list = list.filter(m => m.acapId === acapFilter)
    if (statusFilter !== 'Todos') list = list.filter(m => m.status === statusFilter)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(m => m.name.toLowerCase().includes(q) || (ACAP_MAP[m.acapId] || '').toLowerCase().includes(q))
    }
    list.sort((a, b) => sortDir === 'desc'
      ? b.paymentCompliance - a.paymentCompliance
      : a.paymentCompliance - b.paymentCompliance)
    return list
  }, [acapFilter, statusFilter, search, sortDir])

  // Unique acap options
  const acapOptions = useMemo(() => ['Todos', ...acaps.map(a => a.id)], [])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#16A34A' }}>
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#1a3c6e]">Evaluaciones y Membresías</h1>
          <p className="text-xs text-gray-500">Seguimiento individual del desempeño y cumplimiento de miembros</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard label="Miembros Activos"      value={activeMembers}     sub={`de ${members.length} miembros totales`} />
        <KpiCard label="Tasa de Retención"     value="87%"               sub="en los últimos 12 meses" />
        <KpiCard label="Cumplimiento Promedio" value={`${avgCompliance}%`} sub="pago de aportes" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-[#1a3c6e] mb-4">Cumplimiento por ACAP</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={acapCompliance} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
              <Tooltip
                formatter={v => [`${v}%`, 'Cumplimiento']}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''}
              />
              <Bar
                dataKey="cumplimiento"
                name="Cumplimiento"
                radius={[0, 4, 4, 0]}
                fill="#1a3c6e"
                label={{ position: 'right', fontSize: 10, formatter: v => `${v}%` }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-[#1a3c6e] mb-4">Estado de Membresías</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}>
                {statusCounts.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar miembro o ACAP…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]/30"
          />
        </div>
        <select
          value={acapFilter}
          onChange={e => setAcapFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]/30"
        >
          {acapOptions.map(id => (
            <option key={id} value={id}>{id === 'Todos' ? 'Todas las ACAP' : ACAP_MAP[id] || id}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]/30"
        >
          {['Todos', 'Activo', 'Inactivo', 'Suspendido'].map(s => <option key={s}>{s}</option>)}
        </select>
        <span className="text-xs text-gray-500">{filtered.length} miembros</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">ACAP</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Zona</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Asistencia</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap min-w-32">
                <button
                  className="flex items-center gap-1 hover:text-[#1a3c6e] transition-colors"
                  onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
                >
                  Cumplimiento
                  {sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                </button>
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Estado</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Cursos</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Evaluación</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(m => {
              const acap = ACAP_MAP[m.acapId] || m.acapId
              const zone = ZONE_LABELS[m.zoneId] || m.zoneId
              const ev   = overallLabel(m.paymentCompliance, m.attendance)
              // find courses taken from acaps
              const acapObj = acaps.find(a => a.id === m.acapId)
              const courses = acapObj ? acapObj.coursesTaken : 0
              return (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{m.name}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{acap}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{zone}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-semibold text-sm ${m.attendance >= 85 ? 'text-green-600' : m.attendance >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
                      {m.attendance}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-20">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${m.paymentCompliance}%`,
                            backgroundColor: m.paymentCompliance >= 85 ? '#16A34A' : m.paymentCompliance >= 70 ? '#F59E0B' : '#EF4444',
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-8 text-right">{m.paymentCompliance}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={m.status} /></td>
                  <td className="px-4 py-3 text-center font-semibold text-[#1a3c6e]">{courses}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ev.bg} ${ev.color}`}>{ev.label}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-xs text-[#1a3c6e] font-medium hover:underline">Ver perfil</button>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-gray-400 text-sm">
                  No se encontraron miembros con los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
