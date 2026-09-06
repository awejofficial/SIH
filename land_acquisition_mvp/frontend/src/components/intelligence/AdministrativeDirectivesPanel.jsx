import React from 'react'
import {
  Building2,
  ShieldCheck
} from 'lucide-react'

export default function AdministrativeDirectivesPanel({
  recommendations = [],
  dominantBottleneck = null
}) {
  if (!recommendations || recommendations.length === 0) return null

  const getDirectiveAuthority = (index) => {
    switch (index) {
      case 0:
        return 'District Magistrate & Collector (Sanction Authority)'
      case 1:
        return 'Special Land Acquisition Officer (Competent Authority)'
      case 2:
        return 'Sub-Divisional Revenue Officer / Tahsildar (Field Circle)'
      default:
        return 'Joint Survey & Police Escort Liaison Team'
    }
  }

  const getPriorityBadge = (index) => {
    switch (index) {
      case 0:
        return 'bg-red-100 text-red-900 border-red-200'
      case 1:
        return 'bg-amber-100 text-amber-900 border-amber-200'
      default:
        return 'bg-blue-100 text-blue-900 border-blue-200'
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* 1. Header */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Building2 size={16} className="text-blue-600" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
            Section 4: Statutory Administrative Directives & Field Levers
          </h3>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-bold">
          <ShieldCheck size={13} />
          <span>{dominantBottleneck ? `Primary Bottleneck: ${dominantBottleneck}` : 'Synthesized from Dominant SHAP Vectors'}</span>
        </div>
      </div>

      {/* 2. Directive Action Cards */}
      <div className="p-6 space-y-3">
        {recommendations.map((directive, idx) => (
          <div
            key={idx}
            className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="h-6 w-6 rounded bg-slate-900 text-white font-mono font-black text-xs flex items-center justify-center shrink-0">
                  D{idx + 1}
                </span>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityBadge(idx)}`}>
                  Priority {idx + 1} Action
                </span>
              </div>
              <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <span className="text-slate-400">Jurisdiction:</span>
                <span className="font-semibold text-slate-800">{getDirectiveAuthority(idx)}</span>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-900 leading-relaxed pl-8">
              {directive}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
