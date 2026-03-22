import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { AchievementsPage } from "./pages/AchievementsPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import SoloLevelingNotification from "./components/ui/notification";
import { Menu } from "lucide-react";

import { GoalsPanel } from "./components/GoalsPanel";
import { processGoalsData } from "./utils/processHunterData";
import AuthSystemPanel from "./components/ui/authSystemPanel";


export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const goalsData = processGoalsData();

  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-[#0a0e1a] flex overflow-hidden">
        {/* Static Background Core */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0a0e1a] to-blue-950/30" />

          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]" />

          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px',
            }}
          />
        </div>

        {/* Global Game Navigation Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Dynamic Route Viewport Wrapper */}
        <main className="flex-1 ml-0 md:ml-64 relative z-10 h-screen overflow-y-auto no-scrollbar flex flex-col scroll-smooth">

          {/* Mobile Header with Hamburger Interaction */}
          <div className="md:hidden sticky top-0 z-30 bg-[#0a0f16]/90 backdrop-blur border-b border-cyan-500/20 p-4 flex items-center justify-between shadow-[0_5px_20px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-cyan-400/40 bg-gradient-to-br from-cyan-950/40 to-blue-950/40 flex items-center justify-center">
                <div className="w-4 h-4 rounded-sm shadow-[0_0_10px_rgba(34,211,238,0.8)] border-2 border-cyan-400 bg-cyan-950/50" />
              </div>
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500 tracking-widest uppercase text-sm filter drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">Hunter OS</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-cyan-500/70 hover:text-cyan-400 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/50 rounded-lg"
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-[1600px] flex-1">
            <Routes>
              <Route path="/auth" element={<AuthSystemPanel />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/quests" element={<GoalsPanel goals={goalsData} />} />
              <Route path="/workouts" element={<PlaceholderPage title="Workouts" />} />
              <Route path="/stats" element={<PlaceholderPage title="Stats" />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/ranking" element={<PlaceholderPage title="Ranking" />} />
              <Route path="/system" element={<SoloLevelingNotification />} />
              {/* Catch-all for undefined or locked routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}