import React, { useState, useMemo } from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { Search, ChevronDown, ChevronUp, TrendingUp, Users, Target, BarChart2 } from 'lucide-react'
import {
  acaps, credits, members, monthlyTrends, aiAlerts, portfolioSummary, zones,
} from '../../data/mockData'

// ─── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

const fmtShort = (n) => `$${(n / 1_000_000).toFixed(2)}M`

const zoneNameById = Object.fromEntries(zones.map((z) => [z.id, z.name]))

// ─── Zone colors ────────────────────────────────────────────────────────────────
const ZONE_COLORS = {
  Z1: '#1a3c6e',
  Z2: '#F97316',
  Z3: '#16A34A',
  Z4: '#0891B2',
  Z5: '#7C3AED',
}

// ─── Frequency pie colors ────────────────────────────────────────────────────────
const FREQ_COLORS = ['#1a3c6e', '#F97316', '#0891B2']

// ─── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
      <div className="rounded-xl p-3 flex-shrink-0" style={{ backgroundColor: `${color}18` }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-lg font-bold text-gray-800 leading-tight mt-0.5 truncate">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ─── Custom Tooltips ─────────────────────────────────────────────────────────────
function ZoneTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700">{payload[0]?.payload?.zone}</p>
      <p className="text-[#1a3c6e] font-medium mt-1">{fmt(payload[0]?.value)}</p>
    </div>
  )
}

function FreqTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700">{payload[0]?.name}</p>
      <p className="font-medium mt-1" style={{ color: payload[0]?.payload?.fill }}>
        {payload[0]?.value} grupos
      </p>
    </div>
  )
}

function AreaTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      <p className="text-[#1a3c6e] font-medium">{fmt(payload[0]?.value)}</p>
    </div>
  )
}

// ─── Progress Bar ───────────────────────────────────────────────────────────────
function ProgressBar({ pct }) {
  const color = pct >= 90 ? '#16A34A' : pct >= 70 ? '#F59E0B' : '#EF4444'
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span style={{ color }} className="font-semibold">{pct.toFixed(1)}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

// ─── Status Badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    Activa:     'bg-green-100 text-green-700',
    Suspendida: 'bg-red-100 text-red-700',
    Inactiva:   'bg-gray-100 text-gray-600',
  }
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

