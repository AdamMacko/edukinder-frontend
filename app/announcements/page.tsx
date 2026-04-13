import { MOCK_ANNOUNCEMENTS } from "./mockData";
import { AnnouncementCard } from "../components/announcements/AnnouncementCard";
import { CreateAnnouncement } from "../components/announcements/CreateAnnouncement";
import { Megaphone, Search } from "lucide-react";
import { Header } from "@/app/components/header/Header";

export default function AnnouncementsPage() {
  const pinnedAnnouncements = MOCK_ANNOUNCEMENTS.filter(a => a.pinned);
  const standardAnnouncements = MOCK_ANNOUNCEMENTS.filter(a => !a.pinned);

  return (
    <main className="min-h-[100dvh] bg-[#fcf7f3] pb-12 sm:pb-24 flex flex-col">
      <Header />
      
      {/* ZJEDNOTENÝ CONTAINER: 
        Toto zabezpečí, že obsah bude vždy rovnako odsadený od okrajov ako Header.
        Na mobile menší okraj (px-4), na tablete (px-6), na PC najväčší (px-8). 
      */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex-1">
        
        {/* GRID LAYOUT: Perfektné škálovanie pre mobily, tablety (iPad) aj PC */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* L'AVÝ/STREDOVÝ PANEL: Zaberie 8 z 12 stĺpcov na PC, na mobile/tablete celý priestor */}
          <div className="lg:col-span-8 xl:col-span-8 2xl:col-span-9 w-full max-w-2xl mx-auto lg:max-w-none">
            
            <div className="mb-6 px-1 flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-black text-[#3E2E48] flex items-center gap-3 tracking-tight">
                <div className="p-2.5 rounded-2xl bg-white shadow-sm border border-[#3E2E48]/5">
                  <Megaphone className="w-5 h-5 sm:w-6 sm:h-6 text-[#d0a91a]" strokeWidth={2.5} />
                </div>
                Nástenka
              </h1>
            </div>

            {/* Vytvorenie príspevku */}
            <CreateAnnouncement />

            {/* Príspevky (dynamická medzera - na mobile menšia, na PC väčšia) */}
            <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              
              {/* Najskôr pripnuté */}
              {pinnedAnnouncements.map((post) => (
                <AnnouncementCard key={`pinned-${post.id}`} data={post} />
              ))}
              
              {/* Delič ak máme pripnuté aj bežné */}
              {pinnedAnnouncements.length > 0 && standardAnnouncements.length > 0 && (
                <div className="flex items-center gap-4 py-2 sm:py-4 px-2 opacity-40">
                  <div className="flex-1 h-px bg-[#3E2E48]/20"></div>
                  <span className="text-[10px] sm:text-xs font-bold text-[#3E2E48] uppercase tracking-widest">Najnovšie</span>
                  <div className="flex-1 h-px bg-[#3E2E48]/20"></div>
                </div>
              )}

              {/* Ostatné príspevky */}
              {standardAnnouncements.map((post) => (
                <AnnouncementCard key={post.id} data={post} />
              ))}
            </div>
          </div>

          {/* PRAVÝ PANEL: Widgety (zobrazené len na PC - lg a vyššie) */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-4 2xl:col-span-3">
            <div className="sticky top-28 space-y-6">
              
              {/* Vyhľadávanie */}
              <div className="bg-white rounded-[24px] p-2 flex items-center gap-3 shadow-sm border border-[#3E2E48]/5">
                <Search className="w-5 h-5 text-[#3E2E48]/40 ml-3 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Hľadať v oznamoch..." 
                  className="bg-transparent border-none outline-none w-full py-2 text-sm text-[#3E2E48] placeholder:text-[#3E2E48]/40"
                />
              </div>

              {/* Filtre */}
              <div className="bg-white rounded-[32px] p-6 shadow-sm border border-[#3E2E48]/5">
                <h3 className="font-black text-[#3E2E48] text-lg mb-4">Kategórie</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-4 py-3 rounded-2xl bg-[#fcf7f3] text-[#d0a91a] font-bold text-sm transition-colors border border-[#d0a91a]/20">
                    Všetky oznamy
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-2xl text-[#3E2E48]/60 hover:bg-[#fcf7f3] hover:text-[#3E2E48] font-bold text-sm transition-colors">
                    Iba pre rodičov
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-2xl text-[#3E2E48]/60 hover:bg-[#fcf7f3] hover:text-[#3E2E48] font-bold text-sm transition-colors">
                    Zamestnanecké
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}