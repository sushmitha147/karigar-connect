import {
  IAIService,
  ImageEnhanceResult,
  TranscribeResult,
  CatalogResult,
  PriceInput,
  PriceResult,
  PlacementAdviceResult,
  AssistantContext,
  AssistantResult,
} from "./adapter";
import prisma from "../prisma";

export class MockAIService implements IAIService {
  async enhanceImage(imageUrlOrBase64: string): Promise<ImageEnhanceResult> {
    // Simulate studio backdrop replacement, brightness balance, center alignment
    return {
      originalUrl: imageUrlOrBase64,
      enhancedUrl: imageUrlOrBase64.startsWith("data:")
        ? imageUrlOrBase64 // keep base64 or add studio framing
        : imageUrlOrBase64,
      stepsApplied: [
        "AI background segmentation & studio off-white backdrop insertion",
        "Color temperature calibration (warm daylight 5200K)",
        "Micro-contrast enhancement on handloom thread / pottery glaze textures",
        "Subject auto-centering & edge feathering",
      ],
      success: true,
      message: "AI Studio enhanced successfully (Adapter Mock Mode)",
    };
  }

  async transcribeAudio(audioData: string, languageHint = "en"): Promise<TranscribeResult> {
    // Intelligent fallback simulating speech-to-text
    const samplePhrases: Record<string, string> = {
      te: "ఇది సహజ రంగులతో చేసిన చేనేత పోచంపల్లి పట్టు చీర. దీని బరువు దాదాపు 600 గ్రాములు. నేయడానికి 14 రోజులు పట్టింది.",
      hi: "यह शुद्ध शहतूत रेशम और प्राकृतिक रंगों से हाथ से बुनी गई पोचमपल्ली इकत साड़ी है। इसे तैयार करने में 12 दिन लगे।",
      ta: "இது பாரம்பரிய முறையில் நெய்யப்பட்ட தூய பட்டு புடவை. இயற்கை சாயங்கள் கொண்டு கைத்தறியில் உருவாக்கப்பட்டது.",
      en: "This is an authentic handloom silk saree handcrafted using heritage tie-and-dye Ikat technique. It took 12 days to weave with pure natural dyes.",
    };

    const detected = (["en", "hi", "te", "ta"].includes(languageHint)
      ? languageHint
      : "en") as "en" | "hi" | "te" | "ta";

    return {
      transcript: samplePhrases[detected] || samplePhrases.en,
      detectedLanguage: detected,
      confidence: 0.96,
    };
  }

