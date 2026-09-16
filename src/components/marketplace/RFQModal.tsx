"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  X,
  Send,
  Calendar,
  MapPin,
  IndianRupee,
  Layers,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface RFQModalProps {
  product: {
    id: string;
    title: string;
    price: number;
    moq: number;
    seller: {
      shopName: string;
    };
  };
  isOpen: boolean;
  onClose: () => void;
}

export function RFQModal({ product, isOpen, onClose }: RFQModalProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [quantity, setQuantity] = useState(product.moq || 10);
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [targetBudget, setTargetBudget] = useState(product.price * (product.moq || 10));
  const [customizationNotes, setCustomizationNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push(`/login?redirect=/marketplace/${product.id}`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/rfqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: Number(quantity),
          deliveryLocation,
          targetDate: targetDate ? new Date(targetDate).toISOString() : new Date(Date.now() + 15 * 86400000).toISOString(),
          targetBudget: Number(targetBudget) || null,
          customizationNotes,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to submit quote request.");
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        router.push("/buyer/dashboard");
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-none animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-[#E5DCCD] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-[#F4EBDD]"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C65D3B]">
            Direct Wholesale Negotiation
          </span>
          <h3 className="text-xl font-bold text-[#243B53]">Request Bulk Quote (RFQ)</h3>
          <p className="text-xs text-[#263238]/70 mt-1">
            Product: <strong>{product.title}</strong> by {product.seller.shopName}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-6 text-center space-y-2 bg-[#EBF3EE] rounded-xl border border-[#3E6650]/20">
            <CheckCircle2 className="w-8 h-8 text-[#3E6650] mx-auto" />
            <h4 className="font-bold text-sm text-[#3E6650]">RFQ Sent to Artisan!</h4>
            <p className="text-xs text-[#263238]/80">
              The weaver/artisan workshop has been alerted. Redirecting to your buyer dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                  Required Quantity (Min {product.moq} pcs) *
                </label>
                <input
                  type="number"
                  min={product.moq || 1}
                  required
                  value={quantity}
                  onChange={(e) => {
                    const q = Number(e.target.value);
                    setQuantity(q);
                    setTargetBudget(q * product.price);
                  }}
                  className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs font-bold text-[#243B53]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                  Target Budget (₹ Total)
                </label>
                <input
                  type="number"
                  value={targetBudget}
                  onChange={(e) => setTargetBudget(Number(e.target.value))}
                  className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs font-bold text-[#243B53]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                Target Delivery Date *
              </label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs text-[#263238]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                Delivery Destination City & State *
              </label>
              <input
                type="text"
                required
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                placeholder="e.g. Hauz Khas Retail Store, New Delhi"
                className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs text-[#263238]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                Customization & Packaging Notes
              </label>
              <textarea
                rows={3}
                value={customizationNotes}
                onChange={(e) => setCustomizationNotes(e.target.value)}
                placeholder="Specify any custom border designs, organic dye preferences, or boutique butter-paper gift packaging requirements..."
                className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl p-2.5 text-xs text-[#263238]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-cta flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? "Submitting RFQ..." : "Submit Wholesale Quote Request"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
