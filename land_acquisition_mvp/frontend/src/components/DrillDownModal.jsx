import React, { useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import RiskCategoryBadge from './intelligence/RiskCategoryBadge'
import {
  X,
  AlertTriangle,
  FileCheck2,
  SlidersHorizontal,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Scale,
  Landmark,
  ShieldAlert,
  RefreshCw
} from 'lucide-react'

// Feature ranges for the What-If simulation
const WHATIF_FEATURES = [
  { key: 'compensation_disbursed_pct', label: 'Compensation DBT %', min: 10, max: 100, step: 1, unit: '%' },
  { key: 'legal_cases_count', label: 'High Court / Civil Cases', min: 0, max: 15, step: 1, unit: ' cases' },
  { key: 'ownership_disputes', label: 'Title Disputes', min: 0, max: 15, step: 1, unit: ' disputes' },
  { key: 'approval_days_pending', label: 'Clearance Days Pending', min: 0, max: 150, step: 5, unit: ' days' },
  { key: 'rnp_progress_pct', label: 'R&R Progress %', min: 10, max: 100, step: 1, unit: '%' },
  { key: 'possession_pct', label: 'Physical Possession %', min: 10, max: 100, step: 1, unit: '%' },
  { key: 'doc_deficiency_score', label: 'Document Deficiency %', min: 0, max: 100, step: 5, unit: '%' },
]

const STATUTORY_STAGE_META = {
  'Approval Stage': { section: 'RFCTLARR Sec 19', label: 'Statutory Declaration & Approvals' },
  'Compensation Stage': { section: 'RFCTLARR Sec 26-30', label: 'Market Valuation & Direct DBT' },
  'Legal Stage': { section: 'RFCTLARR Sec 64', label: 'Dispute Settlement & Lok Adalat' },
  'Possession Stage': { section: 'RFCTLARR Sec 38', label: 'Demarcation & Physical Possession' },
}

export default function DrillDownModal({ project, onClose, onOpenIntervention }) {
  // ── State ─────────────────────────────────────────────────
  const [prediction, setPrediction] = useState(null)
  const [predLoading, setPredLoading] = useState(true)
  const [predError, setPredError] = useState(null)

  const [selectedFeature, setSelectedFeature] = useState(WHATIF_FEATURES[0].key)
  const [sliderValue, setSliderValue] = useState(project[WHATIF_FEATURES[0].key] || 50)
  const [whatifResult, setWhatifResult] = useState(null)
  const [whatifLoading, setWhatifLoading] = useState(false)

  const formattedId = project.formatted_id || `PRJ-2026-${String(project.project_id || 101).padStart(4, '0')}`

  // ── Fetch ML Prediction & SHAP on Mount ────────────────────
  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        setPredLoading(true)
        const body = {
          project_id: project.project_id ? Math.abs(Number(project.project_id)) : undefined,
          district: project.district || 'Pune',
          project_type: project.project_type || 'Highway',
          total_acres: Math.abs(parseFloat(project.total_acres) || 250),
          land_acquired_pct: Math.min(100, Math.abs(parseFloat(project.land_acquired_pct) || 50)),
          approval_days_pending: Math.abs(parseInt(project.approval_days_pending, 10) || 30),
          compensation_disbursed_pct: Math.min(100, Math.abs(parseFloat(project.compensation_disbursed_pct) || 40)),
          legal_cases_count: Math.abs(parseInt(project.legal_cases_count, 10) || 0),
          ownership_disputes: Math.abs(parseInt(project.ownership_disputes, 10) || 0),
          rnp_progress_pct: Math.min(100, Math.abs(parseFloat(project.rnp_progress_pct) || 50)),
          possession_pct: Math.min(100, Math.abs(parseFloat(project.possession_pct) || 30)),
          affected_families: Math.abs(parseInt(project.affected_families, 10) || 100),
          doc_deficiency_score: Math.abs(parseFloat(project.doc_deficiency_score) || 20),
          historical_district_delay_avg: Math.abs(parseFloat(project.historical_district_delay_avg) || 15),
        }

        const resp = await api.post('/predict', body)
        setPrediction(resp.data)
        setPredError(null)

        // Initialize slider with current project value
        const initialVal = project[selectedFeature] !== undefined ? project[selectedFeature] : 50
        setSliderValue(initialVal)
      } catch (err) {
        console.error('Project drill-down prediction failed:', err)
        setPredError(err.response?.data?.detail || err.message)
      } finally {
        setPredLoading(false)
      }
    }

    fetchPrediction()
  }, [project])

  // ── Handle Feature Select Change ──────────────────────────
  const handleFeatureChange = (featureKey) => {
    setSelectedFeature(featureKey)
    const baseVal = project[featureKey] !== undefined ? project[featureKey] : 50
    setSliderValue(baseVal)
    setWhatifResult(null)
  }

  // ── Call What-If API ──────────────────────────────────────
  const callWhatIf = useCallback(async (value) => {
    try {
      setWhatifLoading(true)
      const body = {
        project: {
          project_id: project.project_id ? Math.abs(Number(project.project_id)) : undefined,
          district: project.district || 'Pune',
          project_type: project.project_type || 'Highway',
          total_acres: Math.abs(parseFloat(project.total_acres) || 250),
          land_acquired_pct: Math.min(100, Math.abs(parseFloat(project.land_acquired_pct) || 50)),
          approval_days_pending: Math.abs(parseInt(project.approval_days_pending, 10) || 30),
          compensation_disbursed_pct: Math.min(100, Math.abs(parseFloat(project.compensation_disbursed_pct) || 40)),
          legal_cases_count: Math.abs(parseInt(project.legal_cases_count, 10) || 0),
          ownership_disputes: Math.abs(parseInt(project.ownership_disputes, 10) || 0),
          rnp_progress_pct: Math.min(100, Math.abs(parseFloat(project.rnp_progress_pct) || 50)),
          possession_pct: Math.min(100, Math.abs(parseFloat(project.possession_pct) || 30)),
          affected_families: Math.abs(parseInt(project.affected_families, 10) || 100),
          doc_deficiency_score: Math.abs(parseFloat(project.doc_deficiency_score) || 20),
          historical_district_delay_avg: Math.abs(parseFloat(project.historical_district_delay_avg) || 15),
        },
        feature_to_change: selectedFeature,
        new_value: Math.abs(parseFloat(value) || 0),
      }

      const resp = await api.post('/whatif', body)
      setWhatifResult(resp.data)
    } catch (err) {
      console.error('What-If simulation failed:', err)
    } finally {
      setWhatifLoading(false)
    }
  }, [project, selectedFeature])

  // Debounced slider change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (sliderValue !== project[selectedFeature]) {
        callWhatIf(sliderValue)
      }
    }, 280)
    return () => clearTimeout(timer)
  }, [sliderValue, selectedFeature, project, callWhatIf])

  const currentFeature = WHATIF_FEATURES.find(f => f.key === selectedFeature) || WHATIF_FEATURES[0]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[92vh] rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* 1. Institutional Dossier Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs font-black text-slate-900 bg-slate-200 border border-slate-300 px-2.5 py-0.5 rounded">
                {formattedId}
              </span>
              <h2 className="text-base font-black text-slate-900">
                {project.project_name || `Project #${project.project_id}`}
              </h2>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                DoLR Statutory Registry
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              {project.district} Revenue District • {project.project_type} Sector • {project.total_acres || 250} Total Acres
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Close dossier"
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. Scrollable Analytical Dossier Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {predLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
              <RefreshCw size={28} className="animate-spin text-blue-600" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">Generating Diagnostic Intelligence Dossier...</p>
                <p className="text-xs text-slate-500 font-mono">Running XGBoost Multi-Class Inferencing & SHAP Attribution Matrix</p>
              </div>
            </div>
          ) : predError ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-red-900">
                <AlertTriangle size={16} />
                <span>Diagnostic Engine Error</span>
              </div>
              <p>{predError}</p>
            </div>
          ) : prediction ? (
            <>
              {/* PRIMARY DECISION BANNER: "Why is this project at risk?" */}
              <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Primary User Decision
                    </span>
                    <h3 className="text-sm font-bold text-white">Why is this project at risk?</h3>
                  </div>

                  <RiskCategoryBadge
                    score={prediction.risk_score}
                    variant="default"
                    showMeaning={false}
                  />
                </div>

                {/* Continuum Progress Scale with 50% Threshold */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="text-slate-300 font-mono">
                      Calibrated Delay Probability: <strong className="text-white text-base">{prediction.risk_score.toFixed(1)}%</strong>
                    </span>
                    <span className="text-[11px] font-mono text-amber-400 font-bold">
                      Statutory Threshold: 50.0%
                    </span>
                  </div>

                  {/* Dual Scale Bar */}
                  <div className="relative w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        prediction.risk_score >= 75 ? 'bg-red-500' :
                        prediction.risk_score >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, prediction.risk_score))}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-0.5">
                    <span>0% (Nominal)</span>
                    <span className="text-slate-400">25% (Moderate)</span>
                    <span className="text-amber-400">50% (Intervention Mandated)</span>
                    <span className="text-red-400">75% (Critical Default)</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Dominant Bottleneck Line */}
                {prediction.dominant_bottleneck && (
                  <div className="p-2.5 rounded-lg bg-slate-800/90 border border-slate-700 text-xs text-slate-200 flex items-center gap-2">
                    <ShieldAlert size={15} className="text-amber-400 shrink-0" />
                    <span>
                      Primary Diagnostic Impediment: <strong className="text-white">{prediction.dominant_bottleneck}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* 3. Stage-Wise Statutory Progression */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Landmark size={16} className="text-slate-700" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Statutory Lifecycle Progression & Risk
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    RFCTLARR Act 2013 Milestone Health
                  </span>
                </div>

                <div className="space-y-2.5 pt-1">
                  {(prediction.stage_risks_list || prediction.stage_risks || []).map((stage) => {
                    const meta = STATUTORY_STAGE_META[stage.stage] || { section: 'RFCTLARR', label: stage.stage }
                    const score = stage.risk || stage.risk_score || 0
                    const isHigh = score >= 50

                    return (
                      <div key={stage.stage} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold bg-white border border-slate-300 px-1.5 py-0.5 rounded text-slate-700">
                              {meta.section}
                            </span>
                            <span className="font-semibold text-slate-900">{meta.label}</span>
                          </div>
                          <span className={`font-mono font-bold ${isHigh ? 'text-red-700' : 'text-slate-700'}`}>
                            {score.toFixed(1)}% Risk
                          </span>
                        </div>

                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              score >= 75 ? 'bg-red-600' : score >= 50 ? 'bg-amber-500' : 'bg-emerald-600'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 4. SHAP Delay Attribution Drivers ("Why") */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Scale size={16} className="text-blue-700" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      SHAP Explainability Attribution (Top Delay Drivers)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Bilateral Log-Odds Contribution
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {(prediction.top_drivers || prediction.top_risk_drivers || []).slice(0, 4).map((d, i) => {
                    const isIncrease = d.direction === 'increases risk' || (d.shap_value || 0) > 0
                    return (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                          isIncrease ? 'bg-red-50/40 border-red-200' : 'bg-emerald-50/40 border-emerald-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">{d.feature}</span>
                          <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                            isIncrease ? 'bg-red-100 text-red-900' : 'bg-emerald-100 text-emerald-900'
                          }`}>
                            {isIncrease ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                            <span>{d.direction || (isIncrease ? 'increases risk' : 'reduces risk')}</span>
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
                          <span>Impact Weight:</span>
                          <strong>{d.shap_value ? (d.shap_value > 0 ? `+${d.shap_value.toFixed(3)}` : d.shap_value.toFixed(3)) : '+0.210'}</strong>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 5. What-If Administrative Impact Simulator ("What can change") */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-blue-700" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      What-If Administrative Sensitivity Simulation
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Counterfactual Risk Recalculation
                  </span>
                </div>

                {/* Parameter Selection Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {WHATIF_FEATURES.map((feat) => (
                    <button
                      key={feat.key}
                      type="button"
                      onClick={() => handleFeatureChange(feat.key)}
                      className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                        selectedFeature === feat.key
                          ? 'bg-blue-700 text-white font-bold border-blue-700 shadow-xs'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      {feat.label}
                    </button>
                  ))}
                </div>

                {/* Slider Control */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800">
                      Simulate Adjusted Value for: <strong>{currentFeature.label}</strong>
                    </span>
                    <span className="font-mono font-black text-blue-700 text-sm bg-white border border-slate-300 px-2 py-0.5 rounded shadow-2xs">
                      {sliderValue}{currentFeature.unit}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={currentFeature.min}
                    max={currentFeature.max}
                    step={currentFeature.step}
                    value={sliderValue}
                    onChange={(e) => setSliderValue(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />

                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>Min: {currentFeature.min}{currentFeature.unit}</span>
                    <span>Current Baseline: {project[selectedFeature] || 'N/A'}{currentFeature.unit}</span>
                    <span>Max: {currentFeature.max}{currentFeature.unit}</span>
                  </div>
                </div>

                {/* Simulated Outcome Delta Comparison */}
                {whatifLoading ? (
                  <div className="p-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                    <RefreshCw size={14} className="animate-spin text-blue-600" />
                    <span>Recalculating multi-class delay probability...</span>
                  </div>
                ) : whatifResult ? (
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 grid grid-cols-3 gap-3 text-center">
                    <div>
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500">Baseline Risk</span>
                      <span className="font-mono text-lg font-bold text-slate-900">{whatifResult.original_risk.toFixed(1)}%</span>
                    </div>

                    <div>
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500">Simulated Risk</span>
                      <span className="font-mono text-lg font-black text-blue-700">{whatifResult.new_risk.toFixed(1)}%</span>
                    </div>

                    <div>
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500">Projected Delta</span>
                      <span className={`font-mono text-lg font-black flex items-center justify-center gap-1 ${
                        whatifResult.reduction > 0 ? 'text-emerald-700' : 'text-red-700'
                      }`}>
                        {whatifResult.reduction > 0 ? <TrendingDown size={18} /> : <TrendingUp size={18} />}
                        <span>{Math.abs(whatifResult.reduction).toFixed(1)}%</span>
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* 6. Administrative Recommendation Band */}
              {prediction.recommendation && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <FileCheck2 size={14} />
                    <span>Mandated Administrative Direction:</span>
                  </div>
                  <p className="leading-relaxed font-medium">
                    {prediction.recommendation}
                  </p>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* 3. Action Footer with Intervene Handoff */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          >
            Close Dossier
          </button>

          {onOpenIntervention && (
            <button
              type="button"
              onClick={() => onOpenIntervention(project)}
              className="text-xs font-bold px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Trigger Administrative Directive</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

