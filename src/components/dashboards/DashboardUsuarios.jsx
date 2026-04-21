import React from 'react'
import { Star, CheckCircle, Rocket, CalendarDays, Bell } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

import ChartContainer from './shared/ChartContainer'
import AlertBanner from './shared/AlertBanner'

const CHART_TOOLTIP_STYLE = { borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '13px' }

const currentUser = {
  name:            'Ana Lucía',
  community:       'Izshimana',
  department:      'Putumayo',
  savingGoal:      1000000,
  currentSavings:  730000,
  loanAmount:      850000,
  quotasPaid:      7,
  totalQuotas:     12,
  nextPaymentDate: '28 Abr 2026',
  nextQuota:       85500,
  meetings:        18,
  totalMeetings:   20,
  trainings:       5,
  evaluations:     3,
}

const CYCLES = [
  { name: 'Ciclo 1', ahorro: 120000 },
  { name: 'Ciclo 2', ahorro: 180000 },
  { name: 'Ciclo 3', ahorro: 250000 },
  { name: 'Ciclo 4', ahorro: 320000 },
  { name: 'Ciclo 5', ahorro: 410000 },
  { name: 'Ciclo 6', ahorro: 530000 },
  { name: 'Actual',  ahorro: 730000 },
]

const LOGROS = [
  { label: 'Ahorradora Consistente', icon: Star,        bg: '#fffbeb', border: '#fde68a', color: '#92400e' },
  { label: 'Sin mora 12 meses',      icon: CheckCircle, bg: '#f0fdf4', border: '#bbf7d0', color: '#14532d' },
  { label: 'Proyecto Aprobado',      icon: Rocket,      bg: '#eff6ff', border: '#bfdbfe', color: '#1e3a8a' },
]

function CircleProgress({ percent, size = 96, stroke = 4 }) {
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const filled = (percent / 100) * circ

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }} aria-hidden="true">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke="#F97316" strokeWidth={stroke}
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function DashboardUsuarios() {
  const savingPercent = Math.round((currentUser.currentSavings / currentUser.savingGoal) * 100)
  const quotaPercent  = Math.round((currentUser.quotasPaid / currentUser.totalQuotas) * 100)

  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* Header personalizado */}
      <div
        className="rounded-2xl p-7 text-white"
        style={{ background: 'linear-gradient(135deg, #1a3c6e 0%, #0f2444 100%)' }}
      >
        <h2 className="text-2xl font-bold mb-1">Hola, {currentUser.name}</h2>
        <p className="text-white/70 text-sm">
          Comunidad {currentUser.community} · {currentUser.department}
        </p>
      </div>

      {/* 3 Cards principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Meta de Ahorro */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
          <h3 className="font-bold text-gray-900 mb-4 text-base">Meta de Ahorro</h3>
          <div className="flex items-center gap-4">
            <div className="relative shrink-0" style={{ width: 80, height: 80 }}>
              <CircleProgress percent={savingPercent} size={80} stroke={5} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-bold text-base text-gray-900">{savingPercent}%</span>
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Acumulado</p>
              <p className="font-bold text-gray-900">${(currentUser.currentSavings / 1000).toFixed(0)}K COP</p>
              <p className="text-slate-400 text-xs mt-0.5">Meta: ${(currentUser.savingGoal / 1000000).toFixed(1)}M COP</p>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: `${savingPercent}%`, backgroundColor: '#F97316' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mi Préstamo */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-base">Mi Préstamo</h3>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
              Al día
            </span>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Monto</span>
              <span className="font-semibold text-gray-900">${(currentUser.loanAmount / 1000).toFixed(0)}K COP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cuotas pagadas</span>
              <span className="font-semibold text-gray-900">{currentUser.quotasPaid} / {currentUser.totalQuotas}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full"
                style={{ width: `${quotaPercent}%`, backgroundColor: '#1a3c6e' }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Próximo pago</span>
              <span className="font-semibold text-gray-900">{currentUser.nextPaymentDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cuota</span>
              <span className="font-semibold" style={{ color: '#F97316' }}>
                ${(currentUser.nextQuota / 1000).toFixed(1)}K COP
              </span>
            </div>
          </div>
        </div>

        {/* Mi Participación */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
          <h3 className="font-bold text-gray-900 mb-4 text-base">Mi Participación</h3>
          <div className="space-y-3 text-sm">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-500">Reuniones asistidas</span>
                <span className="font-semibold text-gray-900">{currentUser.meetings} / {currentUser.totalMeetings}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: `${(currentUser.meetings / currentUser.totalMeetings) * 100}%`, backgroundColor: '#0891B2' }}
                />
              </div>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">Capacitaciones</span>
              <span className="font-semibold text-gray-900">{currentUser.trainings} completadas</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Evaluaciones</span>
              <span className="font-semibold text-gray-900">{currentUser.evaluations} respondidas</span>
            </div>
          </div>
        </div>

      </div>

      {/* Ahorro por ciclo */}
      <ChartContainer title="Mi Ahorro por Ciclo" subtitle="Crecimiento histórico acumulado">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={CYCLES} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
            <Tooltip
              contentStyle={CHART_TOOLTIP_STYLE}
              formatter={(v) => [`$${(v/1000).toFixed(0)}K COP`, 'Ahorro']}
            />
            <Bar dataKey="ahorro" fill="#F97316" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Logros */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
        <h3 className="font-bold text-gray-900 mb-4 text-base">Mis Logros</h3>
        <div className="flex flex-wrap gap-3">
          {LOGROS.map(({ label, icon: Icon, bg, border, color }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl border"
              style={{ backgroundColor: bg, borderColor: border }}
            >
              <Icon size={16} style={{ color }} aria-hidden="true" />
              <span className="text-sm font-semibold" style={{ color }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notificaciones */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} style={{ color: '#1a3c6e' }} aria-hidden="true" />
          <h3 className="font-bold text-gray-900 text-base">Notificaciones</h3>
        </div>
        <div className="space-y-3">
          <AlertBanner
            type="info"
            icon={CalendarDays}
            message="Próxima reunión ACAP: 22 Abr, 10:00 AM — Sede Putumayo"
          />
          <AlertBanner
            type="success"
            message="Tu cuota de Marzo fue registrada correctamente. ¡Gracias por tu puntualidad!"
          />
        </div>
      </div>

    </div>
  )
}
