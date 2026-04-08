"use client";

import { useEffect, useRef, useState } from "react";

type State = "default" | "sent" | "error";

type LoginModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const API_BASE = "https://edu-kinder.onrender.com";

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [state, setState] = useState<State>("default");
    const [email, setEmail] = useState("");
    const [emailErr, setEmailErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const errSummaryRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const hasError = !!emailErr;
    const emailErrorId = "login-email-error";
    const emailHintId = "login-email-hint";

    useEffect(() => {
        if (!isOpen) return;

        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 50);

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) {
            setState("default");
            setEmailErr(null);
            setLoading(false);
        }
    }, [isOpen]);

    function isValidEmail(v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const trimmed = email.trim();

        if (!trimmed) {
            setEmailErr("Zadajte e-mailovú adresu.");
            setState("error");
            queueMicrotask(() => errSummaryRef.current?.focus());
            return;
        }

        if (!isValidEmail(trimmed)) {
            setEmailErr("Zadajte platnú e-mailovú adresu.");
            setState("error");
            queueMicrotask(() => errSummaryRef.current?.focus());
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/auth/login-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: trimmed }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(
                    (data as any)?.error ||
                    (data as any)?.message ||
                    "Chyba pri odoslaní."
                );
            }

            setEmail(trimmed);
            setEmailErr(null);
            setState("sent");
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : typeof err === "string"
                        ? err
                        : "Neznáma chyba";

            setEmailErr(message);
            setState("error");
            queueMicrotask(() => errSummaryRef.current?.focus());
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2a2130]/45 p-4 backdrop-blur-sm">
            <div
                className="absolute inset-0"
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="login-modal-title"
                className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(62,46,72,0.18)]"
            >
                <div className="relative border-b border-[#3E2E48]/8 bg-[linear-gradient(135deg,rgba(208,169,26,0.10),rgba(255,255,255,0.88),rgba(116,132,255,0.08))] px-6 py-5 sm:px-8">
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute -top-10 right-0 h-28 w-28 rounded-full bg-[#d0a91a]/10 blur-3xl" />
                        <div className="absolute bottom-0 left-6 h-20 w-20 rounded-full bg-[#b9c9ff]/20 blur-3xl" />
                    </div>

                    <div className="relative flex items-start justify-between gap-4">
                        <div>
                            <div className="mb-2 inline-flex rounded-full border border-[#d0a91a]/20 bg-[#fff8e0] px-3 py-1 text-xs font-semibold tracking-wide text-[#9b7a00]">
                                Bezpečné prihlásenie
                            </div>
                            <h2
                                id="login-modal-title"
                                className="text-2xl font-black tracking-tight text-[#3E2E48]"
                            >
                                Prihlásenie
                            </h2>
                            <p className="mt-2 text-sm text-[#3E2E48]/70">
                                Zadajte e-mail a pošleme vám jednorazový prihlasovací odkaz s
                                platnosťou 15 minút.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#3E2E48]/10 bg-white/80 text-xl font-semibold text-[#3E2E48]/70 transition hover:bg-[#f3ede8]"
                            aria-label="Zatvoriť"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div className="px-6 py-6 sm:px-8">
                    {state === "error" && hasError && (
                        <div
                            ref={errSummaryRef}
                            tabIndex={-1}
                            role="alert"
                            className="mb-5 rounded-[24px] border border-[#f0caca] bg-[#fbe7e7] p-4"
                        >
                            <h3 className="text-sm font-bold text-[#a94f4f]">
                                Je potrebné opraviť chybu
                            </h3>
                            <p className="mt-2 text-sm text-[#8f4b4b]">{emailErr}</p>
                        </div>
                    )}

                    {state === "sent" ? (
                        <div className="rounded-[24px] border border-[#cfe7bf] bg-[#f4fbef] p-5">
                            <h3 className="text-base font-bold text-[#547a31]">Úspech</h3>
                            <p className="mt-2 text-sm leading-relaxed text-[#4b6634]">
                                Odkaz na prihlásenie sme poslali na{" "}
                                <strong>{email || "zadaný e-mail"}</strong>. Odkaz je
                                jednorazový a platí 15 minút.
                            </p>

                            <div className="mt-5 flex justify-end">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-2xl bg-[#3E2E48] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
                                >
                                    Zavrieť
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form noValidate onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="login-email"
                                    className="mb-2 block text-sm font-bold text-[#3E2E48]"
                                >
                                    E-mail
                                </label>

                                <div
                                    id={emailHintId}
                                    className="mb-2 text-sm text-[#3E2E48]/60"
                                >
                                    Napr. meno.priezvisko@email.com
                                </div>

                                {hasError && (
                                    <p
                                        id={emailErrorId}
                                        className="mb-2 text-sm font-medium text-[#b15252]"
                                    >
                                        {emailErr}
                                    </p>
                                )}

                                <input
                                    ref={inputRef}
                                    id="login-email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    inputMode="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (emailErr) setEmailErr(null);
                                    }}
                                    aria-describedby={`${emailHintId}${hasError ? ` ${emailErrorId}` : ""}`}
                                    aria-invalid={hasError}
                                    required
                                    disabled={loading}
                                    className={`w-full rounded-2xl border bg-[#fcfaf8] px-4 py-3 text-[#3E2E48] outline-none transition placeholder:text-[#3E2E48]/35 focus:ring-4 ${
                                        hasError
                                            ? "border-[#e4a4a4] focus:ring-[#f3caca]"
                                            : "border-[#3E2E48]/12 focus:border-[#d0a91a] focus:ring-[#f5e6aa]"
                                    }`}
                                    placeholder="vas@email.com"
                                />
                            </div>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-2xl border border-[#3E2E48]/10 bg-white px-5 py-3 text-sm font-semibold text-[#3E2E48] transition hover:bg-[#faf7f4]"
                                    disabled={loading}
                                >
                                    Zrušiť
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    aria-busy={loading}
                                    className="rounded-2xl bg-[#d0a91a] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#d0a91a]/20 transition hover:translate-y-[-1px] hover:shadow-xl disabled:translate-y-0 disabled:opacity-70"
                                >
                                    {loading ? "Odosielam..." : "Pošlite mi odkaz"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}