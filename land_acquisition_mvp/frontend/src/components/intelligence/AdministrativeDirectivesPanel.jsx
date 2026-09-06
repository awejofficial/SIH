import React from 'react'
import {
  Building2,
  ShieldCheck,
  FileCheck,
  Scale,
  Users,
  AlertCircle
} from 'lucide-react'

/**
 * Component 6: Administrative Recommendations & Directives Panel
 * Custom governance component for SIH26017.
 * Translates predictive model bottlenecks into actionable administrative directives
 * mapped directly to the statutory hierarchy of revenue officers.
 */
export default function AdministrativeDirectivesPanel({
  recommendations = [],
  dominantBottleneck = null
}) {
  if (!recommendations || recommendations.length === 0) return null

  const getDirectiveAuthority = (index) => {
    switch (index) {
      case 0:
        return {
          title: 'District Magistrate & Collector',
          role: 'Sanction Authority',
          icon: <Building2 size={15} className="text-red-700" />,
          legalSection: 'Section 19(1) & 23 Sanction',
          badgeClass: 'bg-red-100 text-red-950 border-red-300'
        }
      case 1:
        return {
          title: 'Special Land Acquisition Officer (CALA)',
          role: 'Competent Authority',
          icon: <Scale size={15} className="text-amber-700" />,
          legalSection: 'Section 15 Hearing of Objections',
          badgeClass: 'bg-amber-100 text-amber-950 border-amber-300'
        }
      case 2:
        return {
          title: 'Sub-Divisional Officer / Tahsildar',
          role: 'Field Revenue Circle',
          icon: <Users size={15} className="text-blue-700" />,
          legalSection: 'Record of Rights & Mutation Rectification',
          badgeClass: 'bg-blue-100 text-blue-950 border-blue-300'
        }
      default:
        return {
          title: 'Joint Demarcation & Survey Squad',
          role: 'Field Right-of-Way Team',
          icon: <FileCheck size={15} className="text-emerald-700" />,
          legalSection: 'Section 38 Physical Possession Escort',
          badgeClass: 'bg-emerald-100 text-emerald-950 border-emerald-300'
        }
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* 1. Header Bar */}
      <div className="px-6 py-3 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
            Stage 06: Statutory Administrative Directives & Field Levers (Administrative Response)
          </h3>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-amber-300 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded font-bold">
          <AlertCircle size={12} className="text-amber-400" />
          <span>{dominantBottleneck ? `Root Cause: ${dominantBottleneck}` : 'Synthesized from Dominant SHAP Vectors'}</span>
        </div>
      </div>

      {/* 2. Structured Action Directive Cards */}
      <div className="p-6 space-y-3.5">
        <p className="text-xs text-slate-600 leading-relaxed">
          The following legally compliant directives are automatically synthesized from the project's empirical risk factors to avert statutory timeline lapses under the RFCTLARR Act 2013:
        </p>

        <div className="space-y-3 pt-1">
          {recommendations.map((directive, idx) => {
            const auth = getDirectiveAuthority(idx)

            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all space-y-2.5"
              >
                {/* Authority & Priority Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-900 text-white">
                      Directive #{idx + 1}
                    </span>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${auth.badgeClass}`}>
                      Priority {idx + 1} Action
                    </span>
                  </div>

                  {/* Designated Statutory Authority */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    {auth.icon}
                    <span>{auth.title}</span>
                    <span className="text-slate-400 font-normal">({auth.role})</span>
                  </div>
                </div>

                {/* Directive Text */}
                <p className="text-xs font-bold text-slate-900 leading-relaxed pl-1 sm:pl-2">
                  {directive}
                </p>

                {/* Legal Citation Footer */}
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Statutory Reference: <strong>{auth.legalSection}</strong></span>
                  <span className="text-emerald-700 font-bold">✓ Direct Impact on Delay Force</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
