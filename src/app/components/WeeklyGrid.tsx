import { motion } from "motion/react";
import { Calendar } from "lucide-react";
import { DayCard } from "./DayCard";

export interface ProcessedExercise {
  name: string;
  completed: boolean;
  details: string;
}

export interface DayData {
  day: string;
  date: string;
  title: string;
  status: "completed" | "active" | "upcoming" | "locked";
  completionRate: number;
  exercises: ProcessedExercise[];
  isCurrentOrFuture: boolean;
  isDisabled: boolean;
}

interface WeeklyGridProps {
  weekData: DayData[];
}

export function WeeklyGrid({ weekData }: WeeklyGridProps) {
  // Calculate current week number
  const getCurrentWeek = (): number => {
    const now = new Date('2026-03-20');
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.ceil(diff / oneWeek);
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg text-cyan-100 uppercase tracking-wider">Weekly Workouts</h2>
        </div>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-cyan-400/30 to-transparent" />
        <div className="flex items-center gap-2 px-3 py-1 rounded border border-cyan-500/20 bg-slate-950/50">
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
          <span className="text-xs text-cyan-400/80 uppercase tracking-wider">Week {getCurrentWeek()}</span>
        </div>
      </div>

      {/* Weekly Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {weekData.map((dayData, index) => (
          <DayCard
            key={dayData.day}
            dayData={dayData}
            delay={0.5 + index * 0.1}
          />
        ))}
      </div>
    </motion.div>
  );
}