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
  ShieldCheck,
  Sun,
  Moon,
  Menu,
  X,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { admin, isLoading, logout } = useAdminAuth();
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isMounted, setIsMounted] = useState(false);

  // Product Management & Form States
  const [productsList, setProductsList] = useState<any[]>([
    {
      id: 1,
      name: "Organic Black Maca Powder (300 gm)",
      slug: "organic-black-maca-powder-300-gm",
      price: 1450,
      original_price: 1800,
      stock: 45,
      main_image: "/prod_maca.png",
      description: "Premium grade organic Maca Powder imported directly. Rich in nutrients and energy boosters.",
      category: "Health & Organic"
    },
    {
      id: 2,
      name: "Mustard Oil (সরিষার তেল 1L)",
      slug: "mustard-oil-1l",
      price: 300,
      original_price: 350,
      stock: 120,
      main_image: "/prod_blackseed.png",
      description: "100% pure cold-pressed mustard oil. Traditional aromatic cooking oil.",
      category: "Groceries & Cooking"
    }
  ]);

  // Form input state
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formOriginalPrice, setFormOriginalPrice] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formCategory, setFormCategory] = useState("Health & Organic");
  const [formDescription, setFormDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetForm = () => {
    setEditingProductId(null);
    setFormName("");
    setFormPrice("");
    setFormOriginalPrice("");
    setFormStock("");
    setFormImage("");
    setFormCategory("Health & Organic");
    setFormDescription("");
  };

  const handleEditClick = (product: any) => {
    setEditingProductId(product.id);
    setFormName(product.name);
    setFormPrice(product.price.toString());
    setFormOriginalPrice(product.original_price ? product.original_price.toString() : "");
    setFormStock(product.stock.toString());
    setFormImage(product.main_image || "");
    setFormCategory(product.category || "Health & Organic");
    setFormDescription(product.description || "");
    setActiveMenu("Add Product");
  };

  const handleDeleteClick = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProductsList(productsList.filter(p => p.id !== id));
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) return;

    if (editingProductId) {
      // Update existing
      setProductsList(productsList.map(p => p.id === editingProductId ? {
        ...p,
        name: formName,
        price: parseFloat(formPrice),
        original_price: formOriginalPrice ? parseFloat(formOriginalPrice) : undefined,
        stock: parseInt(formStock) || 0,
        main_image: formImage || "/prod_maca.png",
        category: formCategory,
        description: formDescription
      } : p));
      setSuccessMessage("Product updated successfully!");
    } else {
      // Add new
      const newProd = {
        id: Date.now(),
        name: formName,
        slug: formName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        price: parseFloat(formPrice),
        original_price: formOriginalPrice ? parseFloat(formOriginalPrice) : undefined,
        stock: parseInt(formStock) || 0,
        main_image: formImage || "/prod_maca.png",
        category: formCategory,
        description: formDescription
      };
      setProductsList([newProd, ...productsList]);
      setSuccessMessage("New product created successfully!");
    }

    setTimeout(() => setSuccessMessage(null), 3000);
    resetForm();
    setActiveMenu("All Products");
  };

  // Theme & Navigation States
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("monthly");

  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem("shopia_admin_theme") as "dark" | "light";
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !admin) {
      router.replace("/");
    }
  }, [admin, isLoading, router]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("shopia_admin_theme", nextTheme);
  };

  if (!isMounted || isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center font-bold text-sm ${theme === "dark" ? "bg-[#060911] text-blue-400" : "bg-slate-50 text-[#0b3b82]"}`}>
        Checking Admin Access Credentials...
      </div>
    );
  }

  if (!admin) return null;

  // Datasets for Daily, Weekly, and Monthly Timeframes
  const dailyData = [
    { label: "06:00", revenue: 1200, sales: 8 },
    { label: "09:00", revenue: 3400, sales: 18 },
    { label: "12:00", revenue: 8900, sales: 42 },
    { label: "15:00", revenue: 12500, sales: 65 },
    { label: "18:00", revenue: 15800, sales: 88 },
    { label: "21:00", revenue: 21000, sales: 110 },
    { label: "23:59", revenue: 24500, sales: 135 },
  ];

  const weeklyData = [
    { label: "Mon", revenue: 8500, sales: 45 },
    { label: "Tue", revenue: 12400, sales: 68 },
    { label: "Wed", revenue: 10200, sales: 52 },
    { label: "Thu", revenue: 16800, sales: 94 },
    { label: "Fri", revenue: 24500, sales: 140 },
    { label: "Sat", revenue: 31000, sales: 185 },
    { label: "Sun", revenue: 28900, sales: 160 },
  ];

  const monthlyData = [
    { label: "Jan", revenue: 12000, sales: 120 },
    { label: "Feb", revenue: 19000, sales: 180 },
    { label: "Mar", revenue: 15000, sales: 140 },
    { label: "Apr", revenue: 28000, sales: 270 },
    { label: "May", revenue: 35000, sales: 320 },
    { label: "Jun", revenue: 42000, sales: 410 },
    { label: "Jul", revenue: 63900, sales: 580 },
  ];

  const activeChartData = timeframe === "daily" ? dailyData : timeframe === "weekly" ? weeklyData : monthlyData;

  const recentOrders = [
    { id: "#2", customer: "Abir Ahmed", amount: "৳950", status: "Packed", date: "2026-07-30 06:35" },
    { id: "#1", customer: "Md Mostafizur Rahman", amount: "৳1,450", status: "Processing", date: "2026-07-30 05:20" }
  ];

  const topSellingProducts = [
    { name: "Organic Black Maca Powder (300 gm)", sales: "3 Sales", revenue: "৳4,350.00", image: "/prod_maca.png" },
    { name: "Mustard Oil (সরিষার তেল)", sales: "2 Sales", revenue: "৳600.00", image: "/prod_blackseed.png" }
  ];

  const isDark = theme === "dark";

  return (
    <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-200 ${
      isDark ? "bg-[#060911] text-slate-200" : "bg-slate-100 text-slate-800"
    }`}>
      
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden animate-in fade-in"
        />
      )}

      {/* 1. LEFT SIDEBAR MENU (Responsive Drawer on Mobile) */}
      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50 w-64 flex flex-col justify-between shrink-0 select-none transition-all duration-300
        ${isDark ? "bg-[#090d18] border-r border-slate-800/80" : "bg-white border-r border-slate-200 shadow-xl lg:shadow-none"}
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        
        {/* Sidebar Header Logo */}
        <div className={`p-4 border-b flex items-center justify-between ${isDark ? "border-slate-800/80" : "border-slate-100"}`}>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0b3b82] text-white flex items-center justify-center font-black text-lg shadow-sm">
              S
            </div>
            <span className={`text-lg font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              Shopia Admin <span className="text-blue-500 text-xs font-semibold block -mt-1">Panel</span>
            </span>
          </Link>

          {/* Close Sidebar button on mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className={`p-1.5 rounded-lg lg:hidden ${isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800"}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Scrollable Navigation Links */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6 text-xs">
          
          {/* Main Group */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => { setActiveMenu("Dashboard"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition ${
                activeMenu === "Dashboard" 
                  ? "bg-[#0b3b82] text-white shadow-md" 
                  : isDark ? "text-slate-400 hover:bg-slate-800/60 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>
          </div>

          {/* Product Section */}
          <div className="space-y-1">
            <span className={`px-3 text-[10px] font-bold uppercase tracking-wider block ${isDark ? "text-slate-500" : "text-slate-400"}`}>Product</span>
            <button
              type="button"
              onClick={() => { setActiveMenu("All Products"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                activeMenu === "All Products" 
                  ? "bg-[#0b3b82] text-white font-bold" 
                  : isDark ? "text-slate-400 hover:bg-slate-800/60 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Package className="w-4 h-4" /> All Products
            </button>
            <button
              type="button"
              onClick={() => { setActiveMenu("Add Product"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                activeMenu === "Add Product" 
                  ? "bg-[#0b3b82] text-white font-bold" 
                  : isDark ? "text-slate-400 hover:bg-slate-800/60 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <PlusCircle className="w-4 h-4" /> Add Product
            </button>
          </div>

          {/* Category Section */}
          <div className="space-y-1">
            <span className={`px-3 text-[10px] font-bold uppercase tracking-wider block ${isDark ? "text-slate-500" : "text-slate-400"}`}>Category</span>
            <button
              type="button"
              onClick={() => { setActiveMenu("Main Category"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                isDark ? "text-slate-400 hover:bg-slate-800/60 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <FolderTree className="w-4 h-4" /> Main Category
            </button>
            <button
              type="button"
              onClick={() => { setActiveMenu("Sub Category"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                isDark ? "text-slate-400 hover:bg-slate-800/60 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Tag className="w-4 h-4" /> Sub Category
            </button>
            <button
              type="button"
              onClick={() => { setActiveMenu("Child Category"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                isDark ? "text-slate-400 hover:bg-slate-800/60 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Sliders className="w-4 h-4" /> Child Category
            </button>
          </div>

          {/* Orders Section */}
          <div className="space-y-1">
            <span className={`px-3 text-[10px] font-bold uppercase tracking-wider block ${isDark ? "text-slate-500" : "text-slate-400"}`}>Orders</span>
            <button
              type="button"
              onClick={() => { setActiveMenu("Order List"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                isDark ? "text-slate-400 hover:bg-slate-800/60 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Order List
            </button>
            <button
              type="button"
              onClick={() => { setActiveMenu("Payment Status"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                isDark ? "text-slate-400 hover:bg-slate-800/60 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Receipt className="w-4 h-4" /> Payment Status
            </button>
          </div>

          {/* Customers & Engagement */}
          <div className="space-y-1">
            <span className={`px-3 text-[10px] font-bold uppercase tracking-wider block ${isDark ? "text-slate-500" : "text-slate-400"}`}>Users &amp; Engagement</span>
            <button
              type="button"
              onClick={() => { setActiveMenu("Customers"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                isDark ? "text-slate-400 hover:bg-slate-800/60 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Users className="w-4 h-4" /> Customers
            </button>
            <button
              type="button"
              onClick={() => { setActiveMenu("Reviews"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                isDark ? "text-slate-400 hover:bg-slate-800/60 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Star className="w-4 h-4" /> Reviews
            </button>
          </div>

          {/* System Settings */}
          <div className="space-y-1">
            <span className={`px-3 text-[10px] font-bold uppercase tracking-wider block ${isDark ? "text-slate-500" : "text-slate-400"}`}>Settings</span>
            <button
              type="button"
              onClick={() => { setActiveMenu("Settings"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                isDark ? "text-slate-400 hover:bg-slate-800/60 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Settings className="w-4 h-4" /> General Settings
            </button>
          </div>

        </div>

        {/* Sidebar Footer User Info */}
        <div className={`p-3 border-t flex items-center justify-between ${
          isDark ? "border-slate-800/80 bg-[#060911]" : "border-slate-100 bg-slate-50"
        }`}>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#0b3b82] text-white font-bold text-xs flex items-center justify-center shrink-0">
              {admin.name.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <p className={`text-xs font-bold truncate ${isDark ? "text-white" : "text-slate-900"}`}>{admin.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{admin.role}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className={`p-1.5 rounded-lg transition ${
              isDark ? "text-slate-400 hover:text-rose-400 hover:bg-slate-800/80" : "text-slate-500 hover:text-rose-600 hover:bg-slate-200"
            }`}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Navigation Bar */}
        <header className={`h-16 border-b px-4 lg:px-6 flex items-center justify-between gap-4 shrink-0 transition-colors ${
          isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200"
        }`}>
          
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={`p-2 rounded-xl border lg:hidden ${
                isDark ? "border-slate-800 text-slate-300 hover:text-white" : "border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Input Bar */}
            <div className="relative w-44 sm:w-64 md:w-80">
              <input
                type="text"
                placeholder="Search anything..."
                className={`w-full border rounded-full pl-9 pr-4 py-1.5 sm:py-2 text-xs transition focus:outline-none ${
                  isDark 
                    ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-[#0b3b82] placeholder:text-slate-500" 
                    : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0b3b82] placeholder:text-slate-400"
                }`}
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-bold">
            
            {/* Light / Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition flex items-center gap-1.5 ${
                isDark 
                  ? "border-slate-800 text-amber-400 hover:bg-slate-800/60" 
                  : "border-slate-200 text-[#0b3b82] bg-slate-50 hover:bg-slate-100"
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="hidden md:inline">{isDark ? "Light" : "Dark"}</span>
            </button>

            {/* View Live Storefront Link */}
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="bg-[#0b3b82]/10 hover:bg-[#0b3b82]/20 border border-[#0b3b82]/30 text-[#0b3b82] dark:text-blue-300 px-3 py-1.5 rounded-full transition flex items-center gap-1.5 shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" /> <span className="hidden sm:inline">View Storefront</span>
            </a>

            <button type="button" className={`relative p-2 rounded-xl border ${
              isDark ? "border-slate-800 text-slate-400 hover:text-white" : "border-slate-200 text-slate-500 hover:text-slate-900"
            }`}>
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#0b3b82] absolute top-1.5 right-1.5" />
            </button>

            <div className={`hidden sm:flex items-center gap-2 border-l pl-3 sm:pl-4 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
              <div className="w-7 h-7 rounded-full bg-[#0b3b82] text-white font-black text-xs flex items-center justify-center">
                {admin.name.charAt(0).toUpperCase()}
              </div>
              <span className={isDark ? "text-white" : "text-slate-900"}>{admin.name}</span>
            </div>

          </div>

        </header>

        {/* Scrollable Dashboard Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Global Alert Notification */}
          {successMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-500 px-4 py-3 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span className="font-bold">{successMessage}</span>
            </div>
          )}

          {/* VIEW 1: DASHBOARD ANALYTICS OVERVIEW */}
          {activeMenu === "Dashboard" && (
            <>
              {/* Dashboard Title Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className={`text-2xl font-extrabold tracking-wide ${isDark ? "text-white" : "text-slate-900"}`}>
                    E-commerce Dashboard
                  </h1>
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Welcome back <span className="text-[#0b3b82] font-bold dark:text-blue-400">{admin.name}</span>! Here is a live summary of your store&apos;s performance.
                  </p>
                </div>

                <div className={`border rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-2 ${
                  isDark 
                    ? "bg-[#090d18] border-slate-800 text-emerald-400" 
                    : "bg-white border-slate-200 text-emerald-600 shadow-sm"
                }`}>
                  <Activity className="w-4 h-4 text-emerald-500" /> Live Tracking Active
                </div>
              </div>

              {/* 4 Stat Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Stat 1: Total Revenue */}
                <div className={`border rounded-2xl p-5 space-y-2 transition-colors ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span>TOTAL REVENUE</span>
                    <span className="p-1.5 rounded-lg bg-[#0b3b82]/10 text-[#0b3b82]">
                      <DollarSign className="w-4 h-4" />
                    </span>
                  </div>
                  <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>৳63,900</h3>
                  <p className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +15.8% vs last month
                  </p>
                </div>

                {/* Stat 2: Total Sales */}
                <div className={`border rounded-2xl p-5 space-y-2 transition-colors ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span>TOTAL SALES</span>
                    <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                      <ShoppingBag className="w-4 h-4" />
                    </span>
                  </div>
                  <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>580</h3>
                  <p className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +8.4% vs last week
                  </p>
                </div>

                {/* Stat 3: Total Customers */}
                <div className={`border rounded-2xl p-5 space-y-2 transition-colors ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span>CUSTOMERS</span>
                    <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                      <Users className="w-4 h-4" />
                    </span>
                  </div>
                  <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>240</h3>
                  <p className="text-[11px] text-blue-500 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +12 new today
                  </p>
                </div>

                {/* Stat 4: Active Products */}
                <div className={`border rounded-2xl p-5 space-y-2 transition-colors ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span>ACTIVE PRODUCTS</span>
                    <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                      <Package className="w-4 h-4" />
                    </span>
                  </div>
                  <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>{productsList.length}</h3>
                  <p className="text-[11px] text-amber-500 font-semibold flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" /> In stock & live
                  </p>
                </div>

              </div>

              {/* 3-COLUMN ANALYTICS DASHBOARD (Revenue Overview, Sales Analysis, Orders Trend) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Column 1: Revenue & Sales Overview (Area Chart) */}
                <div className={`border rounded-2xl p-5 space-y-4 transition-colors ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                        Revenue Overview
                      </h2>
                      <p className="text-[11px] text-slate-400">Gross revenue performance</p>
                    </div>
                    <span className="p-1.5 rounded-lg bg-[#0b3b82]/10 text-[#0b3b82] dark:text-blue-400 font-bold text-xs">
                      ৳ Revenue
                    </span>
                  </div>

                  <div className="h-56 w-full pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activeChartData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0b3b82" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#0b3b82" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="label" stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={11} tickLine={false} />
                        <YAxis stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={11} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDark ? "#0d1322" : "#ffffff", 
                            borderColor: isDark ? "#1e293b" : "#e2e8f0",
                            borderRadius: "12px",
                            fontSize: "11px",
                            color: isDark ? "#ffffff" : "#0f172a"
                          }} 
                          formatter={(val: any) => [`৳${Number(val).toLocaleString()}`, "Revenue"]}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#0b3b82" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Column 2: Sales Analysis (Bar Chart) */}
                <div className={`border rounded-2xl p-5 space-y-4 transition-colors ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                        Sales Analysis
                      </h2>
                      <p className="text-[11px] text-slate-400">Total units sold breakdown</p>
                    </div>
                    <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 font-bold text-xs">
                      Sales Count
                    </span>
                  </div>

                  <div className="h-56 w-full pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activeChartData}>
                        <XAxis dataKey="label" stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={11} tickLine={false} />
                        <YAxis stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={11} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDark ? "#0d1322" : "#ffffff", 
                            borderColor: isDark ? "#1e293b" : "#e2e8f0",
                            borderRadius: "12px",
                            fontSize: "11px",
                            color: isDark ? "#ffffff" : "#0f172a"
                          }} 
                          formatter={(val: any) => [val, "Completed Sales"]}
                        />
                        <Bar dataKey="sales" fill="#10b981" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Column 3: Orders Trend (Line Chart) */}
                <div className={`border rounded-2xl p-5 space-y-4 transition-colors ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                        Orders Trend
                      </h2>
                      <p className="text-[11px] text-slate-400">Order trajectory &amp; momentum</p>
                    </div>
                    <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 font-bold text-xs">
                      Trend Line
                    </span>
                  </div>

                  <div className="h-56 w-full pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={activeChartData}>
                        <XAxis dataKey="label" stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={11} tickLine={false} />
                        <YAxis stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={11} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDark ? "#0d1322" : "#ffffff", 
                            borderColor: isDark ? "#1e293b" : "#e2e8f0",
                            borderRadius: "12px",
                            fontSize: "11px",
                            color: isDark ? "#ffffff" : "#0f172a"
                          }} 
                          formatter={(val: any) => [val, "Orders Placed"]}
                        />
                        <Line type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: "#f59e0b" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Bottom Grid: Recent Orders & Top Products */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Table 1: Recent Orders */}
                <div className={`border rounded-2xl p-5 space-y-4 transition-colors ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between">
                    <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Recent Orders</h2>
                    <button type="button" className="text-xs text-[#0b3b82] dark:text-blue-400 font-bold hover:underline">
                      View All
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className={`border-b ${isDark ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500"}`}>
                          <th className="pb-3 font-semibold">Order ID</th>
                          <th className="pb-3 font-semibold">Customer</th>
                          <th className="pb-3 font-semibold">Amount</th>
                          <th className="pb-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isDark ? "divide-slate-800/60" : "divide-slate-100"}`}>
                        {recentOrders.map((order) => (
                          <tr key={order.id} className={isDark ? "hover:bg-slate-800/30" : "hover:bg-slate-50"}>
                            <td className="py-3 font-mono font-bold text-[#0b3b82] dark:text-blue-400">{order.id}</td>
                            <td className={`py-3 font-medium ${isDark ? "text-slate-200" : "text-slate-800"}`}>{order.customer}</td>
                            <td className={`py-3 font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{order.amount}</td>
                            <td className="py-3">
                              <span className="px-2.5 py-1 bg-[#0b3b82]/10 border border-[#0b3b82]/30 text-[#0b3b82] dark:text-blue-300 font-semibold rounded-full text-[10px]">
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table 2: Top Selling Products */}
                <div className={`border rounded-2xl p-5 space-y-4 transition-colors ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between">
                    <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Top Selling Products</h2>
                    <button type="button" className="text-xs text-[#0b3b82] dark:text-blue-400 font-bold hover:underline">
                      View Catalog
                    </button>
                  </div>

                  <div className="space-y-3">
                    {topSellingProducts.map((prod, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-center justify-between p-3 rounded-xl border transition ${
                          isDark ? "bg-[#060911] border-slate-800/80" : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-slate-800 shrink-0 overflow-hidden relative">
                            <Image 
                              src={prod.image} 
                              alt={prod.name} 
                              width={40} 
                              height={40} 
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                          <div className="truncate">
                            <p className={`text-xs font-bold truncate ${isDark ? "text-slate-200" : "text-slate-800"}`}>{prod.name}</p>
                            <p className="text-[10px] text-slate-400">{prod.sales}</p>
                          </div>
                        </div>

                        <span className={`text-xs font-bold shrink-0 ${isDark ? "text-white" : "text-slate-900"}`}>
                          {prod.revenue}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </>
          )}

          {/* VIEW 2: ALL PRODUCTS LIST */}
          {activeMenu === "All Products" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className={`text-2xl font-extrabold tracking-wide ${isDark ? "text-white" : "text-slate-900"}`}>
                    All Products Catalog
                  </h1>
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Manage, edit, and organize all active inventory items in your store
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => { resetForm(); setActiveMenu("Add Product"); }}
                  className="bg-[#0b3b82] hover:bg-[#0b3b82]/90 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> Add New Product
                </button>
              </div>

              {/* Products Data Table */}
              <div className={`border rounded-2xl overflow-hidden transition-colors ${
                isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
              }`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className={`border-b ${isDark ? "border-slate-800 text-slate-400 bg-[#080c14]" : "border-slate-200 text-slate-500 bg-slate-50"}`}>
                        <th className="py-3.5 px-4 font-bold">Product</th>
                        <th className="py-3.5 px-4 font-bold">Category</th>
                        <th className="py-3.5 px-4 font-bold">Price</th>
                        <th className="py-3.5 px-4 font-bold">Stock</th>
                        <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? "divide-slate-800/60" : "divide-slate-100"}`}>
                      {productsList.map((prod) => (
                        <tr key={prod.id} className={isDark ? "hover:bg-slate-800/30 transition" : "hover:bg-slate-50 transition"}>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-slate-800 shrink-0 overflow-hidden relative border border-slate-700">
                                <Image 
                                  src={prod.main_image || "/prod_maca.png"} 
                                  alt={prod.name} 
                                  width={40} 
                                  height={40} 
                                  className="object-cover w-full h-full"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              </div>
                              <div>
                                <p className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{prod.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{prod.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 bg-slate-800/50 border border-slate-700 text-slate-300 font-semibold rounded-md text-[10px]">
                              {prod.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className={`font-black ${isDark ? "text-white" : "text-slate-900"}`}>৳{prod.price}</span>
                              {prod.original_price && (
                                <span className="text-[10px] text-slate-400 line-through">৳{prod.original_price}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 font-bold rounded-full text-[10px] ${
                              prod.stock > 10 
                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30" 
                                : "bg-rose-500/10 text-rose-500 border border-rose-500/30"
                            }`}>
                              {prod.stock} In Stock
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditClick(prod)}
                                className={`p-2 rounded-lg transition border ${
                                  isDark ? "border-slate-800 text-blue-400 hover:bg-blue-500/10" : "border-slate-200 text-[#0b3b82] hover:bg-slate-100"
                                }`}
                                title="Edit Product"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteClick(prod.id)}
                                className="p-2 rounded-lg transition border border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: ADD & EDIT PRODUCT WITH LIVE PREVIEW */}
          {activeMenu === "Add Product" && (
            <div className="space-y-6">
              <div>
                <h1 className={`text-2xl font-extrabold tracking-wide ${isDark ? "text-white" : "text-slate-900"}`}>
                  {editingProductId ? "Edit Existing Product" : "Add New E-commerce Product"}
                </h1>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Fill in product details and inspect the live customer card preview before saving
                </p>
              </div>

              {/* 2-Column Split: Form on Left, Live Card Preview on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* Left Side: Product Form (Col-2) */}
                <form onSubmit={handleSaveProduct} className={`lg:col-span-2 border rounded-2xl p-6 space-y-4 transition-colors ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <h2 className={`text-base font-bold pb-2 border-b ${isDark ? "text-white border-slate-800" : "text-slate-900 border-slate-100"}`}>
                    Product Specifications
                  </h2>

                  <div className="space-y-1.5 text-xs">
                    <label className={`font-bold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Organic Black Maca Powder (300 gm)"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none transition ${
                        isDark ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-[#0b3b82]" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0b3b82]"
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className={`font-bold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>Regular Price (৳) *</label>
                      <input
                        type="number"
                        required
                        placeholder="1450"
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none transition ${
                          isDark ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-[#0b3b82]" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0b3b82]"
                        }`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={`font-bold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>Original / Discount Price (৳)</label>
                      <input
                        type="number"
                        placeholder="1800"
                        value={formOriginalPrice}
                        onChange={(e) => setFormOriginalPrice(e.target.value)}
                        className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none transition ${
                          isDark ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-[#0b3b82]" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0b3b82]"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className={`font-bold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>Stock Quantity *</label>
                      <input
                        type="number"
                        required
                        placeholder="45"
                        value={formStock}
                        onChange={(e) => setFormStock(e.target.value)}
                        className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none transition ${
                          isDark ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-[#0b3b82]" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0b3b82]"
                        }`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={`font-bold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>Product Category</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none transition ${
                          isDark ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-[#0b3b82]" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0b3b82]"
                        }`}
                      >
                        <option value="Health & Organic">Health &amp; Organic</option>
                        <option value="Groceries & Cooking">Groceries &amp; Cooking</option>
                        <option value="Natural Honey">Natural Honey</option>
                        <option value="Dry Fruits & Nuts">Dry Fruits &amp; Nuts</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className={`font-bold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>Main Image URL</label>
                    <input
                      type="text"
                      placeholder="e.g. /prod_maca.png"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none transition ${
                        isDark ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-[#0b3b82]" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0b3b82]"
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className={`font-bold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>Description</label>
                    <textarea
                      rows={3}
                      placeholder="Enter detailed product description..."
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none transition ${
                        isDark ? "bg-[#060911] border-slate-800 text-slate-200 focus:border-[#0b3b82]" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0b3b82]"
                      }`}
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => { resetForm(); setActiveMenu("All Products"); }}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs transition border ${
                        isDark ? "border-slate-800 text-slate-400 hover:text-white" : "border-slate-200 text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#0b3b82] hover:bg-[#0b3b82]/90 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      {editingProductId ? "Update Product" : "Save & Publish Product"}
                    </button>
                  </div>
                </form>

                {/* Right Side: Real-time Product Card Live Preview (Col-1) */}
                <div className={`border rounded-2xl p-5 space-y-4 transition-colors sticky top-4 ${
                  isDark ? "bg-[#090d18] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/40">
                    <span className="text-xs font-extrabold text-[#0b3b82] dark:text-blue-400 uppercase tracking-wider">
                      Live Customer Preview
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-[10px]">
                      Live
                    </span>
                  </div>

                  {/* Customer Storefront Product Card Mock */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-[#080c14] space-y-3 shadow-md">
                    <div className="w-full h-44 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative border border-slate-200 dark:border-slate-700/60 flex items-center justify-center">
                      {formImage ? (
                        <Image
                          src={formImage}
                          alt="Product Preview"
                          width={180}
                          height={180}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <Package className="w-12 h-12 text-slate-400" />
                      )}
                      
                      {formOriginalPrice && parseFloat(formOriginalPrice) > parseFloat(formPrice || "0") && (
                        <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                          Sale
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#0b3b82] dark:text-blue-400 uppercase tracking-wider block">
                        {formCategory}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white line-clamp-1">
                        {formName || "Sample Product Title"}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {formDescription || "Detailed product description preview will appear here..."}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-base font-black text-slate-900 dark:text-white block">
                          ৳{formPrice || "0"}
                        </span>
                        {formOriginalPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            ৳{formOriginalPrice}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        disabled
                        className="bg-[#0b3b82] text-white px-3.5 py-1.5 rounded-xl font-bold text-xs opacity-90 cursor-not-allowed"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
