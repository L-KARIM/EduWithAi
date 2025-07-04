"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useApp } from "@/contexts/app-context"

export function QuizOutput() {
  const { state } = useApp()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({})
  const [showResults, setShowResults] = useState(false)

  if (!state.aiResponses.quiz) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Generate quiz questions to see them here</p>
        </CardContent>
      </Card>
    )
  }

  const quiz = state.aiResponses.quiz
  const question = quiz[currentQuestion]

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answerIndex,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    let correct = 0
    quiz.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct) {
        correct++
      }
    })
    return correct
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="mb-4 text-3xl font-bold">
              {score}/{quiz.length}
            </div>
            <p className="text-muted-foreground">
              You got {score} out of {quiz.length} questions correct!
            </p>
            <Button
              onClick={() => {
                setCurrentQuestion(0)
                setSelectedAnswers({})
                setShowResults(false)
              }}
              className="mt-4"
            >
              Retake Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Question {currentQuestion + 1} of {quiz.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="text-lg font-medium">{question.question}</h3>

        <RadioGroup
          value={selectedAnswers[currentQuestion]?.toString()}
          onValueChange={(value) => handleAnswerSelect(Number.parseInt(value))}
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="flex-1">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <Button onClick={handleNext} disabled={selectedAnswers[currentQuestion] === undefined} className="w-full">
          {currentQuestion < quiz.length - 1 ? "Next Question" : "Finish Quiz"}
        </Button>
      </CardContent>
    </Card>
  )
}
