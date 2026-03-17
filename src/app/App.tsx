import { motion } from "motion/react";
import { TopCommandBar } from "./components/TopCommandBar";
import { CentralControlPanel } from "./components/CentralControlPanel";
import { WeeklyGrid } from "./components/WeeklyGrid";
import { processUserData, processSystemStats, processWeeklyData } from "./utils/processHunterData";

export default function App() {
  // Load data from JSON
  const userData = processUserData();
  const systemStats = processSystemStats();
  const weekData = processWeeklyData();

  return (
    <div className="relative min-h-screen bg-[#0a0e1a] overflow-hidden">
      {/* Animated background layers */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0a0e1a] to-blue-950/30" />
        
        {/* Radial gradients for depth */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]" />
        
        {/* Animated grid overlay */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
          }}
          animate={{ 
            backgroundPosition: ['0px 0px', '100px 100px'],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        
        {/* Scan line effect */}
        <motion.div
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-sm"
          animate={{ top: ['-2px', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Particle field */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-[1600px]">
        <div className="space-y-8">
          {/* Top Command Bar */}
          <TopCommandBar {...userData} />
          
          {/* Central Control Panel */}
          <CentralControlPanel {...systemStats} />
          
          {/* Weekly Mission Grid */}
          <WeeklyGrid weekData={weekData} />
        </div>
      </div>

      {/* Corner UI Elements */}
      <div className="fixed top-4 left-4 z-20">
        <div className="flex flex-col gap-1">
          <div className="h-8 w-[2px] bg-gradient-to-b from-cyan-400 to-transparent" />
          <div className="w-8 h-[2px] bg-gradient-to-r from-cyan-400 to-transparent" />
        </div>
      </div>
      
      <div className="fixed top-4 right-4 z-20">
        <div className="flex flex-col items-end gap-1">
          <div className="h-8 w-[2px] bg-gradient-to-b from-cyan-400 to-transparent" />
          <div className="w-8 h-[2px] bg-gradient-to-l from-cyan-400 to-transparent" />
        </div>
      </div>
      
      <div className="fixed bottom-4 left-4 z-20">
        <div className="flex flex-col gap-1">
          <div className="w-8 h-[2px] bg-gradient-to-r from-cyan-400 to-transparent" />
          <div className="h-8 w-[2px] bg-gradient-to-t from-cyan-400 to-transparent" />
        </div>
      </div>
      
      <div className="fixed bottom-4 right-4 z-20">
        <div className="flex flex-col items-end gap-1">
          <div className="w-8 h-[2px] bg-gradient-to-l from-cyan-400 to-transparent" />
          <div className="h-8 w-[2px] bg-gradient-to-t from-cyan-400 to-transparent" />
        </div>
      </div>

      {/* System watermark */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
          <span className="text-[10px] text-cyan-400/60 uppercase tracking-widest font-mono">
            Hunter System v{userData.level / 10}.{userData.level % 10} // Active
          </span>
        </div>
      </div>
    </div>
  );
}