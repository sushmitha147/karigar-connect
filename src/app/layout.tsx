import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { FloatingAssistant } from "@/components/ai/FloatingAssistant";
import { PwaRegister } from "@/components/providers/PwaRegister";

export const metadata: Metadata = {
  title: "KARIGAR CONNECT - Craft. Connect. Grow.",
  description:
    "National B2B Artisan Marketplace connecting India's master weavers, sculptors, and craftspeople directly with global and domestic wholesale buyers.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#243B53",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#263238] antialiased selection:bg-[#F4EBDD] selection:text-[#243B53]">
        <AuthProvider>
          <PwaRegister />
          <Navbar />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer />
          <BottomNav />
          <FloatingAssistant />
        </AuthProvider>
      </body>
    </html>
  );
}
