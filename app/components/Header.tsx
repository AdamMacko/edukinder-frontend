"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LoginModal from "./LoginModal";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
      <>
    <header 
      className={`w-full sticky top-0 z-50 transition-all duration-700 ease-in-out ${
        scrolled 
          ? 'bg-white/60 backdrop-blur-xl border-b border-white/50 shadow-[0_8px_32px_rgba(62,46,72,0.05)] py-1' 
          : 'bg-[#fcf7f3] border-b border-transparent py-0'
      }`}
    >
      {/* Animated background gradient - ukáže sa hlavne pri skle */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-multiply">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-gradient-to-br from-amber-100/40 to-transparent rounded-full blur-3xl animate-pulse opacity-50"></div>
        <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-gradient-to-tr from-[#b9c9ff]/30 to-transparent rounded-full blur-3xl animate-pulse opacity-40" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 transition-all duration-500">
          
          {/* LOGO SECTION */}
          <Link 
            href="/" 
            className="flex items-center group relative z-50 no-underline"
          >
            <div className="flex items-center">
              <Image 
                src="/logo.svg" 
                alt="EduKinder Logo" 
                width={140} 
                height={40} 
                className="h-8 md:h-10 w-auto object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                priority
              />
            </div>
            {/* Jemná žiara za logom pri hoveri */}
            <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-[#d0a91a]/0 via-[#d0a91a]/10 to-[#d0a91a]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-md -z-10"></div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden sm:flex items-center gap-10 ml-12">
            <Link 
              href="#strava" 
              className="group relative px-6 py-2.5 rounded-full font-semibold text-sm text-[#3E2E48]/80 overflow-hidden transition-all duration-300 hover:text-[#3E2E48] hover:shadow-md"
            >
              {/* Glass background pre tlačidlo */}
              <div className="absolute inset-0 bg-white/40 backdrop-blur-md border border-white/60 rounded-full transition-all duration-300 group-hover:bg-white/70 group-hover:border-white/80"></div>
              
              <span className="relative flex items-center justify-center">
                Strava
              </span>
            </Link>
          </nav>

          {/* LOGIN BUTTON */}
          <div className="hidden sm:flex items-center ml-auto gap-4">
            <button
                type="button"
                onClick={() => setIsLoginOpen(true)}
              className="group relative flex items-center justify-center gap-2 px-7 py-2.5 rounded-full font-bold text-sm text-white overflow-hidden transition-all duration-500 shadow-[0_4px_14px_rgba(208,169,26,0.25)] hover:shadow-[0_6px_20px_rgba(208,169,26,0.4)] hover:-translate-y-0.5"
            >
              {/* Zlaté pozadie */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#d0a91a] to-[#e2c26a] transition-all duration-500 group-hover:opacity-90"></div>
              
              {/* Efekt odlesku */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              
              <span className="relative flex items-center gap-2 tracking-wide">
                Prihlásenie
                <svg 
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="sm:hidden flex items-center z-50">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white/50 border border-white/60 shadow-sm hover:bg-white/80 transition-all duration-300 focus:outline-none group"
              aria-label={isMobileMenuOpen ? "Zatvoriť menu" : "Otvoriť menu"}
            >
              <div className="relative w-5 h-4 flex flex-col justify-between">
                <span className={`h-0.5 w-full bg-[#3E2E48] rounded-full transition-all duration-500 origin-left ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`h-0.5 w-full bg-[#3E2E48] rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-0' : 'scale-100'}`} />
                <span className={`h-0.5 w-full bg-[#3E2E48] rounded-full transition-all duration-500 origin-left ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isMobileMenuOpen && (
        <div className="sm:hidden absolute top-[100%] left-0 w-full bg-white/80 backdrop-blur-2xl border-b border-white/50 px-6 py-8 shadow-2xl flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-400">
          <nav className="flex flex-col gap-3">
            <Link 
              href="#strava" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="group relative px-6 py-3.5 rounded-2xl font-semibold text-base text-[#3E2E48] overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <div className="absolute inset-0 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl transition-all duration-300 group-hover:bg-white/90"></div>
              <span className="relative">Strava</span>
            </Link>
          </nav>

          <div className="pt-2 flex flex-col gap-3">
            <button
                type="button"
                onClick={() => {
                  setIsLoginOpen(true);
                  setIsMobileMenuOpen(false); // Zatvorí menu na mobile pri kliknutí
                }}
              className="relative flex items-center justify-center gap-2 w-full font-bold text-base py-4 px-6 rounded-2xl text-white overflow-hidden transition-all duration-500 group shadow-lg shadow-[#d0a91a]/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#d0a91a] to-[#e2c26a] group-active:opacity-90"></div>
              <span className="relative">Prihlásenie</span>
            </button>
          </div>
        </div>
      )}
    </header>
    
    <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
    />
</>
  );
};