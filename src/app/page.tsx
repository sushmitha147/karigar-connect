import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Award,
  Layers,
  Users,
  Store,
  Briefcase,
  Mic,
  Camera,
  TrendingUp,
} from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch real featured products from DB
  const products = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      seller: {
        include: {
          user: true,
        },
      },
    },
  });

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section: Real artisan photo with dark overlay, tactile text */}
      <section className="relative min-h-[560px] flex items-center justify-center overflow-hidden">
        {/* Background real artisan photo */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1606744888344-493238955de0?w=1800&q=85"
            alt="Master artisan handloom weaver with threads"
            className="w-full h-full object-cover object-center"
          />
          {/* Strict solid dark overlay for readability without flashy gradients */}
          <div className="absolute inset-0 bg-[#243B53]/75" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F3]/10 border border-[#F4EBDD]/20 text-[#F4EBDD] text-xs font-semibold mb-6">
            <Award className="w-4 h-4 text-[#C65D3B]" />
            <span>National B2B Artisan Empowerment Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#FAF8F3] leading-[1.15] mb-6">
            Craft. Connect. Grow.
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#F4EBDD]/90 leading-relaxed mb-10 font-normal">
            Bridging India’s master handloom weavers, potters, and sculptors directly with verified boutiques, wholesale exporters, and ethical B2B buyers.
          </p>

          {/* TWO BIG CARDS: "I AM A SELLER" / "I AM A BUYER" */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
            {/* Card 1: I AM A SELLER */}
            <Link
              href="/register/seller"
              className="group bg-[#FAF8F3] rounded-2xl p-6 sm:p-7 border-2 border-transparent hover:border-[#C65D3B] transition-all shadow-md transform hover:-translate-y-1 block"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C65D3B] bg-[#FDF2EE] px-3 py-1 rounded-full border border-[#E8B2A0]">
                  For Artisans & Weavers
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#243B53] text-[#FAF8F3] flex items-center justify-center group-hover:bg-[#C65D3B] transition-colors">
                  <Store className="w-5 h-5" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-[#243B53] mb-2 group-hover:text-[#C65D3B] transition-colors">
                I AM A SELLER
              </h2>
              <p className="text-sm text-[#263238]/80 leading-relaxed mb-4">
                List with voice in Telugu or Hindi. Remove image clutter with AI Studio. Match with government schemes and sell bulk direct to verified buyers.
              </p>
              <div className="flex items-center text-sm font-bold text-[#C65D3B] group-hover:translate-x-1 transition-transform">
                <span>Start 3-Step Registration</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </Link>

            {/* Card 2: I AM A BUYER */}
            <Link
              href="/register/buyer"
              className="group bg-[#FAF8F3] rounded-2xl p-6 sm:p-7 border-2 border-transparent hover:border-[#243B53] transition-all shadow-md transform hover:-translate-y-1 block"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#243B53] bg-[#F0F4F8] px-3 py-1 rounded-full border border-[#D9E2EC]">
                  For Boutiques & Exporters
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#243B53] text-[#FAF8F3] flex items-center justify-center group-hover:bg-[#C65D3B] transition-colors">
                  <Briefcase className="w-5 h-5" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-[#243B53] mb-2 group-hover:text-[#C65D3B] transition-colors">
                I AM A BUYER
              </h2>
              <p className="text-sm text-[#263238]/80 leading-relaxed mb-4">
                Source authentic GI-tagged crafts direct from origin clusters. Submit custom RFQs, test sample orders, and manage trade quotes seamlessly.
              </p>
              <div className="flex items-center text-sm font-bold text-[#243B53] group-hover:translate-x-1 transition-transform">
                <span>Register Wholesale Account</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Stats Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F4EBDD] rounded-2xl p-6 sm:p-8 border border-[#E5DCCD] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-[#243B53]">1,850+</div>
            <div className="text-xs sm:text-sm text-[#263238]/80 font-medium mt-1">Master Artisans</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-[#243B53]">42</div>
            <div className="text-xs sm:text-sm text-[#263238]/80 font-medium mt-1">GI Craft Clusters</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-[#3E6650]">100%</div>
            <div className="text-xs sm:text-sm text-[#263238]/80 font-medium mt-1">Direct Producer Margin</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-[#C65D3B]">4 Langs</div>
            <div className="text-xs sm:text-sm text-[#263238]/80 font-medium mt-1">En / Hi / Te / Ta</div>
          </div>
        </div>
      </section>

      {/* End-to-End Artisan Tools Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C65D3B]">
            Built For Real Artisans
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#243B53] mt-1">
            Empowering Traditional Hands with Intelligent Tools
          </h2>
          <p className="text-sm text-[#263238]/80 mt-2">
            No typing required. From voice recording to studio-grade photography and fair wage calculations in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-artisan p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#F4EBDD] text-[#C65D3B] flex items-center justify-center font-bold">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#243B53]">AI Product Studio</h3>
            <p className="text-sm text-[#263238]/80 leading-relaxed">
              Take photos right inside your workshop. Our AI studio adapter automatically removes messy workshop backgrounds, balances warm lighting, and preserves authentic weave textures.
            </p>
          </div>

          <div className="card-artisan p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#F4EBDD] text-[#C65D3B] flex items-center justify-center font-bold">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#243B53]">Voice-to-Catalog</h3>
            <p className="text-sm text-[#263238]/80 leading-relaxed">
              Speak naturally in Telugu, Hindi, or Tamil. Our multi-language engine transcribes your speech, extracts specifications (yarn, dimensions, care), and creates instant translations in 4 languages.
            </p>
          </div>

          <div className="card-artisan p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#F4EBDD] text-[#C65D3B] flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#243B53]">AI Price Advisor</h3>
            <p className="text-sm text-[#263238]/80 leading-relaxed">
              Never undersell your craft. Enter material costs and weaving hours to receive algorithmic price estimates ensuring fair-trade artisan wages and competitive B2B wholesale pricing.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Verified Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3E6650]">
              Verified Handcrafted Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#243B53] mt-1">
              Direct from Master Craftspeople
            </h2>
          </div>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#C65D3B] hover:text-[#B24E2E]"
          >
            <span>Explore All Marketplace Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => {
            let imgList = ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80"];
            try {
              imgList = JSON.parse(p.images);
            } catch (e) {}

            return (
              <div
                key={p.id}
                className="card-artisan overflow-hidden flex flex-col group hover:shadow-artisan-hover transition-all"
              >
                <div className="relative aspect-[4/3] bg-[#F4EBDD] overflow-hidden">
                  <img
                    src={imgList[0]}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {p.isGiTagged && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#3E6650] text-white shadow-sm">
                        GI Tagged
                      </span>
                    )}
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF8F3] text-[#243B53] border border-[#E5DCCD] shadow-sm">
                      MOQ: {p.moq} pcs
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-[#263238]/60 font-medium mb-1">
                      {p.seller.shopName} • {p.seller.state}
                    </div>
                    <h3 className="font-bold text-sm text-[#243B53] line-clamp-2 leading-snug">
                      {p.title}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EAE3D2] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-gray-500 block">Wholesale Price</span>
                      <span className="text-base font-bold text-[#C65D3B]">
                        ₹{p.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <Link
                      href={`/marketplace/${p.id}`}
                      className="px-3 py-1.5 rounded-lg bg-[#243B53] text-white text-xs font-semibold hover:bg-[#334E68] transition-colors"
                    >
                      View & Quote
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
