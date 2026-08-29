import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Footer } from "@/components/layout/Footer";
import { PWAInstallBanner } from "@/components/ui/PWAInstallBanner";
import { SupabaseProvider } from "@/lib/supabase/provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NontonAnime - Streaming Anime Subtitle Indonesia Gratis HD",
    template: "%s | NontonAnime",
  },
  description: "Platform nonton anime subtitle Indonesia terlengkap, responsif untuk Android dan PC, bebas iklan yang mengganggu dan nyaman di mata.",
  keywords: ["nonton anime", "streaming anime sub indo", "anime terbaru", "download anime", "otakudesu"],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-screen bg-[#0a0f18] text-[#f1f5f9] flex flex-col antialiased selection:bg-[#6366f1]/30 selection:text-[#38bdf8]">
        <SupabaseProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            {children}
          </main>
          <PWAInstallBanner />
          <MobileBottomNav />
          <Footer />
        </SupabaseProvider>
      </body>
    </html>
  );
}
