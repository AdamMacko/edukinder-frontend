"use client";

import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";

type PaymentSlipPdfCardProps = {
    childName: string;
    monthLabel: string;
    details: {
        recipientName: string;
        iban: string;
        vs: string;
        amount: number;
        note: string;
    };
    qrValue: string;
};

const formatMoney = (n: number) =>
    `${n.toLocaleString("sk-SK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} €`;

export function PaymentSlipPdfCard({
                                       childName,
                                       monthLabel,
                                       details,
                                       qrValue,
                                   }: PaymentSlipPdfCardProps) {
    const [qrImageData, setQrImageData] = useState<string>("");

    useEffect(() => {
        // Toto je presne to, čo bolo na tvojom obrázku:
        // Nájdeme skrytý canvas, skonvertujeme ho na base64 a uložíme do state
        const timer = setTimeout(() => {
            const canvas = document.querySelector("#hidden-qr-render canvas") as HTMLCanvasElement;
            if (canvas) {
                const dataUrl = canvas.toDataURL("image/png");
                setQrImageData(dataUrl);
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [qrValue]);

    return (
        <div
            id="payment-slip-pdf-card"
            style={{
                width: "900px",
                background: "#ffffff",
                color: "#3E2E48",
                padding: "40px",
                borderRadius: "24px",
                fontFamily: "Arial, sans-serif",
            }}
        >
            {/* 1. SKRYTÝ RENDERER: Tu sa vyrobí canvas, ktorý neuvidíme */}
            <div id="hidden-qr-render" style={{ display: "none" }}>
                <QRCodeCanvas value={qrValue} size={256} />
            </div>

            <div
                style={{
                    border: "1px solid rgba(62,46,72,0.12)",
                    borderRadius: "24px",
                    overflow: "hidden",
                    background: "#fcfaf8",
                }}
            >
                {/* Hlavička */}
                <div style={{ padding: "32px", borderBottom: "1px solid rgba(62,46,72,0.08)", background: "linear-gradient(135deg, rgba(208,169,26,0.05), #ffffff)" }}>
                    <div style={{ display: "inline-block", padding: "6px 12px", borderRadius: "999px", background: "#fff7dc", color: "#9b7a00", fontSize: "12px", fontWeight: 700, marginBottom: "12px" }}>
                        Platobný príkaz
                    </div>
                    <h1 style={{ margin: 0, fontSize: "36px", fontWeight: 800 }}>Stravné</h1>
                    <p style={{ margin: "8px 0 0 0", fontSize: "18px", color: "rgba(62,46,72,0.6)" }}>
                        Podklad k úhrade: <strong>{childName}</strong>
                    </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "40px", padding: "32px" }}>
                    <div>
                        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", rowGap: "16px", fontSize: "16px" }}>
                            <div style={{ color: "rgba(62,46,72,0.5)", fontWeight: 700 }}>Obdobie</div><div>{monthLabel}</div>
                            <div style={{ color: "rgba(62,46,72,0.5)", fontWeight: 700 }}>Príjemca</div><div>{details.recipientName}</div>
                            <div style={{ color: "rgba(62,46,72,0.5)", fontWeight: 700 }}>IBAN</div><div style={{ fontFamily: "monospace" }}>{details.iban}</div>
                            <div style={{ color: "rgba(62,46,72,0.5)", fontWeight: 700 }}>Variabilný symbol</div><div>{details.vs}</div>
                            <div style={{ color: "rgba(62,46,72,0.5)", fontWeight: 700 }}>Suma</div>
                            <div style={{ fontSize: "28px", fontWeight: 900, color: "#9b7a00" }}>{formatMoney(details.amount)}</div>
                            <div style={{ color: "rgba(62,46,72,0.5)", fontWeight: 700 }}>Správa</div><div>{details.note}</div>
                        </div>
                    </div>

                    {/* 2. VIDITEĽNÝ OBRÁZOK: html2canvas odfotí tento tag <img> */}
                    <div style={{ textAlign: "center", background: "#ffffff", padding: "24px", borderRadius: "20px", border: "1px solid rgba(62,46,72,0.08)" }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>QR platba</div>
                        <div style={{ display: "inline-block", minWidth: "220px", minHeight: "220px" }}>
                            {qrImageData ? (
                                <img src={qrImageData} alt="QR kód" style={{ width: "220px", height: "220px" }} />
                            ) : (
                                <div style={{ width: "220px", height: "220px", background: "#f3f3f3" }} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}