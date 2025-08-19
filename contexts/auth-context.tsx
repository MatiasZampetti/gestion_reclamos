"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { User, AuthContextType } from "@/types/auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Mock authentication - replace with Supabase integration
      const mockUser: User = {
        id: "1",
        email,
        name: email === "admin@test.com" ? "Administrador" : "Cliente Test",
        role: email === "admin@test.com" ? "admin" : "client",
        createdAt: new Date(),
      }

      localStorage.setItem("user", JSON.stringify(mockUser))
      setUser(mockUser)
    } catch (error) {
      throw new Error("Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      // Mock registration - replace with Supabase integration
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role: "client",
        createdAt: new Date(),
      }

      localStorage.setItem("user", JSON.stringify(newUser))
      setUser(newUser)
    } catch (error) {
      throw new Error("Error al registrarse")
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/auth/login")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
