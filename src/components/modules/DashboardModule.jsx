import React, { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import {
  PiggyBank, CreditCard, ArrowUpRight, Users, MapPin, AlertTriangle,
  CheckCircle, XCircle, Info, X,
} from 'lucide-react'
import {
  acaps, credits, members, monthlyTrends, aiAlerts, portfolioSummary, zones,
} from '../../data/mockData'

// ─── helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

const fmtM = (n) => `$${(n / 1_000_000).toFixed(1)}M`

const zoneNameById = Object.fromEntries(zones.map((z) => [z.id, z.name]))

// ─── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, bg }) {
  return (
    <div className={`rounded-2xl p-5 text-white flex items-center gap-4 shadow-md`} style={{ backgroundColor: bg }}>
      <div className="bg-white/20 rounded-xl p-3 flex-shrink-0">
        <Icon size={24} className="text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-white/80 text-xs font-medium uppercase tracking-wide truncate">{label}</p>
        <p className="text-white font-bold text-xl leading-tight mt-0.5">{value}</p>
      </div>
    </div>
  )
}

// ─── Custom Tooltip for LineChart ───────────────────────────────────────────────
function LineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  )
}

// ─── Custom Tooltip for BarChart ────────────────────────────────────────────────
function BarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700">{payload[0]?.payload?.name}</p>
      <p className="text-orange-500 font-medium mt-1">{fmt(payload[0]?.value)}</p>
    </div>
  )
}

// ─── Alert Icon ─────────────────────────────────────────────────────────────────
function AlertIcon({ type }) {
  const map = {
    success: { Icon: CheckCircle, color: '#16A34A' },
    warning: { Icon: AlertTriangle, color: '#F59E0B' },
    danger:  { Icon: XCircle, color: '#EF4444' },
    info:    { Icon: Info, color: '#0891B2' },
  }
  const { Icon, color } = map[type] || map.info
  return <Icon size={22} style={{ color }} className="flex-shrink-0 mt-0.5" />
}

