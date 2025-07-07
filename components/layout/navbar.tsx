import Link from 'next/link'
import { Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserNav } from '@/components/layout/user-nav'
import { getUser } from '@/lib/auth'

export async function Navbar() {
  const user = await getUser()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">TriviaMax</span>
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Button variant="ghost" asChild>
                <Link href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}>
                  Dashboard
                </Link>
              </Button>
              <UserNav user={user} />
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}