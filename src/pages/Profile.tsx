
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Mail, 
  Calendar, 
  Trophy, 
  Target, 
  Clock, 
  BarChart3,
  Star,
  Award
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  // Mock user stats - replace with actual data
  const userStats = {
    totalQuizzes: 25,
    averageScore: 78,
    timeSpent: 450, // minutes
    correctAnswers: 892,
    streakDays: 7,
    rank: 'Intermediate',
    achievements: [
      { id: '1', name: 'First Quiz', description: 'Completed your first quiz', icon: '🎯', unlockedAt: new Date('2024-01-15') },
      { id: '2', name: 'Speed Demon', description: 'Completed 5 quizzes in one day', icon: '⚡', unlockedAt: new Date('2024-02-01') },
      { id: '3', name: 'Knowledge Seeker', description: 'Attempted 25 different quizzes', icon: '📚', unlockedAt: new Date('2024-02-15') }
    ],
    recentQuizzes: [
      { id: '1', title: 'JavaScript Fundamentals', score: 85, completedAt: new Date('2024-02-20'), category: 'Programming' },
      { id: '2', title: 'World Geography', score: 72, completedAt: new Date('2024-02-19'), category: 'Geography' },
      { id: '3', title: 'Science Basics', score: 91, completedAt: new Date('2024-02-18'), category: 'Science' }
    ]
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(profileData);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">View and manage your quiz performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <CardTitle>{user.name}</CardTitle>
              <Badge variant="secondary">{userStats.rank}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} size="sm">Save</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{user.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined {user.createdAt.toLocaleDateString()}</span>
                  </div>
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="w-full">
                    Edit Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats and Activity */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="stats" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{userStats.totalQuizzes}</div>
                    <div className="text-sm text-muted-foreground">Quizzes</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className={`text-2xl font-bold ${getScoreColor(userStats.averageScore)}`}>
                      {userStats.averageScore}%
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Score</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{Math.floor(userStats.timeSpent / 60)}h</div>
                    <div className="text-sm text-muted-foreground">Time Spent</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{userStats.correctAnswers}</div>
                    <div className="text-sm text-muted-foreground">Correct</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              <div className="grid gap-4">
                {userStats.achievements.map((achievement) => (
                  <Card key={achievement.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{achievement.name}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Unlocked on {achievement.unlockedAt.toLocaleDateString()}
                          </p>
                        </div>
                        <Award className="h-6 w-6 text-yellow-500" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <div className="space-y-4">
                {userStats.recentQuizzes.map((quiz) => (
                  <Card key={quiz.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{quiz.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{quiz.category}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {quiz.completedAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getScoreColor(quiz.score)}`}>
                            {quiz.score}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
