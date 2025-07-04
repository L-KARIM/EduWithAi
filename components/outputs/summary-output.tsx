"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Download } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { useToast } from "@/hooks/use-toast"

export function SummaryOutput() {
  const { state } = useApp()
  const { toast } = useToast()

  const handleCopy = async () => {
    if (state.aiResponses.summary) {
      await navigator.clipboard.writeText(state.aiResponses.summary)
      toast({
        title: "Copied!",
        description: "Summary copied to clipboard.",
      })
    }
  }

  if (!state.aiResponses.summary) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Generate a summary to see it here</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Summary</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="whitespace-pre-wrap">{state.aiResponses.summary}</p>
        </div>
      </CardContent>
    </Card>
  )
}
