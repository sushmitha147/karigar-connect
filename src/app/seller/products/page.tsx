import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  QrCode,
  ExternalLink,
} from "lucide-react";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SellerProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as any;

  const seller = await prisma.sellerProfile.findFirst({
    where: { userId: user.id },
    include: {
      products: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!seller) {
    redirect("/register/seller");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#243B53]">Artisan Workshop Inventory</h1>
          <p className="text-xs sm:text-sm text-[#263238]/70">
            Manage your live listings, update stock batches, and print provenance story QR codes
          </p>
        </div>

        <Link
          href="/seller/products/new"
          className="btn-cta flex items-center gap-2 text-xs sm:text-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Craft Listing</span>
        </Link>
      </div>

      {seller.products.length === 0 ? (
        <div className="card-artisan p-12 bg-white text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#F4EBDD] text-[#C65D3B] flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-[#243B53]">No Products in Inventory Yet</h2>
          <p className="text-xs text-gray-600 max-w-sm mx-auto">
            Take photos of your craft, speak your description in Telugu or Hindi, and publish in 2 minutes using our 6-step AI Studio wizard.
          </p>
          <Link href="/seller/products/new" className="btn-cta inline-flex items-center gap-2 text-xs">
            <Plus className="w-4 h-4" />
            <span>Create First Product Listing</span>
          </Link>
        </div>
      ) : (
        <div className="card-artisan bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F3] border-b border-[#E5DCCD] text-[#243B53] uppercase font-bold text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Product & Craft</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Wholesale Price</th>
                  <th className="py-3.5 px-4">MOQ</th>
                  <th className="py-3.5 px-4">Current Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DCCD]/60">
                {seller.products.map((p) => {
                  let imgList = ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&q=80"];
                  try {
                    imgList = JSON.parse(p.images);
                  } catch (e) {}

                  const isLowStock = p.stock <= 5;

                  return (
                    <tr key={p.id} className="hover:bg-[#FAF8F3]/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={imgList[0]}
                            alt={p.title}
                            className="w-12 h-12 rounded-xl object-cover border border-[#E5DCCD] shrink-0"
                          />
                          <div>
                            <span className="font-bold text-[#243B53] line-clamp-1 block text-xs">
                              {p.title}
                            </span>
                            <span className="text-[11px] text-gray-500">{p.craftType}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-[#263238]">
                        <span className="px-2 py-0.5 rounded-md bg-[#F4EBDD] text-[#243B53] font-medium">
                          {p.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-[#C65D3B]">
                        ₹{p.price.toLocaleString("en-IN")}
                      </td>

                      <td className="py-3 px-4 text-gray-700 font-semibold">{p.moq} pcs</td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold ${isLowStock ? "text-amber-600" : "text-[#243B53]"}`}>
                            {p.stock} units
                          </span>
                          {isLowStock && (
                            <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              Low
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF3EE] text-[#3E6650]">
                          <CheckCircle2 className="w-3 h-3" />
                          Live Catalog
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/story/${p.id}`}
                            className="p-1.5 rounded-lg text-gray-600 hover:text-[#243B53] hover:bg-[#F4EBDD]"
                            title="View Story & QR Code"
                          >
                            <QrCode className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/marketplace/${p.id}`}
                            className="p-1.5 rounded-lg text-gray-600 hover:text-[#243B53] hover:bg-[#F4EBDD]"
                            title="View on Marketplace"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
