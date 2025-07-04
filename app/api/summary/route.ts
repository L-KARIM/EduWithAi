import { generateText } from "ai"
import { cohere } from "@ai-sdk/cohere"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, language = "en", difficulty = "intermediate" } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const difficultyPrompts = {
      beginner: "Create a simple, easy-to-understand summary using basic vocabulary",
      intermediate: "Create a comprehensive summary with moderate complexity",
      expert: "Create a detailed, technical summary with advanced terminology",
    }

    const { text: summary } = await generateText({
      model: cohere("command-r-plus", {
        apiKey: "YOUR_API_KEY",
      }),
      system: `You are an expert educational assistant. ${difficultyPrompts[difficulty as keyof typeof difficultyPrompts]} of the provided text. Keep it concise but informative. Respond in ${language === "fr" ? "French" : language === "ar" ? "Arabic" : "English"}.`,
      prompt: `Please summarize the following text:\n\n${text}`,
    })

    return NextResponse.json({ result: summary })
  } catch (error) {
    console.error("Summary generation error:", error)
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
  }
}