// ─── Status Badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    Activa:     'bg-green-100 text-green-700',
    Suspendida: 'bg-red-100 text-red-700',
    Inactiva:   'bg-gray-100 text-gray-600',
  }
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function DashboardModule({ setActiveModule }) {
  const [dismissedAlerts, setDismissedAlerts] = useState([])

  // ── Derived data ────────────────────────────────────────────────────────────
  const activeAcaps = acaps.filter((a) => a.status === 'Activa').length

  const top8 = [...acaps]
    .sort((a, b) => b.totalSaved - a.totalSaved)
    .slice(0, 8)
    .map((a) => ({ name: a.name, value: a.totalSaved }))

  const visibleAlerts = aiAlerts.filter((a) => !dismissedAlerts.includes(a.id))

  const alertBorderColor = {
    success: '#16A34A',
    warning: '#F59E0B',
    danger:  '#EF4444',
    info:    '#0891B2',
  }

  // ── Alert action navigation ─────────────────────────────────────────────────
  function handleAlertAction(alert) {
    if (alert.action === 'Ver crédito' || alert.action === 'Ver miembros' || alert.action === 'Ver cartera') {
      setActiveModule('credito')
    } else if (alert.action === 'Ver ACAP' || alert.action === 'Ver análisis') {
      setActiveModule('ahorro')
    } else {
      setActiveModule('capacitaciones')
    }
  }

  return (
    <div className="p-6 space-y-8">

      {/* ── Page Title ─────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a3c6e]">Panel Ejecutivo</h1>
        <p className="text-gray-500 text-sm mt-1">Vista general de indicadores clave — CoimpactoB</p>
      </div>

      {/* ── KPI Row ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard
          icon={PiggyBank}
          label="Total Ahorro"
          value="$97.5M COP"
          bg="#1a3c6e"
        />
        <KpiCard
          icon={CreditCard}
          label="Préstamos Internos"
          value="$21.8M COP"
          bg="#F97316"
        />
        <KpiCard
          icon={ArrowUpRight}
          label="Desembolsos Externos"
          value="$39.4M COP"
          bg="#0891B2"
        />
        <KpiCard
          icon={Users}
          label="Total Miembros"
          value="246"
          bg="#16A34A"
        />
        <KpiCard
          icon={MapPin}
          label="Comunidades Activas"
          value={String(activeAcaps)}
          bg="#7C3AED"
        />
        <KpiCard
          icon={AlertTriangle}
          label="Tasa Morosidad"
          value="9.79%"
          bg="#EF4444"
        />
      </div>

      {/* ── Charts Row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Line Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-[#1a3c6e] mb-4">
            Evolución Mensual Ahorro y Crédito
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyTrends} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis
                tickFormatter={fmtM}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                width={55}
              />
              <Tooltip content={<LineTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                formatter={(value) => value === 'savings' ? 'Ahorro' : 'Crédito'}
              />
              <Line
                type="monotone"
                dataKey="savings"
                name="savings"
                stroke="#1a3c6e"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#1a3c6e' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="credits"
                name="credits"
                stroke="#F97316"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#F97316' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart — Top 8 ACAs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-[#1a3c6e] mb-4">
            Ahorro por ACAP (Top 8)
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              layout="vertical"
              data={top8}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={fmtM}
                tick={{ fontSize: 11, fill: '#6b7280' }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={90}
                tick={{ fontSize: 11, fill: '#374151' }}
              />
              <Tooltip content={<BarTooltip />} cursor={{ fill: '#f3f4f6' }} />
              <Bar dataKey="value" name="Ahorro" fill="#F97316" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── AI Alerts Panel ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-[#1a3c6e]">Alertas de Inteligencia Artificial</h2>
          <span className="text-xs text-gray-400">{visibleAlerts.length} alertas activas</span>
        </div>

        {visibleAlerts.length === 0 ? (
          <div className="text-center text-gray-400 py-8 text-sm">No hay alertas activas.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {visibleAlerts.map((alert) => (
              <div
                key={alert.id}
                className="relative rounded-xl border-l-4 p-4 bg-gray-50 flex flex-col gap-2"
                style={{ borderColor: alertBorderColor[alert.type] }}
              >
                {/* Dismiss */}
                <button
                  onClick={() => setDismissedAlerts((prev) => [...prev, alert.id])}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Descartar alerta"
                >
                  <X size={15} />
                </button>

                {/* Header */}
                <div className="flex items-start gap-2 pr-5">
                  <AlertIcon type={alert.type} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800 text-sm leading-tight">{alert.title}</p>
                      {alert.priority === 'alta' && (
                        <span className="relative flex h-2 w-2 flex-shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message */}
                <p className="text-gray-600 text-xs leading-relaxed">{alert.message}</p>

                {/* Action */}
                <button
                  onClick={() => handleAlertAction(alert)}
                  className="mt-1 self-start text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  style={{
                    backgroundColor: `${alertBorderColor[alert.type]}15`,
                    color: alertBorderColor[alert.type],
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${alertBorderColor[alert.type]}25` }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${alertBorderColor[alert.type]}15` }}
                >
                  {alert.action} →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── ACAP Summary Table ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-[#1a3c6e]">Resumen de ACAs</h2>
          <button
            onClick={() => setActiveModule('ahorro')}
            className="text-xs font-semibold text-[#F97316] hover:text-orange-600 transition-colors border border-orange-200 rounded-lg px-3 py-1.5 hover:bg-orange-50"
          >
            Ver todas →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Nombre', 'Zona', 'Miembros', 'Ahorro Total', 'Meta %', 'Estado'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3 pr-4 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {acaps.slice(0, 8).map((acap) => (
                <tr
                  key={acap.id}
                  className="border-b border-gray-50 hover:bg-blue-50/40 transition-colors cursor-default"
                >
                  <td className="py-3 pr-4 font-medium text-gray-800 whitespace-nowrap">{acap.name}</td>
                  <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">{zoneNameById[acap.zoneId]}</td>
                  <td className="py-3 pr-4 text-gray-700">{acap.membersCount}</td>
                  <td className="py-3 pr-4 text-gray-700 whitespace-nowrap font-mono text-xs">
                    {fmt(acap.totalSaved)}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(acap.cycleAchieved, 100)}%`,
                            backgroundColor:
                              acap.cycleAchieved >= 90
                                ? '#16A34A'
                                : acap.cycleAchieved >= 70
                                ? '#F59E0B'
                                : '#EF4444',
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 whitespace-nowrap">
                        {acap.cycleAchieved.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <StatusBadge status={acap.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
