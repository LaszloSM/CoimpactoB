import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function KPICard({ icon: Icon, label, value, bg, trend, comparison }) {
  const isPositive = trend && trend.startsWith('+')

  return (
    <div
      className="rounded-2xl p-6 text-white flex flex-col gap-3 shadow-md"
      style={{ backgroundColor: bg }}
    >
      <div className="flex items-center gap-3">
        <div className="bg-white/20 rounded-xl p-3 shrink-0">
          <Icon size={22} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white/75 text-xs font-medium uppercase tracking-wide truncate">{label}</p>
          <p className="text-white font-bold text-2xl leading-tight">{value}</p>
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1.5 text-sm">
          {isPositive
            ? <TrendingUp size={14} className="text-green-300 shrink-0" />
            : <TrendingDown size={14} className="text-red-300 shrink-0" />
          }
          <span style={{ color: isPositive ? '#86efac' : '#fca5a5' }} className="font-semibold">
            {trend}
          </span>
          {comparison && <span className="text-white/60">{comparison}</span>}
        </div>
      )}
    </div>
  )
}
