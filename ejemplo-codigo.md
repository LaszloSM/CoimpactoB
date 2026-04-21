# EJEMPLOS DE CÓDIGO Y ESTRUCTURA
## Guía práctica para Claude Code

---

## 1. MODIFICACIÓN DE App.jsx

```javascript
import { useState } from 'react'
import DashboardPitch from './DashboardPitch'
import Platform from './components/Platform'

export default function App() {
  const [view, setView] = useState('pitch')
  // ← NUEVO: Selector de rol para testing
  const [userRole, setUserRole] = useState('usuario') // 'gerencia' | 'empresa' | 'usuario'

  return (
    <>
      {/* Toggle principal Pitch vs Platform */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-1 bg-[#1a3c6e] rounded-full shadow-2xl shadow-navy/40 p-1.5 border border-white/10">
        <button
          onClick={() => setView('pitch')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
            view === 'pitch'
              ? 'bg-[#F97316] text-white shadow-md'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          Presentación
        </button>
        <button
          onClick={() => setView('platform')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
            view === 'platform'
              ? 'bg-[#F97316] text-white shadow-md'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          Plataforma
        </button>
      </div>

      {/* ← NUEVO: Selector de rol en testing */}
      {view === 'platform' && (
        <div className="fixed top-4 right-4 z-[9998] bg-white rounded-lg shadow-lg p-3 border border-gray-200">
          <label className="text-xs font-semibold text-gray-700 block mb-2">Rol (Testing):</label>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            className="text-sm px-3 py-1 rounded border border-gray-300 focus:outline-none focus:border-[#F97316]"
          >
            <option value="usuario">Usuario (ACAP)</option>
            <option value="gerencia">Gerencia</option>
            <option value="empresa">Empresa/Banco</option>
          </select>
        </div>
      )}

      {/* Views */}
      {view === 'pitch' ? <DashboardPitch /> : <Platform userRole={userRole} />}
    </>
  )
}
```

---

## 2. MODIFICACIÓN DE Platform.jsx (SOLO LA PARTE DE renderModule)

```javascript
// ← IMPORTAR las 3 vistas nuevas
import DashboardGerencia from './dashboards/DashboardGerencia'
import DashboardEmpresasBancos from './dashboards/DashboardEmpresasBancos'
import DashboardUsuarios from './dashboards/DashboardUsuarios'

// ... resto del código igual ...

// MODIFICAR ESTA FUNCIÓN:
function renderModule(activeModule, setActiveModule, userRole) {
  const sharedProps = { activeModule, setActiveModule }
  
  // ← NUEVA LÓGICA: Si el módulo es dashboard, renderizar según rol
  if (activeModule === 'dashboard') {
    if (!userRole) return <div className="p-8 text-gray-500">Cargando...</div>
    if (userRole === 'gerencia') return <DashboardGerencia {...sharedProps} />
    if (userRole === 'empresa') return <DashboardEmpresasBancos {...sharedProps} />
    if (userRole === 'usuario') return <DashboardUsuarios {...sharedProps} />
    return <DashboardGerencia {...sharedProps} /> // default
  }
  
  // ← El resto de módulos siguen igual
  switch (activeModule) {
    case 'ahorro':         return <AhorroModule         {...sharedProps} />
    case 'credito':        return <CreditoModule        {...sharedProps} />
    case 'proyectos':      return <ProyectosModule      {...sharedProps} />
    case 'capacitaciones': return <CapacitacionesModule {...sharedProps} />
    case 'analisis':       return <AnalisisModule       {...sharedProps} />
    case 'evaluaciones':   return <EvaluacionesModule   {...sharedProps} />
    case 'reportes':       return <ReportesModule       {...sharedProps} />
    default:               return <DashboardGerencia    {...sharedProps} />
  }
}

// MODIFICAR EL EXPORT para recibir userRole
export default function Platform({ userRole = 'usuario' }) {
  const [activeModule, setActiveModule] = useState('dashboard')
  const [notifications, setNotifications] = useState(2)
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F8FAFC', color: '#1E293B' }}>
      {/* SIDEBAR igual ... */}
      
      {/* MAIN CONTENT */}
      <main className="flex-1 ml-60 overflow-auto">
        {renderModule(activeModule, setActiveModule, userRole)}
      </main>
    </div>
  )
}
```

---

## 3. COMPONENTE COMPARTIDO: KPICard.jsx

