"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { WinnerData, WinnerEntry } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IoExitOutline } from "react-icons/io5";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import EventLoader from "@/components/EventLoader";
import EventCard from "@/components/OverlayLayout/EventCard";

interface FetchedEventData {
    id: string;
    name: string;
    description: string;
    img: string;
}

export default function WinnersPage() {
    const { theme } = useTheme();
    const isDystopia = theme === "dystopia";

    const [allWinnerEvents, setAllWinnerEvents] = useState<(WinnerEntry & { img: string; description: string })[]>([]);
    const [selectedEventIndex, setSelectedEventIndex] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem("ojass26_winner_index");
            return saved ? parseInt(saved) : 0;
        }
        return 0;
    });
    
    const [swiperInstance, setSwiperInstance] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [hasRestoredSwiperState, setHasRestoredSwiperState] = useState(false);
    const pendingIndexRef = useRef<number | null>(null);

    useEffect(() => {
        let styleElement = document.getElementById("winners-swiper-styles") as HTMLStyleElement;

        if (!styleElement) {
            styleElement = document.createElement("style");
            styleElement.id = "winners-swiper-styles";
            document.head.appendChild(styleElement);
        }

        const activeScale = 1.1;

        styleElement.textContent = `
    .winners-swiper .swiper-slide {
      transition: transform 300ms ease, opacity 300ms ease;
      transform: scale(0.6) !important;
      opacity: 0.9 !important;
    }
    .winners-swiper .swiper-slide-prev,
    .winners-swiper .swiper-slide-next {
      transform: scale(0.6) !important;
      opacity: 0.9 !important;
    }
    .winners-swiper .swiper-slide-active {
      transform: scale(${activeScale}) !important;
      opacity: 1 !important;
      z-index: 2;
    }
    
    .clip-left {
      clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px);
    }
  `;

        return () => {
            styleElement?.remove();
        };
    }, [selectedEventIndex]);

    useEffect(() => {
        const checkMobile = () => {
            const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
            const isSmallScreen = window.matchMedia("(max-width: 1024px)").matches;
            setIsMobile(isTouchDevice || isSmallScreen);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        setIsLoading(true);

        const savedIndex = localStorage.getItem("ojass26_winner_index");
        if (savedIndex) {
            pendingIndexRef.current = parseInt(savedIndex);
        }

        // Fetch API events to get images and descriptions
        const loadEvents = async () => {
            try {
                const response = await fetch("/api/events");
                const apiEvents: any[] = await response.json();

                const enrichedWinners = WinnerData.map(winner => {
                    // Try to find a matching event by name (case-insensitive and trimmed)
                    const normalizedWinnerName = winner.event_name.toLowerCase().trim();
                    const matchedApiEvent = apiEvents.find(apiEvent => 
                        apiEvent.name.toLowerCase().trim() === normalizedWinnerName || 
                        normalizedWinnerName.includes(apiEvent.name.toLowerCase().trim())
                    );

                    return {
                        ...winner,
                        img: matchedApiEvent?.img || "/home1.jpg", 
                        description: matchedApiEvent?.description || "A remarkable event from Ojass.",
                    };
                });

                setAllWinnerEvents(enrichedWinners);
            } catch (error) {
                console.error("Error fetching event data for winners:", error);
                
                // Fallback if API fails
                setAllWinnerEvents(WinnerData.map(w => ({
                    ...w,
                    img: "/home1.jpg",
                    description: "A remarkable event from Ojass."
                })));
            } finally {
                setIsLoading(false);
            }
        };

        loadEvents();
    }, []);

    useEffect(() => {
        if (pendingIndexRef.current !== null && allWinnerEvents.length > 0) {
            setSelectedEventIndex(pendingIndexRef.current);
            pendingIndexRef.current = null;
        }
    }, [allWinnerEvents]);

    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem("ojass26_winner_index", selectedEventIndex.toString());
        }
    }, [selectedEventIndex, isLoading]);

    return (
        <div className="w-full h-screen relative overflow-hidden" style={{ background: "#000" }}>
            {/* Loader */}
            <div
                className={`fixed inset-0 z-[100] transition-opacity duration-500 ease-in-out pointer-events-none ${
                    isLoading ? "opacity-100 pointer-events-auto" : "opacity-0"
                }`}>
                <EventLoader theme={theme} />
            </div>

            {/* EXIT Button */}
            <Link
                href="/"
                className={`clip-left absolute top-6 left-6 z-50 flex items-center gap-2 px-6 py-3 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 ${isDystopia
                    ? "bg-[#ee8f59]/20 text-white"
                    : "bg-cyan-500/20 text-white"
                }`}>
                <IoExitOutline size={20} />
                <span className="font-semibold tracking-wider">EXIT</span>
            </Link>

            {/* Backgrounds */}
            <div id="events-bg" className="w-full h-full absolute bottom-10 left-0 pointer-events-none">
                <Image
                    src="/home1.jpg"
                    alt="Background"
                    width={1000}
                    height={1000}
                    className={`w-full h-full object-cover opacity-40 ${isDystopia ? "hue-rotate-180" : ""}`}
                    style={{ objectPosition: "center center" }}
                />
            </div>

            <div id="events-fg" className="w-full h-full absolute bottom-0 left-0 pointer-events-none">
                <Image
                    src="/events/ship.png"
                    alt="Ship Foreground"
                    width={1000}
                    height={1000}
                    className={`w-full h-full object-cover scale-105 opacity-80 ${isDystopia ? "hue-rotate-180" : ""}`}
                    style={{ objectPosition: "center center" }}
                />

                <div className="absolute inset-0 flex items-center justify-center w-full md:w-1/2 top-[0vh] pointer-events-auto left-1/2 -translate-x-1/2 z-20">
                    {allWinnerEvents.length > 0 ? (
                        <div className="swiper-3d-container w-full h-full">
                            <Swiper
                                key={`swiper-${allWinnerEvents.length}`}
                                loop={allWinnerEvents.length > 1}
                                spaceBetween={80}
                                slidesPerView={allWinnerEvents.length >= 3 ? 3 : allWinnerEvents.length}
                                centeredSlides={true}
                                initialSlide={selectedEventIndex}
                                onSlideChange={(swiper) => setSelectedEventIndex(swiper.realIndex)}
                                watchSlidesProgress={true}
                                onSwiper={(swiper) => {
                                    setSwiperInstance(swiper);
                                    requestAnimationFrame(() => {
                                        swiper.update();
                                        if (selectedEventIndex > 0 && !hasRestoredSwiperState) {
                                            swiper.slideTo(selectedEventIndex, 0);
                                            setHasRestoredSwiperState(true);
                                        }
                                    });
                                }}
                                className="w-full h-full winners-swiper"
                                style={{ borderRadius: "1rem", width: "100%", height: "100%", background: "transparent", padding: 0 }}
                                breakpoints={{
                                    0: { slidesPerView: 1, spaceBetween: 20, loop: allWinnerEvents.length > 1 },
                                    640: { slidesPerView: 1, spaceBetween: 40, loop: allWinnerEvents.length > 1 },
                                    1024: { slidesPerView: allWinnerEvents.length >= 3 ? 3 : allWinnerEvents.length, spaceBetween: 80, loop: allWinnerEvents.length > 4 },
                                }}
                                modules={[Navigation]}
                                navigation={{ nextEl: ".events-next", prevEl: ".events-prev" }}>
                                
                                {allWinnerEvents.map((event) => (
                                    <SwiperSlide key={`winner-${event.id}`}>
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Link
                                                href={`/winners/${event.id}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    localStorage.setItem("ojass26_winner_index", selectedEventIndex.toString());
                                                }}
                                                className="cursor-pointer block">
                                                <div className="card-wrap w-[260px] md:w-[320px] lg:w-[360px] h-full flex items-center justify-center transform transition-transform hover:scale-105">
                                                    <EventCard
                                                        id={event.id.toString()}
                                                        name={event.event_name}
                                                        description={event.description}
                                                        img={event.img}
                                                    />
                                                </div>
                                            </Link>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Counter */}
                            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
                                <div className={`px-6 py-3 rounded-full backdrop-blur-md border-2 font-mono text-lg font-bold ${isDystopia
                                    ? "bg-[#ee8f59]/20 border-[#ee8f59]/40 text-[#ee8f59] shadow-lg shadow-[#ee8f59]/20"
                                    : "bg-cyan-500/20 border-cyan-400/40 text-cyan-300 shadow-lg shadow-cyan-500/20"
                                }`}>
                                    {selectedEventIndex + 1} / {allWinnerEvents.length}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full text-center">
                            <p className="text-gray-400 text-xl font-mono tracking-wider">No winners found</p>
                        </div>
                    )}
                </div>

                {/* Navigation Arrows */}
                <button
                    className={`events-prev absolute left-[15%] top-1/2 -translate-y-1/2 z-30 pointer-events-auto text-white px-4 py-4 rounded-full backdrop-blur-md border-2 shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 hidden md:block ${isDystopia ? "bg-[#ee8f59]/50 border-[#ff9d6e] shadow-[#ee8f59]/80 hover:bg-[#ee8f59]/70" : "bg-cyan-500/60 border-cyan-300/80 shadow-cyan-400/50 hover:bg-cyan-400/80"}`}
                    aria-label="Previous">
                    <Image width={40} height={40} src={isDystopia ? "/events/previousArrowButtonDystopia.svg" : "/events/previousArrowButtonUtopia.svg"} alt="previous" />
                </button>

                <button
                    className={`events-next absolute right-[15%] top-1/2 -translate-y-1/2 z-30 pointer-events-auto text-white px-4 py-4 rounded-full backdrop-blur-md border-2 shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 hidden md:block ${isDystopia ? "bg-[#ee8f59]/50 border-[#ff9d6e] shadow-[#ee8f59]/80 hover:bg-[#ee8f59]/70" : "bg-cyan-500/60 border-cyan-300/80 shadow-cyan-400/50 hover:bg-cyan-400/80"}`}
                    aria-label="Next">
                    <Image width={40} height={40} src={isDystopia ? "/events/nextArrowButtonDystopia.svg" : "/events/nextArrowButtonUtopia.svg"} alt="next" />
                </button>
            </div>
        </div>
    );
}
