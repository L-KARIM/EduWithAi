"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/contexts/app-context"

export function ConceptsOutput() {
  const { state } = useApp()

  if (!state.aiResponses.concepts) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Generate key concepts to see them here</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Concepts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {state.aiResponses.concepts.map((concept, index) => (
            <Badge key={index} variant="secondary" className="text-sm">
              {concept}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