```javascript
import React from 'react'

/**
 * KPICard - Tarjeta de métrica principal
 * Props:
 *  - icon: Componente de icono (lucide-react)
 *  - label: Etiqueta (ej: "Total Ahorro")
 *  - value: Valor principal (ej: "$97.5M")
 *  - bg: Color de fondo (ej: "#1a3c6e", "#F97316")
 *  - trend: (opcional) Variación (ej: "+34.2%")
 *  - comparison: (opcional) Comparación (ej: "vs 2024")
 */
export default function KPICard({ icon: Icon, label, value, bg, trend, comparison }) {
  return (
    <div 
      className="rounded-2xl p-6 text-white flex flex-col gap-3 shadow-md"
      style={{ backgroundColor: bg }}
    >
      {/* Icono */}
      <div className="flex items-center gap-3">
        <div className="bg-white/20 rounded-xl p-3">
          <Icon size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white/80 text-xs font-medium uppercase tracking-wide">{label}</p>
          <p className="text-white font-bold text-2xl leading-tight">{value}</p>
        </div>
      </div>

      {/* Trend (opcional) */}
      {trend && (
        <div className="flex items-center gap-2 text-sm">
          <span style={{ color: trend.startsWith('+') ? '#16A34A' : '#EF4444' }}>
            {trend}
          </span>
          {comparison && <span className="text-white/70">{comparison}</span>}
        </div>
      )}
    </div>
  )
}
```

---

## 4. COMPONENTE COMPARTIDO: AlertBanner.jsx

```javascript
import React from 'react'
import { AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react'

/**
 * AlertBanner - Banner para alertas de IA o notificaciones
 * Props:
 *  - type: 'info' | 'warning' | 'danger' | 'success'
 *  - title: Título (ej: "AGENTE ANALISTA IA")
 *  - message: Mensaje de contenido
 *  - icon: (opcional) Icono custom
 */
export default function AlertBanner({ type = 'info', title, message, icon: Icon }) {
  const config = {
    info:    { bg: '#DBEAFE', border: '#0284C7', text: '#0C4A6E', Icon: Info },
    warning: { bg: '#FEF3C7', border: '#F59E0B', text: '#78350F', Icon: AlertTriangle },
    danger:  { bg: '#FEE2E2', border: '#EF4444', text: '#7F1D1D', Icon: AlertCircle },
    success: { bg: '#DCFCE7', border: '#16A34A', text: '#166534', Icon: CheckCircle },
  }

  const { bg, border, text, Icon: DefaultIcon } = config[type] || config.info
  const FinalIcon = Icon || DefaultIcon

  return (
    <div 
      className="rounded-2xl p-5 flex gap-4 border-l-4"
      style={{ backgroundColor: bg, borderLeftColor: border }}
    >
      <FinalIcon size={24} style={{ color: border, flexShrink: 0, marginTop: '2px' }} />
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-bold text-sm uppercase tracking-wide" style={{ color: text }}>
            {title}
          </p>
        )}
        <p style={{ color: text }} className="text-sm mt-1">
          {message}
        </p>
      </div>
    </div>
  )
}
```

---

## 5. ESTRUCTURA BASE: DashboardGerencia.jsx

