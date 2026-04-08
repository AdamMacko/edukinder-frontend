"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Header } from "@/app/components/Header";
import { EmployeeCard } from "../components/employees/EmployeeCard";
import { Search, UserPlus, ShieldCheck, GraduationCap, ChefHat, Wrench, Users } from "lucide-react";
import { MOCK_EMPLOYEES } from "./mockData";

const DEPARTMENTS = ["Všetci", "Vedenie", "Pedagógovia", "Jedáleň", "Prevádzka"];

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Všetci");
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const rowRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Klientske filtrovanie podľa vyhľadávania a tabu
  const filteredEmployees = useMemo(() => {
    return MOCK_EMPLOYEES.filter(emp => {
      const matchSearch = `${emp.firstName} ${emp.lastName} ${emp.email} ${emp.role}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTab = activeTab === "Všetci" || emp.department === activeTab;
      return matchSearch && matchTab;
    });
  }, [searchTerm, activeTab]);

  // Skrytie menu pri kliknutí mimo
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

  // Pomocná funkcia na renderovanie sekcie
  const renderDepartmentSection = (deptName: string, icon: any, colorClass: string) => {
    const deptEmployees = filteredEmployees.filter(e => e.department === deptName);
    if (deptEmployees.length === 0) return null;

    const Icon = icon;

    return (
      <div key={deptName} className="mb-12 animate-in fade-in duration-500">
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2.5 rounded-xl ${colorClass.replace('text-', 'bg-').replace(']', ']/10')}`}>
            <Icon className={`w-6 h-6 ${colorClass}`} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-black text-[#3E2E48]">{deptName}</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#3E2E48]/10 to-transparent ml-4"></div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {deptEmployees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              isMenuOpen={openMenu === emp.id}
              onMenuToggle={() => setOpenMenu(openMenu === emp.id ? null : emp.id)}
              onEdit={() => alert(`Upraviť: ${emp.firstName}`)}
              onDelete={() => alert(`Prepustiť: ${emp.firstName}`)}
              menuRef={(el: any) => { rowRefs.current[emp.id] = el; }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fcf7f3] text-[#3E2E48] pb-20">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        
        {/* TOP SECTION */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-[#3E2E48] mb-2">
              Zamestnanci
            </h1>
            <p className="text-[#3E2E48]/60 font-medium">
              Organizačná štruktúra materskej školy a správa personálu.
            </p>
          </div>
          
          <button
            className="group flex items-center justify-center gap-2 rounded-2xl bg-[#d0a91a] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#d0a91a]/20 transition-all hover:opacity-90 hover:-translate-y-0.5"
          >
            <UserPlus className="w-5 h-5" />
            Pridať zamestnanca
          </button>
        </div>

        {/* TABS & SEARCH (Glassmorphism) */}
        <div className="mb-10 overflow-hidden rounded-[32px] border border-white/70 bg-white/70 p-4 shadow-[0_20px_60px_rgba(62,46,72,0.05)] backdrop-blur-xl flex flex-col lg:flex-row gap-4 justify-between items-center">
          
          {/* Taby pre oddelenia */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveTab(dept)}
                className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex-1 sm:flex-none ${
                  activeTab === dept
                    ? "bg-[#3E2E48] text-white shadow-md"
                    : "bg-white/60 text-[#3E2E48]/70 hover:bg-white hover:text-[#3E2E48]"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Vyhľadávanie */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3E2E48]/30" />
            <input
              type="text"
              placeholder="Hľadať zamestnanca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-[#3E2E48]/10 bg-white px-12 py-3 text-sm font-semibold outline-none transition focus:border-[#d0a91a] focus:ring-4 focus:ring-[#d0a91a]/5"
            />
          </div>
        </div>

        {/* ORGANIZAČNÁ ŠTRUKTÚRA */}
        {filteredEmployees.length === 0 ? (
          <div className="rounded-[32px] border border-[#3E2E48]/5 bg-white/50 p-20 text-center text-[#3E2E48]/40 font-bold">
            Nenašli sa žiadni zamestnanci pre zvolené kritériá.
          </div>
        ) : (
          <div>
            {/* Ak sme vybrali konkrétny tab, zobrazíme len ten. Ak Všetci, zobrazíme to pekne po sekciách */}
            {(activeTab === "Všetci" || activeTab === "Vedenie") && renderDepartmentSection("Vedenie", ShieldCheck, "text-[#d0a91a]")}
            {(activeTab === "Všetci" || activeTab === "Pedagógovia") && renderDepartmentSection("Pedagógovia", GraduationCap, "text-[#5673d8]")}
            {(activeTab === "Všetci" || activeTab === "Jedáleň") && renderDepartmentSection("Jedáleň", ChefHat, "text-[#e58a4f]")}
            {(activeTab === "Všetci" || activeTab === "Prevádzka") && renderDepartmentSection("Prevádzka", Wrench, "text-[#6b9080]")}
          </div>
        )}
      </div>
    </div>
  );
}