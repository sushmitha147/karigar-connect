import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  Package,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BuyerOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const orders = await prisma.order.findMany({
    where: { buyerId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      product: { include: { seller: true } },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#243B53]">Purchased Orders & Shipments</h1>
          <p className="text-xs sm:text-sm text-[#263238]/70">
            Track wholesale orders, delivery status, and review authentic artisan craftsmanship
          </p>
        </div>

        <Link href="/marketplace" className="btn-cta text-xs py-2 px-3.5 self-start sm:self-auto">
          Browse More Crafts
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="card-artisan p-12 bg-white text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#F4EBDD] text-[#243B53] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-[#243B53]">No Orders Placed Yet</h3>
          <p className="text-xs text-gray-600 max-w-sm mx-auto">
            Start by requesting sample batches or bulk quotes from verified master artisans.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="card-artisan p-6 bg-white border border-[#E5DCCD] space-y-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5DCCD] pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-[#243B53]">{ord.orderNumber}</span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EBF3EE] text-[#3E6650]">
                    Status: {ord.orderStatus}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Purchased on {new Date(ord.createdAt).toLocaleDateString("en-IN")}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-[#243B53]">{ord.product.title}</h4>
                  <div className="text-xs text-gray-600">
                    Artisan Workshop: <strong>{ord.product.seller.shopName}</strong> ({ord.product.seller.state})
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Quantity: {ord.quantity} units • Delivery to: {ord.shippingAddress}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-gray-500 block uppercase font-bold">Total Paid</span>
                  <span className="text-lg font-bold text-[#C65D3B]">
                    ₹{ord.totalAmount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-[#3E6650] block font-bold">
                    {ord.paymentMethod} Verified
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
