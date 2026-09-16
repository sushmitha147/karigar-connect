import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Award,
  ShieldCheck,
  MapPin,
  Sparkles,
  Layers,
  Heart,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Users,
} from "lucide-react";
import prisma from "@/lib/prisma";

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ select: { id: true } });
  return products.map((p) => ({ id: p.id }));
}

export default async function StoryPage({ params }: StoryPageProps) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      seller: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  let images: string[] = [];
  try {
    images = JSON.parse(product.images);
  } catch (e) {
    images = [product.images];
  }

  const { seller } = product;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Provenance Header Badge */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF3EE] text-[#3E6650] text-xs font-bold border border-[#3E6650]/20">
          <Award className="w-4 h-4" />
          <span>Authentic Verified Artisan Provenance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#243B53] tracking-tight">
          The Craft Story Behind Your Creation
        </h1>
        <p className="text-xs sm:text-sm text-[#263238]/70 max-w-xl mx-auto">
          You are holding an authentic piece of Indian generational heritage, handcrafted without industrial machinery.
        </p>
      </div>

      {/* Hero Artisan Banner */}
      <div className="card-artisan overflow-hidden bg-white shadow-md border border-[#E5DCCD]">
        <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-[#243B53]">
          <img
            src={seller.bannerImage || images[0]}
            alt={seller.shopName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#243B53]/60" />
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-white space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F4EBDD]">
              Master Craftsperson
            </span>
            <h2 className="text-xl sm:text-2xl font-bold">{seller.shopName}</h2>
            <div className="flex items-center gap-1 text-xs text-[#FAF8F3]/90">
              <MapPin className="w-3.5 h-3.5 text-[#C65D3B]" />
              <span>{seller.district}, {seller.state}</span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#F4EBDD] border border-[#E5DCCD] text-center">
            <div>
              <span className="text-[10px] text-gray-600 block uppercase font-bold">Craft Heritage</span>
              <span className="text-sm font-bold text-[#243B53]">{seller.experienceYears}+ Years</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-600 block uppercase font-bold">Origin Cluster</span>
              <span className="text-sm font-bold text-[#243B53]">{seller.district}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-600 block uppercase font-bold">GI Recognition</span>
              <span className="text-sm font-bold text-[#3E6650]">
                {product.isGiTagged ? "Certified GI" : "Handmade"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-600 block uppercase font-bold">Middleman Cut</span>
              <span className="text-sm font-bold text-[#C65D3B]">0% Direct</span>
            </div>
          </div>

          {/* Artisan Biography */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#243B53]">Meet the Master Artisan</h3>
            <p className="text-sm text-[#263238]/85 leading-relaxed">
              {seller.bio ||
                `The workshop of ${seller.shopName} is located in the venerable craft cluster of ${seller.district}, ${seller.state}. For over ${seller.experienceYears} years, their family has preserved the heritage of ${product.craftType}, training young village weavers and upholding authentic traditional methods.`}
            </p>
          </div>

          {/* Handcraft Process Walkthrough */}
          <div className="space-y-4 pt-4 border-t border-[#E5DCCD]">
            <h3 className="text-lg font-bold text-[#243B53]">The Generational Making Process</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#FAF8F3] p-4 rounded-xl border border-[#E5DCCD] space-y-2">
                <span className="w-6 h-6 rounded-full bg-[#243B53] text-white flex items-center justify-center font-bold text-[11px]">
                  1
                </span>
                <h4 className="font-bold text-[#243B53]">Raw Material Preparation</h4>
                <p className="text-gray-600 leading-relaxed">
                  Ethically sourced natural yarns and mineral oxides prepared without synthetic harsh chemicals.
                </p>
              </div>

              <div className="bg-[#FAF8F3] p-4 rounded-xl border border-[#E5DCCD] space-y-2">
                <span className="w-6 h-6 rounded-full bg-[#C65D3B] text-white flex items-center justify-center font-bold text-[11px]">
                  2
                </span>
                <h4 className="font-bold text-[#243B53]">Precision Crafting</h4>
                <p className="text-gray-600 leading-relaxed">
                  Tied, turned on hand-lathes, or woven thread-by-thread over days of sustained dedication.
                </p>
              </div>

              <div className="bg-[#FAF8F3] p-4 rounded-xl border border-[#E5DCCD] space-y-2">
                <span className="w-6 h-6 rounded-full bg-[#3E6650] text-white flex items-center justify-center font-bold text-[11px]">
                  3
                </span>
                <h4 className="font-bold text-[#243B53]">Natural Finishing</h4>
                <p className="text-gray-600 leading-relaxed">
                  Sun-dried, rubbed with natural leaf polishes or earthen glaze, inspected for heirloom quality.
                </p>
              </div>
            </div>
          </div>

          {/* Social Impact Card */}
          <div className="bg-[#EBF3EE] p-5 rounded-xl border border-[#3E6650]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#3E6650]">
                <ShieldCheck className="w-4 h-4" />
                <span>Your Purchase Directly Supported Rural Artisans</span>
              </div>
              <p className="text-xs text-[#263238]/80">
                100% of the artisan earnings went directly to {seller.shopName} in {seller.district}. Thank you for sustaining India's living cultural legacy.
              </p>
            </div>

            <Link
              href={`/marketplace/${product.id}`}
              className="px-4 py-2 rounded-xl bg-[#243B53] text-white text-xs font-bold hover:bg-[#334E68] transition-colors shrink-0"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
