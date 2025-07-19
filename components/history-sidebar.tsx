"use client"

import { useState, useEffect } from "react"
import { History, Download, Filter, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { bassinHistoryService, type BassinHistoryEntry } from "@/lib/bassin-history"
import { useLanguage } from "@/lib/language-context"

interface HistorySidebarProps {
  availableBassins: Array<{
    id: string
    name: string
    location: string
    fishType: string
    status: string
  }>
}

export function HistorySidebar({ availableBassins }: HistorySidebarProps) {
  const { t, isRTL } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedBassin, setSelectedBassin] = useState<string>("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [historyData, setHistoryData] = useState<BassinHistoryEntry[]>([])
  const [filteredData, setFilteredData] = useState<BassinHistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Set default dates (last 7 days)
  useEffect(() => {
    const today = new Date()
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    setToDate(today.toISOString().split("T")[0])
    setFromDate(weekAgo.toISOString().split("T")[0])
  }, [])

  // Load history data when bassin is selected
  useEffect(() => {
    if (selectedBassin) {
      setIsLoading(true)
      let history = bassinHistoryService.getHistory(selectedBassin)

      // Generate dummy data if no history exists
      if (history.length === 0) {
        bassinHistoryService.generateDummyData(selectedBassin, 100)
        history = bassinHistoryService.getHistory(selectedBassin)
      }

      setHistoryData(history)
      setIsLoading(false)
    } else {
      setHistoryData([])
    }
  }, [selectedBassin])

  // Filter data by date range
  useEffect(() => {
    if (!fromDate || !toDate || historyData.length === 0) {
      setFilteredData(historyData)
      return
    }

    const fromDateTime = new Date(fromDate).getTime()
    const toDateTime = new Date(toDate + "T23:59:59").getTime()

    const filtered = historyData.filter((entry) => {
      const entryTime = new Date(entry.timestamp).getTime()
      return entryTime >= fromDateTime && entryTime <= toDateTime
    })

    setFilteredData(filtered)
  }, [historyData, fromDate, toDate])

  const exportFilteredData = () => {
    if (!selectedBassin || filteredData.length === 0) return

    const selectedBassinData = availableBassins.find((b) => b.id === selectedBassin)
    const bassinName = selectedBassinData?.name || "Unknown"

    // Create CSV content with filtered data
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

    const csvData = filteredData.map((entry) => {
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

    const csvContent = [headers.join(","), ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `${bassinName.replace(/\s+/g, "_")}_History_${fromDate}_to_${toDate}.csv`)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-500"
      case "good":
        return "bg-blue-500"
      case "warning":
        return "bg-yellow-500"
      case "poor":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getWaterQualityColor = (quality: string) => {
    switch (quality) {
      case "Excellent":
        return "bg-green-500"
      case "Good":
        return "bg-blue-500"
      case "Fair":
        return "bg-yellow-500"
      case "Poor":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const calculateStats = () => {
    if (filteredData.length === 0) return null

    const avgTemp = filteredData.reduce((sum, entry) => sum + entry.temperature, 0) / filteredData.length
    const avgPh = filteredData.reduce((sum, entry) => sum + entry.ph, 0) / filteredData.length
    const avgDO = filteredData.reduce((sum, entry) => sum + entry.dissolvedOxygen, 0) / filteredData.length
    const totalAlerts = filteredData.reduce((sum, entry) => sum + entry.activeAlerts, 0)

    return { avgTemp, avgPh, avgDO, totalAlerts }
  }

  const stats = calculateStats()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <History className="h-4 w-4" />
          <span className="hidden sm:inline">{t("history")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side={isRTL ? "left" : "right"} className="w-[400px] sm:w-[600px] lg:w-[800px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            {t("dataHistory")}
          </SheetTitle>
          <SheetDescription>
            {t("selectBassin")} {t("timeRange").toLowerCase()}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Bassin Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{t("selectBassin")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedBassin} onValueChange={setSelectedBassin}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectBassin")} />
                </SelectTrigger>
                <SelectContent>
                  {availableBassins.map((bassin) => (
                    <SelectItem key={bassin.id} value={bassin.id}>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(bassin.status)} text-white text-xs`}>
                          {t(bassin.status as keyof typeof t)}
                        </Badge>
                        <span>{bassin.name}</span>
                        <span className="text-muted-foreground text-xs">({bassin.location})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Time Range Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {t("timeRange")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromDate" className="text-xs">
                    {t("from")}
                  </Label>
                  <Input
                    id="fromDate"
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="toDate" className="text-xs">
                    {t("to")}
                  </Label>
                  <Input
                    id="toDate"
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>

              {selectedBassin && (
                <Button
                  onClick={exportFilteredData}
                  disabled={filteredData.length === 0}
                  className="w-full gap-2"
                  size="sm"
                >
                  <Download className="h-4 w-4" />
                  {t("exportCsv")} ({filteredData.length} {t("totalRecords").toLowerCase()})
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          {stats && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="font-bold text-blue-600">{filteredData.length}</div>
                    <div className="text-blue-600 text-xs">{t("totalRecords")}</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="font-bold text-green-600">{stats.avgTemp.toFixed(1)}°C</div>
                    <div className="text-green-600 text-xs">{t("avgTemperature")}</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="font-bold text-purple-600">{stats.avgPh.toFixed(2)}</div>
                    <div className="text-purple-600 text-xs">Avg pH</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="font-bold text-red-600">{stats.totalAlerts}</div>
                    <div className="text-red-600 text-xs">Total {t("alerts")}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* History Data */}
          {selectedBassin && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {t("dataHistory")}
                  {isLoading && (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {filteredData.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>{t("noData")}</p>
                      {selectedBassin && fromDate && toDate && (
                        <p className="text-sm mt-2">
                          {t("from")} {fromDate} {t("to")} {toDate}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredData.slice(0, 50).map((entry) => (
                        <Card key={entry.id} className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs font-mono text-muted-foreground">
                              {new Date(entry.timestamp).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={`${getWaterQualityColor(entry.waterQuality)} text-white text-xs`}>
                                {entry.waterQuality}
                              </Badge>
                              {entry.activeAlerts > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {entry.activeAlerts} {t("alerts")}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">{t("temperature")}:</span>
                              <span className="font-medium ml-1">{entry.temperature.toFixed(1)}°C</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">pH:</span>
                              <span className="font-medium ml-1">{entry.ph.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">DO:</span>
                              <span className="font-medium ml-1">{entry.dissolvedOxygen.toFixed(1)} mg/L</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">{t("ammonia")}:</span>
                              <span className="font-medium ml-1">{entry.ammonia.toFixed(3)} mg/L</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">{t("turbidity")}:</span>
                              <span className="font-medium ml-1">{entry.turbidity.toFixed(1)} cm</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Plankton:</span>
                              <span className="font-medium ml-1">{entry.plankton.toFixed(0)}</span>
                            </div>
                          </div>

                          {entry.notes && (
                            <div className="mt-2 text-xs text-muted-foreground italic">{entry.notes}</div>
                          )}
                        </Card>
                      ))}

                      {filteredData.length > 50 && (
                        <div className="text-center py-4 text-sm text-muted-foreground">
                          Showing latest 50 entries of {filteredData.length} total.
                          <br />
                          {t("exportCsv")} to view all data.
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
