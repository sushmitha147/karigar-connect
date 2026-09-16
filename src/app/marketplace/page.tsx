import Link from "next/link";
import {
  Search,
  Filter,
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  Package,
  Layers,
  ShoppingBag,
} from "lucide-react";
import { StateFilter } from "@/components/marketplace/StateFilter";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface MarketplacePageProps {
  searchParams: {
    category?: string;
    state?: string;
    search?: string;
    gi?: string;
  };
}

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const selectedCategory = searchParams.category || "All";
  const selectedState = searchParams.state || "All";
  const searchQuery = searchParams.search || "";
  const isGiOnly = searchParams.gi === "true";

  const where: any = {};
  if (selectedCategory && selectedCategory !== "All") {
    where.category = selectedCategory;
  }
  if (selectedState && selectedState !== "All") {
    where.seller = { state: selectedState };
  }
  if (isGiOnly) {
    where.isGiTagged = true;
  }
  if (searchQuery) {
    where.OR = [
      { title: { contains: searchQuery } },
      { shortDesc: { contains: searchQuery } },
      { craftType: { contains: searchQuery } },
      { material: { contains: searchQuery } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      seller: {
        include: {
          user: true,
        },
      },
      reviews: true,
    },
  });

  const categories = [
    "All",
    "Handloom",
    "Pottery",
    "Woodcraft",
    "Metalcraft",
    "Leathercraft",
    "Art & Painting",
  ];

  const states = [
    "All",
    "Telangana",
    "Andhra Pradesh",
    "Rajasthan",
    "Chhattisgarh",
    "Uttar Pradesh",
    "Gujarat",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="card-artisan p-6 sm:p-8 bg-[#243B53] text-[#FAF8F3] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#334E68] text-[#F4EBDD] text-xs font-bold">
            <Award className="w-3.5 h-3.5 text-[#C65D3B]" />
            <span>Direct B2B Artisan Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Source Authentic Indian Crafts
          </h1>
          <p className="text-xs sm:text-sm text-[#F4EBDD]/80 leading-relaxed">
            Directly connect with certified master artisans, state award winners, and GI craft clusters. Minimum wholesale quantities with transparent transparent bulk pricing.
          </p>
        </div>

        <div className="bg-[#102A43] p-4 rounded-2xl border border-[#334E68] text-center space-y-1 shrink-0">
          <span className="text-[11px] text-[#F4EBDD]/70 font-semibold uppercase block">
            National Catalog
          </span>
          <div className="text-2xl font-bold text-[#F4EBDD]">{products.length} Products</div>
          <span className="text-[10px] text-[#3E6650] font-bold block">100% Certified Origin</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        {/* Search Input & State Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <form className="relative flex-1" method="GET" action="/marketplace">
            <input type="hidden" name="category" value={selectedCategory} />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Search by craft, silk type, wood, brass, or artisan..."
              className="w-full bg-white border border-[#E5DCCD] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
            />
          </form>

          <div className="flex items-center gap-2">
            <StateFilter selectedState={selectedState} states={states} />

            <Link
              href={`/marketplace?category=${selectedCategory}&state=${selectedState}&gi=${
                isGiOnly ? "false" : "true"
              }`}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                isGiOnly
                  ? "bg-[#3E6650] text-white border-[#3E6650]"
                  : "bg-white text-[#263238] border-[#E5DCCD] hover:bg-[#F4EBDD]"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>GI Tagged Only</span>
            </Link>
          </div>
        </div>

        {/* Category Horizontal Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <Link
                key={cat}
                href={`/marketplace?category=${cat}&state=${selectedState}&search=${searchQuery}`}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border ${
                  isActive
                    ? "bg-[#243B53] text-[#FAF8F3] border-[#243B53]"
                    : "bg-white text-[#263238] border-[#E5DCCD] hover:bg-[#F4EBDD]"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Product Cards Grid */}
      {products.length === 0 ? (
        <div className="card-artisan p-12 bg-white text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#F4EBDD] text-[#C65D3B] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-[#243B53]">No Crafts Match This Filter</h2>
          <p className="text-xs text-gray-600 max-w-sm mx-auto">
            Try switching the category or clearing the search query to see all available wholesale artisan listings.
          </p>
          <Link href="/marketplace" className="btn-secondary inline-block text-xs">
            Clear All Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => {
            let imgList = ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80"];
            try {
              imgList = JSON.parse(p.images);
            } catch (e) {}

            return (
              <div
                key={p.id}
                className="card-artisan bg-white overflow-hidden flex flex-col group hover:shadow-artisan-hover transition-all border border-[#E5DCCD]"
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] bg-[#F4EBDD] overflow-hidden">
                  <img
                    src={imgList[0]}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {p.isGiTagged && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#3E6650] text-white shadow-sm flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        GI Tagged
                      </span>
                    )}
                    {p.isHandmade && (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#243B53] text-white shadow-sm">
                        100% Handmade
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 bg-[#FAF8F3] text-[#243B53] px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-md border border-[#E5DCCD]">
                    MOQ: {p.moq} units
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-[#263238]/70 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#C65D3B]" />
                        {p.seller.district}, {p.seller.state}
                      </span>
                      {p.seller.isVerified && (
                        <span className="text-[10px] font-bold text-[#3E6650] flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-[#243B53] line-clamp-2 leading-snug group-hover:text-[#C65D3B] transition-colors">
                      {p.title}
                    </h3>

                    <p className="text-xs text-[#263238]/75 line-clamp-2 leading-relaxed">
                      {p.shortDesc}
                    </p>
                  </div>

                  {/* Pricing and Action Footer */}
                  <div className="pt-3 border-t border-[#EAE3D2] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-500 block uppercase font-bold">
                        Wholesale Unit Price
                      </span>
                      <span className="text-lg font-bold text-[#C65D3B]">
                        ₹{p.price.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <Link
                      href={`/marketplace/${p.id}`}
                      className="btn-cta text-xs py-2 px-3.5 shadow-sm"
                    >
                      View & Quote
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