  async generateCatalog(text: string, craftTypeHint = "Handloom"): Promise<CatalogResult> {
    // Domain heuristic parsing based on craft type and keywords
    const lower = (text + " " + craftTypeHint).toLowerCase();

    let category = "Handloom";
    let title = "Handwoven Heritage Pochampally Ikat Silk Saree";
    let material = "100% Pure Mulberry Silk & Natural Dyes";
    let craftType = "Pochampally Ikat";
    let dimensions = "5.5 meters saree length with 80 cm unstitched blouse";
    let weight = "580 grams";
    let color = "Crimson Red & Royal Indigo";
    let origin = "Bhoodan Pochampally, Yadadri Bhuvanagiri District, Telangana";
    let care = "Dry clean only. Store in breathable muslin cloth away from direct sunlight.";

    if (lower.includes("wood") || lower.includes("toy") || lower.includes("etikoppaka")) {
      category = "Woodcraft";
      title = "Etikoppaka Handcrafted Lacquer Wood Decorative Figurine";
      material = "Ankudu Wood (Wrightia Tinctoria) & Organic Lacquer";
      craftType = "Etikoppaka Lacquerware";
      dimensions = "8 inches height x 4 inches base diameter";
      weight = "320 grams";
      color = "Ochre Yellow, Terracotta Red & Natural Wood";
      origin = "Etikoppaka Craft Village, Visakhapatnam, Andhra Pradesh";
      care = "Wipe gently with dry soft cloth. Keep away from moisture and direct water exposure.";
    } else if (lower.includes("pottery") || lower.includes("clay") || lower.includes("blue")) {
      category = "Pottery";
      title = "Traditional Jaipur Blue Pottery Hand-Painted Floral Vase";
      material = "Quartz Stone Powder, Fullers Earth (Multani Mitti) & Natural Oxides";
      craftType = "Jaipur Blue Pottery";
      dimensions = "10 inches height x 5 inches top diameter";
      weight = "850 grams";
      color = "Cobalt Blue, Turquoise & Milk White";
      origin = "Kot Jewar / Jaipur, Rajasthan";
      care = "Hand wash with mild soap and sponge. Fragile; handle with care.";
    } else if (lower.includes("metal") || lower.includes("brass") || lower.includes("dhokra") || lower.includes("bell")) {
      category = "Metalcraft";
      title = "Authentic Bastar Dhokra Lost-Wax Bell Metal Tribal Figurine";
      material = "Brass & Bronze Bell Metal Alloy, Beeswax";
      craftType = "Dhokra Lost-Wax Casting";
      dimensions = "9 inches height x 4.5 inches width";
      weight = "1.2 kg";
      color = "Antique Rustic Brass Gold";
      origin = "Bastar Craft Cluster, Chhattisgarh";
      care = "Dust with dry cotton brush. Polish with brass cleaner once a year if desired.";
    }

    const shortDesc = `Handcrafted with meticulous dedication by master artisans using traditional centuries-old techniques. Each piece carries unique authentic handmade textures and cultural heritage.`;
    const longDesc = `Celebrate India's venerable artisanal heritage with this authentic ${title}. Masterfully created in ${origin}, this masterpiece demonstrates the mastery of generational craft wisdom. The materials (${material}) are ethically sourced and prepared with natural precision, ensuring exceptional durability and timeless elegance. Suitable for premium boutique collections, export orders, and discerning B2B retailers seeking authentic GI-grade craftsmanship.`;

    const keywords = [
      craftType,
      category,
      "Handmade India",
      "B2B Wholesale",
      "GI Certified",
      "Sustainable Craft",
      "Artisan Direct",
    ];

    return {
      title,
      shortDesc,
      longDesc,
      category,
      specs: {
        material,
        craftType,
        dimensions,
        weight,
        color,
        handmade: true,
        origin,
        care,
      },
      keywords,
      translations: {
        en: {
          title,
          shortDesc,
          longDesc,
          specsSummary: `${craftType} | ${material} | ${origin}`,
          careTip: care,
        },
        hi: {
          title: `पारंपरिक हस्तनिर्मित ${craftType} - उत्कृष्ट भारतीय कारीगरी`,
          shortDesc: `पुश्तैनी तकनीकों और शुद्ध प्राकृतिक सामग्रियों से तैयार की गई प्रामाणिक शिल्पकला।`,
          longDesc: `यह अनूठी कृति ${origin} के कुशल कारीगरों द्वारा पूर्णतः हाथ से तैयार की गई है। ${material} से बनी यह कलाकृति पर्यावरण-अनुकूल और टिकाऊ है।`,
          specsSummary: `${craftType} | ${material} | उत्पत्ति: ${origin}`,
          careTip: `धूल साफ करने के लिए सूखे मुलायम कपड़े का प्रयोग करें।`,
        },
        te: {
          title: `సాంప్రదాయ చేతివృత్తుల ${craftType} - పవిత్ర భారతీయ కళారూపం`,
          shortDesc: `తరతరాల వారసత్వ నైపుణ్యంతో సహజ పద్ధతుల్లో తీర్చిదిద్దిన అసలైన చేనేత/హస్తకళ.`,
          longDesc: `${origin} ప్రాంతానికి చెందిన నిష్ణాతులైన చేతివృత్తిదారుల చేతుల మీదుగా రూపొందించబడింది. ${material} ఉపయోగించి అత్యున్నత నాణ్యతతో తయారుచేశారు.`,
          specsSummary: `${craftType} | ${material} | జన్మస్థలం: ${origin}`,
          careTip: care,
        },
        ta: {
          title: `பாரம்பரிய கைவினை ${craftType} - தலைசிறந்த இந்திய கைவினைப்பொருள்`,
          shortDesc: `தலைமுறை தலைமுறையாக தொடரும் பாரம்பரிய நுட்பங்களால் உருவாக்கப்பட்ட அசல் படைப்பு.`,
          longDesc: `${origin} பகுதியைச் சேர்ந்த கைவினைஞர்களால் உருவாக்கப்பட்டது. ${material} கொண்டு நேர்த்தியாக தயாரிக்கப்பட்டுள்ளது.`,
          specsSummary: `${craftType} | ${material} | இடம்: ${origin}`,
          careTip: care,
        },
      },
    };
  }

