"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminUser {
  name: string;
  email: string;
  phone?: string;
  role: string;
  token?: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; errors?: Record<string, string>; message?: string }>;
  register: (name: string, email: string, phone: string, pass: string, passConfirm: string) => Promise<{ success: boolean; errors?: Record<string, string>; message?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("shopia_admin_session");
    if (saved) {
      try {
        setAdmin(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem("shopia_admin_session");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; errors?: Record<string, string>; message?: string }> => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        const userObj = { ...data.admin, token: data.token };
        setAdmin(userObj);
        localStorage.setItem("shopia_admin_session", JSON.stringify(userObj));
        document.cookie = `shopia_admin_session=true; path=/; max-age=${60 * 60 * 24 * 7}`;
        return { success: true };
      } else {
        const fieldErrors: Record<string, string> = {};
        if (data.errors) {
          Object.keys(data.errors).forEach((key) => {
            fieldErrors[key] = data.errors[key][0];
          });
        }
        return { success: false, errors: fieldErrors, message: data.message || "Invalid email or password." };
      }
    } catch (err) {
      console.warn("Backend API offline, using local verification for preview", err);
      if (email === "admin@shopia.com" && pass === "password123") {
        const userObj = { name: "Abir", email, phone: "01681-135030", role: "Super Admin" };
        setAdmin(userObj);
        localStorage.setItem("shopia_admin_session", JSON.stringify(userObj));
        document.cookie = `shopia_admin_session=true; path=/; max-age=${60 * 60 * 24 * 7}`;
        return { success: true };
      }
      return { success: false, errors: { email: "Invalid credentials." } };
    }
  };

  const register = async (name: string, email: string, phone: string, pass: string, passConfirm: string): Promise<{ success: boolean; errors?: Record<string, string>; message?: string }> => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          password: pass,
          password_confirmation: passConfirm,
        }),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        const userObj = { ...data.admin, token: data.token };
        setAdmin(userObj);
        localStorage.setItem("shopia_admin_session", JSON.stringify(userObj));
        document.cookie = `shopia_admin_session=true; path=/; max-age=${60 * 60 * 24 * 7}`;
        return { success: true };
      } else {
        const fieldErrors: Record<string, string> = {};
        if (data.errors) {
          Object.keys(data.errors).forEach((key) => {
            fieldErrors[key] = data.errors[key][0];
          });
        }
        return { success: false, errors: fieldErrors, message: data.message || "Registration failed." };
      }
    } catch (err) {
      console.warn("Backend API offline, registering local session", err);
      const userObj = { name, email, phone, role: "Super Admin" };
      setAdmin(userObj);
      localStorage.setItem("shopia_admin_session", JSON.stringify(userObj));
      document.cookie = `shopia_admin_session=true; path=/; max-age=${60 * 60 * 24 * 7}`;
      return { success: true };
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("shopia_admin_session");
    document.cookie = "shopia_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  };

  return (
    <AdminAuthContext.Provider value={{ admin, isLoading, login, register, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
