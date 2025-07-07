
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const CreateQuiz = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'medium',
    timeLimit: 30,
    showAnswers: true,
    isActive: true,
    tags: [] as string[]
  });
  const [newTag, setNewTag] = useState('');

  const categories = ['Programming', 'Geography', 'Science', 'History', 'Math', 'Languages'];
  const difficulties = ['easy', 'medium', 'hard'];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Mock API call - replace with actual implementation
    console.log('Creating quiz:', formData);
    
    toast({
      title: "Quiz created successfully!",
      description: "You can now add questions to your quiz."
    });

    // Navigate to quiz management or question creation
    navigate('/admin/quizzes');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Create New Quiz</h1>
        <p className="text-muted-foreground">Set up your quiz configuration and settings</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Quiz Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-2">
              <Label htmlFor="title">Quiz Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter quiz title..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what this quiz covers..."
                rows={3}
                required
              />
            </div>

            {/* Category and Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map(difficulty => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Time Limit */}
            <div className="space-y-2">
              <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
              <Input
                id="timeLimit"
                type="number"
                min="1"
                max="120"
                value={formData.timeLimit}
                onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value))}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Answers After Each Question</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to see correct answers and explanations
                  </p>
                </div>
                <Switch
                  checked={formData.showAnswers}
                  onCheckedChange={(checked) => handleInputChange('showAnswers', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Active Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Make quiz available to users immediately
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Create Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
