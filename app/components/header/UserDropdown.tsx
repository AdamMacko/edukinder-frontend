import React, { useState, useEffect } from 'react';
import { LogOut, ChevronDown, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

export const UserDropdown = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

 useEffect(() => {
    const handleClose = () => setIsOpen(false);
    if (isOpen) window.addEventListener('click', handleClose);
    // Tu bola chyba, prepíš to na removeEventListener:
    return () => window.removeEventListener('click', handleClose);
  }, [isOpen]);
  const initial = user?.firstName?.[0] || user?.email?.[0] || "?";

  return (
    <div className="relative">
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="flex items-center gap-2.5 p-1.5 pr-4 rounded-full bg-white/50 border border-white/80 hover:bg-white transition-all shadow-sm"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d0a91a] to-[#e2c26a] text-white flex items-center justify-center font-black text-xs">
          {initial.toUpperCase()}
        </div>
        <span className="text-sm font-bold text-[#3E2E48]">{user?.firstName || "Užívateľ"}</span>
        <ChevronDown className={`w-4 h-4 text-[#3E2E48]/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-52 rounded-3xl bg-white shadow-xl border border-black/5 z-50 overflow-hidden py-2 animate-in fade-in zoom-in-95">
          <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#3E2E48] hover:bg-[#fcf7f3]">
            <UserIcon className="w-4 h-4 text-[#d0a91a]" strokeWidth={2.5} /> Profil
          </Link>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#b15252] hover:bg-red-50 text-left"
          >
            <LogOut className="w-4 h-4" strokeWidth={2.5} /> Odhlásiť sa
          </button>
        </div>
      )}
    </div>
  );
};