import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ShoppingBag,
  FileText,
  Clock,
  Heart,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Building2,
  TrendingUp,
} from "lucide-react";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BuyerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as any;

  // Fetch buyer profile
  const buyer = await prisma.buyerProfile.findFirst({
    where: { userId: user.id },
    include: {
      rfqs: {
        orderBy: { createdAt: "desc" },
        include: {
          product: {
            include: { seller: true },
          },
          quotes: {
            include: { seller: true },
          },
        },
      },
    },
  });

  // Fetch buyer orders
  const orders = await prisma.order.findMany({
    where: { buyerId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        include: { seller: true },
      },
    },
  });

  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const activeRfqsCount = buyer?.rfqs.filter((r) => r.status !== "ACCEPTED").length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Buyer Company Header */}
      <div className="card-artisan p-6 sm:p-8 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#243B53] text-[#FAF8F3] flex items-center justify-center font-bold text-xl shrink-0">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#243B53]">
                {buyer?.companyName || user.name}
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#F0F4F8] text-[#243B53] border border-[#D9E2EC]">
                {buyer?.buyerType || "Wholesale Buyer"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#263238]/70 mt-0.5">
              Contact: {user.name} • {buyer?.city || "India"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/marketplace"
            className="btn-cta flex items-center gap-2 text-sm"
          >
            <Search className="w-4 h-4" />
            <span>Explore Artisan Marketplace</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats: [Products][Orders][Revenue/Spend][Enquiries] */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="card-artisan p-5 bg-white space-y-1">
          <div className="text-xs text-[#263238]/60 font-semibold uppercase">
            Total Orders
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#243B53]">{orders.length}</div>
          <div className="text-[11px] text-[#3E6650] font-medium">B2B Direct Purchase</div>
        </div>

        <div className="card-artisan p-5 bg-white space-y-1">
          <div className="text-xs text-[#263238]/60 font-semibold uppercase">
            Active RFQs
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#C65D3B]">{activeRfqsCount}</div>
          <div className="text-[11px] text-gray-500 font-medium">Wholesale quote requests</div>
        </div>

        <div className="card-artisan p-5 bg-white space-y-1">
          <div className="text-xs text-[#263238]/60 font-semibold uppercase">
            Total Sourced Spend
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#3E6650]">
            ₹{totalSpent.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-gray-500 font-medium">Direct to weaver & artisan</div>
        </div>

        <div className="card-artisan p-5 bg-white space-y-1">
          <div className="text-xs text-[#263238]/60 font-semibold uppercase">
            Artisan Clusters
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#243B53]">3 Clusters</div>
          <div className="text-[11px] text-[#3E6650] font-medium">Pochampally, Etikoppaka, Jaipur</div>
        </div>
      </div>

      {/* RFQ Management & Quotes Section */}
      <div className="card-artisan p-6 bg-white space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#243B53]">Your Bulk Requests for Quote (RFQs)</h2>
            <p className="text-xs text-[#263238]/70">Track seller responses, compare custom offers, and place bulk orders</p>
          </div>
          <Link
            href="/marketplace"
            className="text-xs font-bold text-[#C65D3B] hover:underline flex items-center gap-1"
          >
            <span>Browse Products to Request Quote</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {buyer?.rfqs.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500 bg-[#FAF8F3] rounded-xl border border-[#E5DCCD]">
            You have not submitted any bulk RFQs yet. Navigate to any craft item in the marketplace and click "Request Bulk Quote" to start negotiations.
          </div>
        ) : (
          <div className="space-y-4">
            {buyer?.rfqs.map((rfq) => (
              <div
                key={rfq.id}
                className="p-4 rounded-xl border border-[#E5DCCD] bg-[#FAF8F3] space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-sm text-[#243B53]">
                      {rfq.product.title}
                    </div>
                    <div className="text-xs text-gray-600">
                      Seller: {rfq.product.seller.shopName} ({rfq.product.seller.state})
                    </div>
                  </div>
                  <span className="self-start sm:self-auto text-xs font-bold px-3 py-1 rounded-full bg-[#FDF2EE] text-[#C65D3B]">
                    Status: {rfq.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2 border-t border-[#E5DCCD]/80">
                  <div>
                    <span className="text-gray-500 block text-[10px]">Requested Quantity</span>
                    <span className="font-bold text-[#243B53]">{rfq.quantity} units</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Delivery Location</span>
                    <span className="font-semibold text-[#243B53] truncate block">{rfq.deliveryLocation}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Target Budget</span>
                    <span className="font-semibold text-[#243B53]">
                      {rfq.targetBudget ? `₹${rfq.targetBudget.toLocaleString("en-IN")}` : "Negotiable"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Submitted Date</span>
                    <span className="text-gray-600">{new Date(rfq.createdAt).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>

                {/* Seller Quotes for this RFQ */}
                {rfq.quotes && rfq.quotes.length > 0 && (
                  <div className="mt-3 p-3 rounded-lg bg-white border border-[#E5DCCD] space-y-2">
                    <span className="text-xs font-bold text-[#3E6650] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Artisan Offer Received:
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-sm text-[#243B53]">
                          ₹{rfq.quotes[0].unitPrice} / unit
                        </span>{" "}
                        (Total: ₹{rfq.quotes[0].totalAmount.toLocaleString("en-IN")} incl. shipping)
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Delivery in {rfq.quotes[0].estimatedDeliveryDays} days • Terms: {rfq.quotes[0].terms}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/checkout?productId=${rfq.productId}&qty=${rfq.quantity}&rfqId=${rfq.id}`}
                          className="px-3.5 py-1.5 rounded-lg bg-[#C65D3B] text-white font-bold text-xs hover:bg-[#B24E2E] transition-colors"
                        >
                          Accept & Order
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmed Orders Table */}
      <div className="card-artisan p-6 bg-white space-y-4">
        <h2 className="text-lg font-bold text-[#243B53]">Recent Orders & Shipments</h2>
        {orders.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500 bg-[#FAF8F3] rounded-xl border border-[#E5DCCD]">
            No completed purchases yet.
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-xl border border-[#E5DCCD] bg-[#FAF8F3] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#243B53]">{ord.orderNumber}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF3EE] text-[#3E6650]">
                      {ord.orderStatus}
                    </span>
                  </div>
                  <div className="font-semibold text-sm text-[#243B53] mt-0.5">
                    {ord.product.title}
                  </div>
                  <div className="text-xs text-gray-600">
                    Artisan: {ord.product.seller.shopName} • Qty: {ord.quantity} pcs
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-bold text-sm text-[#C65D3B]">
                    ₹{ord.totalAmount.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Paid via {ord.paymentMethod}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
