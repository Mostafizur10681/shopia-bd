"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingCart, User, X, ChevronDown, Plus, Minus } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import productsData from "@/data/products.json";

export function Header() {
  const [showTopNotice, setShowTopNotice] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { wishlist, cart, addToCart, updateQuantity, removeFromCart, setQuickViewProduct } = useShop();

  const totalCartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalWishlistCount = wishlist.length;

  const searchResults = searchQuery.trim()
    ? productsData.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

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

        {/* Center Search Input with Instant Dropdown Results */}
        <div className="flex-1 max-w-xl mx-auto relative hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products (e.g. Maca, Chia, VWash...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100/90 border border-slate-200 rounded-full pl-6 pr-12 py-2.5 text-sm text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0b3b82]/30 transition-all placeholder:text-slate-400"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 hover:text-[#0b3b82] transition-colors">
                <Search className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Instant Search Results Dropdown */}
          {searchQuery.trim() !== "" && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 max-h-96 overflow-y-auto divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-200">
              {searchResults.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm">
                  No products found matching &quot;<span className="font-semibold text-slate-700">{searchQuery}</span>&quot;
                </div>
              ) : (
                searchResults.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      setQuickViewProduct(prod);
                      setSearchQuery("");
                    }}
                    className="p-3 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition"
                  >
                    <div className="w-12 h-12 bg-slate-100 rounded-lg relative overflow-hidden shrink-0 flex items-center justify-center p-1">
                      <Image
                        src={prod.mainImage}
                        alt={prod.name}
                        fill
                        sizes="48px"
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate hover:text-[#0b3b82]">
                        {prod.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">{prod.category}</p>
                    </div>
                    <div className="text-sm font-black text-[#ff8c00] shrink-0">
                      ৳{typeof prod.price === "number" ? prod.price.toFixed(2) : prod.price}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
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

          {/* Cart Icon with Badge & Hover Dropdown Window */}
          <div className="relative group py-2">
            <Link href="/cart" className="relative text-amber-500 hover:text-[#b30047] transition flex items-center">
              <ShoppingCart className="w-6 h-6 stroke-[1.8]" />
              <span className="absolute -top-2 -right-2 bg-[#0b3b82] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalCartCount}
              </span>
            </Link>

            {/* Hover Cart Popup Window */}
            <div className="absolute right-0 top-full pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-50 w-80 sm:w-96">
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4 text-slate-800 animate-in fade-in zoom-in-95 duration-200">
                {cart.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 space-y-2">
                    <ShoppingCart className="w-10 h-10 mx-auto opacity-30" />
                    <p className="text-sm font-semibold">Your cart is currently empty</p>
                  </div>
                ) : (
                  <>
                    {/* Cart Items List */}
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 pr-1 space-y-3">
                      {cart.map((item) => (
                        <div key={item.id} className="pt-3 first:pt-0 flex items-start gap-3 relative">
                          {/* Item Thumbnail */}
                          <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-xl relative shrink-0 overflow-hidden flex items-center justify-center p-1">
                            <Image
                              src={item.mainImage}
                              alt={item.name}
                              fill
                              sizes="64px"
                              className="object-contain"
                            />
                          </div>

                          {/* Item Details */}
                          <div className="flex-1 min-w-0 pr-6 space-y-1.5">
                            <h4 className="text-xs font-semibold text-[#0b3b82] truncate leading-tight">
                              {item.name}
                            </h4>

                            {/* Quantity Controls */}
                            <div className="inline-flex items-center border border-slate-200 rounded-full bg-slate-100/80 px-2 py-0.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  updateQuantity(item.id, -1);
                                }}
                                className="w-5 h-5 rounded-full text-slate-600 hover:bg-white flex items-center justify-center text-xs transition"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-bold text-slate-800">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  updateQuantity(item.id, 1);
                                }}
                                className="w-5 h-5 rounded-full text-slate-600 hover:bg-white flex items-center justify-center text-xs transition"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-sm font-bold text-[#0b3b82]">
                              ৳{item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </div>
                          </div>

                          {/* Remove Item Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              removeFromCart(item.id);
                            }}
                            className="absolute top-2 right-0 text-slate-400 hover:text-slate-700 text-sm font-bold p-1 transition"
                            title="Remove item"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Subtotal Section */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between font-bold text-sm">
                      <span className="text-[#0b3b82]">Subtotal :</span>
                      <span className="text-[#0b3b82] text-base">
                        ৳{cartSubtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2.5 pt-1">
                      <Link
                        href="/cart"
                        className="w-full border-2 border-[#ff8c00] text-[#ff8c00] hover:bg-[#ff8c00] hover:text-white font-bold text-xs py-2.5 rounded-full transition-all duration-200 text-center block"
                      >
                        View Cart
                      </Link>

                      <Link
                        href="/checkout"
                        className="w-full bg-[#ff8c00] hover:bg-[#e07b00] text-white font-bold text-xs py-2.5 rounded-full transition-all duration-200 shadow-md text-center block"
                      >
                        Checkout
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
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
