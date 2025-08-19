"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { usePathname } from "next/navigation"
import { Sidebar } from "./sidebar"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { user } = useAuth()
  const pathname = usePathname()

  const isAuthPage = pathname.startsWith("/auth")

  if (isAuthPage || !user) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
