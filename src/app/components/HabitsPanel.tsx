import { motion } from "motion/react";
import { CheckCircle2, CircleDashed, ListChecks } from "lucide-react";

interface Habit {
  habit: string;
  completed: boolean;
  xp: number;
}

interface HabitsPanelProps {
  habits: Habit[];
}

export function HabitsPanel({ habits }: HabitsPanelProps) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <ListChecks className="w-5 h-5 text-emerald-400" />
        <h2 className="text-lg text-emerald-100 uppercase tracking-wider">Daily Protocols</h2>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-emerald-400/30 to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {habits.map((habit, index) => (
          <motion.div
            key={habit.habit}
            className={`flex items-center justify-between p-4 border rounded-lg backdrop-blur-sm transition-all duration-300 ${
              habit.completed 
                ? 'border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 to-slate-900/60' 
                : 'border-slate-700/50 bg-slate-950/40 hover:border-emerald-500/30'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-3">
              {habit.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <CircleDashed className="w-5 h-5 text-slate-500" />
              )}
              <span className={`text-sm tracking-wide ${habit.completed ? 'text-emerald-100' : 'text-slate-300'}`}>
                {habit.habit}
              </span>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-mono border ${
              habit.completed ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-800/50 text-slate-400 border-slate-700/50'
            }`}>
              +{habit.xp} XP
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
