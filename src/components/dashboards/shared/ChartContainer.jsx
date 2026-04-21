import React from 'react'

export default function ChartContainer({ title, subtitle, children, action }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-bold text-gray-900 text-base">{title}</h3>
          {subtitle && <p className="text-slate-500 text-sm mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0 ml-4">{action}</div>}
      </div>
      {children}
    </div>
  )
}
