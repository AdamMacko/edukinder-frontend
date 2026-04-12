import Link from 'next/link';
import { LayoutList, Users, Briefcase, Utensils, CalendarDays } from 'lucide-react';

export const DesktopNav = () => {
  return (
    <nav className="hidden md:flex items-center gap-2 lg:gap-4 animate-in fade-in duration-500">
      <Link href="/lunch-checkout" className="group relative px-5 py-2.5 rounded-full font-bold text-sm text-[#3E2E48]/80 transition-all hover:text-[#d0a91a]">
        <span className="relative flex items-center gap-2">
          <CalendarDays className="w-4 h-4" strokeWidth={2.5} /> Strava
        </span>
      </Link>
      <Link href="/kids" className="group relative px-5 py-2.5 rounded-full font-bold text-sm text-[#3E2E48]/80 transition-all hover:text-[#d0a91a]">
        <span className="relative flex items-center gap-2">
          <LayoutList className="w-4 h-4" strokeWidth={2.5} /> Triedy
        </span>
      </Link>
      <Link href="/parents" className="group relative px-5 py-2.5 rounded-full font-bold text-sm text-[#3E2E48]/80 transition-all hover:text-[#d0a91a]">
        <span className="relative flex items-center gap-2">
          <Users className="w-4 h-4" strokeWidth={2.5} /> Rodičia
        </span>
      </Link>
      <Link href="/employees" className="group relative px-5 py-2.5 rounded-full font-bold text-sm text-[#3E2E48]/80 transition-all hover:text-[#d0a91a]">
        <span className="relative flex items-center gap-2">
          <Briefcase className="w-4 h-4" strokeWidth={2.5} /> Zamestnanci
        </span>
      </Link>
      <Link href="/attendance" className="group relative px-5 py-2.5 rounded-full font-bold text-sm text-[#3E2E48]/80 transition-all hover:text-[#d0a91a]">
        <span className="relative flex items-center gap-2">
          <CalendarDays className="w-4 h-4" strokeWidth={2.5} /> Dochádzka
        </span>
      </Link>
    </nav>
  );
};