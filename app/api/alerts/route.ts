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
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined

    const alerts = await db.findAlertsByUserId(userId, limit)
    return NextResponse.json({ alerts })
  } catch (error) {
    console.error("Get alerts error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)
    const alertData = await request.json()

    const newAlert = await db.createAlert({
      ...alertData,
      userId,
    })

    return NextResponse.json({ alert: newAlert }, { status: 201 })
  } catch (error) {
    console.error("Create alert error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)
    await db.clearAllAlerts(userId)
    return NextResponse.json({ message: "All alerts cleared" })
  } catch (error) {
    console.error("Clear alerts error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
