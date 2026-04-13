"use client";

import { useState } from "react";
import { Image as ImageIcon, Send, Users, Globe, Lock } from "lucide-react";
import { currentUser } from "@/app/announcements/mockData";

export const CreateAnnouncement = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const initial = currentUser.firstName[0] + (currentUser.lastName?.[0] || "");

  return (
    <div className="bg-white rounded-[32px] p-5 shadow-sm border border-[#3E2E48]/5 transition-all mb-6">
      <div className="flex gap-4">
        <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-[#d0a91a] to-[#e2c26a] text-white flex items-center justify-center font-black text-sm shadow-sm">
          {initial}
        </div>
        <div className="flex-1">
          {isExpanded && (
            <input
              type="text"
              placeholder="Názov oznamu..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-lg font-bold text-[#3E2E48] bg-transparent outline-none placeholder:text-[#3E2E48]/30 mb-2"
            />
          )}
          <textarea
            placeholder={isExpanded ? "Čo máte na srdci?" : "Pridať nový oznam..."}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            className={`w-full text-[15px] text-[#3E2E48] bg-transparent outline-none placeholder:text-[#3E2E48]/50 resize-none transition-all ${
              isExpanded ? "h-24" : "h-10"
            }`}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#3E2E48]/5 animate-in fade-in duration-300">
          <div className="flex gap-2">
            <button className="p-2 text-[#3E2E48]/40 hover:text-[#d0a91a] hover:bg-[#d0a91a]/10 rounded-full transition-colors">
              <ImageIcon className="w-5 h-5" />
            </button>
            <div className="h-9 flex items-center gap-2 px-3 rounded-full bg-[#fcf7f3] border border-[#3E2E48]/5 cursor-pointer hover:bg-[#3E2E48]/5 transition-colors">
              <Globe className="w-4 h-4 text-[#3E2E48]/50" />
              <span className="text-xs font-semibold text-[#3E2E48]/70">Všetci</span>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-sm font-bold text-[#3E2E48]/50 hover:text-[#3E2E48] transition-colors"
            >
              Zrušiť
            </button>
            <button 
              disabled={!body.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm text-white bg-gradient-to-r from-[#d0a91a] to-[#e2c26a] shadow-lg shadow-[#d0a91a]/20 disabled:opacity-50 disabled:pointer-events-none transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Zverejniť <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};