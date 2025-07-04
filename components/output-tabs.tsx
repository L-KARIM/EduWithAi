"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SummaryOutput } from "@/components/outputs/summary-output"
import { ConceptsOutput } from "@/components/outputs/concepts-output"
import { QuizOutput } from "@/components/outputs/quiz-output"
import { FlashcardsOutput } from "@/components/outputs/flashcards-output"
import { ExplanationOutput } from "@/components/outputs/explanation-output"
import { useApp } from "@/contexts/app-context"

export function OutputTabs() {
  const { state } = useApp()

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Generated Content</CardTitle>
        <CardDescription>Your learning materials will appear here after processing</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="concepts">Concepts</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
            <TabsTrigger value="flashcards">Cards</TabsTrigger>
            <TabsTrigger value="explanation">ELI5</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-4">
            <SummaryOutput />
          </TabsContent>

          <TabsContent value="concepts" className="mt-4">
            <ConceptsOutput />
          </TabsContent>

          <TabsContent value="quiz" className="mt-4">
            <QuizOutput />
          </TabsContent>

          <TabsContent value="flashcards" className="mt-4">
            <FlashcardsOutput />
          </TabsContent>

          <TabsContent value="explanation" className="mt-4">
            <ExplanationOutput />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
