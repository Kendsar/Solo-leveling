import { motion } from "motion/react";
import { WorkoutProvider } from "../../../context/WorkoutComposerContext";
import { WorkoutComposer } from "../../WorkoutComposer";
import { WeeklyPlanner } from "../../composer-components/WeeklyPlanner";
import { MonthlyCalendar } from "../../composer-components/MonthlyCalendar";

export function ComposerPage() {
  return (
    <WorkoutProvider>
      <motion.div
        className="animate-in fade-in duration-500 min-h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative border border-cyan-500/30 bg-gradient-to-r from-slate-950/90 via-slate-900/90 to-slate-950/90 backdrop-blur-xl rounded-lg overflow-hidden flex flex-col justify-center">
          <main className="container mx-auto px-4 py-8 space-y-8">
            <WorkoutComposer />
            <WeeklyPlanner />
            <MonthlyCalendar />
          </main>
        </div>
      </motion.div>
    </WorkoutProvider>
  );
}