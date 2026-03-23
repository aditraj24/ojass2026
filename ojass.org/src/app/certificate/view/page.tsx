"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CertificateRenderer() {
    const params = useSearchParams();
    const name = params.get("name") || "Participant Name";
    const ojassId = params.get("ojassId") || "OJASS26XXXX";
    const eventName = params.get("eventName") || "EVENT NAME";
    const position = params.get("position"); // "winner" | "runner_up" | null

    const toTitleCase = (str: string) =>
        str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

    const achievementText =
        position === "winner"
            ? <>for securing <u>1st Position</u> in <u>{eventName.toUpperCase()}</u> conducted under the banner of OJASS 2026.</>
            : position === "runner_up"
                ? <>for securing <u>2nd Position</u> in <u>{eventName.toUpperCase()}</u> conducted under the banner of OJASS 2026.</>
                : position === "second_runner_up"
                    ? <>for securing <u>3rd Position</u> in <u>{eventName.toUpperCase()}</u> conducted under the banner of OJASS 2026.</>
                    : <>for actively participating in <u>{eventName.toUpperCase()}</u> conducted under the banner of OJASS 2026.</>;

    return (
        <>
            <style>{`
                @font-face {
                    font-family: 'Amoresa';
                    src: url('/certificate/Amoresa.otf') format('opentype');
                }
                * {
                    box-sizing: border-box;
                    padding: 0;
                    margin: 0;
                }
                html, body {
                    width: 100%;
                    min-height: 100%;
                    background: #0a0a0f;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>

            {/* Centered wrapper — matches index.html exactly but centered on dark bg */}
            <div style={{
                width: "60%",
                position: "relative",
                margin: "auto",
                flexShrink: 0,
            }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={position ? "/certificate/winner_certificate.png" : "/certificate/certificate.png"}
                    alt="Certificate"
                    style={{ width: "100%", display: "block" }}
                />

                {/* Event text — bottom: 40% */}
                <div
                    style={{
                        position: "absolute",
                        color: "rgb(45, 45, 45)",
                        bottom: "40%",
                        left: "15%",
                        right: "15%",
                        textAlign: "center",
                        fontWeight: "normal",
                        fontSize: "1.5vw",
                        fontFamily: "Times New Roman, serif",
                        lineHeight: "2vw",
                    }}>
                    {achievementText}
                </div>

                {/* Participant name — top: 36%, Amoresa font */}
                <div
                    style={{
                        position: "absolute",
                        top: "36%",
                        left: "15%",
                        right: "15%",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "2.8vw",
                        fontFamily: "'Amoresa', serif",
                        color: "rgb(45, 45, 45)",
                    }}>
                    {toTitleCase(name)}
                </div>

                {/* OJASS ID — bottom: 51% */}
                <div
                    style={{
                        position: "absolute",
                        color: "rgb(45, 45, 45)",
                        bottom: "51%",
                        left: "15%",
                        right: "15%",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "1.5vw",
                        letterSpacing: "-1px",
                    }}>
                    {ojassId}
                </div>
            </div>
        </>
    );
}

export default function CertificateViewPage() {
    return (
        <Suspense fallback={null}>
            <CertificateRenderer />
        </Suspense>
    );
}
