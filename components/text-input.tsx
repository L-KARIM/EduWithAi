"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, File, X } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { useToast } from "@/hooks/use-toast"
import { extractTextFromPDF, validatePDFFile, isPDFFile } from "@/lib/pdf-parser"
import { Progress } from "@/components/ui/progress"

export function TextInput() {
  const { state, dispatch } = useApp()
  const { toast } = useToast()
  const [text, setText] = useState("")
  const [outputType, setOutputType] = useState("summary")
  const [uploadedFileName, setUploadedFileName] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessingFile, setIsProcessingFile] = useState(false)
  const [processingStatus, setProcessingStatus] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log("File selected:", file.name, file.type, "Size:", file.size)

    setIsProcessingFile(true)
    setUploadProgress(0)
    setProcessingStatus("Starting...")

    try {
      if (file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt")) {
        await handleTextFile(file)
      } else if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        await handlePDFFile(file)
      } else {
        throw new Error("Unsupported file type. Please upload a .txt or .pdf file.")
      }
    } catch (error) {
      console.error("File upload error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to process the file"

      toast({
        title: "Upload Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsProcessingFile(false)
      setUploadProgress(0)
      setProcessingStatus("")

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleTextFile = async (file: File) => {
    setProcessingStatus("Reading text file...")
    setUploadProgress(20)

    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader()

      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = 20 + (e.loaded / e.total) * 60
          setUploadProgress(progress)
        }
      }

      reader.onload = (e) => {
        try {
          const fileContent = e.target?.result as string

          if (!fileContent || fileContent.trim().length === 0) {
            reject(new Error("The text file appears to be empty"))
            return
          }

          setUploadProgress(90)
          console.log("Text file loaded, length:", fileContent.length)

          setText(fileContent)
          dispatch({ type: "SET_TEXT", payload: fileContent })
          setUploadedFileName(file.name)
          setUploadProgress(100)

          toast({
            title: "Text File Uploaded Successfully!",
            description: `Loaded ${file.name} (${fileContent.length.toLocaleString()} characters)`,
          })

          resolve()
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => {
        reject(new Error("Failed to read the text file"))
      }

      reader.readAsText(file)
    })
  }

  const handlePDFFile = async (file: File) => {
    try {
      setProcessingStatus("Validating PDF...")
      setUploadProgress(10)

      const validation = validatePDFFile(file)
      if (!validation.isValid) {
        throw new Error(validation.error)
      }

      setProcessingStatus("Checking PDF format...")
      setUploadProgress(20)

      const isValidPDF = await isPDFFile(file)
      if (!isValidPDF) {
        throw new Error("File does not appear to be a valid PDF document.")
      }

      setProcessingStatus("Extracting text from PDF...")
      setUploadProgress(30)

      // Progress simulation during extraction
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev < 80) return prev + 3
          return prev
        })
      }, 800)

      const extractedText = await extractTextFromPDF(file)
      clearInterval(progressInterval)

      setUploadProgress(90)

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error(
          "No readable text could be extracted from this PDF. It might be:\n" +
            "• An image-based PDF (scanned document)\n" +
            "• Password-protected or encrypted\n" +
            "• Using unsupported text encoding\n" +
            "• Corrupted or malformed",
        )
      }

      if (extractedText.length < 20) {
        throw new Error("Very little text was extracted. The PDF might be image-based or have complex formatting.")
      }

      // Check if extracted text looks like garbage (too many special characters)
      const printableRatio = (extractedText.match(/[a-zA-Z0-9\s.,!?;:'"()-]/g) || []).length / extractedText.length
      if (printableRatio < 0.7) {
        throw new Error(
          "The extracted text appears to be encoded or corrupted. This PDF may use unsupported text encoding.",
        )
      }

      console.log("PDF text extracted successfully, length:", extractedText.length)

      setText(extractedText)
      dispatch({ type: "SET_TEXT", payload: extractedText })
      setUploadedFileName(file.name)
      setUploadProgress(100)

      toast({
        title: "PDF Uploaded Successfully!",
        description: `Extracted text from ${file.name} (${extractedText.length.toLocaleString()} characters)`,
      })
    } catch (error) {
      console.error("PDF processing error:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      throw new Error(errorMessage)
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    if (uploadedFileName) {
      setUploadedFileName("")
    }
  }

  const clearText = () => {
    setText("")
    setUploadedFileName("")
    dispatch({ type: "SET_TEXT", payload: "" })
  }

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast({
        title: "No Text Provided",
        description: "Please enter some text or upload a file first.",
        variant: "destructive",
      })
      return
    }

    if (text.length > 50000) {
      toast({
        title: "Text Too Long",
        description: "Please limit your text to 50,000 characters for optimal processing.",
        variant: "destructive",
      })
      return
    }

    dispatch({ type: "SET_LOADING", payload: true })
    dispatch({ type: "SET_TEXT", payload: text })

    try {
      console.log(`Generating ${outputType} for text length:`, text.length)

      const response = await fetch(`/api/${outputType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
          language: state.language,
          difficulty: state.difficulty,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate content")
      }

      const data = await response.json()

      dispatch({
        type: "SET_AI_RESPONSE",
        payload: { type: outputType, data: data.result },
      })

      toast({
        title: "Success!",
        description: `${outputType.charAt(0).toUpperCase() + outputType.slice(1)} generated successfully.`,
      })
    } catch (error) {
      console.error("Generation error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to generate content"

      dispatch({
        type: "SET_ERROR",
        payload: errorMessage,
      })

      toast({
        title: "Generation Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = Array.from(e.dataTransfer.files)
    const file = files[0]

    if (file) {
      const fakeEvent = {
        target: { files: [file] },
      } as React.ChangeEvent<HTMLInputElement>

      handleFileUpload(fakeEvent)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Input Text</CardTitle>
        <CardDescription>Paste your text below, upload a document, or drag & drop files</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text-input">Text Content</Label>
          <div className="relative" onDragOver={handleDragOver} onDrop={handleDrop}>
            <Textarea
              id="text-input"
              placeholder="Paste your text here, upload a file, or drag & drop files..."
              value={text}
              onChange={handleTextChange}
              className="min-h-[200px]"
              disabled={isProcessingFile}
            />
            {isProcessingFile && (
              <div className="absolute inset-0 bg-background/90 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center space-y-3 p-4">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{processingStatus}</p>
                    <Progress value={uploadProgress} className="w-48" />
                    <p className="text-xs text-muted-foreground">{uploadProgress}% complete</p>
                  </div>
                </div>
              </div>
            )}
            {text && !isProcessingFile && (
              <Button variant="ghost" size="sm" onClick={clearText} className="absolute top-2 right-2">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {uploadedFileName && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <File className="h-4 w-4" />
              <span>Loaded: {uploadedFileName}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
            disabled={isProcessingFile}
          >
            <Upload className="h-4 w-4" />
            {isProcessingFile ? "Processing..." : "Upload File"}
          </Button>
          <input ref={fileInputRef} type="file" accept=".txt,.pdf" onChange={handleFileUpload} className="hidden" />
          <span className="text-sm text-muted-foreground">Supports .txt and .pdf files (max 3MB)</span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="output-type">Output Type</Label>
          <Select value={outputType} onValueChange={setOutputType}>
            <SelectTrigger>
              <SelectValue placeholder="Select output type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summary">Summary</SelectItem>
              <SelectItem value="concepts">Key Concepts</SelectItem>
              <SelectItem value="explanation">ELI5 Explanation</SelectItem>
              <SelectItem value="quiz">Quiz Questions</SelectItem>
              <SelectItem value="flashcards">Flashcards</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={state.isLoading || !text.trim() || isProcessingFile}
          className="w-full"
        >
          {state.isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating {outputType}...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Generate {outputType.charAt(0).toUpperCase() + outputType.slice(1)}
            </>
          )}
        </Button>

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Character count: {text.length.toLocaleString()}</span>
          {text.length > 40000 && (
            <span className="text-amber-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Large text - processing may take longer
            </span>
          )}
        </div>

        {text.length > 50000 && (
          <div className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            Text exceeds 50,000 character limit. Please reduce the content.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
