"use client";

import { useState } from "react";
import { Image as ImageIcon, Send, Globe, Lock, Loader2, Users } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { createAnnouncement } from "@/lib/api/announcements";

type CreateAnnouncementProps = {
  // Tento prop zavoláme, keď sa príspevok úspešne uloží, aby sa nástenka obnovila
  onCreated?: () => void;
};

export const CreateAnnouncement = ({ onCreated }: CreateAnnouncementProps) => {
  const { user } = useAuth();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [visibility, setVisibility] = useState<"ALL_USERS" | "STAFF_ONLY">("ALL_USERS");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bezpečnostná poistka: Ak backend dovolí postovať len adminom/učiteľom,
  // na fronte sa tu kľudne môžeš neskôr rozhodnúť tento komponent rodičom ani nevykresliť.
  
  const myInitial = user ? (user.firstName?.[0] || user.email[0]).toUpperCase() : "U";

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createAnnouncement({
        title: title.trim(),
        body: body.trim(),
        visibility: visibility,
        pinned: false, // Predvolene nedávame pripnutý, na to môžeš pridať checkbox neskôr
      });

      // Vynulujeme formulár
      setTitle("");
      setBody("");
      setIsExpanded(false);
      
      // Povieme rodičovi (Nástenke), že je hotovo a má si stiahnuť nové dáta
      if (onCreated) {
        onCreated();
      }
    } catch (error: any) {
      alert(error.message || "Nepodarilo sa zverejniť oznam.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-5 shadow-sm border border-[#3E2E48]/5 transition-all mb-6">
      <div className="flex gap-4">
        <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-[#d0a91a] to-[#e2c26a] text-white flex items-center justify-center font-black text-sm shadow-sm">
          {myInitial}
        </div>
        <div className="flex-1">
          {isExpanded && (
            <input
              type="text"
              placeholder="Názov oznamu (povinné)..."
              value={title}
              disabled={isSubmitting}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-lg font-bold text-[#3E2E48] bg-transparent outline-none placeholder:text-[#3E2E48]/30 mb-2 disabled:opacity-50"
            />
          )}
          <textarea
            placeholder={isExpanded ? "Čo máte na srdci?" : "Pridať nový oznam..."}
            value={body}
            disabled={isSubmitting}
            onChange={(e) => setBody(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            className={`w-full text-[15px] text-[#3E2E48] bg-transparent outline-none placeholder:text-[#3E2E48]/50 resize-none transition-all disabled:opacity-50 ${
              isExpanded ? "h-24" : "h-10"
            }`}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-[#3E2E48]/5 animate-in fade-in duration-300">
          
          <div className="flex items-center gap-3">
            <button className="p-2 text-[#3E2E48]/40 hover:text-[#d0a91a] hover:bg-[#d0a91a]/10 rounded-full transition-colors disabled:opacity-50" disabled={isSubmitting}>
              <ImageIcon className="w-5 h-5" />
            </button>
            
            {/* Elegantný Select pre výber viditeľnosti */}
            <div className="relative flex items-center h-9 bg-[#fcf7f3] border border-[#3E2E48]/5 rounded-full px-1">
               <div className="absolute left-3 pointer-events-none text-[#3E2E48]/50">
                 {visibility === "ALL_USERS" ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4 text-[#b15252]" />}
               </div>
               <select
                 value={visibility}
                 onChange={(e) => setVisibility(e.target.value as any)}
                 disabled={isSubmitting}
                 className={`h-full pl-8 pr-4 bg-transparent outline-none text-xs font-bold cursor-pointer appearance-none transition-colors disabled:opacity-50 ${visibility === 'STAFF_ONLY' ? 'text-[#b15252]' : 'text-[#3E2E48]/70'}`}
               >
                 <option value="ALL_USERS">Všetci (Rodičia aj Zamestnanci)</option>
                 <option value="STAFF_ONLY">Iba Zamestnanci</option>
               </select>
            </div>
          </div>

          <div className="flex gap-3 items-center self-end sm:self-auto">
            <button 
              onClick={() => {
                setIsExpanded(false);
                setTitle("");
                setBody("");
              }}
              disabled={isSubmitting}
              className="text-sm font-bold text-[#3E2E48]/50 hover:text-[#3E2E48] transition-colors disabled:opacity-50"
            >
              Zrušiť
            </button>
            <button 
              onClick={handleSubmit}
              disabled={!body.trim() || !title.trim() || isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-[#d0a91a] to-[#e2c26a] shadow-lg shadow-[#d0a91a]/20 disabled:opacity-50 disabled:pointer-events-none transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? (
                 <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                 <>Zverejniť <Send className="w-4 h-4 ml-1" /></>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};