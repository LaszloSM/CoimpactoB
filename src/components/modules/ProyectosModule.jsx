import { useState, useMemo } from 'react'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { PlusCircle, Search, ChevronDown, ChevronUp, Briefcase } from 'lucide-react'
import { acaps, members, projects } from '../../data/mockData'

const CATEGORY_COLORS = {
  'Agricultura':         '#16A34A',
  'Comercio':            '#F97316',
  'Ganadería':           '#0891B2',
  'Pesca':               '#1a3c6e',
  'Artesanías':          '#F59E0B',
  'Energías renovables': '#8B5CF6',
  'Turismo comunitario': '#EF4444',
}

const STATUS_COLORS = {
  'En evaluación': { bg: 'bg-blue-100',  text: 'text-blue-700'  },
  'Aprobado':      { bg: 'bg-green-100', text: 'text-green-700' },
  'En ejecución':  { bg: 'bg-green-100', text: 'text-green-700' },
  'Finalizado':    { bg: 'bg-gray-100',  text: 'text-gray-600'  },
  'Cancelado':     { bg: 'bg-red-100',   text: 'text-red-700'   },
}

const ALL_CATEGORIES = ['Todas', 'Agricultura', 'Comercio', 'Ganadería', 'Pesca', 'Artesanías', 'Energías renovables', 'Turismo comunitario']
const ALL_STATUSES   = ['Todos', 'En evaluación', 'Aprobado', 'En ejecución', 'Finalizado', 'Cancelado']

function fmt(n) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
}

function ViabilityDot({ score }) {
  const color = score >= 70 ? '#16A34A' : score >= 50 ? '#F59E0B' : '#EF4444'
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <span className="font-semibold" style={{ color }}>{score}</span>
    </div>
  )
}

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || { bg: 'bg-gray-100', text: 'text-gray-600' }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {status}
    </span>
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

let _toastTimeout = null
function showToast(msg) {
  let el = document.getElementById('proy-toast')
  if (!el) {
    el = document.createElement('div')
    el.id = 'proy-toast'
    el.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#1a3c6e;color:#fff;padding:12px 20px;border-radius:10px;font-size:14px;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.25)'
    document.body.appendChild(el)
  }
  el.textContent = msg
  el.style.opacity = '1'
  clearTimeout(_toastTimeout)
  _toastTimeout = setTimeout(() => { el.style.opacity = '0' }, 2800)
}

