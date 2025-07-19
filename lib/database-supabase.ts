import { supabase } from "./supabase"

export class SupabaseDatabase {
  // User methods
  async findUserByEmail(email: string) {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error) return null
    return data
  }

  async findUserById(id: string) {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

    if (error) return null
    return data
  }

  async updateUser(id: string, updates: any) {
    const { data, error } = await supabase
      .from("users")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) return null
    return data
  }

  // Bassin methods
  async findBassinsByUserId(userId: string) {
    const { data, error } = await supabase
      .from("bassins")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) return []
    return data
  }

  async findBassinById(id: string) {
    const { data, error } = await supabase.from("bassins").select("*").eq("id", id).eq("is_active", true).single()

    if (error) return null
    return data
  }

  async createBassin(bassinData: any) {
    const { data, error } = await supabase.from("bassins").insert(bassinData).select().single()

    if (error) throw error
    return data
  }

  async updateBassin(id: string, updates: any) {
    const { data, error } = await supabase
      .from("bassins")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) return null
    return data
  }

  async deleteBassin(id: string) {
    const { error } = await supabase.from("bassins").update({ is_active: false }).eq("id", id)

    return !error
  }

  // Water quality readings
  async createWaterQualityReading(readingData: any) {
    const { data, error } = await supabase.from("water_quality_readings").insert(readingData).select().single()

    if (error) throw error
    return data
  }

  async findWaterQualityReadings(bassinId: string, limit?: number) {
    let query = supabase
      .from("water_quality_readings")
      .select("*")
      .eq("bassin_id", bassinId)
      .order("timestamp", { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query
    if (error) return []
    return data
  }

  // Alert methods
  async createAlert(alertData: any) {
    const { data, error } = await supabase.from("alerts").insert(alertData).select().single()

    if (error) throw error
    return data
  }

  async findAlertsByUserId(userId: string, limit?: number) {
    let query = supabase.from("alerts").select("*").eq("user_id", userId).order("timestamp", { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query
    if (error) return []
    return data
  }

  async updateAlert(id: string, updates: any) {
    const { data, error } = await supabase.from("alerts").update(updates).eq("id", id).select().single()

    if (error) return null
    return data
  }

  async deleteAlert(id: string) {
    const { error } = await supabase.from("alerts").delete().eq("id", id)

    return !error
  }

  async clearAllAlerts(userId: string) {
    const { error } = await supabase.from("alerts").delete().eq("user_id", userId)

    return !error
  }

  // Real-time subscriptions
  subscribeToBassinReadings(bassinId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`bassin-${bassinId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "water_quality_readings",
          filter: `bassin_id=eq.${bassinId}`,
        },
        callback,
      )
      .subscribe()
  }

  subscribeToAlerts(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`alerts-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "alerts",
          filter: `user_id=eq.${userId}`,
        },
        callback,
      )
      .subscribe()
  }
}

export const db = new SupabaseDatabase()
