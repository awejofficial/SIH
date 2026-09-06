import React from 'react'
import {
  TrendingUp,
  TrendingDown,
  Binary
} from 'lucide-react'

export default function SHAPExplainabilityMatrix({
  topRiskDrivers = [],
  protectiveFactors = [],
  formData = {}
}) {
  // Compute max absolute SHAP impact to normalize progress bars
  const allDrivers = [...topRiskDrivers, ...protectiveFactors]
  const maxImpact = Math.max(
    0.01,
    ...allDrivers.map((d) => Math.abs(parseFloat(d.impact || d.shap_value || 0.1)))
  )

  const formatFeatureLabel = (featureKey) => {
    const map = {
      approval_days_pending: 'Approval Days Pending',
      legal_cases_count: 'Active Legal Court Cases',
      ownership_disputes: 'Title & Ownership Disputes',
      compensation_disbursed_pct: 'Compensation Disbursed %',
      land_acquired_pct: 'Physical Land Acquired %',
      doc_deficiency_score: 'Documentation Deficiency Index',
      rnp_progress_pct: 'R&R Progress %',
      possession_pct: 'Physical Possession %',
      affected_families: 'Affected Families Count',
      historical_district_delay_avg: 'Historical District Delay Benchmark'
    }
    return map[featureKey] || featureKey.replace(/_/g, ' ')
  }

  const getFeatureUnit = (driver) => {
    const raw = driver.raw_feature || driver.feature
    if (raw?.includes('pct') || driver.feature?.includes('%')) return '%'
    if (raw?.includes('days')) return ' Days'
    if (raw?.includes('count') || raw?.includes('cases') || raw?.includes('disputes') || raw?.includes('families')) return ''
    return ''
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* 1. Matrix Header */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Binary size={16} className="text-blue-600" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
            Section 2: SHAP Attribution Matrix — Why Is This Project At Risk?
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="font-mono bg-white border border-slate-200 px-2 py-0.5 rounded">
            TreeExplainer (Log-Odds Impact)
          </span>
        </div>
      </div>

      {/* 2. Dual-Column Analytical Grid */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Risk Accelerators (Positive SHAP) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-red-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-md bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                +
              </span>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-red-900">
                  Risk-Accelerating Factors
                </h4>
                <p className="text-[11px] text-red-700">
                  Bottlenecks pushing this project towards delay
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
              +{topRiskDrivers.length} Vectors
            </span>
          </div>

          <div className="space-y-2.5">
            {topRiskDrivers.length > 0 ? (
              topRiskDrivers.map((driver, idx) => {
                const impactVal = parseFloat(driver.impact || driver.shap_value || 0)
                const barWidth = Math.min(100, Math.max(8, (Math.abs(impactVal) / maxImpact) * 100))
                const rawKey = driver.raw_feature || driver.feature
                const val = driver.value ?? formData[rawKey] ?? '—'

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-red-200/70 bg-red-50/30 hover:bg-red-50/60 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-[10px] font-black px-1.5 py-0.5 rounded bg-red-200 text-red-900 shrink-0">
                          #{idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {formatFeatureLabel(driver.feature)}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-black text-red-700 shrink-0">
                        +{impactVal.toFixed(3)} SHAP
                      </span>
                    </div>

                    {/* Proportional Magnitude Bar */}
                    <div className="w-full bg-red-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-red-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      ></div>
                    </div>

                    {/* Current Value vs Attribution Interpretation */}
                    <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                      <span>
                        Project Value: <strong className="font-mono text-slate-900">{val}{getFeatureUnit(driver)}</strong>
                      </span>
                      <span className="text-red-700 font-semibold text-[10px] uppercase tracking-wider flex items-center gap-1">
                        <TrendingUp size={11} /> Delay Trigger
                      </span>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                No major risk-accelerating bottlenecks identified.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Protective / Mitigating Factors (Negative SHAP) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                -
              </span>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900">
                  Timeline-Stabilizing Factors
                </h4>
                <p className="text-[11px] text-emerald-700">
                  Parameters pulling this project away from delay
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              -{protectiveFactors.length} Vectors
            </span>
          </div>

          <div className="space-y-2.5">
            {protectiveFactors.length > 0 ? (
              protectiveFactors.map((factor, idx) => {
                const impactVal = parseFloat(factor.impact || factor.shap_value || 0)
                const barWidth = Math.min(100, Math.max(8, (Math.abs(impactVal) / maxImpact) * 100))
                const rawKey = factor.raw_feature || factor.feature
                const val = factor.value ?? formData[rawKey] ?? '—'

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-emerald-200/70 bg-emerald-50/30 hover:bg-emerald-50/60 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 shrink-0">
                          #{idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {formatFeatureLabel(factor.feature)}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-black text-emerald-700 shrink-0">
                        {impactVal.toFixed(3)} SHAP
                      </span>
                    </div>

                    {/* Proportional Magnitude Bar */}
                    <div className="w-full bg-emerald-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      ></div>
                    </div>

                    {/* Current Value vs Attribution Interpretation */}
                    <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                      <span>
                        Project Value: <strong className="font-mono text-slate-900">{val}{getFeatureUnit(factor)}</strong>
                      </span>
                      <span className="text-emerald-700 font-semibold text-[10px] uppercase tracking-wider flex items-center gap-1">
                        <TrendingDown size={11} /> Buffer Vector
                      </span>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                No major stabilizing factors observed.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
