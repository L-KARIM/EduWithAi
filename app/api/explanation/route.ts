import { generateText } from "ai"
import { cohere } from "@ai-sdk/cohere"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, language = "en", difficulty = "intermediate" } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const languageInstruction =
      language === "fr" ? "Explain in French" : language === "ar" ? "Explain in Arabic" : "Explain in English"

    const { text: explanation } = await generateText({
      model: cohere("command-r-plus", {
        apiKey: "J6DKVTdem0n9xxU6dAvDyonjW7DgUxiwIzYZipz5",
      }),
      system: `You are an expert at explaining complex topics in simple terms. ${languageInstruction}. Explain the content as if you are talking to a 5-year-old, using simple language, analogies, and examples that are easy to understand.`,
      prompt: `Please explain the following text in very simple terms that a child could understand:\n\n${text}`,
    })

    return NextResponse.json({ result: explanation })
  } catch (error) {
    console.error("Explanation generation error:", error)
    return NextResponse.json({ error: "Failed to generate explanation" }, { status: 500 })
  }
}
