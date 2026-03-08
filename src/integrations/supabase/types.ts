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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          activity_date: string
          activity_type: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          activity_date?: string
          activity_type?: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          activity_date?: string
          activity_type?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_replies: {
        Row: {
          admin_user_id: string
          created_at: string
          escalation_id: string
          id: string
          read_by_member: boolean
          reply_text: string
        }
        Insert: {
          admin_user_id: string
          created_at?: string
          escalation_id: string
          id?: string
          read_by_member?: boolean
          reply_text: string
        }
        Update: {
          admin_user_id?: string
          created_at?: string
          escalation_id?: string
          id?: string
          read_by_member?: boolean
          reply_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_replies_escalation_id_fkey"
            columns: ["escalation_id"]
            isOneToOne: false
            referencedRelation: "escalations"
            referencedColumns: ["id"]
          },
        ]
      }
      escalations: {
        Row: {
          created_at: string
          id: string
          member_note: string | null
          member_response: string | null
          question_text: string
          status: string
          updated_at: string
          user_id: string
          workbook_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          member_note?: string | null
          member_response?: string | null
          question_text: string
          status?: string
          updated_at?: string
          user_id: string
          workbook_name: string
        }
        Update: {
          created_at?: string
          id?: string
          member_note?: string | null
          member_response?: string | null
          question_text?: string
          status?: string
          updated_at?: string
          user_id?: string
          workbook_name?: string
        }
        Relationships: []
      }
      phase_unlocks: {
        Row: {
          id: string
          phase_number: number
          unlocked_at: string
          user_id: string
        }
        Insert: {
          id?: string
          phase_number: number
          unlocked_at?: string
          user_id: string
        }
        Update: {
          id?: string
          phase_number?: number
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          current_phase: number
          full_name: string
          id: string
          last_active_date: string | null
          longest_streak: number
          overall_progress: number
          streak_days: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_phase?: number
          full_name?: string
          id?: string
          last_active_date?: string | null
          longest_streak?: number
          overall_progress?: number
          streak_days?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_phase?: number
          full_name?: string
          id?: string
          last_active_date?: string | null
          longest_streak?: number
          overall_progress?: number
          streak_days?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tracker_budget: {
        Row: {
          amount: number
          category: string
          created_at: string
          id: string
          item_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          category?: string
          created_at?: string
          id?: string
          item_name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          id?: string
          item_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tracker_debts: {
        Row: {
          balance: number
          created_at: string
          creditor: string
          id: string
          interest_rate: number
          min_payment: number
          payoff_order: number
          total_paid: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          creditor?: string
          id?: string
          interest_rate?: number
          min_payment?: number
          payoff_order?: number
          total_paid?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          creditor?: string
          id?: string
          interest_rate?: number
          min_payment?: number
          payoff_order?: number
          total_paid?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tracker_goals: {
        Row: {
          created_at: string
          current_amount: number
          goal_name: string
          id: string
          monthly_contribution: number
          status: string
          target_amount: number
          target_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_amount?: number
          goal_name?: string
          id?: string
          monthly_contribution?: number
          status?: string
          target_amount?: number
          target_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_amount?: number
          goal_name?: string
          id?: string
          monthly_contribution?: number
          status?: string
          target_amount?: number
          target_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tracker_investment_history: {
        Row: {
          balance: number
          created_at: string
          id: string
          investment_id: string
          recorded_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          investment_id: string
          recorded_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          investment_id?: string
          recorded_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracker_investment_history_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "tracker_investments"
            referencedColumns: ["id"]
          },
        ]
      }
      tracker_investments: {
        Row: {
          account_type: string
          balance: number
          created_at: string
          id: string
          institution: string
          monthly_contribution: number
          updated_at: string
          user_id: string
        }
        Insert: {
          account_type?: string
          balance?: number
          created_at?: string
          id?: string
          institution?: string
          monthly_contribution?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          account_type?: string
          balance?: number
          created_at?: string
          id?: string
          institution?: string
          monthly_contribution?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tracker_net_worth: {
        Row: {
          assets: Json
          created_at: string
          id: string
          liabilities: Json
          net_worth: number
          recorded_at: string
          total_assets: number
          total_liabilities: number
          user_id: string
        }
        Insert: {
          assets?: Json
          created_at?: string
          id?: string
          liabilities?: Json
          net_worth?: number
          recorded_at?: string
          total_assets?: number
          total_liabilities?: number
          user_id: string
        }
        Update: {
          assets?: Json
          created_at?: string
          id?: string
          liabilities?: Json
          net_worth?: number
          recorded_at?: string
          total_assets?: number
          total_liabilities?: number
          user_id?: string
        }
        Relationships: []
      }
      tracker_savings: {
        Row: {
          created_at: string
          current_amount: number
          fund_name: string
          id: string
          is_emergency_fund: boolean
          monthly_contribution: number
          target_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_amount?: number
          fund_name?: string
          id?: string
          is_emergency_fund?: boolean
          monthly_contribution?: number
          target_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_amount?: number
          fund_name?: string
          id?: string
          is_emergency_fund?: boolean
          monthly_contribution?: number
          target_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_key: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_key: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_key?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workbook_completions: {
        Row: {
          completed_at: string
          id: string
          user_id: string
          workbook_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          user_id: string
          workbook_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          user_id?: string
          workbook_id?: string
        }
        Relationships: []
      }
      workbook_responses: {
        Row: {
          created_at: string
          id: string
          responses: Json
          updated_at: string
          user_id: string
          workbook_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          responses?: Json
          updated_at?: string
          user_id: string
          workbook_id: string
        }
        Update: {
          created_at?: string
          id?: string
          responses?: Json
          updated_at?: string
          user_id?: string
          workbook_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: { Args: { _role: string; _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "member"
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
      app_role: ["admin", "member"],
    },
  },
} as const
