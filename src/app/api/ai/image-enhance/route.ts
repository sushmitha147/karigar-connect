import { NextResponse } from "next/server";
import { getAIService } from "@/lib/ai/cloud-adapter";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "Image is required for AI Studio enhancement" },
        { status: 400 }
      );
    }

    const aiService = getAIService();
    const result = await aiService.enhanceImage(image);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Image enhance error:", error);
    return NextResponse.json(
      {
        originalUrl: "",
        enhancedUrl: "",
        stepsApplied: [],
        success: false,
        message: "AI failed, enter manually",
      },
      { status: 200 }
    );
  }
}
