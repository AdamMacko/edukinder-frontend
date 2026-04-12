"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, ArrowRight, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";

type State = "default" | "loading" | "sent" | "error";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [state, setState] = useState<State>("default");
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const hasError = state === "error" && !!emailErr;

  // Focus a Keyboard skratky
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset pri zatvorení
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setState("default");
        setEmailErr(null);
        setEmail("");
      }, 300); // Počkáme na dobehnutie animácie zatvorenia
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
      return;
    }

    if (!isValidEmail(trimmed)) {
      setEmailErr("Zadajte platnú e-mailovú adresu.");
      setState("error");
      return;
    }

    try {
      setState("loading");
      setEmailErr(null);

      // ZMENA: Voláme len lokálnu cestu, Proxy to pošle na Render!
      const res = await fetch("/api/auth/login/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.error || data?.message || "Nepodarilo sa odoslať odkaz. Skúste to znova."
        );
      }

      setState("sent");
    } catch (err: any) {
      setEmailErr(err.message || "Neznáma chyba servera.");
      setState("error");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Tmavé pozadie s rozmazaním */}
      <div
        className="absolute inset-0 bg-[#3E2E48]/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Samotný Modal */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-[420px] overflow-hidden rounded-[32px] bg-white shadow-[0_20px_60px_-15px_rgba(62,46,72,0.3)] animate-in fade-in zoom-in-[0.96] duration-300 slide-in-from-bottom-4"
      >
        {/* Dekoratívna hlavička s jemným prechodom */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#fcf7f3] to-white px-8 pt-8 pb-6 border-b border-[#3E2E48]/5">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-gradient-to-br from-[#d0a91a]/15 to-transparent blur-2xl" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-24 w-24 rounded-full bg-[#3E2E48]/5 blur-2xl" />
          
          <div className="relative flex justify-between items-start">
            <div>
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#d0a91a]/20 bg-[#d0a91a]/10 px-3 py-1 text-xs font-bold tracking-wide text-[#9b7a00]">
                Bezpečný prístup
              </div>
              <h2 className="text-2xl font-black tracking-tight text-[#3E2E48]">
                Prihlásenie
              </h2>
            </div>
            
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fcf7f3] text-[#3E2E48]/50 transition-colors hover:bg-[#3E2E48]/5 hover:text-[#3E2E48]"
              aria-label="Zatvoriť"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="px-8 py-8">
          {/* ÚSPEŠNÝ STAV */}
          {state === "sent" ? (
            <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f4fbef] border-[6px] border-[#cfe7bf]/30">
                <CheckCircle2 className="h-8 w-8 text-[#547a31]" strokeWidth={2.5} />
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#3E2E48]">Skontrolujte si e-mail</h3>
              <p className="mb-8 text-sm leading-relaxed text-[#3E2E48]/70">
                Poslali sme magický odkaz na <br/>
                <strong className="text-[#3E2E48]">{email}</strong><br/>
                Kliknutím na odkaz sa bezpečne prihlásite. Platí 15 minút.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-2xl bg-[#fcf7f3] px-5 py-3.5 text-sm font-bold text-[#3E2E48] transition-all hover:bg-[#3E2E48]/5 active:scale-[0.98]"
              >
                Rozumiem, zavrieť
              </button>
            </div>
          ) : (
            /* FORMULÁR */
            <form noValidate onSubmit={handleSubmit} className="space-y-6">
              
              {hasError && (
                <div className="flex items-start gap-3 rounded-2xl border border-[#f0caca] bg-[#fbe7e7] p-4 animate-in slide-in-from-top-2">
                  <AlertCircle className="h-5 w-5 text-[#b15252] shrink-0 mt-0.5" strokeWidth={2.5} />
                  <div>
                    <h3 className="text-sm font-bold text-[#a94f4f]">Chyba prihlásenia</h3>
                    <p className="mt-1 text-xs text-[#8f4b4b]">{emailErr}</p>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="login-email" className="mb-2 block text-sm font-bold text-[#3E2E48]">
                  E-mailová adresa
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Mail className={`h-5 w-5 transition-colors ${hasError ? 'text-[#b15252]' : 'text-[#3E2E48]/40'}`} />
                  </div>
                  <input
                    ref={inputRef}
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (hasError) setState("default");
                    }}
                    disabled={state === "loading"}
                    className={`w-full rounded-2xl border bg-white py-3.5 pl-11 pr-4 text-[15px] font-medium text-[#3E2E48] outline-none transition-all placeholder:text-[#3E2E48]/30 focus:ring-4 ${
                      hasError
                        ? "border-[#e4a4a4] focus:border-[#b15252] focus:ring-[#f3caca]"
                        : "border-[#3E2E48]/15 focus:border-[#d0a91a] focus:ring-[#d0a91a]/20"
                    }`}
                    placeholder="meno.priezvisko@skola.sk"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={state === "loading"}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#d0a91a] to-[#e2c26a] px-5 py-4 text-[15px] font-bold text-white shadow-lg shadow-[#d0a91a]/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-80 disabled:scale-100"
              >
                {state === "loading" ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" strokeWidth={3} />
                    Odosielam odkaz...
                  </>
                ) : (
                  <>
                    Získať prístup
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}