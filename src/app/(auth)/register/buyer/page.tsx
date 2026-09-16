"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import {
  Briefcase,
  ArrowRight,
  AlertCircle,
  Building2,
  CheckCircle2,
} from "lucide-react";

export default function BuyerRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    mobile: "",
    email: "",
    password: "",
    buyerType: "Boutique", // Retailer, Wholesaler, Boutique, Exporter, Corporate, Govt
    city: "",
    state: "",
    gstin: "",
  });

  const buyerTypes = [
    "Retailer",
    "Wholesaler",
    "Boutique",
    "Exporter",
    "Corporate",
    "Govt",
  ];

  const updateField = (field: string, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/buyer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Buyer registration failed.");
        setLoading(false);
        return;
      }

      // Auto sign-in
      const signinRes = await signIn("credentials", {
        redirect: false,
        identifier: formData.email,
        password: formData.password,
      });

      if (signinRes?.error) {
        router.push("/login");
      } else {
        router.refresh();
        router.push("/buyer/dashboard");
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto">
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F4F8] text-[#243B53] text-xs font-bold border border-[#D9E2EC]">
          <Briefcase className="w-3.5 h-3.5 text-[#243B53]" />
          <span>B2B Wholesale Buyer Access</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#243B53]">
          Register Buyer Account
        </h1>
        <p className="text-xs sm:text-sm text-[#263238]/70">
          Source direct from authentic GI-tagged artisan craft clusters across India
        </p>
      </div>

      <div className="card-artisan p-6 sm:p-8 bg-white shadow-sm space-y-6">
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
              Contact Person Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="e.g. Rohit Verma"
              className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3.5 py-2.5 text-sm text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
              Company / Business Name *
            </label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => updateField("companyName", e.target.value)}
              placeholder="e.g. Virasat Luxury Boutiques"
              className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3.5 py-2.5 text-sm text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
              Buyer Classification Type *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {buyerTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateField("buyerType", type)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                    formData.buyerType === type
                      ? "bg-[#243B53] text-white border-[#243B53]"
                      : "bg-[#FAF8F3] text-[#263238] border-[#E5DCCD] hover:bg-[#F4EBDD]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                Official Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="buyer@company.com"
                className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3.5 py-2.5 text-sm text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={formData.mobile}
                onChange={(e) => updateField("mobile", e.target.value.replace(/\D/g, ""))}
                placeholder="9876543211"
                className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3.5 py-2.5 text-sm text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
              Account Password *
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              placeholder="At least 6 characters"
              className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3.5 py-2.5 text-sm text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                City (Optional)
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="e.g. New Delhi or Mumbai"
                className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3.5 py-2.5 text-sm text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                GSTIN (Optional)
              </label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) => updateField("gstin", e.target.value)}
                placeholder="e.g. 07AAAAA0000A1Z5"
                className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3.5 py-2.5 text-sm text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-cta flex items-center justify-center gap-2 mt-6"
          >
            {loading ? "Creating Account..." : "Complete Buyer Registration"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="text-center mt-6 text-xs text-[#263238]/70">
        Already have a buyer account?{" "}
        <Link href="/login" className="font-bold text-[#243B53] hover:underline">
          Sign In here
        </Link>
      </div>
    </div>
  );
}
