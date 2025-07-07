
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Quiz, Question, UserAnswer } from '@/types';

interface QuizContextType {
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  timeRemaining: number;
  isQuizStarted: boolean;
  isQuizCompleted: boolean;
  startQuiz: (quiz: Quiz) => void;
  submitAnswer: (questionId: string, selectedOptions: string[]) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const startQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTimeRemaining(quiz.timeLimit ? quiz.timeLimit * 60 : 0);
    setIsQuizStarted(true);
    setIsQuizCompleted(false);
  };

  const submitAnswer = (questionId: string, selectedOptions: string[]) => {
    const question = currentQuiz?.questions.find(q => q.id === questionId);
    if (!question) return;

    const isCorrect = question.correctAnswers.every(correct => 
      selectedOptions.includes(correct)
    ) && selectedOptions.length === question.correctAnswers.length;

    const answer: UserAnswer = {
      questionId,
      selectedOptions,
      isCorrect,
      timeSpent: 0, // This would be calculated based on actual time
    };

    setUserAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== questionId);
      return [...filtered, answer];
    });
  };

  const nextQuestion = () => {
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const completeQuiz = () => {
    setIsQuizCompleted(true);
    setIsQuizStarted(false);
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTimeRemaining(0);
    setIsQuizStarted(false);
    setIsQuizCompleted(false);
  };

  const value = {
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
    completeQuiz,
    resetQuiz,
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};
