import { NextResponse } from "next/server";
import { getAIService } from "@/lib/ai/cloud-adapter";

export async function POST(req: Request) {
  try {
    const { audioData, languageHint } = await req.json();

    const aiService = getAIService();
    const result = await aiService.transcribeAudio(audioData || "", languageHint || "en");

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      {
        transcript: "",
        detectedLanguage: "en",
        confidence: 0,
        message: "AI failed, enter manually",
      },
      { status: 200 }
    );
  }
}
