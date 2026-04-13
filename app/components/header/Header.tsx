"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogIn, Menu, X, MessageCircle, LayoutList, Users, Briefcase, Utensils, LogOut, Megaphone } from 'lucide-react';
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

  // Zamknutie pozadia pri otvorenom menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  // Sledovanie scrollovania pre Glassmorphism efekt
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getInitial = () => {
    if (!user) return "";
    return user.firstName ? user.firstName[0].toUpperCase() : user.email[0].toUpperCase();
  };

  return (
    <>
      <header className={`w-full sticky top-0 z-50 transition-all duration-300 border-b ${
        isMobileMenuOpen 
          ? 'bg-[#fcf7f3] border-transparent' 
          : (scrolled ? 'bg-white/85 backdrop-blur-xl border-white/40 shadow-sm' : 'bg-[#fcf7f3] border-transparent')
      }`}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Lavá strana (Logo + PC Navigácia) */}
            <div className="flex items-center gap-6 lg:gap-8 xl:gap-12">
              <Link href="/" className="relative z-50 shrink-0">
                <Image src="/logo.svg" alt="Logo" width={130} height={35} className="h-8 sm:h-9 w-auto" priority />
              </Link>
              
              {/* ZMENA: Navigácia sa ukáže až na 'xl' obrazovkách (>1280px) */}
              <div className="hidden xl:block">
                {!isLoading && isAuthenticated && <DesktopNav />}
              </div>
            </div>

            {/* Pravá strana (Chat + Profil / Prihlásenie) */}
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* ZMENA: Chat ikona sa ukáže až na 'xl' */}
              {!isLoading && isAuthenticated && (
                <Link href="/chat" className="hidden xl:flex relative group w-11 h-11 items-center justify-center rounded-full bg-white/60 border border-white/80 hover:bg-white shadow-sm transition-all">
                  <MessageCircle className="w-5 h-5 text-[#3E2E48]/70 group-hover:text-[#d0a91a]" strokeWidth={2.5} />
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#d0a91a] border-2 border-white text-[9px] font-black text-white shadow-sm">2</span>
                </Link>
              )}

              {/* Profil/Prihlásenie sa ukáže až na 'xl' */}
              <div className="hidden xl:flex">
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

              {/* Hamburger tlačidlo - Je viditeľné až do 'xl' (1280px) */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="xl:hidden w-11 h-11 flex items-center justify-center rounded-full bg-white/60 border border-[#3E2E48]/10 shadow-sm z-50 active:scale-95 transition-all"
              >
                {isMobileMenuOpen ? <X className="text-[#3E2E48] w-5 h-5" /> : <Menu className="text-[#3E2E48] w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILNÉ MENU - ZMENA: Zobrazuje sa na všetkom menšom ako 'xl' */}
        {isMobileMenuOpen && (
          <div className="xl:hidden fixed top-20 left-0 w-full h-[calc(100dvh-80px)] bg-[#fcf7f3] overflow-y-auto px-4 sm:px-6 py-6 flex flex-col z-40 animate-in fade-in slide-in-from-top-2 duration-200">
            
            {!isAuthenticated ? (
              <button 
                onClick={() => { setIsLoginOpen(true); setIsMobileMenuOpen(false); }} 
                className="flex items-center justify-center gap-2 w-full font-bold text-[15px] py-4 px-6 rounded-2xl text-white bg-gradient-to-r from-[#d0a91a] to-[#e2c26a] shadow-lg shadow-[#d0a91a]/20 active:scale-[0.98] transition-all"
              >
                Prihlásenie <LogIn className="w-5 h-5" strokeWidth={2.5} />
              </button>
            ) : (
              <>
                <nav className="flex flex-col gap-2.5">
                  <Link href="/announcements" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-[15px] text-[#3E2E48] bg-white shadow-sm border border-[#3E2E48]/5 active:scale-[0.98] transition-all">
                    <Megaphone className="w-5 h-5 text-[#d0a91a]" strokeWidth={2.5} /> Nástenka
                  </Link>
                  <Link href="/kids" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-[15px] text-[#3E2E48] bg-white shadow-sm border border-[#3E2E48]/5 active:scale-[0.98] transition-all">
                    <LayoutList className="w-5 h-5 text-[#d0a91a]" strokeWidth={2.5} /> Triedy
                  </Link>
                  <Link href="/parents" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-[15px] text-[#3E2E48] bg-white shadow-sm border border-[#3E2E48]/5 active:scale-[0.98] transition-all">
                    <Users className="w-5 h-5 text-[#d0a91a]" strokeWidth={2.5} /> Rodičia
                  </Link>
                  <Link href="/employees" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-[15px] text-[#3E2E48] bg-white shadow-sm border border-[#3E2E48]/5 active:scale-[0.98] transition-all">
                    <Briefcase className="w-5 h-5 text-[#d0a91a]" strokeWidth={2.5} /> Zamestnanci
                  </Link>
                  <Link href="/attendance" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-[15px] text-[#3E2E48] bg-white shadow-sm border border-[#3E2E48]/5 active:scale-[0.98] transition-all">
                    <Utensils className="w-5 h-5 text-[#d0a91a]" strokeWidth={2.5} /> Dochádzka
                  </Link>
                  <Link href="/chat" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-[15px] text-[#3E2E48] bg-white shadow-sm border border-[#3E2E48]/5 active:scale-[0.98] transition-all">
                    <MessageCircle className="w-5 h-5 text-[#d0a91a]" strokeWidth={2.5} /> Správy
                  </Link>
                </nav>

                <div className="mt-auto pt-8 pb-10 flex flex-col gap-4">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-[#d0a91a] to-[#e2c26a] text-white flex items-center justify-center font-black text-sm shadow-sm">{getInitial()}</div>
                    <span className="text-[15px] font-bold text-[#3E2E48] truncate">{user?.firstName || "Používateľ"}</span>
                  </div>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex items-center justify-center gap-2 w-full font-bold text-[15px] py-4 px-5 rounded-2xl text-[#b15252] bg-white border border-[#b15252]/10 shadow-sm active:scale-[0.98] transition-all hover:bg-red-50">
                    <LogOut className="w-5 h-5" strokeWidth={2.5} /> Odhlásiť sa
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </header>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};