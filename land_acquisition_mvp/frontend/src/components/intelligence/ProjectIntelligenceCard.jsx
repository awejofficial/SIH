import React from 'react'
import {
  FileSpreadsheet,
  MapPin,
  Building,
  Scale,
  Clock,
  Users,
  CheckCircle2,
  ChevronRight
} from 'lucide-react'
import RiskCategoryBadge from './RiskCategoryBadge'

/**
 * Component 10: Project Intelligence Card
 * Renders a dense, domain-specific multi-dimensional profile of the land acquisition project:
 * - Administrative Identity & Sector Classification
 * - Spatial & Land Scope Indicators
 * - Financial & Compensation Milestone Status
 * - Judicial & Dispute Friction Posture
 * - Multi-Modal Statutory Risk Badge
 */
export default function ProjectIntelligenceCard({
  projectMeta,
  formData = {},
  onChangeProject,
  compact = false
}) {
  if (!projectMeta && !formData.district) return null

  const id = projectMeta?.formatted_id || `PRJ-2026-${String(projectMeta?.project_id || formData.project_id || '0000').padStart(4, '0')}`
  const name = projectMeta?.project_name || formData.project_name || 'Selected Infrastructure Project'
  const district = projectMeta?.district || formData.district || 'Maharashtra'
  const type = projectMeta?.project_type || formData.project_type || 'Highway'
  const riskScore = projectMeta?.risk_score !== undefined ? Number(projectMeta.risk_score) : null
  const riskCategory = projectMeta?.risk_category

  const getTypeBadge = (pType) => {
    switch (pType) {
      case 'Highway':
        return { label: 'HW', full: 'National / State Highway', bg: 'bg-blue-700 text-white' }
      case 'Metro':
        return { label: 'MT', full: 'Urban Metro Rail Corridor', bg: 'bg-purple-700 text-white' }
      case 'Railway':
        return { label: 'RL', full: 'Dedicated Freight / Rail', bg: 'bg-indigo-700 text-white' }
      default:
        return { label: 'IR', full: 'Irrigation & Water Canal', bg: 'bg-teal-700 text-white' }
    }
  }

  const typeConfig = getTypeBadge(type)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* 1. Header Bar: Identity & Registry Status */}
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`h-8 w-8 rounded-lg ${typeConfig.bg} flex items-center justify-center font-bold text-xs shadow-xs`}>
            {typeConfig.label}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black text-slate-900 bg-white border border-slate-300 px-2 py-0.5 rounded">
                {id}
              </span>
              <span className="text-[11px] font-bold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded">
                {typeConfig.full}
              </span>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 size={11} className="text-emerald-600" />
                Verified Registry
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5">{name}</h3>
          </div>
        </div>

        {/* Multi-modal Risk Marker & Change Action */}
        <div className="flex items-center gap-2 self-end sm:self-center">
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
              className="text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Change Project</span>
              <ChevronRight size={13} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Dense Project Intelligence Parameters Grid */}
      {!compact && (
        <div className="p-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs bg-slate-50/40 border-b border-slate-100">
          {/* Tile 1: Geography & Authority */}
          <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] uppercase font-bold">
              <MapPin size={12} className="text-blue-600" />
              <span>District Jurisdiction</span>
            </div>
            <div className="font-bold text-slate-900 text-sm">{district}</div>
            <div className="text-[10px] text-slate-500">Revenue Division</div>
          </div>

          {/* Tile 2: Spatial Area Scope */}
          <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] uppercase font-bold">
              <Building size={12} className="text-slate-600" />
              <span>Total Land Parcel</span>
            </div>
            <div className="font-bold text-slate-900 text-sm font-mono">
              {formData.total_acres || projectMeta?.total_acres || '—'} Acres
            </div>
            <div className="text-[10px] text-slate-500">Notified Area</div>
          </div>

          {/* Tile 3: Physical Land Acquired */}
          <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase font-bold">
              <span>Land Acquired</span>
              <span className="text-slate-900 font-bold">{formData.land_acquired_pct || 0}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, formData.land_acquired_pct || 0))}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-slate-500">Stage 01-03 Execution</div>
          </div>

          {/* Tile 4: Compensation Disbursed */}
          <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase font-bold">
              <span>DBT Disbursed</span>
              <span className="text-slate-900 font-bold">{formData.compensation_disbursed_pct || 0}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, formData.compensation_disbursed_pct || 0))}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-slate-500">Sec 23 Award Release</div>
          </div>

          {/* Tile 5: Litigation & Disputes */}
          <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] uppercase font-bold">
              <Scale size={12} className="text-red-600" />
              <span>Dispute Burden</span>
            </div>
            <div className="font-bold text-slate-900 text-sm font-mono flex items-center gap-1.5">
              <span className="text-red-700">{formData.legal_cases_count || 0} Courts</span>
              <span className="text-slate-300">•</span>
              <span className="text-amber-700">{formData.ownership_disputes || 0} Title</span>
            </div>
            <div className="text-[10px] text-slate-500">Active Impediments</div>
          </div>

          {/* Tile 6: Delay Benchmark */}
          <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] uppercase font-bold">
              <Clock size={12} className="text-amber-600" />
              <span>Pending Approvals</span>
            </div>
            <div className="font-bold text-slate-900 text-sm font-mono">
              {formData.approval_days_pending || 0} Days
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              District Avg: {formData.historical_district_delay_avg || 0}d
            </div>
          </div>
        </div>
      )}

      {/* 3. Footer Intelligence Banner */}
      <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Users size={12} className="text-slate-400" />
            <span>Affected Families: <strong className="text-slate-800 font-mono">{formData.affected_families || 0}</strong></span>
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="flex items-center gap-1">
            <FileSpreadsheet size={12} className="text-slate-400" />
            <span>Record Deficiency: <strong className="text-slate-800 font-mono">{formData.doc_deficiency_score || 0}%</strong></span>
          </span>
        </div>
        <div className="font-mono text-[10px] text-slate-400">
          Source: DoLR Statutory Registry • 13 Ground-Truth Features
        </div>
      </div>
    </div>
  )
}
