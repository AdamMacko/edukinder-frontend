import React from "react";
import { LayoutGrid, Users } from "lucide-react"; // Pridané Lucide ikonky

type ClassTabsProps = {
  classes: { id: number; name: string }[];
  activeClass: string;
  onSelect: (name: string) => void;
};

export function ClassTabs({ classes, activeClass, onSelect }: ClassTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {/* Tab pre "Všetci" */}
      <button
        onClick={() => onSelect("Všetci")}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
          activeClass === "Všetci"
            ? "bg-[#3E2E48] text-white shadow-md"
            : "bg-white/60 text-[#3E2E48]/70 hover:bg-white hover:text-[#3E2E48]"
        }`}
      >
        <LayoutGrid 
          className={`w-4 h-4 transition-colors ${activeClass === "Všetci" ? "text-white" : "text-[#d0a91a]"}`} 
          strokeWidth={2.5} 
        />
        Všetci
      </button>

      {/* Taby pre jednotlivé triedy */}
      {classes.map((cls) => (
        <button
          key={cls.id}
          onClick={() => onSelect(cls.name)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
            activeClass === cls.name
              ? "bg-[#3E2E48] text-white shadow-md"
              : "bg-white/60 text-[#3E2E48]/70 hover:bg-white hover:text-[#3E2E48]"
          }`}
        >
          <Users 
            className={`w-4 h-4 transition-colors ${activeClass === cls.name ? "text-white" : "text-[#d0a91a]"}`} 
            strokeWidth={2.5} 
          />
          {cls.name}
        </button>
      ))}
    </div>
  );
}