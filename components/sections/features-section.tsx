import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Trophy, BarChart3, Users } from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "Smart Quizzes",
      description: "AI-powered questions that adapt to your knowledge level"
    },
    {
      icon: <Trophy className="h-8 w-8 text-primary" />,
      title: "Achievement System",
      description: "Earn badges and track your progress across different topics"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "Detailed Analytics",
      description: "Get insights into your performance and areas for improvement"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Community Driven",
      description: "Join thousands of learners in our quiz community"
    }
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose TriviaMax?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform combines cutting-edge technology with engaging content to create 
            the ultimate learning experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}