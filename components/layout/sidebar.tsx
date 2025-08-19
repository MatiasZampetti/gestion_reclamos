"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Home, FileText, Plus, User, LogOut, BarChart3, MessageSquare, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const clientNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/complaints/new", label: "Nuevo Reclamo", icon: Plus },
    { href: "/complaints/my", label: "Mis Reclamos", icon: FileText },
    { href: "/profile", label: "Mi Perfil", icon: User },
  ]

  const adminNavItems = [
    { href: "/admin", label: "Panel Principal", icon: BarChart3 },
    { href: "/admin/management", label: "Gestión", icon: MessageSquare },
  ]

  const navItems = user.role === "admin" ? adminNavItems : clientNavItems

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-900">Sistema de Reclamos</h2>
        <p className="text-sm text-gray-600 mt-1">
          {user.name} ({user.role === "admin" ? "Administrador" : "Cliente"})
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && item.href !== "/admin" && pathname.startsWith(item.href))

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn("w-full justify-start", isActive && "bg-blue-600 text-white hover:bg-blue-700")}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
          onClick={() => {
            logout()
            setIsOpen(false)
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar - Made fixed on desktop for consistent positioning */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r transform transition-transform duration-200 ease-in-out",
          "md:fixed md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
