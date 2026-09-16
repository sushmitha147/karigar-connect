import { NextResponse } from "next/server";
import { getAIService } from "@/lib/ai/cloud-adapter";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      materialCost,
      laborCost,
      timeHours,
      packagingCost,
      shippingCost,
      marginPercent,
      craftType,
      category,
    } = body;

    const aiService = getAIService();
    const result = await aiService.estimatePrice({
      materialCost: Number(materialCost) || 0,
      laborCost: Number(laborCost) || 0,
      timeHours: Number(timeHours) || 0,
      packagingCost: Number(packagingCost) || 0,
      shippingCost: Number(shippingCost) || 0,
      marginPercent: Number(marginPercent) || 25,
      craftType,
      category,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Pricing estimation error:", error);
    return NextResponse.json(
      { error: "AI pricing estimation failed. Please input manual rates." },
      { status: 500 }
    );
  }
}
