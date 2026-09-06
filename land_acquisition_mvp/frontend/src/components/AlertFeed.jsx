import React, { useState } from 'react'
import {
  ShieldAlert,
  CheckCircle2,
  Bell,
  Clock,
  Send
} from 'lucide-react'
import RiskCategoryBadge from './intelligence/RiskCategoryBadge'

/**
 * Component 8: Early Warning Surveillance Register
 * Redesigned as a custom SIH26017 government intelligence surveillance feed:
 * - Strictly non-color reliant with multi-modal risk markers (percent, text, geometric symbol, statutory meaning)
 * - Dense structured alert blocks with empirical vector & administrative directive
 * - Clean institutional surveillance header and audit review actions
 */
export default function AlertFeed({ alerts = [] }) {
  const [reviewedAlerts, setReviewedAlerts] = useState(new Set())

  const handleMarkReviewed = (projectId) => {
    setReviewedAlerts(prev => {
      const updated = new Set(prev)
      if (updated.has(projectId)) {
        updated.delete(projectId)
      } else {
        updated.add(projectId)
      }
      return updated
    })
  }

  const activeAlerts = alerts.filter(a => !reviewedAlerts.has(a.project_id))

  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[420px] shadow-xs">
        <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
          <CheckCircle2 size={24} />
        </div>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider font-mono">
            ● Surveillance Status: Nominal
          </div>
          <h3 className="text-base font-bold text-slate-900">Zero Critical Breaches</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            All active land acquisition parcels are progressing within normal RFCTLARR statutory variance bands.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-[560px] shadow-xs overflow-hidden">
      {/* 1. Institutional Surveillance Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert size={18} className="text-red-600 shrink-0" />
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span>Early-Warning Surveillance Register</span>
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">
              Live Threshold Monitoring (P &gt; 0.50)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-red-100 text-red-900 border border-red-300 text-[11px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1">
            <Bell size={11} className="text-red-700 animate-pulse" />
            <span>{activeAlerts.length} Active</span>
          </span>
        </div>
      </div>

      {/* 2. Structured Alerts Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 divide-y divide-slate-100">
        {alerts.map((alert) => {
          const isReviewed = reviewedAlerts.has(alert.project_id)
          const score = typeof alert.risk_score === 'number' ? alert.risk_score : parseFloat(alert.risk_score) || 75
          const formattedId = `PRJ-2026-${String(alert.project_id).padStart(4, '0')}`

          return (
            <div
              key={alert.project_id}
              className={`pt-3.5 first:pt-0 transition-opacity ${
                isReviewed ? 'opacity-40 bg-slate-50/70 p-3 rounded-lg border border-slate-200' : ''
              }`}
            >
              <div className="space-y-2.5">
                {/* Header: Formatted Project ID & Multi-Modal Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded">
                      {formattedId}
                    </span>
                    {isReviewed && (
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                        [Acknowledged]
                      </span>
                    )}
                  </div>
                  <RiskCategoryBadge
                    score={score}
                    variant="compact"
                    showMeaning={false}
                  />
                </div>

                {/* Horizontal Scale Mini-Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex border border-slate-200">
                    <div
                      className={`h-full ${score >= 75 ? 'bg-red-600' : 'bg-orange-500'} rounded-full`}
                      style={{ width: `${Math.min(100, Math.max(10, score))}%` }}
                    ></div>
                  </div>
                </div>

                {/* Alert Detection Vector */}
                <div className="p-2.5 rounded-lg bg-red-50/50 border border-red-200 text-xs text-red-950 space-y-1">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-700 flex items-center gap-1">
                    <span>Detection Vector:</span>
                  </div>
                  <p className="font-semibold leading-tight text-slate-900">
                    {alert.alert_message}
                  </p>
                </div>

                {/* Mandated Administrative Directive */}
                {alert.recommended_action && (
                  <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-200 text-xs text-blue-950 space-y-1">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1">
                      <span>Mandated Administrative Response:</span>
                    </div>
                    <p className="font-medium leading-tight text-slate-800">
                      {alert.recommended_action}
                    </p>
                  </div>
                )}

                {/* Action Row */}
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 font-mono text-[10px]">
                    <Clock size={11} className="text-slate-400" />
                    <span>Active Surveillance Log</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleMarkReviewed(alert.project_id)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded border transition-colors cursor-pointer flex items-center gap-1 ${
                      isReviewed
                        ? 'bg-slate-200 text-slate-700 border-slate-300'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
                    }`}
                  >
                    {isReviewed ? 'Unmark' : (
                      <>
                        <Send size={10} />
                        <span>Acknowledge Notice</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
