import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database-supabase"
import { verifyToken } from "@/lib/auth-utils"

async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided")
  }

  const token = authHeader.substring(7)
  const decoded = verifyToken(token)

  if (!decoded) {
    throw new Error("Invalid or expired token")
  }

  return decoded.userId
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)
    const bassins = await db.findBassinsByUserId(userId)

    // Add current status and alerts for each bassin
    const bassinsWithStatus = await Promise.all(
      bassins.map(async (bassin) => {
        const latestReading = await db.findWaterQualityReadings(bassin.id, 1)
        const currentReading = latestReading[0]

        return {
          ...bassin,
          temperature: currentReading?.temperature || 20,
          ph: currentReading?.ph || 7.2,
          activeAlerts: currentReading?.activeAlerts || 0,
          lastUpdated: currentReading ? new Date(currentReading.timestamp).toLocaleString() : "No data",
        }
      }),
    )

    return NextResponse.json({ bassins: bassinsWithStatus })
  } catch (error) {
    console.error("Get bassins error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)
    const bassinData = await request.json()

    const newBassin = await db.createBassin({
      ...bassinData,
      userId,
      status: "excellent" as const,
      isActive: true,
    })

    // Generate initial dummy data for the new bassin
    await db.generateDummyWaterQualityData(newBassin.id, 50)

    return NextResponse.json({ bassin: newBassin }, { status: 201 })
  } catch (error) {
    console.error("Create bassin error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