export default function ProyectosModule() {
  const [catFilter,    setCatFilter]    = useState('Todas')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [search,       setSearch]       = useState('')
  const [expanded,     setExpanded]     = useState(null)

  const memberMap = useMemo(() => Object.fromEntries(members.map(m => [m.id, m.name])), [])
  const acapMap   = useMemo(() => Object.fromEntries(acaps.map(a => [a.id, a.name])), [])

  // KPIs
  const totalProyectos   = projects.length
  const enEjecucion      = projects.filter(p => p.status === 'En ejecución').length
  const totalEmpleos     = projects.reduce((s, p) => s + p.estimatedJobs, 0)
  const totalIngreso     = projects.reduce((s, p) => s + p.estimatedMonthlyIncome, 0)

  // Pie data
  const catCounts = useMemo(() => {
    const m = {}
    projects.forEach(p => { m[p.category] = (m[p.category] || 0) + 1 })
    return Object.entries(m).map(([name, value]) => ({ name, value }))
  }, [])

  // Bar data
  const statusCounts = useMemo(() => {
    const m = {}
    projects.forEach(p => { m[p.status] = (m[p.status] || 0) + 1 })
    return Object.entries(m).map(([name, value]) => ({ name, value }))
  }, [])

  // Filtered
  const filtered = useMemo(() => projects.filter(p => {
    if (catFilter !== 'Todas' && p.category !== catFilter) return false
    if (statusFilter !== 'Todos' && p.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      if (!p.name.toLowerCase().includes(q) && !(memberMap[p.memberId] || '').toLowerCase().includes(q)) return false
    }
    return true
  }), [catFilter, statusFilter, search, memberMap])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1a3c6e' }}>
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1a3c6e]">Proyectos Productivos</h1>
            <p className="text-xs text-gray-500">Gestión y seguimiento de iniciativas económicas</p>
          </div>
        </div>
        <button
          onClick={() => showToast('Formulario de nuevo proyecto próximamente')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: '#F97316' }}
        >
          <PlusCircle className="w-4 h-4" /> Agregar Proyecto
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Total Proyectos"    value={totalProyectos}             sub={`${catCounts.length} categorías`} />
        <KpiCard label="En Ejecución"       value={enEjecucion}                sub="proyectos activos" />
        <KpiCard label="Empleos Generados"  value={totalEmpleos.toLocaleString()} sub="empleos estimados" />
        <KpiCard label="Ingreso Estimado"   value={fmt(totalIngreso)}          sub="/ mes total" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-[#1a3c6e] mb-4">Proyectos por Categoría</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={catCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                {catCounts.map((entry) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {catCounts.map(c => (
              <span key={c.name} className="flex items-center gap-1 text-xs text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: CATEGORY_COLORS[c.name] || '#94a3b8' }} />
                {c.name}
              </span>
            ))}
          </div>
        </div>

        {/* Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-[#1a3c6e] mb-4">Proyectos por Estado</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statusCounts} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" name="Proyectos" radius={[4, 4, 0, 0]}>
                {statusCounts.map((entry) => {
                  const colorMap = {
                    'En evaluación': '#0891B2',
                    'Aprobado':      '#16A34A',
                    'En ejecución':  '#16A34A',
                    'Finalizado':    '#94a3b8',
                    'Cancelado':     '#EF4444',
                  }
                  return <Cell key={entry.name} fill={colorMap[entry.name] || '#1a3c6e'} />
                })}
              </Bar>
            </BarChart>
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
            placeholder="Buscar proyecto o beneficiario…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]/30"
          />
        </div>
        <select
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]/30"
        >
          {ALL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]/30"
        >
          {ALL_STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <span className="text-xs text-gray-500">{filtered.length} resultados</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Nombre', 'Beneficiario', 'ACAP', 'Categoría', 'Estado', 'Monto Solicitado', 'Monto Aprobado', 'Viabilidad', 'Empleos', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(p => (
              <>
                <tr
                  key={p.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                >
                  <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap max-w-48 truncate" title={p.name}>{p.name}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{memberMap[p.memberId] || p.memberId}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{acapMap[p.acapId] || p.acapId}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: CATEGORY_COLORS[p.category] || '#94a3b8' }}>
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{fmt(p.requestedAmount)}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{fmt(p.approvedAmount)}</td>
                  <td className="px-4 py-3"><ViabilityDot score={p.viabilityScore} /></td>
                  <td className="px-4 py-3 text-center font-semibold text-[#1a3c6e]">{p.estimatedJobs}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {expanded === p.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </td>
                </tr>
                {expanded === p.id && (
                  <tr key={`${p.id}-exp`} className="bg-blue-50/40">
                    <td colSpan={10} className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-[#1a3c6e] uppercase mb-1">Descripción</p>
                          <p className="text-sm text-gray-700">{p.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div><span className="text-gray-400 text-xs">Inicio:</span><p className="font-medium">{p.startDate}</p></div>
                          <div><span className="text-gray-400 text-xs">Ingreso estimado:</span><p className="font-medium">{fmt(p.estimatedMonthlyIncome)}/mes</p></div>
                          <div><span className="text-gray-400 text-xs">Zona:</span><p className="font-medium">{p.zoneId}</p></div>
                          <div><span className="text-gray-400 text-xs">Viabilidad:</span><p className="font-medium">{p.viabilityScore} / 100</p></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-gray-400 text-sm">No se encontraron proyectos con los filtros seleccionados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
