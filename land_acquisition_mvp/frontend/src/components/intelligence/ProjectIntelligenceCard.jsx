import React from 'react'
import {
  MapPin,
  Building,
  Scale,
  Clock,
  Users,
  CheckCircle2,
  ChevronRight,
  Shield,
  FileSpreadsheet
} from 'lucide-react'
import RiskCategoryBadge from './RiskCategoryBadge'

/**
 * Component 10: Project Intelligence Card
 * Custom dense analytical dossier for SIH26017.
 * Encapsulates administrative, spatial, financial, and judicial dimensions
 * with embedded multi-modal risk classification.
 */
export default function ProjectIntelligenceCard({
  projectMeta,
  formData = {},
  onChangeProject,
  compact = false
}) {
  if (!projectMeta && !formData.district) return null

  const id = projectMeta?.formatted_id || `PRJ-2026-${String(projectMeta?.project_id || formData.project_id || '0101').padStart(4, '0')}`
  const name = projectMeta?.project_name || formData.project_name || 'Selected Infrastructure Project'
  const district = projectMeta?.district || formData.district || 'Pune'
  const type = projectMeta?.project_type || formData.project_type || 'Highway'
  const riskScore = projectMeta?.risk_score !== undefined ? Number(projectMeta.risk_score) : null
  const riskCategory = projectMeta?.risk_category

  const getTypeConfig = (pType) => {
    switch (pType) {
      case 'Highway':
        return { code: 'HW', title: 'National / State Highway', badgeBg: 'bg-blue-900 text-white' }
      case 'Metro':
        return { code: 'MT', title: 'Urban Metro Rail Corridor', badgeBg: 'bg-purple-900 text-white' }
      case 'Railway':
        return { code: 'RL', title: 'Dedicated Freight / Rail', badgeBg: 'bg-indigo-900 text-white' }
      default:
        return { code: 'IR', title: 'Irrigation & Water Canal', badgeBg: 'bg-teal-900 text-white' }
    }
  }

  const typeConfig = getTypeConfig(type)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* 1. Identity & Official Registry Status */}
      <div className="px-6 py-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className={`h-10 w-10 rounded-lg ${typeConfig.badgeBg} border border-white/20 flex items-center justify-center font-mono font-black text-sm shadow-xs shrink-0`}>
            {typeConfig.code}
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300">
                {id}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {typeConfig.title}
              </span>
              <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 size={11} className="text-emerald-400" />
                Verified DoLR Registry
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-white truncate mt-0.5">
              {name}
            </h3>
          </div>
        </div>

        {/* Multi-modal Risk Marker & Change Action */}
        <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
          {riskScore !== null && (
            <RiskCategoryBadge
              score={riskScore}
              category={riskCategory}
              variant="compact"
              showMeaning={true}
            />
          )}
          {onChangeProject && (
            <button
              type="button"
              onClick={onChangeProject}
              className="text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Switch Parcel</span>
              <ChevronRight size={13} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Dense Analytical Parameter Tiles */}
      {!compact && (
        <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 bg-slate-50/50 border-b border-slate-100 text-xs">
          {/* Tile 1: District Jurisdiction */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[10px] uppercase font-bold">
              <MapPin size={12} className="text-blue-600" />
              <span>Jurisdiction</span>
            </div>
            <div className="font-black text-slate-900 text-sm truncate">{district}</div>
            <div className="text-[10px] text-slate-500 font-mono">Collector Circle</div>
          </div>

          {/* Tile 2: Spatial Notified Land Parcel */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[10px] uppercase font-bold">
              <Building size={12} className="text-slate-600" />
              <span>Notified Land</span>
            </div>
            <div className="font-black text-slate-900 text-sm font-mono">
              {formData.total_acres || projectMeta?.total_acres || '—'} Acres
            </div>
            <div className="text-[10px] text-slate-500">Sec 4 Scope</div>
          </div>

          {/* Tile 3: Physical Land Acquired */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-500 font-mono text-[10px] uppercase font-bold">
              <span>Demarcated</span>
              <span className="text-slate-900 font-black">{formData.land_acquired_pct || 0}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, formData.land_acquired_pct || 0))}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-slate-500">Physical Progress</div>
          </div>

          {/* Tile 4: Compensation DBT Disbursed */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-500 font-mono text-[10px] uppercase font-bold">
              <span>DBT Disbursed</span>
              <span className="text-slate-900 font-black">{formData.compensation_disbursed_pct || 0}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, formData.compensation_disbursed_pct || 0))}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-slate-500">Sec 23 Award Release</div>
          </div>

          {/* Tile 5: Judicial & Dispute Burden */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[10px] uppercase font-bold">
              <Scale size={12} className="text-red-600" />
              <span>Dispute Burden</span>
            </div>
            <div className="font-black text-slate-900 text-sm font-mono flex items-center gap-1">
              <span className="text-red-700">{formData.legal_cases_count || 0} Court</span>
              <span className="text-slate-300">/</span>
              <span className="text-amber-700">{formData.ownership_disputes || 0} Title</span>
            </div>
            <div className="text-[10px] text-slate-500">Legal Obstacles</div>
          </div>

          {/* Tile 6: Clearance Lag */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[10px] uppercase font-bold">
              <Clock size={12} className="text-amber-600" />
              <span>Pending Clearances</span>
            </div>
            <div className="font-black text-slate-900 text-sm font-mono">
              {formData.approval_days_pending || 0} Days
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              District Avg: {formData.historical_district_delay_avg || 0}d
            </div>
          </div>
        </div>
      )}

      {/* 3. Provenance & Compliance Footer */}
      <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-600 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Users size={12} className="text-slate-500" />
            <span>Affected Families: <strong className="text-slate-900 font-mono">{formData.affected_families || 0}</strong></span>
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="flex items-center gap-1.5">
            <FileSpreadsheet size={12} className="text-slate-500" />
            <span>RoR Title Deficiency: <strong className="text-slate-900 font-mono">{formData.doc_deficiency_score || 0}%</strong></span>
          </span>
        </div>
        <div className="font-mono text-[10px] text-slate-500 flex items-center gap-1.5">
          <Shield size={11} className="text-blue-600" />
          <span>DoLR Land Governance Data Standard • 13 Calibrated Model Inputs</span>
        </div>
      </div>
    </div>
  )
}
