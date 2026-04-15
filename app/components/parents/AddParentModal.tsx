"use client";

import { useEffect, useRef, useState } from "react";
import { User, Mail, X, UserPlus } from "lucide-react";

type AddParentModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AddParentModal = ({ isOpen, onClose }: AddParentModalProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus a Keyboard skratky (Escape pre zatvorenie)
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  // Vyčistenie formulára po zatvorení
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setFirstName("");
        setLastName("");
        setEmail("");
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Zatiaľ len frontendová ukážka
    console.log("Pripravené na odoslanie:", { firstName, lastName, email });
    alert(`Rodič ${firstName} ${lastName} by bol pridaný!`);
    onClose();
  };

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
        className="relative w-full max-w-[480px] max-h-[90dvh] overflow-y-auto scrollbar-hide rounded-[32px] bg-white shadow-[0_20px_60px_-15px_rgba(62,46,72,0.3)] animate-in fade-in zoom-in-[0.96] duration-300 slide-in-from-bottom-4"
      >
        {/* Hlavička */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#fcf7f3] to-white px-8 pt-8 pb-6 border-b border-[#3E2E48]/5">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-gradient-to-br from-[#d0a91a]/15 to-transparent blur-2xl" />
          
          <div className="relative flex justify-between items-start">
            <div>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-[#3E2E48]/5">
                <UserPlus className="h-6 w-6 text-[#d0a91a]" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-[#3E2E48]">
                Pridať rodiča
              </h2>
              <p className="mt-1 text-sm text-[#3E2E48]/60 font-medium">
                Vytvorte prístup pre nového rodiča.
              </p>
            </div>
            
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fcf7f3] text-[#3E2E48]/50 transition-colors hover:bg-[#3E2E48]/5 hover:text-[#3E2E48]"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Formulár */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-bold text-[#3E2E48]">Meno</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <User className="h-5 w-5 text-[#3E2E48]/40" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-2xl border border-[#3E2E48]/15 bg-white py-3.5 pl-11 pr-4 text-[15px] font-medium text-[#3E2E48] outline-none transition-all placeholder:text-[#3E2E48]/30 focus:border-[#d0a91a] focus:ring-4 focus:ring-[#d0a91a]/20"
                  placeholder="Napr. Ján"
                />
              </div>
            </div>

            <div className="flex-1">
              <label className="mb-2 block text-sm font-bold text-[#3E2E48]">Priezvisko</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <User className="h-5 w-5 text-[#3E2E48]/40" />
                </div>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-2xl border border-[#3E2E48]/15 bg-white py-3.5 pl-11 pr-4 text-[15px] font-medium text-[#3E2E48] outline-none transition-all placeholder:text-[#3E2E48]/30 focus:border-[#d0a91a] focus:ring-4 focus:ring-[#d0a91a]/20"
                  placeholder="Napr. Novák"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-[#3E2E48]">E-mailová adresa</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Mail className="h-5 w-5 text-[#3E2E48]/40" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-[#3E2E48]/15 bg-white py-3.5 pl-11 pr-4 text-[15px] font-medium text-[#3E2E48] outline-none transition-all placeholder:text-[#3E2E48]/30 focus:border-[#d0a91a] focus:ring-4 focus:ring-[#d0a91a]/20"
                placeholder="jan.novak@email.sk"
              />
            </div>
            <p className="mt-2 text-xs text-[#3E2E48]/50">
              Na tento e-mail mu bude chodiť odkaz na bezheslové prihlásenie.
            </p>
          </div>

          {/* Tlačidlá */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-4 border-t border-[#3E2E48]/5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl px-6 py-3.5 text-sm font-bold text-[#3E2E48]/70 bg-[#fcf7f3] transition-colors hover:bg-[#3E2E48]/5 hover:text-[#3E2E48]"
            >
              Zrušiť
            </button>
            <button
              type="submit"
              disabled={!firstName.trim() || !lastName.trim() || !email.trim()}
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#d0a91a] to-[#e2c26a] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#d0a91a]/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              <UserPlus className="w-4 h-4" strokeWidth={2.5} />
              Pridať rodiča
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};