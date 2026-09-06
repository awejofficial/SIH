import React from 'react'
import {
  AlertTriangle,
  AlertCircle,
  Activity,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  ShieldAlert as ShieldWarn
} from 'lucide-react'

/**
 * Universal Multi-Modal Risk Category Indicator for SIH26017.
 * Strictly adheres to non-color reliance by combining:
 * 1. Monospace Percentage readout
 * 2. Statutory Severity Text Label
 * 3. Distinct Geometric Status Symbol (▲ / ◆ / ■ / ●) & Iconography
 * 4. Contextual Operational Meaning under RFCTLARR Act 2013
 */
export default function RiskCategoryBadge({
  score = null,
  category = null,
  variant = 'pill', // 'pill' | 'compact' | 'detailed' | 'banner'
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
          symbolDesc: 'Critical Solid Delta',
          icon: <AlertTriangle size={14} className="text-red-700 shrink-0" />,
          shieldIcon: <ShieldAlert size={16} className="text-red-700 shrink-0" />,
          label: 'Critical Risk',
          statutoryLabel: 'Critical Statutory Delay',
          badgeClass: 'bg-red-50 text-red-900 border-2 border-red-400 font-bold',
          tagClass: 'bg-red-700 text-white font-mono',
          dotClass: 'bg-red-600',
          textClass: 'text-red-800',
          patternClass: 'border-l-4 border-l-red-600',
          meaning: 'Collector sanction & immediate statutory dispute intervention mandated under RFCTLARR Section 19/23.'
        }
      case 'High':
        return {
          symbol: '◆',
          symbolDesc: 'High Solid Diamond',
          icon: <AlertCircle size={14} className="text-orange-700 shrink-0" />,
          shieldIcon: <ShieldWarn size={16} className="text-orange-700 shrink-0" />,
          label: 'High Risk',
          statutoryLabel: 'High Procedural Friction',
          badgeClass: 'bg-orange-50 text-orange-950 border-2 border-orange-400 font-bold',
          tagClass: 'bg-orange-600 text-white font-mono',
          dotClass: 'bg-orange-500',
          textClass: 'text-orange-800',
          patternClass: 'border-l-4 border-l-orange-500',
          meaning: 'Field revenue hearings and compensation release acceleration required to avert 90+ day delay.'
        }
      case 'Moderate':
        return {
          symbol: '■',
          symbolDesc: 'Moderate Solid Square',
          icon: <Activity size={14} className="text-amber-800 shrink-0" />,
          shieldIcon: <Activity size={16} className="text-amber-700 shrink-0" />,
          label: 'Moderate Risk',
          statutoryLabel: 'Moderate Procedural Lag',
          badgeClass: 'bg-amber-50 text-amber-950 border-2 border-amber-400 font-bold',
          tagClass: 'bg-amber-600 text-white font-mono',
          dotClass: 'bg-amber-500',
          textClass: 'text-amber-800',
          patternClass: 'border-l-4 border-l-amber-500',
          meaning: 'Early bottleneck indicators emerging in approvals/disputes; periodic revenue monitoring advised.'
        }
      default: // Low
        return {
          symbol: '●',
          symbolDesc: 'Low Solid Circle',
          icon: <CheckCircle2 size={14} className="text-emerald-700 shrink-0" />,
          shieldIcon: <ShieldCheck size={16} className="text-emerald-700 shrink-0" />,
          label: 'Low Risk',
          statutoryLabel: 'On-Track (Statutory Compliant)',
          badgeClass: 'bg-emerald-50 text-emerald-950 border-2 border-emerald-400 font-bold',
          tagClass: 'bg-emerald-700 text-white font-mono',
          dotClass: 'bg-emerald-600',
          textClass: 'text-emerald-800',
          patternClass: 'border-l-4 border-l-emerald-600',
          meaning: 'Milestones progressing within statutory RFCTLARR timelines with minimal recorded dispute vectors.'
        }
    }
  }

  const meta = getRiskMetadata(resolvedCategory)

  // 1. Compact: For dense tables and inline lists
  if (variant === 'compact') {
    return (
      <span
        title={`${meta.label}: ${meta.meaning}`}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-mono shadow-2xs ${meta.badgeClass} ${className}`}
      >
        <span className="font-sans text-xs select-none" aria-hidden="true">{meta.symbol}</span>
        {score !== null && <span className="font-black">{Math.round(score)}%</span>}
        <span className="font-sans font-extrabold uppercase tracking-wider text-[10px]">{meta.label}</span>
      </span>
    )
  }

  // 2. Detailed Card: Embedded inside analytical blocks
  if (variant === 'detailed') {
    return (
      <div className={`p-3.5 rounded-lg border ${meta.badgeClass} ${meta.patternClass} space-y-2 shadow-xs ${className}`}>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded bg-white border border-current shadow-2xs text-xs font-mono font-black" aria-label={meta.symbolDesc}>
              {meta.symbol}
            </span>
            <span className="text-xs font-black uppercase tracking-wider">{meta.statutoryLabel}</span>
          </div>
          {score !== null && (
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-black px-2 py-0.5 bg-white rounded border border-current shadow-2xs">
                {Math.round(score)}% Probability Index
              </span>
            </div>
          )}
        </div>
        {showMeaning && (
          <p className="text-[11px] font-medium leading-relaxed opacity-95">
            <strong className="uppercase text-[10px] tracking-wider block font-bold">Contextual Statutory Impact:</strong>
            {meta.meaning}
          </p>
        )}
      </div>
    )
  }

  // 3. Banner Variant: Full-width state banner
  if (variant === 'banner') {
    return (
      <div className={`p-4 rounded-xl border ${meta.badgeClass} ${meta.patternClass} flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${className}`}>
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-lg bg-white border border-current shadow-2xs shrink-0">
            {meta.shieldIcon}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-black px-1.5 py-0.5 rounded bg-white border border-current" aria-label={meta.symbolDesc}>
                {meta.symbol} {score !== null ? `${Math.round(score)}%` : ''}
              </span>
              <span className="text-xs font-black uppercase tracking-wider">{meta.statutoryLabel}</span>
            </div>
            <p className="text-xs font-medium text-slate-800 leading-snug">
              {meta.meaning}
            </p>
          </div>
        </div>
        <div className="shrink-0 font-mono text-[11px] font-bold px-2.5 py-1 rounded bg-white border border-current uppercase">
          Tier: {resolvedCategory}
        </div>
      </div>
    )
  }

  // 4. Default: 'pill' with non-color geometric indicator & contextual tooltip
  return (
    <div
      title={meta.meaning}
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs shadow-2xs ${meta.badgeClass} ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-xs font-black select-none" aria-label={meta.symbolDesc}>{meta.symbol}</span>
        {meta.icon}
      </div>
      {score !== null && (
        <span className="font-mono font-black border-r border-current/30 pr-1.5">{Math.round(score)}%</span>
      )}
      <span className="uppercase font-black tracking-wider text-[10px]">{meta.label}</span>
      {showMeaning && (
        <span className="hidden sm:inline-block text-[10px] font-medium opacity-90 border-l border-current/30 pl-2">
          {meta.statutoryLabel}
        </span>
      )}
    </div>
  )
}
