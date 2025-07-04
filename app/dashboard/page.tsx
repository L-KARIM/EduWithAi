"use client"
import { Navigation } from "@/components/navigation"
import { TextInput } from "@/components/text-input"
import { OutputTabs } from "@/components/output-tabs"
import { useApp } from "@/contexts/app-context"

export default function DashboardPage() {
  const { state } = useApp()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-bold">AI Learning Dashboard</h1>
            <p className="text-muted-foreground">
              Upload text or documents to generate summaries, flashcards, quizzes, and more
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Input Section */}
            <div className="space-y-6">
              <TextInput />
            </div>

            {/* Output Section */}
            <div className="space-y-6">
              <OutputTabs />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
