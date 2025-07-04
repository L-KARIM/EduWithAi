// Fallback PDF parser using a different approach
export async function extractTextFromPDFSimple(file: File): Promise<string> {
  try {
    // This is a simple approach that works with basic PDFs
    const formData = new FormData()
    formData.append("pdf", file)

    // For now, we'll use a client-side approach
    // In production, you might want to use a server-side PDF parser

    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    // Simple text extraction - this is basic and won't work for all PDFs
    let text = ""
    let inTextObject = false
    let currentText = ""

    for (let i = 0; i < uint8Array.length - 1; i++) {
      const char = String.fromCharCode(uint8Array[i])
      const nextChar = String.fromCharCode(uint8Array[i + 1])

      if (char === "B" && nextChar === "T") {
        inTextObject = true
        continue
      }

      if (char === "E" && nextChar === "T") {
        inTextObject = false
        if (currentText.trim()) {
          text += currentText.trim() + " "
          currentText = ""
        }
        continue
      }

      if (inTextObject && char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126) {
        currentText += char
      }
    }

    // Clean up the extracted text
    text = text
      .replace(/\s+/g, " ")
      .replace(/[^\w\s.,!?;:()-]/g, "")
      .trim()

    if (text.length < 10) {
      throw new Error("Could not extract meaningful text from this PDF")
    }

    return text
  } catch (error) {
    throw new Error("Failed to parse PDF file")
  }
}
