import React from 'react'
import {
  Briefcase, BarChart2, ShieldCheck, FileText, Star,
  TrendingUp, Globe, HeartHandshake, Leaf, Award, ArrowUpRight,
} from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, AreaChart, Area,
} from 'recharts'

import KPICard from './shared/KPICard'
import MetricCard from './shared/MetricCard'
import ChartContainer from './shared/ChartContainer'
import AlertBanner from './shared/AlertBanner'

const TOOLTIP = { borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '13px' }

// ─── Datos ────────────────────────────────────────────────────────────────

const ACAP_RATINGS = [
  { name: 'Kayetamana',  score: 98, rating: 'AAA', members: 16, savings: '$7.3M', mora: '0.8%',  pagos: 'Al día',    trend: '+101%' },
  { name: 'Izshimana',   score: 94, rating: 'AAA', members: 15, savings: '$6.2M', mora: '2.1%',  pagos: 'Al día',    trend: '+94%'  },
  { name: 'Masamana',    score: 91, rating: 'AAA', members: 13, savings: '$5.2M', mora: '3.4%',  pagos: 'Al día',    trend: '+87%'  },
  { name: 'Yoduijoné',   score: 87, rating: 'AA',  members: 14, savings: '$4.9M', mora: '5.2%',  pagos: 'Al día',    trend: '+74%'  },
  { name: 'Jojoncito',   score: 85, rating: 'AA',  members: 12, savings: '$4.4M', mora: '6.1%',  pagos: '1 pendiente', trend: '+68%' },
  { name: 'El Toluno',   score: 82, rating: 'A',   members: 14, savings: '$5.6M', mora: '8.7%',  pagos: '2 pendientes', trend: '+62%' },
  { name: 'Kalietamana', score: 78, rating: 'A',   members: 11, savings: '$4.0M', mora: '10.2%', pagos: '1 pendiente', trend: '+55%' },
  { name: 'Canaán',      score: 71, rating: 'BBB', members: 13, savings: '$3.8M', mora: '14.3%', pagos: '3 pendientes', trend: '+42%' },
]

const RATING_COLOR = { AAA: '#16A34A', AA: '#65a30d', A: '#ca8a04', BBB: '#ea580c' }
const RATING_BG    = { AAA: '#f0fdf4', AA: '#f7fee7', A: '#fefce8', BBB: '#fff7ed' }

const PIE_DATA = [
  { name: 'Vigente',   value: 73.8, color: '#16A34A' },
  { name: 'En Riesgo', value: 16.4, color: '#F59E0B' },
  { name: 'Vencida',   value: 9.8,  color: '#EF4444' },
]

const BENCHMARK_DATA = [
  { name: 'Credimpacto',           mora: 9.79, fill: '#F97316' },
  { name: 'Prom. Microfinanciero', mora: 14.5, fill: '#94a3b8' },
  { name: 'Sector Bancario',       mora: 4.2,  fill: '#1a3c6e' },
]

// Crecimiento histórico de la cartera
const PORTFOLIO_GROWTH = [
  { year: '2023', cartera: 9.4,  ahorro: 38.2, miembros: 142 },
  { year: '2024', cartera: 15.7, ahorro: 62.8, miembros: 189 },
  { year: '2025', cartera: 28.3, ahorro: 82.1, miembros: 224 },
  { year: '2026', cartera: 39.4, ahorro: 97.6, miembros: 246 },
]

// ROI social estimado
const ROI_BREAKDOWN = [
  { categoria: 'Generación de empleo',  valor: 0.8  },
  { categoria: 'Reducción de pobreza',  valor: 1.1  },
  { categoria: 'Empoderamiento femenino', valor: 0.7 },
  { categoria: 'Educación financiera',  valor: 0.4  },
  { categoria: 'Ecosistema productivo', valor: 0.2  },
]

// ODS alineados
const ODS = [
  { num: '1',  label: 'Sin Pobreza',          color: '#E5243B' },
  { num: '5',  label: 'Igualdad de Género',   color: '#FF3A21' },
  { num: '8',  label: 'Trabajo Decente',      color: '#A21942' },
  { num: '10', label: 'Reducir Desigualdad',  color: '#DD1367' },
  { num: '17', label: 'Alianzas',             color: '#19486A' },
]