```javascript
import React from 'react'
import {
  PiggyBank, CreditCard, Users, Building2, TrendingUp,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts'

import KPICard from './shared/KPICard'
import AlertBanner from './shared/AlertBanner'
import ChartContainer from './shared/ChartContainer'

import { monthlyTrends, acaps } from '../../data/mockData'

// Formato de moneda
const fmt = (n) => new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
}).format(n)

const fmtM = (n) => `$${(n / 1_000_000).toFixed(1)}M`

export default function DashboardGerencia() {
  // Cálculos
  const totalSavings = acaps.reduce((sum, a) => sum + a.totalSaved, 0)
  const totalCredits = 21800000 // Mock
  const totalCommunities = acaps.length
  const totalMembers = acaps.reduce((sum, a) => sum + a.membersCount, 0)

  // Top 5 por ahorro
  const top5 = [...acaps]
    .sort((a, b) => b.totalSaved - a.totalSaved)
    .slice(0, 5)

  return (
    <div className="p-8 space-y-6">
      
      {/* ── HEADER ─────────────────────────────────── */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard de Gerencia</h1>
        <p className="text-gray-600">Análisis estratégico de rentabilidad e impacto social.</p>
      </div>

      {/* ── KPI CARDS ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={PiggyBank}
          label="Total Ahorro"
          value={fmtM(totalSavings)}
          bg="#1a3c6e"
          trend="+34.2%"
          comparison="vs 2024"
        />
        <KPICard
          icon={CreditCard}
          label="Total Préstamos"
          value={fmtM(totalCredits)}
          bg="#1a3c6e"
          trend="+18.5%"
          comparison="vs 2024"
        />
        <KPICard
          icon={Building2}
          label="Comunidades"
          value={totalCommunities}
          bg="#F97316"
          trend="+6.2%"
          comparison="nuevas"
        />
        <KPICard
          icon={Users}
          label="Miembros"
          value={totalMembers}
          bg="#F97316"
          trend="+22.1%"
          comparison="vs 2024"
        />
      </div>

      {/* ── ALERTA IA ─────────────────────────────── */}
      <AlertBanner
        type="warning"
        title="AGENTE ANALISTA IA"
        message="El Agente Analista detecta que 'Kayetamana' tiene 98% de cumplimiento — se sugiere pre-aprobar crédito rotativo de $3.8M COP"
      />

      {/* ── GRÁFICOS ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Evolución Ahorro/Crédito */}
        <ChartContainer title="Evolución Ahorro y Crédito" subtitle="2023 - 2025 · Crecimiento +54%">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="savings" stroke="#F97316" name="Ahorro" strokeWidth={2} />
              <Line type="monotone" dataKey="credits" stroke="#1a3c6e" name="Crédito" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Mapa de Impacto (placeholder) */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="font-bold text-gray-900 mb-2">Mapa de Impacto Territorial</h3>
          <p className="text-gray-600 text-sm mb-4">17 comunidades activas · 7 departamentos</p>
          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center text-gray-400">
            No se pudo cargar el mapa
          </div>
        </div>

      </div>

      {/* ── TOP 5 ACAPS ─────────────────────────── */}
      <ChartContainer title="Top 5 ACAPs por Ahorro">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={top5}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => fmtM(value)} />
            <Bar dataKey="totalSaved" fill="#F97316" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

    </div>
  )
}
```

---

## 6. ESTRUCTURA BASE: DashboardUsuarios.jsx

