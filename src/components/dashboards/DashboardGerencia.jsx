import React from 'react'
import {
  PiggyBank, CreditCard, Users, Building2, MapPin, TrendingUp,
  Target, Award, Zap, ArrowUpRight,
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, RadarChart, Radar,
  PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts'

import KPICard from './shared/KPICard'
import AlertBanner from './shared/AlertBanner'
import ChartContainer from './shared/ChartContainer'
import { monthlyTrends, acaps, credits, members } from '../../data/mockData'

const fmtM = (n) => `$${(n / 1_000_000).toFixed(1)}M`
const TOOLTIP = { borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '13px' }

// ─── Datos derivados ──────────────────────────────────────────────────────
const totalSavings    = acaps.reduce((s, a) => s + a.totalSaved, 0)
const totalCredits    = 21800000
const totalCommunities = acaps.length
const totalMembers    = acaps.reduce((s, a) => s + a.membersCount, 0)

const top5 = [...acaps]
  .sort((a, b) => b.totalSaved - a.totalSaved)
  .slice(0, 5)
  .map(a => ({ name: a.name, ahorro: a.totalSaved, meta: a.cycleGoal }))

// Crecimiento MoM (últimos 6 meses)
const trendData = monthlyTrends.map((m, i) => ({
  month: m.month,
  ahorro: +(m.savings / 1e6).toFixed(2),
  credito: +(m.credits / 1e6).toFixed(2),
  miembros: m.newMembers,
  creditos: m.newCredits,
}))

// Crecimiento YoY simulado (2023 → 2026)
const YOY = [
  { year: '2023', ahorro: 38.2,  credito: 9.4,  comunidades: 10, miembros: 142 },
  { year: '2024', ahorro: 62.8,  credito: 15.7, comunidades: 14, miembros: 189 },
  { year: '2025', ahorro: 82.1,  credito: 28.3, comunidades: 16, miembros: 224 },
  { year: '2026', ahorro: 97.6,  credito: 39.4, comunidades: 18, miembros: 246 },
]

// Tasa de cumplimiento por zona
const ZONE_COMPLIANCE = [
  { zona: 'Zona Norte',     cumplimiento: 94.2, mora: 3.1,  ahorro: 24.8 },
  { zona: 'Zona Sur',       cumplimiento: 81.7, mora: 9.8,  ahorro: 17.1 },
  { zona: 'Zona Centro',    cumplimiento: 88.5, mora: 6.2,  ahorro: 20.4 },
  { zona: 'Zona Oriente',   cumplimiento: 91.0, mora: 5.4,  ahorro: 19.9 },
  { zona: 'Zona Occidente', cumplimiento: 93.4, mora: 4.7,  ahorro: 22.1 },
]

// Radar de salud del portafolio
const RADAR_DATA = [
  { metric: 'Cumplimiento',  value: 91 },
  { metric: 'Crecimiento',   value: 87 },
  { metric: 'Diversidad',    value: 78 },
  { metric: 'Retención',     value: 95 },
  { metric: 'Educación',     value: 82 },
  { metric: 'Rentabilidad',  value: 74 },
]

// Proyección 2026 Q3-Q4
const PROJECTION = [
  { mes: 'Abr', real: 97.6,  proyectado: null },
  { mes: 'May', real: null,   proyectado: 104.2 },
  { mes: 'Jun', real: null,   proyectado: 111.8 },
  { mes: 'Jul', real: null,   proyectado: 119.5 },
  { mes: 'Ago', real: null,   proyectado: 128.0 },
  { mes: 'Sep', real: null,   proyectado: 137.4 },
]

export default function DashboardGerencia() {
  const avgCycleCompletion = (acaps.reduce((s, a) => s + a.cycleAchieved, 0) / acaps.length).toFixed(1)
  const activeAcaps = acaps.filter(a => a.status === 'Activa').length
  const moraRate = ((credits.filter(c => c.status === 'En mora').reduce((s, c) => s + c.balance, 0) /
    credits.filter(c => c.status !== 'Pagado').reduce((s, c) => s + c.balance, 0)) * 100).toFixed(2)

  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard de Gerencia</h2>
          <p className="text-slate-500 text-sm mt-1">Análisis estratégico · Crecimiento · Impacto Social · Abril 2026</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
          <ArrowUpRight size={16} className="text-green-600" aria-hidden="true" />
          <span className="text-green-700 text-sm font-bold">Crecimiento YoY +34.2%</span>
        </div>
      </div>

      {/* KPI Cards — fila 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard icon={PiggyBank}  label="Total Ahorro"    value={fmtM(totalSavings)} bg="#1a3c6e" trend="+34.2%" comparison="vs 2024" />
        <KPICard icon={CreditCard} label="Cartera Activa"  value={fmtM(totalCredits)} bg="#1a3c6e" trend="+18.5%" comparison="vs 2024" />
        <KPICard icon={Building2}  label="ACAPs Activas"   value={`${activeAcaps} / ${totalCommunities}`} bg="#F97316" trend="+6.2%" comparison="nuevas" />
        <KPICard icon={Users}      label="Miembros"        value={totalMembers}        bg="#F97316" trend="+22.1%" comparison="vs 2024" />
      </div>

      {/* KPI Cards — fila 2 (métricas de calidad) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Cumplimiento de Ciclo', value: `${avgCycleCompletion}%`, color: '#16A34A', sub: 'Promedio todas las ACAPs' },
          { label: 'Índice de Mora',        value: `${moraRate}%`,           color: '#F59E0B', sub: 'Cartera interna' },
          { label: 'Capacitaciones',        value: '12',                     color: '#0891B2', sub: '+ 398 participantes' },
          { label: 'Proyectos Activos',     value: '14',                     color: '#8b5cf6', sub: 'De 20 aprobados' },
        ].map(({ label, value, color, sub }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-md border border-slate-100">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">{label}</p>
            <p className="text-2xl font-bold leading-tight" style={{ color }}>{value}</p>
            <p className="text-slate-400 text-xs mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Alerta IA */}
      <AlertBanner
        type="warning"
        title="Agente Analista IA"
        message="Kayetamana alcanzó 98% de cumplimiento en 3 ciclos consecutivos — se sugiere pre-aprobar crédito rotativo de $3.8M COP. Zona Sur presenta mora del 9.8%, por encima del umbral: se recomienda visita de seguimiento."
      />

      {/* Fila gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Área — Crecimiento acumulado mensual */}
        <ChartContainer title="Crecimiento Mensual Acumulado" subtitle="Últimos 6 meses · Ahorro vs Cartera (M COP)">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gAhorro" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#F97316" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gCredito" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1a3c6e" stopOpacity={0.20} />
                  <stop offset="95%" stopColor="#1a3c6e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `$${v}M`} />
              <Tooltip contentStyle={TOOLTIP} formatter={(v, n) => [`$${v}M`, n]} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="ahorro"  stroke="#F97316" fill="url(#gAhorro)"  strokeWidth={2.5} name="Ahorro"  dot={false} activeDot={{ r: 5 }} />
              <Area type="monotone" dataKey="credito" stroke="#1a3c6e" fill="url(#gCredito)" strokeWidth={2.5} name="Crédito" dot={false} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Crecimiento YoY */}
        <ChartContainer title="Evolución Anual 2023 → 2026" subtitle="Ahorro acumulado por año (M COP)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={YOY} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#475569' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `$${v}M`} />
              <Tooltip contentStyle={TOOLTIP} formatter={(v, n) => [`$${v}M`, n]} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="ahorro"  name="Ahorro"  fill="#F97316" radius={[6, 6, 0, 0]} />
              <Bar dataKey="credito" name="Crédito" fill="#1a3c6e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

      </div>

      {/* Fila 2 gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Proyección Q2-Q3 2026 */}
        <div className="lg:col-span-2">
          <ChartContainer
            title="Proyección de Ahorro — 2026"
            subtitle="Real vs proyectado (M COP) · Meta anual: $137.4M"
            action={
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                +40.8% proyectado
              </span>
            }
          >
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={PROJECTION} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `$${v}M`} domain={[90, 145]} />
                <Tooltip contentStyle={TOOLTIP} formatter={(v, n) => v ? [`$${v}M`, n] : null} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="real"        stroke="#F97316" strokeWidth={3}   dot={{ r: 5, fill: '#F97316' }} name="Real"        connectNulls={false} />
                <Line type="monotone" dataKey="proyectado"  stroke="#0891B2" strokeWidth={2.5} dot={{ r: 4, fill: '#0891B2' }} name="Proyectado"  strokeDasharray="6 3" connectNulls={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Radar salud portafolio */}
        <ChartContainer title="Salud del Portafolio" subtitle="Índice multidimensional">
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={RADAR_DATA} margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#64748b' }} />
              <Radar name="Score" dataKey="value" stroke="#F97316" fill="#F97316" fillOpacity={0.25} strokeWidth={2} />
              <Tooltip contentStyle={TOOLTIP} formatter={v => [`${v}/100`]} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>

      </div>

      {/* Comparativa por zona */}
      <ChartContainer title="Desempeño por Zona Territorial" subtitle="Cumplimiento de ciclo y mora (%)">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={ZONE_COMPLIANCE} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="zona" tick={{ fontSize: 11, fill: '#475569' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `${v}%`} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v, n) => [`${v}%`, n]} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="cumplimiento" name="Cumplimiento" fill="#16A34A" radius={[4, 4, 0, 0]} />
            <Bar dataKey="mora"         name="Mora"         fill="#F59E0B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Fila bottom: Top 5 + Miembros nuevos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top 5 ACAPs */}
        <ChartContainer title="Top 5 ACAPs por Ahorro" subtitle="Vs meta de ciclo">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={top5} layout="vertical" margin={{ top: 0, right: 40, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `$${(v/1e6).toFixed(1)}M`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} width={88} />
              <Tooltip contentStyle={TOOLTIP} formatter={(v, n) => [`$${(v/1e6).toFixed(2)}M`, n]} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="ahorro" name="Ahorro" fill="#F97316" radius={[0, 6, 6, 0]} />
              <Bar dataKey="meta"   name="Meta"   fill="#e2e8f0" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Nuevos miembros + créditos MoM */}
        <ChartContainer title="Nuevos Miembros y Créditos" subtitle="Últimos 6 meses">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={trendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={TOOLTIP} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="miembros"  name="Nuevos Miembros"  fill="#0891B2" radius={[4, 4, 0, 0]} />
              <Bar dataKey="creditos"  name="Créditos Nuevos"  fill="#F97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

      </div>

      {/* Mapa placeholder */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
        <div className="flex items-center gap-2 mb-1">
          <MapPin size={16} style={{ color: '#F97316' }} aria-hidden="true" />
          <h3 className="font-bold text-gray-900 text-base">Mapa de Impacto Territorial</h3>
          <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">Próximamente</span>
        </div>
        <p className="text-slate-500 text-sm mb-4">{activeAcaps} comunidades activas · 5 zonas · Guajira, Cesar, Magdalena, Bolívar, Atlántico</p>
        <div className="bg-slate-50 rounded-xl flex flex-col items-center justify-center gap-2 h-40 border border-dashed border-slate-200">
          <MapPin size={28} className="text-slate-300" aria-hidden="true" />
          <p className="text-slate-400 text-sm">Integración con Azure Maps — próxima fase</p>
        </div>
      </div>

    </div>
  )
}
