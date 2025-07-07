import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import { getUser } from '@/lib/auth'

export async function CTASection() {
  const user = await getUser()

  if (user) {
    return null // Don't show CTA if user is already logged in
  }

  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto text-primary-foreground">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Test Your Knowledge?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of learners who are already improving their skills with TriviaMax. 
            Start your journey today!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/register">
                <CheckCircle className="h-5 w-5 mr-2" />
                Create Free Account
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}