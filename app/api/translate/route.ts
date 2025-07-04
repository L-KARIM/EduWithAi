import { generateText } from "ai"
import { cohere } from "@ai-sdk/cohere"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage = "en" } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const languageMap = {
      en: "English",
      fr: "French",
      ar: "Arabic",
    }

    const targetLang = languageMap[targetLanguage as keyof typeof languageMap] || "English"

    const { text: translation } = await generateText({
      model: cohere("command-r-plus"),
      system: `You are an expert translator. Translate the provided text accurately to ${targetLang} while maintaining the original meaning and context.`,
      prompt: `Please translate the following text to ${targetLang}:\n\n${text}`,
      apiKey: "J6DKVTdem0n9xxU6dAvDyonjW7DgUxiwIzYZipz5",
    })

    return NextResponse.json({ result: translation })
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json({ error: "Failed to translate text" }, { status: 500 })
  }
}
