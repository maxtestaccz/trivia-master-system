
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Plus, 
  Activity,
  TrendingUp,
  Clock
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuizzes: 0,
    totalQuestions: 0,
    activeUsers: 0,
    averageScore: 0,
    completionRate: 0,
  });

  const [recentActivity, setRecentActivity] = useState([
    { type: 'user_registered', user: 'John Doe', time: '2 minutes ago' },
    { type: 'quiz_completed', user: 'Jane Smith', quiz: 'Science Quiz', score: 85, time: '5 minutes ago' },
    { type: 'quiz_created', user: 'Admin', quiz: 'New Math Quiz', time: '1 hour ago' },
  ]);

  useEffect(() => {
    // Mock data loading - replace with actual API calls
    setStats({
      totalUsers: 1247,
      totalQuizzes: 45,
      totalQuestions: 892,
      activeUsers: 89,
      averageScore: 76,
      completionRate: 68,
    });
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registered':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'quiz_completed':
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'quiz_created':
        return <Plus className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}. Here's your system overview.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Quizzes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalQuestions} total questions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Currently online
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.completionRate}% completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" asChild>
                <Link to="/admin/quizzes/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Quiz
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/admin/questions/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Questions
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/admin/users">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/admin/reports">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Reports
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/admin/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest system activities and user interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {activity.type === 'user_registered' && `${activity.user} joined TriviaMax`}
                          {activity.type === 'quiz_completed' && 
                            `${activity.user} completed "${activity.quiz}"`}
                          {activity.type === 'quiz_created' && 
                            `${activity.user} created "${activity.quiz}"`}
                        </p>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {activity.time}
                        </span>
                      </div>
                      {activity.type === 'quiz_completed' && (
                        <div className="mt-1">
                          <Badge variant={activity.score >= 80 ? 'default' : 'secondary'}>
                            Score: {activity.score}%
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline" asChild>
                  <Link to="/admin/activity">View All Activity</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
