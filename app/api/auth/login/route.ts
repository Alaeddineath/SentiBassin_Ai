import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database-supabase"
import { generateToken } from "@/lib/auth-utils"

// Mock password verification (in production, use proper password hashing)
const mockPasswords: Record<string, string> = {
  "admin@aquaculture.com": "admin123",
  "manager@aquaculture.com": "manager123",
  "operator@aquaculture.com": "operator123",
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Verify credentials
    if (mockPasswords[email] !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Find user
    const user = await db.findUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Generate token
    const token = generateToken(user.id, user.email)

    // Return user data and token
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profileImage: user.profileImage,
      },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
