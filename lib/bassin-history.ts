export interface BassinHistoryEntry {
  id: string
  bassinId: string
  timestamp: string
  temperature: number
  turbidity: number
  dissolvedOxygen: number
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
  waterQuality: string
  status: string
  activeAlerts: number
  notes?: string
}

export interface BassinHistoryManager {
  addEntry: (bassinId: string, data: Omit<BassinHistoryEntry, "id" | "bassinId" | "timestamp">) => void
  getHistory: (bassinId: string, limit?: number) => BassinHistoryEntry[]
  exportToCsv: (bassinId: string, bassinName: string) => void
  clearHistory: (bassinId: string) => void
  getHistoryStats: (bassinId: string) => {
    totalEntries: number
    dateRange: { start: string; end: string }
    averages: Record<string, number>
  }
  generateDummyData: (bassinId: string, count: number) => void
}

class BassinHistoryService implements BassinHistoryManager {
  private getStorageKey(bassinId: string): string {
    return `bassin-history-${bassinId}`
  }

  addEntry(bassinId: string, data: Omit<BassinHistoryEntry, "id" | "bassinId" | "timestamp">): void {
    const entry: BassinHistoryEntry = {
      id: `${bassinId}-${Date.now()}`,
      bassinId,
      timestamp: new Date().toISOString(),
      ...data,
    }

    const existing = this.getHistory(bassinId)
    const updated = [entry, ...existing].slice(0, 1000) // Keep last 1000 entries

    if (typeof window !== "undefined") {
      localStorage.setItem(this.getStorageKey(bassinId), JSON.stringify(updated))
    }
  }

  getHistory(bassinId: string, limit?: number): BassinHistoryEntry[] {
    if (typeof window === "undefined") {
      return []
    }

    try {
      const stored = localStorage.getItem(this.getStorageKey(bassinId))
      if (!stored) return []

      const history = JSON.parse(stored) as BassinHistoryEntry[]
      return limit ? history.slice(0, limit) : history
    } catch (error) {
      console.error("Failed to load bassin history:", error)
      return []
    }
  }

  generateDummyData(bassinId: string, count = 50): void {
    const dummyEntries: BassinHistoryEntry[] = []

    for (let i = 0; i < count; i++) {
      const timestamp = new Date(Date.now() - i * 60 * 60 * 1000) // Every hour going back

      // Generate realistic dummy data
      const temperature = 18 + Math.random() * 8 // 18-26°C
      const turbidity = 2 + Math.random() * 15 // 2-17 cm
      const dissolvedOxygen = 5 + Math.random() * 4 // 5-9 mg/L
      const bod = 1 + Math.random() * 8 // 1-9 mg/L
      const co2 = 5 + Math.random() * 15 // 5-20 mg/L
      const ph = 6.5 + Math.random() * 2 // 6.5-8.5
      const alkalinity = 80 + Math.random() * 120 // 80-200 mg/L
      const hardness = 100 + Math.random() * 200 // 100-300 mg/L
      const calcium = 20 + Math.random() * 80 // 20-100 mg/L
      const ammonia = 0.1 + Math.random() * 2 // 0.1-2.1 mg/L
      const nitrite = 0.05 + Math.random() * 1 // 0.05-1.05 mg/L
      const phosphorus = 0.5 + Math.random() * 3 // 0.5-3.5 mg/L
      const h2s = 0.01 + Math.random() * 0.5 // 0.01-0.51 mg/L
      const plankton = 1000 + Math.random() * 50000 // 1000-51000 No./L

      // Determine water quality based on parameters
      let waterQuality = "Excellent"
      if (temperature > 25 || ph < 6.8 || ph > 8.2 || dissolvedOxygen < 6 || ammonia > 1.5) {
        waterQuality = "Poor"
      } else if (temperature > 23 || ph < 7.0 || ph > 8.0 || dissolvedOxygen < 7 || ammonia > 1.0) {
        waterQuality = "Fair"
      } else if (temperature > 21 || dissolvedOxygen < 8 || ammonia > 0.5) {
        waterQuality = "Good"
      }

      const entry: BassinHistoryEntry = {
        id: `${bassinId}-dummy-${i}`,
        bassinId,
        timestamp: timestamp.toISOString(),
        temperature,
        turbidity,
        dissolvedOxygen,
        bod,
        co2,
        ph,
        alkalinity,
        hardness,
        calcium,
        ammonia,
        nitrite,
        phosphorus,
        h2s,
        plankton,
        waterQuality,
        status: waterQuality.toLowerCase(),
        activeAlerts:
          waterQuality === "Poor"
            ? Math.floor(Math.random() * 4) + 1
            : waterQuality === "Fair"
              ? Math.floor(Math.random() * 2)
              : 0,
        notes: `Automated monitoring - ${waterQuality} conditions detected`,
      }

      dummyEntries.push(entry)
    }

    // Save dummy data
    if (typeof window !== "undefined") {
      localStorage.setItem(this.getStorageKey(bassinId), JSON.stringify(dummyEntries))
    }
  }

