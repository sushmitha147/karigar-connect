export interface ImageEnhanceResult {
  originalUrl: string;
  enhancedUrl: string;
  stepsApplied: string[];
  success: boolean;
  message?: string;
}

export interface TranscribeResult {
  transcript: string;
  detectedLanguage: "en" | "hi" | "te" | "ta";
  confidence: number;
}

export interface CatalogSpecs {
  material: string;
  craftType: string;
  dimensions: string;
  weight: string;
  color: string;
  handmade: boolean;
  origin: string;
  care: string;
}

export interface CatalogTranslation {
  title: string;
  shortDesc: string;
  longDesc: string;
  specsSummary: string;
  careTip: string;
}

export interface CatalogResult {
  title: string;
  shortDesc: string;
  longDesc: string;
  category: string;
  specs: CatalogSpecs;
  keywords: string[];
  translations: {
    en: CatalogTranslation;
    hi: CatalogTranslation;
    te: CatalogTranslation;
    ta: CatalogTranslation;
  };
}

export interface PriceInput {
  materialCost: number;
  laborCost: number;
  timeHours: number;
  packagingCost: number;
  shippingCost: number;
  marginPercent: number;
  craftType?: string;
  category?: string;
}

export interface PriceResult {
  recommendedMin: number;
  recommendedMax: number;
  suggestedPrice: number;
  breakdown: {
    material: number;
    labor: number;
    overheads: number;
    packaging: number;
    shipping: number;
    artisanMargin: number;
  };
  craftPremiumPercent: number;
  hourlyRateEquivalent: number;
  marketPercentile: string;
  label: "AI estimate";
  insight: string;
}

export interface PlacementAdviceResult {
  optimalPosition: string;
  eyeLevelHeight: string;
  lighting: {
    colorTemp: string; // e.g., "2700K Warm White"
    fixtureType: string;
    lux: string;
  };
  framingAdvice: string;
  vastuOrientation: string;
  complementaryPalette: string[];
  summary: string;
}

export interface AssistantContext {
  userId?: string;
  sellerId?: string;
  buyerId?: string;
  role?: string;
  language?: string;
}

export interface AssistantResult {
  reply: string;
  toolCalled?: string;
  data?: any;
}

export interface IAIService {
  enhanceImage(imageUrlOrBase64: string): Promise<ImageEnhanceResult>;
  transcribeAudio(audioData: string, languageHint?: string): Promise<TranscribeResult>;
  generateCatalog(text: string, craftType?: string): Promise<CatalogResult>;
  estimatePrice(input: PriceInput): Promise<PriceResult>;
  placementAdvise(roomImage: string, product: { title: string; category: string; dimensions?: string; material?: string }): Promise<PlacementAdviceResult>;
  askAssistant(query: string, context: AssistantContext): Promise<AssistantResult>;
}
