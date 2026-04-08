import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import {
  FileSpreadsheet, ClipboardList, BarChart2, Brain, Database,
  MessageCircle, Zap, Upload, Wand2, FolderCheck, TrendingUp,
  Users, MapPin, PiggyBank, CreditCard, ArrowRight, CheckCircle,
  AlertTriangle, Sparkles, ChevronRight, Activity, Target,
  Shield, Globe,
} from 'lucide-react'

// ─── DATA ────────────────────────────────────────────────────────────────────

const timelineData = [
  { año: '2023', ahorro: 7214, credito: 1830 },
  { año: '2024', ahorro: 12223, credito: 1300 },
  { año: '2025', ahorro: 78136, credito: 12680 },
]

const acapData = [
  { acap: 'Izshimana', ahorro: 31 },
  { acap: 'Masamana',  ahorro: 15 },
  { acap: 'Yoduijoné', ahorro: 9 },
  { acap: 'Jojoncito', ahorro: 8 },
  { acap: 'Kayetamana', ahorro: 7 },
]

const kpis = [
  { label: 'Total Ahorro', value: '$97.5M', sub: 'COP millones', icon: PiggyBank, color: 'bg-brand-navy', textColor: 'text-white' },
  { label: 'Préstamos Internos', value: '$21.8M', sub: 'COP millones', icon: CreditCard, color: 'bg-brand-orange', textColor: 'text-white' },
  { label: 'Total Miembros', value: '246', sub: 'personas activas', icon: Users, color: 'bg-brand-green', textColor: 'text-white' },
  { label: 'Comunidades', value: '17', sub: 'comunidades activas', icon: MapPin, color: 'bg-brand-teal', textColor: 'text-white' },
]

const agents = [
  {
    icon: MessageCircle,
    title: 'Agente de Ingestión',
    desc: 'Captura datos desde WhatsApp con NLP. Los usuarios reportan ahorros y pagos con un simple mensaje de texto.',
    color: 'border-brand-orange',
    bg: 'bg-orange-50',
    iconBg: 'bg-brand-orange',
  },
  {
    icon: Wand2,
    title: 'Agente de Limpieza',
    desc: 'Normaliza y centraliza datos de múltiples fuentes (KoboToolbox, Google Forms, Excel) en un Data Lakehouse unificado.',
    color: 'border-brand-teal',
    bg: 'bg-cyan-50',
    iconBg: 'bg-brand-teal',
  },
  {
    icon: FolderCheck,
    title: 'Clasificador de Proyectos',
    desc: 'Evalúa viabilidad y genera scoring crediticio automático según comportamiento de ahorro, historial y categoría de proyecto.',
    color: 'border-brand-navy',
    bg: 'bg-blue-50',
    iconBg: 'bg-brand-navy',
  },
  {
    icon: TrendingUp,
    title: 'Analista de Impacto',
    desc: 'Genera insights predictivos, detecta riesgo de mora en tiempo real y envía notificaciones automáticas de pago vía WhatsApp.',
    color: 'border-brand-green',
    bg: 'bg-green-50',
    iconBg: 'bg-brand-green',
  },
]

const roadmapPhases = [
  { phase: '0', title: 'Diagnóstico y Arquitectura', desc: 'Mapeo de fuentes de datos, diseño del Data Lakehouse y definición de KPIs.', color: 'bg-gray-500' },
  { phase: '1', title: 'MVP WhatsApp + Ingestión', desc: 'Bot básico de WhatsApp, primer pipeline de datos automático para una comunidad piloto.', color: 'bg-brand-teal' },
  { phase: '2', title: 'Data Lakehouse + Scoring', desc: 'Centralización total de datos, modelo de scoring crediticio y calificación de proyectos.', color: 'bg-brand-orange' },
  { phase: '3', title: 'Dashboard Inteligente + Alertas', desc: 'Dashboard en tiempo real, alertas de mora automáticas, reportes de cartera con un clic.', color: 'bg-brand-navy' },
  { phase: '4', title: 'Gobernanza Avanzada + IA Predictiva', desc: 'Predicción de demanda de crédito, identificación de comunidades con mayor potencial de crecimiento.', color: 'bg-brand-green' },
]

const okrs = [
  { metric: '80%', label: 'Reducción tiempo de reporte', icon: Activity },
  { metric: '+40%', label: 'Precisión del scoring crediticio', icon: Target },
  { metric: '-25%', label: 'Reducción índice de morosidad', icon: Shield },
  { metric: '100%', label: 'Datos centralizados y trazables', icon: Globe },
]

