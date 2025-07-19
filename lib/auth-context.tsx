"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { apiClient } from "./api-client"

interface User {
  id: string
  email: string
  name: string
  role: string
  isAuthenticated: boolean
  profileImage?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (profileData: Partial<User>) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = async () => {
      const token = localStorage.getItem("auth-token")
      if (token) {
        apiClient.setToken(token)
        const response = await apiClient.getProfile()

        if (response.data) {
          setUser({
            ...response.data.user,
            isAuthenticated: true,
          })
        } else {
          // Token is invalid, clear it
          apiClient.clearToken()
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  useEffect(() => {
    if (!isLoading) {
      if (!user && pathname !== "/login") {
        // User is not authenticated and not on login page - redirect to login
        router.push("/login")
      } else if (user && pathname === "/login") {
        // User is authenticated but on login page - redirect to dashboard
        router.push("/")
      }
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string) => {
    const response = await apiClient.login(email, password)

    if (response.data) {
      const userData = {
        ...response.data.user,
        isAuthenticated: true,
      }
      setUser(userData)
      router.push("/")
      return { success: true }
    } else {
      return { success: false, error: response.error || "Login failed" }
    }
  }

  const logout = () => {
    setUser(null)
    apiClient.clearToken()
    router.push("/login")
  }

  const updateProfile = async (profileData: Partial<User>) => {
    if (!user) return

    const response = await apiClient.updateProfile(profileData)

    if (response.data) {
      setUser({
        ...response.data.user,
        isAuthenticated: true,
      })
    } else {
      throw new Error(response.error || "Failed to update profile")
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, isLoading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
