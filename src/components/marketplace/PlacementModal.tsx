"use client";

import { useState } from "react";
import {
  X,
  Camera,
  Sparkles,
  Sun,
  Ruler,
  Compass,
  Palette,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface PlacementModalProps {
  product: {
    title: string;
    category: string;
    dimensions?: string | null;
    material?: string | null;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function PlacementModal({ product, isOpen, onClose }: PlacementModalProps) {
  const [roomImage, setRoomImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<any>(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = reader.result as string;
      setRoomImage(b64);
      analyzePlacement(b64);
    };
    reader.readAsDataURL(file);
  };

  const analyzePlacement = async (imgBase64: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai/placement-advise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomImage: imgBase64,
          product: {
            title: product.title,
            category: product.category,
            dimensions: product.dimensions,
            material: product.material,
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to analyze room image");

      const data = await res.json();
      setAdvice(data);
    } catch (err: any) {
      setError("AI analysis failed. Showing architectural baseline recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-none animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 border border-[#E5DCCD] shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-[#F4EBDD]"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C65D3B] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            AI Interior Decor & Placement Advisor
          </span>
          <h3 className="text-xl font-bold text-[#243B53]">
            Curate Your Space for {product.title}
          </h3>
          <p className="text-xs text-[#263238]/70 mt-1">
            Upload your living room, foyer, or office wall photo to receive AI-powered museum lighting, height, and Vastu recommendations.
          </p>
        </div>

        {/* Upload Wall Photo Area */}
        {!roomImage ? (
          <label className="border-2 border-dashed border-[#E5DCCD] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-[#FAF8F3] hover:bg-[#F4EBDD]/50 transition-colors space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#F4EBDD] text-[#C65D3B] flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#243B53] block">
                Tap to Take Room Photo or Upload Wall
              </span>
              <span className="text-[11px] text-gray-500">
                Supports camera capture on mobile PWA
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="relative aspect-video rounded-xl overflow-hidden border border-[#E5DCCD]">
            <img src={roomImage} alt="Uploaded Room" className="w-full h-full object-cover" />
            <label className="absolute bottom-2 right-2 px-3 py-1.5 bg-black/70 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-black">
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        )}

        {loading && (
          <div className="p-6 bg-[#FAF8F3] rounded-xl text-center space-y-2">
            <div className="w-8 h-8 rounded-full border-4 border-[#C65D3B] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-bold text-[#243B53]">
              Analyzing room sightlines, wall reflectance & Vastu cardinal orientation...
            </p>
          </div>
        )}

        {advice && (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-[#F4EBDD] border border-[#E5DCCD] text-xs text-[#263238] space-y-2">
              <span className="font-bold text-[#243B53] block text-sm">
                Stylist Summary:
              </span>
              <p className="leading-relaxed">{advice.summary}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#FAF8F3] rounded-xl border border-[#E5DCCD] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#243B53]">
                  <Ruler className="w-4 h-4 text-[#C65D3B]" />
                  <span>Hanging Height</span>
                </div>
                <p className="text-gray-700">{advice.eyeLevelHeight}</p>
              </div>

              <div className="p-3 bg-[#FAF8F3] rounded-xl border border-[#E5DCCD] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#243B53]">
                  <Compass className="w-4 h-4 text-[#3E6650]" />
                  <span>Vastu Shastra Alignment</span>
                </div>
                <p className="text-gray-700">{advice.vastuOrientation}</p>
              </div>

              <div className="p-3 bg-[#FAF8F3] rounded-xl border border-[#E5DCCD] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#243B53]">
                  <Sun className="w-4 h-4 text-amber-600" />
                  <span>Museum Lighting</span>
                </div>
                <p className="text-gray-700">{advice.lighting?.colorTemp} • {advice.lighting?.lux}</p>
              </div>

              <div className="p-3 bg-[#FAF8F3] rounded-xl border border-[#E5DCCD] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#243B53]">
                  <Palette className="w-4 h-4 text-[#243B53]" />
                  <span>Framing Suggestion</span>
                </div>
                <p className="text-gray-700">{advice.framingAdvice}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