export default function DashboardEmpresasBancos() {
  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* Hero header — estilo pitch */}
      <div
        className="rounded-2xl p-8 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a3c6e 0%, #0d2240 100%)' }}
      >
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">
                Oportunidad de Inversión · Due Diligence
              </p>
              <h2 className="text-3xl font-bold mb-2">Credimpacto — Portafolio 2026</h2>
              <p className="text-white/70 text-sm max-w-xl">
                Plataforma de microfinanzas con impacto social certificado en comunidades rurales de Colombia.
                Cartera en crecimiento sostenido, baja mora y alto retorno social medible.
              </p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ backgroundColor: '#F97316' }}
              >
                <FileText size={15} aria-hidden="true" />
                Solicitar Informe Completo
              </button>
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200 bg-white/10 hover:bg-white/20 border border-white/20"
              >
                <HeartHandshake size={15} aria-hidden="true" />
                Agendar Reunión
              </button>
            </div>
          </div>

          {/* Mini KPIs inline */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
            {[
              { label: 'Cartera Total',     value: '$39.4M', sub: '+150% en 3 años' },
              { label: 'Ahorro Acumulado',  value: '$97.6M', sub: '+156% en 3 años' },
              { label: 'ROI Social',        value: '3.2×',   sub: 'Por cada $1 invertido' },
              { label: 'Mora',              value: '9.79%',  sub: 'vs 14.5% prom. sector' },
            ].map(({ label, value, sub }) => (
              <div key={label}>
                <p className="text-white/50 text-xs mb-0.5">{label}</p>
                <p className="text-white font-bold text-xl">{value}</p>
                <p className="text-white/50 text-xs">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards operativos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard icon={Briefcase}  label="Cartera Externa"      value="$24.3M" bg="#1a3c6e" trend="+12%"  comparison="vs 2024" />
        <KPICard icon={BarChart2}  label="ROI Social Estimado"  value="3.2×"   bg="#16A34A" trend="+12%"  comparison="vs 2024" />
        <KPICard icon={TrendingUp} label="CAGR Cartera"         value="62%"    bg="#0891B2" trend="3 años" />
        <KPICard icon={Star}       label="ACAPs Rating AAA"     value="3 / 18" bg="#F97316" trend="+1"    comparison="vs 2024" />
      </div>

      {/* Tesis de inversión */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: TrendingUp,
            title: 'Crecimiento Comprobado',
            body: 'Cartera creció 318% en 3 años (2023→2026). Ahorro acumulado +156%. 18 ACAPs activas con cumplimiento promedio del 93.8%.',
            color: '#16A34A',
            bg: '#f0fdf4',
          },
          {
            icon: Globe,
            title: 'Mercado Desatendido',
            body: '246 mujeres rurales sin acceso a banca formal. Modelo probado replicable a +200 comunidades en Colombia y Latinoamérica.',
            color: '#0891B2',
            bg: '#eff6ff',
          },
          {
            icon: Leaf,
            title: 'Impacto Medible',
            body: 'Alineado a 5 ODS. ROI social de 3.2× documentado. Reducción de dependencia del crédito informal en un 67% en comunidades activas.',
            color: '#8b5cf6',
            bg: '#f5f3ff',
          },
        ].map(({ icon: Icon, title, body, color, bg }) => (
          <div key={title} className="rounded-2xl p-6 border border-slate-100 shadow-sm" style={{ backgroundColor: bg }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18` }}>
                <Icon size={18} style={{ color }} aria-hidden="true" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      {/* Gráficos crecimiento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Crecimiento portafolio histórico */}
        <ChartContainer title="Crecimiento del Portafolio" subtitle="Cartera + Ahorro 2023 → 2026 (M COP)">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={PORTFOLIO_GROWTH} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gCar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1a3c6e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1a3c6e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gAh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#F97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#475569' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `$${v}M`} />
              <Tooltip contentStyle={TOOLTIP} formatter={(v, n) => [`$${v}M`, n]} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="cartera" name="Cartera" stroke="#1a3c6e" fill="url(#gCar)" strokeWidth={2.5} dot={{ r: 4 }} />
              <Area type="monotone" dataKey="ahorro"  name="Ahorro"  stroke="#F97316" fill="url(#gAh)"  strokeWidth={2.5} dot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Distribución cartera */}
        <ChartContainer title="Calidad de Cartera" subtitle="Distribución por estado · Abril 2026">
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="55%" height={240}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="45%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value">
                  {PIE_DATA.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={TOOLTIP} formatter={v => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {PIE_DATA.map(({ name, value, color }) => (
                <div key={name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-600">{name}</span>
                    <span className="text-sm font-bold" style={{ color }}>{value}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="h-2 rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartContainer>

      </div>

      {/* Benchmark + ROI Social */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <ChartContainer title="Benchmark Sectorial — Índice de Mora" subtitle="Credimpacto vs promedio microfinanciero vs banca">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={BENCHMARK_DATA} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={TOOLTIP} formatter={v => [`${v}%`, 'Mora']} />
              <Bar dataKey="mora" radius={[6, 6, 0, 0]} label={{ position: 'top', fontSize: 12, fontWeight: 700 }}>
                {BENCHMARK_DATA.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Desglose del ROI Social (3.2×)" subtitle="Valor generado por categoría de impacto">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ROI_BREAKDOWN} layout="vertical" margin={{ top: 0, right: 40, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `${v}×`} />
              <YAxis type="category" dataKey="categoria" tick={{ fontSize: 11, fill: '#475569' }} width={140} />
              <Tooltip contentStyle={TOOLTIP} formatter={v => [`${v}×`, 'ROI social']} />
              <Bar dataKey="valor" radius={[0, 6, 6, 0]} label={{ position: 'right', fontSize: 11, fill: '#64748b', formatter: v => `${v}×` }}>
                {ROI_BREAKDOWN.map((_, i) => (
                  <Cell key={i} fill={['#16A34A', '#0891B2', '#F97316', '#8b5cf6', '#F59E0B'][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

      </div>

      {/* Rating table — compacto */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <ShieldCheck size={18} style={{ color: '#1a3c6e' }} aria-hidden="true" />
          <h3 className="font-bold text-gray-900 text-base">Rating por Comunidad ACAP</h3>
          <span className="ml-auto text-xs text-slate-400">Calificación basada en Score IA multidimensional</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Comunidad', 'Score IA', 'Rating', 'Miembros', 'Ahorro', '% Mora', 'Pagos', 'Tendencia'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ACAP_RATINGS.map((row) => (
                <tr key={row.name} className="hover:bg-slate-50 transition-colors duration-100">
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{row.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-14 bg-slate-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full" style={{ width: `${row.score}%`, backgroundColor: RATING_COLOR[row.rating] }} />
                      </div>
                      <span className="text-slate-700 font-medium text-xs">{row.score}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: RATING_BG[row.rating], color: RATING_COLOR[row.rating] }}>
                      {row.rating}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.members}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{row.savings}</td>
                  <td className="px-4 py-3">
                    <span style={{ color: parseFloat(row.mora) > 10 ? '#EF4444' : parseFloat(row.mora) > 6 ? '#F59E0B' : '#16A34A' }} className="font-medium">{row.mora}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{row.pagos}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-green-600 font-semibold text-xs">
                      <ArrowUpRight size={12} aria-hidden="true" />{row.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ODS + Gobernanza + CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ODS */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Leaf size={16} style={{ color: '#16A34A' }} aria-hidden="true" />
            <h3 className="font-bold text-gray-900 text-base">ODS Alineados</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {ODS.map(({ num, label, color }) => (
              <div key={num} className="flex items-center gap-2 rounded-xl px-3 py-2 text-white text-xs font-bold" style={{ backgroundColor: color }}>
                <span className="text-lg font-black">{num}</span>
                <span className="leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gobernanza */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Award size={16} style={{ color: '#0891B2' }} aria-hidden="true" />
            <h3 className="font-bold text-gray-900 text-base">Gobernanza de Datos</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Completitud repositorio', value: '87.4%', color: '#16A34A' },
              { label: 'Auditorías al día',        value: '100%',  color: '#16A34A' },
              { label: 'Fuentes verificadas',      value: '12/14', color: '#0891B2' },
              { label: 'Score transparencia',      value: '91/100', color: '#F97316' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">{label}</span>
                <span className="font-bold text-sm" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className="rounded-2xl p-6 text-white flex flex-col justify-between"
          style={{ background: 'linear-gradient(135deg, #F97316 0%, #ea580c 100%)' }}
        >
          <div>
            <h3 className="font-bold text-lg mb-2">¿Listo para invertir?</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Acceda al informe completo de due diligence con proyecciones financieras, auditoría social y plan de expansión 2027.
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <button className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white font-bold text-sm cursor-pointer transition-all hover:bg-white/90 active:scale-95" style={{ color: '#F97316' }}>
              <FileText size={15} aria-hidden="true" />
              Descargar Due Diligence
            </button>
            <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/20 border border-white/30 font-semibold text-sm cursor-pointer transition-all hover:bg-white/30">
              <HeartHandshake size={15} aria-hidden="true" />
              Hablar con el equipo
            </button>
          </div>
        </div>

      </div>

    </div>
  )
}
