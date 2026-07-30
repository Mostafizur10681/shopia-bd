"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { ShieldCheck, Lock, Mail, User, ArrowRight, Eye, EyeOff, AlertCircle, Phone } from "lucide-react";

export default function RootAdminPage() {
  const router = useRouter();
  const { admin, isLoading, login, register } = useAdminAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Field-specific error state
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const bdPhoneRegex = /^(?:\+88|88)?01[3-9]\d{8}$/;

  useEffect(() => {
    if (!isLoading && admin) {
      router.push("/dashboard");
    }
  }, [admin, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGlobalError(null);

    const errors: Record<string, string> = {};

    // Validate Email
    if (!email.trim()) {
      errors.email = "Email address is required.";
    }

    // Validate Password (min 8 digits)
    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 digits/characters long.";
    }

    if (!isLogin) {
      // Validate Name
      if (!name.trim()) {
        errors.name = "Administrator name is required.";
      }

      // Validate Phone (11 digits Bangladeshi number)
      if (!phone.trim()) {
        errors.phone = "Phone number is required.";
      } else if (!bdPhoneRegex.test(phone.trim())) {
        errors.phone = "Please enter a valid 11-digit mobile number (e.g. 01712345678).";
      }

      // Validate Confirm Password
      if (!passwordConfirmation) {
        errors.password_confirmation = "Please confirm your password.";
      } else if (password !== passwordConfirmation) {
        errors.password_confirmation = "Password confirmation does not match.";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (isLogin) {
      const res = await login(email, password);
      if (res.success) {
        router.push("/dashboard");
      } else if (res.errors) {
        setFieldErrors(res.errors);
      } else {
        setGlobalError(res.message || "Invalid administrator credentials.");
      }
    } else {
      const res = await register(name, email, phone, password, passwordConfirmation);
      if (res.success) {
        router.push("/dashboard");
      } else if (res.errors) {
        setFieldErrors(res.errors);
      } else {
        setGlobalError(res.message || "Registration failed.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-[#0b3b82] font-bold text-sm">
        Loading Admin Authorization...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Subtle background glow effect */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#0b3b82]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#0b3b82]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#0b3b82]/10 border border-[#0b3b82]/20 text-[#0b3b82] flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-7 h-7 text-[#0b3b82]" />
          </div>
          
          <h1 className="text-2xl font-black text-slate-900 tracking-wide">
            Shopia <span className="text-[#0b3b82]">Admin Control</span>
          </h1>
          <p className="text-xs text-slate-500">
            {isLogin ? "Sign in to access your e-commerce dashboard" : "Register new administrator credentials"}
          </p>
        </div>

        {/* Global Error Banner if any */}
        {globalError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-semibold">{globalError}</span>
          </div>
        )}

        {/* Toggle Pills */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setFieldErrors({});
              setGlobalError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all text-center ${
              isLogin ? "bg-[#0b3b82] text-white shadow-md" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setFieldErrors({});
              setGlobalError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all text-center ${
              !isLogin ? "bg-[#0b3b82] text-white shadow-md" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Register
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {!isLogin && (
            <>
              {/* Administrator Name */}
              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold block">Administrator Name</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Abir"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-slate-800 focus:bg-white focus:outline-none transition ${
                      fieldErrors.name ? "border-rose-500 ring-1 ring-rose-500/30" : "border-slate-200 focus:border-[#0b3b82]"
                    }`}
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                {fieldErrors.name && (
                  <p className="text-[11px] font-semibold text-rose-600 pl-1">{fieldErrors.name}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold block">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="e.g. 01712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-slate-800 focus:bg-white focus:outline-none transition ${
                      fieldErrors.phone ? "border-rose-500 ring-1 ring-rose-500/30" : "border-slate-200 focus:border-[#0b3b82]"
                    }`}
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                {fieldErrors.phone && (
                  <p className="text-[11px] font-semibold text-rose-600 pl-1">{fieldErrors.phone}</p>
                )}
              </div>
            </>
          )}

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-slate-700 font-bold block">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="admin@shopia.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-slate-800 focus:bg-white focus:outline-none transition ${
                  fieldErrors.email ? "border-rose-500 ring-1 ring-rose-500/30" : "border-slate-200 focus:border-[#0b3b82]"
                }`}
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {fieldErrors.email && (
              <p className="text-[11px] font-semibold text-rose-600 pl-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Security Password */}
          <div className="space-y-1.5">
            <label className="text-slate-700 font-bold block">Security Password (Min. 8 digits)</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-slate-50 border rounded-xl pl-10 pr-10 py-3 text-slate-800 focus:bg-white focus:outline-none transition ${
                  fieldErrors.password ? "border-rose-500 ring-1 ring-rose-500/30" : "border-slate-200 focus:border-[#0b3b82]"
                }`}
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-[11px] font-semibold text-rose-600 pl-1">{fieldErrors.password}</p>
            )}
          </div>

          {/* Confirm Security Password */}
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-slate-700 font-bold block">Confirm Security Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className={`w-full bg-slate-50 border rounded-xl pl-10 pr-10 py-3 text-slate-800 focus:bg-white focus:outline-none transition ${
                    fieldErrors.password_confirmation ? "border-rose-500 ring-1 ring-rose-500/30" : "border-slate-200 focus:border-[#0b3b82]"
                  }`}
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              {fieldErrors.password_confirmation && (
                <p className="text-[11px] font-semibold text-rose-600 pl-1">{fieldErrors.password_confirmation}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#0b3b82] hover:bg-[#b30047] text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs cursor-pointer mt-2"
          >
            <span>{isLogin ? "Sign In to Dashboard" : "Register Admin Account"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          Demo Admin Credentials: <span className="text-[#0b3b82] font-mono font-bold">admin@shopia.com</span> / <span className="text-[#0b3b82] font-mono font-bold">password123</span>
        </div>

      </div>
    </div>
  );
}
