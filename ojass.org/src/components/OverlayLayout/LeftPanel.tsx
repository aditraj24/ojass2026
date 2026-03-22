import { useTheme } from "@/contexts/ThemeContext";
import { NavItems } from "@/lib/constants";
import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function LeftPanel() {
    const { theme } = useTheme();
    const isDystopia = theme === "dystopia";
    const panelRef = useRef<HTMLDivElement>(null);

    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        if (!panelRef.current) return;

        gsap.fromTo(
            panelRef.current,
            { x: -100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.2 },
        );
    }, []);

    useEffect(() => {
        if (!window) return;

        setIsSmallScreen(window.matchMedia("(max-width: 640px)").matches);
    }, []);

    const clipPath = isSmallScreen
        ? "polygon(0% 0%, 20px 0%, 80% 50px, 75% 90%, 95% 100%, 0% 100%)"
        : "polygon(0% 0%, 30px 0%, 100% 50px, 80% 95%, 100% 100%, 0% 100%)";

    return (
        <div
            ref={panelRef}
            className={`layout-panel w-[60px] h-[50vh] fixed bottom-0 left-0 flex flex-col items-center justify-center hud-grid py-10 pt-14 pr-3 z-[100] ${
                isDystopia ? "is-dystopia" : ""
            }`}
            style={{
                position: "fixed",
                bottom: "0",
                left: "0",
                clipPath: clipPath,
            }}>
            <div className="flex flex-col items-center justify-between h-full py-2">
                {/* Navigation Icons */}
                {NavItems.map((item, idx) => (
                    <Link
                        key={idx}
                        href={
                            item.title === "Home"
                                ? "/"
                                : item.title === "Winner"
                                ? "/winners"
                                : item.title.toLowerCase().replace(" ", "-")
                        }
                        className={`layout-text flex flex-col items-center cursor-pointer hover:scale-110 transition-transform ${
                            isDystopia ? "is-dystopia" : ""
                        }`}
                        title={item.title}>
                        <item.element className="size-6" />
                        <div className="text-[10px] w-10 font-bold tracking-tighter text-center wrap-anywhere">
                            {item.title}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
