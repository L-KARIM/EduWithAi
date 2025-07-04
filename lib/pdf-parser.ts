// Simple, robust PDF text extraction without workers
export async function extractTextFromPDF(file: File): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("PDF processing timed out after 30 seconds."))
    }, 30000)

    try {
      console.log("Starting PDF text extraction...")

      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)

      console.log("PDF loaded, analyzing structure...")

      // Try multiple extraction methods
      let extractedText = ""

      // Method 1: Look for uncompressed text streams
      extractedText = await extractUncompressedText(uint8Array)
      if (extractedText && extractedText.length > 50) {
        console.log("Uncompressed text extraction successful")
        clearTimeout(timeout)
        resolve(cleanText(extractedText))
        return
      }

      // Method 2: Extract from text objects with proper parsing
      extractedText = await extractFromTextObjects(uint8Array)
      if (extractedText && extractedText.length > 30) {
        console.log("Text objects extraction successful")
        clearTimeout(timeout)
        resolve(cleanText(extractedText))
        return
      }

      // Method 3: Simple readable text extraction
      extractedText = await extractReadableText(uint8Array)
      if (extractedText && extractedText.length > 20) {
        console.log("Readable text extraction successful")
        clearTimeout(timeout)
        resolve(cleanText(extractedText))
        return
      }

      clearTimeout(timeout)
      reject(
        new Error("No readable text found in this PDF. It may be image-based, encrypted, or use unsupported encoding."),
      )
    } catch (error) {
      clearTimeout(timeout)
      console.error("PDF extraction error:", error)
      reject(
        new Error("Failed to extract text from PDF: " + (error instanceof Error ? error.message : "Unknown error")),
      )
    }
  })
}

// Method 1: Extract uncompressed text streams
async function extractUncompressedText(uint8Array: Uint8Array): Promise<string> {
  try {
    const pdfString = new TextDecoder("latin1").decode(uint8Array)
    let text = ""

    // Look for stream objects that contain text
    const streamRegex = /stream\s*([\s\S]*?)\s*endstream/g
    let match

    while ((match = streamRegex.exec(pdfString)) !== null) {
      const streamContent = match[1]

      // Skip if it looks like compressed data (contains lots of non-printable chars)
      const printableRatio = (streamContent.match(/[\x20-\x7E]/g) || []).length / streamContent.length
      if (printableRatio < 0.3) continue

      // Extract text from BT...ET blocks within streams
      const textBlocks = streamContent.match(/BT\s*([\s\S]*?)\s*ET/g) || []

      for (const block of textBlocks) {
        // Look for text showing operators
        const textMatches = block.match(/$$(.*?)$$\s*Tj/g) || []
        for (const textMatch of textMatches) {
          const textContent = textMatch.match(/$$(.*?)$$/)?.[1]
          if (textContent) {
            text += decodeTextString(textContent) + " "
          }
        }

        // Also look for array text operators
        const arrayMatches = block.match(/\[(.*?)\]\s*TJ/g) || []
        for (const arrayMatch of arrayMatches) {
          const arrayContent = arrayMatch.match(/\[(.*?)\]/)?.[1]
          if (arrayContent) {
            // Extract strings from array
            const strings = arrayContent.match(/$$(.*?)$$/g) || []
            for (const str of strings) {
              const content = str.match(/$$(.*?)$$/)?.[1]
              if (content) {
                text += decodeTextString(content) + " "
              }
            }
          }
        }
      }

      if (text.length > 1000) break // Found enough text
    }

    return text.trim()
  } catch (error) {
    console.log("Uncompressed extraction failed:", error)
    return ""
  }
}

// Method 2: Extract from text objects with better parsing
async function extractFromTextObjects(uint8Array: Uint8Array): Promise<string> {
  try {
    let text = ""
    let i = 0
    const maxLength = Math.min(uint8Array.length, 1000000) // Limit to 1MB

    while (i < maxLength - 10) {
      // Look for "BT" (Begin Text)
      if (
        uint8Array[i] === 0x42 &&
        uint8Array[i + 1] === 0x54 &&
        (uint8Array[i + 2] === 0x20 || uint8Array[i + 2] === 0x0a || uint8Array[i + 2] === 0x0d)
      ) {
        i += 2
        let textObjectContent = ""
        const depth = 0

        // Extract until "ET" (End Text)
        while (i < maxLength - 2) {
          if (
            uint8Array[i] === 0x45 &&
            uint8Array[i + 1] === 0x54 &&
            (uint8Array[i + 2] === 0x20 || uint8Array[i + 2] === 0x0a || uint8Array[i + 2] === 0x0d)
          ) {
            break
          }

          textObjectContent += String.fromCharCode(uint8Array[i])
          i++

          if (textObjectContent.length > 5000) break // Prevent runaway
        }

        // Parse text from the text object
        const parsedText = parseTextFromObject(textObjectContent)
        if (parsedText) {
          text += parsedText + " "
        }
      } else {
        i++
      }

      if (text.length > 5000) break // Found enough text
    }

    return text.trim()
  } catch (error) {
    console.log("Text objects extraction failed:", error)
    return ""
  }
}

