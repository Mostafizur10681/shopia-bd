"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingCart, User, X, ChevronDown } from "lucide-react";
import { useShop } from "@/context/ShopContext";

export function Header() {
  const [showTopNotice, setShowTopNotice] = useState(true);
  const { wishlist, cart } = useShop();

  const totalCartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const totalWishlistCount = wishlist.length;

  return (
    <header className="w-full bg-white font-sans border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      {/* 1. Top Announcement Bar */}
      {showTopNotice && (
        <div className="bg-[#0b3b82] text-amber-300 text-xs py-2 px-4 flex items-center justify-between text-center relative transition-all">
          <div className="w-full text-center">
            <span>Fastest delivery across Bangladesh! Free delivery on orders over ৳3,000</span>
          </div>
          <button 
            onClick={() => setShowTopNotice(false)}
            className="text-white/80 hover:text-white absolute right-4 top-1/2 -translate-y-1/2 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Main Middle Bar */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-1 group shrink-0">
          <div className="flex items-center">
            <span className="text-3xl sm:text-4xl font-black italic tracking-tighter text-[#b30047]">
              S<span className="text-[#e60000]">HOPIA</span>
            </span>
          </div>
        </Link>

        {/* Center Search Input */}
        <div className="flex-1 max-w-xl mx-auto relative hidden md:block">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search for products" 
              className="w-full bg-slate-100/90 border border-slate-200 rounded-full pl-6 pr-12 py-2.5 text-sm text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0b3b82]/30 transition-all placeholder:text-slate-400"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 hover:text-[#0b3b82] transition-colors">
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Right User Actions */}
        <div className="flex items-center gap-6">
          {/* User Icon */}
          <Link href="/account" className="text-slate-700 hover:text-[#b30047] transition">
            <User className="w-6 h-6 stroke-[1.8]" />
          </Link>

          {/* Wishlist Icon with Badge */}
          <Link href="/wishlist" className="relative text-[#0b3b82] hover:text-[#b30047] transition">
            <Heart className="w-6 h-6 stroke-[1.8]" />
            {totalWishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#ff8c00] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                {totalWishlistCount}
              </span>
            )}
            {totalWishlistCount === 0 && (
              <span className="absolute -top-2 -right-2 bg-[#0b3b82] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            )}
          </Link>

          {/* Cart Icon with Badge */}
          <Link href="/cart" className="relative text-amber-500 hover:text-[#b30047] transition">
            <ShoppingCart className="w-6 h-6 stroke-[1.8]" />
            {totalCartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#e60000] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                {totalCartCount}
              </span>
            )}
            {totalCartCount === 0 && (
              <span className="absolute -top-2 -right-2 bg-[#0b3b82] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* 3. Bottom Category Navigation Menu */}
      <div className="border-t border-slate-100 bg-white text-[#0b3b82] font-semibold text-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-2.5">
          <nav className="flex items-center gap-8 overflow-x-auto">
            <Link href="/" className="text-[#0b3b82] hover:text-[#b30047] transition whitespace-nowrap">
              Home
            </Link>
            <Link href="/categories/organic-food" className="hover:text-[#b30047] transition whitespace-nowrap">
              Organic Food
            </Link>
            <Link href="/categories/beauty" className="hover:text-[#b30047] transition whitespace-nowrap">
              Beauty
            </Link>
            <Link href="/categories/food-supplements" className="hover:text-[#b30047] transition whitespace-nowrap">
              Food Supplements
            </Link>

            {/* Dropdown Items */}
            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-[#b30047] transition whitespace-nowrap">
              <span>Health</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>

            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-[#b30047] transition whitespace-nowrap">
              <span>Babies Hub</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>

            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-[#b30047] transition whitespace-nowrap">
              <span>Grocery</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>

            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-[#b30047] transition whitespace-nowrap">
              <span>Pharma Point</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </nav>

          {/* Right Phone Call Hotline */}
          <div className="hidden lg:flex items-center gap-1 text-slate-500 text-xs whitespace-nowrap">
            <span>Call Us</span>
            <span className="font-bold text-[#0b3b82] text-sm ml-1">01681-135030</span>
          </div>
        </div>
      </div>
    </header>
  );
}
