import React from 'react'
import {
  TrendingUp,
  Scale,
  Clock,
  Coins,
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react'

/**
 * Component 3: Risk Drivers Panel
 * Custom analytical component for SIH26017.
 * Renders ranked empirical contribution bars demonstrating WHY a project
 * has high delay probability, displaying exact values, units, and benchmark offsets.
 */
export default function RiskDriversPanel({
  topRiskDrivers = [],
  formData = {}
}) {
  if (!topRiskDrivers || topRiskDrivers.length === 0) {
    return (
      <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
        No active risk drivers identified for this project profile.
      </div>
    )
  }

  // Calculate max impact for normalization of ranked bars
  const maxImpact = Math.max(
    0.01,
    ...topRiskDrivers.map((d) => Math.abs(parseFloat(d.impact || d.shap_value || 0.1)))
  )

  const getDriverMetadata = (featureKey) => {
    const key = (featureKey || '').toLowerCase()
    if (key.includes('approval') || key.includes('days')) {
      return {
        label: 'Inter-Departmental Approval Days Pending',
        category: 'Statutory Clearance',
        icon: <Clock size={14} className="text-amber-600" />,
        unit: ' Days',
        tagClass: 'bg-amber-100 text-amber-900 border-amber-300',
        benchmarkNote: 'Statutory Sec 19 window is 60 days max'
      }
    }
    if (key.includes('legal') || key.includes('cases') || key.includes('court')) {
      return {
        label: 'Active Court Litigation & Stay Petitions',
        category: 'Judicial Impediment',
        icon: <Scale size={14} className="text-red-600" />,
        unit: ' Active Cases',
        tagClass: 'bg-red-100 text-red-900 border-red-300',
        benchmarkNote: 'High Court writ petitions stall right-of-way handover'
      }
    }
    if (key.includes('dispute') || key.includes('ownership') || key.includes('title')) {
      return {
        label: 'Title & Succession Ownership Disputes',
        category: 'Land Title Friction',
        icon: <AlertTriangle size={14} className="text-orange-600" />,
        unit: ' Parcel Disputes',
        tagClass: 'bg-orange-100 text-orange-900 border-orange-300',
        benchmarkNote: 'Requires Special Talathi inquiry camps'
      }
    }
    if (key.includes('compensation') || key.includes('disbursed')) {
      return {
        label: 'Compensation Direct Benefit Transfer Lag',
        category: 'Fiscal Milestone',
        icon: <Coins size={14} className="text-emerald-700" />,
        unit: '% Disbursed',
        tagClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        benchmarkNote: 'Lag in Sec 23 award deposits triggers landholder resistance'
      }
    }
    if (key.includes('doc') || key.includes('deficiency')) {
      return {
        label: 'Record of Rights (RoR) Deficiency Index',
        category: 'Documentation',
        icon: <FileSpreadsheet size={14} className="text-blue-600" />,
        unit: '% Deficient',
        tagClass: 'bg-blue-100 text-blue-900 border-blue-300',
        benchmarkNote: 'Missing mutation entries and legacy survey discrepancies'
      }
    }
    return {
      label: featureKey.replace(/_/g, ' '),
      category: 'Procedural Parameter',
      icon: <TrendingUp size={14} className="text-slate-600" />,
      unit: '',
      tagClass: 'bg-slate-100 text-slate-900 border-slate-300',
      benchmarkNote: 'Empirical model feature'
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* 1. Technical Header */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded bg-red-100 text-red-800 text-xs font-mono font-bold">
            ▲
          </span>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
            Stage 03: Primary Risk Drivers & Empirical Friction Vectors (Why)
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
          <span className="bg-white border border-slate-200 px-2 py-0.5 rounded font-bold">
            Ranked by Marginal Delay Contribution
          </span>
        </div>
      </div>

      {/* 2. Ranked Contribution Bars */}
      <div className="p-6 space-y-4">
        <p className="text-xs text-slate-600 leading-relaxed">
          The following empirical variables represent the dominant bottlenecks driving this project's delay probability.
          Mitigating these specific vectors will produce the steepest reduction in projected project delay.
        </p>

        <div className="space-y-3 pt-1">
          {topRiskDrivers.map((driver, idx) => {
            const rawKey = driver.raw_feature || driver.feature
            const meta = getDriverMetadata(rawKey)
            const impactVal = parseFloat(driver.impact || driver.shap_value || 0)
            const barWidth = Math.min(100, Math.max(12, (Math.abs(impactVal) / maxImpact) * 100))
            const rawValue = driver.value ?? formData[rawKey] ?? '—'

            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-2.5"
              >
                {/* Upper Metadata Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-900 text-white shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="flex items-center gap-2 truncate">
                      {meta.icon}
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {meta.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${meta.tagClass}`}>
                      {meta.category}
                    </span>
                    <span className="font-mono text-xs font-black text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                      +{impactVal.toFixed(3)} Delay Force
                    </span>
                  </div>
                </div>

                {/* Ranked Horizontal Contribution Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex shadow-inner">
                    <div
                      className="bg-red-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Baseline Weight</span>
                    <span className="font-bold text-red-800">Impact Magnitude: {Math.round(barWidth)}%</span>
                  </div>
                </div>

                {/* Project Value & Statutory Context */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 border-t border-slate-200/60 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Observed Project Metric:</span>
                    <strong className="font-mono text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded font-black">
                      {rawValue}{meta.unit}
                    </strong>
                  </div>
                  <div className="text-[11px] text-slate-500 italic">
                    {meta.benchmarkNote}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
