import React from 'react'
import {
  Layers,
  FileText,
  Search,
  CheckSquare,
  Coins,
  Home,
  Truck
} from 'lucide-react'

export default function StatutoryLifecycleTimeline({ stageRisks = [] }) {
  // Pre-configured statutory metadata for the 6 RFCTLARR Act 2013 milestones
  const STATUTORY_STAGES = [
    {
      id: 'Notification',
      step: '01',
      statutoryRef: 'Section 4(1)',
      name: 'Notification',
      legalTitle: 'Preliminary Notification',
      icon: <FileText size={16} />
    },
    {
      id: 'Documentation',
      step: '02',
      statutoryRef: 'Section 11 & 15',
      name: 'Documentation',
      legalTitle: 'Survey & Hearing of Objections',
      icon: <Search size={16} />
    },
    {
      id: 'Approval',
      step: '03',
      statutoryRef: 'Section 19(1)',
      name: 'Approval',
      legalTitle: 'Declaration of Acquisition',
      icon: <CheckSquare size={16} />
    },
    {
      id: 'Compensation',
      step: '04',
      statutoryRef: 'Section 23 & 30',
      name: 'Compensation',
      legalTitle: 'Enquiry & Award Disbursement',
      icon: <Coins size={16} />
    },
    {
      id: 'R&R',
      step: '05',
      statutoryRef: 'Section 31(1)',
      name: 'R&R',
      legalTitle: 'Rehabilitation & Resettlement',
      icon: <Home size={16} />
    },
    {
      id: 'Possession',
      step: '06',
      statutoryRef: 'Section 38(1)',
      name: 'Possession',
      legalTitle: 'Physical Possession & Handover',
      icon: <Truck size={16} />
    }
  ]

  const getStageRiskData = (stageName) => {
    return stageRisks.find(
      (s) => s.stage?.toLowerCase() === stageName.toLowerCase() || s.stage?.toLowerCase().includes(stageName.toLowerCase())
    ) || { risk: 20, category: 'Low', description: 'Statutory milestone parameters within normal compliance bands.' }
  }

  const getCategoryStyles = (category) => {
    switch (category) {
      case 'Critical':
        return {
          cardBorder: 'border-red-300 bg-red-50/40',
          badge: 'bg-red-100 text-red-800 border-red-200',
          barColor: 'bg-red-600',
          textClass: 'text-red-700'
        }
      case 'High':
        return {
          cardBorder: 'border-orange-300 bg-orange-50/40',
          badge: 'bg-orange-100 text-orange-800 border-orange-200',
          barColor: 'bg-orange-500',
          textClass: 'text-orange-700'
        }
      case 'Moderate':
        return {
          cardBorder: 'border-amber-300 bg-amber-50/40',
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          barColor: 'bg-amber-500',
          textClass: 'text-amber-700'
        }
      default: // Low
        return {
          cardBorder: 'border-emerald-300 bg-emerald-50/40',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          barColor: 'bg-emerald-600',
          textClass: 'text-emerald-700'
        }
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* 1. Header */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-blue-600" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
            Section 3: Statutory Acquisition Lifecycle Timeline (RFCTLARR Act 2013)
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="font-mono bg-white border border-slate-200 px-2 py-0.5 rounded">
            6 Sequential Legal Milestones
          </span>
        </div>
      </div>

      {/* 2. Horizontal Statutory Stepper & Diagnostic Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {STATUTORY_STAGES.map((stg) => {
            const riskInfo = getStageRiskData(stg.id)
            const style = getCategoryStyles(riskInfo.category)
            const riskValue = Math.round(riskInfo.risk || 0)

            return (
              <div
                key={stg.id}
                className={`p-3.5 rounded-lg border transition-all flex flex-col justify-between ${style.cardBorder} hover:shadow-xs`}
              >
                <div>
                  {/* Step Monogram & Section Ref */}
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] font-black px-1.5 py-0.2 rounded bg-slate-800 text-white">
                        {stg.step}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-500">
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
                <div className="mt-3.5 pt-2.5 border-t border-slate-200/60 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className={`font-mono text-sm font-black ${style.textClass}`}>
                      {riskValue}%
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase font-mono ${style.badge}`}>
                      {riskInfo.category}
                    </span>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${style.barColor}`}
                      style={{ width: `${Math.min(100, Math.max(8, riskValue))}%` }}
                    ></div>
                  </div>

                  <p className="text-[10px] text-slate-600 leading-snug line-clamp-2" title={riskInfo.description}>
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
