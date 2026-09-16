"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Bell,
  User as UserIcon,
  Sparkles,
  ShoppingBag,
  Globe,
  ChevronDown,
  LogOut,
  ShieldCheck,
  Building2,
  Hammer,
} from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  const [unreadCount, setUnreadCount] = useState(1);

  const languages = [
    { code: "en", label: "English", native: "English" },
    { code: "hi", label: "Hindi", native: "हिन्दी" },
    { code: "te", label: "Telugu", native: "తెలుగు" },
    { code: "ta", label: "Tamil", native: "தமிழ்" },
  ];

  const user = session?.user as any;

  return (
    <header className="sticky top-0 z-40 bg-[#243B53] text-[#FAF8F3] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#C65D3B] flex items-center justify-center text-white font-bold text-xl shadow-sm border border-[#E8B2A0]/30 transition-transform group-hover:scale-105">
                क
              </div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-lg leading-tight text-[#FAF8F3] group-hover:text-[#F4EBDD] transition-colors">
                  KARIGAR CONNECT
                </span>
                <span className="text-[11px] font-medium tracking-wider text-[#F4EBDD]/80 uppercase">
                  Craft. Connect. Grow.
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-[15px] font-medium text-[#FAF8F3]/90">
            <Link
              href="/marketplace"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4 text-[#F4EBDD]" />
              Marketplace
            </Link>
            <Link
              href="/seller/schemes"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-[#F4EBDD]" />
              Govt Schemes
            </Link>

            {user?.role === "SELLER" && (
              <Link
                href="/seller/dashboard"
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Hammer className="w-4 h-4 text-[#F4EBDD]" />
                Artisan Dashboard
              </Link>
            )}

            {user?.role === "BUYER" && (
              <Link
                href="/buyer/dashboard"
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Building2 className="w-4 h-4 text-[#F4EBDD]" />
                Buyer Portal
              </Link>
            )}

            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="hover:text-white transition-colors flex items-center gap-1.5 text-amber-300"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Right Controls: Language, Notifications, Auth */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#334E68] text-xs font-semibold text-[#FAF8F3] hover:bg-[#486581] transition-colors border border-[#486581]"
                aria-label="Change language"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{languages.find((l) => l.code === currentLang)?.native}</span>
                <ChevronDown className="w-3 h-3 text-[#F4EBDD]/70" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-[#FAF8F3] text-[#263238] rounded-xl shadow-lg border border-[#E5DCCD] py-1 z-50 overflow-hidden">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setCurrentLang(l.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex justify-between items-center hover:bg-[#F4EBDD] transition-colors ${
                        currentLang === l.code ? "font-bold text-[#C65D3B] bg-[#FDF2EE]" : ""
                      }`}
                    >
                      <span>{l.label}</span>
                      <span className="text-[11px] text-gray-500 font-normal">{l.native}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            {session && (
              <Link
                href={user?.role === "SELLER" ? "/seller/dashboard" : "/buyer/dashboard"}
                className="relative p-2 rounded-lg text-[#FAF8F3] hover:bg-[#334E68] transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#C65D3B] rounded-full ring-2 ring-[#243B53]" />
                )}
              </Link>
            )}

            {/* User Session or Login */}
            {session ? (
              <div className="flex items-center gap-2">
                <Link
                  href={
                    user?.role === "SELLER"
                      ? "/seller/dashboard"
                      : user?.role === "ADMIN"
                      ? "/admin"
                      : "/buyer/dashboard"
                  }
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#334E68] hover:bg-[#486581] transition-colors text-xs font-medium"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#F4EBDD]" />
                  <span className="max-w-[100px] truncate">{session.user?.name || "Profile"}</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 rounded-lg text-[#FAF8F3]/80 hover:text-white hover:bg-[#334E68] transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold px-3 py-2 rounded-lg text-[#FAF8F3] hover:bg-[#334E68] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register/seller"
                  className="text-xs font-bold px-3.5 py-2 rounded-lg bg-[#C65D3B] text-white hover:bg-[#B24E2E] transition-colors shadow-sm"
                >
                  Join as Artisan
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#FAF8F3] hover:bg-[#334E68]"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-[#334E68] bg-[#102A43] px-4 pt-3 pb-5 space-y-3">
          <Link
            href="/marketplace"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#FAF8F3] hover:text-[#F4EBDD]"
          >
            Marketplace
          </Link>
          <Link
            href="/seller/schemes"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#FAF8F3] hover:text-[#F4EBDD]"
          >
            Govt Schemes (PM Vishwakarma)
          </Link>
          {user?.role === "SELLER" && (
            <>
              <Link
                href="/seller/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-sm font-medium text-[#F4EBDD]"
              >
                Artisan Dashboard
              </Link>
              <Link
                href="/seller/products/new"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-[#C65D3B]"
              >
                + Add New Product (AI Studio)
              </Link>
            </>
          )}
          {user?.role === "BUYER" && (
            <Link
              href="/buyer/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-sm font-medium text-[#F4EBDD]"
            >
              Buyer Dashboard & RFQs
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-sm font-medium text-amber-300"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
