import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Brain, Play, ArrowRight } from 'lucide-react'
import { getUser } from '@/lib/auth'

export async function HeroSection() {
  const user = await getUser()

  const stats = [
    { label: "Active Users", value: "1,247+" },
    { label: "Quiz Categories", value: "12" },
    { label: "Questions", value: "8,500+" },
    { label: "Success Rate", value: "89%" }
  ]

  return (
    <section className="bg-gradient-to-br from-primary/20 via-background to-secondary/20 py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Brain className="h-16 w-16 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Master Knowledge with TriviaMax
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Challenge yourself with interactive quizzes, track your progress, and compete with friends. 
            Learn while having fun across dozens of categories.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {user ? (
              <Button size="lg" asChild>
                <Link href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}>
                  <Play className="h-5 w-5 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" asChild>
                  <Link href="/auth/register">
                    Get Started Free
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                
                <Button size="lg" variant="outline" asChild>
                  <Link href="/auth/login">
                    Sign In
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}