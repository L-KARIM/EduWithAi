"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Volume2 } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { useToast } from "@/hooks/use-toast"

export function ExplanationOutput() {
  const { state } = useApp()
  const { toast } = useToast()

  const handleCopy = async () => {
    if (state.aiResponses.explanation) {
      await navigator.clipboard.writeText(state.aiResponses.explanation)
      toast({
        title: "Copied!",
        description: "Explanation copied to clipboard.",
      })
    }
  }

  const handleSpeak = () => {
    if (state.aiResponses.explanation && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(state.aiResponses.explanation)
      speechSynthesis.speak(utterance)
    }
  }

  if (!state.aiResponses.explanation) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Generate an ELI5 explanation to see it here</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Explain Like I'm 5</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSpeak}>
            <Volume2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="whitespace-pre-wrap text-lg leading-relaxed">{state.aiResponses.explanation}</p>
        </div>
      </CardContent>
    </Card>
  )
}
