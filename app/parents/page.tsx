"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Header } from "@/app/components/Header";
import { ParentCard } from "../components/parents/ParentCard";
import { Search, UserPlus, ArrowUpDown } from "lucide-react";
import { MOCK_PARENTS } from "./mockData"; // Import statických dát

export default function ParentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const rowRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Klientske filtrovanie
  const filteredParents = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return MOCK_PARENTS.filter(p => 
      `${p.firstName} ${p.lastName} ${p.email}`.toLowerCase().includes(lower) ||
      p.children.some(c => c.toLowerCase().includes(lower))
    );
  }, [searchTerm]);

  // Click outside menu logic
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (openMenu !== null) {
        const currentRef = rowRefs.current[openMenu];
        if (currentRef && !currentRef.contains(e.target as Node)) {
          setOpenMenu(null);
        }
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [openMenu]);

  return (
    <div className="min-h-screen bg-[#fcf7f3] text-[#3E2E48] pb-20">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        
        {/* TOP SECTION */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-[#3E2E48] mb-2">
              Rodičia
            </h1>
            <p className="text-[#3E2E48]/60 font-medium">
              Správa prístupov a prehľad priradených detí.
            </p>
          </div>
          
          <button
            className="group flex items-center justify-center gap-2 rounded-2xl bg-[#d0a91a] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#d0a91a]/20 transition-all hover:opacity-90 hover:-translate-y-0.5"
          >
            <UserPlus className="w-5 h-5" />
            Pridať rodiča
          </button>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="mb-8 overflow-hidden rounded-[32px] border border-white/70 bg-white/70 p-4 shadow-[0_20px_60px_rgba(62,46,72,0.05)] backdrop-blur-xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3E2E48]/30" />
              <input
                type="text"
                placeholder="Hľadať podľa mena, emailu alebo dieťaťa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-[#3E2E48]/10 bg-white px-12 py-4 text-sm font-semibold outline-none transition focus:border-[#d0a91a] focus:ring-4 focus:ring-[#d0a91a]/5"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-[#3E2E48]/10 bg-white text-sm font-bold text-[#3E2E48]/60 hover:bg-[#faf7f4] transition-colors">
              <ArrowUpDown className="w-4 h-4" /> Zoradiť
            </button>
          </div>
        </div>

        {/* GRID S KARTAMI */}
        {filteredParents.length === 0 ? (
          <div className="rounded-[32px] border border-[#3E2E48]/5 bg-white/50 p-20 text-center text-[#3E2E48]/40 font-bold">
            Nenašli sa žiadni rodičia
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredParents.map((parent) => (
              <ParentCard
                key={parent.id}
                parent={parent}
                isMenuOpen={openMenu === parent.id}
                onMenuToggle={() => setOpenMenu(openMenu === parent.id ? null : parent.id)}
                onEdit={() => alert(`Upraviť rodiča: ${parent.firstName}`)}
                onDelete={() => alert(`Zmazať rodiča: ${parent.firstName}`)}
                onViewChildren={() => alert(`Deti: ${parent.children.join(', ')}`)}
                menuRef={(el: any) => { rowRefs.current[parent.id] = el; }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}