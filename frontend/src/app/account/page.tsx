"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import usersData from "@/data/users.json";
import { useShop } from "@/context/ShopContext";
import { User, Mail, Lock, Phone, MapPin, ArrowRight } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { user, login } = useShop();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      // Find matching user in users.json
      const foundUser = usersData.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (foundUser) {
        login({
          name: foundUser.name,
          email: foundUser.email,
          phone: foundUser.phone,
          address: foundUser.address,
        });
        router.push("/dashboard");
      } else {
        // Fallback login with entered email
        login({
          name: email.split("@")[0] || "Mostafizur Rahman",
          email: email,
          phone: "01681-135030",
          address: "41/1, Sher-E-Bangla Rd, Mohammadpur, Dhaka 1207",
        });
        router.push("/dashboard");
      }
    } else {
      // Register new user
      login({
        name: name || "New Customer",
        email: email || "customer@shopiabd.com",
        phone: phone || "01700-000000",
        address: address || "Dhaka, Bangladesh",
      });
      router.push("/dashboard");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans py-14 px-4 flex items-center justify-center pb-20">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-lg space-y-6">
        
        {/* Toggle Tabs */}
        <div className="flex items-center justify-center p-1.5 bg-slate-100 rounded-full border border-slate-200">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-all ${
              mode === "login"
                ? "bg-[#0b3b82] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-all ${
              mode === "register"
                ? "bg-[#0b3b82] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Register
          </button>
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-xs text-slate-500">
            {mode === "login"
              ? "Sign in to access your ShopiaBD dashboard & order history."
              : "Register now to enjoy fast checkout & order tracking."}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-semibold text-center border border-rose-200">
            {error}
          </div>
        )}

        {/* Login / Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === "register" && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Mostafizur Rahman"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0b3b82]/30"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="user@shopiabd.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0b3b82]/30"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0b3b82]/30"
              />
            </div>
          </div>

          {mode === "register" && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="01681-135030"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0b3b82]/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Delivery Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <textarea
                    rows={2}
                    placeholder="House, Road, Area, Dhaka"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0b3b82]/30"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-[#0b3b82] hover:bg-[#b30047] text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all duration-300 mt-2"
          >
            {mode === "login" ? "Sign In to Account" : "Create New Account"}
          </button>
        </form>

        {/* Demo Credentials Tip */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-[11px] text-[#0b3b82]">
          <p className="font-bold">Demo Login Credentials:</p>
          <p>Email: <span className="font-mono">user@shopiabd.com</span> | Pass: <span className="font-mono">password123</span></p>
        </div>

      </div>
    </div>
  );
}
