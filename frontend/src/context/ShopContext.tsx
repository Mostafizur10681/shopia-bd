"use client";

import React, { createContext, useContext, useState } from "react";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
}

interface ShopContextType {
  cart: any[];
  wishlist: any[];
  user: UserProfile | null;
  login: (userData: UserProfile) => void;
  logout: () => void;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
  deleteAccount: () => void;
  addToCart: (product: any, quantity?: number) => void;
  updateQuantity: (productId: number | string, delta: number) => void;
  removeFromCart: (productId: number | string) => void;
  clearCart: () => void;
  addToWishlist: (product: any) => void;
  removeFromWishlist: (productId: number | string) => void;
  isInWishlist: (productId: number | string) => boolean;
  quickViewProduct: any | null;
  setQuickViewProduct: (product: any | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const login = (userData: UserProfile) => {
    setUser(userData);
    showToast(`Welcome back, ${userData.name}!`);
  };

  const logout = () => {
    setUser(null);
    showToast("Logged out successfully.");
  };

  const updateProfile = (updatedData: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
    showToast("Profile updated successfully!");
  };

  const deleteAccount = () => {
    setUser(null);
    showToast("Your account has been deleted.");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const addToCart = (product: any, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    showToast(`"${product.name}" added to cart successfully!`);
  };

  const updateQuantity = (productId: number | string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId: number | string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showToast("Item removed from cart!");
  };

  const clearCart = () => {
    setCart([]);
    showToast("Cart cleared!");
  };

  const addToWishlist = (product: any) => {
    setWishlist((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        showToast(`"${product.name}" removed from wishlist!`);
        return prev.filter((item) => item.id !== product.id);
      }
      showToast(`"${product.name}" added to wishlist!`);
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: number | string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId: number | string) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        user,
        login,
        logout,
        updateProfile,
        deleteAccount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        quickViewProduct,
        setQuickViewProduct,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
