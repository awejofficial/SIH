import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { RoleProvider } from './context/RoleContext'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import CommandCenter from './pages/CommandCenter'
import EarlyWarningPredictor from './pages/EarlyWarningPredictor'
import Analytics from './pages/Analytics'
import GISMapPage from './pages/GISMapPage'
import ModelHealth from './pages/ModelHealth'

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-slate-100/80 font-sans text-slate-900 overflow-hidden">
      {/* 1. National Intelligence Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. Main Operational Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Topbar with National Context & Breadcrumbs */}
        <Topbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        {/* Primary Analytical Workspace */}
        <main className="flex-1 overflow-y-auto min-w-0 bg-[#f8fafc]">
          <Routes>
            <Route path="/" element={<CommandCenter />} />
            <Route path="/predict-risk" element={<EarlyWarningPredictor />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/map" element={<GISMapPage />} />
            <Route path="/model-health" element={<ModelHealth />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <RoleProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </RoleProvider>
  )
}

export default App
