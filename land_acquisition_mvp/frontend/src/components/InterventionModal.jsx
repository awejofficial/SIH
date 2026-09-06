import React, { useEffect, useState } from 'react'
import api from '../services/api'
import RiskCategoryBadge from './intelligence/RiskCategoryBadge'
import {
  X,
  ShieldAlert,
  FileCheck2,
  Send,
  Building2,
  Scale,
  Sparkles,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react'

// Official Administrative Revenue Directives mapped to RFCTLARR Act statutory powers
const STATUTORY_DIRECTIVES = [
  {
    title: 'Direct DBT Compensation Release Batch Sanctioned',
    authority: 'Collector Sanction (Sec 26-30 RFCTLARR Act)',
    projectedDelta: '-18% Risk Reduction',
    impactClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    description: 'Expedite direct bank disbursement batch to awardees to eliminate financial possession hurdles.'
  },
  {
    title: 'Special Land Lok Adalat / Joint Revenue Hearing Scheduled',
    authority: 'Revenue Magistrate / LARR Tribunal (Sec 64)',
    projectedDelta: '-14% Risk Reduction',
    impactClass: 'text-blue-700 bg-blue-50 border-blue-200',
    description: 'Convene dedicated conciliation bench to resolve pending ownership title and inheritance disputes.'
  },
  {
    title: 'Single-Window Clearance High-Level Escalation Filed',
    authority: 'State Empowered Infrastructure Committee',
    projectedDelta: '-15% Risk Reduction',
    impactClass: 'text-purple-700 bg-purple-50 border-purple-200',
    description: 'Inter-departmental fast-track for environmental, railway, and utility line shifting approvals.'
  },
  {
    title: 'Village Revenue Talathi Survey & Record Rectification Drive',
    authority: 'Tahsildar / Sub-Divisional Field Unit',
    projectedDelta: '-10% Risk Reduction',
    impactClass: 'text-amber-700 bg-amber-50 border-amber-200',
    description: 'Deploy revenue patwaris for ground-truth 7/12 record matching and document deficiency clearance.'
  },
  {
    title: 'Joint Revenue-Police Demarcation Drive Conducted',
    authority: 'Competent Authority / SDO Enforcement',
    projectedDelta: '-12% Risk Reduction',
    impactClass: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    description: 'Deploy boundary marking teams with administrative escort to execute physical possession (Sec 38).'
  }
]

export default function InterventionModal({ project, onClose, onUpdate }) {
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [action, setAction] = useState(STATUTORY_DIRECTIVES[0].title)
  const [remarks, setRemarks] = useState('')
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0])
  const [successNotice, setSuccessNotice] = useState(false)

  const formattedId = project.formatted_id || `PRJ-2026-${String(project.project_id || 101).padStart(4, '0')}`

  useEffect(() => {
    const getPrediction = async () => {
      try {
        const payload = {
          project_id: project.project_id ? Math.abs(Number(project.project_id)) : undefined,
          district: project.district || 'Pune',
          project_type: project.project_type || 'Highway',
          total_acres: Math.abs(parseFloat(project.total_acres) || 250),
          land_acquired_pct: Math.min(100, Math.abs(parseFloat(project.land_acquired_pct) || 50)),
          approval_days_pending: Math.abs(parseInt(project.approval_days_pending, 10) || 30),
          compensation_disbursed_pct: Math.min(100, Math.abs(parseFloat(project.compensation_disbursed_pct) || 40)),
          legal_cases_count: Math.abs(parseInt(project.legal_cases_count, 10) || 0),
          ownership_disputes: Math.abs(parseInt(project.ownership_disputes, 10) || 0),
          rnp_progress_pct: Math.min(100, Math.abs(parseFloat(project.rnp_progress_pct) || 50)),
          possession_pct: Math.min(100, Math.abs(parseFloat(project.possession_pct) || 30)),
          affected_families: Math.abs(parseInt(project.affected_families, 10) || 100),
          doc_deficiency_score: Math.abs(parseFloat(project.doc_deficiency_score) || 20),
          historical_district_delay_avg: Math.abs(parseFloat(project.historical_district_delay_avg) || 15),
        }

        const res = await api.post('/predict', payload)
        setPrediction(res.data)
      } catch (err) {
        console.error('Failed to get prediction in intervention modal:', err)
      } finally {
        setLoading(false)
      }
    }

    getPrediction()
  }, [project])

  const handleSubmitIntervention = async (e) => {
    e.preventDefault()
    if (!action) return

    setSubmitting(true)
    try {
      const res = await api.put('/projects/status', {
        project_id: project.project_id ? parseInt(project.project_id, 10) : 101,
        intervention_taken: action,
        intervention_date: effectiveDate
      })

      if (res.status === 200 || res.data) {
        setSuccessNotice(true)
        if (onUpdate) onUpdate()
        setTimeout(() => {
          onClose()
        }, 1200)
      } else {
        alert('Failed to submit administrative directive.')
      }
    } catch (err) {
      console.error('Failed to submit intervention:', err)
      alert(err.response?.data?.detail || 'Failed to submit intervention.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[92vh] rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* 1. Institutional Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs font-black text-slate-900 bg-slate-200 border border-slate-300 px-2.5 py-0.5 rounded">
                {formattedId}
              </span>
              <h2 className="text-base font-black text-slate-900">
                Administrative Intervention Order: {project.project_name || `Project #${project.project_id}`}
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {project.district} District • {project.project_type} Sector • Statutory RFCTLARR Mitigation Command
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Cancel"
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. Modal Body: Dual Pane Layout */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent"></div>
              <p className="text-xs font-mono font-semibold text-slate-600 uppercase tracking-wider">
                Analyzing Project Friction Profile & Regulatory Directives...
              </p>
            </div>
          ) : prediction ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Pane (5 Cols): Project Diagnostic & Primary Bottleneck */}
              <div className="lg:col-span-5 space-y-4">
                {/* Risk Diagnostic Summary */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                      Calculated Delay Risk
                    </span>
                    <RiskCategoryBadge
                      score={prediction.risk_score}
                      variant="compact"
                      showMeaning={false}
                    />
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-3xl font-black text-slate-900">
                      {prediction.risk_score.toFixed(1)}%
                    </span>
                    <span className="text-xs font-mono font-bold uppercase text-slate-500">
                      Probability of Delay
                    </span>
                  </div>

                  {/* Dominant Bottleneck Chip */}
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-950 space-y-1">
                    <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-red-700 flex items-center gap-1">
                      <ShieldAlert size={12} />
                      <span>Primary Impediment Bottleneck:</span>
                    </div>
                    <p className="font-bold leading-tight text-slate-900">
                      {prediction.dominant_bottleneck || 'Compensation Disbursement & Civil Litigations'}
                    </p>
                  </div>
                </div>

                {/* Key Risk Attribution Drivers */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                      Top Delay Attribution Drivers
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">SHAP Vectors</span>
                  </div>

                  <div className="space-y-2">
                    {(prediction.top_drivers || prediction.top_risk_drivers || []).slice(0, 3).map((d, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700">{d.feature}</span>
                        <span className="font-mono font-bold text-red-700 text-[11px] bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                          {d.shap_value ? `+${d.shap_value.toFixed(2)}` : 'Risk Driver'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Administrative Direction */}
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-1.5">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1">
                    <Sparkles size={12} />
                    <span>Algorithmic Recommendation:</span>
                  </span>
                  <p className="leading-relaxed text-slate-800 font-medium">
                    {prediction.recommendation}
                  </p>
                </div>

                {/* Previously Logged Record */}
                {project.intervention_taken && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                    <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      <span>Existing Active Directive:</span>
                    </div>
                    <p className="font-bold text-emerald-900">
                      {project.intervention_taken}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Pane (7 Cols): Official Directives Selection Form */}
              <div className="lg:col-span-7 space-y-4">
                <form onSubmit={handleSubmitIntervention} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                        Primary Decision: What administrative change could reduce risk?
                      </h3>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Select official statutory directive to issue and log into the audit register
                      </p>
                    </div>
                  </div>

                  {/* Radio Cards Catalog */}
                  <div className="space-y-2.5">
                    {STATUTORY_DIRECTIVES.map((dir) => {
                      const isSelected = action === dir.title
                      return (
                        <label
                          key={dir.title}
                          className={`block p-3.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50/80 border-blue-500 shadow-xs ring-1 ring-blue-400/30'
                              : 'bg-white hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="directive"
                              value={dir.title}
                              checked={isSelected}
                              onChange={() => setAction(dir.title)}
                              className="mt-1 text-blue-600 focus:ring-blue-500 h-4 w-4 shrink-0"
                            />
                            <div className="flex-1 space-y-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h4 className="text-xs font-bold text-slate-900">
                                  {dir.title}
                                </h4>
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${dir.impactClass}`}>
                                  {dir.projectedDelta}
                                </span>
                              </div>
                              <div className="text-[11px] font-mono font-semibold text-slate-500">
                                {dir.authority}
                              </div>
                              <p className="text-[11px] text-slate-600 leading-snug">
                                {dir.description}
                              </p>
                            </div>
                          </div>
                        </label>
                      )
                    })}
                  </div>

                  {/* Effective Date & Remarks Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-mono font-bold text-slate-700 mb-1">
                        Effective Date
                      </label>
                      <input
                        type="date"
                        required
                        value={effectiveDate}
                        onChange={(e) => setEffectiveDate(e.target.value)}
                        className="w-full text-xs font-mono rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-mono font-bold text-slate-700 mb-1">
                        Authorizing Officer Remarks (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sanctioned via Collectorate Order No. 418/2026"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!action || submitting}
                    className="w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>Logging Administrative Sanction...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Sanction Official Directive & Log Audit Record</span>
                      </>
                    )}
                  </button>

                  {/* Success Alert */}
                  {successNotice && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                      <span>Directive successfully recorded in the audit database. Updating project registry...</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

