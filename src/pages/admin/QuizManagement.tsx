
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Clock,
  BarChart3
} from 'lucide-react';

export const QuizManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  // Mock data - replace with actual API calls
  const mockQuizzes = [
    {
      id: '1',
      title: 'JavaScript Fundamentals',
      description: 'Test your basic JavaScript knowledge',
      category: 'Programming',
      difficulty: 'easy',
      timeLimit: 30,
      showAnswers: true,
      isActive: true,
      questionCount: 15,
      completions: 234,
      averageScore: 78,
      createdAt: new Date('2024-01-15'),
      tags: ['javascript', 'basics']
    },
    {
      id: '2',
      title: 'React Advanced Concepts',
      description: 'Deep dive into React hooks and patterns',
      category: 'Programming',
      difficulty: 'hard',
      timeLimit: 45,
      showAnswers: false,
      isActive: true,
      questionCount: 20,
      completions: 89,
      averageScore: 65,
      createdAt: new Date('2024-02-01'),
      tags: ['react', 'advanced']
    },
    {
      id: '3',
      title: 'World Geography',
      description: 'Test your knowledge of world capitals and landmarks',
      category: 'Geography',
      difficulty: 'medium',
      timeLimit: 25,
      showAnswers: true,
      isActive: false,
      questionCount: 12,
      completions: 156,
      averageScore: 72,
      createdAt: new Date('2024-01-20'),
      tags: ['geography', 'world']
    }
  ];

  const categories = ['Programming', 'Geography', 'Science', 'History'];
  const difficulties = ['easy', 'medium', 'hard'];

  const filteredQuizzes = mockQuizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || quiz.category === filterCategory;
    const matchesDifficulty = filterDifficulty === 'all' || quiz.difficulty === filterDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Quiz Management</h1>
          <Button asChild>
            <Link to="/admin/quizzes/create">
              <Plus className="h-4 w-4 mr-2" />
              Create New Quiz
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Difficulties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              {difficulties.map(difficulty => (
                <SelectItem key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <Card key={quiz.id} className={`${!quiz.isActive ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{quiz.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-3">
                    {quiz.description}
                  </p>
                </div>
                <Badge
                  variant={quiz.isActive ? 'default' : 'secondary'}
                  className="ml-2"
                >
                  {quiz.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="flex gap-2 mb-3">
                <Badge variant="outline">{quiz.category}</Badge>
                <Badge className={getDifficultyColor(quiz.difficulty)}>
                  {quiz.difficulty}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{quiz.completions} attempts</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <span>{quiz.averageScore}% avg</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{quiz.timeLimit}min</span>
                </div>
                <div>
                  <span>{quiz.questionCount} questions</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild className="flex-1">
                  <Link to={`/admin/quizzes/${quiz.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </Button>
                <Button size="sm" variant="outline" asChild className="flex-1">
                  <Link to={`/admin/quizzes/${quiz.id}/edit`}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                </Button>
                <Button size="sm" variant="outline" className="px-3">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No quizzes found matching your criteria</p>
          <Button asChild>
            <Link to="/admin/quizzes/create">Create Your First Quiz</Link>
          </Button>
        </div>
      )}
    </div>
  );
};
