"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  CreditCard,
  QrCode,
  Truck,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Package,
} from "lucide-react";
import confetti from "canvas-confetti";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const user = session?.user as any;

  const productId = searchParams.get("productId");
  const qtyParam = Number(searchParams.get("qty")) || 5;
  const rfqId = searchParams.get("rfqId");

  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(qtyParam);
  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "UPI" | "COD">("RAZORPAY");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderComplete, setOrderComplete] = useState<any>(null);

  const [address, setAddress] = useState({
    name: user?.name || "",
    mobile: user?.mobile || "",
    street: "Plot 12, Handloom Emporium Road",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110016",
  });

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/products/${productId}`)
      .then((r) => r.json())
      .then((d) => setProduct(d))
      .catch((e) => console.error(e));
  }, [productId]);

  if (!productId) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#243B53]">No item selected for checkout</h2>
        <Link href="/marketplace" className="btn-cta inline-block text-xs">
          Explore Marketplace
        </Link>
      </div>
    );
  }

  const subtotal = (product?.price || 0) * quantity;
  const shipping = subtotal > 5000 ? 0 : 350;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push(`/login?redirect=/checkout?productId=${productId}&qty=${quantity}`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const fullAddress = `${address.name}, ${address.street}, ${address.city}, ${address.state} - ${address.pincode} (Mobile: ${address.mobile})`;

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity,
          shippingAddress: fullAddress,
          paymentMethod,
          rfqId: rfqId || null,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Order failed");
      }

      const orderData = await res.json();
      setOrderComplete(orderData);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#C65D3B", "#243B53", "#3E6650", "#F4EBDD"],
      });
    } catch (err: any) {
      setError(err.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#EBF3EE] text-[#3E6650] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3E6650]">
            Payment & Order Confirmed
          </span>
          <h1 className="text-2xl font-bold text-[#243B53]">
            Thank You for Empowering Our Artisans!
          </h1>
          <p className="text-xs text-[#263238]/70">
            Order Reference: <strong>{orderComplete.orderNumber}</strong>
          </p>
        </div>

        <div className="card-artisan p-6 bg-white text-left space-y-3 text-xs border border-[#E5DCCD]">
          <div className="flex justify-between border-b border-[#E5DCCD] pb-2">
            <span className="text-gray-500">Item:</span>
            <span className="font-bold text-[#243B53]">{product?.title}</span>
          </div>
          <div className="flex justify-between border-b border-[#E5DCCD] pb-2">
            <span className="text-gray-500">Quantity:</span>
            <span className="font-semibold text-[#243B53]">{orderComplete.quantity} pcs</span>
          </div>
          <div className="flex justify-between border-b border-[#E5DCCD] pb-2">
            <span className="text-gray-500">Total Paid:</span>
            <span className="font-bold text-[#C65D3B]">₹{orderComplete.totalAmount.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Mode:</span>
            <span className="font-semibold text-[#243B53]">{orderComplete.paymentMethod} (Verified)</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/buyer/dashboard"
            className="btn-cta w-full sm:w-auto text-xs py-2.5"
          >
            View in Buyer Dashboard
          </Link>
          <Link
            href="/marketplace"
            className="btn-secondary w-full sm:w-auto text-xs py-2.5"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#243B53]">
          Checkout & Secure Order
        </h1>
        <p className="text-xs text-[#263238]/70 mt-1">
          Direct wholesale purchase with protected artisan escrow payment
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Delivery Address & Payment Options (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Address Card */}
          <div className="card-artisan p-6 bg-white space-y-4 border border-[#E5DCCD]">
            <h2 className="text-sm font-bold text-[#243B53] uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C65D3B]" />
              Shipping Destination
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  Recipient / Contact Name *
                </label>
                <input
                  type="text"
                  required
                  value={address.name}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs text-[#263238]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={address.mobile}
                  onChange={(e) => setAddress({ ...address, mobile: e.target.value })}
                  className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs text-[#263238]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                Street Address / Warehouse Unit *
              </label>
              <input
                type="text"
                required
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs text-[#263238]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs text-[#263238]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs text-[#263238]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs text-[#263238]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="card-artisan p-6 bg-white space-y-4 border border-[#E5DCCD]">
            <h2 className="text-sm font-bold text-[#243B53] uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#C65D3B]" />
              Payment Method (Test Mode Enabled)
            </h2>

            <div className="space-y-2.5">
              {/* Razorpay Test Mode */}
              <label
                onClick={() => setPaymentMethod("RAZORPAY")}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  paymentMethod === "RAZORPAY"
                    ? "bg-[#FDF2EE] border-[#C65D3B] text-[#243B53]"
                    : "bg-[#FAF8F3] border-[#E5DCCD] hover:bg-[#F4EBDD]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "RAZORPAY"}
                    onChange={() => setPaymentMethod("RAZORPAY")}
                    className="text-[#C65D3B] focus:ring-[#C65D3B]"
                  />
                  <div>
                    <span className="font-bold text-xs block">Razorpay B2B (Test Mode)</span>
                    <span className="text-[10px] text-gray-500">Supports Netbanking, Corporate Cards & Escrow</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#243B53] text-white">
                  Instant Test
                </span>
              </label>

              {/* UPI */}
              <label
                onClick={() => setPaymentMethod("UPI")}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  paymentMethod === "UPI"
                    ? "bg-[#FDF2EE] border-[#C65D3B] text-[#243B53]"
                    : "bg-[#FAF8F3] border-[#E5DCCD] hover:bg-[#F4EBDD]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "UPI"}
                    onChange={() => setPaymentMethod("UPI")}
                    className="text-[#C65D3B] focus:ring-[#C65D3B]"
                  />
                  <div>
                    <span className="font-bold text-xs block">UPI Quick Transfer</span>
                    <span className="text-[10px] text-gray-500">GPay, PhonePe, Paytm QR simulation</span>
                  </div>
                </div>
                <QrCode className="w-4 h-4 text-gray-400" />
              </label>

              {/* Cash On Delivery / B2B Net Terms */}
              <label
                onClick={() => setPaymentMethod("COD")}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  paymentMethod === "COD"
                    ? "bg-[#FDF2EE] border-[#C65D3B] text-[#243B53]"
                    : "bg-[#FAF8F3] border-[#E5DCCD] hover:bg-[#F4EBDD]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="text-[#C65D3B] focus:ring-[#C65D3B]"
                  />
                  <div>
                    <span className="font-bold text-xs block">Cash on Delivery / Net 15 Terms</span>
                    <span className="text-[10px] text-gray-500">Pay on physical delivery inspection</span>
                  </div>
                </div>
                <Truck className="w-4 h-4 text-gray-400" />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="card-artisan p-6 bg-white space-y-4 border border-[#E5DCCD] sticky top-24">
            <h2 className="text-sm font-bold text-[#243B53] uppercase tracking-wider">
              Order Summary
            </h2>

            {product && (
              <div className="flex gap-3 pb-4 border-b border-[#E5DCCD]">
                <div className="w-14 h-14 rounded-xl bg-[#F4EBDD] overflow-hidden border border-[#E5DCCD] shrink-0">
                  <img
                    src={JSON.parse(product.images || "[]")[0] || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100&q=80"}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xs text-[#243B53] line-clamp-2">
                    {product.title}
                  </h3>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    {product.seller.shopName}
                  </div>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-700">Quantity (Units):</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(product?.moq || 1, quantity - 1))}
                  className="w-7 h-7 rounded-lg border border-[#E5DCCD] bg-[#FAF8F3] font-bold"
                >
                  -
                </button>
                <span className="font-bold text-sm text-[#243B53] w-6 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-lg border border-[#E5DCCD] bg-[#FAF8F3] font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-2 border-t border-[#E5DCCD] text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({quantity} pcs)</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Direct Artisan Packing & Logistics</span>
                <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#243B53] pt-2 border-t border-[#E5DCCD]">
                <span>Total Amount</span>
                <span className="text-base text-[#C65D3B]">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-cta flex items-center justify-center gap-2 py-3 text-xs font-bold"
            >
              {loading ? "Processing Order..." : `Pay ₹${total.toLocaleString("en-IN")} & Confirm`}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3E6650]" />
              <span>Direct-to-Artisan Fair Trade Guarantee</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading Secure Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
