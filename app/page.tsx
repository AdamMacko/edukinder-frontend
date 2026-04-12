"use client";

import { Header } from "@/app/components/header/Header";
import { BellRing, Clock, Phone, Coffee, Utensils, Apple, CalendarDays } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fcf7f3] flex flex-col font-sans text-[#3E2E48] selection:bg-[#d0a91a] selection:text-white">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-20">
        
        {/* HLAVIČKA NÁSTENKY */}
        <div className="mb-16 max-w-3xl border-l-4 border-[#d0a91a] pl-6 md:pl-8 py-2 animate-in fade-in slide-in-from-left-4 duration-700">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#3E2E48] leading-tight">
            MŠ Malí Objavitelia<span className="text-[#d0a91a]">.</span>
          </h1>
          <p className="mt-6 text-[#3E2E48]/80 text-lg md:text-xl leading-relaxed font-medium">
            Vitajte na vašom modernom informačnom portáli. Všetky dôležité oznamy a aktuálny jedálniček pre vaše deti nájdete prehľadne a bezpečne na jednom mieste.
          </p>
        </div>

        {/* INFORMAČNÝ DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-24">
          
          {/* Karta: Hlavný oznam */}
          <div className="lg:col-span-2 bg-white rounded-[32px] p-8 md:p-10 border border-[#3E2E48]/5 shadow-[0_8px_30px_rgba(62,46,72,0.04)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(62,46,72,0.08)] hover:-translate-y-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-[#fffaf0] rounded-2xl text-[#d0a91a]">
                  <BellRing className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <h2 className="font-black text-2xl md:text-3xl text-[#3E2E48] tracking-tight">
                  Aktuálny Oznam
                </h2>
              </div>
              <p className="text-[#3E2E48]/80 text-base md:text-lg leading-relaxed font-medium">
                Vážení rodičia, pripomíname, že tento piatok sa uskutoční spoločné jarné fotenie detí v záhrade. Prosíme, aby ste deťom pribalili aj náhradné oblečenie v pestrých farbách.
              </p>
            </div>
            
            <div className="mt-10 pt-6 border-t border-[#3E2E48]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm font-bold text-[#3E2E48]/50">
              <span>Pridané dnes o 08:30</span>
              <span className="inline-flex items-center justify-center px-4 py-2 bg-[#fcf7f3] text-[#d0a91a] rounded-xl text-xs uppercase tracking-wider">
                Vedenie MŠ
              </span>
            </div>
          </div>

          {/* Karta: Kontakt (Zlatý akcent) */}
          <div className="bg-gradient-to-br from-[#d0a91a] to-[#e2c26a] rounded-[32px] p-8 md:p-10 shadow-[0_12px_30px_rgba(208,169,26,0.2)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(208,169,26,0.3)] hover:-translate-y-1 flex flex-col text-white">
            <h2 className="font-black text-2xl md:text-3xl mb-8 tracking-tight">
              Kancelária
            </h2>
            
            <div className="flex-1 flex flex-col justify-center space-y-8">
              <div>
                <span className="flex items-center gap-2 text-xs text-white/80 font-bold mb-2 tracking-widest uppercase">
                  <Clock className="w-4 h-4" /> Otváracie hodiny
                </span>
                <span className="font-black text-2xl tracking-tight">7:00 – 16:30</span>
              </div>
              
              <div className="w-12 h-px bg-white/20"></div>

              <div>
                <span className="flex items-center gap-2 text-xs text-white/80 font-bold mb-2 tracking-widest uppercase">
                  <Phone className="w-4 h-4" /> Telefón
                </span>
                <a href="tel:+421900000000" className="font-black text-2xl tracking-tight hover:text-white/80 transition-colors">
                  +421 900 000 000
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* SEKCIA STRAVA */}
        <section id="strava" className="scroll-mt-32">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#3E2E48] flex items-center gap-4">
              <div className="w-3 h-3 bg-[#d0a91a] rounded-full shadow-sm"></div>
              Dnešný Jedálniček
            </h2>
            <div className="flex items-center gap-2 bg-white text-[#d0a91a] px-6 py-2.5 rounded-2xl text-sm font-bold border border-[#3E2E48]/5 shadow-[0_4px_14px_rgba(62,46,72,0.03)]">
              <CalendarDays className="w-4 h-4" strokeWidth={2.5} /> 
              Štvrtok • 9. apríla
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Desiata */}
            <div className="bg-white border border-[#3E2E48]/5 rounded-[28px] p-8 transition-all duration-300 hover:border-[#d0a91a]/30 shadow-[0_4px_20px_rgba(62,46,72,0.03)] hover:shadow-[0_8px_30px_rgba(62,46,72,0.06)] hover:-translate-y-1 flex flex-col">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3.5 bg-[#fcf7f3] rounded-2xl text-[#d0a91a]">
                  <Coffee className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <h3 className="text-[#3E2E48] font-black text-xl tracking-tight">Desiata</h3>
              </div>
              <p className="font-medium text-[#3E2E48]/80 text-base leading-relaxed">
                Chlebík s mrkvovou nátierkou, bylinkový čaj
              </p>
            </div>
            
            {/* Obed */}
            <div className="bg-white border border-[#3E2E48]/5 rounded-[28px] p-8 transition-all duration-300 hover:border-[#d0a91a]/30 shadow-[0_4px_20px_rgba(62,46,72,0.03)] hover:shadow-[0_8px_30px_rgba(62,46,72,0.06)] hover:-translate-y-1 flex flex-col">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3.5 bg-[#fcf7f3] rounded-2xl text-[#d0a91a]">
                  <Utensils className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <h3 className="text-[#3E2E48] font-black text-xl tracking-tight">Obed</h3>
              </div>
              <p className="font-medium text-[#3E2E48]/80 text-base leading-relaxed">
                Zeleninová polievka, Kuracie rizoto so syrom a kyslou uhorkou
              </p>
            </div>
            
            {/* Olovrant */}
            <div className="bg-white border border-[#3E2E48]/5 rounded-[28px] p-8 transition-all duration-300 hover:border-[#d0a91a]/30 shadow-[0_4px_20px_rgba(62,46,72,0.03)] hover:shadow-[0_8px_30px_rgba(62,46,72,0.06)] hover:-translate-y-1 flex flex-col">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3.5 bg-[#fcf7f3] rounded-2xl text-[#d0a91a]">
                  <Apple className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <h3 className="text-[#3E2E48] font-black text-xl tracking-tight">Olovrant</h3>
              </div>
              <p className="font-medium text-[#3E2E48]/80 text-base leading-relaxed">
                Ovocný tanier (jabĺčka, banány), cereálna tyčinka
              </p>
            </div>

          </div>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="py-8 text-center mt-auto bg-white/50 border-t border-[#3E2E48]/5">
        <p className="text-[#3E2E48]/40 text-xs font-bold tracking-widest uppercase">
          © 2026 EduKinder • MŠ Malí Objavitelia
        </p>
      </footer>
    </div>
  );
}