  async estimatePrice(input: PriceInput): Promise<PriceResult> {
    // XGBoost-inspired regression formula incorporating craft complexity, artisan fair wages, and market margins
    const {
      materialCost,
      laborCost,
      timeHours,
      packagingCost,
      shippingCost,
      marginPercent,
      craftType = "Handloom",
    } = input;

    // Minimum baseline fair wage in Indian artisan clusters (approx ₹120-₹200/hr)
    const effectiveLabor = Math.max(laborCost, timeHours * 150);
    const directCost = materialCost + effectiveLabor + packagingCost + shippingCost;
    
    // Craft skill complexity multiplier
    let craftMultiplier = 1.15; // default 15% heritage mark
    const lowerCraft = craftType.toLowerCase();
    if (lowerCraft.includes("ikat") || lowerCraft.includes("patola") || lowerCraft.includes("dhokra")) {
      craftMultiplier = 1.25; // Highly intricate GI techniques
    } else if (lowerCraft.includes("lacquer") || lowerCraft.includes("blue pottery")) {
      craftMultiplier = 1.20;
    }

    const marginRate = (marginPercent || 25) / 100;
    const baseCostWithOverheads = directCost * 1.08; // 8% workshop utilities/rent
    const targetWholesale = baseCostWithOverheads * (1 + marginRate) * craftMultiplier;

    // Output range: -8% to +12%
    const recommendedMin = Math.round(targetWholesale * 0.92 / 10) * 10;
    const recommendedMax = Math.round(targetWholesale * 1.12 / 10) * 10;
    const suggestedPrice = Math.round(targetWholesale / 10) * 10;

    return {
      recommendedMin,
      recommendedMax,
      suggestedPrice,
      breakdown: {
        material: Math.round(materialCost),
        labor: Math.round(effectiveLabor),
        overheads: Math.round(baseCostWithOverheads - directCost),
        packaging: Math.round(packagingCost),
        shipping: Math.round(shippingCost),
        artisanMargin: Math.round(suggestedPrice - directCost),
      },
      craftPremiumPercent: Math.round((craftMultiplier - 1) * 100),
      hourlyRateEquivalent: Math.round(effectiveLabor / Math.max(timeHours, 1)),
      marketPercentile: "72nd Percentile (Optimal B2B Fair-Trade Window)",
      label: "AI estimate",
      insight: `Based on ₹${materialCost} raw material and ${timeHours} hours of artisanal dedication, pricing within ₹${recommendedMin.toLocaleString('en-IN')} – ₹${recommendedMax.toLocaleString('en-IN')} gives buyers competitive wholesale rates while ensuring a healthy ${marginPercent}% margin.`,
    };
  }

  async placementAdvise(
    _roomImage: string,
    product: { title: string; category: string; dimensions?: string; material?: string }
  ): Promise<PlacementAdviceResult> {
    const isPaintingOrWallDecor =
      product.category.toLowerCase().includes("art") ||
      product.category.toLowerCase().includes("painting") ||
      product.title.toLowerCase().includes("painting") ||
      product.title.toLowerCase().includes("tapestry");

    if (isPaintingOrWallDecor) {
      return {
        optimalPosition: "North-East or East Living Room Focal Wall",
        eyeLevelHeight: "57 to 60 inches from floor to center of canvas",
        lighting: {
          colorTemp: "2700K - 3000K Warm Museum White",
          fixtureType: "Adjustable 30° LED ceiling spotlight or wall picture light with CRI > 90",
          lux: "150 - 200 Lux (preserving natural pigments from UV degradation)",
        },
        framingAdvice: "Deep teakwood or brushed matte brass frame with 2-inch warm cream acid-free matting.",
        vastuOrientation: "Northeast wall brings prosperity, peace, and spiritual flow according to Vastu Shastra principles.",
        complementaryPalette: ["#FAF8F3 Off-White", "#F4EBDD Sand", "#243B53 Deep Indigo", "#C65D3B Terracotta"],
        summary: `For ${product.title}, display on your primary viewing wall. Position center at 58" eye level. Use 2700K warm spotlight to make natural mineral pigments and handcrafted details radiate.`,
      };
    }

    return {
      optimalPosition: "South-West Console Table or Central Coffee Table Credenza",
      eyeLevelHeight: "Table surface height (28-32 inches), clear 360° sightline",
      lighting: {
        colorTemp: "3000K Warm Ambient",
        fixtureType: "Soft diffused downlight or natural indirect north-facing window light",
        lux: "250 - 300 Lux",
      },
      framingAdvice: "Solid dark wood pedestal or raw unpolished sandstone coaster pad.",
      vastuOrientation: "Earth and metal elements placed in Southwest or West enhance family stability and grounded energy.",
      complementaryPalette: ["#FAF8F3 Off-White", "#3E6650 Earth Green", "#243B53 Indigo", "#D97706 Ochre"],
      summary: `Position this authentic ${product.category} piece on a prominent credenza. A warm 3000K accent light will accentuate the hand-carved textures and natural luster.`,
    };
  }

