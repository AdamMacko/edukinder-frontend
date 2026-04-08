"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
      className={`w-full sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/40 backdrop-blur-2xl border-b border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.08)]' 
          : 'bg-transparent'
      }`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-gradient-to-br from-amber-100/20 to-transparent rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-gradient-to-tr from-purple-100/10 to-transparent rounded-full blur-3xl animate-pulse opacity-20" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO SECTION - Premium text logo with gradient */}
          <Link 
            href="/" 
            className="flex items-center group relative z-50 no-underline"
          >
            <div className="flex items-baseline gap-1">
              <span className="text-2xl md:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
                EduKinder
              </span>
              <span className="text-3xl md:text-4xl font-light text-amber-400 animate-bounce" style={{animationDuration: '2s', animationDelay: '0s'}}>
                ·
              </span>
            </div>
            <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-amber-200/0 via-amber-200/10 to-amber-200/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
          </Link>

          {/* DESKTOP NAVIGATION - Glass button for Strava */}
          <nav className="hidden sm:flex items-center gap-10 ml-12">
            <Link 
              href="#strava" 
              className="group relative px-5 py-2.5 rounded-full font-semibold text-sm text-slate-700 overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              {/* Glass background */}
              <div className="absolute inset-0 bg-white/30 backdrop-blur-xl border border-white/40 rounded-full transition-all duration-300 group-hover:bg-white/50 group-hover:border-white/60"></div>
              
              {/* Content */}
              <span className="relative flex items-center justify-center">
                Strava
              </span>
            </Link>
          </nav>

          {/* LOGIN BUTTON - Premium glass morphism design */}
          <div className="hidden sm:flex items-center ml-auto gap-4">
            <button
                type="button"
                onClick={() => setIsLoginOpen(true)}
              className="group relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm text-white overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-yellow-500/30"
            >
              {/* Background with custom color */}
              <div className="absolute inset-0 bg-[#d0a91a] transition-all duration-500 group-hover:opacity-90"></div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-700 group-hover:duration-500"></div>
              
              {/* Content */}
              <span className="relative flex items-center gap-2">
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

          {/* MOBILE MENU BUTTON - Animated hamburger */}
          <div className="sm:hidden flex items-center z-50">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-all duration-300 focus:outline-none group"
              aria-label={isMobileMenuOpen ? "Zatvoriť menu" : "Otvoriť menu"}
            >
              <div className="relative w-6 h-5 flex flex-col justify-between">
                <span className={`h-0.5 w-full bg-slate-900 rounded-full transition-all duration-500 origin-left ${isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
                <span className={`h-0.5 w-full bg-slate-900 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-0' : 'scale-100'}`} />
                <span className={`h-0.5 w-full bg-slate-900 rounded-full transition-all duration-500 origin-left ${isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU - Glass morphism */}
      {isMobileMenuOpen && (
        <div className="sm:hidden absolute top-20 left-0 w-full bg-white/30 backdrop-blur-xl border-b border-white/30 px-6 py-8 shadow-2xl flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <nav className="flex flex-col gap-3">
            <Link 
              href="#strava" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="group relative px-5 py-2.5 rounded-full font-semibold text-sm text-slate-700 overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              {/* Glass background */}
              <div className="absolute inset-0 bg-white/30 backdrop-blur-xl border border-white/40 rounded-full transition-all duration-300 group-hover:bg-white/50 group-hover:border-white/60"></div>
              
              {/* Content */}
              <span className="relative">
                Strava
              </span>
            </Link>
          </nav>

          <div className="pt-4 border-t border-white/30 mt-2 flex flex-col gap-3">
            <button
                type="button"
                onClick={() => setIsLoginOpen(true)}
              className="relative flex items-center justify-center gap-2 w-full font-semibold text-base py-3 px-6 rounded-xl text-white overflow-hidden transition-all duration-500 group"
            >
              <div className="absolute inset-0 bg-[#d0a91a] group-active:opacity-90"></div>
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