"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  FolderTree, 
  Tag, 
  Sliders, 
  ShoppingBag, 
  Receipt, 
  UserCheck, 
  Users, 
  Star, 
  HelpCircle, 
  MapPin, 
  MessageSquare, 
  Headphones, 
  Wallet, 
  CreditCard, 
  FileText, 
  Info, 
  PhoneCall, 
  SlidersHorizontal, 
  UserCog, 
  Settings, 
  Search, 
  LogOut, 
  Bell, 
  ChevronDown, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  Activity, 
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { admin, isLoading, logout } = useAdminAuth();
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !admin) {
      router.replace("/login");
    }
  }, [admin, isLoading, router]);

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen bg-[#060911] flex items-center justify-center text-emerald-400 font-bold text-sm">
        Checking Admin Access Credentials...
      </div>
    );
  }

  if (!admin) return null;

  // Chart Data Matching Reference Screenshot
  const revenueData = [
    { month: "Jan", Revenue: 0, Expenses: 0 },
    { month: "Feb", Revenue: 0, Expenses: 0 },
    { month: "Mar", Revenue: 0, Expenses: 0 },
    { month: "Apr", Revenue: 0, Expenses: 0 },
    { month: "May", Revenue: 0, Expenses: 0 },
    { month: "Jun", Revenue: 0, Expenses: 0 },
    { month: "Jul", Revenue: 0, Expenses: 0 },
    { month: "Aug", Revenue: 0, Expenses: 0 },
    { month: "Sep", Revenue: 5000, Expenses: 2000 },
    { month: "Oct", Revenue: 20000, Expenses: 8000 },
    { month: "Nov", Revenue: 45000, Expenses: 18000 },
    { month: "Dec", Revenue: 63900, Expenses: 24000 }
  ];

  const salesAnalyticsData = [
    { day: "Mon", sales: 0 },
    { day: "Tue", sales: 0 },
    { day: "Wed", sales: 0 },
    { day: "Thu", sales: 2 },
    { day: "Fri", sales: 0 },
    { day: "Sat", sales: 0 },
    { day: "Sun", sales: 0 }
  ];

  const ordersTrendData = [
    { label: "Jun 23", orders: 0 },
    { label: "Jul 01", orders: 0 },
    { label: "Jul 07", orders: 0 },
    { label: "Jul 15", orders: 0 },
    { label: "Jul 22", orders: 1 },
    { label: "Jul 30", orders: 4 }
  ];

  const recentOrders = [
    { id: "#2", customer: "Abir Ahmed", amount: "৳950", status: "Packed", date: "2026-07-30 06:35" },
    { id: "#1", customer: "Md Mostafizur Rahman", amount: "৳1,450", status: "Processing", date: "2026-07-30 05:20" }
  ];

  const topSellingProducts = [
    { name: "Organic Black Maca Powder (300 gm)", sales: "3 Sales", revenue: "৳4,350.00", image: "/prod_maca.png" },
    { name: "Mustard Oil (সরিষার তেল)", sales: "2 Sales", revenue: "৳600.00", image: "/prod_blackseed.png" }
  ];

  return (
    <div className="flex h-screen bg-[#060911] text-slate-200 font-sans overflow-hidden">
      
      {/* 1. LEFT SIDEBAR MENU (Dark Blueish Navy) */}
      <aside className="w-64 bg-[#090d18] border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none">
        
        {/* Sidebar Header Logo */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0b3b82] text-white flex items-center justify-center font-black text-lg shadow-sm">
              S
            </div>
            <span className="text-lg font-black tracking-tight text-white">
              Shopia Admin <span className="text-blue-400 text-xs font-semibold block -mt-1">Panel</span>
            </span>
          </Link>
        </div>

        {/* Sidebar Scrollable Navigation Links */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6 text-xs">
          
          {/* Main Group */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setActiveMenu("Dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition ${
                activeMenu === "Dashboard" ? "bg-[#0b3b82] text-white shadow-md" : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>
          </div>

          {/* Product Section */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Product</span>
            <button
              type="button"
              onClick={() => setActiveMenu("All Products")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800/60 hover:text-white transition"
            >
              <Package className="w-4 h-4" /> All Products
            </button>
            <button
              type="button"
              onClick={() => setActiveMenu("Add Product")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800/60 hover:text-white transition"
            >
              <PlusCircle className="w-4 h-4" /> Add Product
            </button>
          </div>

          {/* Category Section */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Category</span>
            <button
              type="button"
              onClick={() => setActiveMenu("Main Category")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800/60 hover:text-white transition"
            >
              <FolderTree className="w-4 h-4" /> Main Category
            </button>
            <button
              type="button"
              onClick={() => setActiveMenu("Sub Category")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800/60 hover:text-white transition"
            >
              <Tag className="w-4 h-4" /> Sub Category
            </button>
            <button
              type="button"
              onClick={() => setActiveMenu("Child Category")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800/60 hover:text-white transition"
            >
              <Sliders className="w-4 h-4" /> Child Category
            </button>
          </div>

          {/* Orders Section */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Orders</span>
            <button
              type="button"
              onClick={() => setActiveMenu("Order List")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800/60 hover:text-white transition"
            >
              <ShoppingBag className="w-4 h-4" /> Order List
            </button>
            <button
              type="button"
              onClick={() => setActiveMenu("Payment Status")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800/60 hover:text-white transition"
            >
              <Receipt className="w-4 h-4" /> Payment Status
            </button>
          </div>

          {/* Customers & Communication */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Users &amp; Engagement</span>
            <button
              type="button"
              onClick={() => setActiveMenu("Customers")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800/60 hover:text-white transition"
            >
              <Users className="w-4 h-4" /> Customers
            </button>
            <button
              type="button"
              onClick={() => setActiveMenu("Reviews")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800/60 hover:text-white transition"
            >
              <Star className="w-4 h-4" /> Reviews
            </button>
            <button
              type="button"
              onClick={() => setActiveMenu("Live Chat")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800/60 hover:text-white transition"
            >
              <Headphones className="w-4 h-4" /> Live Chat
            </button>
          </div>

          {/* System Settings */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Settings</span>
            <button
              type="button"
              onClick={() => setActiveMenu("Settings")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800/60 hover:text-white transition"
            >
              <Settings className="w-4 h-4" /> General Settings
            </button>
          </div>

        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-3 border-t border-slate-800/80 bg-[#060911] flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#0b3b82] text-white font-bold text-xs flex items-center justify-center border border-[#0b3b82]">
              {admin.name.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{admin.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{admin.role}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Navigation Bar */}
        <header className="h-16 bg-[#090d18] border-b border-slate-800/80 px-6 flex items-center justify-between gap-4 shrink-0">
          
          {/* Search Input Bar */}
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full bg-[#060911] border border-slate-800 rounded-full pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#0b3b82] placeholder:text-slate-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-4 text-xs font-bold">
            
            {/* View Live Website Link */}
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="bg-[#0b3b82]/20 hover:bg-[#0b3b82]/30 border border-[#0b3b82]/50 text-blue-300 px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Storefront
            </a>

            <button type="button" className="text-slate-400 hover:text-white relative p-1.5 rounded-lg border border-slate-800">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#0b3b82] absolute top-1 right-1" />
            </button>

            <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
              <div className="w-7 h-7 rounded-full bg-[#0b3b82] text-white font-black text-xs flex items-center justify-center">
                {admin.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-white hidden sm:inline">{admin.name}</span>
            </div>

          </div>

        </header>

        {/* Scrollable Dashboard Workspace */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Dashboard Title Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-wide">
                E-commerce Dashboard
              </h1>
              <p className="text-xs text-slate-400">
                Welcome back <span className="text-emerald-400 font-bold">{admin.name}</span>! Here is a live summary of your store&apos;s performance.
              </p>
            </div>

            <div className="bg-[#090d18] border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-emerald-400 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" /> Live Tracking Active
            </div>
          </div>

          {/* 4 Stat Cards Row Matching Screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Stat 1: Total Revenue */}
            <div className="bg-[#090d18] border border-slate-800/80 rounded-2xl p-5 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>TOTAL REVENUE</span>
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
              <h3 className="text-2xl font-black text-white">৳63,900</h3>
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +15.8% vs last month
              </p>
            </div>

            {/* Stat 2: Total Sales */}
            <div className="bg-[#090d18] border border-slate-800/80 rounded-2xl p-5 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>TOTAL SALES</span>
                <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                  <ShoppingBag className="w-4 h-4" />
                </span>
              </div>
              <h3 className="text-2xl font-black text-white">2</h3>
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +100% vs previous month
              </p>
            </div>

            {/* Stat 3: Total Products */}
            <div className="bg-[#090d18] border border-slate-800/80 rounded-2xl p-5 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>TOTAL PRODUCTS</span>
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <Package className="w-4 h-4" />
                </span>
              </div>
              <h3 className="text-2xl font-black text-white">38</h3>
              <p className="text-[11px] text-slate-400 font-semibold">
                Active inventory items
              </p>
            </div>

            {/* Stat 4: Total Customers */}
            <div className="bg-[#090d18] border border-slate-800/80 rounded-2xl p-5 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>TOTAL CUSTOMERS</span>
                <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <h3 className="text-2xl font-black text-white">4</h3>
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +66.7% new registered users
              </p>
            </div>

          </div>

          {/* Charts Row: Revenue Overview + Sales Analytics + Orders Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Chart 1: Revenue Overview (Col 6) */}
            <div className="lg:col-span-6 bg-[#090d18] border border-slate-800/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                <div>
                  <h3 className="font-extrabold text-white text-sm">Revenue Overview</h3>
                  <p className="text-[11px] text-slate-500">Monthly income vs expenditure time</p>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-bold">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Revenue
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> Expenses
                  </span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#475569" fontSize={11} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#060911", borderColor: "#1e293b", borderRadius: "12px", fontSize: "12px" }} />
                    <Area type="monotone" dataKey="Revenue" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" dataKey="Expenses" stroke="#64748b" strokeWidth={1.5} fillOpacity={0} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Sales Analytics (Col 3) */}
            <div className="lg:col-span-3 bg-[#090d18] border border-slate-800/80 rounded-2xl p-5 space-y-4">
              <div className="border-b border-slate-800/60 pb-3">
                <h3 className="font-extrabold text-white text-sm">Sales Analytics</h3>
                <p className="text-[11px] text-slate-500">Weekly sales volume per day</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesAnalyticsData}>
                    <XAxis dataKey="day" stroke="#475569" fontSize={11} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#060911", borderColor: "#1e293b", borderRadius: "12px", fontSize: "12px" }} />
                    <Bar dataKey="sales" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Orders Trend (Col 3) */}
            <div className="lg:col-span-3 bg-[#090d18] border border-slate-800/80 rounded-2xl p-5 space-y-4">
              <div className="border-b border-slate-800/60 pb-3">
                <h3 className="font-extrabold text-white text-sm">Orders Trend</h3>
                <p className="text-[11px] text-slate-500">Transaction counts progression</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ordersTrendData}>
                    <defs>
                      <linearGradient id="colorOrd" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="label" stroke="#475569" fontSize={11} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#060911", borderColor: "#1e293b", borderRadius: "12px", fontSize: "12px" }} />
                    <Area type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOrd)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Tables Row: Recent Orders (Col 8) + Top Selling Products (Col 4) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Recent Orders Table (Col 8) */}
            <div className="lg:col-span-8 bg-[#090d18] border border-slate-800/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                <div>
                  <h3 className="font-extrabold text-white text-sm">Recent Orders</h3>
                  <p className="text-[11px] text-slate-500">Latest transactions overview</p>
                </div>
                <span className="text-[11px] text-slate-400 font-bold bg-[#060911] px-3 py-1 rounded-full border border-slate-800">
                  Files 1-2
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800/80">
                      <th className="pb-3 font-bold">Order ID</th>
                      <th className="pb-3 font-bold">Customer</th>
                      <th className="pb-3 font-bold">Amount</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {recentOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 font-black text-emerald-400">{ord.id}</td>
                        <td className="py-3 font-semibold text-slate-200">{ord.customer}</td>
                        <td className="py-3 font-bold text-white">{ord.amount}</td>
                        <td className="py-3">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            ord.status === "Packed" 
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/30" 
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 text-right text-slate-500 font-mono text-[11px]">{ord.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Selling Products List (Col 4) */}
            <div className="lg:col-span-4 bg-[#090d18] border border-slate-800/80 rounded-2xl p-5 space-y-4">
              <div className="border-b border-slate-800/60 pb-3">
                <h3 className="font-extrabold text-white text-sm">Top Selling Products</h3>
                <p className="text-[11px] text-slate-500">Products generating highest revenue</p>
              </div>

              <div className="space-y-3">
                {topSellingProducts.map((prod, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#060911] border border-slate-800/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 p-1 relative overflow-hidden shrink-0">
                        <Image src={prod.image} alt={prod.name} fill className="object-contain" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-200 truncate max-w-[150px]">{prod.name}</h4>
                        <p className="text-[10px] text-slate-500">{prod.sales}</p>
                      </div>
                    </div>

                    <span className="font-black text-emerald-400 text-xs shrink-0">{prod.revenue}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </main>

      </div>
    </div>
  );
}
