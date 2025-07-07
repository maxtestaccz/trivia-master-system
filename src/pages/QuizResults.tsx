
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuiz } from '@/contexts/QuizContext';
import { Trophy, Target, Clock, RotateCcw, Home } from 'lucide-react';

export const QuizResults = () => {
  const navigate = useNavigate();
  const { currentQuiz, userAnswers, resetQuiz } = useQuiz();

  if (!currentQuiz || userAnswers.length === 0) {
    navigate('/dashboard');
    return null;
  }

  const totalQuestions = currentQuiz.questions.length;
  const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  const totalPoints = userAnswers.reduce((sum, answer) => {
    const question = currentQuiz.questions.find(q => q.id === answer.questionId);
    return sum + (answer.isCorrect ? (question?.points || 0) : 0);
  }, 0);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { text: 'Excellent', variant: 'default' as const };
    if (score >= 80) return { text: 'Great', variant: 'default' as const };
    if (score >= 70) return { text: 'Good', variant: 'secondary' as const };
    if (score >= 60) return { text: 'Average', variant: 'secondary' as const };
    return { text: 'Needs Improvement', variant: 'destructive' as const };
  };

  const scoreBadge = getScoreBadge(score);

  const handleRetakeQuiz = () => {
    resetQuiz();
    navigate(`/quiz/${currentQuiz.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="mb-4">
          <Trophy className={`h-16 w-16 mx-auto ${getScoreColor(score)}`} />
        </div>
        <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
        <p className="text-muted-foreground">Here's how you performed</p>
      </div>

      <Card className="mb-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{currentQuiz.title}</CardTitle>
          <Badge variant={scoreBadge.variant} className="mx-auto">
            {scoreBadge.text}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(score)}`}>
              {score}%
            </div>
            <p className="text-muted-foreground">Final Score</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <Target className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{totalQuestions - correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-semibold">{totalPoints}</div>
              <div className="text-sm text-muted-foreground">Points Earned</div>
            </div>
            
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-semibold">{totalQuestions}</div>
              <div className="text-sm text-muted-foreground">Total Questions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Review */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Question Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentQuiz.questions.map((question, index) => {
              const userAnswer = userAnswers.find(a => a.questionId === question.id);
              return (
                <div key={question.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                      userAnswer?.isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-sm">Question {index + 1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={userAnswer?.isCorrect ? 'default' : 'destructive'}>
                      {userAnswer?.isCorrect ? 'Correct' : 'Incorrect'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {question.points} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleRetakeQuiz} variant="outline" className="flex-1">
          <RotateCcw className="h-4 w-4 mr-2" />
          Retake Quiz
        </Button>
        <Button onClick={() => navigate('/dashboard')} className="flex-1">
          <Home className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};
