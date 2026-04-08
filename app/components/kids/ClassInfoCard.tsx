import React from "react";
import { UserCircle, MapPin, CalendarDays, Pencil } from "lucide-react"; // Import ikon z Lucide

type ClassInfoCardProps = {
  activeGroup: any;
  onEdit: () => void;
};

export function ClassInfoCard({ activeGroup, onEdit }: ClassInfoCardProps) {
  if (!activeGroup) return null;

  const formatSchoolYear = (dateStr?: string) => {
    if (!dateStr) return "Neuvedený";
    const y = new Date(dateStr).getFullYear();
    return isNaN(y) ? dateStr : `${y}/${y + 1}`;
  };

  const teacherName = activeGroup.classTeacher
    ? `${activeGroup.classTeacher.firstName ?? ""} ${activeGroup.classTeacher.lastName ?? ""}`.trim() || activeGroup.classTeacher.email
    : "Nepriradená";

  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-[24px] border border-[#d0a91a]/20 bg-[linear-gradient(135deg,rgba(208,169,26,0.05),rgba(255,255,255,0.6))] p-6 shadow-sm backdrop-blur-md">
      <div>
        <h2 className="text-2xl font-black text-[#3E2E48] mb-3">Trieda {activeGroup.name}</h2>
        <div className="flex flex-wrap gap-5 text-sm text-[#3E2E48]/80 font-medium">
          {/* Ikonka a text pre Učiteľku */}
          <p className="flex items-center gap-2">
            <UserCircle className="w-4 h-4 text-[#d0a91a]" strokeWidth={2} />
            {teacherName}
          </p>
          
          {/* Ikonka a text pre Miestnosť */}
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#d0a91a]" strokeWidth={2} />
            {activeGroup.roomName || "Neuvedená"}
          </p>

          {/* Ikonka a text pre Školský rok */}
          <p className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[#d0a91a]" strokeWidth={2} />
            {formatSchoolYear(activeGroup.classYear)}
          </p>
        </div>
      </div>

      <button
        onClick={onEdit}
        className="group flex items-center gap-2 rounded-2xl border border-[#3E2E48]/10 bg-white px-5 py-2.5 text-sm font-bold text-[#3E2E48] shadow-sm transition hover:bg-[#faf7f4] hover:shadow-md"
      >
        <Pencil className="w-4 h-4 text-[#3E2E48]/70 transition-transform group-hover:scale-110 group-hover:text-[#3E2E48]" strokeWidth={2} />
        Upraviť triedu
      </button>
    </div>
  );
}