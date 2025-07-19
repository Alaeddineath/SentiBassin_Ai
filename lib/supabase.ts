import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database schema types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: string
          profile_image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: string
          profile_image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: string
          profile_image?: string | null
          updated_at?: string
        }
      }
      bassins: {
        Row: {
          id: string
          name: string
          location: string
          fish_type: string
          capacity: string
          status: "excellent" | "good" | "warning" | "poor"
          description: string
          date_created: string
          user_id: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          fish_type: string
          capacity: string
          status?: "excellent" | "good" | "warning" | "poor"
          description: string
          date_created?: string
          user_id: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string
          fish_type?: string
          capacity?: string
          status?: "excellent" | "good" | "warning" | "poor"
          description?: string
          user_id?: string
          is_active?: boolean
          updated_at?: string
        }
      }
      water_quality_readings: {
        Row: {
          id: string
          bassin_id: string
          timestamp: string
          temperature: number
          turbidity: number
          dissolved_oxygen: number
          bod: number
          co2: number
          ph: number
          alkalinity: number
          hardness: number
          calcium: number
          ammonia: number
          nitrite: number
          phosphorus: number
          h2s: number
          plankton: number
          water_quality: "Excellent" | "Good" | "Fair" | "Poor"
          status: string
          active_alerts: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          bassin_id: string
          timestamp?: string
          temperature: number
          turbidity: number
          dissolved_oxygen: number
          bod: number
          co2: number
          ph: number
          alkalinity: number
          hardness: number
          calcium: number
          ammonia: number
          nitrite: number
          phosphorus: number
          h2s: number
          plankton: number
          water_quality: "Excellent" | "Good" | "Fair" | "Poor"
          status: string
          active_alerts: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          bassin_id?: string
          timestamp?: string
          temperature?: number
          turbidity?: number
          dissolved_oxygen?: number
          bod?: number
          co2?: number
          ph?: number
          alkalinity?: number
          hardness?: number
          calcium?: number
          ammonia?: number
          nitrite?: number
          phosphorus?: number
          h2s?: number
          plankton?: number
          water_quality?: "Excellent" | "Good" | "Fair" | "Poor"
          status?: string
          active_alerts?: number
          notes?: string | null
        }
      }
      alerts: {
        Row: {
          id: string
          bassin_id: string
          bassin_name: string
          type: "danger" | "warning" | "info"
          category: "water_quality" | "system" | "maintenance" | "alert"
          title: string
          message: string
          timestamp: string
          is_read: boolean
          priority: "high" | "medium" | "low"
          parameters: any | null
          action_required: boolean
          auto_generated: boolean
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          bassin_id: string
          bassin_name: string
          type: "danger" | "warning" | "info"
          category: "water_quality" | "system" | "maintenance" | "alert"
          title: string
          message: string
          timestamp?: string
          is_read?: boolean
          priority: "high" | "medium" | "low"
          parameters?: any | null
          action_required: boolean
          auto_generated: boolean
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          bassin_id?: string
          bassin_name?: string
          type?: "danger" | "warning" | "info"
          category?: "water_quality" | "system" | "maintenance" | "alert"
          title?: string
          message?: string
          timestamp?: string
          is_read?: boolean
          priority?: "high" | "medium" | "low"
          parameters?: any | null
          action_required?: boolean
          auto_generated?: boolean
          user_id?: string
        }
      }
    }
  }
}
