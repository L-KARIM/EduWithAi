"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"

interface AppState {
  language: "en" | "fr" | "ar"
  difficulty: "beginner" | "intermediate" | "expert"
  darkMode: boolean
  currentText: string
  aiResponses: {
    summary?: string
    concepts?: string[]
    explanation?: string
    quiz?: QuizQuestion[]
    flashcards?: Flashcard[]
  }
  isLoading: boolean
  error?: string
}

interface QuizQuestion {
  question: string
  options: string[]
  correct: number
}

interface Flashcard {
  term: string
  definition: string
}

type AppAction =
  | { type: "SET_LANGUAGE"; payload: "en" | "fr" | "ar" }
  | { type: "SET_DIFFICULTY"; payload: "beginner" | "intermediate" | "expert" }
  | { type: "TOGGLE_DARK_MODE" }
  | { type: "SET_TEXT"; payload: string }
  | { type: "SET_AI_RESPONSE"; payload: { type: string; data: any } }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }

const initialState: AppState = {
  language: "en",
  difficulty: "intermediate",
  darkMode: false,
  currentText: "",
  aiResponses: {},
  isLoading: false,
}

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_LANGUAGE":
      return { ...state, language: action.payload }
    case "SET_DIFFICULTY":
      return { ...state, difficulty: action.payload }
    case "TOGGLE_DARK_MODE":
      return { ...state, darkMode: !state.darkMode }
    case "SET_TEXT":
      return { ...state, currentText: action.payload }
    case "SET_AI_RESPONSE":
      return {
        ...state,
        aiResponses: {
          ...state.aiResponses,
          [action.payload.type]: action.payload.data,
        },
      }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false }
    case "CLEAR_ERROR":
      return { ...state, error: undefined }
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
