"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Users, Shield, Trash2, UserCheck } from "lucide-react"
import { mockUsers } from "@/lib/mock-admin-data"
import type { User } from "@/types/auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function AdminUsersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [users, setUsers] = useState<User[]>(mockUsers)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (user.role !== "admin") {
      router.push("/dashboard")
      return
    }
  }, [user, router])

  useEffect(() => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => u.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter])

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find((u) => u.id === userId)
    if (!userToDelete) return

    if (userToDelete.id === user.id) {
      toast({
        title: "Error",
        description: "No puedes eliminar tu propia cuenta.",
        variant: "destructive",
      })
      return
    }

    if (confirm(`¿Estás seguro de que quieres eliminar al usuario ${userToDelete.name}?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      toast({
        title: "Usuario eliminado",
        description: `El usuario ${userToDelete.name} ha sido eliminado exitosamente.`,
      })
    }
  }

  const handleRoleChange = (userId: string, newRole: "client" | "admin") => {
    const userToUpdate = users.find((u) => u.id === userId)
    if (!userToUpdate) return

    if (userToUpdate.id === user.id && newRole === "client") {
      toast({
        title: "Error",
        description: "No puedes cambiar tu propio rol de administrador.",
        variant: "destructive",
      })
      return
    }

    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))

    toast({
      title: "Rol actualizado",
      description: `${userToUpdate.name} ahora es ${newRole === "admin" ? "administrador" : "cliente"}.`,
    })
  }

  const clientUsers = filteredUsers.filter((u) => u.role === "client")
  const adminUsers = filteredUsers.filter((u) => u.role === "admin")

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 md:ml-64">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
            </div>
            <p className="text-gray-600">Administra todos los usuarios del sistema</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los roles</SelectItem>
                    <SelectItem value="client">Clientes</SelectItem>
                    <SelectItem value="admin">Administradores</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{filteredUsers.length}</div>
                <p className="text-sm text-gray-600">Total Usuarios</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{clientUsers.length}</div>
                <p className="text-sm text-gray-600">Clientes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">{adminUsers.length}</div>
                <p className="text-sm text-gray-600">Administradores</p>
              </CardContent>
            </Card>
          </div>

          {/* Users List */}
          <div className="space-y-4">
            {filteredUsers.map((userItem) => (
              <Card key={userItem.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="text-lg">{userItem.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{userItem.name}</h3>
                        <p className="text-gray-600">{userItem.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={userItem.role === "admin" ? "default" : "secondary"}>
                            {userItem.role === "admin" ? "Administrador" : "Cliente"}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Miembro desde {userItem.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {userItem.role === "client" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRoleChange(userItem.id, "admin")}
                          className="text-purple-600 hover:text-purple-700"
                        >
                          <Shield className="h-4 w-4 mr-1" />
                          Hacer Admin
                        </Button>
                      ) : (
                        userItem.id !== user.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRoleChange(userItem.id, "client")}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Hacer Cliente
                          </Button>
                        )
                      )}

                      {userItem.id !== user.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(userItem.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron usuarios</h3>
              <p className="text-gray-500">No hay usuarios que coincidan con los filtros aplicados.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