  async askAssistant(query: string, context: AssistantContext): Promise<AssistantResult> {
    const lower = query.toLowerCase();

    // Tool calling simulation connected to real database queries
    if (lower.includes("order") || lower.includes("pending") || lower.includes("आदेश") || lower.includes("ఆర్డర్")) {
      try {
        const pendingOrders = await prisma.order.findMany({
          where: context.sellerId ? { sellerId: context.sellerId } : undefined,
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { product: true },
        });

        const count = pendingOrders.length;
        const lang = context.language || "en";

        if (lang === "te") {
          return {
            reply: `మీ వద్ద ప్రస్తుతం ${count} ఆర్డర్‌లు ఉన్నాయి. తాజా ఆర్డర్: ${pendingOrders[0]?.product?.title || "ఉత్పత్తి"} (పరిమాణం: ${pendingOrders[0]?.quantity || 1}). ఇప్పుడే షిప్పింగ్ లేబుల్ సిద్ధం చేయవచ్చు!`,
            toolCalled: "getPendingOrders",
            data: pendingOrders,
          };
        } else if (lang === "hi") {
          return {
            reply: `नमस्ते! आपके पास वर्तमान में ${count} ऑर्डर हैं। नवीनतम ऑर्डर: ${pendingOrders[0]?.product?.title || "उत्पाद"} (मात्रा: ${pendingOrders[0]?.quantity || 1})। आप इसे शिपमेंट के लिए तैयार कर सकते हैं।`,
            toolCalled: "getPendingOrders",
            data: pendingOrders,
          };
        }

        return {
          reply: `You currently have ${count} pending/active orders in your pipeline. The latest order is for "${pendingOrders[0]?.product?.title || "Handcrafted product"}" (Qty: ${pendingOrders[0]?.quantity || 1}, ₹${pendingOrders[0]?.totalAmount || 0}). Would you like to mark it as shipped?`,
          toolCalled: "getPendingOrders",
          data: pendingOrders,
        };
      } catch (err) {
        return {
          reply: "You have 3 active customer orders in processing. All are scheduled for dispatch within the next 48 hours.",
          toolCalled: "getPendingOrders",
        };
      }
    }

    if (lower.includes("stock") || lower.includes("inventory") || lower.includes("स्टॉक") || lower.includes("స్టాక్")) {
      try {
        const lowStock = await prisma.product.findMany({
          where: context.sellerId
            ? { sellerId: context.sellerId, stock: { lte: 10 } }
            : { stock: { lte: 10 } },
          take: 3,
        });

        return {
          reply: `Inventory Alert: You have ${lowStock.length} items with low stock (<10 units remaining). Consider scheduling a production run before the upcoming festival wholesale season.`,
          toolCalled: "getLowStockProducts",
          data: lowStock,
        };
      } catch (err) {
        return {
          reply: "Your stock levels are stable. 2 items are approaching the reorder threshold.",
          toolCalled: "getLowStockProducts",
        };
      }
    }

    if (lower.includes("price") || lower.includes("margin") || lower.includes("कीमत") || lower.includes("ధర")) {
      return {
        reply: "To get the best profit, ensure your labor cost accounts for at least ₹150/hour of weaving or carving time. You can use our AI Price Advisor tab to calculate the exact wholesale vs retail margins for your next batch.",
        toolCalled: "pricingGuidance",
      };
    }

    if (lower.includes("scheme") || lower.includes("yojana") || lower.includes("लोन") || lower.includes("రుణం")) {
      return {
        reply: "You are eligible for the PM Vishwakarma Yojana (toolkit grant of ₹15,000 + collateral-free ₹3 Lakh loan at 5% interest) and Weavers Mudra Scheme. Check your 'Govt Schemes' tab to view your matched benefits and apply directly!",
        toolCalled: "getEligibleSchemes",
      };
    }

    // Default polite assistant reply in user language
    const lang = context.language || "en";
    if (lang === "te") {
      return {
        reply: `నమస్తే! నేను మీ కారిగర్ బిజినెస్ అసిస్టెంట్‌ని. మీ ఆర్డర్‌లు, స్టాక్, కొత్త ధరల లెక్కింపు లేదా ప్రభుత్వ పథకాల గురించి నన్ను ఏదైనా అడగవచ్చు.`,
      };
    } else if (lang === "hi") {
      return {
        reply: `नमस्ते! मैं आपका कारीगर सहायक हूँ। आप मुझसे लंबित ऑर्डर, इन्वेंटरी स्थिति, मूल्य निर्धारण या सरकारी योजनाओं के बारे में पूछ सकते हैं।`,
      };
    } else if (lang === "ta") {
      return {
        reply: `வணக்கம்! நான் உங்கள் காரிகர் வணிக உதவியாளர். உங்கள் ஆர்டர்கள், இருப்பு, விலை நிர்ணயம் அல்லது அரசு திட்டங்கள் பற்றி என்னிடம் கேளுங்கள்.`,
      };
    }

    return {
      reply: "Namaste! I am your Karigar Business Assistant. You can ask me about your pending orders, inventory restock alerts, pricing suggestions, or eligible government schemes.",
    };
  }
}
