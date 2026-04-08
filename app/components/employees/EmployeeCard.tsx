"use client";

import React from "react";
import { Mail, Phone, MoreVertical, Pencil, UserMinus, Briefcase, GraduationCap, ChefHat, Wrench, ShieldCheck } from "lucide-react";

export function EmployeeCard({ 
  employee, 
  isMenuOpen, 
  onMenuToggle, 
  onEdit, 
  onDelete, 
  menuRef 
}: any) {
  
  // Dynamické ikonky a farby podľa oddelenia
  const getDepartmentStyles = (dep: string) => {
    switch(dep) {
      case 'Vedenie': return { icon: ShieldCheck, color: 'text-[#d0a91a]', bg: 'bg-[#fffaf0]', border: 'border-[#d0a91a]/30' };
      case 'Pedagógovia': return { icon: GraduationCap, color: 'text-[#5673d8]', bg: 'bg-[#eaf1ff]', border: 'border-[#5673d8]/30' };
      case 'Jedáleň': return { icon: ChefHat, color: 'text-[#e58a4f]', bg: 'bg-[#fff3eb]', border: 'border-[#e58a4f]/30' };
      case 'Prevádzka': return { icon: Wrench, color: 'text-[#6b9080]', bg: 'bg-[#f0f7f4]', border: 'border-[#6b9080]/30' };
      default: return { icon: Briefcase, color: 'text-[#3E2E48]', bg: 'bg-[#f8f5f2]', border: 'border-[#3E2E48]/20' };
    }
  };

  const { icon: DeptIcon, color: deptColor, bg: deptBg, border: deptBorder } = getDepartmentStyles(employee.department);

  return (
    <div className="relative flex flex-col justify-between rounded-[24px] border border-[#3E2E48]/8 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 overflow-hidden">
      
      {/* Jemný farebný pásik hore podľa oddelenia */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${deptBg} ${deptBorder} border-t`} />

      {/* Menu pod tromi bodkami */}
      <div className="absolute top-5 right-4" ref={menuRef}>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onMenuToggle();
          }}
          className="p-2 rounded-full hover:bg-[#f8f5f2] transition-colors"
        >
          <MoreVertical className="w-5 h-5 text-[#3E2E48]/40" />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-xl border border-[#3E2E48]/8 z-50 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
            <button onClick={onEdit} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-[#3E2E48] hover:bg-[#fcf7f3] transition-colors text-left">
              <Pencil className="w-4 h-4 text-[#d0a91a]" strokeWidth={2.5} /> Upraviť profil
            </button>
            <hr className="my-1 border-[#3E2E48]/5" />
            <button onClick={onDelete} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-[#b15252] hover:bg-[#fbe7e7]/50 transition-colors text-left">
              <UserMinus className="w-4 h-4" strokeWidth={2.5} /> Prepustiť
            </button>
          </div>
        )}
      </div>

      {/* Info o Zamestnancovi */}
      <div className="mt-2">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider mb-3 ${deptBg} ${deptColor}`}>
          <DeptIcon className="w-3 h-3" strokeWidth={3} />
          {employee.role}
        </div>
        
        <h3 className="text-xl font-black text-[#3E2E48] mb-4 pr-8 leading-tight">
          {employee.firstName} {employee.lastName}
        </h3>

        <div className="space-y-3 text-sm font-medium">
          <div className="flex items-center gap-3 text-[#3E2E48]/70">
            <Mail className="w-4 h-4 text-[#d0a91a]" strokeWidth={2.5} />
            <span className="truncate">{employee.email}</span>
          </div>
          <div className="flex items-center gap-3 text-[#3E2E48]/70">
            <Phone className="w-4 h-4 text-[#d0a91a]" strokeWidth={2.5} />
            <span>{employee.phone}</span>
          </div>
        </div>
      </div>

      {/* Tagy / Detaily */}
      <div className="mt-6 pt-4 border-t border-[#3E2E48]/5">
        <div className="flex flex-wrap gap-2">
          {employee.tags && employee.tags.length > 0 ? (
            employee.tags.map((tag: string, idx: number) => (
              <span key={idx} className="px-3 py-1 bg-[#f8f5f2] text-[#3E2E48]/70 text-[10px] font-bold uppercase rounded-lg border border-[#3E2E48]/10 tracking-wide">
                {tag}
              </span>
            ))
          ) : (
            <span className="text-xs text-[#3E2E48]/30 italic">Bez ďalšieho zaradenia</span>
          )}
        </div>
      </div>
    </div>
  );
}