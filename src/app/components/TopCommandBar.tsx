import { motion } from "motion/react";
import { Zap, Crown, Activity } from "lucide-react";
import { CircularProgress } from "./CircularProgress";

interface TopCommandBarProps {
  userName: string;
  rank: string;
  level: number;
  currentXP: number;
  maxXP: number;
  energyLevel: number;
}

export function TopCommandBar({
  userName,
  rank,
  level,
  currentXP,
  maxXP,
  energyLevel,
}: TopCommandBarProps) {
  const xpProgress = (currentXP / maxXP) * 100;
  
  // Format large numbers to be more readable
  const formatXP = (num: number): string => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  return (
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Main command bar */}
      <div className="relative border border-cyan-500/30 bg-gradient-to-r from-slate-950/90 via-slate-900/90 to-slate-950/90 backdrop-blur-xl rounded-lg overflow-hidden">
        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        
        <div className="flex items-center justify-between p-6 gap-6">
          {/* Left: User Identity */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <CircularProgress progress={energyLevel} size={60} strokeWidth={2} glowColor="#0ea5e9">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/50 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-cyan-400" />
                </div>
              </CircularProgress>
              {/* Energy pulse */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-cyan-400/70 tracking-wider uppercase">Hunter ID</span>
                <div className="h-3 w-[1px] bg-cyan-400/30" />
                <span className="text-xs text-cyan-300/60 font-mono">#{Math.floor(Math.random() * 100000).toString().padStart(5, '0')}</span>
              </div>
              <h2 className="text-lg text-cyan-50 tracking-wide">{userName}</h2>
              <div className="flex items-center gap-2">
                <Crown className="w-3 h-3 text-amber-400" />
                <span className="text-xs text-amber-400/90 uppercase tracking-wider">{rank}</span>
              </div>
            </div>
          </div>

          {/* Center: Level Badge */}
          <div className="relative flex-shrink-0">
            <div className="relative">
              {/* Hexagonal frame effect */}
              <div className="relative px-8 py-4 border border-cyan-400/40 bg-gradient-to-br from-cyan-950/40 to-blue-950/40 clip-hexagon">
                <div className="absolute inset-0 bg-cyan-400/5 backdrop-blur-sm clip-hexagon" />
                <div className="relative flex flex-col items-center">
                  <span className="text-[10px] text-cyan-400/70 uppercase tracking-widest">Level</span>
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-500">{level}</span>
                </div>
              </div>
              {/* Corner accents */}
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />
            </div>
          </div>

          {/* Right: XP Progression */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-cyan-400/70 uppercase tracking-wider">Experience Points</span>
            </div>
            
            {/* XP Bar */}
            <div className="relative h-8 border border-cyan-500/30 rounded-md overflow-hidden bg-slate-950/50">
              {/* Grid pattern overlay */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(6, 182, 212, 0.1) 10px, rgba(6, 182, 212, 0.1) 11px)',
              }} />
              
              {/* Progress fill */}
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500/40 via-cyan-400/30 to-cyan-500/40"
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              
              {/* Glow effect */}
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent blur-sm"
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              
              {/* XP Text */}
              <div className="relative h-full flex items-center justify-center">
                <span className="text-xs text-cyan-100 font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {formatXP(currentXP)} / {formatXP(maxXP)} XP
                </span>
              </div>
              
              {/* Edge highlights */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
            </div>
          </div>
        </div>
        
        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      </div>
    </motion.div>
  );
}