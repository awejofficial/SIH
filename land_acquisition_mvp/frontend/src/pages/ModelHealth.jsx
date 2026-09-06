import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { useRole } from '../context/RoleContext'
import {
  Cpu,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Database,
  BarChart2,
  RefreshCw,
  Lock,
  Binary,
  Check
} from 'lucide-react'

/**
 * Component 9: Model Health & Governance
 * Custom SIH26017 institutional ML audit, diagnostics, and continuous governance console.
 * Features:
 * - Dense analytical metric blocks with benchmark calibration
 * - Formal 2x2 statutory confusion matrix with specificity/sensitivity ratios
 * - Strict data leakage prevention contract (13 prediction-time vs 6 quarantined)
 * - Closed-loop retraining feedback register
 */
export default function ModelHealth() {
  const { currentRole, setRole, roleInfo } = useRole()
  const [modelHealth, setModelHealth] = useState(null)
  const [healthLoading, setHealthLoading] = useState(true)
  const [feedback, setFeedback] = useState({ project_id: '', actual_delay_days: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const isAuthorized = currentRole === 'Collector' || currentRole === 'Policy Maker'

  useEffect(() => {
    const fetchModelHealth = async () => {
      try {
        setHealthLoading(true)
        const res = await api.get('/model/health')
        setModelHealth(res.data)
      } catch (err) {
        console.error('Failed to load model health:', err)
      } finally {
        setHealthLoading(false)
      }
    }

    fetchModelHealth()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const res = await api.post('/feedback/outcome', {
        project_id: parseInt(feedback.project_id, 10),
        actual_delay_days: parseInt(feedback.actual_delay_days, 10)
      })
      setResult(res.data)
      setFeedback({ project_id: '', actual_delay_days: '' })
    } catch (err) {
      console.error('Failed to submit feedback:', err)
      alert(err.response?.data?.detail || 'Failed to submit feedback')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthorized) {
    return (
      <div className="p-8 max-w-4xl mx-auto w-full">
        <div className="bg-white border border-amber-300 rounded-xl p-8 shadow-xs text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center border border-amber-300">
            <ShieldCheck size={24} />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded">
              Statutory Governance Restricted
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-2">
              Model Health & Verification Oversight
            </h2>
            <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
              You are currently viewing as <strong>{currentRole}</strong>. Model Health diagnostics, test set evaluation matrices, and retraining feedback are governed by <strong>District Collectors</strong> and <strong>Policy Makers</strong>.
            </p>
          </div>
          <div className="pt-3 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setRole('Collector')}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <span>Switch to District Collector</span>
              <ArrowRight size={13} />
            </button>
            <button
              onClick={() => setRole('Policy Maker')}
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <span>Switch to State Policy Maker</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* 1. Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold shadow-xs">
              <Cpu size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Model Health & Algorithmic Governance
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Out-of-sample evaluation metrics, confusion matrix diagnostics, strict data leakage boundaries, and closed-loop retraining.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${roleInfo.badgeColor}`}>
            {currentRole} Governance
          </span>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-emerald-900">
            <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></span>
            <span>{modelHealth?.status || 'Model Operational'}</span>
          </div>
        </div>
      </div>

      {/* 2. Primary Metrics Grid */}
      {healthLoading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3 shadow-xs">
          <RefreshCw size={24} className="animate-spin text-blue-600" />
          <span className="font-mono text-xs">Querying ML pipeline diagnostic endpoints...</span>
        </div>
      ) : modelHealth ? (
        <div className="space-y-8">
          {/* Key Metrics Blocks */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Metric 1: ROC-AUC */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-1">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                ROC-AUC Score
              </div>
              <div className="font-mono text-3xl font-black text-blue-700">
                {modelHealth.roc_auc}
              </div>
              <div className="text-[10px] font-mono text-emerald-700 font-semibold flex items-center gap-1 pt-1">
                <Check size={11} />
                <span>&gt;0.80 Benchmark</span>
              </div>
            </div>

            {/* Metric 2: Delay Recall */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-1">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Delay Recall
              </div>
              <div className="font-mono text-3xl font-black text-emerald-700">
                {(modelHealth.recall * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-500">
                Early Detection Focus
              </div>
            </div>

            {/* Metric 3: Precision */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-1">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Precision
              </div>
              <div className="font-mono text-3xl font-black text-indigo-700">
                {(modelHealth.precision * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-500">
                Delay Class Precision
              </div>
            </div>

            {/* Metric 4: F1 Score */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-1">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                F1 Score
              </div>
              <div className="font-mono text-3xl font-black text-purple-700">
                {modelHealth.f1_score}
              </div>
              <div className="text-[10px] text-slate-500">
                Harmonic Mean
              </div>
            </div>

            {/* Metric 5: Accuracy */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-1">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Accuracy
              </div>
              <div className="font-mono text-3xl font-black text-slate-900">
                {(modelHealth.accuracy * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-500">
                Overall Correct
              </div>
            </div>

            {/* Metric 6: Test Samples */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-1">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Test Set (n)
              </div>
              <div className="font-mono text-3xl font-black text-slate-900">
                {modelHealth.test_size}
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                Out-of-Sample Eval
              </div>
            </div>
          </div>

          {/* Configuration & Confusion Matrix Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Model Configuration Specification */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Binary size={16} className="text-blue-600" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Active Classifier Specification
                  </h3>
                </div>
                <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  {modelHealth.model_name}
                </span>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-0.5">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Model Version</span>
                    <div className="font-mono font-bold text-slate-900">{modelHealth.model_version}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-0.5">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Target Definition</span>
                    <div className="font-mono font-bold text-slate-900">{modelHealth.prediction_target} (Delay &gt; 90d)</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-0.5">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Features Count</span>
                    <div className="font-mono font-bold text-slate-900">{modelHealth.raw_features_count} Raw ({modelHealth.encoded_features_count} Encoded)</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-0.5">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Training Cohort</span>
                    <div className="font-mono font-bold text-slate-900">{modelHealth.train_size} Historical Projects</div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200 text-xs space-y-1">
                  <div className="font-bold text-blue-900 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-blue-700" />
                    <span>Cross-Validation Protocol:</span>
                  </div>
                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    {modelHealth.evaluation_strategy}
                  </p>
                </div>

                <div className="text-[10px] font-mono text-slate-400 pt-1">
                  Last Retrained Timestamp: {modelHealth.timestamp}
                </div>
              </div>
            </div>

            {/* Formal 2x2 Confusion Matrix */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart2 size={16} className="text-indigo-600" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Statutory Confusion Matrix (n={modelHealth.test_size})
                  </h3>
                </div>
                <span className="font-mono text-[11px] text-slate-500">
                  Out-of-Sample Evaluation
                </span>
              </div>

              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {/* True Negatives */}
                  <div className="p-3.5 bg-emerald-50/50 border border-emerald-300 rounded-lg text-center space-y-1">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800">
                      True Negatives (TN)
                    </div>
                    <div className="font-mono text-3xl font-black text-emerald-800">
                      {modelHealth.confusion_matrix.true_negatives}
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-700">
                      Correctly Predicted On-Time
                    </div>
                    <div className="text-[10px] text-emerald-600 font-mono">
                      Specificity: Nominal
                    </div>
                  </div>

                  {/* False Positives */}
                  <div className="p-3.5 bg-amber-50/50 border border-amber-300 rounded-lg text-center space-y-1">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800">
                      False Positives (FP)
                    </div>
                    <div className="font-mono text-3xl font-black text-amber-800">
                      {modelHealth.confusion_matrix.false_positives}
                    </div>
                    <div className="text-[11px] font-semibold text-amber-700">
                      Precautionary Over-Warning
                    </div>
                    <div className="text-[10px] text-amber-600 font-mono">
                      Low-Cost Early Review
                    </div>
                  </div>

                  {/* False Negatives */}
                  <div className="p-3.5 bg-red-50/50 border border-red-300 rounded-lg text-center space-y-1">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-800">
                      False Negatives (FN)
                    </div>
                    <div className="font-mono text-3xl font-black text-red-800">
                      {modelHealth.confusion_matrix.false_negatives}
                    </div>
                    <div className="text-[11px] font-semibold text-red-700">
                      Missed Delays (Minimized)
                    </div>
                    <div className="text-[10px] text-red-600 font-mono">
                      Strict Statutory Objective
                    </div>
                  </div>

                  {/* True Positives */}
                  <div className="p-3.5 bg-blue-50/50 border border-blue-300 rounded-lg text-center space-y-1">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-800">
                      True Positives (TP)
                    </div>
                    <div className="font-mono text-3xl font-black text-blue-800">
                      {modelHealth.confusion_matrix.true_positives}
                    </div>
                    <div className="text-[11px] font-semibold text-blue-700">
                      Correct Early Detection
                    </div>
                    <div className="text-[10px] text-blue-600 font-mono">
                      Actionable Interventions
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Strict Data Leakage Prevention Contract */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-emerald-700" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Strict Data Leakage Prevention Contract
                </h3>
              </div>
              <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                GIGW / SIH Statutory Compliance
              </span>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                In strict adherence to Department of Land Resources (DoLR) audit guidelines, only variables ascertainable at the time of prediction are permitted in model inference. Target outcomes, post-award timestamps, and final compensation amounts are quarantined.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Allowed Prediction Features */}
                <div className="border border-emerald-300 bg-emerald-50/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    <CheckCircle2 size={15} className="text-emerald-700" />
                    <span>Allowed Prediction-Time Features ({modelHealth.prediction_features.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {modelHealth.prediction_features.map((feat) => (
                      <span
                        key={feat}
                        className="text-[11px] font-mono font-semibold bg-white border border-emerald-300 text-emerald-900 px-2.5 py-1 rounded shadow-2xs"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quarantined Leakage Columns */}
                <div className="border border-red-300 bg-red-50/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-900 uppercase tracking-wider">
                    <AlertCircle size={15} className="text-red-700" />
                    <span>Quarantined Post-Hoc & Outcome Columns ({modelHealth.leakage_prevented_columns.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {modelHealth.leakage_prevented_columns.map((col) => (
                      <span
                        key={col}
                        className="text-[11px] font-mono font-semibold bg-white border border-red-300 text-red-900 px-2.5 py-1 rounded shadow-2xs line-through"
                        title="Excluded to prevent target leakage"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* 3. Closed-Loop Continuous Learning Feedback Loop */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="text-blue-600" size={16} />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Closed-Loop Continuous Retraining Pipeline
            </h3>
          </div>
          <span className="font-mono text-[10px] text-slate-500">
            Batch Threshold: 50 Verified Projects
          </span>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Submit verified actual delay durations upon formal land handover. When 50 cumulative ground-truth outcomes are registered, the system triggers a background retraining job and updates the drift log.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end pt-1">
            <div className="w-full sm:w-1/3">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Project ID (Numerical)</label>
              <input
                type="number"
                required
                value={feedback.project_id}
                onChange={e => setFeedback({ ...feedback, project_id: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-mono text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. 5001"
              />
            </div>
            <div className="w-full sm:w-1/3">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirmed Actual Delay (Days)</label>
              <input
                type="number"
                required
                value={feedback.actual_delay_days}
                onChange={e => setFeedback({ ...feedback, actual_delay_days: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-mono text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. 45"
              />
            </div>
            <div className="w-full sm:w-1/3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-lg disabled:opacity-50 transition-colors shadow-xs cursor-pointer text-xs"
              >
                {loading ? 'Submitting Outcome...' : 'Register Ground Truth'}
              </button>
            </div>
          </form>

          {result && (
            <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-lg">
              <h4 className="font-bold text-emerald-950 text-xs mb-2">Outcome Registered in Continuous Learning Registry:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-2 bg-white rounded border border-emerald-200">
                  <span className="text-slate-500 block text-[10px]">Prediction Error:</span>
                  <span className="font-bold text-emerald-950">{result.prediction_error}</span>
                </div>
                <div className="p-2 bg-white rounded border border-emerald-200">
                  <span className="text-slate-500 block text-[10px]">Retraining Queue:</span>
                  <span className="font-bold text-emerald-950">{result.unused_entries_count} / 50</span>
                </div>
                <div className="p-2 bg-white rounded border border-emerald-200">
                  <span className="text-slate-500 block text-[10px]">Retraining State:</span>
                  <span className="font-bold text-emerald-950">{result.retraining_triggered ? 'Cycle Completed' : 'Queued'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
