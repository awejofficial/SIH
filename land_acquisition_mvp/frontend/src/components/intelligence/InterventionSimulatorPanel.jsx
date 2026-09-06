import React from 'react'
import {
  Sliders,
  TrendingDown,
  RefreshCw
} from 'lucide-react'

export default function InterventionSimulatorPanel({
  selectedFeature,
  onFeatureChange,
  sliderValue,
  onSliderChange,
  onRunSimulation,
  loading,
  whatifResult,
  baselineData = {}
}) {
  const FEATURE_CONFIG = {
    compensation_disbursed_pct: {
      label: 'Direct Compensation Disbursed (%)',
      min: 0,
      max: 100,
      step: 1,
      unit: '%',
      rationale: 'Accelerating Direct Benefit Transfer (DBT) to affected land owners mitigates Section 23 litigation.'
    },
    legal_cases_count: {
      label: 'Active Court Litigation Cases (Count)',
      min: 0,
      max: 15,
      step: 1,
      unit: ' Cases',
      rationale: 'Convening Special Land Lok Adalats reduces unresolved writ petitions in high court.'
    },
    approval_days_pending: {
      label: 'Inter-Departmental Approval Pending (Days)',
      min: 0,
      max: 120,
      step: 5,
      unit: ' Days',
      rationale: 'Escalating single-window clearances reduces statutory Section 19 declaration hold-ups.'
    },
    possession_pct: {
      label: 'Physical Possession & Handover (%)',
      min: 0,
      max: 100,
      step: 1,
      unit: '%',
      rationale: 'Conducting joint revenue-police demarcation clears encumbrances for right-of-way handover.'
    },
    doc_deficiency_score: {
      label: 'Record of Rights (RoR) Deficiency Score (%)',
      min: 0,
      max: 100,
      step: 5,
      unit: '%',
      rationale: 'Special Talathi revenue camps rectify title succession disputes and missing 7/12 land records.'
    }
  }

  const currentConfig = FEATURE_CONFIG[selectedFeature] || FEATURE_CONFIG.compensation_disbursed_pct
  const baselineVal = baselineData[selectedFeature] ?? 0

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* 1. Header */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-blue-600" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
            Section 5: Intervention Impact Simulator (What-If Policy Analysis)
          </h3>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
          <span>Trained XGBoost Inference • Zero Retraining Overhead</span>
        </div>
      </div>

      {/* 2. Structured Controller & Comparison Workspace */}
      <div className="p-6 space-y-6">
        {/* Input & Policy Lever Controller */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Feature Picker */}
            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target Policy Lever to Simulate
              </label>
              <select
                value={selectedFeature}
                onChange={(e) => onFeatureChange(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400/20"
              >
                {Object.entries(FEATURE_CONFIG).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Range Slider */}
            <div className="md:col-span-5">
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Simulated Target:</span>
                <span className="font-mono text-blue-600 font-black">
                  {sliderValue}{currentConfig.unit}
                </span>
              </div>
              <input
                type="range"
                min={currentConfig.min}
                max={currentConfig.max}
                step={currentConfig.step}
                value={sliderValue}
                onChange={(e) => onSliderChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:ring-2 focus:ring-blue-400/30"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>Min: {currentConfig.min}{currentConfig.unit}</span>
                <span className="text-slate-600 font-bold">Baseline: {baselineVal}{currentConfig.unit}</span>
                <span>Max: {currentConfig.max}{currentConfig.unit}</span>
              </div>
            </div>

            {/* Run Button */}
            <div className="md:col-span-3">
              <button
                type="button"
                onClick={onRunSimulation}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw size={14} className="animate-spin" /> : <TrendingDown size={14} />}
                <span>Simulate Model Response</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/60">
            <strong>Policy Rationale:</strong> {currentConfig.rationale}
          </p>
        </div>

        {/* Structured "Current State vs Simulated State" Comparison Matrix */}
        {whatifResult && (
          <div className="p-5 rounded-xl bg-blue-50/50 border border-blue-200 animate-fadeIn space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-blue-900 border-b border-blue-200/60 pb-2">
              <span className="uppercase tracking-wider">Comparative Impact Analysis</span>
              <span className="font-mono text-[11px] font-semibold text-blue-700">
                Lever: {currentConfig.label}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center items-stretch">
              {/* Box 1: Baseline Pre-Intervention */}
              <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Current Baseline State
                  </div>
                  <div className="font-mono text-3xl font-black text-red-600 mt-1">
                    {whatifResult.original_risk}%
                  </div>
                </div>
                <div className="text-[11px] font-mono text-slate-500 font-medium mt-2 pt-2 border-t border-slate-100">
                  Value: <strong>{whatifResult.original_value ?? baselineVal}{currentConfig.unit}</strong>
                </div>
              </div>

              {/* Box 2: Simulated Outcome */}
              <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Simulated Projected State
                  </div>
                  <div className="font-mono text-3xl font-black text-emerald-600 mt-1">
                    {whatifResult.new_risk}%
                  </div>
                </div>
                <div className="text-[11px] font-mono text-slate-500 font-medium mt-2 pt-2 border-t border-slate-100">
                  Simulated Target: <strong>{whatifResult.new_value ?? sliderValue}{currentConfig.unit}</strong>
                </div>
              </div>

              {/* Box 3: Delta Impact / Savings */}
              <div className="p-4 rounded-lg bg-white border border-blue-300 bg-blue-50/70 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-800">
                    Achievable Risk Reduction
                  </div>
                  <div className="font-mono text-3xl font-black text-blue-700 mt-1">
                    {whatifResult.reduction > 0 ? `-${whatifResult.reduction}%` : `+${Math.abs(whatifResult.reduction)}%`}
                  </div>
                </div>
                <div className="text-[11px] font-semibold text-blue-700 mt-2 pt-2 border-t border-blue-200">
                  {whatifResult.reduction > 0 ? '✓ Projected Delay Prevented' : '⚠️ Risk Inflation'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
