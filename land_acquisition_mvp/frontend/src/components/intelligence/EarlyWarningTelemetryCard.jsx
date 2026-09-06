import React from 'react'
import {
  Siren,
  ChevronRight
} from 'lucide-react'
import RiskCategoryBadge from './RiskCategoryBadge'

/**
 * Component 8: Early Warning Telemetry Card
 * Custom mission-critical early warning radar component for SIH26017.
 * Proactively alerts officers BEFORE statutory default occurs under RFCTLARR Act 2013,
 * highlighting statutory time-to-breach, active alerts, and immediate triage protocols.
 */
export default function EarlyWarningTelemetryCard({
  prediction = null,
  formData = {},
  onScrollToIntervention = null
}) {
  if (!prediction) return null

  const score = Math.round(prediction.risk_score || 0)
  const category = prediction.risk_category || 'Moderate'
  const isBreachRisk = score >= 50
  const isCritical = score >= 75

  // Generate domain-specific statutory warning flags from actual project features
  const warningFlags = []
  if (parseInt(formData.approval_days_pending || 0, 10) > 60) {
    warningFlags.push({
      code: 'SEC19-EXP',
      label: 'Section 19 Declaration Expiry Imminent',
      detail: `Approval pending for ${formData.approval_days_pending} days. Approaching 12-month statutory lapse.`,
      severity: 'Critical'
    })
  }
  if (parseInt(formData.legal_cases_count || 0, 10) >= 3) {
    warningFlags.push({
      code: 'JUD-STAY',
      label: 'High Court Judicial Hold Vector',
      detail: `${formData.legal_cases_count} active court cases risking right-of-way injunctions.`,
      severity: 'High'
    })
  }
  if (parseInt(formData.compensation_disbursed_pct || 0, 10) < 50) {
    warningFlags.push({
      code: 'DBT-LAG',
      label: 'Section 23 Compensation Award Lag',
      detail: `Only ${formData.compensation_disbursed_pct}% DBT disbursed to landholders. Possession impeded.`,
      severity: 'High'
    })
  }
  if (parseInt(formData.doc_deficiency_score || 0, 10) >= 30) {
    warningFlags.push({
      code: 'ROR-DEF',
      label: 'Record of Rights Survey Mismatch',
      detail: `Documentation deficiency score at ${formData.doc_deficiency_score}%. Title succession unresolved.`,
      severity: 'Moderate'
    })
  }

  return (
    <div className={`rounded-xl border-2 overflow-hidden shadow-xs transition-all ${
      isCritical
        ? 'bg-red-50/50 border-red-500'
        : isBreachRisk
        ? 'bg-orange-50/50 border-orange-400'
        : 'bg-emerald-50/50 border-emerald-400'
    }`}>
      {/* 1. Radar Telemetry Header */}
      <div className={`px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b text-white ${
        isCritical ? 'bg-red-950 border-red-900' : isBreachRisk ? 'bg-orange-950 border-orange-900' : 'bg-emerald-950 border-emerald-900'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Siren size={16} className={isBreachRisk ? 'text-amber-400 animate-pulse' : 'text-emerald-400'} />
            {isBreachRisk && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            )}
          </div>
          <span className="font-mono text-xs font-black uppercase tracking-wider">
            Early Warning Telemetry & Statutory Breach Radar (Pre-Default Detection)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/10 border border-white/20 uppercase font-bold">
            Condition: {isBreachRisk ? 'Statutory Delay Predicted (>90d)' : 'Normal Compliance Track'}
          </span>
        </div>
      </div>

      {/* 2. Main Alert Dossier */}
      <div className="p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <RiskCategoryBadge
                score={score}
                category={category}
                variant="pill"
                showMeaning={true}
              />
              <span className="font-mono text-[11px] font-bold text-slate-600 bg-white border border-slate-300 px-2 py-0.5 rounded">
                Threshold: P(Delay) &gt; 0.50
              </span>
            </div>

            <h3 className="text-base font-black text-slate-900 tracking-tight">
              {isCritical
                ? 'Mandatory Collector Notice: Statutory Acquisition Timelines in Default State'
                : isBreachRisk
                ? 'Early Friction Alert: Procedural Impediments Require SLAO Field Intervention'
                : 'Statutory Trajectory Nominal: Project Milestones On-Schedule'}
            </h3>

            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {isCritical
                ? 'Projections indicate statutory breach under Section 19 or Section 23 of RFCTLARR Act 2013 within the next 30 days unless direct administrative intervention is sanctioned immediately.'
                : isBreachRisk
                ? 'Early warning algorithms have detected emerging procedural friction across land records or inter-departmental clearances. Prompt corrective actions will prevent project cost and timeline overruns.'
                : 'Predictive indicators confirm that land acquisition proceedings are adhering to statutory schedules with minimal litigious or compensation friction.'}
            </p>
          </div>

          {/* Action Trigger Button */}
          {onScrollToIntervention && (
            <div className="shrink-0">
              <button
                type="button"
                onClick={onScrollToIntervention}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-xs transition-colors cursor-pointer font-mono uppercase tracking-wider"
              >
                <span>Jump to Policy Simulator</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* 3. Active Warning Vector Badges */}
        {warningFlags.length > 0 && (
          <div className="pt-3 border-t border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600">
              <span>Identified Pre-Default Impediments ({warningFlags.length})</span>
              <span className="text-slate-400">Section References</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {warningFlags.map((flag, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs flex items-start gap-2.5"
                >
                  <span className="font-mono text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300 shrink-0">
                    {flag.code}
                  </span>
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {flag.label}
                    </div>
                    <div className="text-[11px] text-slate-600 leading-snug">
                      {flag.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
