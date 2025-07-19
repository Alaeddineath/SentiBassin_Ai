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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await getUserFromToken(request)
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined

    let readings = await db.findWaterQualityReadings(params.id, limit)

    // Generate dummy data if no readings exist
    if (readings.length === 0) {
      await db.generateDummyWaterQualityData(params.id, 50)
      readings = await db.findWaterQualityReadings(params.id, limit)
    }

    return NextResponse.json({ readings })
  } catch (error) {
    console.error("Get readings error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await getUserFromToken(request)
    const readingData = await request.json()

    const newReading = await db.createWaterQualityReading({
      bassinId: params.id,
      ...readingData,
    })

    return NextResponse.json({ reading: newReading }, { status: 201 })
  } catch (error) {
    console.error("Create reading error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
