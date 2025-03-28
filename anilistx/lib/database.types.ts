export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      anime_lists: {
        Row: {
          id: string
          user_id: string
          anime_id: number
          status: string
          score: number | null
          episodes_watched: number
          is_rewatching: boolean
          times_rewatched: number
          start_date: string | null
          finish_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          anime_id: number
          status: string
          score?: number | null
          episodes_watched?: number
          is_rewatching?: boolean
          times_rewatched?: number
          start_date?: string | null
          finish_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          anime_id?: number
          status?: string
          score?: number | null
          episodes_watched?: number
          is_rewatching?: boolean
          times_rewatched?: number
          start_date?: string | null
          finish_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_reviews: {
        Row: {
          id: string
          user_id: string
          anime_id: number
          title: string
          review_text: string
          score: number
          contains_spoilers: boolean
          is_approved: boolean
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          anime_id: number
          title: string
          review_text: string
          score: number
          contains_spoilers?: boolean
          is_approved?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          anime_id?: number
          title?: string
          review_text?: string
          score?: number
          contains_spoilers?: boolean
          is_approved?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      review_ratings: {
        Row: {
          id: string
          review_id: string
          user_id: string
          is_helpful: boolean
          created_at: string
        }
        Insert: {
          id?: string
          review_id: string
          user_id: string
          is_helpful: boolean
          created_at?: string
        }
        Update: {
          id?: string
          review_id?: string
          user_id?: string
          is_helpful?: boolean
          created_at?: string
        }
      }
      review_comments: {
        Row: {
          id: string
          review_id: string
          user_id: string
          comment_text: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          review_id: string
          user_id: string
          comment_text: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          review_id?: string
          user_id?: string
          comment_text?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          user_id: string
          theme: string
          list_view_type: string
          items_per_page: number
          default_list: string
          privacy_setting: string
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          theme?: string
          list_view_type?: string
          items_per_page?: number
          default_list?: string
          privacy_setting?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          theme?: string
          list_view_type?: string
          items_per_page?: number
          default_list?: string
          privacy_setting?: string
          created_at?: string
          updated_at?: string
        }
      }
      custom_lists: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      custom_list_items: {
        Row: {
          id: string
          custom_list_id: string
          anime_id: number
          added_at: string
        }
        Insert: {
          id?: string
          custom_list_id: string
          anime_id: number
          added_at?: string
        }
        Update: {
          id?: string
          custom_list_id?: string
          anime_id?: number
          added_at?: string
        }
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
  }
} 