import { useState } from 'react'
import { Wallet, Building2, AlertTriangle, Search, Calendar, TrendingDown, DollarSign, Clock } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer,
} from 'recharts'

import KPICard from '../dashboards/shared/KPICard'
import AlertBanner from '../dashboards/shared/AlertBanner'
import { credits, members, acaps } from '../../data/mockData'

const CHART_TOOLTIP_STYLE = { borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '13px' }

// ─── DATOS MOCK ────────────────────────────────────────────────────────────

const EXTERNAL_SOURCES = [
  { entidad: 'BanColombia',      tipo: 'Crédito Comercial', monto: 8500000,  tasa: '12.5% EA', vencimiento: '15 Sep 2026', estado: 'Activo',  pct: 35.0 },
  { entidad: 'Fondo Emprender',  tipo: 'Fondo Concursable', monto: 5200000,  tasa: '0% (subsidio)', vencimiento: '30 Abr 2026', estado: 'Por vencer', pct: 21.4 },
  { entidad: 'Banco Agrario',    tipo: 'Crédito Rural',     monto: 4800000,  tasa: '10.2% EA', vencimiento: '30 Jun 2026', estado: 'Activo',  pct: 19.8 },
  { entidad: 'USAID',            tipo: 'Cooperación',       monto: 3600000,  tasa: '0% (donación)', vencimiento: '31 Dic 2026', estado: 'Activo',  pct: 14.8 },
  { entidad: 'Coomeva',          tipo: 'Crédito Solidario', monto: 2200000,  tasa: '14.8% EA', vencimiento: '28 Feb 2027', estado: 'Activo',  pct: 9.1  },
]

const UPCOMING = [
  { entidad: 'Fondo Emprender', fecha: '30 Abr 2026', monto: '$5.2M', urgencia: 'URGENTE',  color: '#EF4444', bg: '#FEF2F2' },
  { entidad: 'Banco Agrario',   fecha: '30 Jun 2026', monto: '$4.8M', urgencia: 'PRÓXIMO',  color: '#F59E0B', bg: '#FFFBEB' },
  { entidad: 'BanColombia',     fecha: '15 Sep 2026', monto: '$8.5M', urgencia: 'PLANIFICAR', color: '#0891B2', bg: '#EFF6FF' },
]

const STATUS_STYLE = {
  'Al día':    { color: '#16A34A', bg: '#f0fdf4' },
  'En mora':   { color: '#EF4444', bg: '#fef2f2' },
  'Pagado':    { color: '#0891B2', bg: '#eff6ff' },
  'Vencido':   { color: '#dc2626', bg: '#fef2f2' },
  'Por vencer':{ color: '#F59E0B', bg: '#fffbeb' },
  'Activo':    { color: '#16A34A', bg: '#f0fdf4' },
}

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || { color: '#64748b', bg: '#f8fafc' }
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ color: s.color, backgroundColor: s.bg }}>
      {status}
    </span>
  )
}

// ─── TAB INTERNA ───────────────────────────────────────────────────────────

