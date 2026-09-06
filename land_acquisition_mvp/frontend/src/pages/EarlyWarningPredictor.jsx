import React, { useState, useEffect, useRef } from 'react'
import api from '../services/api'
import { useRole } from '../context/RoleContext'
import DelayProbabilityCard from '../components/intelligence/DelayProbabilityCard'
import SHAPExplainabilityMatrix from '../components/intelligence/SHAPExplainabilityMatrix'
import StatutoryLifecycleTimeline from '../components/intelligence/StatutoryLifecycleTimeline'
import AdministrativeDirectivesPanel from '../components/intelligence/AdministrativeDirectivesPanel'
import InterventionSimulatorPanel from '../components/intelligence/InterventionSimulatorPanel'
import ProjectIntelligenceCard from '../components/intelligence/ProjectIntelligenceCard'
import RiskDriversPanel from '../components/intelligence/RiskDriversPanel'
import EarlyWarningTelemetryCard from '../components/intelligence/EarlyWarningTelemetryCard'
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Layers,
  FileCheck,
  Send,
  RefreshCw,
  ShieldAlert,
  ArrowRight,
  Search,
  X
} from 'lucide-react'

// Section 8 Pune Highway sample from the official SIH specification
const SAMPLE_PRESETS = {
  puneHighway: {
    name: 'Pune Highway (High Risk)',
    data: {
      district: 'Pune',
      project_type: 'Highway',
      total_acres: 250,
      land_acquired_pct: 62,
      approval_days_pending: 96,
      compensation_disbursed_pct: 38,
      legal_cases_count: 8,
      ownership_disputes: 5,
      rnp_progress_pct: 42,
      possession_pct: 25,
      affected_families: 180,
      doc_deficiency_score: 35,
      historical_district_delay_avg: 18,
      project_id: 101,
      project_name: 'Pune-Solapur Highway Expansion #101',
    }
  },
  nagpurMetro: {
    name: 'Nagpur Metro (Low Risk Sample)',
    data: {
      district: 'Nagpur',
      project_type: 'Metro',
      total_acres: 120,
      land_acquired_pct: 92,
      approval_days_pending: 15,
      compensation_disbursed_pct: 95,
      legal_cases_count: 1,
      ownership_disputes: 1,
      rnp_progress_pct: 88,
      possession_pct: 85,
      affected_families: 45,
      doc_deficiency_score: 10,
      historical_district_delay_avg: 12,
      project_id: 202,
      project_name: 'Nagpur Metro Corridor Phase II #202',
    }
  },
  nashikRailway: {
    name: 'Nashik Railway (Moderate Risk Sample)',
    data: {
      district: 'Nashik',
      project_type: 'Railway',
      total_acres: 380,
      land_acquired_pct: 75,
      approval_days_pending: 45,
      compensation_disbursed_pct: 60,
      legal_cases_count: 3,
      ownership_disputes: 4,
      rnp_progress_pct: 65,
      possession_pct: 55,
      affected_families: 210,
      doc_deficiency_score: 25,
      historical_district_delay_avg: 22,
      project_id: 303,
      project_name: 'Nashik-Pune Semi High-Speed Rail #303',
    }
  },
  aurangabadIrrigation: {
    name: 'Aurangabad Irrigation (Critical Risk Sample)',
    data: {
      district: 'Aurangabad',
      project_type: 'Irrigation',
      total_acres: 540,
      land_acquired_pct: 35,
      approval_days_pending: 110,
      compensation_disbursed_pct: 22,
      legal_cases_count: 11,
      ownership_disputes: 9,
      rnp_progress_pct: 18,
      possession_pct: 15,
      affected_families: 420,
      doc_deficiency_score: 65,
      historical_district_delay_avg: 28,
      project_id: 404,
      project_name: 'Marathwada Canal Storage Project #404',
    }
  }
}

