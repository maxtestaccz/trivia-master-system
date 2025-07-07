
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { Brain, Trophy, Target, Clock, TrendingUp, BookOpen } from 'lucide-react';
import { Quiz } from '@/types';

// Mock data - replace with actual API calls
const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'General Knowledge',
    description: 'Test your knowledge across various topics',
    category: 'General',
    difficulty: 'medium',
    timeLimit: 10,
    showAnswers: true,
    isActive: true,
    questions: [],
    createdBy: 'admin',
    createdAt: new Date(),
    tags: ['general', 'knowledge'],
  },
  {
    id: '2',
    title: 'Science & Technology',
    description: 'Explore the world of science and tech',
    category: 'Science',
    difficulty: 'hard',
    timeLimit: 15,
    showAnswers: true,
    isActive: true,
    questions: [],
    createdBy: 'admin',
    createdAt: new Date(),
    tags: ['science', 'technology'],
  },
];

export const Dashboard = () => {
  const { user } = useAuth();
  const [recommendedQuizzes, setRecommendedQuizzes] = useState<Quiz[]>([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0,
    totalTime: 0,
  });

  useEffect(() => {
    // Mock data loading
    setRecommendedQuizzes(mockQuizzes);
    setStats({
      totalQuizzes: 15,
      completedQuizzes: 8,
      averageScore: 78,
      totalTime: 240, // minutes
    });
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">Ready to challenge yourself with some quizzes?</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedQuizzes} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <Progress value={stats.averageScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(stats.totalTime / 60)}h {stats.totalTime % 60}m</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievement</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Badges earned
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Quizzes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Recommended for You
              </CardTitle>
              <CardDescription>
                Quizzes picked based on your interests and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendedQuizzes.map((quiz) => (
                  <div key={quiz.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold">{quiz.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{quiz.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{quiz.category}</Badge>
                        <Badge className={getDifficultyColor(quiz.difficulty)}>
                          {quiz.difficulty}
                        </Badge>
                        {quiz.timeLimit && (
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {quiz.timeLimit}min
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button asChild>
                      <Link to={`/quiz/${quiz.id}`}>Start Quiz</Link>
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline" asChild>
                  <Link to="/quizzes">Browse All Quizzes</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Progress */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Science Quiz</p>
                    <p className="text-sm text-muted-foreground">Scored 85%</p>
                  </div>
                  <Badge className="bg-green-500">+12 pts</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">History Quiz</p>
                    <p className="text-sm text-muted-foreground">Scored 72%</p>
                  </div>
                  <Badge className="bg-blue-500">+8 pts</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Math Quiz</p>
                    <p className="text-sm text-muted-foreground">Scored 91%</p>
                  </div>
                  <Badge className="bg-purple-500">+15 pts</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link to="/quizzes">Browse Quizzes</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/profile">View Profile</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/achievements">My Achievements</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
