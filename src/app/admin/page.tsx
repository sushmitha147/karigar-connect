"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Store,
  Briefcase,
  Package,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  XCircle,
  Clock,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [sellers, setSellers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const user = session?.user as any;

  const loadData = async () => {
    try {
      const [prodRes, ordRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders"),
      ]);

      const prods = await prodRes.json();
      const ords = await ordRes.json();

      setProducts(Array.isArray(prods) ? prods : []);
      setOrders(Array.isArray(ords) ? ords : []);

      // Extract unique sellers from products
      const sellerMap = new Map();
      prods.forEach((p: any) => {
        if (p.seller && !sellerMap.has(p.seller.id)) {
          sellerMap.set(p.seller.id, p.seller);
        }
      });
      setSellers(Array.from(sellerMap.values()));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleVerifySeller = async (sellerId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId,
          isVerified: !currentStatus,
        }),
      });
      if (res.ok) {
        setSellers((prev) =>
          prev.map((s) => (s.id === sellerId ? { ...s, isVerified: !currentStatus } : s))
        );
      }
    } catch (e) {
      alert("Failed to update status");
    }
  };

  const toggleFlagProduct = async (productId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          isFlagged: !currentStatus,
        }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, isFlagged: !currentStatus } : p))
        );
      }
    } catch (e) {
      alert("Failed to flag product");
    }
  };

  const totalGmv = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const unverifiedCount = sellers.filter((s) => !s.isVerified).length;
  const flaggedCount = products.filter((p) => p.isFlagged).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="card-artisan p-6 sm:p-8 bg-[#243B53] text-[#FAF8F3] space-y-2 shadow-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Platform Operations & Artisan Governance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Karigar Connect Admin Console
        </h1>
        <p className="text-xs sm:text-sm text-[#F4EBDD]/80">
          National artisan cluster verification, buyer compliance, and transaction oversight
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="card-artisan p-5 bg-white space-y-1">
          <div className="text-xs text-gray-500 font-semibold uppercase">Total Sellers</div>
          <div className="text-2xl sm:text-3xl font-bold text-[#243B53]">{sellers.length}</div>
          <div className="text-[11px] text-[#3E6650] font-medium">
            {sellers.length - unverifiedCount} verified artisans
          </div>
        </div>

        <div className="card-artisan p-5 bg-white space-y-1">
          <div className="text-xs text-gray-500 font-semibold uppercase">Pending Verification</div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-600">{unverifiedCount}</div>
          <div className="text-[11px] text-gray-500 font-medium">Requires Udyam/GI check</div>
        </div>

        <div className="card-artisan p-5 bg-white space-y-1">
          <div className="text-xs text-gray-500 font-semibold uppercase">Platform GMV</div>
          <div className="text-2xl sm:text-3xl font-bold text-[#3E6650]">
            ₹{totalGmv.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-gray-500 font-medium">Across {orders.length} orders</div>
        </div>

        <div className="card-artisan p-5 bg-white space-y-1">
          <div className="text-xs text-gray-500 font-semibold uppercase">Flagged Listings</div>
          <div className="text-2xl sm:text-3xl font-bold text-[#C65D3B]">{flaggedCount}</div>
          <div className="text-[11px] text-gray-500 font-medium">Non-handmade or dispute</div>
        </div>
      </div>

      {/* Artisans Verification Table */}
      <div className="card-artisan p-6 bg-white space-y-4 border border-[#E5DCCD] shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#243B53]">Artisan Workshop Verification</h2>
            <p className="text-xs text-gray-500">Grant or revoke verified artisan credentials</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F3] border-b border-[#E5DCCD] text-[#243B53] uppercase font-bold text-[11px]">
              <tr>
                <th className="py-3 px-4">Workshop Name</th>
                <th className="py-3 px-4">Craft Type</th>
                <th className="py-3 px-4">Cluster / State</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DCCD]/60">
              {sellers.map((s) => (
                <tr key={s.id} className="hover:bg-[#FAF8F3]/60">
                  <td className="py-3 px-4 font-bold text-[#243B53]">{s.shopName}</td>
                  <td className="py-3 px-4 text-gray-700">{s.craftType}</td>
                  <td className="py-3 px-4 text-gray-600">{s.district}, {s.state}</td>
                  <td className="py-3 px-4">{s.experienceYears} Years</td>
                  <td className="py-3 px-4">
                    {s.isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF3EE] text-[#3E6650]">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toggleVerifySeller(s.id, s.isVerified)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        s.isVerified
                          ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                          : "bg-[#3E6650] text-white hover:bg-[#2A4536]"
                      }`}
                    >
                      {s.isVerified ? "Revoke Badge" : "Approve & Verify"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Catalog Moderation Table */}
      <div className="card-artisan p-6 bg-white space-y-4 border border-[#E5DCCD] shadow-sm">
        <h2 className="text-lg font-bold text-[#243B53]">Product Catalog Moderation</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F3] border-b border-[#E5DCCD] text-[#243B53] uppercase font-bold text-[11px]">
              <tr>
                <th className="py-3 px-4">Product Title</th>
                <th className="py-3 px-4">Workshop</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">GI Tagged</th>
                <th className="py-3 px-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DCCD]/60">
              {products.slice(0, 8).map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF8F3]/60">
                  <td className="py-3 px-4 font-bold text-[#243B53] max-w-[200px] truncate">{p.title}</td>
                  <td className="py-3 px-4 text-gray-600">{p.seller?.shopName}</td>
                  <td className="py-3 px-4 font-bold text-[#C65D3B]">₹{p.price}</td>
                  <td className="py-3 px-4">{p.stock} units</td>
                  <td className="py-3 px-4">
                    {p.isGiTagged ? (
                      <span className="text-[10px] font-bold text-[#3E6650]">Yes (GI)</span>
                    ) : (
                      <span className="text-[10px] text-gray-500">Standard</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toggleFlagProduct(p.id, p.isFlagged)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        p.isFlagged
                          ? "bg-[#3E6650] text-white"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                      }`}
                    >
                      {p.isFlagged ? "Unflag Listing" : "Flag Listing"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
