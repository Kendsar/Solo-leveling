export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center animate-in fade-in duration-500 slide-in-from-bottom-4">
      <div className="relative border border-cyan-500/20 bg-slate-950/60 backdrop-blur-sm rounded-xl p-12 max-w-lg w-full text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-400 via-transparent to-transparent" />
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500 uppercase tracking-widest relative z-10">
          {title}
        </h2>
        <p className="mt-4 text-sm text-cyan-400/60 font-mono tracking-wide relative z-10">
          Module is currently stabilizing. Awaiting clearance to access this sector.
        </p>
        
        <div className="mt-8 flex justify-center gap-2 relative z-10">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-cyan-500/50 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
