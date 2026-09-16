"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Award,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  FileText,
  IndianRupee,
  ShieldCheck,
  Filter,
} from "lucide-react";
import { GOVT_SCHEMES, matchGovtSchemes } from "@/lib/schemes-data";

export default function GovtSchemesPage() {
  const { data: session } = useSession();
  const user = session?.user as any;

  const [selectedCraft, setSelectedCraft] = useState<string>("Handloom");
  const [selectedState, setSelectedState] = useState<string>("Telangana");

  const matchedSchemes = matchGovtSchemes(selectedCraft, selectedCraft, selectedState);

  const crafts = [
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
    "Tamil Nadu",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="card-artisan p-6 sm:p-8 bg-[#243B53] text-[#FAF8F3] space-y-3 shadow-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#334E68] text-[#F4EBDD] text-xs font-bold">
          <Award className="w-3.5 h-3.5 text-[#C65D3B]" />
          <span>Government Welfare & Financial Empowerment</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Artisan Govt Scheme Matcher
        </h1>
        <p className="text-xs sm:text-sm text-[#F4EBDD]/80 max-w-2xl leading-relaxed">
          Instantly check your eligibility for subsidized loans, toolkit grants, skill stipends, and ODOP export support based on your registered craft trade.
        </p>
      </div>

      {/* Craft & Location Match Filter */}
      <div className="card-artisan p-5 bg-white border border-[#E5DCCD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#243B53] uppercase">
          <Filter className="w-4 h-4 text-[#C65D3B]" />
          <span>Select Your Craft Profile:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCraft}
            onChange={(e) => setSelectedCraft(e.target.value)}
            className="bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3.5 py-2 text-xs font-semibold text-[#243B53] focus:outline-none"
          >
            {crafts.map((c) => (
              <option key={c} value={c}>
                Craft: {c}
              </option>
            ))}
          </select>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3.5 py-2 text-xs font-semibold text-[#243B53] focus:outline-none"
          >
            {states.map((s) => (
              <option key={s} value={s}>
                State: {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#243B53]">
            Matched Eligible Schemes ({matchedSchemes.length})
          </h2>
          <span className="text-xs font-bold text-[#3E6650] flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            100% Direct Central & State Benefits
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matchedSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="card-artisan p-6 bg-white border border-[#E5DCCD] flex flex-col justify-between space-y-5 hover:shadow-artisan-hover transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C65D3B] bg-[#FDF2EE] px-2.5 py-0.5 rounded-full border border-[#E8B2A0]">
                      {scheme.badge}
                    </span>
                    <h3 className="text-lg font-bold text-[#243B53] mt-1.5">
                      {scheme.name}
                    </h3>
                    <div className="text-xs text-[#263238]/60 font-hindi mt-0.5">
                      {scheme.hindiName} • {scheme.teluguName}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#263238]/80 leading-relaxed">
                  {scheme.description}
                </p>

                {/* Key Benefits List */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-[#243B53] uppercase block">
                    Financial & Practical Benefits:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#263238]/85">
                    {scheme.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#3E6650] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Required Documents */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                    Documentation Needed:
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    {scheme.requiredDocs.map((doc, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-[#FAF8F3] border border-[#E5DCCD] text-gray-700"
                      >
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Official Link Button */}
              <div className="pt-4 border-t border-[#EAE3D2] flex items-center justify-between">
                <span className="text-[11px] text-gray-500 font-medium">
                  {scheme.ministry}
                </span>

                <a
                  href={scheme.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cta text-xs py-2 px-3.5 inline-flex items-center gap-1.5 shadow-sm"
                >
                  <span>Apply on Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