```javascript
import React from 'react'
import { PiggyBank, CreditCard, Users, CheckCircle, Award } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

import KPICard from './shared/KPICard'
import ChartContainer from './shared/ChartContainer'
import AlertBanner from './shared/AlertBanner'

// Mock de usuario actual
const currentUser = {
  name: 'Ana Lucía',
  community: 'Izshimana',
  department: 'Putumayo',
  savingGoal: 1000000,
  currentSavings: 730000,
  loanAmount: 850000,
  quotasPaid: 7,
  totalQuotas: 12,
  nextPaymentDate: '28 Abr 2026',
  nextQuota: 85500,
  meetings: 18,
  totalMeetings: 20,
  trainings: 5,
  evaluations: 3,
}

export default function DashboardUsuarios() {
  const savingPercent = (currentUser.currentSavings / currentUser.savingGoal) * 100
  
  // Ciclos (mock)
  const cycles = [
    { name: 'Ciclo 1', savings: 120000 },
    { name: 'Ciclo 2', savings: 180000 },
    { name: 'Ciclo 3', savings: 250000 },
    { name: 'Ciclo 4', savings: 320000 },
    { name: 'Ciclo 5', savings: 410000 },
    { name: 'Ciclo 6', savings: 530000 },
    { name: 'Actual', savings: 730000 },
  ]

  return (
    <div className="p-8 space-y-6">
      
      {/* ── HEADER PERSONALIZADO ─────────────────── */}
      <div className="bg-gradient-to-r from-[#1a3c6e] to-[#0f2240] rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-1">Hola, {currentUser.name} 👋</h1>
        <p className="text-white/80">
          {currentUser.community} · {currentUser.department}
        </p>
      </div>

      {/* ── 3 CARDS PRINCIPALES ──────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Meta de Ahorro */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="font-bold text-gray-900 mb-4">Meta de Ahorro</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" strokeWidth="4" />
                <circle
                  cx="50" cy="50" r="45" fill="none" stroke="#F97316" strokeWidth="4"
                  strokeDasharray={`${(savingPercent / 100) * 283} 283`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-bold text-lg">{Math.round(savingPercent)}%</span>
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm">${(currentUser.currentSavings / 1000).toFixed(0)}K del ciclo</p>
              <p className="font-bold text-gray-900">${(currentUser.savingGoal / 1000000).toFixed(1)}M meta</p>
            </div>
          </div>
        </div>

        {/* Mi Préstamo */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="font-bold text-gray-900 mb-4">Mi Préstamo</h3>
          <div className="space-y-3 text-sm">
            <p className="text-gray-600">
              <span className="font-semibold text-green-600">✓ Al día</span>
            </p>
            <div>
              <p className="text-gray-600">Monto</p>
              <p className="font-bold text-gray-900">${(currentUser.loanAmount / 1000).toFixed(0)}K COP</p>
            </div>
            <div>
              <p className="text-gray-600">Cuotas pagadas</p>
              <p className="font-bold text-gray-900">{currentUser.quotasPaid} de {currentUser.totalQuotas}</p>
            </div>
            <div>
              <p className="text-gray-600">Próximo pago</p>
              <p className="font-bold text-gray-900">{currentUser.nextPaymentDate}</p>
            </div>
          </div>
        </div>

        {/* Mi Participación */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="font-bold text-gray-900 mb-4">Mi Participación</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Reuniones asistidas</span>
              <span className="font-bold text-gray-900">{currentUser.meetings} de {currentUser.totalMeetings}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Capacitaciones</span>
              <span className="font-bold text-gray-900">{currentUser.trainings} completadas</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Evaluaciones</span>
              <span className="font-bold text-gray-900">{currentUser.evaluations} respondidas</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── MI AHORRO POR CICLO ───────────────────── */}
      <ChartContainer title="Mi Ahorro por Ciclo">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={cycles}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
            <Bar dataKey="savings" fill="#F97316" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* ── MIS LOGROS ────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="font-bold text-gray-900 mb-4">Mis Logros</h3>
        <div className="flex flex-wrap gap-3">
          <div className="bg-yellow-50 rounded-lg px-4 py-3 flex items-center gap-2 border border-yellow-200">
            <span>✨</span>
            <span className="text-sm font-semibold text-gray-900">Ahorradora Consistente</span>
          </div>
          <div className="bg-green-50 rounded-lg px-4 py-3 flex items-center gap-2 border border-green-200">
            <span>✓</span>
            <span className="text-sm font-semibold text-gray-900">Sin mora 12 meses</span>
          </div>
          <div className="bg-blue-50 rounded-lg px-4 py-3 flex items-center gap-2 border border-blue-200">
            <span>🚀</span>
            <span className="text-sm font-semibold text-gray-900">Proyecto Aprobado</span>
          </div>
        </div>
      </div>

      {/* ── NOTIFICACIONES ────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="font-bold text-gray-900 mb-4">Notificaciones</h3>
        <AlertBanner
          type="info"
          message="Próxima reunión ACAP: 22 Abr, 10:00 AM en Putumayo"
        />
      </div>

    </div>
  )
}
```

---

## 7. ESTRUCTURA BASE: ChartContainer.jsx

```javascript
import React from 'react'

/**
 * ChartContainer - Wrapper para gráficos
 * Props:
 *  - title: Título del gráfico
 *  - subtitle: (opcional) Subtítulo
 *  - children: Contenido (generalmente ResponsiveContainer con gráfico)
 */
export default function ChartContainer({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <div className="mb-6">
        <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
        {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}
```

---

## RESUMEN RÁPIDO PARA CLAUDE CODE

```
1. Crear 7 archivos nuevos:
   ✓ /src/components/dashboards/DashboardGerencia.jsx
   ✓ /src/components/dashboards/DashboardEmpresasBancos.jsx
   ✓ /src/components/dashboards/DashboardUsuarios.jsx
   ✓ /src/components/dashboards/shared/KPICard.jsx
   ✓ /src/components/dashboards/shared/AlertBanner.jsx
   ✓ /src/components/dashboards/shared/ChartContainer.jsx
   ✓ /src/components/dashboards/shared/MetricCard.jsx

2. Modificar 2 archivos existentes:
   ✓ /src/App.jsx (agregar userRole state + selector)
   ✓ /src/components/Platform.jsx (pasar userRole + renderizar según rol)

3. Los datos ya existen en mockData.js (no hay que crear nada)

4. Testing: Cambiar rol en dropdown arriba a la derecha
```