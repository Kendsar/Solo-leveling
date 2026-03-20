import { motion } from "motion/react";
import { Trophy, Award, LockKeyhole } from "lucide-react";

interface Achievement {
  title: string;
  xpReward: number;
  unlocked: boolean;
  dateUnlocked: string | null;
}

interface AchievementsPanelProps {
  achievements: Achievement[];
}

export function AchievementsPanel({ achievements }: AchievementsPanelProps) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-5 h-5 text-amber-400" />
        <h2 className="text-lg text-amber-100 uppercase tracking-wider">Trophies & Honors</h2>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-amber-400/30 to-transparent" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {achievements.map((achievement, index) => {
          const isUnlocked = achievement.unlocked;
          
          return (
            <motion.div
              key={achievement.title}
              className={`relative flex flex-col items-center justify-center p-6 text-center border rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300 ${
                isUnlocked 
                  ? 'border-amber-500/40 bg-gradient-to-b from-amber-950/40 to-slate-900/80 shadow-[0_0_15px_rgba(251,191,36,0.1)] hover:shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:border-amber-400/50' 
                  : 'border-slate-800/50 bg-slate-950/40 opacity-70 grayscale-[0.5]'
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              whileHover={isUnlocked ? { y: -5 } : {}}
            >
              {isUnlocked && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />
              )}
              
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                isUnlocked 
                  ? 'bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.3)]' 
                  : 'bg-slate-800/80 border border-slate-700'
              }`}>
                {isUnlocked ? (
                  <Award className="w-8 h-8 text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]" />
                ) : (
                  <LockKeyhole className="w-8 h-8 text-slate-500" />
                )}
              </div>
              
              <h3 className={`text-sm font-semibold tracking-wide mb-2 ${isUnlocked ? 'text-amber-100' : 'text-slate-400'}`}>
                {achievement.title}
              </h3>
              
              <div className="mt-auto flex flex-col items-center gap-1">
                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                  isUnlocked ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}>
                  {achievement.xpReward} XP
                </span>
                {isUnlocked && achievement.dateUnlocked && (
                  <span className="text-[9px] text-amber-400/50 mt-1">{achievement.dateUnlocked}</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
