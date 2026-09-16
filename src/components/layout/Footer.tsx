import Link from "next/link";
import { Heart, ShieldCheck, Sparkles, MapPin, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#243B53] text-[#FAF8F3] border-t border-[#334E68] mt-20 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C65D3B] text-white flex items-center justify-center font-bold text-lg">
                क
              </div>
              <span className="font-bold text-lg text-white">KARIGAR CONNECT</span>
            </div>
            <p className="text-sm text-[#F4EBDD]/80 leading-relaxed">
              Craft. Connect. Grow. Empowering India’s generational artisans with AI-assisted cataloging, direct B2B buyer connections, and fair-trade wholesale access.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#F4EBDD]/70">
              <ShieldCheck className="w-4 h-4 text-[#3E6650]" />
              <span>GI Tagged & Ministry Verified Artisans</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F4EBDD] mb-4">
              Explore Crafts
            </h4>
            <ul className="space-y-2 text-sm text-[#FAF8F3]/80">
              <li>
                <Link href="/marketplace?category=Handloom" className="hover:text-white transition-colors">
                  Pochampally & Handlooms
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=Woodcraft" className="hover:text-white transition-colors">
                  Etikoppaka & Wooden Toys
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=Pottery" className="hover:text-white transition-colors">
                  Jaipur Blue Pottery
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=Metalcraft" className="hover:text-white transition-colors">
                  Bastar Dhokra Bell Metal
                </Link>
              </li>
            </ul>
          </div>

          {/* Artisan Empowerment */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F4EBDD] mb-4">
              Artisan Support
            </h4>
            <ul className="space-y-2 text-sm text-[#FAF8F3]/80">
              <li>
                <Link href="/seller/schemes" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C65D3B]" />
                  PM Vishwakarma Yojana
                </Link>
              </li>
              <li>
                <Link href="/seller/schemes" className="hover:text-white transition-colors">
                  Weavers Mudra Scheme
                </Link>
              </li>
              <li>
                <Link href="/seller/schemes" className="hover:text-white transition-colors">
                  ODOP Export Linkage
                </Link>
              </li>
              <li>
                <Link href="/register/seller" className="hover:text-white transition-colors">
                  Artisan Digital Onboarding
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Languages */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F4EBDD] mb-4">
              Multi-Language Access
            </h4>
            <p className="text-xs text-[#F4EBDD]/70 mb-3">
              Designed for voice-first interaction in Indian regional languages:
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-[#334E68] text-white">English</span>
              <span className="px-2.5 py-1 rounded bg-[#334E68] text-white font-hindi">हिन्दी</span>
              <span className="px-2.5 py-1 rounded bg-[#334E68] text-white font-telugu">తెలుగు</span>
              <span className="px-2.5 py-1 rounded bg-[#334E68] text-white">தமிழ்</span>
            </div>
            <div className="mt-4 pt-3 border-t border-[#334E68] flex items-center gap-1.5 text-xs text-[#F4EBDD]/70">
              <MapPin className="w-3.5 h-3.5 text-[#C65D3B]" />
              <span>National Artisan Craft Clusters, India</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#334E68] flex flex-col sm:flex-row justify-between items-center text-xs text-[#F4EBDD]/60 gap-3">
          <p>© {new Date().getFullYear()} KARIGAR CONNECT. Celebrating Indian generational craftsmanship.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-[#C65D3B] fill-[#C65D3B]" /> for Indian Artisans
          </p>
        </div>
      </div>
    </footer>
  );
}