  exportToCsv(bassinId: string, bassinName: string): void {
    const history = this.getHistory(bassinId)
    if (history.length === 0) {
      alert("No history data available for export")
      return
    }

    // CSV headers matching the image
    const headers = [
      "Timestamp",
      "Date",
      "Time",
      "Temp (°C)",
      "Turbidity (cm)",
      "DO (mg/L)",
      "BOD (mg/L)",
      "CO2 (mg/L)",
      "pH",
      "Alkalinity (mg L-1)",
      "Hardness (mg L-1)",
      "Calcium (mg L-1)",
      "Ammonia (mg L-1)",
      "Nitrite (mg L-1)",
      "Phosphorus (mg L-1)",
      "H2S (mg L-1)",
      "Plankton (No. L-1)",
      "Water Quality",
      "Status",
      "Active Alerts",
      "Notes",
    ]

    // Convert data to CSV format
    const csvData = history.map((entry) => {
      const date = new Date(entry.timestamp)
      return [
        entry.timestamp,
        date.toLocaleDateString(),
        date.toLocaleTimeString(),
        entry.temperature.toFixed(2),
        entry.turbidity.toFixed(2),
        entry.dissolvedOxygen.toFixed(2),
        entry.bod.toFixed(2),
        entry.co2.toFixed(2),
        entry.ph.toFixed(2),
        entry.alkalinity.toFixed(2),
        entry.hardness.toFixed(2),
        entry.calcium.toFixed(2),
        entry.ammonia.toFixed(3),
        entry.nitrite.toFixed(3),
        entry.phosphorus.toFixed(2),
        entry.h2s.toFixed(3),
        entry.plankton.toFixed(0),
        entry.waterQuality,
        entry.status,
        entry.activeAlerts.toString(),
        entry.notes || "",
      ]
    })

    // Create CSV content
    const csvContent = [headers.join(","), ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    // Download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `${bassinName.replace(/\s+/g, "_")}_WaterQuality_History_${new Date().toISOString().split("T")[0]}.csv`,
    )
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  clearHistory(bassinId: string): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.getStorageKey(bassinId))
    }
  }

  getHistoryStats(bassinId: string) {
    const history = this.getHistory(bassinId)

    if (history.length === 0) {
      return {
        totalEntries: 0,
        dateRange: { start: "", end: "" },
        averages: {},
      }
    }

    const sortedHistory = [...history].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    const averages = {
      temperature: history.reduce((sum, entry) => sum + entry.temperature, 0) / history.length,
      turbidity: history.reduce((sum, entry) => sum + entry.turbidity, 0) / history.length,
      dissolvedOxygen: history.reduce((sum, entry) => sum + entry.dissolvedOxygen, 0) / history.length,
      bod: history.reduce((sum, entry) => sum + entry.bod, 0) / history.length,
      co2: history.reduce((sum, entry) => sum + entry.co2, 0) / history.length,
      ph: history.reduce((sum, entry) => sum + entry.ph, 0) / history.length,
      alkalinity: history.reduce((sum, entry) => sum + entry.alkalinity, 0) / history.length,
      hardness: history.reduce((sum, entry) => sum + entry.hardness, 0) / history.length,
      calcium: history.reduce((sum, entry) => sum + entry.calcium, 0) / history.length,
      ammonia: history.reduce((sum, entry) => sum + entry.ammonia, 0) / history.length,
      nitrite: history.reduce((sum, entry) => sum + entry.nitrite, 0) / history.length,
      phosphorus: history.reduce((sum, entry) => sum + entry.phosphorus, 0) / history.length,
      h2s: history.reduce((sum, entry) => sum + entry.h2s, 0) / history.length,
      plankton: history.reduce((sum, entry) => sum + entry.plankton, 0) / history.length,
    }

    return {
      totalEntries: history.length,
      dateRange: {
        start: new Date(sortedHistory[0].timestamp).toLocaleDateString(),
        end: new Date(sortedHistory[sortedHistory.length - 1].timestamp).toLocaleDateString(),
      },
      averages,
    }
  }
}

export const bassinHistoryService = new BassinHistoryService()
