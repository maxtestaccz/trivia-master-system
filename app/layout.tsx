import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TriviaMax - Master Knowledge with Interactive Quizzes",
  description: "Challenge yourself with interactive quizzes, track your progress, and compete with friends. Learn while having fun across dozens of categories.",
  keywords: ["quiz", "trivia", "education", "learning", "knowledge", "test"],
  authors: [{ name: "TriviaMax Team" }],
  openGraph: {
    title: "TriviaMax - Master Knowledge with Interactive Quizzes",
    description: "Challenge yourself with interactive quizzes, track your progress, and compete with friends.",
    type: "website",
    images: [
      {
        url: "https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=1200",
        width: 1200,
        height: 630,
        alt: "TriviaMax Quiz Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TriviaMax - Master Knowledge with Interactive Quizzes",
    description: "Challenge yourself with interactive quizzes, track your progress, and compete with friends.",
    images: ["https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=1200"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}