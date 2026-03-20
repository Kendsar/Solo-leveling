import { motion } from "motion/react";
import { NavLink, useLocation } from "react-router";
import { 
  Home, 
  Map, 
  Swords, 
  TrendingUp, 
  BarChart2, 
  Trophy, 
  Gift, 
  Award, 
  Settings, 
  Lock,
  X
} from "lucide-react";

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  locked?: boolean;
}

const navItems: NavItem[] = [
  { name: "Home", path: "/", icon: Home },
  { name: "Quests", path: "/quests", icon: Map },
  { name: "Training", path: "/training", icon: Swords },
  { name: "Progression", path: "/progression", icon: TrendingUp, locked: true },
  { name: "Stats", path: "/stats", icon: BarChart2 },
  { name: "Ranking", path: "/ranking", icon: Trophy, locked: true },
  { name: "Rewards", path: "/rewards", icon: Gift, locked: true },
  { name: "Achievements", path: "/achievements", icon: Award },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`w-64 h-screen fixed left-0 top-0 border-r border-cyan-500/20 bg-slate-950/95 backdrop-blur-xl flex flex-col z-50 overflow-hidden shadow-[5px_0_30px_rgba(6,182,212,0.05)] transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        {/* Sidebar background effects */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(6,182,212,0.1) 10px, rgba(6,182,212,0.1) 20px)'
        }} />
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent pointer-events-none" />

        {/* Header/Logo */}
        <div className="p-6 relative pt-8 md:pt-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500 tracking-widest uppercase filter drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
              Hunter
            </h1>
            <p className="text-[10px] text-cyan-400/50 uppercase tracking-[0.3em] mt-1 font-mono">System OS</p>
          </div>
          {/* Mobile Close Button */}
          <button onClick={onClose} className="md:hidden text-cyan-500/50 hover:text-cyan-400 transition-colors p-2 z-10">
            <X size={24} />
          </button>
          
          <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-cyan-500/30 to-transparent" />
        </div>

        {/* Navigation List */}
        <nav className="flex-1 py-4 flex flex-col gap-1.5 px-4 overflow-y-auto no-scrollbar relative z-10">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.locked ? "#" : item.path}
                onClick={(e) => {
                  if (item.locked) {
                    e.preventDefault();
                  } else {
                    onClose();
                  }
                }}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-lg overflow-hidden transition-all duration-300 group
                  ${item.locked ? 'cursor-not-allowed opacity-40 grayscale-[0.8]' : 'cursor-pointer hover:bg-cyan-500/10'}
                  ${isActive && !item.locked ? 'bg-cyan-500/10 border border-cyan-500/30 shadow-[inset_0_0_15px_rgba(34,211,238,0.1)]' : 'border border-transparent'}
                `}
              >
                {isActive && !item.locked && (
                  <motion.div
                    layoutId="activeNavBg"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent pointer-events-none"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {isActive && !item.locked && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-400 rounded-r shadow-[0_0_10px_rgba(34,211,238,0.8)] pointer-events-none" />
                )}
                
                <div className="relative z-10 flex-shrink-0">
                  {item.locked ? (
                    <Lock className="w-5 h-5 text-slate-500" />
                  ) : (
                    <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'text-cyan-300 filter drop-shadow-[0_0_5px_rgba(34,211,238,0.5)] scale-110' : 'text-cyan-400/60 group-hover:text-cyan-400 group-hover:scale-110'}`} />
                  )}
                </div>
                
                <span className={`relative z-10 text-sm tracking-wide transition-colors duration-300 ${item.locked ? 'text-slate-500 uppercase text-xs font-semibold tracking-widest' : isActive ? 'text-cyan-50 font-bold uppercase tracking-wider text-xs' : 'text-cyan-100/70 group-hover:text-cyan-100 uppercase tracking-wider font-semibold text-xs'}`}>
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 relative z-10 mt-auto">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent mb-4" />
          <NavLink
            to="/system"
            onClick={onClose}
            className={({ isActive }) => `relative flex items-center gap-3 px-4 py-3 rounded-lg overflow-hidden transition-all duration-300 group cursor-pointer border border-transparent
              ${isActive ? 'bg-slate-800 border-slate-700 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]' : 'hover:bg-slate-800/80 hover:border-slate-800'}
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-slate-500 rounded-r pointer-events-none" />
                )}
                <Settings className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'text-slate-300 rotate-90' : 'text-slate-500 group-hover:text-slate-400 group-hover:rotate-45'}`} />
                <span className={`text-xs uppercase tracking-widest font-semibold transition-colors duration-300 ${isActive ? 'text-slate-200' : 'text-slate-500 group-hover:text-slate-400'}`}>
                  System OS
                </span>
              </>
            )}
          </NavLink>
        </div>
      </aside>
    </>
  );
}
