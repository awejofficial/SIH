import React from 'react'
import {
  Cpu,
  TrendingUp,
  ShieldAlert,
  SlidersHorizontal,
  Scale
} from 'lucide-react'
import RiskCategoryBadge from './RiskCategoryBadge'

/**
 * Component 1: Delay Probability & Statutory Continuum Monitor
 * Custom product component for SIH26017.
 * Replaces generic circular dials with an analytical horizontal continuum scale,
 * decision boundary demarcation, and multi-modal risk cues.
 */
export default function DelayProbabilityCard({ prediction }) {
  if (!prediction) return null

  const score = Math.round(prediction.risk_score || 0)
  const category = prediction.risk_category || 'Moderate'
  const probability = prediction.delay_probability !== undefined
    ? Number(prediction.delay_probability).toFixed(3)
    : (score / 100).toFixed(3)

  const getSymbol = (cat) => {
    switch (cat) {
      case 'Critical': return '▲'
      case 'High': return '◆'
      case 'Moderate': return '■'
      default: return '●'
    }
  }

  const symbol = getSymbol(category)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all">
      {/* 1. Technical Telemetry Header */}
      <div className="px-6 py-3 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase">
          <ShieldAlert size={14} className="text-amber-400" />
          <span>Stage 01: Empirical Prediction & Statutory Delay Probability</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-0.5 rounded">
            <Cpu size={12} className="text-blue-400" />
            <span>XGBoost v1.4 P(Delay)={probability}</span>
          </span>
          <span className="font-mono text-[11px] bg-slate-800 border border-slate-700 text-amber-300 px-2 py-0.5 rounded font-bold">
            ROC-AUC 0.84
          </span>
        </div>
      </div>

      {/* 2. Primary Assessment Matrix */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Probability Display (Cols 1-4) */}
          <div className="lg:col-span-4 p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
              <span>Delay Probability Index</span>
              <span className="text-slate-400">P(Y=1)</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-mono text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-none">
                {score}%
              </span>
              <div className="space-y-0.5">
                <span className="font-mono text-xs font-bold text-slate-500 block">
                  [{probability} raw]
                </span>
                <span className="font-mono text-[10px] font-bold text-red-700 uppercase bg-red-100 px-1.5 py-0.2 rounded border border-red-200">
                  Target: &gt;90d Delay
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600 font-medium font-mono">
              <span>Decision Boundary:</span>
              <strong className="text-slate-900">0.500 (50%)</strong>
            </div>
          </div>

          {/* Detailed Multi-Modal Statutory Assessment (Cols 5-8) */}
          <div className="lg:col-span-5">
            <RiskCategoryBadge
              score={score}
              category={category}
              variant="detailed"
              showMeaning={true}
            />
          </div>

          {/* Operational Calibration Parameters (Cols 9-12) */}
          <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-2.5">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Scale size={11} className="text-slate-500" />
                <span>Statutory Mandate</span>
              </div>
              <div className="text-xs font-black text-slate-900">RFCTLARR 2013</div>
              <div className="text-[10px] text-slate-500">Sec 19 & Sec 23 Timelines</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <SlidersHorizontal size={11} className="text-blue-600" />
                <span>Model Calibration</span>
              </div>
              <div className="text-xs font-black text-slate-900 flex items-center gap-1">
                <TrendingUp size={12} className="text-emerald-600" />
                <span>Isotonic Regression</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">13 Pre-Award Features</div>
            </div>
          </div>
        </div>

        {/* 3. Horizontal Analytical Risk Continuum Scale (No generic circular gauges!) */}
        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Statutory Risk Severity Continuum:
              </span>
              <span className="font-mono text-[10px] bg-white border border-slate-300 px-1.5 py-0.2 rounded font-bold text-slate-700">
                Continuous Scale [0% — 100%]
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-slate-700">
              Current Vector: <strong className="font-black text-slate-900">{symbol} {score}% ({category} Tier)</strong>
            </span>
          </div>

          {/* Graduated Multi-Tier Continuum Bar with Calibrated Divisions */}
          <div className="relative pt-4 pb-2">
            {/* Calibration Marker Line for 50% Threshold */}
            <div
              className="absolute -top-1 bottom-0 w-0.5 bg-slate-900 z-10 pointer-events-none"
              style={{ left: '50%' }}
            >
              <span className="absolute -top-4 -translate-x-1/2 font-mono text-[9px] font-black px-1 rounded bg-slate-900 text-white whitespace-nowrap shadow-2xs">
                50% Threshold
              </span>
            </div>

            {/* Segmented Track */}
            <div className="h-4 w-full rounded-md bg-slate-200 overflow-hidden flex border border-slate-300 shadow-inner">
              {/* Band 1: Low 0-25% */}
              <div className="h-full w-1/4 bg-emerald-100 relative border-r border-white/60">
                <div
                  className="absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-500"
                  style={{ width: score <= 25 ? `${(score / 25) * 100}%` : '100%' }}
                ></div>
              </div>

              {/* Band 2: Moderate 25-50% */}
              <div className="h-full w-1/4 bg-amber-100 relative border-r border-white/60">
                <div
                  className="absolute inset-y-0 left-0 bg-amber-500 transition-all duration-500"
                  style={{ width: score > 25 && score <= 50 ? `${((score - 25) / 25) * 100}%` : score > 50 ? '100%' : '0%' }}
                ></div>
              </div>

              {/* Band 3: High 50-75% */}
              <div className="h-full w-1/4 bg-orange-100 relative border-r border-white/60">
                <div
                  className="absolute inset-y-0 left-0 bg-orange-500 transition-all duration-500"
                  style={{ width: score > 50 && score <= 75 ? `${((score - 50) / 25) * 100}%` : score > 75 ? '100%' : '0%' }}
                ></div>
              </div>

              {/* Band 4: Critical 75-100% */}
              <div className="h-full w-1/4 bg-red-100 relative">
                <div
                  className="absolute inset-y-0 left-0 bg-red-600 transition-all duration-500"
                  style={{ width: score > 75 ? `${((score - 75) / 25) * 100}%` : '0%' }}
                ></div>
              </div>
            </div>

            {/* Indicator Needle & Position Chip */}
            <div
              className="absolute top-1 transition-all duration-500 flex flex-col items-center -translate-x-1/2 pointer-events-none z-20"
              style={{ left: `${Math.min(98, Math.max(2, score))}%` }}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-white shadow-md flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              </div>
            </div>
          </div>

          {/* Continuum Legend & Geometric Anchors */}
          <div className="grid grid-cols-4 text-[10px] font-mono font-bold text-slate-600 pt-1 border-t border-slate-200">
            <div className="text-left text-emerald-800">
              <span>● 0% Low Tier</span>
              <span className="block text-[9px] font-normal text-slate-500">RFCTLARR On-Track</span>
            </div>
            <div className="text-center text-amber-800">
              <span>■ 25% Moderate</span>
              <span className="block text-[9px] font-normal text-slate-500">Procedural Lags</span>
            </div>
            <div className="text-center text-orange-800">
              <span>◆ 50% High Friction</span>
              <span className="block text-[9px] font-normal text-slate-500">Statutory Breach Zone</span>
            </div>
            <div className="text-right text-red-800">
              <span>▲ 75%-100% Critical</span>
              <span className="block text-[9px] font-normal text-slate-500">Mandatory Intervention</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
