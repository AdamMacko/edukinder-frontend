import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 1. PRIDANÝ IMPORT: Načítame náš AuthProvider
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduKinder - Materská škola", // Jemne som upravil title pre lepší dojem
  description: "Moderný informačný portál pre materské školy",
  icons: [
    {
      media: "(prefers-color-scheme: light)",
      url: "/iconL.svg",
      href: "/iconL.svg",
    },
    {
      media: "(prefers-color-scheme: dark)",
      url: "/iconD.svg",
      href: "/iconD.svg",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sk"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        
        {/* 2. PRIDANÝ WRAPPER: Celá aplikácia je teraz chránená a napojená na AuthContext */}
        <AuthProvider>
          {children}
        </AuthProvider>
        
      </body>
    </html>
  );
}