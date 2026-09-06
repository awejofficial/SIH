import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './GISMap.css'
import { Layers } from 'lucide-react'

// Fix default Leaflet marker assets if needed
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

/**
 * Geometric status symbols & styling tokens for SIH26017
 */
const RISK_METRICS = {
  Critical: {
    symbol: '▲',
    label: 'Critical',
    range: '>75%',
    cssClass: 'sih-marker-critical',
    badgeClass: 'bg-red-950/90 text-red-300 border-red-700',
    color: '#ef4444'
  },
  High: {
    symbol: '◆',
    label: 'High',
    range: '50-75%',
    cssClass: 'sih-marker-high',
    badgeClass: 'bg-orange-950/90 text-orange-300 border-orange-700',
    color: '#f97316'
  },
  Moderate: {
    symbol: '■',
    label: 'Moderate',
    range: '25-50%',
    cssClass: 'sih-marker-moderate',
    badgeClass: 'bg-amber-950/90 text-amber-300 border-amber-700',
    color: '#f59e0b'
  },
  Low: {
    symbol: '●',
    label: 'Low',
    range: '<25%',
    cssClass: 'sih-marker-low',
    badgeClass: 'bg-emerald-950/90 text-emerald-300 border-emerald-700',
    color: '#10b981'
  }
}

const SECTOR_CODES = {
  Highway: 'HW',
  Metro: 'MT',
  Railway: 'RL',
  Irrigation: 'IR'
}

// Center of Maharashtra infrastructure grid
const MAHARASHTRA_CENTER = [19.5, 75.7]
const DEFAULT_ZOOM = 7

