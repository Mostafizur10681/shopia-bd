import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, CreditCard, ShieldCheck, Share2, Globe, MessageSquare } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm mt-16 border-t border-slate-800">
      {/* Top Banner Feature Trust Badges */}
      <div className="border-b border-slate-800 py-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="w-12 h-12 bg-rose-600/10 text-rose-500 rounded-full flex items-center justify-center font-bold text-xl">
              🚚
            </div>
            <div>
              <h4 className="font-bold text-white">Fast Nationwide Delivery</h4>
              <p className="text-xs text-slate-400">Cash on delivery all over Bangladesh</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center font-bold text-xl">
              🛡️
            </div>
            <div>
              <h4 className="font-bold text-white">100% Authentic Products</h4>
              <p className="text-xs text-slate-400">Directly imported & original items</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center font-bold text-xl">
              💳
            </div>
            <div>
              <h4 className="font-bold text-white">Secure Payments</h4>
              <p className="text-xs text-slate-400">bKash, Nagad, SSLCommerz & Cards</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center font-bold text-xl">
              🎧
            </div>
            <div>
              <h4 className="font-bold text-white">24/7 Dedicated Support</h4>
              <p className="text-xs text-slate-400">Call us anytime for order support</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Col 1 */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-rose-600 to-rose-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
              S
            </div>
            <span className="text-2xl font-black tracking-tight text-white">Shopia<span className="text-rose-600">BD</span></span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed pr-4">
            ShopiaBD is your premier online shopping destination in Bangladesh. Bringing you top tier electronics, gadgets, fashion, and lifestyle products with unmatched quality and service.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="#" className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:bg-rose-600 hover:text-white transition">
              <Share2 className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:bg-rose-600 hover:text-white transition">
              <Globe className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:bg-rose-600 hover:text-white transition">
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Col 2 */}
        <div>
          <h3 className="font-bold text-white text-base mb-4 border-l-2 border-rose-500 pl-3">Quick Links</h3>
          <ul className="space-y-2.5">
            <li><Link href="/about" className="hover:text-rose-400 transition">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-rose-400 transition">Contact Us</Link></li>
            <li><Link href="/blogs" className="hover:text-rose-400 transition">Latest News & Blogs</Link></li>
            <li><Link href="/terms" className="hover:text-rose-400 transition">Terms & Conditions</Link></li>
            <li><Link href="/privacy" className="hover:text-rose-400 transition">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h3 className="font-bold text-white text-base mb-4 border-l-2 border-rose-500 pl-3">Customer Service</h3>
          <ul className="space-y-2.5">
            <li><Link href="/faq" className="hover:text-rose-400 transition">FAQ & Help</Link></li>
            <li><Link href="/shipping" className="hover:text-rose-400 transition">Shipping Policy</Link></li>
            <li><Link href="/return-policy" className="hover:text-rose-400 transition">Returns & Exchange</Link></li>
            <li><Link href="/track-order" className="hover:text-rose-400 transition">Order Tracking</Link></li>
            <li><Link href="/warranty" className="hover:text-rose-400 transition">Warranty Info</Link></li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h3 className="font-bold text-white text-base mb-4 border-l-2 border-rose-500 pl-3">Contact Us</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <span>Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-rose-500 shrink-0" />
              <span>+880 1700-000000</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-rose-500 shrink-0" />
              <span>support@shopiabd.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-900 py-6 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 ShopiaBD. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span>Supported Payment Methods:</span>
            <div className="flex items-center gap-2 font-bold text-slate-300">
              <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-pink-500">bKash</span>
              <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-orange-500">Nagad</span>
              <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-violet-400">SSLCommerz</span>
              <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-emerald-400">COD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
