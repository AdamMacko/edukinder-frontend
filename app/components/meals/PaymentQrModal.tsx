"use client";

import { QRCodeSVG } from "qrcode.react";

type PaymentQrModalProps = {
    open: boolean;
    childName: string;
    qrValue: string;
    details?: {
        recipientName: string;
        iban: string;
        vs: string;
        amount: number;
        note: string;
    };
    onClose: () => void;
};

const formatMoney = (n: number) =>
    `${n.toLocaleString("sk-SK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}€`;

export function PaymentQrModal({
                                   open,
                                   childName,
                                   qrValue,
                                   details,
                                   onClose,
                               }: PaymentQrModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a2130]/35 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-[32px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(62,46,72,0.18)]">
                <div className="flex items-start justify-between border-b border-[#3E2E48]/8 px-6 py-5 sm:px-8">
                    <div>
                        <div className="mb-2 inline-flex rounded-full bg-[#fff7dc] px-3 py-1 text-xs font-bold tracking-wide text-[#9b7a00]">
                            Platobné údaje
                        </div>
                        <h2 className="text-2xl font-black">
                            Platobné údaje – {childName}
                        </h2>
                        <p className="mt-1 text-sm text-[#3E2E48]/60">
                            Naskenujte QR kód vo vašej bankovej aplikácii.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#3E2E48]/10 bg-[#faf7f4] text-xl font-semibold text-[#3E2E48]/70 transition hover:bg-[#f3ede8]"
                    >
                        ×
                    </button>
                </div>

                <div className="px-6 py-6 sm:px-8">
                    <div className="flex justify-center">
                        <div className="rounded-[24px] border border-[#3E2E48]/8 bg-[#fcfaf8] p-6">
                            <QRCodeSVG value={qrValue} size={220} />
                        </div>
                    </div>

                    {details && (
                        <div className="mt-6 overflow-hidden rounded-[24px] border border-[#3E2E48]/8 bg-[#fcfaf8]">
                            <div className="divide-y divide-[#3E2E48]/8 text-sm">
                                <div className="grid grid-cols-[180px_1fr] px-4 py-3">
                                    <div className="font-semibold text-[#3E2E48]/70">Príjemca</div>
                                    <div>{details.recipientName}</div>
                                </div>
                                <div className="grid grid-cols-[180px_1fr] px-4 py-3">
                                    <div className="font-semibold text-[#3E2E48]/70">IBAN</div>
                                    <div><code>{details.iban}</code></div>
                                </div>
                                <div className="grid grid-cols-[180px_1fr] px-4 py-3">
                                    <div className="font-semibold text-[#3E2E48]/70">Suma</div>
                                    <div>{formatMoney(details.amount)}</div>
                                </div>
                                <div className="grid grid-cols-[180px_1fr] px-4 py-3">
                                    <div className="font-semibold text-[#3E2E48]/70">Variabilný symbol</div>
                                    <div><code>{details.vs}</code></div>
                                </div>
                                <div className="grid grid-cols-[180px_1fr] px-4 py-3">
                                    <div className="font-semibold text-[#3E2E48]/70">Správa</div>
                                    <div>{details.note}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    <p className="mt-4 text-sm text-[#3E2E48]/60">
                        Ak QR platba vo vašej banke nefunguje, zadajte platbu manuálne podľa údajov vyššie.
                    </p>
                </div>
            </div>
        </div>
    );
}