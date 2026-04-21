import React from 'react'
import { AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react'

const CONFIG = {
  info:    { bg: '#EFF6FF', border: '#3B82F6', text: '#1E40AF', Icon: Info },
  warning: { bg: '#FFFBEB', border: '#F59E0B', text: '#92400E', Icon: AlertTriangle },
  danger:  { bg: '#FEF2F2', border: '#EF4444', text: '#7F1D1D', Icon: AlertCircle },
  success: { bg: '#F0FDF4', border: '#16A34A', text: '#14532D', Icon: CheckCircle },
}

export default function AlertBanner({ type = 'info', title, message, icon: Icon }) {
  const { bg, border, text, Icon: DefaultIcon } = CONFIG[type] || CONFIG.info
  const FinalIcon = Icon || DefaultIcon

  return (
    <div
      className="rounded-2xl p-4 flex gap-3 border-l-4"
      style={{ backgroundColor: bg, borderLeftColor: border }}
    >
      <FinalIcon size={20} style={{ color: border, flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-bold text-xs uppercase tracking-wider mb-1" style={{ color: text }}>
            {title}
          </p>
        )}
        <p style={{ color: text }} className="text-sm leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  )
}
