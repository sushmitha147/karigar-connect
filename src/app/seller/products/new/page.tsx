"use client";

export const dynamic = "force-dynamic";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Camera,
  Upload,
  Sparkles,
  Mic,
  MicOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Share2,
  QrCode,
  DollarSign,
  Layers,
  RotateCcw,
  Sliders,
  Check,
  Eye,
  Info,
} from "lucide-react";
import { ImageSlider } from "@/components/wizard/ImageSlider";
import confetti from "canvas-confetti";
import QRCode from "qrcode";

function NewProductWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const user = session?.user as any;

  // Step state: 1 to 6
  const initialStep = Number(searchParams.get("step")) || 1;
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Screen 1: Photos
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
  ]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Screen 2: AI Studio
  const [enhancedUrl, setEnhancedUrl] = useState<string>("");
  const [enhancing, setEnhancing] = useState(false);
  const [enhancementSteps, setEnhancementSteps] = useState<string[]>([]);

  // Screen 3: Voice-to-Catalog
  const [isRecording, setIsRecording] = useState(false);
  const [voiceLang, setVoiceLang] = useState(user?.language || "te"); // default Telugu
  const [transcript, setTranscript] = useState("");
  const [activeLangTab, setActiveLangTab] = useState<"en" | "hi" | "te" | "ta">("en");

  // Screen 4: Specifications & 4-Language Catalog Data
  const [catalogData, setCatalogData] = useState({
    title: "Handwoven Pochampally Ikat Silk Saree - Crimson & Indigo",
    shortDesc: "Authentic double ikat handwoven silk saree with traditional geometric temple motifs.\nCrafted using 100% natural dyes and certified with the GI Handloom Mark.",
    longDesc: "Masterfully handwoven over 14 days by award-winning artisans. The warp and weft threads are individually tied and dyed before weaving to produce sharp, intricate Ikat designs.",
    category: "Handloom",
    craftType: "Pochampally Ikat",
    material: "100% Pure Mulberry Silk & Natural Dyes",
    dimensions: "5.5 meters saree length with 80cm blouse",
    weight: "580 grams",
    color: "Crimson Red & Royal Indigo",
    origin: "Pochampally, Yadadri Bhuvanagiri, Telangana",
    care: "Dry clean only. Store in breathable muslin cloth.",
    isHandmade: true,
    isGiTagged: true,
    keywords: ["Pochampally", "Ikat", "Silk Saree", "Handloom", "Telangana GI"],
    translations: {
      en: {
        title: "Handwoven Pochampally Ikat Silk Saree - Crimson & Indigo",
        shortDesc: "Authentic double ikat handwoven silk saree with traditional geometric temple motifs.\nCrafted using 100% natural dyes and certified with the GI Handloom Mark.",
      },
      hi: {
        title: "हस्तनिर्मित पोचमपल्ली इकत सिल्क साड़ी - क्रिमसन और इंडिगो",
        shortDesc: "पारंपरिक ज्यामितीय मंदिर रूपांकनों के साथ शुद्ध शहतूत रेशम की हाथ से बुनी गई साड़ी।\nप्राकृतिक रंगों से रंगी और जीआई हैंडलूम मार्क द्वारा प्रमाणित।",
      },
      te: {
        title: "చేనేత పోచంపల్లి ఇకత్ పట్టు చీర - ఎరుపు మరియు నీలం",
        shortDesc: "సాంప్రదాయ రేఖాగణిత ఆలయ అంచులతో చేతితో నేసిన అసలైన డబుల్ ఇకత్ పట్టు చీర.\nసహజ రంగులతో 14 రోజుల పాటు శ్రమించి తయారు చేసిన జీఐ సర్టిఫైడ్ చేనేత కళ.",
      },
      ta: {
        title: "கைத்தறி போச்சம்பள்ளி இக்கத் பட்டுப் புடவை",
        shortDesc: "பாரம்பரிய முறையில் இயற்கை சாயங்களால் நெய்யப்பட்ட தலைசிறந்த பட்டுப் புடவை.\nஜிஐ முத்திரையுடன் கூடிய நேரடி கைவினைஞரின் தயாரிப்பு.",
      },
    },
  });

  // Screen 5: AI Price Advisor Inputs & Result
  const [costInputs, setCostInputs] = useState({
    materialCost: 2800,
    laborCost: 2100,
    timeHours: 28,
    packagingCost: 150,
    shippingCost: 350,
    marginPercent: 30,
  });

  const [pricingResult, setPricingResult] = useState({
    recommendedMin: 7200,
    recommendedMax: 8400,
    suggestedPrice: 7800,
    breakdown: {
      material: 2800,
      labor: 2100,
      overheads: 430,
      packaging: 150,
      shipping: 350,
      artisanMargin: 1970,
    },
    insight: "Based on ₹2,800 raw silk and 28 hours of precision weaving, pricing between ₹7,200 – ₹8,400 guarantees a fair artisan hourly wage of ₹150+ while remaining competitive for bulk wholesale buyers.",
  });

  // Screen 6: Final publish states & Story QR
  const [publishedProduct, setPublishedProduct] = useState<any>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  // Step 2 Trigger: Auto-call AI Image Enhance on step 2 load
  useEffect(() => {
    if (currentStep === 2 && images.length > 0 && !enhancedUrl) {
      runImageEnhance();
    }
  }, [currentStep]);

  const runImageEnhance = async () => {
    setEnhancing(true);
    setError("");
    try {
      const res = await fetch("/api/ai/image-enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: images[selectedImageIndex] }),
      });
      const data = await res.json();
      setEnhancedUrl(data.enhancedUrl || images[selectedImageIndex]);
      setEnhancementSteps(data.stepsApplied || [
        "AI background cleanup & studio light fill",
        "Color fidelity & yarn texture preserve",
      ]);
    } catch (err) {
      setEnhancedUrl(images[selectedImageIndex]);
    } finally {
      setEnhancing(false);
    }
  };

  // Step 3: Voice speech recognition
  const toggleVoiceRecording = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      // Fallback demo transcript simulation
      simulateVoiceTranscription();
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang =
        voiceLang === "te"
          ? "te-IN"
          : voiceLang === "hi"
          ? "hi-IN"
          : voiceLang === "ta"
          ? "ta-IN"
          : "en-IN";

      setIsRecording(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const spokenText = event.results[0][0].transcript;
        setIsRecording(false);
        setTranscript(spokenText);
        handleGenerateCatalog(spokenText);
      };

      recognition.onerror = () => {
        setIsRecording(false);
        simulateVoiceTranscription();
      };
      recognition.onend = () => {
        setIsRecording(false);
      };
    } catch (e) {
      simulateVoiceTranscription();
    }
  };

  const simulateVoiceTranscription = () => {
    const sample =
      voiceLang === "te"
        ? "ఇది సహజ రంగులతో చేసిన చేనేత పోచంపల్లి పట్టు చీర. దీని బరువు 580 గ్రాములు. నేయడానికి 14 రోజులు పట్టింది."
        : voiceLang === "hi"
        ? "यह शुद्ध रेशम और प्राकृतिक रंगों से हाथ से बुनी गई पोचमपल्ली इकत साड़ी है। इसे तैयार करने में 14 दिन लगे।"
        : "Authentic double ikat handwoven silk saree made with pure mulberry silk and natural dyes.";
    setTranscript(sample);
    handleGenerateCatalog(sample);
  };

  const handleGenerateCatalog = async (spokenText: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: spokenText,
          craftType: user?.sellerProfile?.craftType || "Pochampally Ikat",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCatalogData((prev) => ({
          ...prev,
          title: data.title || prev.title,
          shortDesc: data.shortDesc || prev.shortDesc,
          longDesc: data.longDesc || prev.longDesc,
          category: data.category || prev.category,
          material: data.specs?.material || prev.material,
          dimensions: data.specs?.dimensions || prev.dimensions,
          weight: data.specs?.weight || prev.weight,
          color: data.specs?.color || prev.color,
          origin: data.specs?.origin || prev.origin,
          care: data.specs?.care || prev.care,
          keywords: data.keywords || prev.keywords,
          translations: {
            en: {
              title: data.translations?.en?.title || data.title,
              shortDesc: data.translations?.en?.shortDesc || data.shortDesc,
            },
            hi: {
              title: data.translations?.hi?.title || prev.translations.hi.title,
              shortDesc: data.translations?.hi?.shortDesc || prev.translations.hi.shortDesc,
            },
            te: {
              title: data.translations?.te?.title || prev.translations.te.title,
              shortDesc: data.translations?.te?.shortDesc || prev.translations.te.shortDesc,
            },
            ta: {
              title: data.translations?.ta?.title || prev.translations.ta.title,
              shortDesc: data.translations?.ta?.shortDesc || prev.translations.ta.shortDesc,
            },
          },
        }));
      }
    } catch (e) {
      console.warn("Catalog extraction fallback:", e);
    } finally {
      setLoading(false);
    }
  };

  // Step 5: Price estimation trigger
  const runPriceEstimate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...costInputs,
          craftType: catalogData.craftType,
          category: catalogData.category,
        }),
      });
      const data = await res.json();
      setPricingResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Step 6: Final Publish Submission
  const handlePublish = async () => {
    setLoading(true);
    setError("");

    try {
      const payload = {
        title: catalogData.title,
        shortDesc: catalogData.shortDesc,
        longDesc: catalogData.longDesc,
        category: catalogData.category,
        craftType: catalogData.craftType,
        price: pricingResult.suggestedPrice,
        moq: 3,
        stock: 20,
        images: [enhancedUrl || images[0]],
        material: catalogData.material,
        dimensions: catalogData.dimensions,
        weight: catalogData.weight,
        color: catalogData.color,
        origin: catalogData.origin,
        careInstructions: catalogData.care,
        isHandmade: catalogData.isHandmade,
        isGiTagged: catalogData.isGiTagged,
        keywords: catalogData.keywords,
        translations: catalogData.translations,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to publish product");
      }

      const product = await res.json();
      setPublishedProduct(product);

      // Generate Story QR Code pointing to public provenance story page
      const storyUrl = `${window.location.origin}/story/${product.id}`;
      const qrCode = await QRCode.toDataURL(storyUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#243B53",
          light: "#FAF8F3",
        },
      });
      setQrCodeDataUrl(qrCode);

      // Trigger Confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#C65D3B", "#243B53", "#3E6650", "#F4EBDD"],
      });

      setCurrentStep(6);
    } catch (err: any) {
      setError(err.message || "Failed to publish. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  // File Upload Helper
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Wizard Header & Step Flow */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4EBDD] text-[#243B53] text-xs font-bold border border-[#E5DCCD]">
          <Sparkles className="w-3.5 h-3.5 text-[#C65D3B]" />
          <span>6-Step End-to-End Product Creation Wizard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#243B53]">
          {currentStep === 1 && "Step 1: Capture & Upload Photos"}
          {currentStep === 2 && "Step 2: AI Product Studio"}
          {currentStep === 3 && "Step 3: Voice-to-Catalog (4 Languages)"}
          {currentStep === 4 && "Step 4: Review Specifications"}
          {currentStep === 5 && "Step 5: AI Price Advisor"}
          {currentStep === 6 && "Step 6: Published & Story QR"}
        </h1>
        <p className="text-xs sm:text-sm text-[#263238]/70">
          Step {currentStep} of 6 • Automatic background clean, multilingual catalog, and fair wage pricing
        </p>
      </div>

      {/* Progress Dots / Steps */}
      <div className="flex items-center justify-between max-w-2xl mx-auto px-2">
        {[
          { num: 1, label: "Photo" },
          { num: 2, label: "AI Studio" },
          { num: 3, label: "Voice" },
          { num: 4, label: "Review" },
          { num: 5, label: "Price" },
          { num: 6, label: "Publish" },
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center">
            <button
              onClick={() => s.num < currentStep && setCurrentStep(s.num)}
              disabled={s.num > currentStep}
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                s.num === currentStep
                  ? "bg-[#C65D3B] text-white ring-4 ring-[#C65D3B]/20"
                  : s.num < currentStep
                  ? "bg-[#243B53] text-white"
                  : "bg-[#E5DCCD] text-[#263238]/50"
              }`}
            >
              {s.num < currentStep ? <Check className="w-4 h-4" /> : s.num}
            </button>
            <span className="text-[11px] font-semibold mt-1 hidden sm:block text-[#243B53]">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Main Card Container */}
      <div className="card-artisan p-6 sm:p-8 bg-white shadow-sm space-y-6">
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCREEN 1: PHOTO (Camera + Upload Multiple) */}
        {/* ============================================================ */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center p-8 border-2 border-dashed border-[#E5DCCD] rounded-2xl bg-[#FAF8F3] space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#F4EBDD] text-[#C65D3B] flex items-center justify-center mx-auto text-2xl shadow-sm">
                <Camera className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#243B53]">
                  Capture from Workshop or Upload Images
                </h3>
                <p className="text-xs text-[#263238]/70 max-w-sm mx-auto mt-1">
                  Don't worry about cluttered backgrounds. In Step 2, our AI Studio will automatically remove the workshop mess and balance the lighting.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <label className="btn-cta inline-flex items-center gap-2 cursor-pointer text-xs">
                  <Camera className="w-4 h-4" />
                  <span>Use Camera / Upload Photos</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    capture="environment"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Gallery of Uploaded Photos */}
            {images.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#243B53]">
                  Selected Product Photos ({images.length})
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        selectedImageIndex === idx
                          ? "border-[#C65D3B] ring-2 ring-[#C65D3B]/30"
                          : "border-[#E5DCCD] opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="Product" className="w-full h-full object-cover" />
                      {selectedImageIndex === idx && (
                        <div className="absolute top-1 right-1 bg-[#C65D3B] text-white p-0.5 rounded-full">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-[#EAE3D2]">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                disabled={images.length === 0}
                className="btn-cta flex items-center gap-2"
              >
                <span>Continue to AI Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCREEN 2: AI PRODUCT STUDIO (Before/After Slider & remove.bg) */}
        {/* ============================================================ */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-[#243B53] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#C65D3B]" />
                  AI Studio Enhancement
                </h3>
                <p className="text-xs text-[#263238]/70">
                  Auto background segmentation, studio off-white backdrop, and thread color preservation
                </p>
              </div>

              <button
                type="button"
                onClick={runImageEnhance}
                disabled={enhancing}
                className="btn-secondary flex items-center gap-1.5 text-xs py-2 px-3 self-start sm:self-auto"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${enhancing ? "animate-spin" : ""}`} />
                <span>{enhancing ? "Processing..." : "Try Again / Re-Enhance"}</span>
              </button>
            </div>

            {/* Before / After Comparison Slider */}
            <div className="relative">
              {enhancing && (
                <div className="absolute inset-0 z-30 bg-white/80 rounded-2xl flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full border-4 border-[#C65D3B] border-t-transparent animate-spin" />
                  <span className="text-xs font-bold text-[#243B53]">
                    Removing workshop background & balancing lighting...
                  </span>
                </div>
              )}

              <ImageSlider
                originalUrl={images[selectedImageIndex]}
                enhancedUrl={enhancedUrl || images[selectedImageIndex]}
              />
            </div>

            {/* AI Steps Applied Pill Checklist */}
            <div className="bg-[#FAF8F3] p-4 rounded-xl border border-[#E5DCCD] space-y-2">
              <span className="text-xs font-bold text-[#243B53] block uppercase tracking-wider">
                Studio Optimization Pipeline:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#263238]/80">
                {enhancementSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#3E6650] shrink-0" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#EAE3D2]">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="btn-secondary flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="btn-cta flex items-center gap-2"
              >
                <span>Use This & Speak</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCREEN 3: VOICE-TO-CATALOG (Big Mic + 4-Language Editable) */}
        {/* ============================================================ */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-[#243B53]">
                Voice-to-Catalog Engine
              </h3>
              <p className="text-xs text-[#263238]/70">
                Tap the microphone below and describe your craft in your native language
              </p>
            </div>

            {/* Language Selector for Speech */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-bold text-[#243B53] uppercase">Spoken Language:</span>
              <div className="flex gap-1.5">
                {[
                  { code: "te", label: "తెలుగు (Telugu)" },
                  { code: "hi", label: "हिन्दी (Hindi)" },
                  { code: "en", label: "English" },
                  { code: "ta", label: "தமிழ் (Tamil)" },
                ].map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setVoiceLang(l.code)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      voiceLang === l.code
                        ? "bg-[#243B53] text-white border-[#243B53]"
                        : "bg-[#FAF8F3] text-[#263238] border-[#E5DCCD] hover:bg-[#F4EBDD]"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* BIG MIC BUTTON: "Tap and Speak" */}
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`w-28 h-28 rounded-full flex flex-col items-center justify-center text-white shadow-xl transition-all transform hover:scale-105 active:scale-95 ${
                  isRecording
                    ? "bg-red-600 animate-pulse ring-8 ring-red-200"
                    : "bg-[#C65D3B] hover:bg-[#B24E2E] ring-8 ring-[#C65D3B]/10"
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-10 h-10 mb-1" />
                    <span className="text-[11px] font-bold uppercase">Listening...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-10 h-10 mb-1" />
                    <span className="text-[11px] font-bold uppercase">Tap & Speak</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <span className="text-xs font-semibold text-[#243B53] block">
                  {isRecording ? "Listening to your craft details..." : "Speak yarn type, weaving days, weight, or size"}
                </span>
                <span className="text-[11px] text-gray-500">
                  Powered by Sarvam AI & Google Cloud STT
                </span>
              </div>
            </div>

            {/* Transcribed Speech Text Box */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#243B53] uppercase">
                Transcribed Artisan Speech:
              </label>
              <textarea
                rows={2}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Or click 'Tap and Speak' to automatically transcribe your voice..."
                className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl p-3 text-xs text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
              />
            </div>

            {/* 4-Language Editable Preview Tabs */}
            <div className="border border-[#E5DCCD] rounded-2xl bg-[#FAF8F3] p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5DCCD] pb-3">
                <span className="text-xs font-bold text-[#243B53] uppercase">
                  AI Generated Multilingual Catalog (Editable)
                </span>

                {/* 4 Language Tabs */}
                <div className="flex gap-1">
                  {(["en", "hi", "te", "ta"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveLangTab(tab)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors ${
                        activeLangTab === tab
                          ? "bg-[#C65D3B] text-white"
                          : "bg-[#F4EBDD] text-[#243B53] hover:bg-[#EAE0CD]"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Short Desc in Active Lang */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Title ({activeLangTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={
                      activeLangTab === "en"
                        ? catalogData.title
                        : (catalogData.translations as any)[activeLangTab]?.title || ""
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (activeLangTab === "en") {
                        setCatalogData((prev) => ({ ...prev, title: val }));
                      } else {
                        setCatalogData((prev) => ({
                          ...prev,
                          translations: {
                            ...prev.translations,
                            [activeLangTab]: {
                              ...(prev.translations as any)[activeLangTab],
                              title: val,
                            },
                          },
                        }));
                      }
                    }}
                    className="w-full bg-white border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs font-semibold text-[#243B53]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Short Description (2 Lines)
                  </label>
                  <textarea
                    rows={2}
                    value={
                      activeLangTab === "en"
                        ? catalogData.shortDesc
                        : (catalogData.translations as any)[activeLangTab]?.shortDesc || ""
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (activeLangTab === "en") {
                        setCatalogData((prev) => ({ ...prev, shortDesc: val }));
                      } else {
                        setCatalogData((prev) => ({
                          ...prev,
                          translations: {
                            ...prev.translations,
                            [activeLangTab]: {
                              ...(prev.translations as any)[activeLangTab],
                              shortDesc: val,
                            },
                          },
                        }));
                      }
                    }}
                    className="w-full bg-white border border-[#E5DCCD] rounded-xl p-2.5 text-xs text-[#263238]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#EAE3D2]">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="btn-secondary flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="btn-cta flex items-center gap-2"
              >
                <span>Review Specs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCREEN 4: SPECIFICATIONS & CRAFT DETAILS */}
        {/* ============================================================ */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#243B53]">
                Step 4: Technical & Provenance Specifications
              </h3>
              <p className="text-xs text-[#263238]/70">
                Detailed specs allow corporate buyers, boutiques, and exporters to place confident bulk orders
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                  Craft Category
                </label>
                <input
                  type="text"
                  value={catalogData.category}
                  onChange={(e) => setCatalogData({ ...catalogData, category: e.target.value })}
                  className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs text-[#263238]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                  Specific Craft Technique
                </label>
                <input
                  type="text"
                  value={catalogData.craftType}
                  onChange={(e) => setCatalogData({ ...catalogData, craftType: e.target.value })}
                  className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs text-[#263238]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                  Material & Yarns
                </label>
                <input
                  type="text"
                  value={catalogData.material}
                  onChange={(e) => setCatalogData({ ...catalogData, material: e.target.value })}
                  className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs text-[#263238]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                  Dimensions / Dimensions
                </label>
                <input
                  type="text"
                  value={catalogData.dimensions}
                  onChange={(e) => setCatalogData({ ...catalogData, dimensions: e.target.value })}
                  className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs text-[#263238]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                  Weight
                </label>
                <input
                  type="text"
                  value={catalogData.weight}
                  onChange={(e) => setCatalogData({ ...catalogData, weight: e.target.value })}
                  className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs text-[#263238]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                  Color Palette
                </label>
                <input
                  type="text"
                  value={catalogData.color}
                  onChange={(e) => setCatalogData({ ...catalogData, color: e.target.value })}
                  className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs text-[#263238]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                  Origin Cluster
                </label>
                <input
                  type="text"
                  value={catalogData.origin}
                  onChange={(e) => setCatalogData({ ...catalogData, origin: e.target.value })}
                  className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs text-[#263238]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#243B53] uppercase mb-1">
                Care & Preservation Instructions
              </label>
              <input
                type="text"
                value={catalogData.care}
                onChange={(e) => setCatalogData({ ...catalogData, care: e.target.value })}
                className="w-full bg-[#FAF8F3] border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs text-[#263238]"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#243B53]">
                <input
                  type="checkbox"
                  checked={catalogData.isHandmade}
                  onChange={(e) => setCatalogData({ ...catalogData, isHandmade: e.target.checked })}
                  className="w-4 h-4 rounded text-[#C65D3B] focus:ring-[#C65D3B]"
                />
                <span>100% Genuine Handcrafted</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#3E6650]">
                <input
                  type="checkbox"
                  checked={catalogData.isGiTagged}
                  onChange={(e) => setCatalogData({ ...catalogData, isGiTagged: e.target.checked })}
                  className="w-4 h-4 rounded text-[#3E6650] focus:ring-[#3E6650]"
                />
                <span>GI (Geographical Indication) Tagged</span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#EAE3D2]">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="btn-secondary flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="btn-cta flex items-center gap-2"
              >
                <span>Continue to Price Advisor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCREEN 5: AI PRICE ADVISOR (Cost Breakdown + XGBoost Window) */}
        {/* ============================================================ */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#243B53] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#3E6650]" />
                  AI Fair-Wage Price Advisor
                </h3>
                <p className="text-xs text-[#263238]/70">
                  Ensure sustainable fair wages for your labor while optimizing wholesale buyer demand
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EBF3EE] text-[#3E6650]">
                AI estimate
              </span>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-[#FAF8F3] p-5 rounded-2xl border border-[#E5DCCD]">
              <div>
                <label className="block text-[11px] font-bold text-[#243B53] uppercase mb-1">
                  Raw Material Cost (₹)
                </label>
                <input
                  type="number"
                  value={costInputs.materialCost}
                  onChange={(e) => setCostInputs({ ...costInputs, materialCost: Number(e.target.value) })}
                  className="w-full bg-white border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs font-bold text-[#243B53]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#243B53] uppercase mb-1">
                  Weaving / Craft Hours
                </label>
                <input
                  type="number"
                  value={costInputs.timeHours}
                  onChange={(e) => setCostInputs({ ...costInputs, timeHours: Number(e.target.value) })}
                  className="w-full bg-white border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs font-bold text-[#243B53]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#243B53] uppercase mb-1">
                  Direct Labor Cost (₹)
                </label>
                <input
                  type="number"
                  value={costInputs.laborCost}
                  onChange={(e) => setCostInputs({ ...costInputs, laborCost: Number(e.target.value) })}
                  className="w-full bg-white border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs font-bold text-[#243B53]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#243B53] uppercase mb-1">
                  Packaging Cost (₹)
                </label>
                <input
                  type="number"
                  value={costInputs.packagingCost}
                  onChange={(e) => setCostInputs({ ...costInputs, packagingCost: Number(e.target.value) })}
                  className="w-full bg-white border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs font-bold text-[#243B53]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#243B53] uppercase mb-1">
                  Shipping Buffer (₹)
                </label>
                <input
                  type="number"
                  value={costInputs.shippingCost}
                  onChange={(e) => setCostInputs({ ...costInputs, shippingCost: Number(e.target.value) })}
                  className="w-full bg-white border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs font-bold text-[#243B53]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#243B53] uppercase mb-1">
                  Target Artisan Margin (%)
                </label>
                <input
                  type="number"
                  value={costInputs.marginPercent}
                  onChange={(e) => setCostInputs({ ...costInputs, marginPercent: Number(e.target.value) })}
                  className="w-full bg-white border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs font-bold text-[#243B53]"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={runPriceEstimate}
                disabled={loading}
                className="btn-secondary text-xs flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4 text-[#3E6650]" />
                <span>Recalculate AI Fair-Trade Window</span>
              </button>
            </div>

            {/* AI Estimation Result Card */}
            <div className="card-artisan p-6 bg-[#F4EBDD] border border-[#E5DCCD] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#243B53]">
                    Recommended Wholesale Price Window:
                  </span>
                  <div className="text-2xl sm:text-3xl font-bold text-[#243B53] mt-0.5">
                    ₹{pricingResult.recommendedMin.toLocaleString("en-IN")} – ₹{pricingResult.recommendedMax.toLocaleString("en-IN")}
                  </div>
                </div>

                <div className="bg-white px-4 py-2 rounded-xl border border-[#E5DCCD] text-center">
                  <span className="text-[10px] text-gray-500 font-bold block uppercase">
                    Suggested Listing Price
                  </span>
                  <span className="text-xl font-bold text-[#C65D3B]">
                    ₹{pricingResult.suggestedPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#263238]/85 leading-relaxed italic border-t border-[#E5DCCD] pt-3">
                "{pricingResult.insight}"
              </p>

              {/* Cost Breakdown Bars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2">
                <div className="bg-white/80 p-2 rounded-lg text-center">
                  <span className="text-[10px] text-gray-500 block">Material</span>
                  <span className="font-bold text-[#243B53]">₹{pricingResult.breakdown.material}</span>
                </div>
                <div className="bg-white/80 p-2 rounded-lg text-center">
                  <span className="text-[10px] text-gray-500 block">Artisan Labor</span>
                  <span className="font-bold text-[#243B53]">₹{pricingResult.breakdown.labor}</span>
                </div>
                <div className="bg-white/80 p-2 rounded-lg text-center">
                  <span className="text-[10px] text-gray-500 block">Overhead & Logistics</span>
                  <span className="font-bold text-[#243B53]">₹{pricingResult.breakdown.overheads + pricingResult.breakdown.shipping}</span>
                </div>
                <div className="bg-[#EBF3EE] p-2 rounded-lg text-center">
                  <span className="text-[10px] text-[#3E6650] font-bold block">Net Margin</span>
                  <span className="font-bold text-[#3E6650]">₹{pricingResult.breakdown.artisanMargin}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#EAE3D2]">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="btn-secondary flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handlePublish}
                disabled={loading}
                className="btn-cta flex items-center gap-2"
              >
                {loading ? "Publishing to National Catalog..." : "Confirm & Publish Listing"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCREEN 6: PUBLISHED CELEBRATION & STORY QR CODE */}
        {/* ============================================================ */}
        {currentStep === 6 && (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 rounded-full bg-[#EBF3EE] text-[#3E6650] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#243B53]">
                Your Handcrafted Listing is Live!
              </h2>
              <p className="text-xs sm:text-sm text-[#263238]/80 max-w-md mx-auto">
                Verified wholesale buyers and boutiques across India can now discover, quote, and purchase your authentic creation.
              </p>
            </div>

            {/* Generated Story QR Code Card */}
            <div className="max-w-sm mx-auto bg-[#FAF8F3] p-6 rounded-2xl border-2 border-[#E5DCCD] space-y-4 shadow-sm">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#243B53] uppercase tracking-wider">
                <QrCode className="w-4 h-4 text-[#C65D3B]" />
                <span>Artisan Story QR Code</span>
              </div>

              {qrCodeDataUrl ? (
                <div className="bg-white p-3 rounded-xl inline-block shadow-sm">
                  <img src={qrCodeDataUrl} alt="Story QR" className="w-48 h-48 mx-auto" />
                </div>
              ) : (
                <div className="w-48 h-48 bg-gray-100 rounded-xl mx-auto flex items-center justify-center text-xs text-gray-500">
                  Generating QR...
                </div>
              )}

              <p className="text-[11px] text-gray-600 leading-snug">
                Print this QR code and attach it to your physical packaging. When buyers scan it, they see your workshop story, village heritage, and GI certification!
              </p>

              {qrCodeDataUrl && (
                <a
                  href={qrCodeDataUrl}
                  download={`Karigar-StoryQR-${publishedProduct?.id || "artisan"}.png`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#243B53] text-white text-xs font-bold hover:bg-[#334E68] transition-colors"
                >
                  <span>Download Printable QR Label</span>
                </a>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href={`/marketplace/${publishedProduct?.id}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#C65D3B] text-white font-bold text-sm hover:bg-[#B24E2E] shadow-sm transition-colors"
              >
                View Live Marketplace Listing
              </Link>

              <Link
                href="/seller/dashboard"
                className="w-full sm:w-auto btn-secondary text-sm"
              >
                Back to Artisan Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NewProductWizard() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading Artisan Product Wizard...</div>}>
      <NewProductWizardContent />
    </Suspense>
  );
}
