import React from 'react'
import { Briefcase, AlertTriangle, TrendingDown, BarChart2, ShieldCheck, FileText } from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'

import KPICard from './shared/KPICard'
import MetricCard from './shared/MetricCard'
import ChartContainer from './shared/ChartContainer'
import AlertBanner from './shared/AlertBanner'
import { acaps } from '../../data/mockData'

const CHART_TOOLTIP_STYLE = { borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '13px' }

const RATING_COLOR = { AAA: '#16A34A', AA: '#65a30d', A: '#ca8a04', BBB: '#ea580c' }
const RATING_BG    = { AAA: '#f0fdf4', AA: '#f7fee7', A: '#fefce8', BBB: '#fff7ed' }

const ACAP_RATINGS = [
  { name: 'Izshimana',   score: 94, rating: 'AAA', members: 15, savings: '$6.2M', mora: '2.1%',  pagos: '✓ Al día' },
  { name: 'Masamana',    score: 91, rating: 'AAA', members: 13, savings: '$5.2M', mora: '3.4%',  pagos: '✓ Al día' },
  { name: 'Kayetamana',  score: 98, rating: 'AAA', members: 16, savings: '$7.3M', mora: '0.8%',  pagos: '✓ Al día' },
  { name: 'Yoduijoné',   score: 87, rating: 'AA',  members: 14, savings: '$4.9M', mora: '5.2%',  pagos: '✓ Al día' },
  { name: 'Jojoncito',   score: 85, rating: 'AA',  members: 12, savings: '$4.4M', mora: '6.1%',  pagos: '1 pendiente' },
  { name: 'El Toluno',   score: 82, rating: 'A',   members: 14, savings: '$5.6M', mora: '8.7%',  pagos: '2 pendientes' },
  { name: 'Kalietamana', score: 78, rating: 'A',   members: 11, savings: '$4.0M', mora: '10.2%', pagos: '1 pendiente' },
  { name: 'Canaán',      score: 71, rating: 'BBB', members: 13, savings: '$3.8M', mora: '14.3%', pagos: '3 pendientes' },
]

const PIE_DATA = [
  { name: 'Vigente',    value: 73.8, color: '#16A34A' },
  { name: 'En Riesgo',  value: 16.4, color: '#F59E0B' },
  { name: 'Vencida',    value: 9.8,  color: '#EF4444' },
]

const BENCHMARK_DATA = [
  { name: 'Credimpacto',            mora: 9.79,  fill: '#F97316' },
  { name: 'Prom. Microfinanciero',  mora: 14.5,  fill: '#94a3b8' },
  { name: 'Sector Bancario',        mora: 4.2,   fill: '#1a3c6e' },
]

export default function DashboardEmpresasBancos() {
  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Due Diligence · Cartera</h2>
          <p className="text-slate-500 text-sm mt-1">Vista para instituciones financieras y aliados · Abril 2026</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-95 shrink-0"
          style={{ backgroundColor: '#1a3c6e' }}
        >
          <FileText size={15} aria-hidden="true" />
          Solicitar Informe
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard icon={Briefcase}     label="Cartera Externa"     value="$24.3M"  bg="#1a3c6e" trend="+12%" comparison="vs 2024" />
        <KPICard icon={AlertTriangle} label="% Cartera en Riesgo" value="9.79%"   bg="#F59E0B" trend="-0.3%" comparison="vs mar" />
        <KPICard icon={TrendingDown}  label="Índice de Mora"      value="9.79%"   bg="#ea580c" trend="-0.5%" comparison="vs 2024" />
        <KPICard icon={BarChart2}     label="ROI Social Estimado" value="3.2×"    bg="#0891B2" trend="+12%"  comparison="vs 2024" />
      </div>

      {/* Alerta */}
      <AlertBanner
        type="info"
        title="Gobernanza de Datos"
        message="Completitud del repositorio: 87.4% — Pendiente validación de 3 comunidades para auditoría completa."
      />

      {/* Tabla de Ratings */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <ShieldCheck size={18} style={{ color: '#1a3c6e' }} aria-hidden="true" />
          <h3 className="font-bold text-gray-900 text-base">Rating por Comunidad ACAP</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Comunidad', 'Score IA', 'Rating', 'Miembros', 'Ahorro', '% Mora', 'Pagos'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ACAP_RATINGS.map((row) => (
                <tr key={row.name} className="hover:bg-slate-50 transition-colors duration-100">
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{row.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${row.score}%`, backgroundColor: RATING_COLOR[row.rating] }}
                        />
                      </div>
                      <span className="text-slate-700 font-medium">{row.score}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: RATING_BG[row.rating], color: RATING_COLOR[row.rating] }}
                    >
                      {row.rating}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.members}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{row.savings}</td>
                  <td className="px-4 py-3">
                    <span style={{ color: parseFloat(row.mora) > 10 ? '#EF4444' : parseFloat(row.mora) > 6 ? '#F59E0B' : '#16A34A' }}
                      className="font-medium">
                      {row.mora}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{row.pagos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gráficos fila */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Distribución de Cartera */}
        <ChartContainer title="Distribución de Cartera" subtitle="Estado actual de la cartera externa">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={PIE_DATA}
                cx="50%"
                cy="45%"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {PIE_DATA.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                formatter={(v) => [`${v}%`]}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Benchmark Sectorial */}
        <ChartContainer title="Benchmark Sectorial — Índice de Mora" subtitle="Comparativa porcentual">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={BENCHMARK_DATA} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={(v) => [`${v}%`, 'Mora']} />
              <Bar dataKey="mora" radius={[6, 6, 0, 0]}>
                {BENCHMARK_DATA.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

      </div>

      {/* Métricas de gobernanza */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard label="Completitud datos" value="87.4%" sublabel="3 comunidades pendientes" accent="#1a3c6e" />
        <MetricCard label="Fuentes verificadas" value="12 / 14"  sublabel="BanColombia, USAID, etc." accent="#0891B2" />
        <MetricCard label="Última auditoría"   value="Mar 2026" sublabel="Próxima: Jun 2026" />
        <MetricCard label="Alertas activas"    value="2"        sublabel="Requieren acción" accent="#F59E0B" />
      </div>

    </div>
  )
}
