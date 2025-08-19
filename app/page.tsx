"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Users, MessageSquare } from "lucide-react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login")
      } else if (user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sistema de Gestión de Reclamos</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Plataforma integral para la gestión de reclamos de hospitales, escuelas, clubes y municipalidades
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <FileText className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Gestión de Reclamos</CardTitle>
              <CardDescription>Crea, edita y gestiona reclamos de manera eficiente</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Múltiples Usuarios</CardTitle>
              <CardDescription>Sistema para clientes y administradores con roles específicos</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Soporte Integrado</CardTitle>
              <CardDescription>Chatbot con preguntas frecuentes para ayuda inmediata</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <Button onClick={() => router.push("/auth/login")} size="lg" className="mr-4">
            Iniciar Sesión
          </Button>
          <Button onClick={() => router.push("/auth/register")} variant="outline" size="lg">
            Registrarse
          </Button>
        </div>
      </div>
    </div>
  )
}
