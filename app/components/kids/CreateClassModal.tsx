"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Users, Home, GraduationCap, Baby, Search } from "lucide-react";

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableTeachers: any[];
  availableChildren: any[];
}

export const CreateClassModal = ({
  isOpen,
  onClose,
  availableTeachers,
  availableChildren,
}: CreateClassModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChildren, setSelectedChildren] = useState<number[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedChildren([]);
      setSearchTerm("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("Odosielam dáta...");

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  const filteredChildren = availableChildren.filter((child) =>
    `${child.firstName} ${child.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleChild = (childId: number) => {
    setSelectedChildren((prev) =>
      prev.includes(childId) ? prev.filter((id) => id !== childId) : [...prev, childId]
    );
  };

  return (
    <div className="fixed inset-0 z-[110]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#3E2E48]/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Wrapper */}
      <div className="relative flex min-h-dvh items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-[28px] sm:rounded-[32px] md:rounded-[40px] bg-white shadow-2xl max-h-[92dvh]">
          {/* Header */}
          <div className="shrink-0 border-b border-[#3E2E48]/5 bg-[#fcf7f3]/60 px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-black text-[#3E2E48] leading-tight">
                  Vytvoriť novú triedu
                </h2>
                <p className="mt-1 text-xs sm:text-sm font-bold text-[#3E2E48]/40">
                  Zadefinujte skupinu a priraďte deti
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Zavrieť modal"
                className="shrink-0 rounded-full p-2 transition-colors hover:bg-[#3E2E48]/5"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6 text-[#3E2E48]/40" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            {/* Scrollable content */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
                {/* ĽAVÁ STRANA */}
                <div className="space-y-5">
                  <section>
                    <label className="mb-2 flex items-center gap-2 text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#3E2E48]/40">
                      <Users className="h-3.5 w-3.5" />
                      Názov a označenie
                    </label>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(110px,1fr)]">
                      <input
                        required
                        placeholder="Meno (napr. Včielky)"
                        className="w-full rounded-2xl border-2 border-transparent bg-[#fcf7f3] px-4 py-3 text-sm font-bold text-[#3E2E48] placeholder:text-[#3E2E48]/40 outline-none transition-all focus:border-[#d0a91a] focus:bg-white"
                      />
                      <input
                        required
                        placeholder="Trieda"
                        className="w-full rounded-2xl border-2 border-transparent bg-[#fcf7f3] px-4 py-3 text-center text-sm font-bold uppercase text-[#3E2E48] placeholder:text-[#3E2E48]/40 outline-none transition-all focus:border-[#d0a91a] focus:bg-white"
                      />
                    </div>
                  </section>

                  <section>
                    <label className="mb-2 flex items-center gap-2 text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#3E2E48]/40">
                      <Home className="h-3.5 w-3.5" />
                      Miestnosť
                    </label>
                    <input
                      placeholder="napr. Prízemie vpravo"
                      className="w-full rounded-2xl border-2 border-transparent bg-[#fcf7f3] px-4 py-3 text-sm font-bold text-[#3E2E48] placeholder:text-[#3E2E48]/40 outline-none transition-all focus:border-[#d0a91a] focus:bg-white"
                    />
                  </section>

                  <section>
                    <label className="mb-2 flex items-center gap-2 text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#3E2E48]/40">
                      <GraduationCap className="h-3.5 w-3.5" />
                      Triedny učiteľ
                    </label>
                    <select className="w-full cursor-pointer appearance-none rounded-2xl border-2 border-transparent bg-[#fcf7f3] px-4 py-3 text-sm font-bold text-[#3E2E48] outline-none transition-all focus:border-[#d0a91a] focus:bg-white">
                      <option value="">Vyberte učiteľa...</option>
                      {availableTeachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.firstName} {t.lastName}
                        </option>
                      ))}
                    </select>
                  </section>
                </div>

                {/* PRAVÁ STRANA */}
                <div className="flex min-h-0 flex-col">
                  <label className="mb-2 flex items-center justify-between gap-3 text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#3E2E48]/40">
                    <span className="flex items-center gap-2">
                      <Baby className="h-3.5 w-3.5" />
                      Deti
                    </span>
                    <span className="whitespace-nowrap text-[#d0a91a]">
                      {selectedChildren.length} vybraných
                    </span>
                  </label>

                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3E2E48]/30" />
                    <input
                      type="text"
                      placeholder="Hľadať dieťa..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-xl border border-transparent bg-[#fcf7f3] py-2.5 pl-9 pr-4 text-sm font-bold text-[#3E2E48] placeholder:text-[#3E2E48]/40 outline-none transition-all focus:border-[#d0a91a]/30"
                    />
                  </div>

                  <div className="min-h-[220px] sm:min-h-[260px] lg:min-h-[320px] max-h-[40dvh] lg:max-h-[52dvh] overflow-y-auto rounded-3xl border border-[#3E2E48]/5 bg-[#fcf7f3] p-3">
                    {filteredChildren.length > 0 ? (
                      filteredChildren.map((child) => (
                        <label
                          key={child.id}
                          className="group mb-1 flex cursor-pointer items-start gap-3 rounded-xl p-2.5 transition-all hover:bg-white"
                        >
                          <input
                            type="checkbox"
                            className="mt-0.5 h-4 w-4 rounded-md border-[#3E2E48]/20 accent-[#d0a91a] focus:ring-[#d0a91a]"
                            checked={selectedChildren.includes(child.id)}
                            onChange={() => toggleChild(child.id)}
                          />

                          <div className="min-w-0 flex flex-col">
                            <span className="truncate text-sm font-bold text-[#3E2E48] transition-colors group-hover:text-[#d0a91a]">
                              {child.firstName} {child.lastName}
                            </span>
                            <span className="text-[10px] sm:text-[11px] font-medium text-[#3E2E48]/40">
                              Aktuálne: {child.groupName || "Bez triedy"}
                            </span>
                          </div>
                        </label>
                      ))
                    ) : (
                      <p className="py-10 text-center text-[11px] font-bold text-[#3E2E48]/30">
                        Nenašli sa žiadne deti
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-[#3E2E48]/5 bg-white px-4 py-4 sm:px-6 md:px-8">
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-2xl bg-[#fcf7f3] px-6 py-3.5 font-bold text-[#3E2E48]/50 transition-all hover:bg-[#3E2E48]/5 sm:w-auto"
                >
                  Zrušiť
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex-1 rounded-2xl bg-gradient-to-r from-[#d0a91a] to-[#e2c26a] py-3.5 text-base font-black text-white shadow-lg shadow-[#d0a91a]/20 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 sm:text-lg"
                >
                  {isSubmitting ? (
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                  ) : (
                    "Vytvoriť a uložiť"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};