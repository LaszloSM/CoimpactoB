import React from 'react'
import { PiggyBank, CreditCard, Users, Building2, MapPin } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

import KPICard from './shared/KPICard'
import AlertBanner from './shared/AlertBanner'
import ChartContainer from './shared/ChartContainer'
import { monthlyTrends, acaps } from '../../data/mockData'

const fmtM = (n) => `$${(n / 1_000_000).toFixed(1)}M`

const CHART_TOOLTIP_STYLE = {
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  fontSize: '13px',
}

export default function DashboardGerencia() {
  const totalSavings   = acaps.reduce((sum, a) => sum + a.totalSaved, 0)
  const totalCommunities = acaps.length
  const totalMembers   = acaps.reduce((sum, a) => sum + a.membersCount, 0)
  const totalCredits   = 21800000

  const top5 = [...acaps]
    .sort((a, b) => b.totalSaved - a.totalSaved)
    .slice(0, 5)
    .map(a => ({ name: a.name, ahorro: a.totalSaved }))

  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard de Gerencia</h2>
        <p className="text-slate-500 text-sm mt-1">Análisis estratégico de rentabilidad e impacto social · Abril 2026</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard icon={PiggyBank}  label="Total Ahorro"    value={fmtM(totalSavings)} bg="#1a3c6e" trend="+34.2%" comparison="vs 2024" />
        <KPICard icon={CreditCard} label="Total Préstamos" value={fmtM(totalCredits)} bg="#1a3c6e" trend="+18.5%" comparison="vs 2024" />
        <KPICard icon={Building2}  label="Comunidades"     value={totalCommunities}    bg="#F97316" trend="+6.2%"  comparison="nuevas" />
        <KPICard icon={Users}      label="Miembros"        value={totalMembers}         bg="#F97316" trend="+22.1%" comparison="vs 2024" />
      </div>

      {/* Alerta IA */}
      <AlertBanner
        type="warning"
        title="Agente Analista IA"
        message="Kayetamana alcanzó 98% de cumplimiento de ciclo — se sugiere pre-aprobar crédito rotativo de $3.8M COP para fortalecer capital de trabajo."
      />

      {/* Gráficos fila 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Evolución Ahorro y Crédito */}
        <ChartContainer
          title="Evolución Ahorro y Crédito"
          subtitle="Enero – Diciembre 2025 · Crecimiento +54%"
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyTrends} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `$${(v/1e6).toFixed(1)}M`} />
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                formatter={(v, name) => [`$${(v/1e6).toFixed(2)}M`, name]}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="savings" stroke="#F97316" name="Ahorro"  strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="credits" stroke="#1a3c6e" name="Crédito" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Mapa placeholder */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={16} style={{ color: '#F97316' }} aria-hidden="true" />
            <h3 className="font-bold text-gray-900 text-base">Mapa de Impacto Territorial</h3>
          </div>
          <p className="text-slate-500 text-sm mb-4">17 comunidades activas · 7 departamentos</p>
          <div className="flex-1 bg-slate-50 rounded-xl flex flex-col items-center justify-center gap-2 min-h-[220px] border border-dashed border-slate-200">
            <MapPin size={32} className="text-slate-300" aria-hidden="true" />
            <p className="text-slate-400 text-sm">No se pudo cargar el mapa</p>
            <p className="text-slate-300 text-xs">Integración con Azure Maps — próxima fase</p>
          </div>
        </div>

      </div>

      {/* Top 5 ACAPs */}
      <ChartContainer title="Top 5 ACAPs por Ahorro" subtitle="Comunidades con mayor volumen de ahorro acumulado">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={top5} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `$${(v/1e6).toFixed(1)}M`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} width={90} />
            <Tooltip
              contentStyle={CHART_TOOLTIP_STYLE}
              formatter={(v) => [`$${(v/1e6).toFixed(2)}M`, 'Ahorro']}
            />
            <Bar dataKey="ahorro" fill="#F97316" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

    </div>
  )
}
