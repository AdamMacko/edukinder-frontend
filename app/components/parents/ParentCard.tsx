"use client";

import React from "react";
import { Mail, Phone, Calendar, Baby, MoreVertical, Pencil, UserMinus, Eye } from "lucide-react";

export function ParentCard({ 
  parent, 
  isMenuOpen, 
  onMenuToggle, 
  onEdit, 
  onDelete, 
  onViewChildren,
  menuRef 
}: any) {
  return (
    <div className="relative flex flex-col justify-between rounded-[24px] border border-[#3E2E48]/8 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      
      <div className="absolute top-4 right-4" ref={menuRef}>
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
              <Pencil className="w-4 h-4 text-[#d0a91a]" strokeWidth={2.5} /> Upraviť
            </button>
            <button onClick={onViewChildren} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-[#3E2E48] hover:bg-[#fcf7f3] transition-colors text-left">
              <Eye className="w-4 h-4 text-[#d0a91a]" strokeWidth={2.5} /> Deti
            </button>
            <hr className="my-1 border-[#3E2E48]/5" />
            <button onClick={onDelete} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-[#b15252] hover:bg-[#fbe7e7]/50 transition-colors text-left">
              <UserMinus className="w-4 h-4" strokeWidth={2.5} /> Odobrať
            </button>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xl font-black text-[#3E2E48] mb-4 pr-8">
          {parent.firstName} {parent.lastName}
        </h3>

        <div className="space-y-3 text-sm font-medium">
          <div className="flex items-center gap-3 text-[#3E2E48]/70">
            <Mail className="w-4 h-4 text-[#d0a91a]" strokeWidth={2.5} />
            <span className="truncate">{parent.email}</span>
          </div>
          <div className="flex items-center gap-3 text-[#3E2E48]/70">
            <Phone className="w-4 h-4 text-[#d0a91a]" strokeWidth={2.5} />
            <span>{parent.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-[#3E2E48]/70">
            <Calendar className="w-4 h-4 text-[#d0a91a]" strokeWidth={2.5} />
            <span>Reg: {parent.regDate}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#3E2E48]/5">
        <div className="flex items-center gap-2 mb-3">
          <Baby className="w-4 h-4 text-[#d0a91a]" strokeWidth={2.5} />
          <span className="text-xs font-bold uppercase tracking-wider text-[#3E2E48]/40">Priradené deti</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {parent.children.map((child: any, idx: number) => (
            <span key={idx} className="px-3 py-1 bg-[#fcf7f3] text-[#3E2E48] text-[10px] font-black uppercase rounded-lg border border-[#3E2E48]/5 tracking-wide">
              {child}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}