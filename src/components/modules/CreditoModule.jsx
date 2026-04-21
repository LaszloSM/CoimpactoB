import { useState, useMemo } from 'react'
import {
  CreditCard, AlertTriangle, CheckCircle, Clock,
  MessageCircle, Phone, AlertCircle, Star, Calculator, Zap, BarChart2,
} from 'lucide-react'
import { credits, members, acaps, zones, portfolioSummary, scoringWeights } from '../../data/mockData'

// ─── helpers ────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

const fmtShort = (n) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`
  return `$${n}`
}

const memberMap = Object.fromEntries(members.map((m) => [m.id, m]))
const acapMap = Object.fromEntries(acaps.map((a) => [a.id, a]))

function calcMonthsInGroup(joinDate) {
  const join = new Date(joinDate)
  const now = new Date('2026-04-08')
  return Math.max(0, (now.getFullYear() - join.getFullYear()) * 12 + (now.getMonth() - join.getMonth()))
}

function calcScore(member) {
  const paymentScore = member.paymentCompliance * 0.35
  const savingsScore = Math.min(25, (member.savingsContributed / 500000) * 25)
  const timeScore = Math.min(15, (calcMonthsInGroup(member.joinDate) / 24) * 15)
  return Math.round(paymentScore + savingsScore + timeScore + 15 + 10)
}

function scoreRisk(score) {
  if (score > 75) return 'Bajo'
  if (score >= 50) return 'Medio'
  return 'Alto'
}

function preApprovedAmount(member, score) {
  if (score > 75) return member.savingsContributed * 3
  if (score > 50) return member.savingsContributed * 2
  return member.savingsContributed
}

const activeCreditMemberIds = new Set(
  credits.filter((c) => c.status === 'Al día' || c.status === 'En mora' || c.status === 'Preaprobado').map((c) => c.memberId)
)

// ─── Badge components ────────────────────────────────────────────────────────
function RiskBadge({ risk }) {
  const cfg = { 'Bajo': 'bg-green-100 text-green-700', 'Medio': 'bg-amber-100 text-amber-700', 'Alto': 'bg-red-100 text-red-700' }
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg[risk] ?? 'bg-gray-100 text-gray-600'}`}>{risk}</span>
}