// Method 3: Extract readable text (fallback)
async function extractReadableText(uint8Array: Uint8Array): Promise<string> {
  try {
    let text = ""
    let currentWord = ""
    const maxLength = Math.min(uint8Array.length, 500000)

    for (let i = 0; i < maxLength; i++) {
      const char = uint8Array[i]

      // Letters and numbers
      if ((char >= 65 && char <= 90) || (char >= 97 && char <= 122) || (char >= 48 && char <= 57)) {
        currentWord += String.fromCharCode(char)
      } else {
        // End of word
        if (currentWord.length >= 3) {
          // Only words with 3+ characters
          text += currentWord + " "
        }
        currentWord = ""

        // Add punctuation and spaces
        if (char === 32 || char === 46 || char === 44 || char === 33 || char === 63) {
          text += String.fromCharCode(char)
        }
      }

      if (text.length > 3000) break // Limit output
    }

    // Add final word
    if (currentWord.length >= 3) {
      text += currentWord
    }

    return text.trim()
  } catch (error) {
    console.log("Readable text extraction failed:", error)
    return ""
  }
}

// Helper function to parse text from text object content
function parseTextFromObject(content: string): string {
  let text = ""

  try {
    // Look for text in parentheses followed by Tj
    const tjMatches = content.match(/$$(.*?)$$\s*Tj/g) || []
    for (const match of tjMatches) {
      const textContent = match.match(/$$(.*?)$$/)?.[1]
      if (textContent) {
        text += decodeTextString(textContent) + " "
      }
    }

    // Look for text arrays followed by TJ
    const tjArrayMatches = content.match(/\[(.*?)\]\s*TJ/g) || []
    for (const match of tjArrayMatches) {
      const arrayContent = match.match(/\[(.*?)\]/)?.[1]
      if (arrayContent) {
        const strings = arrayContent.match(/$$(.*?)$$/g) || []
        for (const str of strings) {
          const stringContent = str.match(/$$(.*?)$$/)?.[1]
          if (stringContent) {
            text += decodeTextString(stringContent) + " "
          }
        }
      }
    }

    return text.trim()
  } catch (error) {
    return ""
  }
}

// Helper function to decode PDF text strings
function decodeTextString(str: string): string {
  try {
    // Handle common PDF escape sequences
    return str
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t")
      .replace(/\\\\/g, "\\")
      .replace(/\\\(/g, "(")
      .replace(/\\\)/g, ")")
      .replace(/\\(\d{3})/g, (match, octal) => String.fromCharCode(Number.parseInt(octal, 8)))
      .replace(/[^\x20-\x7E\n\r\t]/g, "") // Remove non-printable characters
  } catch (error) {
    return str.replace(/[^\x20-\x7E\n\r\t]/g, "")
  }
}

// Helper function to clean extracted text
function cleanText(text: string): string {
  return text
    .replace(/\s+/g, " ") // Normalize whitespace
    .replace(/[^\w\s.,!?;:'"()-]/g, "") // Keep only common punctuation
    .trim()
}

export function validatePDFFile(file: File): { isValid: boolean; error?: string } {
  const isPDF = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")

  if (!isPDF) {
    return { isValid: false, error: "File must be a PDF document." }
  }

  // Reduced size limit for better performance
  const maxSize = 3 * 1024 * 1024 // 3MB
  if (file.size > maxSize) {
    return { isValid: false, error: "PDF must be smaller than 3 MB for optimal processing." }
  }

  if (file.size === 0) {
    return { isValid: false, error: "PDF appears to be empty." }
  }

  if (file.size < 100) {
    return { isValid: false, error: "File appears to be too small to be a valid PDF." }
  }

  return { isValid: true }
}

export async function isPDFFile(file: File): Promise<boolean> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    if (uint8Array.length < 4) return false

    // Check PDF header
    const header = String.fromCharCode(uint8Array[0], uint8Array[1], uint8Array[2], uint8Array[3])
    return header === "%PDF"
  } catch {
    return false
  }
}
