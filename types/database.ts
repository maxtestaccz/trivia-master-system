export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id: string
          name: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      question_options: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          is_correct: boolean | null
          question_id: string | null
          text: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_correct?: boolean | null
          question_id?: string | null
          text: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_correct?: boolean | null
          question_id?: string | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          created_at: string | null
          explanation: string | null
          id: string
          image_url: string | null
          order_index: number
          points: number | null
          question: string
          quiz_id: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          explanation?: string | null
          id?: string
          image_url?: string | null
          order_index: number
          points?: number | null
          question: string
          quiz_id?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          explanation?: string | null
          id?: string
          image_url?: string | null
          order_index?: number
          points?: number | null
          question?: string
          quiz_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty: string
          id: string
          image_url: string | null
          is_active: boolean | null
          show_answers: boolean | null
          tags: string[] | null
          time_limit: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          show_answers?: boolean | null
          tags?: string[] | null
          time_limit?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          show_answers?: boolean | null
          tags?: string[] | null
          time_limit?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_answers: {
        Row: {
          id: string
          is_correct: boolean | null
          progress_id: string | null
          question_id: string | null
          selected_options: string[] | null
          time_spent: number | null
        }
        Insert: {
          id?: string
          is_correct?: boolean | null
          progress_id?: string | null
          question_id?: string | null
          selected_options?: string[] | null
          time_spent?: number | null
        }
        Update: {
          id?: string
          is_correct?: boolean | null
          progress_id?: string | null
          question_id?: string | null
          selected_options?: string[] | null
          time_spent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_answers_progress_id_fkey"
            columns: ["progress_id"]
            isOneToOne: false
            referencedRelation: "user_progress"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_at: string | null
          correct_answers: number
          id: string
          quiz_id: string | null
          score: number
          time_spent: number | null
          total_questions: number
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          correct_answers: number
          id?: string
          quiz_id?: string | null
          score: number
          time_spent?: number | null
          total_questions: number
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          correct_answers?: number
          id?: string
          quiz_id?: string | null
          score?: number
          time_spent?: number | null
          total_questions?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never