// ─── Expanded Row Detail ─────────────────────────────────────────────────────────
function ExpandedDetail({ acap }) {
  // Simulate 6-month savings trend scaled by group size proportion
  const scale = acap.membersCount / 246
  const trend = monthlyTrends.map((m) => ({
    month: m.month,
    ahorro: Math.round(m.savings * scale),
  }))

  return (
    <div className="bg-blue-50/40 border-t border-blue-100 px-6 py-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detail info */}
        <div className="lg:col-span-1 space-y-3">
          <h4 className="font-semibold text-[#1a3c6e] text-sm">Detalle del grupo</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              ['Coordinadora', acap.coordinator],
              ['Frecuencia', acap.meetingFrequency],
              ['Inicio', new Date(acap.startDate).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })],
              ['Meta del ciclo', fmt(acap.cycleGoal)],
              ['Ahorro acumulado', fmt(acap.totalSaved)],
              ['Cursos completados', String(acap.coursesTaken)],
              ['Promedio/persona', fmt(acap.avgSavings)],
              ['Zona', zoneNameById[acap.zoneId]],
            ].map(([k, v]) => (
              <React.Fragment key={k}>
                <span className="text-gray-500 font-medium">{k}</span>
                <span className="text-gray-800">{v}</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Trend chart */}
        <div className="lg:col-span-2">
          <h4 className="font-semibold text-[#1a3c6e] text-sm mb-3">
            Tendencia de ahorro — últimos 6 meses (proyección)
          </h4>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={trend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id={`grad-${acap.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a3c6e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1a3c6e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis
                tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`}
                tick={{ fontSize: 10, fill: '#6b7280' }}
                width={50}
              />
              <Tooltip content={<AreaTooltip />} />
              <Area
                type="monotone"
                dataKey="ahorro"
                stroke="#1a3c6e"
                strokeWidth={2}
                fill={`url(#grad-${acap.id})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

// ─── Custom Pie Label ─────────────────────────────────────────────────────────────
function renderCustomPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) {
  if (percent < 0.08) return null
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function AhorroModule() {
  const [search, setSearch] = useState('')
  const [zoneFilter, setZoneFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('Todas')
  const [expandedRow, setExpandedRow] = useState(null)

  // ── KPI computations ───────────────────────────────────────────────────────
  const totalSaved = acaps.reduce((sum, a) => sum + a.totalSaved, 0)
  const activeCount = acaps.filter((a) => a.status === 'Activa').length
  const avgPerGroup = Math.round(totalSaved / acaps.length)
  const avgCycleAchieved = (acaps.reduce((sum, a) => sum + a.cycleAchieved, 0) / acaps.length)

  // ── Zone bar data ──────────────────────────────────────────────────────────
  const zoneBarData = zones.map((z) => ({
    zone: z.name,
    total: acaps.filter((a) => a.zoneId === z.id).reduce((s, a) => s + a.totalSaved, 0),
    fill: ZONE_COLORS[z.id],
  }))

  // ── Frequency pie data ─────────────────────────────────────────────────────
  const freqMap = { Semanal: 0, Quincenal: 0, Mensual: 0 }
  acaps.forEach((a) => { if (freqMap[a.meetingFrequency] !== undefined) freqMap[a.meetingFrequency]++ })
  const freqData = Object.entries(freqMap).map(([name, value], i) => ({
    name,
    value,
    fill: FREQ_COLORS[i],
  }))

  // ── Filtered ACAP list ─────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return acaps.filter((a) => {
      const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.coordinator.toLowerCase().includes(search.toLowerCase())
      const matchZone = zoneFilter === 'all' || a.zoneId === zoneFilter
      const matchStatus = statusFilter === 'Todas' || a.status === statusFilter
      return matchSearch && matchZone && matchStatus
    })
  }, [search, zoneFilter, statusFilter])

  function toggleRow(id) {
    setExpandedRow((prev) => (prev === id ? null : id))
  }

  return (
    <div className="p-6 space-y-8">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3c6e]">Gestión de Ahorro — ACAP</h1>
          <p className="text-gray-500 text-sm mt-1">Grupos de ahorro comunitario activos en el programa</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o coordinadora…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1a3c6e] w-60 bg-white"
            />
          </div>

          {/* Zone */}
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1a3c6e] bg-white text-gray-700"
          >
            <option value="all">Todas las zonas</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1a3c6e] bg-white text-gray-700"
          >
            {['Todas', 'Activa', 'Inactiva', 'Suspendida'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── KPI Row ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={TrendingUp}
          label="Total Ahorrado"
          value={`$${totalSaved.toLocaleString('es-CO')} COP`}
          color="#1a3c6e"
        />
        <KpiCard
          icon={Users}
          label="Grupos Activos"
          value={String(activeCount)}
          sub={`de ${acaps.length} grupos totales`}
          color="#16A34A"
        />
        <KpiCard
          icon={BarChart2}
          label="Promedio por Grupo"
          value={fmt(avgPerGroup)}
          color="#F97316"
        />
        <KpiCard
          icon={Target}
          label="Tasa Cumpl. Metas"
          value={`${avgCycleAchieved.toFixed(1)}%`}
          sub="promedio del ciclo"
          color="#0891B2"
        />
      </div>

      {/* ── Charts Row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Zone bar chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-[#1a3c6e] mb-4">Ahorro por Zona</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={zoneBarData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="zone"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickFormatter={(v) => v.replace('Zona ', '')}
              />
              <YAxis
                tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                width={50}
              />
              <Tooltip content={<ZoneTooltip />} cursor={{ fill: '#f3f4f6' }} />
              <Bar dataKey="total" name="Ahorro" radius={[4, 4, 0, 0]}>
                {zoneBarData.map((entry) => (
                  <Cell key={entry.zone} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-3 justify-center">
            {zones.map((z) => (
              <div key={z.id} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: ZONE_COLORS[z.id] }} />
                <span className="text-xs text-gray-600">{z.name.replace('Zona ', '')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Frequency pie chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-[#1a3c6e] mb-4">
            Distribución por Frecuencia de Reunión
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={freqData}
                cx="50%"
                cy="50%"
                outerRadius={95}
                dataKey="value"
                labelLine={false}
                label={renderCustomPieLabel}
              >
                {freqData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<FreqTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-2">
            {freqData.map((f) => (
              <div key={f.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: f.fill }} />
                <span className="text-xs text-gray-600">
                  {f.name} <span className="font-semibold text-gray-800">({f.value})</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ACAP Table ──────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#1a3c6e]">
            Grupos de Ahorro
          </h2>
          <span className="text-xs text-gray-400">
            {filtered.length} de {acaps.length} grupos
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-12 text-sm">
            No se encontraron grupos con los filtros aplicados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/60">
                <tr>
                  {[
                    'Nombre', 'Zona', 'Coordinadora', 'Miembros',
                    'Total Ahorrado', 'Prom./Persona', 'Frecuencia',
                    'Meta Ciclo', 'Progreso', 'Cursos', 'Estado', '',
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 px-4 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((acap) => (
                  <React.Fragment key={acap.id}>
                    <tr
                      className={`border-t border-gray-50 hover:bg-blue-50/30 transition-colors cursor-pointer ${
                        expandedRow === acap.id ? 'bg-blue-50/40' : ''
                      }`}
                      onClick={() => toggleRow(acap.id)}
                    >
                      {/* Nombre */}
                      <td className="py-3 px-4 font-semibold text-[#1a3c6e] whitespace-nowrap">
                        {acap.name}
                      </td>
                      {/* Zona */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${ZONE_COLORS[acap.zoneId]}18`,
                            color: ZONE_COLORS[acap.zoneId],
                          }}
                        >
                          {zoneNameById[acap.zoneId]}
                        </span>
                      </td>
                      {/* Coordinadora */}
                      <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{acap.coordinator}</td>
                      {/* Miembros */}
                      <td className="py-3 px-4 text-center text-gray-700 font-medium">{acap.membersCount}</td>
                      {/* Total Ahorrado */}
                      <td className="py-3 px-4 font-mono text-xs text-gray-800 whitespace-nowrap">
                        {fmt(acap.totalSaved)}
                      </td>
                      {/* Prom./Persona */}
                      <td className="py-3 px-4 font-mono text-xs text-gray-600 whitespace-nowrap">
                        {fmt(acap.avgSavings)}
                      </td>
                      {/* Frecuencia */}
                      <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{acap.meetingFrequency}</td>
                      {/* Meta Ciclo */}
                      <td className="py-3 px-4 font-mono text-xs text-gray-600 whitespace-nowrap">
                        {fmt(acap.cycleGoal)}
                      </td>
                      {/* Progreso */}
                      <td className="py-3 px-4 min-w-[120px]">
                        <ProgressBar pct={acap.cycleAchieved} />
                      </td>
                      {/* Cursos */}
                      <td className="py-3 px-4 text-center text-gray-700">{acap.coursesTaken}</td>
                      {/* Estado */}
                      <td className="py-3 px-4">
                        <StatusBadge status={acap.status} />
                      </td>
                      {/* Expand icon */}
                      <td className="py-3 px-4 text-gray-400">
                        {expandedRow === acap.id
                          ? <ChevronUp size={16} />
                          : <ChevronDown size={16} />}
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {expandedRow === acap.id && (
                      <tr>
                        <td colSpan={12} className="p-0">
                          <ExpandedDetail acap={acap} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
