"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Phone,
  ArrowRight,
  AlertCircle,
  Store,
  Briefcase,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        identifier,
        password,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        // Successful login: refresh session and redirect
        router.refresh();
        router.push("/");
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleQuickLogin = async (id: string, pass: string) => {
    setIdentifier(id);
    setPassword(pass);
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        identifier: id,
        password: pass,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.refresh();
        router.push("/");
      }
    } catch (err: any) {
      setError("Quick login failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#243B53] text-[#FAF8F3] flex items-center justify-center mx-auto text-xl font-bold">
            क
          </div>
          <h1 className="text-2xl font-bold text-[#243B53]">Welcome Back</h1>
          <p className="text-xs text-[#263238]/70">
            Sign in to manage your workshop orders or wholesale RFQs
          </p>
        </div>

        {/* Login Form */}
        <div className="card-artisan p-6 sm:p-8 bg-white space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#243B53] uppercase mb-1.5">
                Mobile Number or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. 9876543210 or seller@karigar.com"
                  className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3.5 py-2.5 text-sm text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#243B53] uppercase">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3.5 py-2.5 text-sm text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-cta flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 1-Click Quick Demo Accounts */}
          <div className="pt-4 border-t border-[#EAE3D2] space-y-3">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 text-center">
              Quick Test Demo Access
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("9876543210", "Seller@123")}
                className="p-2 rounded-xl bg-[#F4EBDD] hover:bg-[#EAE0CD] border border-[#E5DCCD] text-left transition-colors group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#243B53]">
                  <Store className="w-3.5 h-3.5 text-[#C65D3B]" />
                  <span>Artisan</span>
                </div>
                <div className="text-[10px] text-gray-600 truncate">Lakshmi Handlooms</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("9876543211", "Buyer@123")}
                className="p-2 rounded-xl bg-[#F4EBDD] hover:bg-[#EAE0CD] border border-[#E5DCCD] text-left transition-colors group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#243B53]">
                  <Briefcase className="w-3.5 h-3.5 text-[#243B53]" />
                  <span>Buyer</span>
                </div>
                <div className="text-[10px] text-gray-600 truncate">Virasat Boutique</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("9876543212", "Admin@123")}
                className="p-2 rounded-xl bg-[#F4EBDD] hover:bg-[#EAE0CD] border border-[#E5DCCD] text-left transition-colors group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#243B53]">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Admin</span>
                </div>
                <div className="text-[10px] text-gray-600 truncate">Platform Ops</div>
              </button>
            </div>
          </div>
        </div>

        {/* Register Links */}
        <div className="text-center text-xs text-[#263238]/80 space-y-1">
          <p>
            Don't have an account yet?{" "}
            <Link href="/register/seller" className="font-bold text-[#C65D3B] hover:underline">
              Join as Artisan
            </Link>{" "}
            or{" "}
            <Link href="/register/buyer" className="font-bold text-[#243B53] hover:underline">
              Join as Buyer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
