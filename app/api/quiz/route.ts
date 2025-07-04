import { generateText } from "ai"
import { cohere } from "@ai-sdk/cohere"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, language = "en", difficulty = "intermediate" } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const difficultyLevel = {
      beginner: "basic level questions",
      intermediate: "moderate difficulty questions",
      expert: "advanced and challenging questions",
    }

    const languageInstruction =
      language === "fr"
        ? "Create questions in French"
        : language === "ar"
          ? "Create questions in Arabic"
          : "Create questions in English"

    const { text: quizText } = await generateText({
      model: cohere("command-r-plus", {
        apiKey: "J6DKVTdem0n9xxU6dAvDyonjW7DgUxiwIzYZipz5",
      }),
      system: `You are an expert quiz creator. Generate exactly 5 multiple choice questions based on the provided text. ${languageInstruction}. Create ${difficultyLevel[difficulty as keyof typeof difficultyLevel]}.

Format each question exactly like this:
Q1: [Question text]
A) [Option 1]
B) [Option 2] 
C) [Option 3]
D) [Option 4]
CORRECT: [A, B, C, or D]

Q2: [Question text]
A) [Option 1]
B) [Option 2]
C) [Option 3] 
D) [Option 4]
CORRECT: [A, B, C, or D]

Continue this format for all 5 questions.`,
      prompt: `Create 5 multiple choice questions based on this text: ${text}`,
    })

    // Parse the quiz text into structured format
    const questions = []
    const questionBlocks = quizText.split(/Q\d+:/).filter((block) => block.trim())

    for (let i = 0; i < Math.min(questionBlocks.length, 5); i++) {
      const block = questionBlocks[i].trim()
      const lines = block.split("\n").filter((line) => line.trim())

      if (lines.length >= 6) {
        const question = lines[0].trim()
        const options = []
        let correctIndex = 0

        for (let j = 1; j < lines.length; j++) {
          const line = lines[j].trim()
          if (line.match(/^[A-D]\)/)) {
            options.push(line.substring(2).trim())
          } else if (line.startsWith("CORRECT:")) {
            const correctLetter = line.split(":")[1].trim()
            correctIndex = ["A", "B", "C", "D"].indexOf(correctLetter)
          }
        }

        if (options.length === 4) {
          questions.push({
            question,
            options,
            correct: Math.max(0, correctIndex),
          })
        }
      }
    }

    // Fallback if parsing fails
    if (questions.length === 0) {
      return NextResponse.json({
        result: [
          {
            question: "What is the main topic of the provided text?",
            options: ["Topic A", "Topic B", "Topic C", "Topic D"],
            correct: 0,
          },
        ],
      })
    }

    return NextResponse.json({ result: questions })
  } catch (error) {
    console.error("Quiz generation error:", error)
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 })
  }
}
