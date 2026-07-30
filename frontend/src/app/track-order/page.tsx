"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Truck, CheckCircle2, Clock, Search } from "lucide-react";

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("SHP-2026-8891");
  const [trackedOrder, setTrackedOrder] = useState<any>({
    id: "SHP-2026-8891",
    date: "28 July, 2026",
    status: "In Transit",
    courier: "Steadfast Express / Pathao Courier",
    estimatedDelivery: "Today, by 07:00 PM",
    shippingAddress: "41/1, Sher-E-Bangla Rd, Mohammadpur, Dhaka 1207",
    items: [
      { name: "Organic Black Maca Powder", qty: 1, price: 1150 },
      { name: "Mustard Oil (সরিষার তেল)", qty: 1, price: 300 }
    ],
    total: 1450
  });

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setTrackedOrder({
      id: orderId.trim().toUpperCase(),
      date: "28 July, 2026",
      status: "In Transit",
      courier: "Steadfast Express / Pathao Courier",
      estimatedDelivery: "Today, by 07:00 PM",
      shippingAddress: "41/1, Sher-E-Bangla Rd, Mohammadpur, Dhaka 1207",
      items: [
        { name: "Organic Black Maca Powder", qty: 1, price: 1150 },
        { name: "Mustard Oil (সরিষার তেল)", qty: 1, price: 300 }
      ],
      total: 1450
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans space-y-12 pb-20">
      
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#0b3b82] via-[#092a5e] to-[#b30047] text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3 relative z-10">
          <span className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
            <Truck className="w-4 h-4 text-emerald-400" /> Real-Time Package Tracker
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-wide leading-tight">
            Track Your Order
          </h1>
          <p className="max-w-2xl mx-auto text-blue-100 text-xs sm:text-sm leading-relaxed">
            Enter your order number below to instantly view your shipment status.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 space-y-8">
        
        {/* Tracking Search Card - Only Order No. */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-md">
          <form onSubmit={handleTrack} className="space-y-3">
            <label className="text-xs font-bold text-slate-700 block">Order Number</label>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                placeholder="Enter Order No. (e.g. SHP-2026-8891)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-xs sm:text-sm font-mono text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0b3b82]/30"
              />

              <button
                type="submit"
                className="bg-[#0b3b82] hover:bg-[#b30047] text-white font-bold text-xs sm:text-sm py-3.5 px-8 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 shrink-0"
              >
                <Search className="w-4 h-4" /> Track Order
              </button>
            </div>
          </form>
        </div>

        {/* Live Track Result Display */}
        {trackedOrder && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-md space-y-8">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Shipment Details</span>
                <h2 className="text-xl font-extrabold text-[#0b3b82]">Order #{trackedOrder.id}</h2>
              </div>

              <div className="bg-amber-50 text-amber-800 border border-amber-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>Status: In Transit ({trackedOrder.estimatedDelivery})</span>
              </div>
            </div>

            {/* Progress Stepper */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
                
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Order Confirmed</p>
                  <p className="text-[11px] text-slate-400">28 Jul, 09:30 AM</p>
                </div>

                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Packed &amp; Dispatched</p>
                  <p className="text-[11px] text-slate-400">28 Jul, 11:45 AM</p>
                </div>

                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#ff8c00] text-white flex items-center justify-center mx-auto shadow-md animate-pulse">
                    <Truck className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-[#ff8c00]">Out for Delivery</p>
                  <p className="text-[11px] text-slate-500 font-semibold">Mohammadpur Delivery Hub</p>
                </div>

                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center mx-auto">
                    <Clock className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-400">Final Delivery</p>
                  <p className="text-[11px] text-slate-400">Pending</p>
                </div>

              </div>
            </div>

            {/* Courier & Delivery Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-medium block">Logistics Partner</span>
                <p className="font-bold text-slate-800">{trackedOrder.courier}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-medium block">Destination Address</span>
                <p className="font-bold text-slate-800">{trackedOrder.shippingAddress}</p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
