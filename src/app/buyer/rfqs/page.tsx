import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BuyerRfqsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const buyer = await prisma.buyerProfile.findFirst({
    where: { userId: user.id },
    include: {
      rfqs: {
        orderBy: { createdAt: "desc" },
        include: {
          product: { include: { seller: true } },
          quotes: { include: { seller: true } },
        },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#243B53]">Your Wholesale RFQs & Quotes</h1>
          <p className="text-xs sm:text-sm text-[#263238]/70">
            Compare quotes from master artisans, accept proposals, and order bulk inventory
          </p>
        </div>

        <Link href="/marketplace" className="btn-cta text-xs py-2 px-3.5 self-start sm:self-auto">
          Explore Marketplace to Request Quotes
        </Link>
      </div>

      {buyer?.rfqs.length === 0 ? (
        <div className="card-artisan p-12 bg-white text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#F4EBDD] text-[#243B53] flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-[#243B53]">No RFQs Created</h3>
          <p className="text-xs text-gray-600 max-w-sm mx-auto">
            Browse our artisan catalog and click "Request Bulk Quote" to negotiate wholesale rates.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {buyer?.rfqs.map((rfq) => (
            <div
              key={rfq.id}
              className="card-artisan p-6 bg-white border border-[#E5DCCD] space-y-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5DCCD] pb-3">
                <div>
                  <h3 className="font-bold text-base text-[#243B53]">
                    {rfq.product.title}
                  </h3>
                  <div className="text-xs text-gray-500">
                    Artisan Workshop: {rfq.product.seller.shopName} ({rfq.product.seller.district}, {rfq.product.seller.state})
                  </div>
                </div>

                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FDF2EE] text-[#C65D3B] self-start sm:self-auto">
                  Status: {rfq.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#FAF8F3] p-4 rounded-xl border border-[#E5DCCD]">
                <div>
                  <span className="text-gray-500 block text-[10px]">Requested Quantity</span>
                  <span className="font-bold text-[#243B53]">{rfq.quantity} units</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Destination</span>
                  <span className="font-semibold text-[#243B53] truncate block">{rfq.deliveryLocation}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Target Date</span>
                  <span className="font-semibold text-[#243B53]">
                    {new Date(rfq.targetDate).toLocaleDateString("en-IN")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Budget</span>
                  <span className="font-semibold text-[#243B53]">
                    {rfq.targetBudget ? `₹${rfq.targetBudget.toLocaleString("en-IN")}` : "Flexible"}
                  </span>
                </div>
              </div>

              {rfq.quotes && rfq.quotes.length > 0 && (
                <div className="p-4 rounded-xl bg-[#EBF3EE] border border-[#3E6650]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-[#3E6650] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Quote from Artisan: ₹{rfq.quotes[0].unitPrice} / unit
                    </div>
                    <div className="text-gray-600 mt-0.5">
                      Total: ₹{rfq.quotes[0].totalAmount.toLocaleString("en-IN")} (incl. packing & shipping) • Dispatch in {rfq.quotes[0].estimatedDeliveryDays} days
                    </div>
                  </div>

                  <Link
                    href={`/checkout?productId=${rfq.productId}&qty=${rfq.quantity}&rfqId=${rfq.id}`}
                    className="btn-cta text-xs py-2 px-4 whitespace-nowrap self-start sm:self-auto"
                  >
                    Accept & Purchase
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
