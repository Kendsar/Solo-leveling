import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface StatPanelProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  delay?: number;
}

export function StatPanel({ icon: Icon, label, value, trend, delay = 0 }: StatPanelProps) {
  const trendColors = {
    up: "text-emerald-400",
    down: "text-rose-400",
    neutral: "text-cyan-400",
  };

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      {/* Outer glow border */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative border border-cyan-500/20 bg-gradient-to-br from-slate-950/60 to-slate-900/60 backdrop-blur-sm rounded-lg p-4 overflow-hidden">
        {/* Corner brackets */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-400/60" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan-400/60" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan-400/60" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-400/60" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />
        
        <div className="relative flex items-center gap-3">
          <div className="p-2 rounded-md bg-cyan-500/10 border border-cyan-400/30">
            <Icon className="w-5 h-5 text-cyan-400" />
          </div>
          
          <div className="flex-1">
            <p className="text-[10px] text-cyan-400/60 uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-xl ${trend ? trendColors[trend] : 'text-cyan-100'} font-mono`} style={{ fontVariantNumeric: 'tabular-nums' }}>
              {value}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
