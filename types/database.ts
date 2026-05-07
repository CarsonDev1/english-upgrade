export type Json = string | number | boolean | null | { [k: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          ipa_level: number;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          ipa_level?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          ipa_level?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      decks: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          color: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          color?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          color?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      vocabulary: {
        Row: {
          id: string;
          user_id: string;
          deck_id: string | null;
          word: string;
          ipa_uk: string | null;
          ipa_us: string | null;
          word_class: string | null;
          meaning_vi: string | null;
          definition_en: string | null;
          notes: string | null;
          ai_generated: boolean;
          ease_factor: number;
          interval_days: number;
          repetitions: number;
          next_review_at: string;
          last_reviewed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          deck_id?: string | null;
          word: string;
          ipa_uk?: string | null;
          ipa_us?: string | null;
          word_class?: string | null;
          meaning_vi?: string | null;
          definition_en?: string | null;
          notes?: string | null;
          ai_generated?: boolean;
          ease_factor?: number;
          interval_days?: number;
          repetitions?: number;
          next_review_at?: string;
          last_reviewed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          deck_id?: string | null;
          word?: string;
          ipa_uk?: string | null;
          ipa_us?: string | null;
          word_class?: string | null;
          meaning_vi?: string | null;
          definition_en?: string | null;
          notes?: string | null;
          ai_generated?: boolean;
          ease_factor?: number;
          interval_days?: number;
          repetitions?: number;
          next_review_at?: string;
          last_reviewed_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      examples: {
        Row: {
          id: string;
          vocabulary_id: string;
          sentence: string;
          translation_vi: string | null;
          ai_generated: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          vocabulary_id: string;
          sentence: string;
          translation_vi?: string | null;
          ai_generated?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          vocabulary_id?: string;
          sentence?: string;
          translation_vi?: string | null;
          ai_generated?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      review_logs: {
        Row: {
          id: string;
          vocabulary_id: string;
          user_id: string;
          rating: number;
          reviewed_at: string;
        };
        Insert: {
          id?: string;
          vocabulary_id: string;
          user_id: string;
          rating: number;
          reviewed_at?: string;
        };
        Update: {
          id?: string;
          vocabulary_id?: string;
          user_id?: string;
          rating?: number;
          reviewed_at?: string;
        };
        Relationships: [];
      };
      ipa_progress: {
        Row: {
          user_id: string;
          lesson_id: string;
          mastered_at: string;
        };
        Insert: {
          user_id: string;
          lesson_id: string;
          mastered_at?: string;
        };
        Update: {
          user_id?: string;
          lesson_id?: string;
          mastered_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [k: string]: never };
    Functions: { [k: string]: never };
    Enums: { [k: string]: never };
    CompositeTypes: { [k: string]: never };
  };
};

export type Vocabulary = Database["public"]["Tables"]["vocabulary"]["Row"];
export type Deck = Database["public"]["Tables"]["decks"]["Row"];
export type Example = Database["public"]["Tables"]["examples"]["Row"];
export type ReviewLog = Database["public"]["Tables"]["review_logs"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
