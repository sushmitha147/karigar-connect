import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Camera,
  Mic,
  Sparkles,
  TrendingUp,
  Package,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  IndianRupee,
  ShoppingBag,
  Store,
  ChevronRight,
  Award,
} from "lucide-react";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SellerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as any;

  // Fetch seller profile
  const seller = await prisma.sellerProfile.findFirst({
    where: { userId: user.id },
    include: {
      products: {
        take: 5,
        orderBy: { createdAt: "desc" },
      },
      orders: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { product: true, buyer: true },
      },
      quotes: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { rfq: { include: { product: true, buyer: true } } },
      },
      user: true,
    },
  });

  if (!seller) {
    // If logged in as non-seller, redirect appropriately
    if (user.role === "BUYER") redirect("/buyer/dashboard");
    if (user.role === "ADMIN") redirect("/admin");
    redirect("/register/seller");
  }

  // Calculate stats
  const totalProducts = await prisma.product.count({ where: { sellerId: seller.id } });
  const pendingOrders = await prisma.order.count({
    where: { sellerId: seller.id, orderStatus: "PROCESSING" },
  });
  const totalOrders = await prisma.order.findMany({ where: { sellerId: seller.id } });
  const totalRevenue = totalOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const activeRfqs = await prisma.rfq.count({
    where: { product: { sellerId: seller.id }, status: { in: ["PENDING", "QUOTED"] } },
  });

  // Multilingual Namaste greeting
  const getGreeting = (name: string, lang: string) => {
    if (lang === "te") return `నమస్తే, ${name} గారు`;
    if (lang === "hi") return `नमस्ते, ${name} जी`;
    if (lang === "ta") return `வணக்கம், ${name}`;
    return `Namaste, ${name}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Artisan Greeting & Shop Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white card-artisan p-6 sm:p-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#243B53] text-[#FAF8F3] flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
            {seller.user?.avatarUrl ? (
              <img
                src={seller.user.avatarUrl}
                alt={seller.shopName}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              seller.shopName.charAt(0)
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#243B53]">
                {getGreeting(user.name, user.language)}
              </h1>
              {seller.isVerified && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#3E6650] bg-[#EBF3EE] px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Artisan
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#263238]/70 mt-0.5">
              {seller.shopName} • {seller.craftType} ({seller.district}, {seller.state})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/seller/products/new"
            className="btn-cta flex items-center gap-2 text-sm shadow-md"
          >
            <Camera className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Govt Scheme Eligibility Alert Callout */}
      <div className="bg-[#F4EBDD] rounded-2xl p-4 sm:p-5 border border-[#E5DCCD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C65D3B] text-white flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#243B53]">
              Govt Scheme Match: Eligible for PM Vishwakarma Yojana
            </div>
            <div className="text-xs text-[#263238]/80">
              Get ₹15,000 digital toolkit incentive + collateral-free ₹3 Lakh credit at 5% interest for {seller.craftType}.
            </div>
          </div>
        </div>
        <Link
          href="/seller/schemes"
          className="px-4 py-2 rounded-xl bg-[#243B53] text-white text-xs font-bold hover:bg-[#334E68] transition-colors shrink-0"
        >
          Check Details & Apply
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="card-artisan p-5 bg-white space-y-2">
          <div className="flex items-center justify-between text-xs text-[#263238]/60 font-semibold uppercase">
            <span>Active Products</span>
            <Package className="w-4 h-4 text-[#243B53]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#243B53]">{totalProducts}</div>
          <div className="text-[11px] text-[#3E6650] font-medium">In live wholesale catalog</div>
        </div>

        <div className="card-artisan p-5 bg-white space-y-2">
          <div className="flex items-center justify-between text-xs text-[#263238]/60 font-semibold uppercase">
            <span>Active RFQs</span>
            <MessageSquare className="w-4 h-4 text-[#C65D3B]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#C65D3B]">{activeRfqs}</div>
          <div className="text-[11px] text-gray-500 font-medium">Wholesale quote requests</div>
        </div>

        <div className="card-artisan p-5 bg-white space-y-2">
          <div className="flex items-center justify-between text-xs text-[#263238]/60 font-semibold uppercase">
            <span>Pending Orders</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#243B53]">{pendingOrders}</div>
          <div className="text-[11px] text-amber-700 font-medium">Awaiting workshop dispatch</div>
        </div>

        <div className="card-artisan p-5 bg-white space-y-2">
          <div className="flex items-center justify-between text-xs text-[#263238]/60 font-semibold uppercase">
            <span>Total Revenue</span>
            <IndianRupee className="w-4 h-4 text-[#3E6650]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#3E6650]">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-gray-500 font-medium">100% direct artisan payout</div>
        </div>
      </div>

      {/* BIG ACTIONS SECTION (As explicitly requested in prompt) */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-[#243B53]">Artisan Workshop Actions</h2>
          <p className="text-xs text-[#263238]/70">Fast shortcuts to build and run your craft catalog</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Action 1: 📸 Add Product */}
          <Link
            href="/seller/products/new"
            className="group card-artisan p-4 bg-white hover:border-[#C65D3B] transition-all text-center flex flex-col items-center justify-center space-y-2.5 shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FDF2EE] text-[#C65D3B] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              📸
            </div>
            <span className="font-bold text-xs text-[#243B53] group-hover:text-[#C65D3B]">
              Add Product
            </span>
          </Link>

          {/* Action 2: 🎙️ Describe With Voice */}
          <Link
            href="/seller/products/new?step=3"
            className="group card-artisan p-4 bg-white hover:border-[#C65D3B] transition-all text-center flex flex-col items-center justify-center space-y-2.5 shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FDF2EE] text-[#C65D3B] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              🎙️
            </div>
            <span className="font-bold text-xs text-[#243B53] group-hover:text-[#C65D3B]">
              Voice Describe
            </span>
          </Link>

          {/* Action 3: ✨ Improve Listing */}
          <Link
            href="/seller/products"
            className="group card-artisan p-4 bg-white hover:border-[#243B53] transition-all text-center flex flex-col items-center justify-center space-y-2.5 shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#F0F4F8] text-[#243B53] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              ✨
            </div>
            <span className="font-bold text-xs text-[#243B53]">
              Improve Listing
            </span>
          </Link>

          {/* Action 4: 💰 Check Price */}
          <Link
            href="/seller/products/new?step=5"
            className="group card-artisan p-4 bg-white hover:border-[#3E6650] transition-all text-center flex flex-col items-center justify-center space-y-2.5 shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#EBF3EE] text-[#3E6650] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              💰
            </div>
            <span className="font-bold text-xs text-[#243B53]">
              Check Price
            </span>
          </Link>

          {/* Action 5: 📦 Inventory */}
          <Link
            href="/seller/products"
            className="group card-artisan p-4 bg-white hover:border-[#243B53] transition-all text-center flex flex-col items-center justify-center space-y-2.5 shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#F4EBDD] text-[#243B53] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              📦
            </div>
            <span className="font-bold text-xs text-[#243B53]">
              Inventory
            </span>
          </Link>

          {/* Action 6: 💬 Enquiries */}
          <Link
            href="/seller/rfqs"
            className="group card-artisan p-4 bg-white hover:border-[#C65D3B] transition-all text-center flex flex-col items-center justify-center space-y-2.5 shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FDF2EE] text-[#C65D3B] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              💬
            </div>
            <span className="font-bold text-xs text-[#243B53] group-hover:text-[#C65D3B]">
              Enquiries & RFQs
            </span>
          </Link>
        </div>
      </div>

      {/* Orders & Quotes Split Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Wholesale Orders */}
        <div className="card-artisan p-6 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#243B53]">Recent Wholesale Orders</h3>
            <Link
              href="/seller/orders"
              className="text-xs font-bold text-[#C65D3B] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {seller.orders.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500 bg-[#FAF8F3] rounded-xl border border-[#E5DCCD]">
              No orders received yet. Active product listings will receive quotes and orders here.
            </div>
          ) : (
            <div className="space-y-3">
              {seller.orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 rounded-xl border border-[#E5DCCD] bg-[#FAF8F3] flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-bold text-xs text-[#243B53]">{ord.orderNumber}</div>
                    <div className="text-[11px] text-gray-600 line-clamp-1">{ord.product.title}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      Qty: {ord.quantity} • Buyer: {ord.buyer.name}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-xs text-[#C65D3B]">
                      ₹{ord.totalAmount.toLocaleString("en-IN")}
                    </div>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF3EE] text-[#3E6650]">
                      {ord.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Quotes & Buyer RFQs */}
        <div className="card-artisan p-6 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#243B53]">Bulk Enquiries & Quotes</h3>
            <Link
              href="/seller/rfqs"
              className="text-xs font-bold text-[#C65D3B] hover:underline flex items-center gap-1"
            >
              <span>Manage RFQs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {seller.quotes.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500 bg-[#FAF8F3] rounded-xl border border-[#E5DCCD]">
              No active enquiries. Buyers browsing the marketplace can request custom quotes directly from your product pages.
            </div>
          ) : (
            <div className="space-y-3">
              {seller.quotes.map((q) => (
                <div
                  key={q.id}
                  className="p-3.5 rounded-xl border border-[#E5DCCD] bg-[#FAF8F3] flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-bold text-xs text-[#243B53]">
                      RFQ for {q.rfq.product.title}
                    </div>
                    <div className="text-[11px] text-gray-600">
                      Req Qty: {q.rfq.quantity} pcs • Loc: {q.rfq.deliveryLocation}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      Your Quoted Unit Price: ₹{q.unitPrice}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FDF2EE] text-[#C65D3B]">
                      {q.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
