import React from "react";
import Link from "next/link";
import { 
  HeroSlider, CategoryGrid, FlashSaleSection, ProductCard 
} from "@/components/HomePageSections";
import productsData from "@/data/products.json";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "ShopiaBD - Online Shopping in Bangladesh | Organic Food, Beauty & Health",
  description: "Shop authentic organic food, beauty products, food supplements and health products at best prices in Bangladesh with nationwide cash on delivery.",
};

import { BestSellingSlider } from "@/components/BestSellingSlider";
import { LatestProductsSlider } from "@/components/LatestProductsSlider";

export default function Home() {
  return (
    <div className="w-full space-y-8 pb-12">
      {/* 1. Hero Banner Slider Section (100% Full Width) */}
      <section className="w-full">
        <HeroSlider />
      </section>

      {/* 2. Best Selling Products Carousel Slider */}
      <section className="w-full">
        <BestSellingSlider products={productsData} />
      </section>

      {/* 3. Latest Products Carousel Slider */}
      <section className="w-full">
        <LatestProductsSlider products={productsData} />
      </section>

      {/* 3. Page Content Wrapped in Max Width Container */}
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        <FlashSaleSection />

        {/* 3. Promotional Coupon Banner */}
        <div className="bg-[#0b3b82] rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-amber-400 text-slate-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Special Offer
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Get Free Nationwide Express Shipping on Orders Over ৳3,000!
            </h2>
            <p className="text-blue-200 text-sm">
              Use Coupon Code <span className="text-amber-300 font-bold underline">FREESHIP2026</span> at checkout.
            </p>
          </div>
          <Link href="/products" className="bg-white text-slate-900 hover:bg-amber-400 font-bold px-8 py-3.5 rounded-full shadow-lg transition shrink-0">
            Shop Now →
          </Link>
        </div>

        {/* 4. Trending & Best Selling Products Grid (Powered by products.json) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Best Selling & Trending Products 🔥
              </h2>
              <p className="text-xs text-slate-500">Handpicked organic & health items for you in Bangladesh</p>
            </div>
            <Link href="/products" className="text-sm font-bold text-[#0b3b82] hover:text-[#b30047] flex items-center gap-1">
              Browse All Products <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {productsData.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
