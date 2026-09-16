"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Home,
  Package,
  PlusCircle,
  Briefcase,
  User,
  ShoppingBag,
  FileText,
} from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as any;
  const isSeller = user?.role === "SELLER";
  const isBuyer = user?.role === "BUYER";

  // Hide on new product wizard to maximize screen real estate
  if (pathname.includes("/seller/products/new")) {
    return null;
  }

  if (isSeller) {
    const navItems = [
      { href: "/seller/dashboard", label: "Home", icon: Home },
      { href: "/seller/products", label: "Products", icon: Package },
      {
        href: "/seller/products/new",
        label: "Add",
        icon: PlusCircle,
        isAction: true,
      },
      { href: "/seller/rfqs", label: "Business", icon: Briefcase },
      { href: "/seller/dashboard", label: "Profile", icon: User },
    ];

    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#243B53] border-t border-[#334E68] px-3 py-2 shadow-lg">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (item.isAction) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex flex-col items-center -mt-6 group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#C65D3B] text-white flex items-center justify-center shadow-lg border-4 border-[#FAF8F3] group-hover:scale-105 transition-transform">
                    <PlusCircle className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-bold text-[#FAF8F3] mt-1">
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
                  isActive ? "text-[#C65D3B] font-bold" : "text-[#FAF8F3]/75 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-[#C65D3B]" : ""}`} />
                <span className="text-[10px] mt-0.5">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // Buyer / Visitor navigation
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#243B53] border-t border-[#334E68] px-3 py-2 shadow-lg">
      <div className="flex items-center justify-around">
        <Link
          href="/"
          className={`flex flex-col items-center py-1 px-2 ${
            pathname === "/" ? "text-[#C65D3B] font-bold" : "text-[#FAF8F3]/75"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </Link>
        <Link
          href="/marketplace"
          className={`flex flex-col items-center py-1 px-2 ${
            pathname.startsWith("/marketplace") ? "text-[#C65D3B] font-bold" : "text-[#FAF8F3]/75"
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Market</span>
        </Link>
        {isBuyer && (
          <>
            <Link
              href="/buyer/rfqs"
              className={`flex flex-col items-center py-1 px-2 ${
                pathname.startsWith("/buyer/rfqs") ? "text-[#C65D3B] font-bold" : "text-[#FAF8F3]/75"
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">RFQs</span>
            </Link>
            <Link
              href="/buyer/dashboard"
              className={`flex flex-col items-center py-1 px-2 ${
                pathname.startsWith("/buyer/dashboard") ? "text-[#C65D3B] font-bold" : "text-[#FAF8F3]/75"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Portal</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
