import React from 'react'
import { useLocation } from 'react-router-dom'
import { useRole } from '../context/RoleContext'
import {
  Menu,
  ChevronRight,
  Shield,
  Activity,
  Compass,
  Clock
} from 'lucide-react'

export default function Topbar({ onToggleSidebar }) {
  const location = useLocation()
  const { currentRole } = useRole()

  // Route map for dynamic breadcrumbs & page identification
  const routeMeta = {
    '/': {
      section: 'Operational Intelligence',
      page: 'Command Center',
      subtext: 'High-Risk Field & District Operations'
    },
    '/predict-risk': {
      section: 'Predictive Analytics',
      page: 'Early-Warning Delay Predictor',
      subtext: 'Calibrated Risk Inference & SHAP Attribution'
    },
    '/analytics': {
      section: 'Portfolio Intelligence',
      page: 'Executive Analytics',
      subtext: 'Statewide Risk Distribution & Policy Levers'
    },
    '/map': {
      section: 'Spatial Surveillance',
      page: 'GIS Spatial Risk Map',
      subtext: 'Geospatial Parcel & Corridor Monitoring'
    },
    '/model-health': {
      section: 'Governance & Compliance',
      page: 'Model Health & Governance',
      subtext: 'Drift Metrics, Confusion Matrix & Audit Contract'
    }
  }

  const currentMeta = routeMeta[location.pathname] || {
    section: 'Decision Support',
    page: 'Workspace',
    subtext: 'Land Acquisition Decision Support System'
  }

  const getJurisdictionLabel = () => {
    switch (currentRole) {
      case 'Collector':
        return 'District Magistrate Jurisdiction (Pune)'
      case 'Policy Maker':
        return 'State Strategic Cell (Delhi HQ / Corridor Oversight)'
      default:
        return 'Field Revenue Circle (Sub-Division Operations)'
    }
  }

  return (
    <header className="shrink-0 z-30 bg-white border-b border-slate-200 select-none">
      {/* 1. National Tri-Color Ribbon (GIGW 3.0 Standard) */}
      <div className="h-[3px] w-full flex">
        <div className="flex-1 bg-[#ff9933]" title="Saffron"></div>
        <div className="flex-1 bg-white" title="White"></div>
        <div className="flex-1 bg-[#138808]" title="Green"></div>
      </div>

      {/* 2. Apex Government Context Header */}
      <div className="px-4 sm:px-6 py-2 bg-slate-900 text-slate-100 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Sidebar"
          >
            <Menu size={18} />
          </button>

          {/* National Emblem Representation & Ministry Labels */}
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-sm bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black text-xs flex items-center justify-center border border-amber-400/40 shadow-xs shrink-0 tracking-tighter">
              GOI
            </div>
            <div className="leading-tight min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-200">
                  भारत सरकार | Government of India
                </span>
                <span className="hidden md:inline-block text-[10px] text-amber-400 font-semibold px-1.5 py-0.2 bg-amber-500/10 border border-amber-500/20 rounded">
                  Official Portal
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium truncate">
                Department of Land Resources (DoLR) • Ministry of Rural Development
              </p>
            </div>
          </div>
        </div>

        {/* Right Status Capsule: Live Security & Connectivity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
            <Activity size={12} className="text-emerald-400 animate-pulse" />
            <span className="font-mono text-emerald-400 font-bold">XGBoost v2.1</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300 font-medium">Model Operational</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 font-mono">
            <Clock size={12} className="text-slate-400" />
            <span>IST (UTC+5:30)</span>
          </div>

          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-blue-950/70 border border-blue-800/60 text-[11px] text-blue-200">
            <Shield size={12} className="text-blue-400" />
            <span className="font-semibold">{currentRole}</span>
            <span className="hidden md:inline text-blue-300/70 text-[10px] font-mono">Verified</span>
          </div>
        </div>
      </div>

      {/* 3. Operational Workspace Context & Breadcrumbs */}
      <div className="px-4 sm:px-6 py-2 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span className="text-slate-400">Portal</span>
          <ChevronRight size={13} className="text-slate-300 shrink-0" />
          <span className="text-slate-600 font-medium">{currentMeta.section}</span>
          <ChevronRight size={13} className="text-slate-300 shrink-0" />
          <span className="text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded text-[11px]">
            {currentMeta.page}
          </span>
        </nav>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium text-[11px]">
            <Compass size={13} className="text-blue-600" />
            <span className="text-slate-400">Scope:</span>
            <span className="font-semibold text-slate-800">{getJurisdictionLabel()}</span>
          </div>

          <span className="hidden md:inline-block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
            RFCTLARR Act 2013
          </span>
        </div>
      </div>
    </header>
  )
}
