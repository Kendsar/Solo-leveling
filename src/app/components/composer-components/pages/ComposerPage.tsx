import { motion } from "motion/react";
import { Swords } from "lucide-react";
import { WorkoutProvider } from "../../../context/WorkoutComposerContext";
import { WorkoutComposer } from "../../WorkoutComposer";
import { WeeklyPlanner } from "../../composer-components/WeeklyPlanner";
import { MonthlyCalendar } from "../../composer-components/MonthlyCalendar";

export function ComposerPage() {
  return (
    <WorkoutProvider>
      <motion.div
        className="min-h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Page header */}
        <div className="flex items-center gap-3 mb-8">
          <Swords className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg text-cyan-100 uppercase tracking-wider">Workout Composer</h2>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-cyan-400/30 to-transparent" />
        </div>

        <div className="space-y-8">
          <WorkoutComposer />
          <WeeklyPlanner />
          <MonthlyCalendar />
        </div>
      </motion.div>
    </WorkoutProvider>
  );
}