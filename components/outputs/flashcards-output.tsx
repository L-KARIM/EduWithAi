"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import { useApp } from "@/contexts/app-context"

export function FlashcardsOutput() {
  const { state } = useApp()
  const [currentCard, setCurrentCard] = useState(0)
  const [flipped, setFlipped] = useState(false)

  if (!state.aiResponses.flashcards) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Generate flashcards to see them here</p>
        </CardContent>
      </Card>
    )
  }

  const flashcards = state.aiResponses.flashcards
  const card = flashcards[currentCard]

  const handleNext = () => {
    setCurrentCard((prev) => (prev + 1) % flashcards.length)
    setFlipped(false)
  }

  const handlePrevious = () => {
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length)
    setFlipped(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Card {currentCard + 1} of {flashcards.length}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className={`flip-card h-64 w-full cursor-pointer ${flipped ? "flipped" : ""}`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className="flip-card-inner relative h-full w-full">
          <Card
            className={`flip-card-front absolute inset-0 flex items-center justify-center ${flipped ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
          >
            <CardContent className="text-center p-6">
              <h3 className="text-xl font-semibold mb-4">{card.term}</h3>
              <p className="text-sm text-muted-foreground">Click to reveal definition</p>
            </CardContent>
          </Card>

          <Card
            className={`flip-card-back absolute inset-0 flex items-center justify-center ${flipped ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
          >
            <CardContent className="text-center p-6">
              <p className="text-lg mb-4">{card.definition}</p>
              <p className="text-sm text-muted-foreground">Click to see term</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-center">
        <Button variant="outline" onClick={() => setFlipped(!flipped)}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Flip Card
        </Button>
      </div>
    </div>
  )
}
