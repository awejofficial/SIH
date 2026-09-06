import React, { useState } from 'react'
import InterventionModal from './InterventionModal'
import RiskCategoryBadge from './intelligence/RiskCategoryBadge'
import { Search, ChevronLeft, ChevronRight, FileCheck2, AlertCircle } from 'lucide-react'

export default function ProjectTable({ data = [], onInterventionUpdate }) {
  const [search, setSearch] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)
  const [page, setPage] = useState(0)
  const rowsPerPage = 10

  const filtered = data.filter(d =>
    (d.district || '').toLowerCase().includes(search.toLowerCase()) ||
    (d.project_name || '').toLowerCase().includes(search.toLowerCase()) ||
    String(d.project_id || '').includes(search)
  )

  const sorted = [...filtered].sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0))
  const paginated = sorted.slice(page * rowsPerPage, (page + 1) * rowsPerPage)

  const totalPages = Math.ceil(sorted.length / rowsPerPage) || 1

  return (
    <div className="w-full space-y-4">
      {/* Search & Counter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={14} />
          </div>
          <input
            type="text"
            placeholder="Search by District, Name, ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
          />
        </div>
        <div className="text-xs font-mono text-slate-500">
          Showing <strong>{sorted.length > 0 ? page * rowsPerPage + 1 : 0}</strong> - <strong>{Math.min((page + 1) * rowsPerPage, sorted.length)}</strong> of <strong>{sorted.length}</strong> records
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-900 uppercase text-[10px] font-mono font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Project ID</th>
              <th className="px-4 py-3">District</th>
              <th className="px-4 py-3">Sector</th>
              <th className="px-4 py-3">Delay Risk Classification</th>
              <th className="px-4 py-3">Administrative Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {paginated.map((row) => {
              const formattedId = `PRJ-2026-${String(row.project_id).padStart(4, '0')}`

              return (
                <tr key={row.project_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                      {formattedId}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{row.district}</td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium">
                      {row.project_type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <RiskCategoryBadge
                      score={row.risk_score}
                      variant="compact"
                      showMeaning={false}
                    />
                  </td>
                  <td className="px-4 py-3">
                    {row.intervention_taken ? (
                      <span className="text-emerald-800 font-semibold text-[11px] border border-emerald-300 bg-emerald-50 px-2 py-0.5 rounded inline-flex items-center gap-1">
                        <FileCheck2 size={12} className="text-emerald-700" />
                        <span>Logged: {row.intervention_taken}</span>
                      </span>
                    ) : row.risk_score >= 50 ? (
                      <span className="text-red-900 font-bold text-[11px] border border-red-300 bg-red-50 px-2 py-0.5 rounded inline-flex items-center gap-1 font-mono">
                        <AlertCircle size={12} className="text-red-700" />
                        <span>▲ Action Mandated</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedProject(row)}
                      className="text-blue-700 hover:text-blue-900 font-bold text-xs bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      Investigate & Act
                    </button>
                  </td>
                </tr>
              )
            })}
            {paginated.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-500 font-medium">
                  No matching projects found in registry.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium disabled:opacity-40 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
        >
          <ChevronLeft size={14} />
          <span>Previous</span>
        </button>

        <span className="font-mono text-xs">
          Page <strong>{page + 1}</strong> of <strong>{totalPages}</strong>
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

      {/* Modal for Action */}
      {selectedProject && (
        <InterventionModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onInterventionUpdate={onInterventionUpdate}
        />
      )}
    </div>
  )
}
