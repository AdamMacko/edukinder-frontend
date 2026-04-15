"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// VYMAZALI SME API_BASE, ABY SME VYUŽILI NEXT.JS PROXY

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      // ZMENA: Voláme len lokálnu cestu, Next.js to tajne prepošle na Render!
      const res = await fetch(`/api/auth/me`, { 
        credentials: "include" 
      });
      
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Chyba pri overovaní používateľa:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // ZMENA: Aj odhlásenie ide cez lokálnu cestu
      await fetch(`/api/auth/logout`, { 
        method: "POST", 
        credentials: "include" 
      });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error("Chyba pri odhlasovaní:", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth musí byť použitý vo vnútri AuthProvidera");
  }
  return context;
};