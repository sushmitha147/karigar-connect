"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  MessageSquare,
  Send,
  Calendar,
  MapPin,
  IndianRupee,
  CheckCircle2,
  Clock,
  ChevronRight,
  AlertCircle,
  Truck,
} from "lucide-react";

export default function SellerRfqsPage() {
  const { data: session } = useSession();
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReplyRfqId, setActiveReplyRfqId] = useState<string | null>(null);

  // Quote reply form state
  const [quoteForm, setQuoteForm] = useState({
    unitPrice: "",
    shippingCost: "500",
    estimatedDeliveryDays: "15",
    terms: "Handwoven with natural dyes. Standard 50% advance before warp preparation.",
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchRfqs = async () => {
    try {
      const res = await fetch("/api/rfqs");
      const data = await res.json();
      setRfqs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRfqs();
  }, []);

  const handleSendQuote = async (rfqId: string) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rfqId,
          unitPrice: Number(quoteForm.unitPrice),
          shippingCost: Number(quoteForm.shippingCost),
          estimatedDeliveryDays: Number(quoteForm.estimatedDeliveryDays),
          terms: quoteForm.terms,
        }),
      });

      if (!res.ok) throw new Error("Failed to send quote");

      setSuccessMsg("Quote sent successfully to buyer!");
      setActiveReplyRfqId(null);
      fetchRfqs();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#243B53]">
          Buyer Enquiries & Bulk RFQs
        </h1>
        <p className="text-xs sm:text-sm text-[#263238]/70">
          Review bulk requests from verified boutiques and corporate buyers, and send your custom pricing
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-[#EBF3EE] border border-[#3E6650]/30 text-[#3E6650] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-gray-500">
          Loading bulk enquiries...
        </div>
      ) : rfqs.length === 0 ? (
        <div className="card-artisan p-12 bg-white text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#F4EBDD] text-[#C65D3B] flex items-center justify-center mx-auto">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-[#243B53]">No Pending Enquiries</h3>
          <p className="text-xs text-gray-600 max-w-sm mx-auto">
            When buyers click "Request Bulk Quote" on your products, their requests will appear here for you to price and reply.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rfqs.map((rfq) => (
            <div
              key={rfq.id}
              className="card-artisan p-6 bg-white border border-[#E5DCCD] space-y-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5DCCD] pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C65D3B]">
                    Enquiry for:
                  </span>
                  <h3 className="font-bold text-base text-[#243B53]">
                    {rfq.product.title}
                  </h3>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Buyer: {rfq.buyer.companyName || rfq.buyer.user?.name} ({rfq.buyer.buyerType})
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[#FDF2EE] text-[#C65D3B]">
                    Status: {rfq.status}
                  </span>
                </div>
              </div>

              {/* RFQ Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#FAF8F3] p-4 rounded-xl border border-[#E5DCCD]">
                <div>
                  <span className="text-gray-500 block text-[10px]">Requested Quantity</span>
                  <span className="font-bold text-[#243B53] text-sm">{rfq.quantity} units</span>
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
                  <span className="text-gray-500 block text-[10px]">Buyer Budget</span>
                  <span className="font-semibold text-[#243B53]">
                    {rfq.targetBudget ? `₹${rfq.targetBudget.toLocaleString("en-IN")}` : "Flexible"}
                  </span>
                </div>
              </div>

              {rfq.customizationNotes && (
                <div className="text-xs text-[#263238]/85 p-3 rounded-lg bg-white border border-[#E5DCCD]">
                  <strong>Buyer Notes:</strong> {rfq.customizationNotes}
                </div>
              )}

              {/* Already Quoted section */}
              {rfq.quotes && rfq.quotes.length > 0 && (
                <div className="p-3 rounded-xl bg-[#EBF3EE] border border-[#3E6650]/20 space-y-1 text-xs">
                  <span className="font-bold text-[#3E6650] block">Your Submitted Quote:</span>
                  <p>
                    ₹{rfq.quotes[0].unitPrice} / unit • Total: ₹{rfq.quotes[0].totalAmount.toLocaleString("en-IN")} • Dispatch in {rfq.quotes[0].estimatedDeliveryDays} days
                  </p>
                  <p className="text-[11px] text-gray-600">Terms: {rfq.quotes[0].terms}</p>
                </div>
              )}

              {/* Reply Form Trigger */}
              {rfq.status === "PENDING" && (
                <div>
                  {activeReplyRfqId !== rfq.id ? (
                    <button
                      onClick={() => {
                        setActiveReplyRfqId(rfq.id);
                        setQuoteForm({
                          ...quoteForm,
                          unitPrice: (rfq.product.price * 0.95).toString(), // Default 5% wholesale bulk discount
                        });
                      }}
                      className="btn-cta text-xs py-2 px-4 flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply with Custom Quote</span>
                    </button>
                  ) : (
                    <div className="p-4 rounded-xl bg-[#F4EBDD] border border-[#E5DCCD] space-y-3">
                      <h4 className="font-bold text-xs text-[#243B53] uppercase tracking-wider">
                        Send Custom Quote to Buyer
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-[#243B53] uppercase mb-1">
                            Unit Price (₹) *
                          </label>
                          <input
                            type="number"
                            required
                            value={quoteForm.unitPrice}
                            onChange={(e) => setQuoteForm({ ...quoteForm, unitPrice: e.target.value })}
                            className="w-full bg-white border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs font-bold text-[#243B53]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[#243B53] uppercase mb-1">
                            Shipping Cost (₹)
                          </label>
                          <input
                            type="number"
                            value={quoteForm.shippingCost}
                            onChange={(e) => setQuoteForm({ ...quoteForm, shippingCost: e.target.value })}
                            className="w-full bg-white border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs font-bold text-[#243B53]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[#243B53] uppercase mb-1">
                            Est. Production Days
                          </label>
                          <input
                            type="number"
                            value={quoteForm.estimatedDeliveryDays}
                            onChange={(e) => setQuoteForm({ ...quoteForm, estimatedDeliveryDays: e.target.value })}
                            className="w-full bg-white border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs font-bold text-[#243B53]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#243B53] uppercase mb-1">
                          Payment & Production Terms
                        </label>
                        <input
                          type="text"
                          value={quoteForm.terms}
                          onChange={(e) => setQuoteForm({ ...quoteForm, terms: e.target.value })}
                          className="w-full bg-white border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs text-[#263238]"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleSendQuote(rfq.id)}
                          disabled={submitting || !quoteForm.unitPrice}
                          className="btn-cta text-xs py-2 px-4 flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{submitting ? "Sending..." : "Submit Quote to Buyer"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveReplyRfqId(null)}
                          className="btn-secondary text-xs py-2 px-3"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
