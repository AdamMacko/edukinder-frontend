import { Header } from './components/Header';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fdf4ef] flex flex-col font-sans text-[#3E2E48] selection:bg-[#d0a91a] selection:text-[#fdf4ef]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-12 py-16 md:py-24 w-full">
        
        {/* HLAVIČKA NÁSTENKY – enhanced visibility */}
        <div className="mb-20 max-w-4xl border-l-4 border-[#d0a91a] pl-8 py-2">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-[-2px] text-[#3E2E48] leading-none">
            MŠ Malí Objavitelia
            <span className="text-[#d0a91a]">.</span>
          </h1>
          <p className="mt-8 text-[#3E2E48] text-2xl leading-relaxed max-w-2xl font-light">
            Vitajte na vašom modernom informačnom portáli. Všetky dôležité oznamy a aktuálny jedálniček pre vaše deti nájdete prehľadne a bezpečne na jednom mieste.
          </p>
        </div>

        {/* INFORMAČNÝ DASHBOARD – more prominent cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          
          {/* Karta: Hlavný oznam – bigger, warmer, stronger presence */}
          <div className="md:col-span-2 bg-white border border-[#3E2E48]/10 rounded-3xl p-10 shadow-xl shadow-[#3E2E48]/5 transition-all hover:shadow-2xl hover:border-[#d0a91a]/30">
            <h2 className="font-bold text-3xl mb-8 flex items-center gap-4 text-[#3E2E48]">
              <span className="text-[#d0a91a]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </span>
              Aktuálny Oznam
            </h2>
            <p className="text-[#3E2E48] text-xl leading-relaxed font-light">
              Vážení rodičia, pripomíname, že tento štvrtok sa uskutoční spoločné jarné fotenie detí v záhrade. Prosíme, aby ste deťom pribalili aj náhradné oblečenie v pestrých farbách.
            </p>
            <div className="mt-10 pt-8 border-t border-[#3E2E48]/10 text-sm flex items-center justify-between text-[#3E2E48]/70 font-medium">
              <span>Pridané dnes o 08:30</span>
              <span className="px-4 py-1 bg-[#d0a91a]/10 text-[#d0a91a] rounded-2xl text-xs font-semibold">Riaditeľka</span>
            </div>
          </div>

          {/* Karta: Kontakt – cleaner and more visible */}
          <div className="bg-white rounded-3xl p-10 border border-[#3E2E48]/10 shadow-xl shadow-[#3E2E48]/5 transition-all hover:shadow-2xl hover:border-[#d0a91a]/30 flex flex-col">
            <h2 className="font-bold text-3xl mb-8 flex items-center gap-4 text-[#3E2E48]">
              <span className="text-[#d0a91a]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              Kancelária
            </h2>
            
            <div className="flex-1 space-y-8">
              <div>
                <span className="block text-xs text-[#3E2E48]/60 font-semibold mb-2 tracking-widest uppercase">Otváracie hodiny</span>
                <span className="font-semibold text-2xl text-[#3E2E48]">7:00 – 16:30</span>
              </div>
              <div>
                <span className="block text-xs text-[#3E2E48]/60 font-semibold mb-2 tracking-widest uppercase">Telefón</span>
                <a href="tel:+421900000000" className="font-semibold text-2xl text-[#3E2E48] hover:text-[#d0a91a] transition-colors">
                  +421 900 000 000
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* SEKCIA STRAVA – made more prominent and modern */}
        <section id="strava" className="scroll-mt-32">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-[#d0a91a] rounded-full"></div>
              <h2 className="text-4xl font-bold tracking-tight text-[#3E2E48]">
                Dnešný Jedálniček
              </h2>
            </div>
            <span className="bg-white text-[#d0a91a] px-8 py-3 rounded-3xl text-base font-bold tracking-wider border border-[#d0a91a]/30 shadow-sm">
              Pondelok • 4. apríla
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Desiata */}
            <div className="bg-white border border-[#3E2E48]/10 rounded-3xl p-9 hover:border-[#d0a91a]/40 transition-all duration-300 group shadow-sm hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[#d0a91a] text-4xl">🥨</span>
                <h3 className="text-[#3E2E48] font-bold text-2xl tracking-tight">Desiata</h3>
              </div>
              <p className="font-medium text-[#3E2E48] text-xl leading-snug">Chlebík s mrkvovou nátierkou, bylinkový čaj</p>
            </div>
            
            {/* Obed */}
            <div className="bg-white border border-[#3E2E48]/10 rounded-3xl p-9 hover:border-[#d0a91a]/40 transition-all duration-300 group shadow-sm hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[#d0a91a] text-4xl">🍲</span>
                <h3 className="text-[#3E2E48] font-bold text-2xl tracking-tight">Obed</h3>
              </div>
              <p className="font-medium text-[#3E2E48] text-xl leading-snug">Zeleninová polievka, Kuracie rizoto so syrom a kyslou uhorkou</p>
            </div>
            
            {/* Olovrant */}
            <div className="bg-white border border-[#3E2E48]/10 rounded-3xl p-9 hover:border-[#d0a91a]/40 transition-all duration-300 group shadow-sm hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[#d0a91a] text-4xl">🍎</span>
                <h3 className="text-[#3E2E48] font-bold text-2xl tracking-tight">Olovrant</h3>
              </div>
              <p className="font-medium text-[#3E2E48] text-xl leading-snug">Ovocný tanier (jabĺčka, banány), cereálna tyčinka</p>
            </div>
          </div>
        </section>

      </main>
      
      {/* Footer – cleaner */}
      <footer className="py-16 text-center border-t border-[#3E2E48]/10 mt-auto bg-white">
        <p className="text-[#3E2E48]/60 text-sm font-medium tracking-widest">
          © 2026 EduKinder • MŠ Malí Objavitelia
        </p>
      </footer>
    </div>
  );
}