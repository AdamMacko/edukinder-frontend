"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/app/components/header/Header";
import { ClassTabs } from "../components/kids/ClassTabs";
import { CreateClassModal } from "../components/kids/CreateClassModal";
import { ClassInfoCard } from "../components/kids/ClassInfoCard";
import { StudentCard } from "../components/kids/StudentCard";
import { Loader2 } from "lucide-react";

// API importy
import { 
  fetchAllChildren, 
  updateChild, 
  fetchClasses, 
  type Child, 
  type ClassGroup 
} from "@/lib/api/children";

export default function KidsPage() {
  // --- STAVY (States) ---
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [teachers, setTeachers] = useState([]); // Tu budú učitelia z DB
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [activeClass, setActiveClass] = useState<string>("Všetci");
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- NAČÍTANIE DÁT (Fetch) ---
  const loadData = async () => {
    try {
      setLoading(true);
      // Tu neskôr pridaj aj fetchTeachers(), keď budeš mať hotovú routu
      const [kidsData, classesData] = await Promise.all([
        fetchAllChildren(),
        fetchClasses()
      ]);
      
      setChildren(kidsData);
      setClasses(classesData);
    } catch (err) {
      console.error("Chyba pri načítaní dát zo servera:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- FILTROVANIE ---
  const filteredChildren = activeClass === "Všetci"
    ? children
    : children.filter((c) => c.groupName === activeClass);

  const activeGroup = activeClass === "Všetci"
    ? null
    : classes.find((cls) => cls.name === activeClass) ?? null;

  // --- HANDLERY ---
  const openEditModal = (child: Child) => setEditingChild(child);
  const closeEditModal = () => setEditingChild(null);

  const handleSaveChild = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingChild) return;

    const formData = new FormData(e.currentTarget);
    const updatedData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      groupName: editingChild.groupName,
    };

    try {
      setIsSaving(true);
      await updateChild(editingChild.id, updatedData);
      await loadData(); // Refresh dát po uložení
      closeEditModal();
    } catch (err) {
      alert("Nepodarilo sa uložiť zmeny dieťaťa.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-[#fcf7f3] text-[#3E2E48] pt-10 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Hlavička s nadpisom a akciami */}
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
              
              {/* Tlačidlo pre otvorenie modalu triedy */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="rounded-2xl bg-gradient-to-r from-[#d0a91a] to-[#e2c26a] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-90 hover:shadow-lg active:scale-95"
              >
                Vytvoriť triedu
              </button>
            </div>
          </div>

          {/* Hlavný biely kontajner */}
          <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/70 p-6 sm:p-8 shadow-[0_20px_60px_rgba(62,46,72,0.08)] backdrop-blur-xl">

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-[#d0a91a] mb-4" />
                <p className="font-bold text-[#3E2E48]/40 text-lg uppercase tracking-widest">
                  Načítavam EduKinder...
                </p>
              </div>
            ) : (
              <>
                <ClassTabs
                  classes={classes}
                  activeClass={activeClass}
                  onSelect={setActiveClass}
                />

                <ClassInfoCard
                  activeGroup={activeGroup}
                  onEdit={() => alert("Tu neskôr pridáme editáciu triedy")}
                />

                {filteredChildren.length === 0 ? (
                  <div className="py-20 text-center text-[#3E2E48]/40 font-bold text-xl italic">
                    V tejto triede zatiaľ nie sú žiadne deti.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {filteredChildren.map((child) => (
                      <StudentCard 
                        key={child.id} 
                        child={child} 
                        onEdit={openEditModal} 
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- MODALY --- */}

      {/* 1. Modal pre úpravu dieťaťa (Zobrazí sa len ak je vybrané dieťa) */}
      {editingChild && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3E2E48]/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md overflow-hidden rounded-[32px] bg-white shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-[#3E2E48]/10 bg-[#fcf7f3]/50">
              <h2 className="text-2xl font-black text-[#3E2E48]">Úprava údajov</h2>
            </div>

            <form onSubmit={handleSaveChild} className="p-8 flex flex-col gap-5">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#3E2E48]/70 uppercase tracking-wider">Meno</label>
                <input
                  name="firstName"
                  type="text"
                  defaultValue={editingChild.firstName}
                  required
                  className="w-full rounded-xl border-2 border-transparent bg-[#fcf7f3] px-4 py-3 text-sm font-bold text-[#3E2E48] outline-none transition focus:border-[#d0a91a] focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#3E2E48]/70 uppercase tracking-wider">Priezvisko</label>
                <input
                  name="lastName"
                  type="text"
                  defaultValue={editingChild.lastName}
                  required
                  className="w-full rounded-xl border-2 border-transparent bg-[#fcf7f3] px-4 py-3 text-sm font-bold text-[#3E2E48] outline-none transition focus:border-[#d0a91a] focus:bg-white"
                />
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 rounded-xl bg-[#d0a91a] py-3.5 text-sm font-black text-white shadow-lg shadow-[#d0a91a]/20 transition hover:opacity-90 active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Uložiť zmeny"}
                </button>
                <button 
                  type="button" 
                  onClick={closeEditModal} 
                  className="flex-1 rounded-xl bg-[#f8f5f2] py-3.5 text-sm font-bold text-[#3E2E48]/60 transition hover:bg-[#3E2E48]/5"
                >
                  Zrušiť
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal pre vytvorenie novej triedy (Teraz už funguje nezávisle!) */}
      <CreateClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableTeachers={teachers} 
        availableChildren={children}
      />
    </>
  );
}