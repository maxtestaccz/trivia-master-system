
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Brain, 
  Trophy, 
  Users, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Play,
  BarChart3
} from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

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
  ];

  const stats = [
    { label: "Active Users", value: "1,247+" },
    { label: "Quiz Categories", value: "12" },
    { label: "Questions", value: "8,500+" },
    { label: "Success Rate", value: "89%" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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
                  <Link to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}>
                    <Play className="h-5 w-5 mr-2" />
                    Go to Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild>
                    <Link to="/auth/register">
                      Get Started Free
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/auth/login">
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

      {/* Features Section */}
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

      {/* Categories Preview */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Popular Categories</h2>
            <p className="text-muted-foreground">
              Explore quizzes across a wide range of topics and difficulty levels
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Science", count: 150, color: "bg-blue-500" },
              { name: "History", count: 200, color: "bg-green-500" },
              { name: "Sports", count: 120, color: "bg-orange-500" },
              { name: "Technology", count: 180, color: "bg-purple-500" },
              { name: "Arts", count: 90, color: "bg-pink-500" },
              { name: "Geography", count: 110, color: "bg-yellow-500" }
            ].map((category, index) => (
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

      {/* CTA Section */}
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
            
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/auth/register">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Create Free Account
                  </Link>
                </Button>
                
                <Button size="lg" variant="outline" asChild>
                  <Link to="/auth/login" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    Sign In
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
