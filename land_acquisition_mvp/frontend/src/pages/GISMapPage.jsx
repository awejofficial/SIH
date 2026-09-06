import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import GISMap from '../components/GISMap'
import InterventionModal from '../components/InterventionModal'
import RiskCategoryBadge from '../components/intelligence/RiskCategoryBadge'
import { useRole } from '../context/RoleContext'
import {
  Search,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  X,
  RotateCcw,
  ArrowRight
} from 'lucide-react'

export default function GISMapPage() {
  const { currentRole, roleInfo, token } = useRole()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  const [actionProject, setActionProject] = useState(null)

  // Administrative Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedRisk, setSelectedRisk] = useState('All')
  const [selectedIntervention, setSelectedIntervention] = useState('All')

  // Fetch GeoJSON project data
  const fetchGeoData = async () => {
    try {
      setLoading(true)
      const res = await api.get('/projects/geo')
      setData(res.data)
    } catch (err) {
      console.error('Failed to load spatial GeoJSON data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGeoData()
  }, [token, currentRole])

  // Extract all flat features/projects
  const allProjects = useMemo(() => {
    if (!data || !data.features) return []
    return data.features.map((f) => ({
      ...f.properties,
      lat: f.geometry?.coordinates ? f.geometry.coordinates[1] : null,
      lon: f.geometry?.coordinates ? f.geometry.coordinates[0] : null,
      geometry: f.geometry
    }))
  }, [data])

  // Extract unique districts and types for dropdowns
  const districts = useMemo(() => {
    const set = new Set(allProjects.map((p) => p.district).filter(Boolean))
    return ['All', ...Array.from(set).sort()]
  }, [allProjects])

  const projectTypes = useMemo(() => {
    const set = new Set(allProjects.map((p) => p.project_type).filter(Boolean))
    return ['All', ...Array.from(set).sort()]
  }, [allProjects])

  // Filter projects by administrative criteria
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      // 1. Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const nameMatch = (p.project_name || '').toLowerCase().includes(q)
        const idMatch = String(p.project_id || '').includes(q)
        const distMatch = (p.district || '').toLowerCase().includes(q)
        if (!nameMatch && !idMatch && !distMatch) return false
      }

      // 2. District
      if (selectedDistrict !== 'All' && p.district !== selectedDistrict) {
        return false
      }

      // 3. Project Type / Sector
      if (selectedType !== 'All' && p.project_type !== selectedType) {
        return false
      }

      // 4. Risk Category Tier
      if (selectedRisk !== 'All') {
        const score = p.risk_score || 0
        const resolvedCategory = p.risk_category || (
          score >= 75 ? 'Critical' : score >= 50 ? 'High' : score >= 25 ? 'Moderate' : 'Low'
        )
        if (resolvedCategory !== selectedRisk) return false
      }

      // 5. Intervention Status
      if (selectedIntervention === 'ActionNeeded' && p.intervention_taken) {
        return false
      }
      if (selectedIntervention === 'Logged' && !p.intervention_taken) {
        return false
      }

      return true
    })
  }, [allProjects, searchQuery, selectedDistrict, selectedType, selectedRisk, selectedIntervention])

  // Geographic Context Metrics
  const geoContext = useMemo(() => {
    const totalParcels = allProjects.length
    const visibleParcels = filteredProjects.length
    const totalAcres = filteredProjects.reduce((acc, p) => acc + (parseFloat(p.total_acres) || 0), 0)
    const criticalCount = filteredProjects.filter((p) => (p.risk_score >= 75) || p.risk_category === 'Critical').length
    const highRiskCount = filteredProjects.filter((p) => (p.risk_score >= 50 && p.risk_score < 75) || p.risk_category === 'High').length
    const hotspots = criticalCount + highRiskCount

    return {
      totalParcels,
      visibleParcels,
      totalAcres: Math.round(totalAcres),
      criticalCount,
      hotspots
    }
  }, [allProjects, filteredProjects])

  const hasActiveFilters = searchQuery || selectedDistrict !== 'All' || selectedType !== 'All' || selectedRisk !== 'All' || selectedIntervention !== 'All'

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedDistrict('All')
    setSelectedType('All')
    setSelectedRisk('All')
    setSelectedIntervention('All')
  }

  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-[#0b0f19] overflow-hidden flex flex-col font-sans">
      {/* 1. Restrained Floating Administrative Command Dock (Top) */}
      <div className="absolute top-4 left-4 right-4 z-[400] pointer-events-none">
        <div className="max-w-6xl mx-auto bg-slate-900/95 border border-slate-700/80 shadow-2xl rounded-2xl p-3.5 backdrop-blur-md text-white pointer-events-auto transition-all space-y-3">
          {/* Top Bar: Title, Contextual Badges, Role */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400">
                <MapPin size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-black uppercase tracking-wider text-slate-100">
                    Spatial Decision Intelligence
                  </h1>
                  <span className="text-[10px] font-mono bg-blue-950 border border-blue-800 text-blue-300 px-2 py-0.2 rounded font-bold">
                    Maharashtra Infrastructure Corridors
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Real-time geographic risk hotspots, statutory progress demarcation, and field intervention triage.
                </p>
              </div>
            </div>

            {/* Geographic Context Status Chips */}
            <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
              <span className="bg-slate-800/90 border border-slate-700 px-2.5 py-1 rounded-lg text-slate-300">
                Visible: <strong className="text-white font-bold">{geoContext.visibleParcels}</strong> / {geoContext.totalParcels} Parcels
              </span>
              <span className="bg-slate-800/90 border border-slate-700 px-2.5 py-1 rounded-lg text-slate-300 hidden md:inline-block">
                Notified Land: <strong className="text-amber-300 font-bold">{geoContext.totalAcres.toLocaleString()}</strong> Ac
              </span>
              {geoContext.hotspots > 0 && (
                <span className="bg-red-950/90 border border-red-700/80 px-2.5 py-1 rounded-lg text-red-300 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span>{geoContext.hotspots} Delay Hotspots</span>
                </span>
              )}
              <span className={`text-[10px] font-bold px-2 py-0.8 rounded border ${roleInfo.badgeColor}`}>
                {currentRole}
              </span>
            </div>
          </div>

          {/* Bottom Bar: Administrative Filtering Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            {/* Search Input */}
            <div className="col-span-2 sm:col-span-1 relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search Project / ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-800/90 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            {/* District Filter */}
            <div>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-800/90 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="All">District: All ({districts.length - 1})</option>
                {districts.filter((d) => d !== 'All').map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-800/90 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="All">Sector: All ({projectTypes.length - 1})</option>
                {projectTypes.filter((t) => t !== 'All').map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Risk Category Tier Filter */}
            <div>
              <select
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-800/90 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="All">Risk Tier: All</option>
                <option value="Critical">▲ Critical (&gt;75%)</option>
                <option value="High">◆ High (50-75%)</option>
                <option value="Moderate">■ Moderate (25-50%)</option>
                <option value="Low">● Low (&lt;25%)</option>
              </select>
            </div>

            {/* Intervention Status Filter */}
            <div>
              <select
                value={selectedIntervention}
                onChange={(e) => setSelectedIntervention(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-800/90 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="All">Status: All</option>
                <option value="ActionNeeded">Action Needed</option>
                <option value="Logged">Intervention Logged</option>
              </select>
            </div>

            {/* Reset Filters Action */}
            <div className="col-span-2 sm:col-span-1 flex items-center">
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-600 text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>Reset Filters</span>
                </button>
              ) : (
                <div className="text-[10px] font-mono text-slate-500 text-center w-full">
                  All 24 Parcels Active
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Full-Canvas Dark GIS Map Component */}
      <div className="flex-1 w-full h-full relative">
        {loading ? (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0b0f19] text-slate-400 gap-3 font-mono text-xs">
            <RefreshCw size={20} className="animate-spin text-blue-500" />
            <span>Loading Maharashtra Spatial Grid...</span>
          </div>
        ) : (
          <GISMap
            projects={filteredProjects}
            selectedProject={selectedProject}
            onSelectProject={(p) => setSelectedProject(p)}
            onTakeAction={(p) => setActionProject(p)}
            className="w-full h-full"
          />
        )}
      </div>

      {/* 3. Collapsible Spatial Intelligence Drawer / Inspector (Right Side) */}
      {selectedProject && (
        <div className="absolute top-28 bottom-6 right-6 z-[450] w-84 sm:w-96 bg-slate-900/95 border border-slate-700/80 shadow-2xl rounded-2xl p-5 backdrop-blur-md text-white flex flex-col justify-between animate-fadeIn overflow-hidden">
          <div className="space-y-4 overflow-y-auto pr-1">
            {/* Drawer Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-black px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 text-amber-300">
                    PRJ-{String(selectedProject.project_id).padStart(4, '0')}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                    {selectedProject.project_type}
                  </span>
                </div>
                <h3 className="text-sm font-black text-white leading-snug">
                  {selectedProject.project_name || `Project #${selectedProject.project_id}`}
                </h3>
                <div className="text-[11px] text-slate-400 font-medium">
                  {selectedProject.district} Jurisdiction • Collector Division
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Close Inspector"
              >
                <X size={15} />
              </button>
            </div>

            {/* Embedded Multi-Modal Risk Category */}
            <div>
              <RiskCategoryBadge
                score={selectedProject.risk_score}
                category={selectedProject.risk_category}
                variant="detailed"
                showMeaning={true}
              />
            </div>

            {/* Spatial Demarcation & Progress Meters */}
            <div className="space-y-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase text-slate-400">
                <span>Spatial Milestones</span>
                <span className="text-slate-500">RFCTLARR Compliance</span>
              </div>

              {/* Progress 1: Land Acquired */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Demarcation & Acquired:</span>
                  <strong className="font-mono text-slate-200">{selectedProject.land_acquired_pct ?? 0}%</strong>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, Math.max(0, selectedProject.land_acquired_pct ?? 0))}%` }}
                  ></div>
                </div>
              </div>

              {/* Progress 2: Compensation Disbursed */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Direct DBT Disbursed:</span>
                  <strong className="font-mono text-slate-200">{selectedProject.compensation_disbursed_pct ?? 0}%</strong>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, Math.max(0, selectedProject.compensation_disbursed_pct ?? 0))}%` }}
                  ></div>
                </div>
              </div>

              {/* Progress 3: Possession */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Physical Possession:</span>
                  <strong className="font-mono text-slate-200">{selectedProject.possession_pct ?? 0}%</strong>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, Math.max(0, selectedProject.possession_pct ?? 0))}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Dense Parameter Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-0.5">
                <span className="text-[9px] text-slate-400 uppercase font-bold">Total Land Scope</span>
                <div className="text-xs font-black text-slate-100">{selectedProject.total_acres || '—'} Acres</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-0.5">
                <span className="text-[9px] text-slate-400 uppercase font-bold">Pending Clearances</span>
                <div className="text-xs font-black text-amber-300">{selectedProject.approval_days_pending || 0} Days</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-0.5">
                <span className="text-[9px] text-slate-400 uppercase font-bold">Court Cases</span>
                <div className="text-xs font-black text-red-400">{selectedProject.legal_cases_count || 0} Active</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-0.5">
                <span className="text-[9px] text-slate-400 uppercase font-bold">Title Disputes</span>
                <div className="text-xs font-black text-orange-400">{selectedProject.ownership_disputes || 0} Records</div>
              </div>
            </div>

            {/* Intervention Status Badge */}
            <div className={`p-3 rounded-xl border text-xs ${
              selectedProject.intervention_taken
                ? 'bg-blue-950/80 border-blue-700 text-blue-200'
                : 'bg-red-950/80 border-red-700 text-red-200'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                {selectedProject.intervention_taken ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                <span>{selectedProject.intervention_taken ? 'Logged Intervention:' : 'Statutory Action Mandated:'}</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">
                {selectedProject.intervention_taken || 'No administrative intervention recorded. Project at risk of statutory delay breach under Section 19/23.'}
              </p>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <button
              type="button"
              onClick={() => setActionProject(selectedProject)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer font-mono uppercase tracking-wider"
            >
              <span>Log Administrative Intervention</span>
              <ArrowRight size={13} />
            </button>

            <Link
              to="/predict-risk"
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-mono"
            >
              <span>Full Predictive Analysis (SHAP Drivers)</span>
              <ArrowRight size={13} className="text-blue-400" />
            </Link>
          </div>
        </div>
      )}

      {/* 4. Intervention Modal */}
      {actionProject && (
        <InterventionModal
          project={actionProject}
          onClose={() => setActionProject(null)}
          onUpdate={async () => {
            await fetchGeoData()
            // Update selectedProject if currently inspected
            if (selectedProject && selectedProject.project_id === actionProject.project_id) {
              setSelectedProject((prev) => ({
                ...prev,
                intervention_taken: 'Intervention Logged'
              }))
            }
          }}
        />
      )}
    </div>
  )
}
