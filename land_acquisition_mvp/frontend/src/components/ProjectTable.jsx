import React, { useState } from 'react'
import InterventionModal from './InterventionModal'
import DrillDownModal from './DrillDownModal'
import RiskCategoryBadge from './intelligence/RiskCategoryBadge'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  AlertCircle,
  Scale
} from 'lucide-react'

/**
 * Primary Decision: "Which projects are on-track vs slipping across my portfolio?"
 * High-density government-grade registry table with:
 * - Multi-modal risk badges (percentage + statutory label + symbol ▲/◆/■/●)
 * - Dual milestone progress tracks (Land Acquired % & Compensation Disbursed %)
 * - Legal & dispute burden indicators
 * - Action triggers: 'Inspect Dossier' & 'Intervene'
 */
export default function ProjectTable({ data = [], onInterventionUpdate }) {
  const [search, setSearch] = useState('')
  const [selectedDossierProject, setSelectedDossierProject] = useState(null)
  const [selectedInterventionProject, setSelectedInterventionProject] = useState(null)
  const [filterTier, setFilterTier] = useState('ALL') // 'ALL' | 'CRITICAL' | 'HIGH' | 'INTERVENED'
  const [page, setPage] = useState(0)
  const rowsPerPage = 10

  // 1. Tier & Search Filtering
  const filtered = data.filter(d => {
    // Search query match
    const matchesSearch =
      (d.district || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.project_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.project_type || '').toLowerCase().includes(search.toLowerCase()) ||
      String(d.project_id || '').includes(search)

    if (!matchesSearch) return false

    // Quick filter tab match
    if (filterTier === 'CRITICAL') return (d.risk_score || 0) >= 75
    if (filterTier === 'HIGH') return (d.risk_score || 0) >= 50 && (d.risk_score || 0) < 75
    if (filterTier === 'INTERVENED') return !!d.intervention_taken

    return true
  })

  // Sort: Highest delay risk first
  const sorted = [...filtered].sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0))
  const paginated = sorted.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
  const totalPages = Math.ceil(sorted.length / rowsPerPage) || 1

  // Counts for filter pills
  const totalCount = data.length
  const criticalCount = data.filter(d => (d.risk_score || 0) >= 75).length
  const highCount = data.filter(d => (d.risk_score || 0) >= 50 && (d.risk_score || 0) < 75).length
  const intervenedCount = data.filter(d => !!d.intervention_taken).length

  return (
    <div className="w-full space-y-4">
      {/* Search Bar & Quick Filters Band */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={14} />
          </div>
          <input
            type="text"
            placeholder="Search by District, Project Name, ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
          />
        </div>

        {/* Filter Tabs Band */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mr-1 hidden sm:inline">
            Filter Portfolio:
          </span>

          <button
            type="button"
            onClick={() => { setFilterTier('ALL'); setPage(0); }}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors cursor-pointer ${
              filterTier === 'ALL'
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Parcels ({totalCount})
          </button>

          <button
            type="button"
            onClick={() => { setFilterTier('CRITICAL'); setPage(0); }}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors cursor-pointer flex items-center gap-1 ${
              filterTier === 'CRITICAL'
                ? 'bg-red-700 text-white font-bold shadow-xs'
                : 'bg-white text-red-700 hover:bg-red-50 border border-red-200'
            }`}
          >
            <span>▲ Critical Risk ({criticalCount})</span>
          </button>

          <button
            type="button"
            onClick={() => { setFilterTier('HIGH'); setPage(0); }}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors cursor-pointer flex items-center gap-1 ${
              filterTier === 'HIGH'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
            }`}
          >
            <span>◆ High Risk ({highCount})</span>
          </button>

          <button
            type="button"
            onClick={() => { setFilterTier('INTERVENED'); setPage(0); }}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors cursor-pointer flex items-center gap-1 ${
              filterTier === 'INTERVENED'
                ? 'bg-emerald-700 text-white font-bold shadow-xs'
                : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
            }`}
          >
            <span>✓ Intervened ({intervenedCount})</span>
          </button>
        </div>
      </div>

      {/* High-Density Government Registry Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-100/80 text-slate-900 uppercase text-[10px] font-mono font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Project Identifier</th>
              <th className="px-3 py-3">District & Sector</th>
              <th className="px-3 py-3">Delay Risk Classification</th>
              <th className="px-3 py-3">Statutory Milestone Progress</th>
              <th className="px-3 py-3">Dispute Burden</th>
              <th className="px-3 py-3">Administrative Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {paginated.map((row) => {
              const formattedId = `PRJ-2026-${String(row.project_id).padStart(4, '0')}`
              const landAcq = row.land_acquired_pct || 0
              const compDisb = row.compensation_disbursed_pct || 0
              const legalCases = row.legal_cases_count || 0
              const disputes = row.ownership_disputes || 0
              const totalDisputes = legalCases + disputes
              const isCritical = (row.risk_score || 0) >= 75

              return (
                <tr
                  key={row.project_id}
                  className={`hover:bg-slate-50/90 transition-colors ${
                    isCritical && !row.intervention_taken ? 'bg-red-50/15' : ''
                  }`}
                >
                  {/* Project ID & Name */}
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded inline-block">
                        {formattedId}
                      </span>
                      <div className="font-semibold text-slate-900 truncate max-w-[190px]" title={row.project_name}>
                        {row.project_name || `Project #${row.project_id}`}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {row.total_acres ? `${row.total_acres} Acres` : 'State Parcel'}
                      </div>
                    </div>
                  </td>

                  {/* District & Sector */}
                  <td className="px-3 py-3">
                    <div className="font-semibold text-slate-800">{row.district}</div>
                    <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium inline-block mt-0.5">
                      {row.project_type}
                    </span>
                  </td>

                  {/* Delay Risk Badge */}
                  <td className="px-3 py-3">
                    <RiskCategoryBadge
                      score={row.risk_score}
                      variant="compact"
                      showMeaning={false}
                    />
                  </td>

                  {/* Statutory Milestone Progress (Dual Mini Bars) */}
                  <td className="px-3 py-3">
                    <div className="space-y-1.5 min-w-[140px]">
                      {/* Demarcation / Land Acquired */}
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-600">
                          <span>Demarcation:</span>
                          <span className="font-bold">{landAcq}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{ width: `${Math.min(100, Math.max(5, landAcq))}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Compensation DBT */}
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-600">
                          <span>DBT Disbursed:</span>
                          <span className="font-bold text-emerald-800">{compDisb}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full"
                            style={{ width: `${Math.min(100, Math.max(5, compDisb))}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Dispute Burden */}
                  <td className="px-3 py-3">
                    {totalDisputes > 0 ? (
                      <div className="space-y-0.5 font-mono text-[11px]">
                        <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded border ${
                          totalDisputes >= 8
                            ? 'bg-red-50 text-red-900 border-red-200'
                            : 'bg-amber-50 text-amber-900 border-amber-200'
                        }`}>
                          <Scale size={11} />
                          <span>{totalDisputes} Disputes</span>
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {legalCases} Legal • {disputes} Title
                        </div>
                      </div>
                    ) : (
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        Clear Title
                      </span>
                    )}
                  </td>

                  {/* Administrative Status */}
                  <td className="px-3 py-3">
                    {row.intervention_taken ? (
                      <span className="text-emerald-800 font-semibold text-[11px] border border-emerald-300 bg-emerald-50 px-2 py-0.5 rounded inline-flex items-center gap-1">
                        <FileCheck2 size={12} className="text-emerald-700 shrink-0" />
                        <span className="truncate max-w-[120px]" title={row.intervention_taken}>
                          {row.intervention_taken}
                        </span>
                      </span>
                    ) : row.risk_score >= 50 ? (
                      <span className="text-red-900 font-bold text-[11px] border border-red-300 bg-red-50 px-2 py-0.5 rounded inline-flex items-center gap-1 font-mono">
                        <AlertCircle size={12} className="text-red-700 shrink-0" />
                        <span>▲ Action Mandated</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono text-xs">● Nominal Progress</span>
                    )}
                  </td>

                  {/* Dual Action Triggers: Inspect Dossier & Intervene */}
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedDossierProject(row)}
                        className="text-slate-700 hover:text-slate-900 font-bold text-xs bg-slate-100 hover:bg-slate-200 border border-slate-300 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
                        title="Open project detail dossier (Why is this project at risk?)"
                      >
                        Inspect
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedInterventionProject(row)}
                        className="text-blue-700 hover:text-blue-900 font-bold text-xs bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
                        title="Log administrative intervention directive"
                      >
                        Intervene
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}

            {paginated.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-10 text-center text-slate-500 font-medium">
                  No matching projects found in registry.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Registry Footer */}
      <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium disabled:opacity-40 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
        >
          <ChevronLeft size={14} />
          <span>Previous</span>
        </button>

        <span className="font-mono text-xs">
          Showing <strong>{sorted.length > 0 ? page * rowsPerPage + 1 : 0}</strong> - <strong>{Math.min((page + 1) * rowsPerPage, sorted.length)}</strong> of <strong>{sorted.length}</strong> records (Page <strong>{page + 1}</strong> of <strong>{totalPages}</strong>)
        </span>

        <button
          onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium disabled:opacity-40 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
        >
          <span>Next</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* 1. Project Detail / Drill Down Modal */}
      {selectedDossierProject && (
        <DrillDownModal
          project={selectedDossierProject}
          onClose={() => setSelectedDossierProject(null)}
          onOpenIntervention={(p) => {
            setSelectedDossierProject(null)
            setSelectedInterventionProject(p)
          }}
        />
      )}

      {/* 2. Intervention Action Modal */}
      {selectedInterventionProject && (
        <InterventionModal
          project={selectedInterventionProject}
          onClose={() => setSelectedInterventionProject(null)}
          onUpdate={onInterventionUpdate}
        />
      )}
    </div>
  )
}

