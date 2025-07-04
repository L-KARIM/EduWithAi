import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Zap, Globe, Shield, Users, Lightbulb } from "lucide-react"

export default function AboutPage() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Advanced GPT models analyze your content and generate personalized learning materials.",
    },
    {
      icon: Zap,
      title: "Instant Generation",
      description: "Get summaries, flashcards, and quizzes in seconds, not hours.",
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Learn in your preferred language with support for English, French, and Arabic.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data is processed securely and never stored permanently.",
    },
    {
      icon: Users,
      title: "For Everyone",
      description: "Perfect for students, professionals, and lifelong learners.",
    },
    {
      icon: Lightbulb,
      title: "Adaptive Learning",
      description: "Content difficulty adjusts to your learning level and preferences.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold">About EduWithAi</h1>
            <p className="text-xl text-muted-foreground">Revolutionizing education through artificial intelligence</p>
          </div>

          {/* Mission Statement */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                EduWithAi is designed to democratize learning by making educational content more accessible, engaging,
                and personalized. We believe that everyone deserves access to high-quality learning tools, regardless of
                their background or learning style. Our AI-powered platform transforms any text into multiple learning
                formats, helping you understand and retain information more effectively.
              </p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="mb-12">
            <h2 className="mb-8 text-center text-3xl font-bold">Why Choose EduWithAi?</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

          {/* Technology Stack */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Powered by Advanced AI</CardTitle>
              <CardDescription>Built with cutting-edge technology for the best learning experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-lg font-semibold">AI Models</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Cohere Command-R-Plus</Badge>
                    <Badge variant="secondary">Advanced Language Models</Badge>
                    <Badge variant="secondary">Natural Language Processing</Badge>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Text Summarization</Badge>
                    <Badge variant="outline">Concept Extraction</Badge>
                    <Badge variant="outline">Quiz Generation</Badge>
                    <Badge variant="outline">Flashcard Creation</Badge>
                    <Badge variant="outline">ELI5 Explanations</Badge>
                    <Badge variant="outline">Multilingual Support</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">Input Your Content</h3>
                  <p className="text-muted-foreground">
                    Paste text or upload documents (PDF, TXT) that you want to learn from.
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">AI Processing</h3>
                  <p className="text-muted-foreground">
                    Our advanced AI analyzes your content and generates personalized learning materials.
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">Learn & Practice</h3>
                  <p className="text-muted-foreground">
                    Study with summaries, flashcards, quizzes, and simplified explanations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
