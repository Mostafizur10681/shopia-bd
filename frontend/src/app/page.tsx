import React from "react";
import productsData from "@/data/products.json";
import { BestSellingSlider } from "@/components/BestSellingSlider";
import { LatestProductsSlider } from "@/components/LatestProductsSlider";
import { HeroSlider } from "@/components/HomePageSections";
import { SkinCareSection } from "@/components/SkinCareSection";
import { SecureDeliveryBanner } from "@/components/SecureDeliveryBanner";
import { OrganicFoodSection } from "@/components/OrganicFoodSection";
import { TrustBadgesBar } from "@/components/TrustBadgesBar";

export const metadata = {
  title: "ShopiaBD - Online Shopping in Bangladesh | Organic Food, Beauty & Health",
  description: "Shop authentic organic food, beauty products, food supplements and health products at best prices in Bangladesh with nationwide cash on delivery.",
};

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

      {/* 4. Skin Care Product Section (Custom Banner Grid) */}
      <section className="w-full">
        <SkinCareSection />
      </section>

      {/* 5. 100% Secure Delivery Notice Banner */}
      <section className="w-full">
        <SecureDeliveryBanner />
      </section>

      {/* 6. Organic Food Product Section (Right-Side Navy Banner Grid) */}
      <section className="w-full">
        <OrganicFoodSection />
      </section>

      {/* 7. Trust Badges Bar (100% Money back | Non-contact shipping | Fast delivery) */}
      <section className="w-full">
        <TrustBadgesBar />
      </section>
    </div>
  );
}
