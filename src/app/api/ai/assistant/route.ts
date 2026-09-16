import { NextResponse } from "next/server";
import { getAIService } from "@/lib/ai/cloud-adapter";

export async function POST(req: Request) {
  try {
    const { query, context } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    const aiService = getAIService();
    const result = await aiService.askAssistant(query, context || {});

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Assistant API error:", error);
    return NextResponse.json(
      { reply: "I am having trouble connecting to your workshop records right now. Please try again." },
      { status: 500 }
    );
  }
}
