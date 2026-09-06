import React from 'react'
import {
  Layers,
  FileText,
  Search,
  CheckSquare,
  Coins,
  Home,
  Truck,
  ArrowRight
} from 'lucide-react'

/**
 * Component 5: Acquisition Lifecycle Risk Timeline
 * Custom analytical component for SIH26017.
 * Concretely visualizes the 6 sequential statutory milestones of the RFCTLARR Act 2013:
 * 1. Notification
 * 2. Documentation
 * 3. Approval
 * 4. Compensation
 * 5. R&R
 * 6. Possession
 * Uses a connected horizontal stepper, non-color geometric indicators, and stage-specific risk bars.
 */
export default function StatutoryLifecycleTimeline({ stageRisks = [] }) {
  const STATUTORY_STAGES = [
    {
      id: 'Notification',
      step: '01',
      statutoryRef: 'Section 4(1)',
      name: 'Notification',
      legalTitle: 'Preliminary Notification & SIA',
      icon: <FileText size={15} />
    },
    {
      id: 'Documentation',
      step: '02',
      statutoryRef: 'Section 11 & 15',
      name: 'Documentation',
      legalTitle: 'Survey & Hearing of Objections',
      icon: <Search size={15} />
    },
    {
      id: 'Approval',
      step: '03',
      statutoryRef: 'Section 19(1)',
      name: 'Approval',
      legalTitle: 'Statutory Declaration & R&R Scheme',
      icon: <CheckSquare size={15} />
    },
    {
      id: 'Compensation',
      step: '04',
      statutoryRef: 'Section 23 & 30',
      name: 'Compensation',
      legalTitle: 'Enquiry, Award & DBT Disbursement',
      icon: <Coins size={15} />
    },
    {
      id: 'R&R',
      step: '05',
      statutoryRef: 'Section 31(1)',
      name: 'R&R',
      legalTitle: 'Rehabilitation & Resettlement',
      icon: <Home size={15} />
    },
    {
      id: 'Possession',
      step: '06',
      statutoryRef: 'Section 38(1)',
      name: 'Possession',
      legalTitle: 'Physical Right-of-Way Handover',
      icon: <Truck size={15} />
    }
  ]

  const getStageRiskData = (stageName) => {
    return stageRisks.find(
      (s) => s.stage?.toLowerCase() === stageName.toLowerCase() || s.stage?.toLowerCase().includes(stageName.toLowerCase())
    ) || { risk: 20, category: 'Low', description: 'Statutory milestone parameters within normal compliance bands.' }
  }

  const getStageStyles = (category) => {
    switch (category) {
      case 'Critical':
        return {
          symbol: '▲',
          cardBorder: 'border-2 border-red-400 bg-red-50/50',
          badge: 'bg-red-100 text-red-950 border-red-300',
          barColor: 'bg-red-600',
          textClass: 'text-red-800',
          stepBadge: 'bg-red-700 text-white'
        }
      case 'High':
        return {
          symbol: '◆',
          cardBorder: 'border-2 border-orange-400 bg-orange-50/50',
          badge: 'bg-orange-100 text-orange-950 border-orange-300',
          barColor: 'bg-orange-500',
          textClass: 'text-orange-800',
          stepBadge: 'bg-orange-600 text-white'
        }
      case 'Moderate':
        return {
          symbol: '■',
          cardBorder: 'border-2 border-amber-400 bg-amber-50/50',
          badge: 'bg-amber-100 text-amber-950 border-amber-300',
          barColor: 'bg-amber-500',
          textClass: 'text-amber-800',
          stepBadge: 'bg-amber-600 text-white'
        }
      default: // Low
        return {
          symbol: '●',
          cardBorder: 'border-2 border-emerald-400 bg-emerald-50/50',
          badge: 'bg-emerald-100 text-emerald-950 border-emerald-300',
          barColor: 'bg-emerald-600',
          textClass: 'text-emerald-800',
          stepBadge: 'bg-emerald-700 text-white'
        }
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* 1. Header with Statutory Reference */}
      <div className="px-6 py-3 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers size={15} className="text-blue-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
            Stage 05: Acquisition Lifecycle Risk Progression (What Can Change)
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-300">
            6 Sequential Statutory Stages • RFCTLARR Act 2013
          </span>
        </div>
      </div>

      {/* 2. Connected Stepper Track */}
      <div className="p-6 space-y-6">
        {/* Step Flow Ribbon */}
        <div className="hidden lg:flex items-center justify-between px-2 py-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] font-bold text-slate-600">
          {STATUTORY_STAGES.map((stg, i) => (
            <React.Fragment key={stg.id}>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px]">
                  {stg.step}
                </span>
                <span className="text-slate-900">{stg.name}</span>
              </div>
              {i < STATUTORY_STAGES.length - 1 && (
                <ArrowRight size={13} className="text-slate-300 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Dense Stage Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {STATUTORY_STAGES.map((stg) => {
            const riskInfo = getStageRiskData(stg.id)
            const style = getStageStyles(riskInfo.category)
            const riskValue = Math.round(riskInfo.risk || 0)

            return (
              <div
                key={stg.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${style.cardBorder} hover:shadow-xs`}
              >
                <div>
                  {/* Step Monogram & Section Ref */}
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-mono text-[10px] font-black px-1.5 py-0.2 rounded ${style.stepBadge}`}>
                        {stg.step}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-600">
                        {stg.statutoryRef}
                      </span>
                    </div>
                    <span className="text-slate-500">{stg.icon}</span>
                  </div>

                  {/* Stage Titles */}
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-slate-900 tracking-tight">
                      {stg.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium truncate" title={stg.legalTitle}>
                      {stg.legalTitle}
                    </p>
                  </div>
                </div>

                {/* Risk Metric & Micro Track */}
                <div className="mt-3.5 pt-2.5 border-t border-slate-200/80 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-[10px] font-bold select-none">{style.symbol}</span>
                      <span className={`font-mono text-sm font-black ${style.textClass}`}>
                        {riskValue}%
                      </span>
                    </div>
                    <span className={`text-[9px] font-black px-1.5 py-0.2 rounded border uppercase font-mono ${style.badge}`}>
                      {riskInfo.category}
                    </span>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${style.barColor}`}
                      style={{ width: `${Math.min(100, Math.max(10, riskValue))}%` }}
                    ></div>
                  </div>

                  <p className="text-[10px] text-slate-700 leading-snug line-clamp-2" title={riskInfo.description}>
                    {riskInfo.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
