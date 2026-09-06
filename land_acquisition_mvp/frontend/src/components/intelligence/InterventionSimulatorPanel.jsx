import React from 'react'
import {
  Sliders,
  TrendingDown,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react'
import RiskCategoryBadge from './RiskCategoryBadge'

/**
 * Component 7: Intervention Simulation Panel
 * Custom policy simulation workbench for SIH26017.
 * Concretely contrasts "Current State" vs. "Simulated State",
 * displaying policy levers, model response, and achievable delay reduction.
 */
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
      rationale: 'Accelerating Direct Benefit Transfer (DBT) to affected land owners mitigates Section 23 litigation and physical resistance.'
    },
    legal_cases_count: {
      label: 'Active Court Litigation Cases (Count)',
      min: 0,
      max: 15,
      step: 1,
      unit: ' Cases',
      rationale: 'Convening Special Land Lok Adalats resolves pending High Court writ petitions and vacates stay orders.'
    },
    approval_days_pending: {
      label: 'Inter-Departmental Approval Pending (Days)',
      min: 0,
      max: 120,
      step: 5,
      unit: ' Days',
      rationale: 'Escalating clearances through single-window nodal authority prevents statutory Section 19 declaration hold-ups.'
    },
    possession_pct: {
      label: 'Physical Possession & Handover (%)',
      min: 0,
      max: 100,
      step: 1,
      unit: '%',
      rationale: 'Conducting joint revenue-police demarcation clears encumbrances for right-of-way handover under Section 38.'
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
      {/* 1. Header Bar */}
      <div className="px-6 py-3 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-blue-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
            Stage 07: Policy Intervention Simulator (What Can Change)
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-300">
            Real-Time XGBoost Inference • Zero Retraining Overhead
          </span>
        </div>
      </div>

      {/* 2. Structured Controller & Comparison Workspace */}
      <div className="p-6 space-y-6">
        {/* Input & Policy Lever Controller */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
            {/* Feature Picker */}
            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-slate-800 mb-1.5 font-mono uppercase tracking-wider">
                Select Policy Lever
              </label>
              <select
                value={selectedFeature}
                onChange={(e) => onFeatureChange(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400/20 shadow-2xs"
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
                <span className="text-slate-500">Simulate Target Intervention Value:</span>
                <span className="font-mono text-blue-700 font-black text-sm bg-blue-50 border border-blue-200 px-2 py-0.2 rounded">
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
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:ring-2 focus:ring-blue-400/30"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
                <span>Min: {currentConfig.min}{currentConfig.unit}</span>
                <span className="text-slate-800 font-bold bg-slate-200/80 px-1.5 rounded">Current Baseline: {baselineVal}{currentConfig.unit}</span>
                <span>Max: {currentConfig.max}{currentConfig.unit}</span>
              </div>
            </div>

            {/* Run Button */}
            <div className="md:col-span-3">
              <button
                type="button"
                onClick={onRunSimulation}
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw size={14} className="animate-spin" /> : <TrendingDown size={14} />}
                <span>Simulate Outcome</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 italic pt-2 border-t border-slate-200/80">
            <strong>Statutory Rationale:</strong> {currentConfig.rationale}
          </p>
        </div>

        {/* Structured "Current State vs Simulated State" Comparison Matrix */}
        {whatifResult && (
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-300 shadow-xs space-y-4 animate-fadeIn">
            {/* Comparison Ribbon Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-blue-700" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Empirical Policy Outcome Comparison Matrix
                </h4>
              </div>
              <span className="font-mono text-[11px] text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
                Lever: <strong>{currentConfig.label}</strong>
              </span>
            </div>

            {/* 3-Column Comparison: Current State vs Simulated State vs Achievable Delta */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
              {/* Panel 1: Current Baseline State (Cols 1-4) */}
              <div className="md:col-span-4 p-4 rounded-xl bg-white border-2 border-slate-300 shadow-2xs flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                      State A: Current Baseline
                    </span>
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  </div>
                  <div className="font-mono text-4xl font-black text-slate-900 mt-1">
                    {whatifResult.original_risk}%
                  </div>
                  <div className="pt-1">
                    <RiskCategoryBadge
                      score={whatifResult.original_risk}
                      variant="compact"
                      showMeaning={false}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-600">
                  Current Observed Value:{' '}
                  <strong className="text-slate-900">
                    {whatifResult.original_value ?? baselineVal}{currentConfig.unit}
                  </strong>
                </div>
              </div>

              {/* Transition Indicator (Middle Arrow in desktop) */}
              <div className="hidden md:flex md:col-span-1 items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center">
                  <ArrowRight size={16} />
                </div>
              </div>

              {/* Panel 2: Simulated Target State (Cols 6-8 in 12-col) */}
              <div className="md:col-span-4 p-4 rounded-xl bg-white border-2 border-blue-400 shadow-2xs flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700">
                      State B: Simulated Target
                    </span>
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  </div>
                  <div className="font-mono text-4xl font-black text-blue-700 mt-1">
                    {whatifResult.new_risk}%
                  </div>
                  <div className="pt-1">
                    <RiskCategoryBadge
                      score={whatifResult.new_risk}
                      variant="compact"
                      showMeaning={false}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-600">
                  Simulated Target Lever:{' '}
                  <strong className="text-blue-700 font-bold">
                    {whatifResult.new_value ?? sliderValue}{currentConfig.unit}
                  </strong>
                </div>
              </div>

              {/* Panel 3: Achievable Impact Delta (Cols 10-12 in 12-col) */}
              <div className={`md:col-span-3 p-4 rounded-xl border-2 shadow-2xs flex flex-col justify-between space-y-3 ${
                whatifResult.reduction > 0
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                  : 'bg-red-50 border-red-400 text-red-950'
              }`}>
                <div className="space-y-1">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600">
                    Net Impact Delta
                  </div>
                  <div className="font-mono text-4xl font-black">
                    {whatifResult.reduction > 0 ? `-${whatifResult.reduction}%` : `+${Math.abs(whatifResult.reduction)}%`}
                  </div>
                  <div className="text-[11px] font-bold">
                    {whatifResult.reduction > 0 ? 'Risk Force Mitigated' : 'Risk Inflation'}
                  </div>
                </div>

                <div className="pt-2 border-t border-current/20 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>
                    {whatifResult.reduction > 0 ? 'Projected Delay Prevented' : 'Warning: Risk Increased'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
