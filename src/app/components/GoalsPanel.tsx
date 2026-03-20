import { motion } from "motion/react";
import { Target, Crosshair, Zap } from "lucide-react";

interface Goal {
  title: string;
  progress: number;
  target: number;
  xpReward: number;
}

interface GoalsPanelProps {
  goals: Goal[];
}

export function GoalsPanel({ goals }: GoalsPanelProps) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-5 h-5 text-fuchsia-400" />
        <h2 className="text-lg text-fuchsia-100 uppercase tracking-wider">Active Directives</h2>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-fuchsia-400/30 to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {goals.map((goal, index) => {
          const progressPercentage = Math.min(100, Math.round((goal.progress / goal.target) * 100));
          return (
            <motion.div
              key={goal.title}
              className="relative p-5 border border-fuchsia-500/30 bg-gradient-to-br from-slate-950/80 to-slate-900/60 backdrop-blur-sm rounded-lg overflow-hidden group"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-fuchsia-400/80 to-transparent" />
              
              <div className="flex justify-between items-start mb-4 pl-2">
                <h3 className="text-sm text-fuchsia-100 font-medium tracking-wide">{goal.title}</h3>
                <div className="flex items-center gap-1 bg-fuchsia-500/10 px-2 py-1 rounded border border-fuchsia-500/20">
                  <Zap className="w-3 h-3 text-fuchsia-400" />
                  <span className="text-xs text-fuchsia-300 font-mono">{goal.xpReward} XP</span>
                </div>
              </div>

              <div className="pl-2">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-fuchsia-400/60 uppercase tracking-widest text-[10px]">Completion</span>
                  <span className="text-fuchsia-300 font-mono">{goal.progress} / {goal.target}</span>
                </div>
                
                <div className="h-1.5 w-full bg-slate-950/80 rounded-full overflow-hidden border border-fuchsia-500/20">
                  <motion.div
                    className="h-full bg-gradient-to-r from-fuchsia-600 to-fuchsia-400 relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                  >
                    <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/20 blur-[2px]" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
