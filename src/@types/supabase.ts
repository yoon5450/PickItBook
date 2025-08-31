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
          book_id: number
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          book_id: number
          created_at?: string
          id?: number
          user_id: string
        }
        Update: {
          book_id?: number
          created_at?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmark_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmark_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "v_bookmark_books"
            referencedColumns: ["book_id"]
          },
        ]
      }
      books: {
        Row: {
          authors: string
          book_name: string
          created_at: string
          desc: string
          id: number
          image_url: string
          isbn13: string
          keyword: string
          library_code: string
          publication_date: string
          publisher: string
        }
        Insert: {
          authors: string
          book_name: string
          created_at?: string
          desc: string
          id?: number
          image_url: string
          isbn13: string
          keyword: string
          library_code: string
          publication_date: string
          publisher: string
        }
        Update: {
          authors?: string
          book_name?: string
          created_at?: string
          desc?: string
          id?: number
          image_url?: string
          isbn13?: string
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
          image_url: string | null
          isbn13: string
          like_count: number
          score: number
          title: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          image_url?: string | null
          isbn13: string
          like_count?: number
          score: number
          title?: string | null
          user_id?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          image_url?: string | null
          isbn13?: string
          like_count?: number
          score?: number
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      review_likes: {
        Row: {
          created_at: string
          id: number
          review_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          review_id: number
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          review_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_likes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "review"
            referencedColumns: ["id"]
          },
        ]
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
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          mission_id: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          mission_id?: number
          user_id?: string | null
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
          authors: string | null
          book_created_at: string | null
          book_id: number | null
          book_name: string | null
          bookmark_id: number | null
          bookmarked_at: string | null
          description: string | null
          image_url: string | null
          isbn13: string | null
          keyword: string | null
          library_code: string | null
          publication_date: string | null
          publisher: string | null
          user_id: string | null
        }
        Relationships: []
      }
      v_user_mission: {
        Row: {
          content: string | null
          created_at: string | null
          id: number | null
          mission_id: number | null
          score: number | null
          type: number | null
          user_id: string | null
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
    }
    Functions: {
      debug_like_state: {
        Args: { p_review_id: number }
        Returns: {
          i_liked: boolean
          me: string
          total_likes: number
        }[]
      }
      get_reviews_by_isbn: {
        Args: { p_isbn13: string; p_limit?: number; p_offset?: number }
        Returns: {
          content: string
          created_at: string
          id: number
          image_url: string
          isbn13: string
          like_count: number
          liked_by_me: boolean
          nickname: string
          profile_image: string
          score: number
          title: string
          user_id: string
        }[]
      }
      toggle_like: {
        Args: { p_review_id: number }
        Returns: {
          like_count: number
          liked: boolean
        }[]
      }
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
