import { Card, CardContent } from '@/components/ui/card'
import { Zap } from 'lucide-react'

export function CategoriesSection() {
  const categories = [
    { name: "Science", count: 150, color: "bg-blue-500" },
    { name: "History", count: 200, color: "bg-green-500" },
    { name: "Sports", count: 120, color: "bg-orange-500" },
    { name: "Technology", count: 180, color: "bg-purple-500" },
    { name: "Arts", count: 90, color: "bg-pink-500" },
    { name: "Geography", count: 110, color: "bg-yellow-500" }
  ]

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Popular Categories</h2>
          <p className="text-muted-foreground">
            Explore quizzes across a wide range of topics and difficulty levels
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 rounded-full ${category.color} mx-auto mb-3 flex items-center justify-center`}>
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count} quizzes</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}