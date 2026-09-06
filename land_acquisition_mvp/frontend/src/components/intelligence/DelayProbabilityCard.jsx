import React from 'react'
import {
  AlertTriangle,
  AlertCircle,
  Activity,
  CheckCircle2,
  Cpu,
  TrendingUp,
  ShieldAlert
} from 'lucide-react'

export default function DelayProbabilityCard({ prediction }) {
  if (!prediction) return null

  const score = Math.round(prediction.risk_score || 0)
  const category = prediction.risk_category || 'Moderate'
  const probability = prediction.delay_probability ?? (score / 100).toFixed(3)

  const getRiskConfig = (cat) => {
    switch (cat) {
      case 'Critical':
        return {
          textColor: 'text-red-700',
          badgeBg: 'bg-red-100 text-red-800 border-red-200',
          indicatorColor: 'bg-red-600',
          icon: <AlertTriangle size={20} className="text-red-700 shrink-0" />,
          severityText: 'Critical Delay Imminent — Statutory Collector Intervention Mandated',
          summary: 'Project trajectory indicates severe statutory timeline failure across multiple legal or compensation milestones.'
        }
      case 'High':
        return {
          textColor: 'text-orange-600',
          badgeBg: 'bg-orange-100 text-orange-800 border-orange-200',
          indicatorColor: 'bg-orange-500',
          icon: <AlertCircle size={20} className="text-orange-600 shrink-0" />,
          severityText: 'High Acquisition Friction Detected — Field Revenue Intervention Required',
          summary: 'Significant procedural friction detected. Without targeted intervention, project delay will compound.'
        }
      case 'Moderate':
        return {
          textColor: 'text-amber-600',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
          indicatorColor: 'bg-amber-500',
          icon: <Activity size={20} className="text-amber-600 shrink-0" />,
          severityText: 'Moderate Procedural Lags — Regular Review Recommended',
          summary: 'Early friction points emerging. Active monitoring will prevent escalation into high risk.'
        }
      default: // Low
        return {
          textColor: 'text-emerald-700',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          indicatorColor: 'bg-emerald-600',
          icon: <CheckCircle2 size={20} className="text-emerald-700 shrink-0" />,
          severityText: 'On-Track — Progressing within Statutory Timelines',
          summary: 'Current milestones adhere to RFCTLARR statutory schedules with minimal acquisition disputes.'
        }
    }
  }

  const config = getRiskConfig(category)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* 1. Header Bar */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-600">
          <ShieldAlert size={14} className="text-blue-600" />
          <span>Section 1: Predictive Risk Assessment (Early Warning)</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
          <Cpu size={12} className="text-slate-400" />
          <span>XGBoost Classifier P(Delay)={probability}</span>
        </div>
      </div>

      {/* 2. Primary Assessment Matrix */}
      <div className="p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Main Probability Display */}
          <div className="flex items-center gap-5">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className={`font-mono text-5xl lg:text-6xl font-black tracking-tight leading-none ${config.textColor}`}>
                  {score}%
                </span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1 font-mono">
                Delay Probability Index
              </span>
            </div>

            <div className="h-12 w-px bg-slate-200 hidden sm:block"></div>

            {/* Multi-Modal Status Description */}
            <div className="space-y-1 max-w-md">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-md border uppercase tracking-wider ${config.badgeBg}`}>
                  {config.icon}
                  <span>{category} Risk Tier</span>
                </span>
                <span className="text-xs font-bold text-slate-700">
                  RFCTLARR Act Alert
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 leading-tight">
                {config.severityText}
              </p>
              <p className="text-[11px] text-slate-500 leading-normal">
                {config.summary}
              </p>
            </div>
          </div>

          {/* Key Metric Blocks */}
          <div className="grid grid-cols-2 gap-3 shrink-0 lg:w-72">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Target Variable
              </div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                Delay &gt; 90 Days
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                Binary (0 / 1)
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Model Threshold
              </div>
              <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center justify-center gap-1">
                <TrendingUp size={13} className="text-blue-600" />
                <span>0.50 Baseline</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                Calibrated (ROC 0.84)
              </div>
            </div>
          </div>
        </div>

        {/* 3. Horizontal Statutory Risk Continuum Scale (No generic circular gauge) */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-600">
            <span>Statutory Risk Severity Continuum:</span>
            <span className="font-mono text-[11px] text-slate-500">
              Current Project Level: <strong className={config.textColor}>{score}% ({category})</strong>
            </span>
          </div>

          {/* Graduated Multi-Segment Bar */}
          <div className="relative">
            <div className="h-3.5 w-full rounded-md bg-slate-100 overflow-hidden flex border border-slate-200 p-0.5">
              {/* Segment 1: Low 0-25% */}
              <div className="h-full w-1/4 bg-emerald-500/30 rounded-l-xs relative">
                <div className="absolute inset-0 bg-emerald-500" style={{ width: score <= 25 ? `${(score / 25) * 100}%` : '100%' }}></div>
              </div>
              {/* Segment 2: Moderate 25-50% */}
              <div className="h-full w-1/4 bg-amber-500/25 relative border-l border-white/40">
                <div className="absolute inset-0 bg-amber-500" style={{ width: score > 25 && score <= 50 ? `${((score - 25) / 25) * 100}%` : score > 50 ? '100%' : '0%' }}></div>
              </div>
              {/* Segment 3: High 50-75% */}
              <div className="h-full w-1/4 bg-orange-500/25 relative border-l border-white/40">
                <div className="absolute inset-0 bg-orange-500" style={{ width: score > 50 && score <= 75 ? `${((score - 50) / 25) * 100}%` : score > 75 ? '100%' : '0%' }}></div>
              </div>
              {/* Segment 4: Critical 75-100% */}
              <div className="h-full w-1/4 bg-red-500/25 rounded-r-xs relative border-l border-white/40">
                <div className="absolute inset-0 bg-red-600" style={{ width: score > 75 ? `${((score - 75) / 25) * 100}%` : '0%' }}></div>
              </div>
            </div>

            {/* Position Pointer Pin */}
            <div
              className="absolute -top-1 transition-all duration-500 flex flex-col items-center -translate-x-1/2 pointer-events-none"
              style={{ left: `${Math.min(99, Math.max(1, score))}%` }}
            >
              <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-md ${config.indicatorColor}`}></div>
            </div>
          </div>

          {/* Scale Labels */}
          <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-0.5 font-semibold">
            <span className="text-emerald-700">0% Low</span>
            <span className="text-amber-700">25% Moderate</span>
            <span className="text-orange-700">50% High</span>
            <span className="text-red-700">75% Critical</span>
            <span className="text-red-800">100%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
