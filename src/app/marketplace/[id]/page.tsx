"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  Clock,
  Heart,
  Share2,
  QrCode,
  Eye,
  MessageSquare,
  ShoppingCart,
  Send,
  Star,
  CheckCircle2,
  Layers,
  ChevronRight,
} from "lucide-react";
import { RFQModal } from "@/components/marketplace/RFQModal";
import { PlacementModal } from "@/components/marketplace/PlacementModal";
import { StoryQRModal } from "@/components/marketplace/StoryQRModal";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  // Modals
  const [isRfqOpen, setIsRfqOpen] = useState(false);
  const [isPlacementOpen, setIsPlacementOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/products/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-[#C65D3B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-[#243B53]">Loading master artisan craft details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#243B53]">Product Not Found</h2>
        <p className="text-xs text-gray-600">The craft listing may have been updated or archived.</p>
        <Link href="/marketplace" className="btn-cta inline-block text-xs">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  let images: string[] = [];
  try {
    images = JSON.parse(product.images);
  } catch (e) {
    images = [product.images || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80"];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-[#263238]/70">
        <Link href="/" className="hover:text-[#243B53]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/marketplace" className="hover:text-[#243B53]">Marketplace</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-[#243B53] truncate max-w-[200px]">{product.title}</span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Gallery Col (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F4EBDD] border border-[#E5DCCD] shadow-sm">
            <img
              src={images[activeImage] || images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.isGiTagged && (
              <div className="absolute top-3 left-3 bg-[#3E6650] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>GI Certified Authentic</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === idx
                      ? "border-[#C65D3B] ring-2 ring-[#C65D3B]/30"
                      : "border-[#E5DCCD] opacity-75 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Interactive AI Triggers (Placement Advisor & Story QR) */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setIsPlacementOpen(true)}
              className="p-3 rounded-xl bg-[#FAF8F3] hover:bg-[#F4EBDD] border border-[#E5DCCD] text-left transition-colors flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#243B53] text-[#FAF8F3] flex items-center justify-center shrink-0">
                <Eye className="w-4 h-4 text-[#F4EBDD]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#243B53] block leading-tight">
                  Placement Advisor
                </span>
                <span className="text-[10px] text-gray-500">Wall photo & Vastu</span>
              </div>
            </button>

            <button
              onClick={() => setIsQrOpen(true)}
              className="p-3 rounded-xl bg-[#FAF8F3] hover:bg-[#F4EBDD] border border-[#E5DCCD] text-left transition-colors flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#C65D3B] text-white flex items-center justify-center shrink-0">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#243B53] block leading-tight">
                  Story QR Code
                </span>
                <span className="text-[10px] text-gray-500">Printable label</span>
              </div>
            </button>
          </div>
        </div>

        {/* Product Details & Actions Col (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3E6650] bg-[#EBF3EE] px-2.5 py-0.5 rounded-full">
                {product.category} • {product.craftType}
              </span>
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`p-2 rounded-xl border transition-colors ${
                  isSaved
                    ? "bg-[#FDF2EE] border-[#E8B2A0] text-[#C65D3B]"
                    : "bg-white border-[#E5DCCD] text-gray-400 hover:text-gray-700"
                }`}
                title={isSaved ? "Saved to Wishlist" : "Save to Wishlist"}
              >
                <Heart className={`w-4 h-4 ${isSaved ? "fill-[#C65D3B]" : ""}`} />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#243B53] leading-tight">
              {product.title}
            </h1>

            <p className="text-sm text-[#263238]/80 leading-relaxed pt-1">
              {product.shortDesc}
            </p>
          </div>

          {/* Pricing & MOQ Card */}
          <div className="p-5 rounded-2xl bg-[#F4EBDD] border border-[#E5DCCD] space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[11px] font-bold text-gray-600 uppercase block">
                  B2B Wholesale Unit Price
                </span>
                <span className="text-3xl font-bold text-[#C65D3B]">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-gray-600 ml-1.5">/ piece</span>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-[#243B53] block uppercase">
                  Minimum Order (MOQ)
                </span>
                <span className="text-lg font-bold text-[#243B53]">
                  {product.moq} units
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E5DCCD] text-[#263238]/80 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#3E6650]" />
                In Workshop Stock: {product.stock} units
              </span>
              <span>Direct Artisan Dispatch</span>
            </div>
          </div>

          {/* Action Buttons: Request Quote / Contact Seller / Save / Buy Now */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setIsRfqOpen(true)}
                className="btn-cta flex items-center justify-center gap-2 text-sm shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Request Bulk Quote (RFQ)</span>
              </button>

              <Link
                href={`/checkout?productId=${product.id}&qty=${product.moq}`}
                className="btn-secondary flex items-center justify-center gap-2 text-sm text-[#243B53] bg-white hover:bg-[#F4EBDD]"
              >
                <ShoppingCart className="w-4 h-4 text-[#C65D3B]" />
                <span>Buy Sample ({product.moq} MOQ)</span>
              </Link>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="space-y-3 pt-4 border-t border-[#EAE3D2]">
            <h3 className="font-bold text-sm text-[#243B53] uppercase tracking-wider">
              Technical & Craft Specifications
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#FAF8F3] p-2.5 rounded-xl border border-[#E5DCCD]">
                <span className="text-gray-500 block text-[10px]">Material</span>
                <span className="font-semibold text-[#243B53]">{product.material || "Natural fibers & dyes"}</span>
              </div>
              <div className="bg-[#FAF8F3] p-2.5 rounded-xl border border-[#E5DCCD]">
                <span className="text-gray-500 block text-[10px]">Dimensions</span>
                <span className="font-semibold text-[#243B53]">{product.dimensions || "Standard artisan size"}</span>
              </div>
              <div className="bg-[#FAF8F3] p-2.5 rounded-xl border border-[#E5DCCD]">
                <span className="text-gray-500 block text-[10px]">Weight</span>
                <span className="font-semibold text-[#243B53]">{product.weight || "N/A"}</span>
              </div>
              <div className="bg-[#FAF8F3] p-2.5 rounded-xl border border-[#E5DCCD]">
                <span className="text-gray-500 block text-[10px]">Color Palette</span>
                <span className="font-semibold text-[#243B53]">{product.color || "Natural organic pigments"}</span>
              </div>
            </div>
          </div>

          {/* SELLER STORY: "Meet the Artisan" */}
          <div className="card-artisan p-5 bg-white space-y-3 border border-[#E5DCCD]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#243B53] text-white flex items-center justify-center font-bold text-lg shrink-0">
                {product.seller.user?.avatarUrl ? (
                  <img
                    src={product.seller.user.avatarUrl}
                    alt={product.seller.shopName}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  product.seller.shopName.charAt(0)
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C65D3B] block">
                  Meet the Artisan
                </span>
                <h4 className="font-bold text-sm text-[#243B53]">
                  {product.seller.shopName}
                </h4>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3 text-[#C65D3B]" />
                  <span>{product.seller.district}, {product.seller.state} • {product.seller.experienceYears} Years Heritage</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#263238]/80 leading-relaxed italic">
              "{product.seller.bio || "Generational craft masters continuing authentic handcraft traditions."}"
            </p>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E5DCCD]">
              <span className="text-gray-500">Capacity: {product.seller.capacityPerMonth} units/month</span>
              <Link
                href={`/story/${product.id}`}
                className="font-bold text-[#C65D3B] hover:underline"
              >
                Read Full Artisan Story →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <RFQModal
        product={product}
        isOpen={isRfqOpen}
        onClose={() => setIsRfqOpen(false)}
      />

      <PlacementModal
        product={product}
        isOpen={isPlacementOpen}
        onClose={() => setIsPlacementOpen(false)}
      />

      <StoryQRModal
        productId={product.id}
        productTitle={product.title}
        artisanName={product.seller.shopName}
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
      />
    </div>
  );
}
