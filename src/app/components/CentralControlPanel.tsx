import { motion } from "motion/react";
import { Target, TrendingUp, Flame, Award, Dumbbell, Brain } from "lucide-react";
import { CircularProgress } from "./CircularProgress";
import { StatPanel } from "./StatPanel";

interface CentralControlPanelProps {
  overallProgress: number;
  stats: {
    streak: number;
    tasksCompleted: number;
    goals: number;
    focus: number;
  };
}

export function CentralControlPanel({ overallProgress, stats }: CentralControlPanelProps) {
  // Generate dynamic system message based on stats
  const getSystemMessage = () => {
    if (stats.streak >= 14) {
      return "Outstanding performance detected. Elite status maintained.";
    } else if (stats.streak >= 7) {
      return "All systems operational. Maintaining optimal performance.";
    } else if (stats.focus >= 75) {
      return "High focus levels detected. Continue current trajectory.";
    } else {
      return "All systems operational. Ready for mission deployment.";
    }
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: System Core - Overall Progress */}
        <div className="lg:col-span-1">
          <div className="relative border border-cyan-500/30 bg-gradient-to-br from-slate-950/80 to-slate-900/80 backdrop-blur-xl rounded-lg p-8 overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.3) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }} />
            </div>
            
            {/* Top glow */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            
            <div className="relative flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-cyan-400/50" />
                <span className="text-xs text-cyan-400/70 uppercase tracking-widest">System Status</span>
                <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-cyan-400/50" />
              </div>
              
              {/* Main progress core */}
              <div className="relative mb-6">
                <CircularProgress progress={overallProgress} size={160} strokeWidth={4} showPercentage>
                  <div className="flex flex-col items-center">
                    <Target className="w-8 h-8 text-cyan-400 mb-1" />
                    <span className="text-xs text-cyan-400/60">OVERALL</span>
                  </div>
                </CircularProgress>
                
                {/* Orbiting particles */}
                {[0, 120, 240].map((rotation, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-2 h-2"
                    style={{ transformOrigin: "0 0" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50"
                      style={{ 
                        transform: `translate(-50%, -50%) translateY(-80px) rotate(${rotation}deg)`,
                      }}
                    />
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center">
                <p className="text-xs text-cyan-400/60 uppercase tracking-wider mb-1">System Integrity</p>
                <p className="text-2xl text-cyan-100 font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>{overallProgress.toFixed(1)}%</p>
              </div>
            </div>
            
            {/* Bottom glow */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
          </div>
        </div>

        {/* Right: Stats Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <StatPanel
              icon={Flame}
              label="Current Streak"
              value={`${stats.streak} days`}
              trend="up"
              delay={0.3}
            />
            <StatPanel
              icon={TrendingUp}
              label="Tasks Completed"
              value={stats.tasksCompleted}
              trend="up"
              delay={0.4}
            />
            <StatPanel
              icon={Award}
              label="Active Goals"
              value={stats.goals}
              trend="neutral"
              delay={0.5}
            />
            <StatPanel
              icon={Brain}
              label="Focus Score"
              value={`${stats.focus}%`}
              trend="up"
              delay={0.6}
            />
          </div>
          
          {/* Mission Status Panel */}
          <motion.div
            className="mt-4 relative border border-cyan-500/20 bg-gradient-to-r from-slate-950/60 to-slate-900/60 backdrop-blur-sm rounded-lg p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-cyan-400/60 uppercase tracking-wider">System Message</p>
                <p className="text-sm text-cyan-100 mt-0.5">{getSystemMessage()}</p>
              </div>
              <Dumbbell className="w-5 h-5 text-cyan-400/40" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}