// Simple token generation without external dependencies
export function generateToken(userId: string, email: string): string {
  const payload = {
    userId,
    email,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  }

  // Simple base64 encoding for demo purposes
  // In production, use proper JWT with signing
  return btoa(JSON.stringify(payload))
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    const payload = JSON.parse(atob(token))

    // Check if token is expired
    if (payload.exp < Date.now()) {
      return null
    }

    return {
      userId: payload.userId,
      email: payload.email,
    }
  } catch (error) {
    return null
  }
}
