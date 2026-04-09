"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogIn, Menu, X, Utensils, Users, LayoutList, MessageCircle, Briefcase } from 'lucide-react'; // Pridaná ikonka Briefcase
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
        {/* Animated background gradient */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-multiply">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-gradient-to-br from-amber-100/40 to-transparent rounded-full blur-3xl animate-pulse opacity-50"></div>
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-gradient-to-tr from-[#b9c9ff]/30 to-transparent rounded-full blur-3xl animate-pulse opacity-40" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 transition-all duration-500">
            
            {/* L'AVÁ STRANA: Logo + Navigácia */}
            <div className="flex items-center gap-8 lg:gap-12">
              
              {/* LOGO */}
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
                <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-[#d0a91a]/0 via-[#d0a91a]/10 to-[#d0a91a]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-md -z-10"></div>
              </Link>

              {/* DESKTOP NAVIGATION */}
              <nav className="hidden md:flex items-center gap-2 lg:gap-4">
                <Link 
                  href="/kids" 
                  className="group relative px-5 py-2.5 rounded-full font-bold text-sm text-[#3E2E48]/80 overflow-hidden transition-all duration-300 hover:text-[#d0a91a] hover:shadow-md"
                >
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-md border border-white/80 rounded-full transition-all duration-300 group-hover:bg-white/80 group-hover:border-[#d0a91a]/30"></div>
                  <span className="relative flex items-center justify-start gap-2">
                    <LayoutList className="w-4 h-4 transition-colors duration-300" strokeWidth={2.5} />
                    Triedy
                  </span>
                </Link>

                <Link 
                  href="/parents" 
                  className="group relative px-5 py-2.5 rounded-full font-bold text-sm text-[#3E2E48]/80 overflow-hidden transition-all duration-300 hover:text-[#d0a91a] hover:shadow-md"
                >
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-md border border-white/80 rounded-full transition-all duration-300 group-hover:bg-white/80 group-hover:border-[#d0a91a]/30"></div>
                  <span className="relative flex items-center justify-start gap-2">
                    <Users className="w-4 h-4 transition-colors duration-300" strokeWidth={2.5} />
                    Rodičia
                  </span>
                </Link>

                {/* Sekcia Zamestnanci */}
                <Link 
                  href="/employees" 
                  className="group relative px-5 py-2.5 rounded-full font-bold text-sm text-[#3E2E48]/80 overflow-hidden transition-all duration-300 hover:text-[#d0a91a] hover:shadow-md"
                >
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-md border border-white/80 rounded-full transition-all duration-300 group-hover:bg-white/80 group-hover:border-[#d0a91a]/30"></div>
                  <span className="relative flex items-center justify-start gap-2">
                    <Briefcase className="w-4 h-4 transition-colors duration-300" strokeWidth={2.5} />
                    Zamestnanci
                  </span>
                </Link>

                <Link 
                  href="/lunch-checkout"
                  className="group relative px-5 py-2.5 rounded-full font-bold text-sm text-[#3E2E48]/80 overflow-hidden transition-all duration-300 hover:text-[#d0a91a] hover:shadow-md"
                >
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-md border border-white/80 rounded-full transition-all duration-300 group-hover:bg-white/80 group-hover:border-[#d0a91a]/30"></div>
                  <span className="relative flex items-center justify-start gap-2">
                    <Utensils className="w-4 h-4 transition-colors duration-300" strokeWidth={2.5} />
                    Strava
                  </span>
                </Link>
                  <Link
                      href="/attendance"
                      className="group relative px-5 py-2.5 rounded-full font-bold text-sm text-[#3E2E48]/80 overflow-hidden transition-all duration-300 hover:text-[#d0a91a] hover:shadow-md"
                  >
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-md border border-white/80 rounded-full transition-all duration-300 group-hover:bg-white/80 group-hover:border-[#d0a91a]/30"></div>
                      <span className="relative flex items-center justify-start gap-2">
                    <Utensils className="w-4 h-4 transition-colors duration-300" strokeWidth={2.5} />
                    Dochádzka
                  </span>
                  </Link>
              </nav>
            </div>

            {/* PRAVÁ STRANA: Chat + Login + Mobile Hamburger */}
            <div className="flex items-center gap-3 lg:gap-4">
              
              {/* CHAT ICON BUTTON (Desktop) */}
              <Link 
                href="/chat"
                className="hidden md:flex relative group items-center justify-center w-11 h-11 rounded-full bg-white/50 border border-white/80 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:-translate-y-0.5"
                aria-label="Správy"
              >
                <MessageCircle className="w-5 h-5 text-[#3E2E48]/70 transition-colors duration-300 group-hover:text-[#d0a91a]" strokeWidth={2.5} />
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#d0a91a] border-2 border-[#fcf7f3] text-[9px] font-black text-white shadow-sm">
                  2
                </span>
              </Link>

              {/* LOGIN BUTTON (Desktop) */}
              <div className="hidden md:flex items-center">
                <button
                    type="button"
                    onClick={() => setIsLoginOpen(true)}
                  className="group relative flex items-center justify-center gap-2 px-7 py-2.5 rounded-full font-bold text-sm text-white overflow-hidden transition-all duration-500 shadow-[0_4px_14px_rgba(208,169,26,0.25)] hover:shadow-[0_6px_20px_rgba(208,169,26,0.4)] hover:-translate-y-0.5"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#d0a91a] to-[#e2c26a] transition-all duration-500 group-hover:opacity-90"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                  <span className="relative flex items-center gap-2 tracking-wide">
                    Prihlásenie
                    <LogIn className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                  </span>
                </button>
              </div>

              {/* MOBILE MENU BUTTON */}
              <div className="md:hidden flex items-center z-50">
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white/50 border border-white/60 shadow-sm hover:bg-white/80 transition-all duration-300 focus:outline-none group"
                  aria-label={isMobileMenuOpen ? "Zatvoriť menu" : "Otvoriť menu"}
                >
                  {!isMobileMenuOpen && (
                    <span className="absolute top-2 right-2 flex h-3 w-3 rounded-full bg-[#d0a91a] border-2 border-[#fcf7f3]"></span>
                  )}
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6 text-[#3E2E48] transition-transform duration-300 rotate-90" strokeWidth={2} />
                  ) : (
                    <Menu className="w-6 h-6 text-[#3E2E48] transition-transform duration-300" strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>
            
          </div>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[100%] left-0 w-full bg-white/80 backdrop-blur-2xl border-b border-white/50 px-6 py-8 shadow-2xl flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-400">
            <nav className="flex flex-col gap-3">
              
              <Link 
                href="/kids" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="group relative flex items-center justify-start gap-3 px-6 py-4 rounded-2xl font-bold text-base text-[#3E2E48] overflow-hidden transition-all duration-300 hover:shadow-md hover:text-[#d0a91a]"
              >
                <div className="absolute inset-0 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl transition-all duration-300 group-hover:bg-white/90 group-hover:border-[#d0a91a]/30"></div>
                <LayoutList className="relative w-5 h-5 text-[#d0a91a]" strokeWidth={2.5} />
                <span className="relative">Triedy</span>
              </Link>

              <Link 
                href="/parents" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="group relative flex items-center justify-start gap-3 px-6 py-4 rounded-2xl font-bold text-base text-[#3E2E48] overflow-hidden transition-all duration-300 hover:shadow-md hover:text-[#d0a91a]"
              >
                <div className="absolute inset-0 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl transition-all duration-300 group-hover:bg-white/90 group-hover:border-[#d0a91a]/30"></div>
                <Users className="relative w-5 h-5 text-[#d0a91a]" strokeWidth={2.5} />
                <span className="relative">Rodičia</span>
              </Link>

              {/* Zamestnanci Mobile */}
              <Link 
                href="/employees" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="group relative flex items-center justify-start gap-3 px-6 py-4 rounded-2xl font-bold text-base text-[#3E2E48] overflow-hidden transition-all duration-300 hover:shadow-md hover:text-[#d0a91a]"
              >
                <div className="absolute inset-0 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl transition-all duration-300 group-hover:bg-white/90 group-hover:border-[#d0a91a]/30"></div>
                <Briefcase className="relative w-5 h-5 text-[#d0a91a]" strokeWidth={2.5} />
                <span className="relative">Zamestnanci</span>
              </Link>

              <Link 
                href="/lunch-checkout"
                onClick={() => setIsMobileMenuOpen(false)}
                className="group relative flex items-center justify-start gap-3 px-6 py-4 rounded-2xl font-bold text-base text-[#3E2E48] overflow-hidden transition-all duration-300 hover:shadow-md hover:text-[#d0a91a]"
              >
                <div className="absolute inset-0 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl transition-all duration-300 group-hover:bg-white/90 group-hover:border-[#d0a91a]/30"></div>
                <Utensils className="relative w-5 h-5 text-[#d0a91a]" strokeWidth={2.5} />
                <span className="relative">Strava</span>
              </Link>

              <Link 
                href="/chat" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="group relative flex items-center justify-start gap-3 px-6 py-4 rounded-2xl font-bold text-base text-[#3E2E48] overflow-hidden transition-all duration-300 hover:shadow-md hover:text-[#d0a91a]"
              >
                <div className="absolute inset-0 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl transition-all duration-300 group-hover:bg-white/90 group-hover:border-[#d0a91a]/30"></div>
                <MessageCircle className="relative w-5 h-5 text-[#d0a91a]" strokeWidth={2.5} />
                <span className="relative">Správy</span>
                <span className="relative ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-[#d0a91a] text-[11px] font-black text-white shadow-sm">
                  2
                </span>
              </Link>

            </nav>

            <div className="pt-2 flex flex-col gap-3 border-t border-[#3E2E48]/10 mt-2">
              <button
                  type="button"
                  onClick={() => {
                    setIsLoginOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                className="relative flex items-center justify-center gap-2 w-full font-bold text-base py-4 px-6 rounded-2xl text-white overflow-hidden transition-all duration-500 group shadow-lg shadow-[#d0a91a]/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#d0a91a] to-[#e2c26a] group-active:opacity-90"></div>
                <span className="relative flex items-center gap-2">
                  Prihlásenie
                  <LogIn className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                </span>
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