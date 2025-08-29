
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      bookmark: {
        Row: {
          created_at: string
          isbn: number
          user_id: string
        }
        Insert: {
          created_at?: string
          isbn?: number
          user_id: string
        }
        Update: {
          created_at?: string
          isbn?: number
          user_id?: string
        }
        Relationships: []
      }
      books: {
        Row: {
          author: string
          book_name: string
          created_at: string
          desc: string
          id: number
          image_url: string
          keyword: string
          library_code: string
          publication_date: string
          publisher: string
        }
        Insert: {
          author: string
          book_name: string
          created_at?: string
          desc: string
          id?: number
          image_url: string
          keyword: string
          library_code: string
          publication_date: string
          publisher: string
        }
        Update: {
          author?: string
          book_name?: string
          created_at?: string
          desc?: string
          id?: number
          image_url?: string
          keyword?: string
          library_code?: string
          publication_date?: string
          publisher?: string
        }
        Relationships: []
      }
      medal: {
        Row: {
          condition: string
          created_at: string
          id: number
          name: string
        }
        Insert: {
          condition: string
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          condition?: string
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      mission: {
        Row: {
          content: string
          created_at: string
          id: number
          score: number
          type: number
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          score: number
          type: number
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          score?: number
          type?: number
        }
        Relationships: []
      }
      review: {
        Row: {
          content: string
          created_at: string
          id: number
          image_url: string
          isbn: string
          score: number
          title: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          image_url: string
          isbn: string
          score: number
          title?: string | null
          user_id?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          image_url?: string
          isbn?: string
          score?: number
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_keyword: {
        Row: {
          created_at: string
          id: number
          isbn: number
          keyword_1: string | null
          keyword_2: string | null
          keyword_3: string | null
          keyword_4: string | null
          keyword_5: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          isbn: number
          keyword_1?: string | null
          keyword_2?: string | null
          keyword_3?: string | null
          keyword_4?: string | null
          keyword_5?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          isbn?: number
          keyword_1?: string | null
          keyword_2?: string | null
          keyword_3?: string | null
          keyword_4?: string | null
          keyword_5?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_medal: {
        Row: {
          created_at: string
          id: number
          medal_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          medal_id: number
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          medal_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_medal_medal_id_fkey"
            columns: ["medal_id"]
            isOneToOne: false
            referencedRelation: "medal"
            referencedColumns: ["id"]
          },
        ]
      }
      user_mission: {
        Row: {
          created_at: string
          id: number
          mission_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          mission_id: number
        }
        Update: {
          created_at?: string
          id?: number
          mission_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_mission_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "mission"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile: {
        Row: {
          created_at: string
          email: string | null
          id: string
          nickname: string
          profile_image: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          nickname: string
          profile_image: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          nickname?: string
          profile_image?: string
        }
        Relationships: []
      }
    }
    Views: {
  v_bookmark_books: {
    Row: {
      bookmark_id: number
      bookmarked_at: string
      user_id: string
      book_id: number
      book_created_at: string
      isbn13: string
      book_name: string
      image_url: string
      authors: string
      publisher: string
      publication_date: string
      description: string
      library_code: string
      keyword: string
    }
  }
      // [_ in never]: never
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
