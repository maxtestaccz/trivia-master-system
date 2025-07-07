
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { QuizProvider } from "@/contexts/QuizContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import Index from "./pages/Index";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { Dashboard } from "./pages/Dashboard";
import { Profile } from "./pages/Profile";
import { QuizTaking } from "./pages/QuizTaking";
import { QuizResults } from "./pages/QuizResults";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { QuizManagement } from "./pages/admin/QuizManagement";
import { CreateQuiz } from "./pages/admin/CreateQuiz";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <QuizProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  
                  {/* Auth Routes */}
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/auth/register" element={<Register />} />
                  
                  {/* User Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/quiz/:quizId"
                    element={
                      <ProtectedRoute>
                        <QuizTaking />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/quiz-results"
                    element={
                      <ProtectedRoute>
                        <QuizResults />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Admin Routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/quizzes"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <QuizManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/quizzes/create"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <CreateQuiz />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </QuizProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
