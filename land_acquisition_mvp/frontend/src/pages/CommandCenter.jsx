import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import KPICards from '../components/KPICards'
import AlertFeed from '../components/AlertFeed'
import RiskCategoryBadge from '../components/intelligence/RiskCategoryBadge'
import DrillDownModal from '../components/DrillDownModal'
import InterventionModal from '../components/InterventionModal'
import { useRole } from '../context/RoleContext'
import {
  ShieldAlert,
  Building2,
  Gauge,
  ArrowRight,
  AlertTriangle,
  FileCheck2,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  RefreshCw
} from 'lucide-react'

export default function CommandCenter() {
  const { currentRole, roleInfo, token } = useRole()
  const [alerts, setAlerts] = useState([])
  const [projects, setProjects] = useState([])
  const [metrics, setMetrics] = useState({ total: 0, critical: 0, avgRisk: 0, accuracy: 96.2 })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Modals for Priority Attention Projects
  const [inspectingProject, setInspectingProject] = useState(null)
  const [interveningProject, setInterveningProject] = useState(null)
  const [filterSeverity, setFilterSeverity] = useState('all') // 'all' | 'critical' | 'unmitigated'

  const fetchData = useCallback(async () => {
    try {
      // 1. Fetch live early warning alerts
      let alertList = []
      try {
        const alertRes = await api.get('/alerts/trigger')
        alertList = alertRes.data || []
        setAlerts(alertList)
      } catch (alertErr) {
        console.error('Failed to fetch alerts', alertErr)
        setAlerts([])
      }

      // 2. Fetch project registry
      try {
        const geoRes = await api.get('/projects/geo')
        const geoData = geoRes.data || {}
        const features = geoData.features || []
        const projectList = features.map(f => f.properties).filter(Boolean)
        setProjects(projectList)

        const total = projectList.length
        const critical = projectList.filter(p => (p.risk_score || 0) >= 75).length
        const avgRisk = projectList.reduce((acc, p) => acc + (p.risk_score || 0), 0) / (total || 1)

        setMetrics({
          total,
          critical,
          avgRisk: avgRisk.toFixed(1),
          accuracy: 96.2
        })
      } catch (geoErr) {
        console.error('Failed to fetch geo projects', geoErr)
      }
    } catch (err) {
      console.error('Failed to fetch command center data', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [token, currentRole, fetchData])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  // Priority Attention Queue: Projects needing immediate administrative attention
  // Sorted by Risk Score descending; highlighted if unmitigated
  const criticalParcels = projects.filter(p => (p.risk_score || 0) >= 75)
  const unmitigatedParcels = projects.filter(p => (p.risk_score || 0) >= 50 && !p.intervention_taken)
  const resolvedParcels = projects.filter(p => !!p.intervention_taken)

  const priorityQueue = projects
    .filter(p => {
      if (filterSeverity === 'critical') return (p.risk_score || 0) >= 75
      if (filterSeverity === 'unmitigated') return !p.intervention_taken && (p.risk_score || 0) >= 50
      return (p.risk_score || 0) >= 50 // default show High + Critical requiring attention
    })
    .sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0))

  const getRoleHeader = () => {
    switch (currentRole) {
      case 'Collector':
        return {
          title: 'District Collector Executive Command Center',
          subtitle: 'Statutory milestone surveillance, Section 19 declaration bottlenecks, and direct DBT sanction queue.',
          icon: <Building2 className="text-amber-700" size={24} />,
          badge: 'District Magistrate & Collector Review'
        }
      case 'Policy Maker':
        return {
          title: 'State Strategic Acquisition Command Center',
          subtitle: 'Macro corridor portfolio oversight, systemic risk early warning, and inter-departmental clearance governance.',
          icon: <Gauge className="text-blue-700" size={24} />,
          badge: 'State HQ Strategic Intelligence'
        }
      default: // LAO
        return {
          title: 'Field Land Acquisition Command Center',
          subtitle: 'Operational tracking of active land parcels, dispute escalation register, and direct talathi survey coordination.',
          icon: <ShieldAlert className="text-red-700" size={24} />,
          badge: 'Competent Authority / LAO Field Operations'
        }
    }
  }

  const roleHeader = getRoleHeader()

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent"></div>
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-600">
            Initializing Institutional Command Center ({currentRole} View)...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-7 animate-fadeIn">
      {/* 1. Header with Role & Decision Role */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="p-2 rounded-lg bg-slate-100 border border-slate-200 shrink-0">
              {roleHeader.icon}
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {roleHeader.title}
            </h1>
            <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${roleInfo.badgeColor}`}>
              {roleHeader.badge}
            </span>
          </div>
          <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
            {roleHeader.subtitle}
          </p>
        </div>

        {/* Action Controls & Active Officer Persona */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-3 py-2 rounded-lg text-xs transition-colors shadow-xs cursor-pointer"
            title="Refresh live registry feeds"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin text-blue-600' : 'text-slate-500'} />
            <span>Sync Live Feeds</span>
          </button>

          <Link
            to="/predict-risk"
            className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-lg shadow-xs text-xs transition-colors cursor-pointer"
          >
            <span>Evaluate Delay Risk</span>
            <ArrowRight size={13} />
          </Link>

          <div className="flex items-center gap-2 bg-white border border-slate-200 shadow-xs px-3 py-1.5 rounded-lg">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <div className="text-xs font-mono">
              <span className="text-slate-400">Officer: </span>
              <span className="font-bold text-slate-800">{roleInfo.officerName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Urgent Triage Banner: "What requires attention?" */}
      {unmitigatedParcels.length > 0 ? (
        <div className="bg-red-50/90 border border-red-300 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 border border-red-300 rounded-lg text-red-700 shrink-0 mt-0.5">
              <AlertTriangle size={20} />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-red-200 text-red-900 px-2 py-0.5 rounded">
                  ▲ Priority Escalation Queue
                </span>
                <span className="text-xs font-mono font-bold text-red-950">
                  Primary Decision: What requires attention?
                </span>
              </div>
              <h2 className="text-sm font-bold text-red-950">
                {unmitigatedParcels.length} Land Acquisition Parcels Mandate Immediate Administrative Sanction
              </h2>
              <p className="text-xs text-red-800 leading-relaxed">
                Empirical delay probability exceeds statutory intervention threshold (P &gt; 0.50). Immediate DBT sanction, Lok Adalat scheduling, or joint revenue clearance required to prevent lapse under RFCTLARR Act 2013.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setFilterSeverity('unmitigated')}
              className="text-xs font-bold bg-red-700 hover:bg-red-800 text-white px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <span>View Unmitigated ({unmitigatedParcels.length})</span>
              <ArrowUpRight size={14} />
            </button>
            <button
              onClick={() => setFilterSeverity('all')}
              className="text-xs font-semibold bg-white hover:bg-red-100 text-red-900 border border-red-300 px-3 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Show All
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-700 shrink-0" />
            <div>
              <h2 className="text-xs font-bold text-emerald-950">
                All High-Risk Parcels Have Registered Administrative Interventions
              </h2>
              <p className="text-[11px] text-emerald-800">
                Surveillance pipeline indicates zero unmitigated critical defaults across active revenue districts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Executive KPI Band */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICards metrics={metrics} />
      </div>

      {/* 4. Main Two-Column Intelligence Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 items-start">
        {/* Left 2 Columns: Priority Attention Registry Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Table Header with Filters */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Priority Attention Registry
                  </h2>
                  <span className="text-[10px] font-mono bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded">
                    {priorityQueue.length} Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Actionable Parcels Ranked by Calculated Delay Risk
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setFilterSeverity('all')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    filterSeverity === 'all'
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  All Active ({projects.filter(p => (p.risk_score || 0) >= 50).length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterSeverity('critical')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                    filterSeverity === 'critical'
                      ? 'bg-red-700 text-white font-bold'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>▲ Critical</span>
                  <span>({criticalParcels.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFilterSeverity('unmitigated')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                    filterSeverity === 'unmitigated'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>Unmitigated</span>
                  <span>({unmitigatedParcels.length})</span>
                </button>
              </div>
            </div>

            {/* High-Density Priority Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-100/70 text-slate-900 uppercase text-[10px] font-mono font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Project ID & Name</th>
                    <th className="px-3 py-3">District / Sector</th>
                    <th className="px-3 py-3">Risk Tier</th>
                    <th className="px-3 py-3">Dominant Impediment</th>
                    <th className="px-3 py-3">Action Status</th>
                    <th className="px-4 py-3 text-right">Administrative Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {priorityQueue.map((row) => {
                    const formattedId = `PRJ-2026-${String(row.project_id).padStart(4, '0')}`
                    const isCritical = (row.risk_score || 0) >= 75
                    const hasAction = !!row.intervention_taken

                    // Determine primary bottleneck for high density display
                    let impediment = 'Balanced Milestones'
                    if (row.compensation_disbursed_pct < 40) impediment = `DBT Lag (${row.compensation_disbursed_pct}% paid)`
                    else if (row.legal_cases_count >= 5) impediment = `Litigation (${row.legal_cases_count} cases)`
                    else if (row.approval_days_pending > 60) impediment = `Approvals (${row.approval_days_pending}d pend)`
                    else if (row.possession_pct < 30) impediment = `Demarcation (${row.possession_pct}% taken)`

                    return (
                      <tr
                        key={row.project_id}
                        className={`hover:bg-slate-50/90 transition-colors ${
                          !hasAction && isCritical ? 'bg-red-50/20' : ''
                        }`}
                      >
                        {/* Project ID */}
                        <td className="px-4 py-3">
                          <div className="space-y-0.5">
                            <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded inline-block">
                              {formattedId}
                            </span>
                            <div className="font-semibold text-slate-900 truncate max-w-[180px]" title={row.project_name}>
                              {row.project_name || `Project #${row.project_id}`}
                            </div>
                          </div>
                        </td>

                        {/* District / Sector */}
                        <td className="px-3 py-3">
                          <div className="text-slate-800 font-semibold">{row.district}</div>
                          <div className="text-[11px] text-slate-500 font-medium">{row.project_type}</div>
                        </td>

                        {/* Risk Tier Badge */}
                        <td className="px-3 py-3">
                          <RiskCategoryBadge
                            score={row.risk_score}
                            variant="compact"
                            showMeaning={false}
                          />
                        </td>

                        {/* Dominant Impediment */}
                        <td className="px-3 py-3">
                          <span className="text-[11px] font-mono font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2 py-1 rounded inline-block">
                            {impediment}
                          </span>
                        </td>

                        {/* Action Status */}
                        <td className="px-3 py-3">
                          {hasAction ? (
                            <span className="text-emerald-800 font-semibold text-[11px] border border-emerald-300 bg-emerald-50 px-2 py-0.5 rounded inline-flex items-center gap-1">
                              <FileCheck2 size={11} className="text-emerald-700" />
                              <span className="truncate max-w-[110px]" title={row.intervention_taken}>
                                {row.intervention_taken}
                              </span>
                            </span>
                          ) : (
                            <span className="text-red-900 font-bold text-[11px] border border-red-300 bg-red-50 px-2 py-0.5 rounded inline-flex items-center gap-1 font-mono">
                              <span>▲ Pending Sanction</span>
                            </span>
                          )}
                        </td>

                        {/* Action Buttons: Inspect Dossier & Intervene */}
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setInspectingProject(row)}
                              className="text-slate-700 hover:text-slate-900 font-bold text-xs bg-slate-100 hover:bg-slate-200 border border-slate-300 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
                              title="Deep dive project diagnostics"
                            >
                              Inspect
                            </button>
                            <button
                              type="button"
                              onClick={() => setInterveningProject(row)}
                              className="text-blue-700 hover:text-blue-900 font-bold text-xs bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
                              title="Log statutory administrative directive"
                            >
                              Intervene
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}

                  {priorityQueue.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-slate-500 font-medium">
                        No projects currently matching priority criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Showing high-risk parcels requiring officer attention</span>
              <Link to="/analytics" className="text-blue-700 hover:underline font-bold flex items-center gap-1">
                <span>View Full 5,000 Portfolio Registry</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* 5. Statutory Directives Audit Trail Band */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 size={16} className="text-emerald-700" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Recent Administrative Directives (Audit Trail)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500 font-bold">
                Immutable Governance Log
              </span>
            </div>

            {resolvedParcels.length > 0 ? (
              <div className="divide-y divide-slate-100 text-xs">
                {resolvedParcels.slice(0, 4).map((rp) => (
                  <div key={rp.project_id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                        PRJ-2026-{String(rp.project_id).padStart(4, '0')}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900">{rp.district} • {rp.project_name}</span>
                        <div className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                          <span>Sanctioned Directive:</span>
                          <strong>{rp.intervention_taken}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock size={10} />
                        Active Audit Record
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-2">
                No administrative interventions recorded in the current session. Use the "Intervene" button above to log official revenue directives.
              </p>
            )}
          </div>
        </div>

        {/* Right 1 Column: Real-Time Early Warning Surveillance Register */}
        <div className="lg:col-span-1 space-y-4">
          <AlertFeed alerts={alerts} />
        </div>
      </div>

      {/* 6. Drill-Down Modal (Project Intelligence) */}
      {inspectingProject && (
        <DrillDownModal
          project={inspectingProject}
          onClose={() => setInspectingProject(null)}
        />
      )}

      {/* 7. Intervention Modal (Administrative Action) */}
      {interveningProject && (
        <InterventionModal
          project={interveningProject}
          onClose={() => setInterveningProject(null)}
          onUpdate={fetchData}
        />
      )}
    </div>
  )
}

