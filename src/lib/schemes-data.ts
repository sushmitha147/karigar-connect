export interface GovtScheme {
  id: string;
  name: string;
  hindiName: string;
  teluguName: string;
  ministry: string;
  description: string;
  benefits: string[];
  subsidyPercent?: string;
  loanLimit?: string;
  officialLink: string;
  eligibleCrafts: string[]; // empty means all crafts
  eligibleStates?: string[]; // empty means pan-India
  requiredDocs: string[];
  badge: string;
}

export const GOVT_SCHEMES: GovtScheme[] = [
  {
    id: "pm-vishwakarma",
    name: "PM Vishwakarma Yojana",
    hindiName: "पीएम विश्वकर्मा योजना",
    teluguName: "పీఎం విశ్వకర్మ పథకం",
    ministry: "Ministry of Micro, Small and Medium Enterprises (MSME)",
    description: "Holistic end-to-end support for traditional artisans and craftspeople across 18 family-based traditional trades.",
    benefits: [
      "PM Vishwakarma Certificate & ID Card",
      "Skill Upgradation: 5-7 days basic training with ₹500/day stipend",
      "Toolkit Incentive of ₹15,000 via e-RUPI / digital grant",
      "Collateral-free credit support up to ₹3,00,000 (Tranche 1: ₹1L at 5% interest, Tranche 2: ₹2L)",
      "Incentive for digital transactions (₹1 per txn up to 100 txns/month)",
    ],
    subsidyPercent: "Interest subvention of 8% provided by MoMSME (concessional 5% rate)",
    loanLimit: "Up to ₹3,00,000",
    officialLink: "https://pmvishwakarma.gov.in/",
    eligibleCrafts: ["Handloom", "Pottery", "Woodcraft", "Metalcraft", "Leathercraft", "Art & Painting", "Sculptor", "Toy Maker"],
    requiredDocs: ["Aadhaar Card", "Mobile Linked with Aadhaar", "Bank Account Details", "Ration Card / Family details"],
    badge: "Flagship Central Scheme",
  },
  {
    id: "weavers-mudra",
    name: "Pradhan Mantri Weavers Mudra Scheme",
    hindiName: "प्रधानमंत्री बुनकर मुद्रा योजना",
    teluguName: "ప్రధానమంత్రి చేనేత ముద్రా పథకం",
    ministry: "Ministry of Textiles, Office of Development Commissioner for Handlooms",
    description: "Financial assistance through banks at concessional interest rates with margin money assistance for handloom weavers.",
    benefits: [
      "Margin Money assistance up to ₹25,000 (or 20% of project cost)",
      "Concessional loan at 6% interest rate for up to 3 years",
      "Credit Guarantee through CGTMSE for 3 years without third-party guarantee",
      "Direct benefit transfer (DBT) of margin subsidy into bank account",
    ],
    subsidyPercent: "Interest subvention up to 7% with 20% margin assistance",
    loanLimit: "Up to ₹2,00,000 (Weaver Credit Card / MUDRA)",
    officialLink: "https://handlooms.nic.in/",
    eligibleCrafts: ["Handloom", "Weaving", "Silk Weaving", "Ikat", "Khadi"],
    requiredDocs: ["Handloom Weaver Pehchan Card", "Aadhaar Card", "Bank Passbook", "Caste Certificate if applicable"],
    badge: "Handloom Exclusive",
  },
  {
    id: "odop-initiative",
    name: "One District One Product (ODOP) Scheme",
    hindiName: "एक जिला एक उत्पाद योजना",
    teluguName: "ఒక జిల్లా ఒక ఉత్పత్తి పథకం",
    ministry: "Department for Promotion of Industry and Internal Trade (DPIIT)",
    description: "Promoting indigenous and specialized crafts and agricultural products unique to each district for national and international export.",
    benefits: [
      "Export facilitation and B2B global buyer matchmaking",
      "Subsidized exhibition stalls at international trade fairs (Bharat Tex, Surajkund, Dastkar)",
      "Free packaging redesign & GI tagging assistance",
      "Onboarding assistance onto GeM (Government e-Marketplace)",
    ],
    officialLink: "https://www.investindia.gov.in/one-district-one-product",
    eligibleCrafts: ["Handloom", "Pottery", "Woodcraft", "Metalcraft", "Leathercraft", "Art & Painting"],
    requiredDocs: ["Artisan Pehchan Card / Udyam Certificate", "Proof of Workshop / District Residence"],
    badge: "Export & Marketing",
  },
  {
    id: "ambedkar-hastshilp",
    name: "Ambedkar Hastshilp Vikas Yojana (AHVY)",
    hindiName: "अम्बेडकर हस्तशिल्प विकास योजना",
    teluguName: "అంబేద్కర్ హస్తకళల వికాస్ యోజన",
    ministry: "Ministry of Textiles, Office of Development Commissioner (Handicrafts)",
    description: "Community empowerment through cluster development, training, design improvement, and common facility centers for handicrafts artisans.",
    benefits: [
      "Cluster-based skill training with modern toolkits",
      "Establishment of Common Facility Centers (CFC) in craft clusters",
      "Direct participation in Gandhi Shilp Bazaars with TA/DA allowances",
      "Design workshops by NID/NIFT empanelled designers",
    ],
    officialLink: "https://crafts.gov.in/",
    eligibleCrafts: ["Pottery", "Woodcraft", "Metalcraft", "Leathercraft", "Art & Painting", "Terracotta"],
    requiredDocs: ["Handicraft Artisan Pehchan Card", "Aadhaar Card", "Cluster Group Affiliation"],
    badge: "Handicrafts Cluster",
  },
];

export function matchGovtSchemes(craftType: string, category: string, state?: string): GovtScheme[] {
  const normCraft = (craftType + " " + category).toLowerCase();
  return GOVT_SCHEMES.filter((scheme) => {
    // Check craft match
    const craftMatch = scheme.eligibleCrafts.some((ec) =>
      normCraft.includes(ec.toLowerCase())
    );
    if (!craftMatch) return false;

    // Check state match if specified
    if (scheme.eligibleStates && scheme.eligibleStates.length > 0 && state) {
      return scheme.eligibleStates.includes(state);
    }
    return true;
  });
}
