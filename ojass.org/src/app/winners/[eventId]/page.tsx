"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { WinnerData } from "@/lib/constants";
import { IoArrowBackOutline } from "react-icons/io5";

export default function WinnerDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
    const { theme } = useTheme();
    const isDystopia = theme === "dystopia";
    const accentColor = isDystopia ? "#ee8f59" : "#06b6d4";
    const accentRgb = isDystopia ? "238, 143, 89" : "6, 182, 212";

    const { eventId } = use(params);
    const event = WinnerData.find((e) => e.id.toString() === eventId);

    if (!event) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4" style={{ color: accentColor }}>Event Not Found</h1>
                    <Link
                        href="/winners"
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border transition-all hover:scale-105 ${
                            isDystopia ? "border-[#ee8f59] text-[#ee8f59] hover:bg-[#ee8f59]/10" : "border-cyan-500 text-cyan-500 hover:bg-cyan-500/10"
                        }`}
                    >
                        <IoArrowBackOutline /> Return to Winners
                    </Link>
                </div>
            </div>
        );
    }

    const podiumData = [
        {
            place: "1st",
            color: "text-yellow-400",
            team: event.winner,
            image: "/events/firstposition.png",
            height: "h-40 md:h-56",
            delay: "200ms",
            scale: "scale-100 md:scale-105",
            accentObj: "255, 215, 0",
            medal: "🥇"
        },
        {
            place: "2nd",
            color: "text-gray-300",
            team: event.runner_up,
            image: "/events/secondposition.png",
            height: "h-32 md:h-40",
            delay: "400ms",
            scale: "scale-90 md:scale-95",
            accentObj: "192, 192, 192",
            medal: "🥈"
        },
        {
            place: "3rd",
            color: "text-amber-600",
            team: event.second_runner_up,
            image: "/events/thirdposition.png",
            height: "h-28 md:h-36",
            delay: "600ms",
            scale: "scale-85 md:scale-90",
            accentObj: "205, 127, 50",
            medal: "🥉"
        },
    ];

    return (
        <div className="w-full min-h-screen relative bg-[#050505] overflow-x-hidden pt-20 md:pt-28 pb-16 font-sans">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Image
                    src="/home1.jpg"
                    alt="Background"
                    fill
                    className={`object-cover opacity-30 ${isDystopia ? "hue-rotate-180" : ""} mix-blend-screen`}
                />
                
                {/* Dynamic Vignette & Gradients */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
                <div className="absolute top-0 left-0 w-full h-[50vh] opacity-20 blur-[100px]" style={{ background: `radial-gradient(ellipse at top, ${accentColor}, transparent 70%)` }} />
                <div className="absolute bottom-0 left-0 w-full h-[40vh] opacity-10 blur-[80px]" style={{ background: `linear-gradient(to top, ${accentColor}, transparent)` }} />
            </div>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-4 md:px-8 max-w-7xl">
                
                {/* Back Button */}
                <div className="flex justify-center md:justify-start mb-10 w-full animate-fade-in-down">
                    <Link
                        href="/winners"
                        className="group relative inline-flex items-center gap-3 px-6 py-3 overflow-hidden rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/30"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        <IoArrowBackOutline size={20} className="text-white/80 group-hover:text-white transition-colors" />
                        <span className="font-bold tracking-[0.2em] text-xs md:text-sm text-white/80 group-hover:text-white transition-colors uppercase">
                            Winners Gallery
                        </span>
                        <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`, opacity: 0.5 }} />
                    </Link>
                </div>

                {/* Event Title Header */}
                <div className="text-center mb-16 md:mb-24 animate-fade-in-up">
                    <div className="inline-block relative">
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-mono tracking-[0.4em] uppercase opacity-70 mb-2" style={{ color: accentColor }}>
                            OJASS 2026 OFFICIAL RESULTS
                        </span>
                        <h1
                            className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text uppercase tracking-widest mb-2 drop-shadow-2xl"
                            style={{ 
                                backgroundImage: `linear-gradient(135deg, #ffffff 0%, rgba(${accentRgb}, 0.8) 50%, #ffffff 100%)`,
                                filter: `drop-shadow(0 0 15px rgba(${accentRgb}, 0.3))`
                            }}
                        >
                            {event.event_name}
                        </h1>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 md:w-64 h-[2px] opacity-70" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
                    </div>
                </div>

                {/* Cyberpunk Podium Container */}
                <div className="mt-8 relative">
                    {/* Glowing Floor Base */}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[120%] h-32 blur-3xl opacity-20 rounded-full" style={{ background: accentColor }} />
                    
                    <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-8 md:gap-6 lg:gap-10">
                        {podiumData.map((item) => {
                            const team = item.team;
                            if (!team) return null;

                            return (
                                <div
                                    key={item.place}
                                    className={`relative w-full md:w-1/3 max-w-sm flex flex-col items-center animate-slide-up ${item.scale} group z-10 hover:z-20`}
                                    style={{ animationDelay: item.delay, animationFillMode: "both" }}
                                >
                                    {/* Trophy Holographic Glow */}
                                    <div className="relative w-full flex justify-center items-center mb-6">
                                        <div className="absolute w-[180%] aspect-square rounded-full opacity-0 group-hover:opacity-40 blur-[40px] transition-opacity duration-700" 
                                             style={{ background: `radial-gradient(circle, rgba(${item.accentObj}, 0.8) 0%, transparent 70%)` }} />
                                        
                                        <div className={`relative ${item.height} aspect-square w-[100px] md:w-[140px] lg:w-[160px] z-10 transition-transform duration-700 ease-out group-hover:translate-y-[-10px] group-hover:scale-110 drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]`}>
                                            <Image
                                                src={item.image}
                                                alt={`${item.place} place trophy`}
                                                fill
                                                className="object-contain"
                                                priority={item.place === '1st'}
                                            />
                                        </div>
                                    </div>

                                    {/* Winner Premium Card */}
                                    <div
                                        className="w-full relative overflow-visible rounded-2xl border border-white/10 backdrop-blur-xl p-8 text-center transition-all duration-500 hover:border-white/30 hover:shadow-2xl flex-grow flex flex-col items-center"
                                        style={{
                                            background: `linear-gradient(160deg, rgba(20, 20, 20, 0.9) 0%, rgba(5, 5, 5, 0.95) 100%)`,
                                            boxShadow: `0 10px 40px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(${item.accentObj}, 0.05)`,
                                        }}
                                    >
                                        {/* Medal Badge Overlap */}
                                        <div 
                                            className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center border-4 border-[#111] z-20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[360deg]"
                                            style={{ 
                                                background: `linear-gradient(135deg, rgba(${item.accentObj}, 1) 0%, rgba(${item.accentObj}, 0.5) 100%)`,
                                                boxShadow: `0 0 20px rgba(${item.accentObj}, 0.4), inset 0 0 10px rgba(255,255,255,0.4)`
                                            }}
                                        >
                                            <span className="text-2xl drop-shadow-md">{item.medal}</span>
                                        </div>

                                        {/* Colored Top Accent Line */}
                                        <div className="absolute top-0 left-0 w-full h-[2px] rounded-t-2xl opacity-80" 
                                             style={{ background: `linear-gradient(90deg, transparent, rgba(${item.accentObj}, 1), transparent)` }} />

                                        <div className="mt-6 flex flex-col items-center w-full">
                                            <h3 className={`text-sm md:text-base font-black tracking-[0.3em] uppercase mb-1 opacity-80`} style={{ color: `rgb(${item.accentObj})` }}>
                                                {item.place} PRIZE
                                            </h3>
                                            
                                            <h4 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider mb-4 leading-tight">
                                                {team.team_name}
                                            </h4>

                                            {/* Divider */}
                                            <div className="w-12 h-[1px] bg-white/20 mb-4" />

                                            {/* Members List */}
                                            <div className="w-full flex flex-col gap-2">
                                                {team.members.map((member, i) => (
                                                    <div key={i} className="px-3 py-2 rounded-lg bg-white/5 border border-white/5 flex flex-col items-center justify-center group/member hover:bg-white/10 transition-colors">
                                                        <span className="text-gray-200 text-sm md:text-base font-semibold tracking-wide truncate group-hover/member:text-white transition-colors">
                                                            {member}
                                                        </span>
                                                        {team.ojass_ids && team.ojass_ids[i] && (
                                                            <span className="text-gray-400 text-xs font-mono tracking-widest mt-0.5 opacity-80 group-hover/member:opacity-100 transition-opacity">
                                                                {team.ojass_ids[i]}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {/* Bottom Glow */}
                                        <div className="absolute bottom-0 left-0 w-full h-[1px] opacity-30" 
                                             style={{ background: `linear-gradient(90deg, transparent, rgba(${item.accentObj}, 1), transparent)` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .animate-fade-in-down {
                    animation: fadeInDown 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-fade-in-up {
                    animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-slide-up {
                    opacity: 0;
                    transform: translateY(60px);
                    animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite linear;
                }
                
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(60px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}
