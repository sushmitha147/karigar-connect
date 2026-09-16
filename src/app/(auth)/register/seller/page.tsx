"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Store,
  Sparkles,
  ShieldCheck,
  Globe,
} from "lucide-react";

export default function SellerRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal & Auth
    name: "",
    mobile: "",
    language: "te", // Default Telugu as requested for local artisans
    password: "",
    confirmPassword: "",

    // Step 2: Workshop & Craft Details
    shopName: "",
    craftType: "Pochampally Ikat",
    category: "Handloom",
    state: "Telangana",
    district: "Yadadri Bhuvanagiri",
    experienceYears: "15",
    capacityPerMonth: "50",

    // Step 3: Legal & IDs (Optional)
    gstin: "",
    udyamNo: "",
    panNo: "",
  });

  const categories = [
    "Handloom",
    "Pottery",
    "Woodcraft",
    "Metalcraft",
    "Leathercraft",
    "Art & Painting",
  ];

  const states = [
    "Telangana",
    "Andhra Pradesh",
    "Rajasthan",
    "Chhattisgarh",
    "Uttar Pradesh",
    "Gujarat",
    "Odisha",
    "West Bengal",
    "Tamil Nadu",
    "Karnataka",
  ];

  const updateField = (field: string, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (step === 1) {
      if (!formData.name || !formData.mobile || !formData.password) {
        setError("Please fill in your name, mobile, and password.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (formData.mobile.length < 10) {
        setError("Please enter a valid 10-digit mobile number.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.shopName || !formData.craftType || !formData.district) {
        setError("Please provide your workshop name, craft type, and district.");
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async (skipOptional = false) => {
    setError("");
    setLoading(true);

    const payload = {
      ...formData,
      gstin: skipOptional ? null : formData.gstin,
      udyamNo: skipOptional ? null : formData.udyamNo,
      panNo: skipOptional ? null : formData.panNo,
    };

    try {
      const res = await fetch("/api/auth/seller/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      // Automatically sign in upon registration
      const signinRes = await signIn("credentials", {
        redirect: false,
        identifier: formData.mobile,
        password: formData.password,
      });

      if (signinRes?.error) {
        router.push("/login");
      } else {
        router.refresh();
        router.push("/seller/dashboard");
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      {/* Title & Badge */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4EBDD] text-[#243B53] text-xs font-bold border border-[#E5DCCD]">
          <Store className="w-3.5 h-3.5 text-[#C65D3B]" />
          <span>Artisan & Weaver Onboarding</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#243B53]">
          Register Your Craft Workshop
        </h1>
        <p className="text-xs sm:text-sm text-[#263238]/70">
          Step {step} of 3 • Reach verified bulk buyers directly with zero middleman fee
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-bold text-[#243B53] mb-2 px-1">
          <span className={step >= 1 ? "text-[#C65D3B]" : ""}>1. Personal Info</span>
          <span className={step >= 2 ? "text-[#C65D3B]" : ""}>2. Craft Workshop</span>
          <span className={step >= 3 ? "text-[#C65D3B]" : ""}>3. Business IDs</span>
        </div>
        <div className="h-2 w-full bg-[#E5DCCD] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C65D3B] transition-all duration-300 rounded-full"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Card Container */}
      <div className="card-artisan p-6 sm:p-8 bg-white shadow-sm space-y-6">
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Personal & Language */}
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                Full Name / Head Weaver Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g. Lakshmi Devamma or Ramesh Sonkar"
                className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3.5 py-2.5 text-sm text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                Mobile Number (Used for Login & WhatsApp inquiries) *
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2.5 bg-[#F4EBDD] border border-r-0 border-[#E5DCCD] rounded-l-xl text-xs font-bold text-[#243B53]">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={formData.mobile}
                  onChange={(e) => updateField("mobile", e.target.value.replace(/\D/g, ""))}
                  placeholder="9876543210"
                  className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-r-xl px-3.5 py-2.5 text-sm text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                Primary Spoken Language (For Voice Assistant) *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { code: "te", label: "Telugu (తెలుగు)" },
                  { code: "hi", label: "Hindi (हिन्दी)" },
                  { code: "en", label: "English" },
                  { code: "ta", label: "Tamil (தமிழ்)" },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => updateField("language", lang.code)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                      formData.language === lang.code
                        ? "bg-[#243B53] text-[#FAF8F3] border-[#243B53]"
                        : "bg-[#FAF8F3] text-[#263238] border-[#E5DCCD] hover:bg-[#F4EBDD]"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                  Password *
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
              <div>
                <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3.5 py-2.5 text-sm text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-cta flex items-center justify-center gap-2 mt-4"
            >
              <span>Continue to Workshop Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Workshop & Craft Details */}
        {step === 2 && (
          <form onSubmit={handleNext} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                Workshop / Shop / Loom Name *
              </label>
              <input
                type="text"
                required
                value={formData.shopName}
                onChange={(e) => updateField("shopName", e.target.value)}
                placeholder="e.g. Lakshmi Heritage Handlooms or Krishna Terracotta Studio"
                className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3.5 py-2.5 text-sm text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                  Craft Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3.5 py-2.5 text-sm text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                  Specific Craft Type *
                </label>
                <input
                  type="text"
                  required
                  value={formData.craftType}
                  onChange={(e) => updateField("craftType", e.target.value)}
                  placeholder="e.g. Pochampally Ikat, Etikoppaka Toys, Dhokra"
                  className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3.5 py-2.5 text-sm text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                  State *
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3.5 py-2.5 text-sm text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
                >
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                  District / Craft Cluster *
                </label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) => updateField("district", e.target.value)}
                  placeholder="e.g. Yadadri Bhuvanagiri or Visakhapatnam"
                  className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3.5 py-2.5 text-sm text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.experienceYears}
                  onChange={(e) => updateField("experienceYears", e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3.5 py-2.5 text-sm text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                  Monthly Capacity (Units / Month)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.capacityPerMonth}
                  onChange={(e) => updateField("capacityPerMonth", e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3.5 py-2.5 text-sm text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-secondary flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="flex-1 btn-cta flex items-center justify-center gap-2"
              >
                <span>Continue to Business IDs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Business IDs (Optional + Skip) */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="p-3.5 rounded-xl bg-[#F4EBDD] border border-[#E5DCCD] text-xs text-[#263238]/80 leading-relaxed">
              <span className="font-bold text-[#243B53]">Optional Step:</span> If you have GSTIN, Udyam Registration, or PAN, you can provide them now to gain a <strong>Verified Artisan Badge</strong>. You can also skip this and provide them later.
            </div>

            <div>
              <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                GSTIN (Optional)
              </label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) => updateField("gstin", e.target.value)}
                placeholder="e.g. 36ABCDE1234F1Z5"
                className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3.5 py-2.5 text-sm text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                Udyam Registration Number (Optional)
              </label>
              <input
                type="text"
                value={formData.udyamNo}
                onChange={(e) => updateField("udyamNo", e.target.value)}
                placeholder="e.g. UDYAM-TS-01-0012345"
                className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3.5 py-2.5 text-sm text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                PAN Number (Optional)
              </label>
              <input
                type="text"
                value={formData.panNo}
                onChange={(e) => updateField("panNo", e.target.value)}
                placeholder="e.g. ABCDE1234F"
                className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3.5 py-2.5 text-sm text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={loading}
                className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-3 rounded-xl border border-[#C65D3B] text-[#C65D3B] font-bold text-sm hover:bg-[#FDF2EE] transition-colors"
              >
                Skip for Now
              </button>

              <button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={loading}
                className="flex-1 w-full btn-cta flex items-center justify-center gap-2"
              >
                {loading ? "Registering..." : "Complete Registration"}
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer link */}
      <div className="text-center mt-6 text-xs text-[#263238]/70">
        Already registered?{" "}
        <Link href="/login" className="font-bold text-[#C65D3B] hover:underline">
          Sign In here
        </Link>
      </div>
    </div>
  );
}
