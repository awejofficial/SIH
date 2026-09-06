import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Sparkles,
  BarChart3,
  Map,
  Activity,
  ShieldCheck,
  ChevronDown,
  UserCircle2,
  X,
  FileCheck2,
  Lock,
  Database
} from 'lucide-react'
import { useRole } from '../context/RoleContext'

export default function Sidebar({ isOpen, onClose }) {
  const { currentRole, setRole, roleInfo, rolesList } = useRole()

  const operationalLinks = [
    { to: '/', icon: <LayoutDashboard size={18} />, label: 'Command Center', badge: 'Live' },
    { to: '/predict-risk', icon: <Sparkles size={18} />, label: 'Early-Warning Predictor', badge: 'ML' },
    { to: '/map', icon: <Map size={18} />, label: 'Spatial Risk Map', badge: 'GIS' },
    { to: '/analytics', icon: <BarChart3 size={18} />, label: 'Portfolio Analytics', badge: null }
  ]

  const governanceLinks = [
    {
      to: '/model-health',
      icon: <Activity size={18} />,
      label: 'Model Health & Drift',
      badge: currentRole === 'LAO' ? 'Restricted' : 'Audit',
      restricted: currentRole === 'LAO'
    }
  ]

  const getRoleJurisdiction = () => {
    switch (currentRole) {
      case 'Collector':
        return 'District Magistrate Oversight'
      case 'Policy Maker':
        return 'State HQ Strategic Corridor'
      default:
        return 'Field Parcel Demarcation'
    }
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Aside */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex w-[268px] flex-col justify-between bg-[#0b132b] text-slate-200 border-r border-slate-800/80 select-none shrink-0 shadow-xl lg:shadow-none transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {/* 1. Header Branding Block */}
          <div className="p-5 border-b border-slate-800/80 bg-slate-950/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Government Insignia / Authority Monogram */}
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-700 to-indigo-900 border border-blue-400/30 text-white font-black text-sm shadow-md tracking-tight">
                  <div className="flex flex-col items-center leading-none">
                    <span className="text-[10px] text-amber-300 font-bold tracking-widest">IND</span>
                    <span className="text-xs font-black text-white">LAI</span>
                  </div>
                </div>

                <div className="leading-tight">
                  <h1 className="text-sm font-black tracking-wide uppercase text-slate-100">
                    Land Acquisition
                  </h1>
                  <p className="text-[11px] font-bold text-blue-400 tracking-wider uppercase">
                    Intelligence Platform
                  </p>
                  <p className="text-[9px] font-medium text-slate-400 tracking-tight mt-0.5">
                    SIH26017 • DoLR Decision Support
                  </p>
                </div>
              </div>

              {/* Mobile Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="lg:hidden p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                aria-label="Close sidebar"
              >
                <X size={18} />
              </button>
            </div>

            {/* Interactive Role Persona Switcher */}
            <div className="mt-4 pt-3.5 border-t border-slate-800/60">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-blue-400" />
                  Active Operational Role
                </label>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1 rounded font-semibold">
                  SYNCED
                </span>
              </div>

              <div className="relative">
                <select
                  id="role-selector-dropdown"
                  value={currentRole}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-900/90 py-2 pl-3 pr-8 text-xs font-bold text-slate-100 shadow-sm transition-all hover:border-slate-600 hover:bg-slate-900 focus:border-blue-500 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  {rolesList.map((r) => (
                    <option key={r} value={r} className="bg-slate-900 text-slate-200 font-medium py-1">
                      Role: {r}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                  <ChevronDown size={14} />
                </div>
              </div>

              <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span className="truncate">{getRoleJurisdiction()}</span>
                <span className="text-blue-400 font-mono text-[9px] font-bold">L-3 AUTH</span>
              </div>
            </div>
          </div>

          {/* 2. Structured Operational Navigation */}
          <nav className="p-3 space-y-6">
            {/* Operational Intelligence Section */}
            <div className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Operational Intelligence
              </div>
              {operationalLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose?.()
                  }}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-300 font-semibold border-l-[3px] border-blue-500 pl-2.5 shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0 text-slate-400 group-hover:text-slate-200">{link.icon}</span>
                    <span className="truncate">{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Governance, Audit & Compliance Section */}
            <div className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Governance & Retraining
              </div>
              {governanceLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose?.()
                  }}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-300 font-semibold border-l-[3px] border-blue-500 pl-2.5 shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0 text-slate-400">{link.icon}</span>
                    <span className="truncate">{link.label}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded flex items-center gap-1 ${
                      link.restricted
                        ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                        : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                    }`}
                  >
                    {link.restricted && <Lock size={9} />}
                    {link.badge}
                  </span>
                </NavLink>
              ))}
            </div>

            {/* Statutory Compliance Footer Reference */}
            <div className="px-3 pt-2">
              <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-3 space-y-1.5">
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-300">
                  <FileCheck2 size={13} className="text-emerald-400 shrink-0" />
                  <span>Statutory Standard</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  RFCTLARR Act 2013 (Right to Fair Compensation & Transparency).
                </p>
                <div className="pt-1 flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-800 font-mono">
                  <span className="flex items-center gap-1">
                    <Database size={10} /> 5,000 DB Records
                  </span>
                  <span>v2.1-prod</span>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* 3. Officer Profile Details in Sidebar Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-900/60 border border-blue-700/50 text-blue-300 font-bold text-xs shrink-0 shadow-inner">
              <UserCircle2 size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                <p className="text-xs font-bold text-slate-100 truncate">
                  {roleInfo.officerName}
                </p>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {roleInfo.designation}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
