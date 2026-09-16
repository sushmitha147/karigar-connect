import { NextResponse } from "next/server";
import { getAIService } from "@/lib/ai/cloud-adapter";

export async function POST(req: Request) {
  try {
    const { text, craftType } = await req.json();

    const aiService = getAIService();
    const result = await aiService.generateCatalog(text || "", craftType || "");

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Catalog generation error:", error);
    return NextResponse.json(
      {
        error: "AI failed, enter manually",
      },
      { status: 500 }
    );
  }
}
