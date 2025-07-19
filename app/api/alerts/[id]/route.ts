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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await getUserFromToken(request)
    const updateData = await request.json()

    const updatedAlert = await db.updateAlert(params.id, updateData)

    if (!updatedAlert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 })
    }

    return NextResponse.json({ alert: updatedAlert })
  } catch (error) {
    console.error("Update alert error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await getUserFromToken(request)
    const success = await db.deleteAlert(params.id)

    if (!success) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Alert deleted successfully" })
  } catch (error) {
    console.error("Delete alert error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
