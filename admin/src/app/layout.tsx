"use client";

import "./globals.css";
import { AdminAuthProvider } from "@/context/AdminAuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-[#080c14] text-slate-200" suppressHydrationWarning>
      <body className="min-h-screen bg-[#080c14] antialiased" suppressHydrationWarning>
        <AdminAuthProvider>
          {children}
        </AdminAuthProvider>
      </body>
    </html>
  );
}
