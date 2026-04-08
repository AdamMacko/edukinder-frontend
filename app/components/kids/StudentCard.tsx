import React from "react";
import { Users, GraduationCap, FileText, Pencil } from "lucide-react"; // Import ikon

type StudentCardProps = {
  child: any;
  onEdit: (child: any) => void;
};

export function StudentCard({ child, onEdit }: StudentCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-[24px] border border-[#3E2E48]/8 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      <div>
        <h3 className="text-lg font-black text-[#3E2E48] mb-2">
          {child.firstName} {child.lastName}
        </h3>
        
        <div className="flex flex-col gap-1.5">
          {/* Trieda */}
          <div className="flex items-center gap-1.5 text-sm font-medium text-[#3E2E48]/60">
            <Users className="w-4 h-4 text-[#3E2E48]/40" strokeWidth={2} />
            {child.groupName}
          </div>
          
          {/* Ročník */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#d0a91a]">
            <GraduationCap className="w-4 h-4" strokeWidth={2} />
            {child.className}
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex items-center gap-2">
        {/* Tlačidlo Detail */}
        <button className="group flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#f8f5f2] px-4 py-2 text-xs font-bold text-[#3E2E48] transition hover:bg-[#eae4de]">
          <FileText className="w-3.5 h-3.5 text-[#3E2E48]/60 transition-colors group-hover:text-[#3E2E48]" strokeWidth={2.5} />
          Detail
        </button>
        
        {/* Tlačidlo Upraviť */}
        <button 
          onClick={() => onEdit(child)}
          className="group flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#d0a91a]/30 bg-[#fffaf0] px-4 py-2 text-xs font-bold text-[#aa8530] transition hover:bg-[#fcefc7]"
        >
          <Pencil className="w-3.5 h-3.5 text-[#aa8530]/70 transition-colors group-hover:text-[#aa8530]" strokeWidth={2.5} />
          Upraviť
        </button>
      </div>
    </div>
  );
}