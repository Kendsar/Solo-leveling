import { motion } from "motion/react";
import { Check, Circle, Lock } from "lucide-react";

interface DayCardProps {
  day: string;
  date: string;
  status: "completed" | "active" | "upcoming" | "locked";
  completionRate: number;
  tasks: number;
  delay?: number;
}

export function DayCard({ day, date, status, completionRate, tasks, delay = 0 }: DayCardProps) {
  const statusConfig = {
    completed: {
      borderColor: "border-emerald-500/40",
      bgGradient: "from-emerald-950/40 to-emerald-900/20",
      glowColor: "from-emerald-500/20 to-emerald-600/20",
      icon: Check,
      iconColor: "text-emerald-400",
      ringColor: "#10b981",
    },
    active: {
      borderColor: "border-cyan-500/50",
      bgGradient: "from-cyan-950/50 to-blue-950/30",
      glowColor: "from-cyan-500/30 to-blue-600/30",
      icon: Circle,
      iconColor: "text-cyan-400",
      ringColor: "#06b6d4",
    },
    upcoming: {
      borderColor: "border-cyan-500/20",
      bgGradient: "from-slate-950/40 to-slate-900/20",
      glowColor: "from-cyan-500/10 to-blue-600/10",
      icon: Circle,
      iconColor: "text-cyan-400/40",
      ringColor: "#06b6d4",
    },
    locked: {
      borderColor: "border-slate-700/30",
      bgGradient: "from-slate-950/30 to-slate-900/20",
      glowColor: "from-slate-500/10 to-slate-600/10",
      icon: Lock,
      iconColor: "text-slate-500",
      ringColor: "#475569",
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const isInteractive = status !== "locked";

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={isInteractive ? { scale: 1.02 } : {}}
    >
      {/* Hover glow effect */}
      {isInteractive && (
        <div className={`absolute inset-0 bg-gradient-to-br ${config.glowColor} rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      )}
      
      <div className={`relative border ${config.borderColor} bg-gradient-to-br ${config.bgGradient} backdrop-blur-sm rounded-lg overflow-hidden ${isInteractive ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
        {/* Top accent line */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-${status === 'completed' ? 'emerald' : 'cyan'}-400/50 to-transparent`} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)',
          backgroundSize: '15px 15px',
        }} />
        
        <div className="relative p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm text-cyan-100 uppercase tracking-wider mb-1">{day}</h3>
              <p className="text-xs text-cyan-400/50 font-mono">{date}</p>
            </div>
            
            {/* Status indicator */}
            <div className={`p-2 rounded-md border ${config.borderColor} bg-gradient-to-br ${config.bgGradient}`}>
              <StatusIcon className={`w-4 h-4 ${config.iconColor}`} />
            </div>
          </div>
          
          {/* Progress visualization */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-cyan-400/60 uppercase tracking-widest">Progress</span>
              <span className={`text-xs font-mono ${status === 'locked' ? 'text-slate-500' : 'text-cyan-300'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                {status === 'locked' ? '--' : `${completionRate}%`}
              </span>
            </div>
            
            {/* Mini progress bar */}
            <div className="relative h-1.5 bg-slate-950/60 rounded-full overflow-hidden border border-cyan-500/20">
              {status !== 'locked' && (
                <motion.div
                  className={`absolute inset-y-0 left-0 rounded-full ${
                    status === 'completed' 
                      ? 'bg-gradient-to-r from-emerald-500/60 to-emerald-400/60' 
                      : 'bg-gradient-to-r from-cyan-500/60 to-cyan-400/60'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 1, delay: delay + 0.2 }}
                />
              )}
            </div>
          </div>
          
          {/* Task count */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-cyan-400/60 uppercase tracking-widest">Tasks</span>
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded border ${config.borderColor} flex items-center justify-center`}>
                <span className={`text-xs font-mono ${status === 'locked' ? 'text-slate-500' : 'text-cyan-300'}`}>
                  {status === 'locked' ? '-' : tasks}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Corner accents */}
        {status === 'active' && (
          <>
            <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-cyan-400" />
            <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-cyan-400" />
          </>
        )}
      </div>
      
      {/* Active pulse animation */}
      {status === 'active' && (
        <motion.div
          className="absolute inset-0 border-2 border-cyan-400/30 rounded-lg"
          animate={{ scale: [1, 1.03, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </motion.div>
  );
}