export default function GISMap({
  projects = [],
  selectedProject = null,
  onSelectProject = () => {},
  onTakeAction = () => {},
  className = ''
}) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersLayerRef = useRef(null)

  // 1. Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: MAHARASHTRA_CENTER,
        zoom: DEFAULT_ZOOM,
        minZoom: 6,
        maxZoom: 14,
        zoomControl: false, // will reposition
        preferCanvas: true
      })

      // Reposition zoom controls to top-right
      L.control.zoom({ position: 'topright' }).addTo(map)

      // High-contrast Dark CartoDB TileLayer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> | CartoDB • SIH26017 Spatial Intelligence',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map)

      // Dedicated layer group for fast updates
      const markersLayer = L.layerGroup().addTo(map)
      markersLayerRef.current = markersLayer
      mapInstanceRef.current = map
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // 2. Render High-Contrast Geometric Markers & Popups
  useEffect(() => {
    const map = mapInstanceRef.current
    const markersLayer = markersLayerRef.current
    if (!map || !markersLayer) return

    // Clear prior markers
    markersLayer.clearLayers()

    projects.forEach((proj) => {
      // Resolve coordinates from GeoJSON or flat properties
      const lat = proj.lat ?? (proj.geometry?.coordinates ? proj.geometry.coordinates[1] : null)
      const lon = proj.lon ?? (proj.geometry?.coordinates ? proj.geometry.coordinates[0] : null)
      if (lat === null || lon === null || isNaN(lat) || isNaN(lon)) return

      const p = proj.properties || proj
      const id = p.project_id
      const formattedId = `PRJ-${String(id).padStart(4, '0')}`
      const name = p.project_name || `Project #${id}`
      const district = p.district || 'Maharashtra'
      const type = p.project_type || 'Highway'
      const sectorCode = SECTOR_CODES[type] || 'IN'
      const score = Math.round(p.risk_score || 0)
      const category = p.risk_category || (score >= 75 ? 'Critical' : score >= 50 ? 'High' : score >= 25 ? 'Moderate' : 'Low')
      const meta = RISK_METRICS[category] || RISK_METRICS.Moderate
      const hasIntervention = Boolean(p.intervention_taken)
      const isSelected = selectedProject && (selectedProject.project_id === id)

      // Build custom HTML marker div
      const markerHtml = `
        <div class="sih-marker-pin ${meta.cssClass} ${isSelected ? 'sih-marker-active' : ''} ${category === 'Critical' && !hasIntervention ? 'sih-marker-pulse-critical' : ''}" title="${name} (${meta.label}: ${score}%)">
          <span>${meta.symbol}</span>
          ${hasIntervention ? '<span class="sih-marker-intervention-badge" title="Intervention Logged">✓</span>' : ''}
        </div>
      `

      const customIcon = L.divIcon({
        className: 'sih-spatial-marker-icon',
        html: markerHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -16]
      })

      const marker = L.marker([lat, lon], { icon: customIcon })

      // Create Custom Analytical Popup Content
      const popupDiv = document.createElement('div')
      popupDiv.className = 'sih-spatial-popup'
      popupDiv.innerHTML = `
        <div class="sih-spatial-popup-header">
          <div class="sih-spatial-popup-type">${sectorCode}</div>
          <div class="sih-spatial-popup-meta">
            <div class="flex items-center justify-between">
              <span class="sih-spatial-popup-id">${formattedId}</span>
              <span class="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${meta.badgeClass}">
                ${meta.symbol} ${score}% ${meta.label}
              </span>
            </div>
            <div class="sih-spatial-popup-title">${name}</div>
            <div class="sih-spatial-popup-district">${district} Jurisdiction • ${type}</div>
          </div>
        </div>

        <div class="sih-spatial-popup-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: #0b1120; border: 1px solid #1e293b; border-radius: 8px; padding: 8px 10px;">
          <div class="sih-spatial-popup-tile">
            <span class="sih-spatial-popup-tile-label">Notified Land</span>
            <span class="sih-spatial-popup-tile-val">${p.total_acres || '—'} Acres</span>
          </div>
          <div class="sih-spatial-popup-tile">
            <span class="sih-spatial-popup-tile-label">Demarcated</span>
            <span class="sih-spatial-popup-tile-val">${p.land_acquired_pct ?? '—'}%</span>
          </div>
          <div class="sih-spatial-popup-tile">
            <span class="sih-spatial-popup-tile-label">DBT Disbursed</span>
            <span class="sih-spatial-popup-tile-val">${p.compensation_disbursed_pct ?? '—'}%</span>
          </div>
          <div class="sih-spatial-popup-tile">
            <span class="sih-spatial-popup-tile-label">Approvals Lag</span>
            <span class="sih-spatial-popup-tile-val">${p.approval_days_pending ?? '—'} Days</span>
          </div>
        </div>

        <div style="font-size: 11px; padding: 6px 8px; border-radius: 6px; font-weight: 600; display: flex; align-items: center; gap: 6px; ${
          hasIntervention
            ? 'background: #0f2347; border: 1px solid #1e40af; color: #60a5fa;'
            : 'background: #2a1215; border: 1px solid #7f1d1d; color: #f87171;'
        }">
          <span style="font-size: 10px; font-weight: 700;">${hasIntervention ? '● Action Logged:' : '▲ Pending Action:'}</span>
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${hasIntervention ? p.intervention_taken : 'Statutory Action Mandated'}
          </span>
        </div>
      `

      // Action Buttons
      const actionsDiv = document.createElement('div')
      actionsDiv.className = 'sih-spatial-popup-actions'

      const inspectBtn = document.createElement('button')
      inspectBtn.className = 'sih-spatial-popup-btn-primary'
      inspectBtn.innerHTML = `<span>Inspect Project</span> <span>→</span>`
      inspectBtn.onclick = (e) => {
        e.stopPropagation()
        onSelectProject(p)
      }

      const actionBtn = document.createElement('button')
      actionBtn.className = 'sih-spatial-popup-btn-secondary'
      actionBtn.title = 'Log Administrative Intervention'
      actionBtn.innerHTML = `<span>Intervene</span>`
      actionBtn.onclick = (e) => {
        e.stopPropagation()
        onTakeAction(p)
      }

      actionsDiv.appendChild(inspectBtn)
      actionsDiv.appendChild(actionBtn)
      popupDiv.appendChild(actionsDiv)

      marker.bindPopup(popupDiv, { maxWidth: 320 })

      marker.on('click', () => {
        onSelectProject(p)
      })

      markersLayer.addLayer(marker)
    })
  }, [projects, selectedProject, onSelectProject, onTakeAction])

  // 3. Pan to selected project when changed
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !selectedProject) return

    const lat = selectedProject.lat ?? (selectedProject.geometry?.coordinates ? selectedProject.geometry.coordinates[1] : null)
    const lon = selectedProject.lon ?? (selectedProject.geometry?.coordinates ? selectedProject.geometry.coordinates[0] : null)

    if (lat && lon && !isNaN(lat) && !isNaN(lon)) {
      map.flyTo([lat, lon], Math.max(map.getZoom(), 9), { duration: 1.2 })
    }
  }, [selectedProject])

  return (
    <div className={`gis-spatial-canvas-wrapper ${className}`}>
      {/* Main Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="gis-spatial-map" />

      {/* Floating Spatial Decision Intelligence Legend (Bottom-Left) */}
      <div className="absolute bottom-6 left-6 z-[400] bg-slate-900/95 border border-slate-700/90 shadow-2xl rounded-xl p-3.5 backdrop-blur-xs text-white select-none max-w-xs space-y-2">
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            <Layers size={13} className="text-blue-400" />
            <span>Spatial Decision Legend</span>
          </div>
          <span className="font-mono text-[9px] text-slate-500 uppercase">RFCTLARR Tiers</span>
        </div>

        {/* Multi-Modal Geometric Legend Tiers */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-red-600 border border-red-300 text-white flex items-center justify-center font-black text-[10px]">
              ▲
            </span>
            <div className="leading-none">
              <span className="font-bold text-red-400">&gt;75%</span>
              <span className="text-[10px] text-slate-400 block font-sans">Critical Tier</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-orange-500 border border-orange-300 text-white flex items-center justify-center font-black text-[10px]">
              ◆
            </span>
            <div className="leading-none">
              <span className="font-bold text-orange-400">50-75%</span>
              <span className="text-[10px] text-slate-400 block font-sans">High Risk</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-amber-500 border border-amber-300 text-white flex items-center justify-center font-black text-[10px]">
              ■
            </span>
            <div className="leading-none">
              <span className="font-bold text-amber-400">25-50%</span>
              <span className="text-[10px] text-slate-400 block font-sans">Moderate</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-emerald-500 border border-emerald-300 text-white flex items-center justify-center font-black text-[10px]">
              ●
            </span>
            <div className="leading-none">
              <span className="font-bold text-emerald-400">&lt;25%</span>
              <span className="text-[10px] text-slate-400 block font-sans">Compliant</span>
            </div>
          </div>
        </div>

        {/* Intervention State Indicator */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2 text-blue-400">
            <span className="w-3.5 h-3.5 rounded-full bg-blue-600 border border-white flex items-center justify-center text-[9px] font-bold text-white shadow-xs">
              ✓
            </span>
            <span className="font-semibold text-slate-300">Intervention Logged</span>
          </div>
          <span className="text-[9px] text-slate-500 font-sans">Active Relief</span>
        </div>
      </div>
    </div>
  )
}
