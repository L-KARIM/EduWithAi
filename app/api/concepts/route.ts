import { generateText } from "ai"
import { cohere } from "@ai-sdk/cohere"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, language = "en", difficulty = "intermediate" } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const { text: conceptsText } = await generateText({
      model: cohere("command-r-plus", {
        apiKey: "J6DKVTdem0n9xxU6dAvDyonjW7DgUxiwIzYZipz5",
      }),
      system: `You are an expert educational assistant. Extract the key concepts from the provided text. Return them as a simple list, one concept per line. Respond in ${language === "fr" ? "French" : language === "ar" ? "Arabic" : "English"}.`,
      prompt: `Extract the main concepts from this text and list them one per line:\n\n${text}`,
    })

    // Parse the concepts from the text response
    const concepts = conceptsText
      .split("\n")
      .map((line) => line.replace(/^[-•*]\s*/, "").trim())
      .filter((line) => line.length > 0)
      .slice(0, 10) // Limit to 10 concepts

    return NextResponse.json({ result: concepts })
  } catch (error) {
    console.error("Concepts generation error:", error)
    return NextResponse.json({ error: "Failed to generate concepts" }, { status: 500 })
  }
}