function ScoreBadge({ score }) {
  const risk = scoreRisk(score)
  const cfg = { 'Bajo': 'bg-green-100 text-green-700', 'Medio': 'bg-amber-100 text-amber-700', 'Alto': 'bg-red-100 text-red-700' }
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg[risk]}`}>{score}/100</span>
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 1 — SCORING
// ══════════════════════════════════════════════════════════════════════════════
function ScoringTab() {
  const criteria = [
    { label: 'Historial de pagos',      pct: scoringWeights.paymentHistory,    color: '#1a3c6e' },
    { label: 'Monto ahorrado',           pct: scoringWeights.savingsAmount,     color: '#0891B2' },
    { label: 'Tiempo en grupo',          pct: scoringWeights.timeInGroup,       color: '#16A34A' },
    { label: 'Viabilidad del proyecto',  pct: scoringWeights.projectViability,  color: '#F97316' },
    { label: 'Capacidad de pago',        pct: scoringWeights.paymentCapacity,   color: '#F59E0B' },
  ]

  const scoredMembers = useMemo(
    () => members.map((m) => {
      const score = calcScore(m)
      return { ...m, score, risk: scoreRisk(score), preApproved: preApprovedAmount(m, score), acapName: acapMap[m.acapId]?.name ?? '—' }
    }).sort((a, b) => b.score - a.score),
    []
  )

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-[#1a3c6e] mb-5 flex items-center gap-2">
          <Star size={16} /> Criterios de Scoring y Pesos
        </h3>
        <div className="space-y-4">
          {criteria.map((c) => (
            <div key={c.label}>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">{c.label}</span>
                <span className="text-sm font-bold" style={{ color: c.color }}>{c.pct}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-3 rounded-full" style={{ width: `${c.pct}%`, backgroundColor: c.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-[#1a3c6e] mb-4 flex items-center gap-2">
          <BarChart2 size={16} /> Matriz de Scoring de Miembros
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="border-b border-gray-100">
                {['Nombre', 'ACAP', 'Puntaje', 'Riesgo', 'Historial Pagos', 'Ahorro Acum.', 'Monto Preaprobado', ''].map((h) => (
                  <th key={h} className="py-2 px-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scoredMembers.map((m) => (
                <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-2 px-3 font-medium text-[#1a3c6e]">{m.name}</td>
                  <td className="py-2 px-3 text-gray-600 text-xs">{m.acapName}</td>
                  <td className="py-2 px-3"><ScoreBadge score={m.score} /></td>
                  <td className="py-2 px-3"><RiskBadge risk={m.risk} /></td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full" style={{ width: `${m.paymentCompliance}%`, backgroundColor: m.paymentCompliance >= 90 ? '#16A34A' : m.paymentCompliance >= 70 ? '#F59E0B' : '#EF4444' }} />
                      </div>
                      <span className="text-xs text-gray-600">{m.paymentCompliance}%</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-gray-700">{fmtShort(m.savingsContributed)}</td>
                  <td className="py-2 px-3 font-semibold text-[#0891B2]">{fmt(m.preApproved)}</td>
                  <td className="py-2 px-3">
                    {m.score > 60 && (
                      <button className="text-xs bg-[#1a3c6e] text-white px-3 py-1 rounded-lg hover:bg-[#F97316] transition-colors cursor-pointer">
                        Solicitar crédito
                      </button>
                    )}
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

// ══════════════════════════════════════════════════════════════════════════════
// TAB 2 — SIMULADOR
// ══════════════════════════════════════════════════════════════════════════════
function SimuladorTab() {
  const RATE_MONTHLY = 0.015
  const [amount, setAmount] = useState(1500000)
  const [term, setTerm] = useState(12)
  const [showAllRows, setShowAllRows] = useState(false)

  const { cuota, total, intereses, schedule } = useMemo(() => {
    const P = amount, r = RATE_MONTHLY, n = term
    const cuota = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const total = cuota * n
    const intereses = total - P
    const schedule = []
    let saldo = P
    for (let i = 1; i <= n; i++) {
      const intMes = saldo * r
      const capital = cuota - intMes
      saldo = Math.max(0, saldo - capital)
      schedule.push({ mes: i, cuota, capital, interes: intMes, saldo })
    }
    return { cuota, total, intereses, schedule }
  }, [amount, term])

  const displayRows = showAllRows ? schedule : schedule.slice(0, 6)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-5">
          <h3 className="font-semibold text-[#1a3c6e] flex items-center gap-2"><Calculator size={16} /> Parámetros del Crédito</h3>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Monto solicitado</label>
              <span className="text-sm font-bold text-[#1a3c6e]">{fmt(amount)}</span>
            </div>
            <input type="range" min={500000} max={5000000} step={100000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full accent-[#1a3c6e] cursor-pointer" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$500,000</span><span>$5,000,000</span></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Plazo</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]/30 cursor-pointer" value={term} onChange={(e) => setTerm(Number(e.target.value))}>
              {[3, 6, 12, 18, 24].map((t) => <option key={t} value={t}>{t} meses</option>)}
            </select>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
            <span className="text-sm text-gray-600">Tasa mensual</span>
            <span className="text-sm font-bold text-[#0891B2]">1.5% (fija)</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2 items-start">
            <AlertTriangle size={15} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">Asegúrese de que el monto no exceda el cupo preaprobado. Montos superiores requieren evaluación adicional.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-[#1a3c6e] flex items-center gap-2"><CreditCard size={16} /> Resumen del Crédito</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#1a3c6e] text-white rounded-xl p-4 text-center">
              <p className="text-xs opacity-80 mb-1">Cuota Mensual</p>
              <p className="text-lg font-bold">{fmt(Math.round(cuota))}</p>
            </div>
            <div className="bg-[#16A34A] text-white rounded-xl p-4 text-center">
              <p className="text-xs opacity-80 mb-1">Total a Pagar</p>
              <p className="text-lg font-bold">{fmt(Math.round(total))}</p>
            </div>
            <div className="bg-[#F97316] text-white rounded-xl p-4 text-center">
              <p className="text-xs opacity-80 mb-1">Total Intereses</p>
              <p className="text-lg font-bold">{fmt(Math.round(intereses))}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Zap size={14} className="text-blue-500 shrink-0" />
            <p className="text-xs text-blue-700">Con {term} cuotas de {fmt(Math.round(cuota))}/mes — Costo total: <strong>{((intereses / amount) * 100).toFixed(1)}%</strong> sobre el capital</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-[#1a3c6e] mb-4 flex items-center gap-2"><BarChart2 size={16} /> Tabla de Amortización</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Mes', 'Cuota', 'Capital', 'Interés', 'Saldo'].map((h) => (
                  <th key={h} className="py-2 px-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayRows.map((row) => (
                <tr key={row.mes} className={`border-b border-gray-50 hover:bg-gray-50 ${row.mes % 2 === 0 ? 'bg-gray-50/50' : ''}`}>
                  <td className="py-2 px-3 font-medium text-[#1a3c6e]">{row.mes}</td>
                  <td className="py-2 px-3 text-gray-700">{fmt(Math.round(row.cuota))}</td>
                  <td className="py-2 px-3 text-[#16A34A] font-medium">{fmt(Math.round(row.capital))}</td>
                  <td className="py-2 px-3 text-[#F97316]">{fmt(Math.round(row.interes))}</td>
                  <td className="py-2 px-3 text-gray-600">{fmt(Math.round(row.saldo))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {schedule.length > 6 && (
          <button onClick={() => setShowAllRows((v) => !v)} className="mt-3 text-sm text-[#1a3c6e] hover:text-[#F97316] font-medium cursor-pointer transition-colors">
            {showAllRows ? 'Ver menos' : `Ver todos los ${schedule.length} meses`}
          </button>
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 3 — ALERTAS
// ══════════════════════════════════════════════════════════════════════════════
function AlertasTab() {
  const TODAY = new Date('2026-04-08')

  const upcoming = useMemo(() => credits
    .filter((c) => { if (!c.dueDate || c.status === 'Pagado') return false; const diff = (new Date(c.dueDate) - TODAY) / 86400000; return diff >= 0 && diff <= 7 })
    .map((c) => ({ ...c, memberName: memberMap[c.memberId]?.name ?? '—', acapName: acapMap[c.acapId]?.name ?? '—', daysLeft: Math.ceil((new Date(c.dueDate) - TODAY) / 86400000) }))
    .sort((a, b) => a.daysLeft - b.daysLeft), [])

  const overdue = useMemo(() => credits
    .filter((c) => c.status === 'En mora')
    .map((c) => ({ ...c, memberName: memberMap[c.memberId]?.name ?? '—', acapName: acapMap[c.acapId]?.name ?? '—' }))
    .sort((a, b) => b.daysOverdue - a.daysOverdue), [])

  const opportunities = useMemo(() => members
    .filter((m) => m.paymentCompliance > 90 && !activeCreditMemberIds.has(m.id))
    .map((m) => { const score = calcScore(m); return { ...m, score, preApproved: preApprovedAmount(m, score), acapName: acapMap[m.acapId]?.name ?? '—' } })
    .sort((a, b) => b.paymentCompliance - a.paymentCompliance), [])

  const overdueBg = (days) => days > 60 ? 'border-l-4 border-red-500 bg-red-50' : days > 30 ? 'border-l-4 border-amber-500 bg-amber-50' : 'border-l-4 border-yellow-400 bg-yellow-50'

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold text-[#1a3c6e] mb-3 flex items-center gap-2 text-base">
          <Clock size={16} className="text-amber-500" /> Vencimientos Próximos (7 días)
          <span className="ml-1 bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">{upcoming.length}</span>
        </h3>
        {upcoming.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"><CheckCircle size={18} className="text-green-500" /><p className="text-sm text-green-700">No hay vencimientos en los próximos 7 días.</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((c) => (
              <div key={c.id} className="bg-white rounded-xl shadow-sm border border-amber-100 p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div><p className="font-semibold text-[#1a3c6e] text-sm">{c.memberName}</p><p className="text-xs text-gray-500">{c.acapName}</p></div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.daysLeft === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{c.daysLeft === 0 ? 'Hoy' : `${c.daysLeft}d`}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Saldo: <strong className="text-gray-700">{fmt(c.balance)}</strong></span>
                  <span>Vence: {c.dueDate}</span>
                </div>
                <button className="w-full flex items-center justify-center gap-2 text-xs bg-green-500 text-white py-1.5 rounded-lg hover:bg-green-600 transition-colors cursor-pointer"><MessageCircle size={13} /> Notificar WhatsApp</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-[#1a3c6e] mb-3 flex items-center gap-2 text-base">
          <AlertTriangle size={16} className="text-red-500" /> Créditos En Mora
          <span className="ml-1 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{overdue.length}</span>
        </h3>
        {overdue.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"><CheckCircle size={18} className="text-green-500" /><p className="text-sm text-green-700">No hay créditos en mora actualmente.</p></div>
        ) : (
          <div className="space-y-3">
            {overdue.map((c) => (
              <div key={c.id} className={`rounded-xl p-4 ${overdueBg(c.daysOverdue)}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1"><p className="font-semibold text-gray-800">{c.memberName}</p><p className="text-xs text-gray-600">{c.acapName} · {fmt(c.balance)} pendiente</p></div>
                  <div className="flex items-center gap-3">
                    <div className="text-center"><p className={`text-lg font-bold ${c.daysOverdue > 60 ? 'text-red-600' : c.daysOverdue > 30 ? 'text-amber-600' : 'text-yellow-600'}`}>{c.daysOverdue}</p><p className="text-xs text-gray-500">días mora</p></div>
                    <button className="flex items-center gap-1.5 text-xs bg-[#1a3c6e] text-white px-3 py-2 rounded-lg hover:bg-[#F97316] transition-colors cursor-pointer"><Phone size={12} /> Gestionar cobro</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-[#1a3c6e] mb-3 flex items-center gap-2 text-base">
          <CheckCircle size={16} className="text-green-500" /> Oportunidades de Crédito
          <span className="ml-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">{opportunities.length}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.map((m) => (
            <div key={m.id} className="bg-white rounded-xl shadow-sm border border-green-100 p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div><p className="font-semibold text-[#1a3c6e] text-sm">{m.name}</p><p className="text-xs text-gray-500">{m.acapName}</p></div>
                <ScoreBadge score={m.score} />
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between"><span>Cumplimiento pagos:</span><strong className="text-green-600">{m.paymentCompliance}%</strong></div>
                <div className="flex justify-between"><span>Monto preaprobado:</span><strong className="text-[#0891B2]">{fmt(m.preApproved)}</strong></div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 text-xs bg-[#16A34A] text-white py-1.5 rounded-lg hover:bg-green-700 transition-colors cursor-pointer"><MessageCircle size={13} /> Contactar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════════
const TABS = [
  { id: 'Scoring',   Icon: Star,        label: 'Scoring'   },
  { id: 'Simulador', Icon: Calculator,  label: 'Simulador' },
  { id: 'Alertas',   Icon: AlertCircle, label: 'Alertas'   },
]

export default function CreditoModule() {
  const [activeTab, setActiveTab] = useState('Scoring')

  return (
    <div className="p-4 sm:p-6 space-y-6 min-h-screen bg-gray-50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3c6e] flex items-center gap-2">
            <CreditCard size={24} className="text-[#F97316]" /> Gestión de Créditos
          </h1>
          <p className="text-sm text-gray-500 mt-1">Scoring · Simulación · Alertas</p>
        </div>
        <div className="flex gap-2">
          <span className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <CheckCircle size={12} /> {credits.filter((c) => c.status === 'Al día').length} al día
          </span>
          <span className="text-xs bg-red-100 text-red-700 font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <AlertTriangle size={12} /> {credits.filter((c) => c.status === 'En mora').length} en mora
          </span>
        </div>
      </div>

      <div className="flex gap-1 bg-white rounded-xl shadow-sm p-1 w-full sm:w-fit">
        {TABS.map(({ id, Icon, label }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer min-h-[44px] ${activeTab === id ? 'bg-[#1a3c6e] text-white shadow' : 'text-gray-500 hover:text-[#1a3c6e] hover:bg-gray-50'}`}
          >
            <Icon size={14} aria-hidden="true" />{label}
          </button>
        ))}
      </div>

      <div key={activeTab}>
        {activeTab === 'Scoring'   && <ScoringTab />}
        {activeTab === 'Simulador' && <SimuladorTab />}
        {activeTab === 'Alertas'   && <AlertasTab />}
      </div>
    </div>
  )
}