// ─── CUSTOM TOOLTIP ──────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm font-body">
        <p className="font-semibold text-brand-text mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }} className="text-xs">
            {p.name}: <span className="font-bold">${(p.value / 1000).toFixed(1)}M</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

const BarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm font-body">
        <p className="font-semibold text-brand-text">{label}</p>
        <p className="text-brand-orange font-bold">${payload[0].value}M COP</p>
      </div>
    )
  }
  return null
}

// ─── SECTION WRAPPER ─────────────────────────────────────────────────────────

const Section = ({ id, className = '', children }) => (
  <section id={id} className={`w-full px-4 sm:px-6 lg:px-12 ${className}`}>
    {children}
  </section>
)

const SectionHeader = ({ tag, title, subtitle }) => (
  <div className="text-center mb-10 md:mb-14">
    {tag && (
      <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-orange-100 text-brand-orange">
        {tag}
      </span>
    )}
    <h2 className="font-heading text-3xl md:text-4xl text-brand-navy leading-tight">{title}</h2>
    {subtitle && <p className="mt-3 text-gray-500 font-body max-w-2xl mx-auto text-sm md:text-base">{subtitle}</p>}
  </div>
)

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function DashboardPitch() {
  const [activeInsight, setActiveInsight] = useState(true)
  const [activePhase, setActivePhase] = useState(null)

  return (
    <div className="min-h-screen bg-brand-light font-body text-brand-text">

      {/* ── NAV ───────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-brand-orange flex items-center justify-center">
              <span className="text-white text-xs font-bold">C</span>
            </div>
            <span className="font-heading text-brand-navy text-lg">Cred<span className="text-brand-orange">impacto</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-500 font-medium">
            <a href="#problema" className="hover:text-brand-orange transition-colors duration-150">Problema</a>
            <a href="#agentes" className="hover:text-brand-orange transition-colors duration-150">Solución IA</a>
            <a href="#dashboard" className="hover:text-brand-orange transition-colors duration-150">Dashboard</a>
            <a href="#roadmap" className="hover:text-brand-orange transition-colors duration-150">Roadmap</a>
          </div>
          <a
            href="#roadmap"
            className="px-4 py-2 rounded-full bg-brand-orange text-white text-sm font-semibold hover:bg-orange-500 transition-colors duration-200 cursor-pointer"
          >
            Iniciar Transformación
          </a>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        className="relative pt-14 min-h-screen flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a3c6e 0%, #1a5276 40%, #0e7490 70%, #F97316 130%)' }}
      >
        {/* background grid */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20 md:py-28">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            {/* Left text */}
            <div className="flex-1 text-center lg:text-left animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium">
                <Sparkles size={14} className="text-brand-orange" />
                Ecosistema Inteligente de Datos · CoimpactoB
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.1] mb-6">
                De Reportes<br />
                <span className="text-brand-orange">Aislados</span> a<br />
                Inteligencia<br />
                <span className="text-emerald-400">Continua</span>
              </h1>

              <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-xl mb-8">
                Ecosistema Inteligente de Gestión y Análisis de Datos para <strong className="text-white">Coimpacto B</strong>.
                Del seguimiento manual al impacto medido en tiempo real.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="#problema"
                  className="px-6 py-3 rounded-full bg-brand-orange text-white font-semibold hover:bg-orange-400 transition-all duration-200 hover:scale-105 flex items-center gap-2 justify-center cursor-pointer"
                >
                  Ver la propuesta <ChevronRight size={16} />
                </a>
                <a
                  href="#dashboard"
                  className="px-6 py-3 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-200 flex items-center gap-2 justify-center cursor-pointer"
                >
                  Ver el Dashboard <BarChart2 size={16} />
                </a>
              </div>
            </div>

            {/* Right stat cards */}
            <div className="flex-none grid grid-cols-2 gap-4 animate-slide-up">
              {[
                { label: 'Total Ahorro', value: '$97.5M', unit: 'COP mill.', icon: PiggyBank, bg: 'bg-white/15' },
                { label: 'Préstamos', value: '$21.8M', unit: 'COP mill.', icon: CreditCard, bg: 'bg-brand-orange/80' },
                { label: 'Miembros', value: '246', unit: 'personas', icon: Users, bg: 'bg-white/15' },
                { label: 'Comunidades', value: '17', unit: 'activas', icon: MapPin, bg: 'bg-emerald-500/70' },
              ].map((s) => (
                <div key={s.label} className={`${s.bg} backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-white min-w-[140px]`}>
                  <s.icon size={20} className="mb-2 opacity-80" />
                  <p className="font-heading text-2xl font-bold">{s.value}</p>
                  <p className="text-xs opacity-70 mt-0.5">{s.unit}</p>
                  <p className="text-xs opacity-50 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#F8FAFC" />
          </svg>
        </div>
      </section>

      {/* ── PROBLEMA vs SOLUCIÓN ──────────────────────────────────────────── */}
      <Section id="problema" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            tag="El Problema"
            title="De la Reactividad a la Proactividad"
            subtitle="Hoy Credimpacto opera con herramientas fragmentadas. La oportunidad es transformar esos silos en inteligencia accionable."
          />

          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-stretch">

            {/* ACTUAL */}
            <div className="bg-white rounded-3xl border border-red-100 shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-red-400">Estado Actual</p>
                  <h3 className="font-heading text-xl text-brand-text">Datos Dispersos</h3>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  { icon: FileSpreadsheet, text: 'Excel y Google Sheets manuales por cada ACAP', sub: 'Riesgo de errores humanos constante' },
                  { icon: ClipboardList, text: 'Formularios en papel y KoboToolbox sin integrar', sub: 'Datos atrapados en silos separados' },
                  { icon: BarChart2, text: 'Power BI estático, sin alertas ni predicciones', sub: 'Reportes históricos, sin acción inmediata' },
                  { icon: MessageCircle, text: 'Seguimiento de cartera vía llamadas telefónicas', sub: 'Proceso lento, no escalable' },
                ].map((item) => (
                  <li key={item.text} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon size={15} className="text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-brand-text">{item.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-red-50">
                <p className="text-xs text-red-400 font-semibold uppercase tracking-wider">Resultado</p>
                <p className="text-sm text-gray-500 mt-1">Decisiones lentas · Mora invisible · Oportunidades perdidas</p>
              </div>
            </div>

            {/* ARROW */}
            <div className="flex items-center justify-center">
              <div className="flex flex-col md:flex-row items-center gap-2">
                <div className="hidden md:block w-px h-full md:h-px md:w-full bg-gray-200" />
                <div className="w-12 h-12 rounded-full bg-brand-orange flex items-center justify-center shadow-lg shadow-orange-200 flex-shrink-0">
                  <ArrowRight size={20} className="text-white md:block hidden" />
                  <ArrowRight size={20} className="text-white rotate-90 md:hidden" />
                </div>
                <div className="hidden md:block w-px h-full md:h-px md:w-full bg-gray-200" />
              </div>
            </div>

            {/* FUTURO */}
            <div className="bg-white rounded-3xl border border-green-100 shadow-sm p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-50 to-transparent rounded-bl-full" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Sparkles size={20} className="text-brand-green" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-green">Visión Futura</p>
                  <h3 className="font-heading text-xl text-brand-text">Inteligencia Continua</h3>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  { icon: Database, text: 'Data Lakehouse centralizado en la nube', sub: 'Una sola fuente de verdad, siempre actualizada' },
                  { icon: Brain, text: 'Agentes de IA que procesan y clasifican datos', sub: 'Automatización de scoring y análisis de proyectos' },
                  { icon: MessageCircle, text: 'Bot de WhatsApp para reporte y notificaciones', sub: 'Usuarios reportan con un mensaje, reciben alertas al instante' },
                  { icon: Zap, text: 'Alertas predictivas de mora y crédito', sub: 'Acción antes de que el problema ocurra' },
                ].map((item) => (
                  <li key={item.text} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon size={15} className="text-brand-green" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-brand-text">{item.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-green-50">
                <p className="text-xs text-brand-green font-semibold uppercase tracking-wider">Resultado</p>
                <p className="text-sm text-gray-500 mt-1">Decisiones en segundos · Mora detectada antes · Impacto máximo</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── AGENTES DE IA ─────────────────────────────────────────────────── */}
      <section id="agentes" className="py-20 md:py-28 bg-brand-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-12">
            <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-orange-100/10 text-brand-orange border border-brand-orange/20">
              Motor del Cambio
            </span>
            <h2 className="font-heading text-3xl md:text-4xl text-white leading-tight">
              Los 4 Agentes de IA
            </h2>
            <p className="mt-3 text-white/50 max-w-xl mx-auto text-sm md:text-base">
              Cada agente es un especialista autónomo que opera en el ecosistema inteligente, trabajando en paralelo las 24 horas.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {agents.map((agent, i) => (
              <div
                key={agent.title}
                className={`bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all duration-250 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 cursor-default group`}
              >
                <div className={`w-12 h-12 rounded-xl ${agent.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}>
                  <agent.icon size={22} className="text-white" />
                </div>
                <div className="w-6 h-0.5 bg-white/20 mb-3" />
                <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Agente {i + 1}</p>
                <h3 className="font-heading text-white text-lg leading-snug mb-3">{agent.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{agent.desc}</p>
              </div>
            ))}
          </div>

          {/* Architecture mini-diagram */}
          <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5 text-center">Flujo de Datos del Ecosistema</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0 text-center flex-wrap">
              {[
                { label: 'WhatsApp / KoboToolbox / Forms', icon: Upload, color: 'bg-brand-orange' },
                null,
                { label: 'Agentes NLP + Limpieza', icon: Wand2, color: 'bg-brand-teal' },
                null,
                { label: 'Data Lakehouse (Cloud)', icon: Database, color: 'bg-brand-navy border border-white/20' },
                null,
                { label: 'Dashboard + Alertas IA', icon: Zap, color: 'bg-brand-green' },
              ].map((item, idx) =>
                item === null ? (
                  <div key={idx} className="hidden md:flex items-center px-2">
                    <ArrowRight size={16} className="text-white/30" />
                  </div>
                ) : (
                  <div key={item.label} className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                      <item.icon size={18} className="text-white" />
                    </div>
                    <p className="text-white/60 text-xs max-w-[100px] leading-snug">{item.label}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── SMART DASHBOARD ───────────────────────────────────────────────── */}
      <Section id="dashboard" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            tag="Prototipo Inteligente"
            title="Smart Dashboard — Credimpacto"
            subtitle="Una versión modernizada de los datos actuales, enriquecida con Inteligencia Artificial. Esto es lo que Power BI nunca pudo darte."
          />

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpis.map((kpi) => (
              <div key={kpi.label} className={`${kpi.color} ${kpi.textColor} rounded-2xl p-5 shadow-md`}>
                <kpi.icon size={20} className="mb-3 opacity-80" />
                <p className="font-heading text-2xl md:text-3xl font-bold">{kpi.value}</p>
                <p className="text-xs opacity-70 mt-0.5">{kpi.sub}</p>
                <p className="text-sm font-medium mt-2 opacity-90">{kpi.label}</p>
              </div>
            ))}
          </div>

          {/* AI Insight Banner */}
          {activeInsight && (
            <div className="mb-8 relative bg-gradient-to-r from-amber-50 to-orange-50 border border-brand-orange/30 rounded-2xl p-5 flex items-start gap-4">
              <div className="flex-shrink-0 flex items-center gap-2">
                <span className="flex w-2.5 h-2.5 rounded-full bg-brand-orange animate-pulse-slow" />
                <Brain size={20} className="text-brand-orange" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-orange mb-1">Insight generado por IA · Ahora mismo</p>
                <p className="text-sm text-brand-text leading-relaxed">
                  El <strong>Agente Analista</strong> detecta que la comunidad <strong>'Kayetamana'</strong> tiene un <strong>98% de cumplimiento</strong> en pagos durante los últimos 3 ciclos.
                  Se sugiere <span className="text-brand-green font-semibold">pre-aprobar un nuevo crédito rotativo por $3,800,000 COP</span>.
                  Además, 2 miembros de <strong>'Yoduijoné'</strong> presentan riesgo de mora — se programó notificación automática vía WhatsApp.
                </p>
              </div>
              <button
                onClick={() => setActiveInsight(false)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-150 text-xs cursor-pointer"
                aria-label="Cerrar insight"
              >
                ✕
              </button>
            </div>
          )}

          {/* Charts grid */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* Line Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="font-heading text-brand-navy text-lg">Línea de Tiempo Ahorro y Crédito</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Miles de COP · 2023 – 2025</p>
                </div>
                <span className="px-2 py-1 rounded-full bg-blue-50 text-brand-navy text-xs font-semibold">+545% ahorro</span>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={timelineData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="año" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}M`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                  <Line type="monotone" dataKey="ahorro" name="Ahorro" stroke="#1a3c6e" strokeWidth={2.5} dot={{ r: 5, fill: '#1a3c6e' }} activeDot={{ r: 7 }} />
                  <Line type="monotone" dataKey="credito" name="Crédito" stroke="#F97316" strokeWidth={2.5} dot={{ r: 5, fill: '#F97316' }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="font-heading text-brand-navy text-lg">Ahorro por ACAP (Top 5)</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Millones COP · Ciclo actual</p>
                </div>
                <span className="px-2 py-1 rounded-full bg-orange-50 text-brand-orange text-xs font-semibold">17 comunidades</span>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={acapData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="acap" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `$${v}M`} />
                  <Tooltip content={<BarTooltip />} />
                  <Bar dataKey="ahorro" name="Ahorro" fill="#F97316" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Portfolio health row */}
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Cartera Total', value: '$24.3M', change: '+12%', color: 'text-brand-navy', bg: 'bg-blue-50' },
              { label: 'Cartera al Día', value: '$21.9M', change: '90.2%', color: 'text-brand-green', bg: 'bg-green-50' },
              { label: 'Cartera Vencida', value: '9.79%', change: 'Reducible con IA', color: 'text-red-500', bg: 'bg-red-50' },
            ].map((m) => (
              <div key={m.label} className={`${m.bg} rounded-2xl p-5 flex justify-between items-center`}>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{m.label}</p>
                  <p className={`font-heading text-2xl font-bold mt-1 ${m.color}`}>{m.value}</p>
                </div>
                <span className="text-xs font-semibold text-gray-400 bg-white px-2 py-1 rounded-full">{m.change}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── ROADMAP ───────────────────────────────────────────────────────── */}
      <section id="roadmap" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <SectionHeader
            tag="Hoja de Ruta"
            title="5 Fases hacia la Inteligencia Continua"
            subtitle="Un camino claro y progresivo. Cada fase agrega valor independiente — sin necesidad de esperar al final para ver resultados."
          />

          {/* Phases */}
          <div className="relative">
            {/* connecting line desktop */}
            <div className="hidden lg:block absolute top-8 left-[calc(10%-8px)] right-[calc(10%-8px)] h-0.5 bg-gray-200 z-0" />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative z-10">
              {roadmapPhases.map((p, i) => (
                <div
                  key={p.phase}
                  className={`group relative bg-white rounded-2xl border-2 transition-all duration-250 cursor-pointer p-5 ${activePhase === i ? 'border-brand-orange shadow-lg shadow-orange-100' : 'border-gray-100 hover:border-brand-orange/40 hover:shadow-md'}`}
                  onClick={() => setActivePhase(activePhase === i ? null : i)}
                >
                  <div className={`w-9 h-9 rounded-full ${p.color} text-white flex items-center justify-center text-sm font-bold mb-4 mx-auto lg:mx-0`}>
                    {p.phase}
                  </div>
                  <h4 className="font-heading text-brand-navy text-base leading-snug mb-2 text-center lg:text-left">{p.title}</h4>
                  <p className={`text-xs text-gray-500 leading-relaxed text-center lg:text-left transition-all duration-200 ${activePhase === i ? 'block' : 'hidden lg:block'}`}>
                    {p.desc}
                  </p>
                  {i < roadmapPhases.length - 1 && (
                    <CheckCircle size={14} className="absolute top-4 right-4 text-gray-200 group-hover:text-brand-orange/40 transition-colors duration-200" />
                  )}
                  {i === roadmapPhases.length - 1 && (
                    <Sparkles size={14} className="absolute top-4 right-4 text-brand-orange" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* OKRs */}
          <div className="mt-16">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-8">Métricas de Éxito (OKRs)</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {okrs.map((o) => (
                <div key={o.label} className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-md hover:border-brand-orange/20 transition-all duration-200">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-3">
                    <o.icon size={18} className="text-brand-orange" />
                  </div>
                  <p className="font-heading text-3xl text-brand-navy font-bold">{o.metric}</p>
                  <p className="text-xs text-gray-500 mt-1.5 leading-snug">{o.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ────────────────────────────────────────────────────── */}
      <footer
        className="relative py-20 px-4 overflow-hidden text-center"
        style={{ background: 'linear-gradient(135deg, #1a3c6e 0%, #0e7490 60%, #F97316 140%)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6">
            <Brain size={28} className="text-white" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl text-white mb-4">
            El futuro de Credimpacto<br />empieza hoy.
          </h2>
          <p className="text-white/60 mb-8 text-sm md:text-base leading-relaxed">
            Cada día de seguimiento manual es una oportunidad de impacto perdida.<br />
            Con este ecosistema, tus <strong className="text-white">17 comunidades</strong> y <strong className="text-white">246 miembros</strong> serán impulsados por inteligencia real.
          </p>
          <button className="px-8 py-4 rounded-full bg-white text-brand-orange font-heading text-lg font-bold hover:bg-orange-50 transition-all duration-200 hover:scale-105 shadow-xl cursor-pointer inline-flex items-center gap-2">
            Iniciar Transformación <ArrowRight size={20} />
          </button>
          <p className="text-white/30 text-xs mt-8">
            CoimpactoB · Credimpacto · Ecosistema Inteligente de Datos
          </p>
        </div>
      </footer>

    </div>
  )
}
