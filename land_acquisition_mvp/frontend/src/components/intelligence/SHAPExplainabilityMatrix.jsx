import React from 'react'
import {
  Binary,
  TrendingUp,
  TrendingDown,
  Info
} from 'lucide-react'

/**
 * Component 4: SHAP Attribution & Explainability Matrix
 * Custom analytical component for SIH26017.
 * Provides transparent, post-hoc explainability using TreeExplainer log-odds.
 * Visually distinguishes:
 * 1. Risk-Increasing Factors (+ SHAP)
 * 2. Risk-Reducing / Timeline-Stabilizing Factors (- SHAP)
 * 3. Proportional Magnitude via Normalized Contribution Bars
 * 4. Observed Current Project Values
 */
export default function SHAPExplainabilityMatrix({
  topRiskDrivers = [],
  protectiveFactors = [],
  formData = {}
}) {
  const allDrivers = [...topRiskDrivers, ...protectiveFactors]
  const maxImpact = Math.max(
    0.01,
    ...allDrivers.map((d) => Math.abs(parseFloat(d.impact || d.shap_value || 0.1)))
  )

  const formatFeatureLabel = (featureKey) => {
    const map = {
      approval_days_pending: 'Inter-Departmental Approval Days Pending',
      legal_cases_count: 'Active Court Litigation & Stay Petitions',
      ownership_disputes: 'Title & Succession Ownership Disputes',
      compensation_disbursed_pct: 'Direct Compensation Disbursed (%)',
      land_acquired_pct: 'Physical Land Demarcation & Acquired (%)',
      doc_deficiency_score: 'Record of Rights (RoR) Deficiency Index',
      rnp_progress_pct: 'Rehabilitation & Resettlement Progress (%)',
      possession_pct: 'Physical Right-of-Way Possession (%)',
      affected_families: 'Total Affected Families Count',
      historical_district_delay_avg: 'Historical District Delay Benchmark'
    }
    return map[featureKey] || featureKey.replace(/_/g, ' ')
  }

  const getFeatureUnit = (driver) => {
    const raw = (driver.raw_feature || driver.feature || '').toLowerCase()
    if (raw.includes('pct') || raw.includes('%')) return '%'
    if (raw.includes('days') || raw.includes('delay')) return ' Days'
    if (raw.includes('count') || raw.includes('cases')) return ' Cases'
    if (raw.includes('disputes')) return ' Disputes'
    if (raw.includes('families')) return ' Families'
    return ''
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* 1. Header Bar with Technical Explainability Context */}
      <div className="px-6 py-3 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Binary size={15} className="text-blue-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
            Stage 04: Bilateral SHAP Explainability Matrix (Why)
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-300">
            TreeExplainer Attribution: f(x) = E[f(x)] + ∑ φ_i
          </span>
        </div>
      </div>

      {/* 2. Structured Dual-Column Waterfall Attribution Matrix */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Column A: Risk-Increasing Vectors (+ SHAP) */}
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-red-50 border-2 border-red-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-red-700 text-white font-mono font-black text-xs flex items-center justify-center">
                  ▲
                </span>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-red-950">
                    Risk-Accelerating Factors (+ SHAP)
                  </h4>
                  <p className="text-[11px] text-red-800 font-medium">
                    Parameters driving the project toward statutory delay
                  </p>
                </div>
              </div>
              <span className="font-mono text-[11px] font-black text-red-800 bg-white border border-red-300 px-2 py-0.5 rounded">
                +{topRiskDrivers.length} Vectors
              </span>
            </div>

            <div className="space-y-3">
              {topRiskDrivers.length > 0 ? (
                topRiskDrivers.map((driver, idx) => {
                  const impactVal = parseFloat(driver.impact || driver.shap_value || 0)
                  const barWidth = Math.min(100, Math.max(10, (Math.abs(impactVal) / maxImpact) * 100))
                  const rawKey = driver.raw_feature || driver.feature
                  const val = driver.value ?? formData[rawKey] ?? '—'

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-red-200 bg-red-50/40 hover:bg-red-50/80 transition-all space-y-2"
                    >
                      {/* Title & Attribution Header */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-[10px] font-black px-1.5 py-0.2 rounded bg-red-200 text-red-950 shrink-0">
                            #{idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {formatFeatureLabel(driver.feature)}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-black text-red-700 shrink-0 bg-white border border-red-300 px-1.5 py-0.2 rounded">
                          +{impactVal.toFixed(3)}
                        </span>
                      </div>

                      {/* Magnitude Contribution Bar */}
                      <div className="w-full bg-red-200/80 rounded-full h-2 overflow-hidden shadow-inner">
                        <div
                          className="bg-red-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        ></div>
                      </div>

                      {/* Current Observed Project Value vs Force Direction */}
                      <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium pt-0.5">
                        <span>
                          Current Project Value: <strong className="font-mono text-slate-900 bg-white border border-slate-200 px-1.5 py-0.2 rounded">{val}{getFeatureUnit(driver)}</strong>
                        </span>
                        <span className="text-red-800 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                          <TrendingUp size={12} /> Positive Delay Force
                        </span>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  No critical positive delay drivers identified for this project profile.
                </div>
              )}
            </div>
          </div>

          {/* Column B: Risk-Reducing / Stabilizing Vectors (- SHAP) */}
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-emerald-50 border-2 border-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-emerald-700 text-white font-mono font-black text-xs flex items-center justify-center">
                  ▼
                </span>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950">
                    Timeline-Stabilizing Factors (- SHAP)
                  </h4>
                  <p className="text-[11px] text-emerald-800 font-medium">
                    Parameters pulling the project away from statutory delay
                  </p>
                </div>
              </div>
              <span className="font-mono text-[11px] font-black text-emerald-800 bg-white border border-emerald-300 px-2 py-0.5 rounded">
                -{protectiveFactors.length} Vectors
              </span>
            </div>

            <div className="space-y-3">
              {protectiveFactors.length > 0 ? (
                protectiveFactors.map((factor, idx) => {
                  const impactVal = parseFloat(factor.impact || factor.shap_value || 0)
                  const barWidth = Math.min(100, Math.max(10, (Math.abs(impactVal) / maxImpact) * 100))
                  const rawKey = factor.raw_feature || factor.feature
                  const val = factor.value ?? formData[rawKey] ?? '—'

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/80 transition-all space-y-2"
                    >
                      {/* Title & Attribution Header */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-[10px] font-black px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-950 shrink-0">
                            #{idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {formatFeatureLabel(factor.feature)}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-black text-emerald-700 shrink-0 bg-white border border-emerald-300 px-1.5 py-0.2 rounded">
                          {impactVal.toFixed(3)}
                        </span>
                      </div>

                      {/* Magnitude Contribution Bar */}
                      <div className="w-full bg-emerald-200/80 rounded-full h-2 overflow-hidden shadow-inner">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        ></div>
                      </div>

                      {/* Current Observed Project Value vs Force Direction */}
                      <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium pt-0.5">
                        <span>
                          Current Project Value: <strong className="font-mono text-slate-900 bg-white border border-slate-200 px-1.5 py-0.2 rounded">{val}{getFeatureUnit(factor)}</strong>
                        </span>
                        <span className="text-emerald-800 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                          <TrendingDown size={12} /> Stabilizing Buffer
                        </span>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  No major timeline-stabilizing features detected.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Mathematical Interpretation Footnote */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
          <Info size={15} className="text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Analytical Interpretation:</strong> Positive SHAP values indicate features that pushed this parcel towards statutory default (&gt;90 days delay), whereas negative SHAP values indicate buffers that keep the acquisition on-track. Each magnitude bar is normalized against the dominant vector.
          </p>
        </div>
      </div>
    </div>
  )
}
