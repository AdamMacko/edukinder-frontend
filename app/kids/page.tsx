"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "../components/Header";
import { MOCK_CLASSES, MOCK_CHILDREN, MOCK_TEACHERS } from "./mockData";
import { ClassTabs } from "../components/kids/ClassTabs";
import { ClassInfoCard } from "../components/kids/ClassInfoCard";
import { StudentCard } from "../components/kids/StudentCard";

export default function KidsPage() {
  // Statické dáta pre UI namiesto fetchu
  const [classes, setClasses] = useState(MOCK_CLASSES);
  const [children, setChildren] = useState(MOCK_CHILDREN);
  
  const [activeClass, setActiveClass] = useState<string>("Všetci");
  const [editingChild, setEditingChild] = useState<any | null>(null);

  // Filtrovanie
  const filteredChildren = activeClass === "Všetci"
      ? children
      : children.filter((c) => c.groupName === activeClass);

  const activeGroup = activeClass === "Všetci"
      ? null
      : classes.find((cls) => cls.name === activeClass) ?? null;

  // Handlery pre Modaly (simulácia uloženia)
  const openEditModal = (child: any) => setEditingChild(child);
  const closeEditModal = () => setEditingChild(null);
  
  const handleSaveChild = (e: React.FormEvent) => {
    e.preventDefault();
    // Tu by išiel API call. My len zavrieme modal.
    closeEditModal();
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-[#fcf7f3] text-[#3E2E48] pt-10 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Hlavička stránky */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-4xl font-black tracking-tight text-[#3E2E48]">
              Prehľad tried a detí
            </h1>
            <div className="flex gap-3">
              <Link
                href="/kids-form"
                className="rounded-2xl border border-white/80 bg-white px-5 py-2.5 text-sm font-bold shadow-sm transition hover:shadow-md"
              >
                Pridať dieťa
              </Link>
              <Link
                href="/class-form"
                className="rounded-2xl bg-gradient-to-r from-[#d0a91a] to-[#e2c26a] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-90 hover:shadow-lg"
              >
                Vytvoriť triedu
              </Link>
            </div>
          </div>

          {/* Obal pre obsah (Glassmorphism) */}
          <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/70 p-6 sm:p-8 shadow-[0_20px_60px_rgba(62,46,72,0.08)] backdrop-blur-xl">
            
            <ClassTabs 
              classes={classes} 
              activeClass={activeClass} 
              onSelect={setActiveClass} 
            />

            <ClassInfoCard 
              activeGroup={activeGroup} 
              onEdit={() => alert("Tu by sa otvoril tvoj modal pre triedu :)")} 
            />

            {/* Grid detí */}
            {filteredChildren.length === 0 ? (
              <div className="py-12 text-center text-[#3E2E48]/60 font-medium">
                V tejto triede zatiaľ nie sú žiadne deti.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredChildren.map((child) => (
                  <StudentCard key={child.id} child={child} onEdit={openEditModal} />
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* --- Jednoduchý Modal pre úpravu dieťaťa v novom dizajne --- */}
      {editingChild && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3E2E48]/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md overflow-hidden rounded-[32px] bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-[#3E2E48]/10">
              <h2 className="text-2xl font-black text-[#3E2E48]">Úprava údajov</h2>
            </div>
            
            <form onSubmit={handleSaveChild} className="p-8 flex flex-col gap-5">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#3E2E48]/70">Meno</label>
                <input 
                  type="text" 
                  defaultValue={editingChild.firstName}
                  className="w-full rounded-xl border border-[#3E2E48]/20 bg-[#faf7f4] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#d0a91a] focus:bg-white" 
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#3E2E48]/70">Priezvisko</label>
                <input 
                  type="text" 
                  defaultValue={editingChild.lastName}
                  className="w-full rounded-xl border border-[#3E2E48]/20 bg-[#faf7f4] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#d0a91a] focus:bg-white" 
                />
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button type="submit" className="flex-1 rounded-xl bg-[#d0a91a] py-3 text-sm font-bold text-white shadow-md transition hover:opacity-90">
                  Uložiť
                </button>
                <button type="button" onClick={closeEditModal} className="flex-1 rounded-xl bg-[#f8f5f2] py-3 text-sm font-bold text-[#3E2E48] transition hover:bg-[#eae4de]">
                  Zrušiť
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}