function TabInterna() {
  const [search, setSearch] = useState('')

  // Construir lista de deudores desde credits + members + acaps
  const debtors = credits
    .filter(c => c.status !== 'Pagado')
    .map(c => {
      const member = members.find(m => m.id === c.memberId)
      const acap   = acaps.find(a => a.id === c.acapId)
      return {
        id:       c.id,
        nombre:   member?.name || '—',
        comunidad: acap?.name || '—',
        monto:    c.amount,
        cuotas:   `${Math.round((c.paidAmount / c.amount) * c.term)} / ${c.term}`,
        proximoPago: c.dueDate,
        estado:   c.status,
        scoreIA:  c.scoringScore,
      }
    })
    .filter(d =>
      !search ||
      d.nombre.toLowerCase().includes(search.toLowerCase()) ||
      d.comunidad.toLowerCase().includes(search.toLowerCase())
    )

  const totalCartera  = credits.filter(c => c.status !== 'Pagado').reduce((s, c) => s + c.balance, 0)
  const alDia         = credits.filter(c => c.status === 'Al día').reduce((s, c) => s + c.balance, 0)
  const enMora        = credits.filter(c => c.status === 'En mora').reduce((s, c) => s + c.balance, 0)
  const indexMora     = totalCartera > 0 ? ((enMora / totalCartera) * 100).toFixed(2) : '0'

  const fmtM = (n) => `$${(n / 1_000_000).toFixed(2)}M`

  return (
    <div className="space-y-6">

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard icon={Wallet}       label="Cartera Interna"  value={fmtM(totalCartera)} bg="#1a3c6e" trend="+18.5%" comparison="vs 2024" />
        <KPICard icon={DollarSign}   label="Cartera Al Día"   value={fmtM(alDia)}        bg="#16A34A" />
        <KPICard icon={AlertTriangle} label="Cartera Vencida" value={fmtM(enMora)}       bg="#F59E0B" />
        <KPICard icon={TrendingDown} label="Índice de Mora"   value={`${indexMora}%`}    bg="#ea580c" trend="-0.5%" comparison="vs mar" />
      </div>

      {/* Alerta IA */}
      <AlertBanner
        type="warning"
        title="Agente Analista IA"
        message="2 miembros de Yoduijoné presentan riesgo de mora. Notificación automática programada vía WhatsApp para el 20 de Abril."
      />

      {/* Tabla deudores */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
          <h3 className="font-bold text-gray-900 text-base flex-1">Deudores — Cartera Interna</h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              placeholder="Buscar nombre o comunidad..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#F97316] w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Nombre', 'Comunidad', 'Monto', 'Cuotas', 'Próximo Pago', 'Estado', 'Score IA', 'Acción'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {debtors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400 text-sm">
                    No se encontraron resultados
                  </td>
                </tr>
              ) : debtors.map(d => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors duration-100">
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{d.nombre}</td>
                  <td className="px-4 py-3 text-slate-600">{d.comunidad}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">${(d.monto / 1000).toFixed(0)}K</td>
                  <td className="px-4 py-3 text-slate-600">{d.cuotas}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-slate-400" aria-hidden="true" />
                      {new Date(d.proximoPago).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={d.estado} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-slate-100 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${d.scoreIA}%`,
                            backgroundColor: d.scoreIA >= 85 ? '#16A34A' : d.scoreIA >= 70 ? '#F59E0B' : '#EF4444',
                          }}
                        />
                      </div>
                      <span className="text-slate-700 font-medium text-xs">{d.scoreIA}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-150 hover:opacity-80 active:scale-95"
                      style={{ backgroundColor: '#EFF6FF', color: '#1a3c6e' }}
                    >
                      Ver perfil
                    </button>
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

// ─── TAB EXTERNA ───────────────────────────────────────────────────────────

function TabExterna() {
  const totalRecibido  = EXTERNAL_SOURCES.reduce((s, e) => s + e.monto, 0)
  const totalUtilizado = 19100000
  const disponible     = totalRecibido - totalUtilizado
  const fmtM = (n) => `$${(n / 1_000_000).toFixed(1)}M`

  return (
    <div className="space-y-6">

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard icon={Building2}    label="Total Recibido"       value={fmtM(totalRecibido)}  bg="#1a3c6e" trend="+12%" comparison="vs 2024" />
        <KPICard icon={DollarSign}   label="Monto Utilizado"      value={fmtM(totalUtilizado)} bg="#0891B2" />
        <KPICard icon={Wallet}       label="Disponible"           value={fmtM(disponible)}     bg="#16A34A" />
        <KPICard icon={Clock}        label="Próximo Vencimiento"  value="30 Abr"               bg="#F59E0B" />
      </div>

      {/* Alerta liquidez */}
      <AlertBanner
        type="warning"
        title="Alerta de Liquidez"
        message="Fondo Emprender vence en 13 días — $5.2M COP pendiente de renovación. Se recomienda iniciar trámite de extensión antes del 25 de Abril."
      />

      {/* Tabla fuentes externas */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-gray-900 text-base">Fuentes de Financiamiento Externo</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Entidad', 'Tipo', 'Monto', 'Tasa', 'Vencimiento', 'Estado'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {EXTERNAL_SOURCES.map(row => (
                <tr key={row.entidad} className="hover:bg-slate-50 transition-colors duration-100">
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{row.entidad}</td>
                  <td className="px-4 py-3 text-slate-600">{row.tipo}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{fmtM(row.monto)}</td>
                  <td className="px-4 py-3 text-slate-600">{row.tasa}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-slate-400" aria-hidden="true" />
                      {row.vencimiento}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.estado} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gráfico distribución */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
        <h3 className="font-bold text-gray-900 text-base mb-1">Distribución por Entidad</h3>
        <p className="text-slate-500 text-sm mb-5">Porcentaje de cartera por fuente externa</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={EXTERNAL_SOURCES}
            layout="vertical"
            margin={{ top: 0, right: 40, left: 8, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `${v}%`} domain={[0, 40]} />
            <YAxis type="category" dataKey="entidad" tick={{ fontSize: 12, fill: '#475569' }} width={110} />
            <Tooltip
              contentStyle={CHART_TOOLTIP_STYLE}
              formatter={v => [`${v}%`, '% cartera']}
            />
            <Bar dataKey="pct" radius={[0, 6, 6, 0]} label={{ position: 'right', fontSize: 11, fill: '#64748b', formatter: v => `${v}%` }}>
              {EXTERNAL_SOURCES.map((_, i) => (
                <Cell key={i} fill={['#1a3c6e', '#F97316', '#0891B2', '#16A34A', '#8b5cf6'][i % 5]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Próximos vencimientos */}
      <div>
        <h3 className="font-bold text-gray-900 text-base mb-3">Próximos Vencimientos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {UPCOMING.map(u => (
            <div
              key={u.entidad}
              className="rounded-2xl p-5 border-l-4 flex flex-col gap-2"
              style={{ backgroundColor: u.bg, borderLeftColor: u.color }}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">{u.entidad}</span>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ color: u.color, backgroundColor: `${u.color}18` }}
                >
                  {u.urgencia}
                </span>
              </div>
              <p className="text-2xl font-bold" style={{ color: u.color }}>{u.monto}</p>
              <p className="text-slate-500 text-xs flex items-center gap-1">
                <Calendar size={11} aria-hidden="true" />
                Vence: {u.fecha}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

// ─── MÓDULO PRINCIPAL ──────────────────────────────────────────────────────

const TABS = [
  { id: 'interna', label: 'Cartera Interna',  icon: Wallet    },
  { id: 'externa', label: 'Cartera Externa',  icon: Building2 },
]

export default function CarteraModule() {
  const [activeTab, setActiveTab] = useState('interna')

  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Módulo de Cartera</h2>
        <p className="text-slate-500 text-sm mt-1">Gestión de cartera interna y fuentes de financiamiento externo · Abril 2026</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 min-h-[44px] ${
                active ? 'bg-white shadow-sm' : 'hover:bg-slate-200/60'
              }`}
              style={{ color: active ? '#1a3c6e' : '#64748b' }}
            >
              <Icon size={15} aria-hidden="true" />
              {label}
            </button>
          )
        })}
      </div>

      {/* Contenido del tab */}
      <div key={activeTab}>
        {activeTab === 'interna' ? <TabInterna /> : <TabExterna />}
      </div>

    </div>
  )
}
