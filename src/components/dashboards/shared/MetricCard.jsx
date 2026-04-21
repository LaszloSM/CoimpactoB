import React from 'react'

export default function MetricCard({ label, value, sublabel, accent }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-100">
      <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">{label}</p>
      <p
        className="text-2xl font-bold leading-tight"
        style={{ color: accent || '#1E293B' }}
      >
        {value}
      </p>
      {sublabel && <p className="text-slate-400 text-xs mt-1">{sublabel}</p>}
    </div>
  )
}
