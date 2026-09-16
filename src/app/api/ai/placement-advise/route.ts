import { NextResponse } from "next/server";
import { getAIService } from "@/lib/ai/cloud-adapter";

export async function POST(req: Request) {
  try {
    const { roomImage, product } = await req.json();

    if (!roomImage) {
      return NextResponse.json(
        { error: "Room or wall image is required for placement analysis" },
        { status: 400 }
      );
    }

    const aiService = getAIService();
    const result = await aiService.placementAdvise(roomImage, product || {
      title: "Handcrafted Decor",
      category: "Art & Painting",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Placement advice error:", error);
    return NextResponse.json(
      { error: "Failed to generate placement advice." },
      { status: 500 }
    );
  }
}
