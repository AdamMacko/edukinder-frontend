"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogIn, Menu, X, MessageCircle, LayoutList, Users, Briefcase, Utensils, LogOut,CalendarDays } from 'lucide-react';
import LoginModal from "../LoginModal";
import { DesktopNav } from './DesktopNav';
import { UserDropdown } from './UserDropdown';
import { useAuth } from '@/app/context/AuthContext';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const { user, isLoading, logout } = useAuth();
  const isAuthenticated = !!user;

  // 1. EFEKT NA ZAMKNUTIE SKROLOVANIA (SCROLL LOCK)
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'; // Zamkne pozadie
    } else {
      document.body.style.overflow = ''; // Odomkne pozadie
    }
    // Cleanup funkcia pre istotu, ak by sa komponent odmontoval
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  // Efekt pre glassmorphism hlavičky pri skrolovaní
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Iniciálky pre mobilné menu
  const getInitial = () => {
    if (!user) return "";
    return user.firstName ? user.firstName[0].toUpperCase() : user.email[0].toUpperCase();
  };

  return (
    <>
      <header className={`w-full sticky top-0 z-50 transition-all duration-500 ${
        // Keď je otvorené menu, natvrdo dáme plnú farbu, aby nepresvitala hlavička
        isMobileMenuOpen ? 'bg-[#fcf7f3]' : (scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-white/50' : 'bg-[#fcf7f3]')
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            <div className="flex items-center gap-12">
              <Link href="/" className="relative z-50">
                <Image src="/logo.svg" alt="Logo" width={130} height={35} className="h-9 w-auto" priority />
              </Link>
              {!isLoading && isAuthenticated && <DesktopNav />}
            </div>

            <div className="flex items-center gap-4">
              {!isLoading && isAuthenticated && (
                <Link href="/chat" className="hidden md:flex relative group w-11 h-11 items-center justify-center rounded-full bg-white/50 border border-white/80 hover:bg-white shadow-sm transition-all">
                  <MessageCircle className="w-5 h-5 text-[#3E2E48]/70 group-hover:text-[#d0a91a]" strokeWidth={2.5} />
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#d0a91a] border-2 border-white text-[9px] font-black text-white shadow-sm">2</span>
                </Link>
              )}

              <div className="hidden md:flex">
                {isLoading ? (
                  <div className="w-32 h-10 bg-black/5 animate-pulse rounded-full" />
                ) : isAuthenticated ? (
                  <UserDropdown user={user} onLogout={logout} />
                ) : (
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-[#d0a91a] to-[#e2c26a] shadow-lg shadow-[#d0a91a]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Prihlásenie <LogIn className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                )}
              </div>

              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="md:hidden w-11 h-11 flex items-center justify-center rounded-full bg-white/50 border border-[#3E2E48]/10 shadow-sm z-50"
              >
                {isMobileMenuOpen ? <X className="text-[#3E2E48]" /> : <Menu className="text-[#3E2E48]" />}
              </button>
            </div>
          </div>
        </div>

        {/* 2. PLNE NEPRIEHĽADNÉ MOBILNÉ MENU */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[100%] left-0 w-full h-[100vh] bg-[#fcf7f3] overflow-y-auto px-6 py-8 flex flex-col gap-6 animate-in fade-in duration-200 z-40 border-t border-[#3E2E48]/5">
            {isAuthenticated && (
              <nav className="flex flex-col gap-3">
                <Link href="/lunch-checkout" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-base text-[#3E2E48] bg-white shadow-sm border border-[#3E2E48]/5 active:scale-[0.98] transition-all">
                  <CalendarDays className="w-5 h-5 text-[#d0a91a]" strokeWidth={2.5} /> Strava
                </Link>
                 <Link href="/kids" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-base text-[#3E2E48] bg-white shadow-sm border border-[#3E2E48]/5 active:scale-[0.98] transition-all">
                  <LayoutList className="w-5 h-5 text-[#d0a91a]" strokeWidth={2.5} /> Triedy
                </Link>
                <Link href="/parents" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-base text-[#3E2E48] bg-white shadow-sm border border-[#3E2E48]/5 active:scale-[0.98] transition-all">
                  <Users className="w-5 h-5 text-[#d0a91a]" strokeWidth={2.5} /> Rodičia
                </Link>
                <Link href="/employees" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-base text-[#3E2E48] bg-white shadow-sm border border-[#3E2E48]/5 active:scale-[0.98] transition-all">
                  <Briefcase className="w-5 h-5 text-[#d0a91a]" strokeWidth={2.5} /> Zamestnanci
                </Link>
                <Link href="/attendance" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-base text-[#3E2E48] bg-white shadow-sm border border-[#3E2E48]/5 active:scale-[0.98] transition-all">
                  <Utensils className="w-5 h-5 text-[#d0a91a]" strokeWidth={2.5} /> Dochádzka
                </Link>
                <Link href="/chat" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-base text-[#3E2E48] bg-white shadow-sm border border-[#3E2E48]/5 active:scale-[0.98] transition-all">
                  <MessageCircle className="w-5 h-5 text-[#d0a91a]" strokeWidth={2.5} /> Správy
                </Link>
              </nav>
            )}

            <div className={`pt-2 flex flex-col gap-3 mt-auto mb-24`}>
              {!isAuthenticated ? (
                <button onClick={() => { setIsLoginOpen(true); setIsMobileMenuOpen(false); }} className="flex items-center justify-center gap-2 w-full font-bold text-base py-4 px-6 rounded-2xl text-white bg-gradient-to-r from-[#d0a91a] to-[#e2c26a] shadow-lg shadow-[#d0a91a]/20 active:scale-[0.98] transition-all">
                  Prihlásenie <LogIn className="w-5 h-5" strokeWidth={2.5} />
                </button>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d0a91a] to-[#e2c26a] text-white flex items-center justify-center font-black text-sm shadow-sm">{getInitial()}</div>
                    <span className="text-base font-bold text-[#3E2E48]">{user?.firstName || "Používateľ"}</span>
                  </div>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex items-center justify-center gap-2 w-full font-bold text-base py-4 px-6 rounded-2xl text-[#b15252] bg-white border border-[#b15252]/20 shadow-sm active:scale-[0.98] transition-all">
                    <LogOut className="w-5 h-5" strokeWidth={2.5} /> Odhlásiť sa
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};