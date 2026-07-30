"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import productsData from "@/data/products.json";
import { BestSellingSlider } from "@/components/BestSellingSlider";
import { useShop } from "@/context/ShopContext";
import { 
  Heart, 
  Share2, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Star, 
  Minus, 
  Plus, 
  Check, 
  ShoppingCart, 
  PhoneCall, 
  Eye
} from "lucide-react";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, addToWishlist, setQuickViewProduct } = useShop();

  const slugParam = params?.slug as string;

  // Find matching product by slug or id
  const product = productsData.find(
    (p) => p.slug === slugParam || p.id === slugParam
  ) || productsData[0]; // Fallback to first item if not found

  // Related Products (excluding current product)
  const relatedProducts = productsData
    .filter((p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "additional" | "reviews">("description");

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/cart");
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-20">
      
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200/80 py-3.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-[#0b3b82] transition">Home</Link>
          <span>/</span>
          <span className="text-slate-400">{product.category}</span>
          <span>/</span>
          <span className="text-slate-800 font-semibold truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8 space-y-10">
        
        {/* Main 3-Column Layout: (Product Showcase + Purchase Info [Col 9]) & (Related Products [Col 3]) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Product Box (Col 9) */}
          <div className="lg:col-span-9 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left Image Showcase (Col 5) */}
            <div className="md:col-span-5 space-y-4">
              <div className="relative w-full h-[350px] sm:h-[400px] bg-slate-50 rounded-2xl border border-slate-200/80 p-6 flex items-center justify-center overflow-hidden">
                {discountPercent > 0 && (
                  <div className="absolute top-4 left-4 z-10 bg-rose-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                    -{discountPercent}%
                  </div>
                )}
                <Image
                  src={product.mainImage}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain hover:scale-105 transition duration-500"
                />
              </div>
            </div>

            {/* Right Product Purchase Details (Col 7) */}
            <div className="md:col-span-7 space-y-5">
              
              {/* Category & Title */}
              <div className="space-y-1.5 border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-[#0b3b82] uppercase tracking-wider">
                    {product.category}
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 text-[11px]">
                    <Check className="w-3 h-3" /> In Stock
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-slate-700">{product.rating || 4.9}</span>
                  <span className="text-slate-400">({product.reviewsCount || 24} reviews)</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <div className="text-2xl sm:text-3xl font-black text-[#0b3b82]">
                  ৳ {product.price.toLocaleString()}
                </div>
                {product.originalPrice && (
                  <div className="text-base text-slate-400 line-through font-semibold">
                    ৳ {product.originalPrice.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Quick Overview */}
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Authentic {product.name} imported and verified for purity. Guaranteed quality, long shelf life, and non-contact delivery across Bangladesh.
              </p>

              {/* Quantity & CTA Buttons */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-3 flex-wrap">
                  
                  {/* Quantity */}
                  <div className="inline-flex items-center border border-slate-200 rounded-full bg-slate-50 px-2.5 py-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 text-slate-600 hover:text-slate-900 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-slate-800 text-xs">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 text-slate-600 hover:text-slate-900 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#ff8c00] hover:bg-[#e07b00] text-white font-bold text-xs py-2.5 px-4 rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>

                  {/* Buy Now */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex-1 bg-[#0b3b82] hover:bg-[#072450] text-white font-bold text-xs py-2.5 px-4 rounded-full shadow-sm hover:shadow transition-all"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Wishlist & Share */}
                <div className="flex items-center gap-4 pt-1 text-xs text-slate-500">
                  <button
                    type="button"
                    onClick={() => addToWishlist(product)}
                    className="flex items-center gap-1 hover:text-rose-600 transition font-medium"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-500" /> Add to Wishlist
                  </button>
                  <span>|</span>
                  <div className="flex items-center gap-1 hover:text-[#0b3b82] transition cursor-pointer font-medium">
                    <Share2 className="w-3.5 h-3.5 text-[#0b3b82]" /> Share Product
                  </div>
                </div>
              </div>

              {/* Phone Order Box */}
              <div className="bg-[#0b3b82]/5 border border-[#0b3b82]/20 rounded-xl p-3.5 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-800">Order by Phone Hotline</p>
                  <p className="text-[11px] text-slate-500">Call anytime for support</p>
                </div>
                <a 
                  href="tel:01681135030"
                  className="bg-[#0b3b82] text-white font-bold text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1 shadow-xs hover:bg-[#082a5e] transition shrink-0"
                >
                  <PhoneCall className="w-3 h-3" /> 01681-135030
                </a>
              </div>

            </div>
          </div>

          {/* Right Column Sidebar: Related Products (Col 3) */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5">
              Related Products
            </h2>

            <div className="space-y-4">
              {relatedProducts.map((rel) => (
                <div 
                  key={rel.id} 
                  className="border border-slate-100 rounded-xl p-3 hover:shadow-md transition bg-white space-y-2 group"
                >
                  {/* Thumbnail Image */}
                  <Link href={`/product/${rel.slug || rel.id}`} className="block relative w-full h-32 bg-slate-50 rounded-lg overflow-hidden p-2">
                    <Image 
                      src={rel.mainImage}
                      alt={rel.name}
                      fill
                      sizes="200px"
                      className="object-contain group-hover:scale-105 transition"
                    />
                  </Link>

                  {/* Title & Price */}
                  <div>
                    <Link href={`/product/${rel.slug || rel.id}`}>
                      <h3 className="font-semibold text-slate-800 text-xs line-clamp-2 hover:text-[#0b3b82] transition leading-snug">
                        {rel.name}
                      </h3>
                    </Link>

                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-[#ff8c00] font-bold text-xs">
                        ৳{rel.price.toLocaleString()}
                      </span>
                      {rel.originalPrice && (
                        <span className="text-slate-400 line-through text-[10px]">
                          ৳{rel.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center text-amber-400 text-[10px] pt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Product Details Tabs (Description / Specifications / Customer Reviews) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-6 border-b border-slate-200 text-sm font-bold pb-2">
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`pb-2 border-b-2 transition ${
                activeTab === "description"
                  ? "border-[#0b3b82] text-[#0b3b82]"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              Description
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("additional")}
              className={`pb-2 border-b-2 transition ${
                activeTab === "additional"
                  ? "border-[#0b3b82] text-[#0b3b82]"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              Additional Information
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`pb-2 border-b-2 transition ${
                activeTab === "reviews"
                  ? "border-[#0b3b82] text-[#0b3b82]"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              Reviews ({product.reviewsCount || 24})
            </button>
          </div>

          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
            {activeTab === "description" && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-base">Product Overview</h3>
                <p>
                  {product.name} is formulated under strict international safety standards to guarantee purity and maximum efficacy. Sourced from authorized suppliers and tested for compliance before distribution across Bangladesh.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                  <li>100% genuine and original product guaranteed.</li>
                  <li>Inspected for optimal expiration date and sealed packaging.</li>
                  <li>Suitable for daily health &amp; wellness routines.</li>
                </ul>
              </div>
            )}

            {activeTab === "additional" && (
              <div className="max-w-md">
                <table className="w-full text-left border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <tbody className="divide-y divide-slate-100">
                    <tr className="bg-slate-50">
                      <td className="py-2.5 px-4 font-bold text-slate-800">SKU</td>
                      <td className="py-2.5 px-4 text-slate-600">{product.sku || "SHP-PROD-001"}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-slate-800">Brand</td>
                      <td className="py-2.5 px-4 text-slate-600">{product.brand || "Shopia Standard"}</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="py-2.5 px-4 font-bold text-slate-800">Category</td>
                      <td className="py-2.5 px-4 text-slate-600">{product.category}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-slate-800">Delivery</td>
                      <td className="py-2.5 px-4 text-slate-600">Nationwide Cash on Delivery</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 max-w-md">
                  <div className="text-3xl font-black text-[#0b3b82]">
                    {product.rating || 4.9}
                  </div>
                  <div>
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">Based on {product.reviewsCount || 24} customer ratings</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="border-b border-slate-100 pb-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">Tanvir Hasan</span>
                      <span className="text-slate-400">2 days ago</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">Excellent original quality product and super fast delivery!</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Best Selling Products Slider Section below Details */}
        <section className="pt-6">
          <BestSellingSlider products={productsData} />
        </section>

      </div>
    </div>
  );
}
