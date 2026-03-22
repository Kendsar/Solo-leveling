import React from 'react';
import { Shield, X } from 'lucide-react';
import { useNavigate } from 'react-router';

const SoloLevelingNotification = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0a0f1c]">
            {/* Outer Glow Frame */}
            <div style={{ display: 'inline-flex', width: '90%', height: 'auto', maxWidth: '424px' }} className="relative p-[2px] rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 animate-pulse shadow-[0_0_40px_rgba(0,255,255,0.4)]">

                {/* Main Panel */}
                <div className="relative w-[420px] h-[260px] rounded-xl bg-[#0b1324]/90 backdrop-blur-md border border-cyan-400/30 overflow-hidden">

                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-300"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-300"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-300"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-300"></div>

                    {/* Inner Glow Overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.08),transparent_70%)] pointer-events-none"></div>

                    {/* Header */}
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-cyan-400/20">
                        <div className="w-6 h-6 flex items-center justify-center border border-cyan-300 text-cyan-300 text-sm">
                            !
                        </div>
                        <h2 className="text-cyan-300 tracking-widest text-sm font-semibold">
                            NOTIFICATION
                        </h2>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6 space-y-6 text-cyan-100 text-sm">

                        {/* Item 1 */}
                        <div className="flex items-center justify-between">
                            <span className="opacity-80">
                                • Congratulations on becoming a Player.
                            </span>
                            <div className="w-3 h-3 border border-cyan-400 rounded-sm"></div>
                        </div>

                        {/* Item 2 */}
                        <div className="flex items-center justify-between">
                            <span className="opacity-80">
                                • Daily Quest:{" "}
                                <span className="font-semibold text-cyan-300">
                                    Strength Training has arrived.
                                </span>
                            </span>
                            <div className="w-3 h-3 border border-cyan-400 rounded-sm"></div>
                        </div>
                    </div>

                    {/* Animated scan line */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="w-full h-[2px] bg-cyan-400/40 animate-scan"></div>
                    </div>

                </div>
            </div>
        </div >
    );
};

export default SoloLevelingNotification;