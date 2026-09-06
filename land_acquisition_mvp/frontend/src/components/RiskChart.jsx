import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid
} from 'recharts'

/**
 * Institutional Portfolio Risk Distribution Chart
 * Visualizes the systemic concentration of projects across statutory risk tiers.
 * Incorporates geometric tier indicators (▲, ◆, ■, ●) for universal accessibility.
 */
export default function RiskChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-xs font-mono text-slate-400">
        No portfolio data available for distribution analysis.
      </div>
    )
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-lg text-xs space-y-1">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <span className="font-mono text-slate-400">{item.symbol || '●'}</span>
            <span>{item.name}</span>
          </div>
          <div className="text-slate-600 font-mono">
            Parcels in Tier: <strong className="text-slate-900 text-sm">{item.count}</strong>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {item.meaning || 'Statutory RFCTLARR monitoring tier'}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            stroke="#64748b"
            fontSize={11}
            fontFamily="monospace"
            tickLine={false}
            axisLine={{ stroke: '#cbd5e1' }}
          />
          <YAxis
            stroke="#64748b"
            fontSize={11}
            fontFamily="monospace"
            tickLine={false}
            axisLine={{ stroke: '#cbd5e1' }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={55}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
