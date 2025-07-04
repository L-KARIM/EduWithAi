import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { BookOpen, Brain, FileText, MessageSquare, Zap, Globe } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: FileText,
      title: "Smart Summaries",
      description: "Get concise, intelligent summaries of any text content",
    },
    {
      icon: Brain,
      title: "Key Concepts",
      description: "Extract and understand the main ideas and concepts",
    },
    {
      icon: MessageSquare,
      title: "Interactive Quizzes",
      description: "Test your knowledge with AI-generated quiz questions",
    },
    {
      icon: Zap,
      title: "Flashcards",
      description: "Create study flashcards for better retention",
    },
    {
      icon: BookOpen,
      title: "ELI5 Explanations",
      description: "Complex topics explained in simple, easy-to-understand language",
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Available in multiple languages for global accessibility",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Transform Learning with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Power</span>
          </h1>
          <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
            Upload any text or document and get instant summaries, flashcards, quizzes, and simplified explanations
            powered by advanced AI technology.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link href="/dashboard">
                Get Started
                <BookOpen className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Powerful Learning Features
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="transition-transform hover:scale-105">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
            <CardHeader>
              <CardTitle className="text-3xl">Ready to Supercharge Your Learning?</CardTitle>
              <CardDescription className="text-lg">
                Join thousands of students and professionals who are already using EduWithAi to learn faster and more
                effectively.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg" className="text-lg">
                <Link href="/dashboard">
                  Start Learning Now
                  <Zap className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
