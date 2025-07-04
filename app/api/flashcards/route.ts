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
      language === "fr"
        ? "Create flashcards in French"
        : language === "ar"
          ? "Create flashcards in Arabic"
          : "Create flashcards in English"

    const { text: flashcardsText } = await generateText({
      model: cohere("command-r-plus", {
        apiKey: "J6DKVTdem0n9xxU6dAvDyonjW7DgUxiwIzYZipz5",
      }),
      system: `You are an expert at creating educational flashcards. ${languageInstruction}. Create flashcards with key terms and their definitions from the provided text. 

Format each flashcard exactly like this:
TERM: [Term or concept]
DEFINITION: [Clear, concise definition]

TERM: [Next term]
DEFINITION: [Next definition]

Continue this format for all flashcards.`,
      prompt: `Create flashcards from this text: ${text}`,
    })

    // Parse the flashcards text into structured format
    const flashcards = []
    const blocks = flashcardsText.split("TERM:").filter((block) => block.trim())

    for (const block of blocks) {
      const lines = block.split("DEFINITION:")
      if (lines.length >= 2) {
        const term = lines[0].trim()
        const definition = lines[1].split("TERM:")[0].trim()

        if (term && definition) {
          flashcards.push({ term, definition })
        }
      }
    }

    // Fallback if parsing fails
    if (flashcards.length === 0) {
      return NextResponse.json({
        result: [
          {
            term: "Key Concept",
            definition: "A main idea or important point from the text",
          },
        ],
      })
    }

    return NextResponse.json({ result: flashcards })
  } catch (error) {
    console.error("Flashcards generation error:", error)
    return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 })
  }
}
