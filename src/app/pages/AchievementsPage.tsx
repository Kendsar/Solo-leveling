import { motion } from "motion/react";
import { AchievementsPanel } from "../components/AchievementsPanel";
import { processAchievementsData } from "../utils/processHunterData";

export function AchievementsPage() {
  const achievementsData = processAchievementsData();

  return (
    <motion.div 
      className="animate-in fade-in duration-500 min-h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative border border-amber-500/20 bg-slate-950/60 backdrop-blur-sm rounded-xl p-8 w-full min-h-[calc(100vh-8rem)] overflow-hidden">
        {/* Background glow theme specific to achievements (amber/gold) */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 w-full h-full">
          <AchievementsPanel achievements={achievementsData} />
        </div>
      </div>
    </motion.div>
  );
}
