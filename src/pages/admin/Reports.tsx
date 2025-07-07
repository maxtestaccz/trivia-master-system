
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Download,
  Calendar,
  Trophy,
  BookOpen
} from 'lucide-react';

export const Reports = () => {
  const [timeRange, setTimeRange] = useState('30');
  const [reportType, setReportType] = useState('overview');

  // Mock data - replace with actual API calls
  const overviewStats = {
    totalUsers: 1247,
    activeUsers: 89,
    totalQuizzes: 45,
    completedQuizzes: 2341,
    averageScore: 76,
    completionRate: 68,
  };

  const topQuizzes = [
    { name: 'JavaScript Fundamentals', attempts: 234, avgScore: 78, difficulty: 'easy' },
    { name: 'React Advanced Concepts', attempts: 189, avgScore: 65, difficulty: 'hard' },
    { name: 'World Geography', attempts: 156, avgScore: 72, difficulty: 'medium' },
    { name: 'Science Basics', attempts: 143, avgScore: 81, difficulty: 'easy' },
    { name: 'Advanced Mathematics', attempts: 98, avgScore: 58, difficulty: 'hard' },
  ];

  const topUsers = [
    { name: 'Alice Johnson', quizzesCompleted: 23, avgScore: 89, totalPoints: 2047 },
    { name: 'Bob Smith', quizzesCompleted: 21, avgScore: 85, totalPoints: 1785 },
    { name: 'Carol Williams', quizzesCompleted: 19, avgScore: 92, totalPoints: 1748 },
    { name: 'David Brown', quizzesCompleted: 18, avgScore: 78, totalPoints: 1404 },
    { name: 'Eva Davis', quizzesCompleted: 17, avgScore: 83, totalPoints: 1411 },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportReport = () => {
    // Mock export functionality
    const data = reportType === 'quizzes' ? topQuizzes : topUsers;
    console.log('Exporting report:', { reportType, timeRange, data });
    // In a real app, this would generate and download a CSV/PDF
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <Button onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="quizzes">Quiz Performance</SelectItem>
              <SelectItem value="users">User Performance</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {reportType === 'overview' && (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quiz Completions</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats.completedQuizzes.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {overviewStats.completionRate}% completion rate
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Quizzes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Top Performing Quizzes
                </CardTitle>
                <CardDescription>Most popular quizzes by completion rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topQuizzes.slice(0, 5).map((quiz, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{quiz.name}</span>
                          <Badge className={getDifficultyColor(quiz.difficulty)}>
                            {quiz.difficulty}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {quiz.attempts} attempts • {quiz.avgScore}% avg score
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Top Performers
                </CardTitle>
                <CardDescription>Users with highest scores and completion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topUsers.slice(0, 5).map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.quizzesCompleted} quizzes • {user.avgScore}% avg
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{user.totalPoints}</div>
                        <div className="text-sm text-muted-foreground">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {reportType === 'quizzes' && (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Performance Report</CardTitle>
            <CardDescription>Detailed performance metrics for all quizzes</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quiz Name</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead>Avg Score</TableHead>
                  <TableHead>Completion Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topQuizzes.map((quiz, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{quiz.name}</TableCell>
                    <TableCell>
                      <Badge className={getDifficultyColor(quiz.difficulty)}>
                        {quiz.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>{quiz.attempts}</TableCell>
                    <TableCell>{quiz.avgScore}%</TableCell>
                    <TableCell>{Math.round((quiz.attempts / 300) * 100)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {reportType === 'users' && (
        <Card>
          <CardHeader>
            <CardTitle>User Performance Report</CardTitle>
            <CardDescription>Detailed performance metrics for all users</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>Quizzes Completed</TableHead>
                  <TableHead>Average Score</TableHead>
                  <TableHead>Total Points</TableHead>
                  <TableHead>Join Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topUsers.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.quizzesCompleted}</TableCell>
                    <TableCell>{user.avgScore}%</TableCell>
                    <TableCell>{user.totalPoints}</TableCell>
                    <TableCell>Jan 15, 2024</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
