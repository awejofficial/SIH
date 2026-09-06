import React from 'react'
import { AlertTriangle, AlertCircle, Activity, CheckCircle2 } from 'lucide-react'

/**
 * Universal Multi-Modal Risk Category Indicator for SIH26017.
 * Strictly adheres to non-color reliance by combining:
 * 1. Monospace Percentage readout
 * 2. Statutory Severity Text Label
 * 3. Distinct Geometric Status Symbol
 * 4. Contextual Operational Meaning
 */
export default function RiskCategoryBadge({
  score = null,
  category = null,
  variant = 'pill', // 'pill' | 'compact' | 'detailed'
  showMeaning = true,
  className = ''
}) {
  // Infer category if only score is provided
  const resolvedCategory = category || (
    score !== null
      ? score >= 75
        ? 'Critical'
        : score >= 50
        ? 'High'
        : score >= 25
        ? 'Moderate'
        : 'Low'
      : 'Moderate'
  )

  const getRiskMetadata = (cat) => {
    switch (cat) {
      case 'Critical':
        return {
          symbol: '▲',
          icon: <AlertTriangle size={13} className="text-red-700 shrink-0" />,
          label: 'Critical Risk',
          statutoryLabel: 'Critical Statutory Delay',
          badgeClass: 'bg-red-100 text-red-900 border-red-300 font-bold',
          dotClass: 'bg-red-600',
          textClass: 'text-red-700',
          meaning: 'Collector sanction & immediate statutory dispute intervention mandated'
        }
      case 'High':
        return {
          symbol: '◆',
          icon: <AlertCircle size={13} className="text-orange-700 shrink-0" />,
          label: 'High Risk',
          statutoryLabel: 'High Procedural Friction',
          badgeClass: 'bg-orange-100 text-orange-900 border-orange-300 font-bold',
          dotClass: 'bg-orange-500',
          textClass: 'text-orange-700',
          meaning: 'Field revenue hearings and compensation release acceleration required'
        }
      case 'Moderate':
        return {
          symbol: '■',
          icon: <Activity size={13} className="text-amber-700 shrink-0" />,
          label: 'Moderate Risk',
          statutoryLabel: 'Moderate Procedural Lag',
          badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
          dotClass: 'bg-amber-500',
          textClass: 'text-amber-700',
          meaning: 'Early bottleneck indicators emerging; monitoring recommended'
        }
      default: // Low
        return {
          symbol: '●',
          icon: <CheckCircle2 size={13} className="text-emerald-700 shrink-0" />,
          label: 'Low Risk',
          statutoryLabel: 'On-Track (RFCTLARR Compliant)',
          badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
          dotClass: 'bg-emerald-600',
          textClass: 'text-emerald-700',
          meaning: 'Milestones progressing within statutory timelines with minimal disputes'
        }
    }
  }

  const meta = getRiskMetadata(resolvedCategory)

  if (variant === 'compact') {
    return (
      <span
        title={meta.meaning}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-mono ${meta.badgeClass} ${className}`}
      >
        <span className="font-sans text-[10px] select-none" aria-hidden="true">{meta.symbol}</span>
        {score !== null && <span>{Math.round(score)}%</span>}
        <span className="font-sans font-bold uppercase tracking-wider text-[10px]">{meta.label}</span>
      </span>
    )
  }

  if (variant === 'detailed') {
    return (
      <div className={`p-3 rounded-lg border ${meta.badgeClass} space-y-1.5 ${className}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {meta.icon}
            <span className="text-xs font-black uppercase tracking-wider">{meta.statutoryLabel}</span>
          </div>
          {score !== null && (
            <span className="font-mono text-sm font-black px-2 py-0.5 bg-white/80 rounded border border-current">
              {Math.round(score)}% Delay Probability
            </span>
          )}
        </div>
        {showMeaning && (
          <p className="text-[11px] font-medium leading-tight opacity-90">
            <strong>Operational Impact:</strong> {meta.meaning}
          </p>
        )}
      </div>
    )
  }

  // Default: 'pill'
  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs ${meta.badgeClass} ${className}`}>
      <div className="flex items-center gap-1">
        {meta.icon}
        <span className="font-mono text-[10px] font-bold select-none" aria-hidden="true">{meta.symbol}</span>
      </div>
      {score !== null && (
        <span className="font-mono font-black">{Math.round(score)}%</span>
      )}
      <span className="uppercase font-bold tracking-wider text-[10px]">{meta.label}</span>
      {showMeaning && (
        <span className="hidden sm:inline-block text-[10px] font-medium opacity-80 border-l border-current/30 pl-2">
          {meta.statutoryLabel}
        </span>
      )}
    </div>
  )
}
