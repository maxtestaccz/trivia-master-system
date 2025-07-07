
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useQuiz } from '@/contexts/QuizContext';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, CheckCircle, XCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const QuizTaking = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    currentQuiz, 
    currentQuestionIndex, 
    userAnswers, 
    timeRemaining, 
    isQuizStarted,
    isQuizCompleted,
    startQuiz,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    completeQuiz
  } = useQuiz();

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  // Mock quiz data - replace with actual API call
  const mockQuiz = {
    id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Test your JavaScript knowledge',
    category: 'Programming',
    difficulty: 'medium' as const,
    timeLimit: 30,
    showAnswers: true,
    isActive: true,
    createdBy: 'admin',
    createdAt: new Date(),
    tags: ['javascript', 'programming'],
    questions: [
      {
        id: '1',
        quizId: '1',
        type: 'single' as const,
        question: 'What is the correct way to declare a variable in JavaScript?',
        options: [
          { id: '1', text: 'var myVar = 5;' },
          { id: '2', text: 'variable myVar = 5;' },
          { id: '3', text: 'v myVar = 5;' },
          { id: '4', text: 'declare myVar = 5;' }
        ],
        correctAnswers: ['1'],
        explanation: 'The var keyword is used to declare variables in JavaScript.',
        points: 10,
        order: 1
      },
      {
        id: '2',
        quizId: '1',
        type: 'multiple' as const,
        question: 'Which of the following are JavaScript data types?',
        options: [
          { id: '5', text: 'String' },
          { id: '6', text: 'Number' },
          { id: '7', text: 'Boolean' },
          { id: '8', text: 'Integer' }
        ],
        correctAnswers: ['5', '6', '7'],
        explanation: 'JavaScript has String, Number, and Boolean as primitive data types. Integer is not a separate type.',
        points: 15,
        order: 2
      }
    ]
  };

  useEffect(() => {
    if (!isQuizStarted && mockQuiz) {
      startQuiz(mockQuiz);
    }
  }, []);

  const currentQuestion = currentQuiz?.questions[currentQuestionIndex];
  const progress = currentQuiz ? ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100 : 0;

  const handleOptionSelect = (optionId: string) => {
    if (currentQuestion?.type === 'single') {
      setSelectedOptions([optionId]);
    } else if (currentQuestion?.type === 'multiple') {
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    }
  };

  const handleSubmitAnswer = () => {
    if (!currentQuestion || selectedOptions.length === 0) {
      toast({
        title: "Please select an answer",
        variant: "destructive"
      });
      return;
    }

    submitAnswer(currentQuestion.id, selectedOptions);
    
    if (currentQuiz?.showAnswers) {
      setShowExplanation(true);
    } else {
      handleNextQuestion();
    }
  };

  const handleNextQuestion = () => {
    setSelectedOptions([]);
    setShowExplanation(false);
    
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
      nextQuestion();
    } else {
      completeQuiz();
      navigate('/quiz-results');
    }
  };

  const isAnswerCorrect = (optionId: string) => {
    return currentQuestion?.correctAnswers.includes(optionId);
  };

  const getUserAnswer = () => {
    return userAnswers.find(answer => answer.questionId === currentQuestion?.id);
  };

  if (!currentQuiz || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{currentQuiz.title}</h1>
          <div className="flex items-center gap-4">
            {timeRemaining > 0 && (
              <div className="flex items-center gap-2 text-orange-600">
                <Clock className="h-4 w-4" />
                <span className="font-mono">{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
              </div>
            )}
            <Badge variant="outline">
              {currentQuestionIndex + 1} of {currentQuiz.questions.length}
            </Badge>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">
            {currentQuestion.question}
          </CardTitle>
          {currentQuestion.imageUrl && (
            <img 
              src={currentQuestion.imageUrl} 
              alt="Question image" 
              className="w-full max-w-md mx-auto rounded-lg"
            />
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOptions.includes(option.id);
            const isCorrect = isAnswerCorrect(option.id);
            const userAnswer = getUserAnswer();
            const showResult = showExplanation && userAnswer;

            return (
              <div
                key={option.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  showResult
                    ? isCorrect
                      ? 'bg-green-50 border-green-200'
                      : isSelected && !isCorrect
                      ? 'bg-red-50 border-red-200'
                      : 'bg-gray-50'
                    : isSelected
                    ? 'bg-primary/10 border-primary'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => !showExplanation && handleOptionSelect(option.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      currentQuestion.type === 'single' ? 'rounded-full' : 'rounded'
                    } ${isSelected ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <span>{option.text}</span>
                  </div>
                  {showResult && (
                    <div>
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : isSelected ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Explanation */}
      {showExplanation && currentQuestion.explanation && (
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Explanation:</h3>
            <p className="text-gray-700">{currentQuestion.explanation}</p>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => previousQuestion()}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {showExplanation ? (
          <Button onClick={handleNextQuestion}>
            {currentQuestionIndex === currentQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmitAnswer} disabled={selectedOptions.length === 0}>
            Submit Answer
          </Button>
        )}
      </div>
    </div>
  );
};
