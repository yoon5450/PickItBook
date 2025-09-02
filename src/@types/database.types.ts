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
          book_id: number | null
          created_at: string
          id: number
          isbn13: string | null
          user_id: string
        }
        Insert: {
          book_id?: number | null
          created_at?: string
          id?: number
          isbn13?: string | null
          user_id?: string
        }
        Update: {
          book_id?: number | null
          created_at?: string
          id?: number
          isbn13?: string | null
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
      task_bundle_items: {
        Row: {
          bundle_id: number
          template_id: number
        }
        Insert: {
          bundle_id: number
          template_id: number
        }
        Update: {
          bundle_id?: number
          template_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "task_bundle_items_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "task_bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_bundle_items_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "task_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      task_bundles: {
        Row: {
          active: boolean
          id: number
          name: string
          version: number
          weight: number
        }
        Insert: {
          active?: boolean
          id?: number
          name: string
          version?: number
          weight?: number
        }
        Update: {
          active?: boolean
          id?: number
          name?: string
          version?: number
          weight?: number
        }
        Relationships: []
      }
      task_rewards: {
        Row: {
          granted_at: string | null
          id: number
          reward: Json
          scope_id: string | null
          template_id: number
          user_id: string
        }
        Insert: {
          granted_at?: string | null
          id?: number
          reward: Json
          scope_id?: string | null
          template_id: number
          user_id: string
        }
        Update: {
          granted_at?: string | null
          id?: number
          reward?: Json
          scope_id?: string | null
          template_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_rewards_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "task_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      task_templates: {
        Row: {
          active: boolean | null
          code: string
          description: string | null
          id: number
          kind: Database["public"]["Enums"]["task_kind"]
          name: string
          reward: Json
          rule: Json
          scope: Database["public"]["Enums"]["task_scope"]
          valid_from: string | null
          valid_to: string | null
          version: number | null
          weight: number | null
        }
        Insert: {
          active?: boolean | null
          code: string
          description?: string | null
          id?: number
          kind: Database["public"]["Enums"]["task_kind"]
          name: string
          reward: Json
          rule: Json
          scope: Database["public"]["Enums"]["task_scope"]
          valid_from?: string | null
          valid_to?: string | null
          version?: number | null
          weight?: number | null
        }
        Update: {
          active?: boolean | null
          code?: string
          description?: string | null
          id?: number
          kind?: Database["public"]["Enums"]["task_kind"]
          name?: string
          reward?: Json
          rule?: Json
          scope?: Database["public"]["Enums"]["task_scope"]
          valid_from?: string | null
          valid_to?: string | null
          version?: number | null
          weight?: number | null
        }
        Relationships: []
      }
      user_book_task_assignment: {
        Row: {
          book_id: string
          bundle_id: number
          created_at: string | null
          id: number
          user_id: string
        }
        Insert: {
          book_id: string
          bundle_id: number
          created_at?: string | null
          id?: number
          user_id: string
        }
        Update: {
          book_id?: string
          bundle_id?: number
          created_at?: string | null
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_book_task_assignment_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "task_bundles"
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
      user_task_event_log: {
        Row: {
          created_at: string | null
          event_key: string
          user_task_id: number | null
        }
        Insert: {
          created_at?: string | null
          event_key: string
          user_task_id?: number | null
        }
        Update: {
          created_at?: string | null
          event_key?: string
          user_task_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_task_event_log_user_task_id_fkey"
            columns: ["user_task_id"]
            isOneToOne: false
            referencedRelation: "user_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tasks: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          id: number
          progress: Json | null
          scope_id: string
          scope_type: Database["public"]["Enums"]["task_scope"]
          template_id: number
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          id?: number
          progress?: Json | null
          scope_id?: string
          scope_type: Database["public"]["Enums"]["task_scope"]
          template_id: number
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          id?: number
          progress?: Json | null
          scope_id?: string
          scope_type?: Database["public"]["Enums"]["task_scope"]
          template_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tasks_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "task_templates"
            referencedColumns: ["id"]
          },
        ]
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
    }
    Functions: {
      api_assign_book_tasks: {
        Args: { p_isbn13: string; p_user_id?: string }
        Returns: {
          assignment_id: number
          bundle_id: number
        }[]
      }
      api_list_book_missions: {
        Args: { p_auto_assign?: boolean; p_isbn13: string; p_user_id?: string }
        Returns: {
          assigned: boolean
          bundle_id: number
          code: string
          completed: boolean
          completed_at: string
          description: string
          name: string
          progress: Json
          reward: Json
          template_id: number
        }[]
      }
      api_process_event: {
        Args: {
          p_emit_followups?: boolean
          p_payload: Json
          p_type: string
          p_user_id?: string
        }
        Returns: undefined
      }
      api_rule_checklist: {
        Args: {
          p_emit_followups: boolean
          p_kind: string
          p_payload: Json
          p_reward: Json
          p_rule: Json
          p_scope: string
          p_scope_id: string
          p_template_id: number
          p_type: string
          p_user_id: string
        }
        Returns: undefined
      }
      api_rule_count_event: {
        Args: {
          p_emit_followups: boolean
          p_kind: string
          p_payload: Json
          p_reward: Json
          p_rule: Json
          p_scope: string
          p_scope_id: string
          p_template_id: number
          p_type: string
          p_user_id: string
        }
        Returns: undefined
      }
      api_rule_streak: {
        Args: {
          p_emit_followups: boolean
          p_kind: string
          p_payload: Json
          p_reward: Json
          p_rule: Json
          p_scope: string
          p_scope_id: string
          p_template_id: number
          p_type: string
          p_user_id: string
        }
        Returns: undefined
      }
      debug_like_state: {
        Args: { p_review_id: number }
        Returns: {
          i_liked: boolean
          me: string
          total_likes: number
        }[]
      }
      fn_isbn_hash: {
        Args: { p_isbn: string }
        Returns: number
      }
      fn_pick_bundle_by_isbn: {
        Args: { p_isbn: string }
        Returns: number
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
      task_kind: "mission" | "achievement"
      task_scope: "book" | "global"
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
    Enums: {
      task_kind: ["mission", "achievement"],
      task_scope: ["book", "global"],
    },
  },
} as const
