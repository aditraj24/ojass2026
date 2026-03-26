"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CertificateRenderer() {
    const params = useSearchParams();
    const rawName = params.get("name") || "Participant Name";
    const name = rawName.trim().length > 30 ? rawName.trim().substring(0, 30) + "..." : rawName.trim();
    const ojassId = params.get("ojassId") || "OJASS26XXXX";
    const eventName = params.get("eventName") || "EVENT NAME";

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
                    src="/certificate/certificate.png"
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
                    for actively participating in{" "}
                    <u>{eventName.toUpperCase()}</u> conducted under the banner
                    of OJASS 2026.
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
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}>
                    {name}
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
