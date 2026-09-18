"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export type UserRole = "ADMIN" | "CUSTOMER";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextValue {
  user: AdminUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeRole(role?: string): UserRole {
  const r = (role ?? "").toUpperCase();
  if (r === "ADMIN" || r === "OWNER") return "ADMIN";
  return "CUSTOMER";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("admin_token");
    const storedUser = localStorage.getItem("admin_user");
    if (stored && storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as Partial<AdminUser>;
        setToken(stored);
        setUser({
          id: parsed.id || "",
          name: parsed.name || "",
          email: parsed.email || "",
          role: normalizeRole(parsed.role),
        });
      } catch {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Login failed");
    }

    const { token: t, user: u } = data.data;
    const normalizedUser: AdminUser = {
      id: u.id,
      name: u.name,
      email: u.email,
      role: normalizeRole(u.role),
    };

    localStorage.setItem("admin_token", t);
    localStorage.setItem("admin_user", JSON.stringify(normalizedUser));
    setToken(t);
    setUser(normalizedUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
