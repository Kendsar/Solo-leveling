import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Zap, Crown, Activity, User, Upload } from "lucide-react";
import { CircularProgress } from "./CircularProgress";
import { avatarService } from "../services/AvatarService";

interface TopCommandBarProps {
  userId?: string;
  userName: string;
  rank: string;
  level: number;
  currentXP: number;
  maxXP: number;
  energyLevel: number;
  profilePictureUrl?: string | null;
}

export function TopCommandBar({
  userId = "hunter-001",
  userName,
  rank,
  level,
  currentXP,
  maxXP,
  energyLevel,
  profilePictureUrl,
}: TopCommandBarProps) {
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(profilePictureUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // Simulates the physical upload flow to an external bucket/service
      await avatarService.uploadAvatar(file, userId);

      // To simulate immediately on local UI without having actual local backend wiring saving the file, 
      // we generate an object URL for instant UI preview:
      setLocalAvatarUrl(URL.createObjectURL(file));
    } catch (error) {
      console.error("Failed to upload avatar:", error);
    } finally {
      setIsUploading(false);
    }
  };

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
      <div className="relative border border-cyan-500/30 bg-gradient-to-r from-slate-950/90 via-slate-900/90 to-slate-950/90 backdrop-blur-xl rounded-lg overflow-hidden flex flex-col justify-center">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        <div className="flex flex-col xl:flex-row items-center p-6 gap-6 w-full">
          {/* Avatar Profile Picture Upload Block */}
          <div
            className="relative group flex-shrink-0 cursor-pointer rounded-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              className="hidden"
            />

            <div className={`relative w-24 h-24 rounded-full border-[3px] border-cyan-400/50 bg-slate-900 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] ${isUploading ? 'opacity-50 blur-[2px]' : ''}`}>
              {localAvatarUrl && localAvatarUrl !== 'link' ? (
                <img src={localAvatarUrl} alt="Hunter Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-cyan-500/50" />
              )}

              {/* Overlay upload icon */}
              <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Upload className="w-8 h-8 text-cyan-300 transform scale-75 group-hover:scale-100 transition-transform duration-300" />
              </div>
            </div>
          </div>
          {/*             
            <div className="relative hidden md:block flex-shrink-0">
              <CircularProgress progress={energyLevel} size={50} strokeWidth={2} glowColor="#0ea5e9">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/50 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
              </CircularProgress>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div> */}
          <div style={{ display: 'flex' }}>
            <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
              <div className="flex items-center gap-2">
                <span className="text-xs text-cyan-400/70 tracking-wider uppercase whitespace-nowrap">Hunter ID</span>
                <div className="h-3 w-[1px] bg-cyan-400/30" />
                <span className="text-xs text-cyan-300/60 font-mono">#{userId?.split('-')[1] || Math.floor(Math.random() * 100000).toString().padStart(5, '0')}</span>
              </div>
              <h2 className="text-lg md:text-xl text-cyan-50 tracking-wide font-medium">{userName}</h2>
              <div className="flex items-center gap-2">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs text-amber-400/90 uppercase tracking-wider font-semibold">{rank}</span>
              </div>
            </div>
            {/* Left: User Identity - Level */}
            <div className="flex flex-1 flex-wrap items-center gap-4 xl:border-r border-cyan-500/20 xl:pr-6 justify-center xl:justify-start w-full">
              <div className="relative flex-shrink-0 md:mr-2">
                <div className="relative px-8 py-4 border border-cyan-400/40 bg-gradient-to-br from-cyan-950/40 to-blue-950/40 clip-hexagon">
                  <div className="absolute inset-0 bg-cyan-400/5 backdrop-blur-sm clip-hexagon" />
                  <div className="relative flex flex-col items-center">
                    <span className="text-[10px] text-cyan-400/70 uppercase tracking-widest">Level</span>
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-500">{level}</span>
                  </div>
                </div>
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
                <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />
              </div>
            </div>

          </div>

          {/* Right: XP Progression */}
          <div className="flex-1 w-full xl:max-w-md ml-auto mt-4 xl:mt-0">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-cyan-400/70 uppercase tracking-wider font-semibold">Experience Points</span>
            </div>

            <div className="relative h-8 border border-cyan-500/30 rounded-md overflow-hidden bg-slate-950/50">
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(6, 182, 212, 0.1) 10px, rgba(6, 182, 212, 0.1) 11px)',
              }} />

              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500/40 via-cyan-400/30 to-cyan-500/40"
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />

              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent blur-sm"
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />

              <div className="relative h-full flex items-center justify-center">
                <span className="text-xs text-cyan-100 font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {formatXP(currentXP)} / {formatXP(maxXP)} XP
                </span>
              </div>

              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      </div>
    </motion.div>
  );
}