export default function EarlyWarningPredictor() {
  const { currentRole, roleInfo } = useRole()

  const [formData, setFormData] = useState(SAMPLE_PRESETS.puneHighway.data)
  const [activePresetKey, setActivePresetKey] = useState('puneHighway')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const interventionRef = useRef(null)

  // 3-State ML Model Health: null = checking, true = loaded, false = unavailable
  const [modelLoaded, setModelLoaded] = useState(null)

  // ── ML Service Health Check ─────────────────────────────
  const checkMLHealth = async () => {
    setModelLoaded(null)
    try {
      const API_URL = import.meta.env.VITE_API_URL
      const targetUrl = API_URL ? `${API_URL.replace(/\/+$/, '')}/health` : '/health'
      const response = await api.get(targetUrl)

      // Direct access to response.data.model_loaded per backend schema
      if (response && response.data && response.data.model_loaded === true) {
        setModelLoaded(true)
      } else {
        setModelLoaded(false)
      }
    } catch (err) {
      console.error('ML service health check failed:', err)
      setModelLoaded(false)
    }
  }

  useEffect(() => {
    checkMLHealth()
  }, [])

  // Project Search State
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeSearchIndex, setActiveSearchIndex] = useState(-1)
  const [selectedProjectMeta, setSelectedProjectMeta] = useState({
    formatted_id: 'PRJ-2026-0101',
    project_id: 101,
    project_name: 'Pune-Solapur Highway Expansion #101',
    district: 'Pune',
    project_type: 'Highway',
    source: 'preset',
    presetLabel: 'Pune Highway (High Risk)'
  })

  const searchContainerRef = useRef(null)
  const searchInputRef = useRef(null)

  // What-If Simulation State
  const [whatifFeature, setWhatifFeature] = useState('compensation_disbursed_pct')
  const [whatifValue, setWhatifValue] = useState(75)
  const [whatifResult, setWhatifResult] = useState(null)
  const [whatifLoading, setWhatifLoading] = useState(false)

  // Intervention State
  const [interventionText, setInterventionText] = useState('')
  const [interventionDate, setInterventionDate] = useState(new Date().toISOString().split('T')[0])
  const [interventionSubmitting, setInterventionSubmitting] = useState(false)
  const [interventionSuccess, setInterventionSuccess] = useState(false)

  const handleInputChange = (field, value) => {
    const integerFields = ['approval_days_pending', 'legal_cases_count', 'ownership_disputes', 'affected_families', 'project_id']
    const floatFields = ['total_acres', 'land_acquired_pct', 'compensation_disbursed_pct', 'rnp_progress_pct', 'possession_pct', 'doc_deficiency_score', 'historical_district_delay_avg']
    
    let processedValue = value
    if (value !== '' && value !== null && value !== undefined) {
      if (integerFields.includes(field)) {
        const num = parseInt(value, 10)
        if (!isNaN(num)) processedValue = Math.abs(num)
      } else if (floatFields.includes(field)) {
        const num = parseFloat(value)
        if (!isNaN(num)) processedValue = Math.abs(num)
      }
    }
    setFormData(prev => ({ ...prev, [field]: processedValue }))
  }

  const loadPreset = (presetKey) => {
    const preset = SAMPLE_PRESETS[presetKey]
    if (preset) {
      setFormData(preset.data)
      setActivePresetKey(presetKey)
      setSelectedProjectMeta({
        formatted_id: `PRJ-2026-${String(preset.data.project_id).padStart(4, '0')}`,
        project_id: preset.data.project_id,
        project_name: preset.data.project_name,
        district: preset.data.district,
        project_type: preset.data.project_type,
        source: 'preset',
        presetLabel: preset.name
      })
      setPrediction(null)
      setWhatifResult(null)
      setInterventionSuccess(false)
      setError(null)
      setSearchQuery('')
      setSearchResults([])
      setSearchOpen(false)
    }
  }

  // Search Debounce Effect
  useEffect(() => {
    const q = searchQuery.trim()
    if (!q) {
      setSearchResults([])
      setSearchLoading(false)
      return
    }

    setSearchLoading(true)
    const timeoutId = setTimeout(async () => {
      try {
        const res = await api.get('/projects/search', {
          params: { q, limit: 10 }
        })
        setSearchResults(res.data || [])
      } catch (err) {
        console.error('Project search error:', err)
        setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    }, 250)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Click Outside to Dismiss Search Dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle Search Result Selection
  const handleSelectProject = (project) => {
    setFormData({
      district: project.district || 'Pune',
      project_type: project.project_type || 'Highway',
      total_acres: Math.abs(Number(project.total_acres) || 0),
      land_acquired_pct: Math.min(100, Math.abs(Number(project.land_acquired_pct) || 0)),
      approval_days_pending: Math.abs(Number(project.approval_days_pending) || 0),
      compensation_disbursed_pct: Math.min(100, Math.abs(Number(project.compensation_disbursed_pct) || 0)),
      legal_cases_count: Math.abs(Number(project.legal_cases_count) || 0),
      ownership_disputes: Math.abs(Number(project.ownership_disputes) || 0),
      rnp_progress_pct: Math.min(100, Math.abs(Number(project.rnp_progress_pct) || 0)),
      possession_pct: Math.min(100, Math.abs(Number(project.possession_pct) || 0)),
      affected_families: Math.abs(Number(project.affected_families) || 0),
      doc_deficiency_score: Math.abs(Number(project.doc_deficiency_score) || 0),
      historical_district_delay_avg: Math.abs(Number(project.historical_district_delay_avg) || 0),
      project_id: project.project_id ? Math.abs(Number(project.project_id)) : undefined,
      project_name: project.project_name
    })

    setSelectedProjectMeta({
      formatted_id: project.formatted_id || `PRJ-2026-${String(project.project_id).padStart(4, '0')}`,
      project_id: project.project_id ? Math.abs(Number(project.project_id)) : undefined,
      project_name: project.project_name,
      district: project.district,
      project_type: project.project_type,
      risk_score: project.risk_score !== undefined && project.risk_score !== null ? Math.abs(Number(project.risk_score)) : undefined,
      risk_category: project.risk_category,
      source: 'database'
    })

    setActivePresetKey(null)
    setSearchQuery('')
    setSearchResults([])
    setSearchOpen(false)
    setPrediction(null)
    setWhatifResult(null)
    setInterventionSuccess(false)
    setError(null)
  }

  // Keyboard navigation inside search dropdown
  const handleSearchKeyDown = (e) => {
    if (!searchOpen || searchResults.length === 0) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setSearchOpen(true)
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveSearchIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveSearchIndex(prev => (prev > 0 ? prev - 1 : searchResults.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeSearchIndex >= 0 && activeSearchIndex < searchResults.length) {
        handleSelectProject(searchResults[activeSearchIndex])
      }
    } else if (e.key === 'Escape') {
      setSearchOpen(false)
    }
  }

  const handleChangeProject = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
    setSearchOpen(true)
  }

  const handlePredict = async (e) => {
    if (e) e.preventDefault()
    setLoading(true)
    setError(null)
    setInterventionSuccess(false)

    try {
      // Send strictly the 13 prediction-time features using absolute values
      const payload = {
        district: formData.district,
        project_type: formData.project_type,
        total_acres: Math.abs(parseFloat(formData.total_acres) || 0),
        land_acquired_pct: Math.min(100, Math.abs(parseFloat(formData.land_acquired_pct) || 0)),
        approval_days_pending: Math.abs(parseInt(formData.approval_days_pending, 10) || 0),
        compensation_disbursed_pct: Math.min(100, Math.abs(parseFloat(formData.compensation_disbursed_pct) || 0)),
        legal_cases_count: Math.abs(parseInt(formData.legal_cases_count, 10) || 0),
        ownership_disputes: Math.abs(parseInt(formData.ownership_disputes, 10) || 0),
        rnp_progress_pct: Math.min(100, Math.abs(parseFloat(formData.rnp_progress_pct) || 0)),
        possession_pct: Math.min(100, Math.abs(parseFloat(formData.possession_pct) || 0)),
        affected_families: Math.abs(parseInt(formData.affected_families, 10) || 0),
        doc_deficiency_score: Math.abs(parseFloat(formData.doc_deficiency_score) || 0),
        historical_district_delay_avg: Math.abs(parseFloat(formData.historical_district_delay_avg) || 0),
        project_id: formData.project_id ? Math.abs(parseInt(formData.project_id, 10)) : undefined,
        project_name: formData.project_name || undefined
      }

      const res = await api.post('/predict', payload)
      setPrediction(res.data)
      setModelLoaded(true)

      // Initialize What-If slider with improved compensation
      setWhatifFeature('compensation_disbursed_pct')
      setWhatifValue(Math.min(100, Math.round(Math.abs(parseFloat(formData.compensation_disbursed_pct) || 0) + 35)))
      setWhatifResult(null)
    } catch (err) {
      const detail = err.response?.data?.detail
      if (detail === 'ML model artifacts not loaded.') {
        setModelLoaded(false)
      }
      setError(detail || err.message || 'Prediction request failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRunWhatIf = async () => {
    if (!prediction) return
    setWhatifLoading(true)
    try {
      const payload = {
        project: {
          district: formData.district,
          project_type: formData.project_type,
          total_acres: Math.abs(parseFloat(formData.total_acres) || 0),
          land_acquired_pct: Math.min(100, Math.abs(parseFloat(formData.land_acquired_pct) || 0)),
          approval_days_pending: Math.abs(parseInt(formData.approval_days_pending, 10) || 0),
          compensation_disbursed_pct: Math.min(100, Math.abs(parseFloat(formData.compensation_disbursed_pct) || 0)),
          legal_cases_count: Math.abs(parseInt(formData.legal_cases_count, 10) || 0),
          ownership_disputes: Math.abs(parseInt(formData.ownership_disputes, 10) || 0),
          rnp_progress_pct: Math.min(100, Math.abs(parseFloat(formData.rnp_progress_pct) || 0)),
          possession_pct: Math.min(100, Math.abs(parseFloat(formData.possession_pct) || 0)),
          affected_families: Math.abs(parseInt(formData.affected_families, 10) || 0),
          doc_deficiency_score: Math.abs(parseFloat(formData.doc_deficiency_score) || 0),
          historical_district_delay_avg: Math.abs(parseFloat(formData.historical_district_delay_avg) || 0),
          project_id: formData.project_id ? Math.abs(parseInt(formData.project_id, 10)) : undefined,
        },
        feature_to_change: whatifFeature,
        new_value: Math.abs(parseFloat(whatifValue) || 0)
      }

      const res = await api.post('/whatif', payload)
      setWhatifResult(res.data)
    } catch (err) {
      console.error('What-If calculation error:', err)
    } finally {
      setWhatifLoading(false)
    }
  }

  const handleLogIntervention = async (e) => {
    e.preventDefault()
    if (!interventionText) return

    setInterventionSubmitting(true)
    try {
      const projId = formData.project_id ? parseInt(formData.project_id, 10) : 101
      const res = await api.put('/projects/status', {
        project_id: projId,
        intervention_taken: interventionText,
        intervention_date: interventionDate
      })

      if (res.status === 200 || res.data) {
        setInterventionSuccess(true)
      }
    } catch (err) {
      console.error('Intervention log failed:', err)
    } finally {
      setInterventionSubmitting(false)
    }
  }



  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow-xs">
                <Sparkles size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Early-Warning Delay Prediction
                </h1>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {/* 3-State ML Model Health Indicator */}
            {modelLoaded === null && (
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-500 shadow-xs">
                <RefreshCw size={13} className="animate-spin text-blue-600" />
                <span>Checking ML service...</span>
              </div>
            )}
            {modelLoaded === true && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-emerald-700 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>ML Model Operational</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3.5 py-2">
              <ShieldAlert size={16} className="text-blue-600" />
              <span className="text-xs font-bold text-blue-900">
                Active Persona: {roleInfo.officerName} ({currentRole})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Red Warning Banner: Displayed ONLY when modelLoaded === false */}
      {modelLoaded === false && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-sm font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-600 shrink-0" />
            <span>⚠️ ML model artifacts not loaded.</span>
          </div>
          <button
            type="button"
            onClick={checkMLHealth}
            className="text-xs font-bold text-red-700 hover:text-red-900 underline self-start sm:self-auto cursor-pointer"
          >
            Retry Health Check
          </button>
        </div>
      )}

      {/* Preset Buttons */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
          <Layers size={14} className="text-blue-600" />
          Quick-Load Evaluator Test Scenarios
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {Object.entries(SAMPLE_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              type="button"
              onClick={() => loadPreset(key)}
              className={`text-left p-3 rounded-lg border transition-all text-xs font-medium flex flex-col justify-between group cursor-pointer ${
                activePresetKey === key
                  ? 'border-blue-500 bg-blue-50/70 shadow-xs ring-1 ring-blue-400/30'
                  : 'border-gray-200 bg-gray-50 hover:bg-blue-50/40 hover:border-blue-300'
              }`}
            >
              <span className="font-semibold text-gray-900 group-hover:text-blue-700">
                {preset.name.split(' (')[0]}
              </span>
              <span className="text-[11px] text-gray-500 mt-1">
                {preset.name.includes('(') ? preset.name.split(' (')[1].replace(')', '') : ''}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Existing Project Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs relative" ref={searchContainerRef}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-blue-600" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Search Existing Project
            </h2>
          </div>
          <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
            Search by Project ID, District or Project Type
          </span>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value)
                setSearchOpen(true)
                setActiveSearchIndex(-1)
              }}
              onFocus={() => {
                if (searchQuery.trim().length > 0 || searchResults.length > 0) {
                  setSearchOpen(true)
                }
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="🔍 Search by Project ID, District or Project Type... (e.g. PRJ-2026-184, Pune, Highway)"
              className="w-full pl-10 pr-28 py-2.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-300 focus:border-blue-500 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
              {searchLoading && (
                <RefreshCw size={15} className="animate-spin text-blue-600" />
              )}
              {searchQuery && !searchLoading && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setSearchResults([])
                    setSearchOpen(false)
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors"
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
              <span className="text-[11px] text-gray-400 border-l border-gray-200 pl-2 font-mono">
                5,000 DB Records
              </span>
            </div>
          </div>

          {/* Dynamic Search Dropdown Panel */}
          {searchOpen && (searchQuery.trim().length > 0 || searchResults.length > 0 || searchLoading) && (
            <div className="absolute z-30 left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-fadeIn max-h-80 overflow-y-auto">
              {searchLoading ? (
                <div className="p-6 text-center text-gray-500 text-xs flex items-center justify-center gap-2">
                  <RefreshCw size={16} className="animate-spin text-blue-600" />
                  <span>Searching project registry...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  <div className="px-4 py-2 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider flex justify-between items-center">
                    <span>Matching Projects ({searchResults.length})</span>
                    <span className="text-[10px] lowercase font-normal text-gray-400">Click to auto-fill form parameters</span>
                  </div>
                  {searchResults.map((proj, idx) => {
                    const isSelected = activeSearchIndex === idx
                    return (
                      <div
                        key={proj.project_id}
                        onClick={() => handleSelectProject(proj)}
                        onMouseEnter={() => setActiveSearchIndex(idx)}
                        className={`p-3.5 cursor-pointer transition-colors flex items-center justify-between gap-4 ${
                          isSelected ? 'bg-blue-50/80 border-l-4 border-l-blue-600' : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {proj.formatted_id}
                            </span>
                            <h4 className="text-sm font-semibold text-gray-900 truncate">
                              {proj.project_name}
                            </h4>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span className="font-medium text-gray-700">{proj.district} • {proj.project_type}</span>
                            <span>•</span>
                            <span>{proj.total_acres} Acres</span>
                            <span>•</span>
                            <span>{proj.land_acquired_pct}% Acquired</span>
                            <span>•</span>
                            <span>{proj.compensation_disbursed_pct}% Disbursed</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-semibold text-blue-600 bg-blue-50/80 hover:bg-blue-100 px-2.5 py-1 rounded-md border border-blue-200 transition-colors">
                            Select Project
                          </span>
                          <ArrowRight size={15} className={`text-gray-400 ${isSelected ? 'text-blue-600 translate-x-0.5' : ''} transition-all`} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500 space-y-1">
                  <p className="text-xs font-semibold text-gray-700">No projects found matching "{searchQuery}"</p>
                  <p className="text-[11px] text-gray-400">
                    Try searching by ID (e.g. "PRJ-2026-184", "184"), District ("Pune", "Nagpur", "Nashik"), or Sector ("Highway", "Metro").
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Component 10: Custom Project Intelligence Card */}
        {selectedProjectMeta && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <ProjectIntelligenceCard
              projectMeta={selectedProjectMeta}
              formData={formData}
              onChangeProject={handleChangeProject}
            />
          </div>
        )}
      </div>

      {/* Parameter Input Form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50/70 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Current Project State Parameters (13 Features)</h2>
            <p className="text-xs text-gray-500">Provide verifiable milestones known today. Outcome columns are strictly quarantined.</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-white border border-gray-200 rounded-md text-gray-600">
            No Future Leakage
          </span>
        </div>

        <form onSubmit={handlePredict} className="p-6 space-y-6">
          {/* Categorical & Scale Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">District</label>
              <select
                value={formData.district}
                onChange={e => handleInputChange('district', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
              >
                {['Pune', 'Mumbai', 'Nagpur', 'Nashik', 'Aurangabad'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Project Sector Type</label>
              <select
                value={formData.project_type}
                onChange={e => handleInputChange('project_type', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
              >
                {['Highway', 'Railway', 'Metro', 'Irrigation'].map(pt => (
                  <option key={pt} value={pt}>{pt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Total Land Area (Acres)</label>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={formData.total_acres}
                onChange={e => handleInputChange('total_acres', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                placeholder="250"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Affected Families (Count)</label>
              <input
                type="number"
                min="0"
                required
                value={formData.affected_families}
                onChange={e => handleInputChange('affected_families', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                placeholder="180"
              />
            </div>
          </div>

          {/* Lifecycle Milestone Progress Percentages */}
          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
              Lifecycle Progress Milestones (%)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>Land Acquired</span>
                  <span className="font-bold text-blue-600">{formData.land_acquired_pct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.land_acquired_pct}
                  onChange={e => handleInputChange('land_acquired_pct', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>Compensation Disbursed</span>
                  <span className="font-bold text-blue-600">{formData.compensation_disbursed_pct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.compensation_disbursed_pct}
                  onChange={e => handleInputChange('compensation_disbursed_pct', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>R&R Progress</span>
                  <span className="font-bold text-blue-600">{formData.rnp_progress_pct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.rnp_progress_pct}
                  onChange={e => handleInputChange('rnp_progress_pct', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>Physical Possession</span>
                  <span className="font-bold text-blue-600">{formData.possession_pct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.possession_pct}
                  onChange={e => handleInputChange('possession_pct', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Friction & Dispute Indicators */}
          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
              Dispute, Statutory & Delay Vectors
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Approval Days Pending</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.approval_days_pending}
                  onChange={e => handleInputChange('approval_days_pending', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  placeholder="96"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Legal Cases Count</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.legal_cases_count}
                  onChange={e => handleInputChange('legal_cases_count', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  placeholder="8"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Ownership Disputes</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.ownership_disputes}
                  onChange={e => handleInputChange('ownership_disputes', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  placeholder="5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Doc Deficiency Score (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  required
                  value={formData.doc_deficiency_score}
                  onChange={e => handleInputChange('doc_deficiency_score', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  placeholder="35"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">District Delay Avg (Days)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  value={formData.historical_district_delay_avg}
                  onChange={e => handleInputChange('historical_district_delay_avg', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  placeholder="18"
                />
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="border-t border-gray-100 pt-5 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Project Name: <strong>{formData.project_name || 'Manual Project Assessment'}</strong>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-xs transition-colors disabled:opacity-50 text-sm cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Running XGBoost Model & SHAP Explainer...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Analyze Project Risk
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* General Prediction Error (do not duplicate if already showing model warning) */}
      {error && (error !== 'ML model artifacts not loaded.' || modelLoaded !== false) && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Results Dashboard - Structured Prediction Pipeline: Prediction -> Risk -> Why -> What can change -> Administrative response */}
      {prediction && (
        <div className="space-y-8 animate-fadeIn">
          {/* Stage 0: Early Warning Telemetry Card (Component 8) */}
          <EarlyWarningTelemetryCard
            prediction={prediction}
            formData={formData}
            onScrollToIntervention={() => interventionRef.current?.scrollIntoView({ behavior: 'smooth' })}
          />

          {/* Stage 1: Delay Probability & Multi-Modal Risk Continuum (Component 1 & 2) */}
          <DelayProbabilityCard prediction={prediction} />

          {/* Stage 2: Ranked Risk Drivers Contribution Bars (Component 3 - Why) */}
          <RiskDriversPanel
            topRiskDrivers={prediction.top_risk_drivers || []}
            formData={formData}
          />

          {/* Stage 3: Bilateral SHAP Explainability Matrix (Component 4 - Why) */}
          <SHAPExplainabilityMatrix
            topRiskDrivers={prediction.top_risk_drivers || []}
            protectiveFactors={prediction.protective_factors || []}
            formData={formData}
          />

          {/* Stage 4: Acquisition Lifecycle Risk Progression (Component 5 - What can change) */}
          <StatutoryLifecycleTimeline
            stageRisks={prediction.stage_risks_list || prediction.stage_risks || []}
          />

          {/* Stage 5: Intervention Impact Simulator (Component 7 - What can change) */}
          <div ref={interventionRef}>
            <InterventionSimulatorPanel
              selectedFeature={whatifFeature}
              onFeatureChange={(feat) => {
                setWhatifFeature(feat)
                if (feat === 'compensation_disbursed_pct') setWhatifValue(85)
                else if (feat === 'legal_cases_count') setWhatifValue(1)
                else if (feat === 'approval_days_pending') setWhatifValue(30)
                else if (feat === 'possession_pct') setWhatifValue(80)
                else if (feat === 'doc_deficiency_score') setWhatifValue(10)
              }}
              sliderValue={whatifValue}
              onSliderChange={setWhatifValue}
              onRunSimulation={handleRunWhatIf}
              loading={whatifLoading}
              whatifResult={whatifResult}
              baselineData={formData}
            />
          </div>

          {/* Stage 6: Statutory Administrative Directives Panel (Component 6 - Administrative Response) */}
          <AdministrativeDirectivesPanel
            recommendations={prediction.recommendations || []}
            dominantBottleneck={prediction.dominant_bottleneck}
          />

          {/* 6. Intervention Logging */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FileCheck size={18} className="text-emerald-600" />
                Log Administrative Intervention (Outcome & Learning Dataset)
              </h3>
              <p className="text-xs text-gray-500">
                Records interventions to audit logs and feedback datasets for controlled model retraining.
              </p>
            </div>

            <form onSubmit={handleLogIntervention} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-2">
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Administrative Action Taken</label>
                <select
                  value={interventionText}
                  onChange={e => setInterventionText(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select official intervention...</option>
                  <option value="Direct DBT Compensation Release Batch Sanctioned">Direct DBT Compensation Release Batch Sanctioned</option>
                  <option value="Special Land Lok Adalat / Joint Revenue Hearing Scheduled">Special Land Lok Adalat / Joint Revenue Hearing Scheduled</option>
                  <option value="Single-Window Clearance High-Level Escalation Filed">Single-Window Clearance High-Level Escalation Filed</option>
                  <option value="Village Revenue Talathi Survey & Record Rectification Drive">Village Revenue Talathi Survey & Record Rectification Drive</option>
                  <option value="Joint Revenue-Police Demarcation Drive Conducted">Joint Revenue-Police Demarcation Drive Conducted</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Intervention Date</label>
                <input
                  type="date"
                  required
                  value={interventionDate}
                  onChange={e => setInterventionDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={interventionSubmitting || !interventionText}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {interventionSubmitting ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                  Record Administrative Action
                </button>
              </div>
            </form>

            {interventionSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                Intervention recorded in the audit database. Outcome will be tracked for feedback-driven retraining.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
