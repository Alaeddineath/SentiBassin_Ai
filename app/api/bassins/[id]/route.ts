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
    const bassin = await db.findBassinById(params.id)

    if (!bassin) {
      return NextResponse.json({ error: "Bassin not found" }, { status: 404 })
    }

    return NextResponse.json({ bassin })
  } catch (error) {
    console.error("Get bassin error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await getUserFromToken(request)
    const updateData = await request.json()

    const updatedBassin = await db.updateBassin(params.id, updateData)

    if (!updatedBassin) {
      return NextResponse.json({ error: "Bassin not found" }, { status: 404 })
    }

    return NextResponse.json({ bassin: updatedBassin })
  } catch (error) {
    console.error("Update bassin error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await getUserFromToken(request)
    const success = await db.deleteBassin(params.id)

    if (!success) {
      return NextResponse.json({ error: "Bassin not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Bassin deleted successfully" })
  } catch (error) {
    console.error("Delete bassin error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
