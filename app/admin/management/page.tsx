"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Users, MessageSquare, Building2 } from "lucide-react"
import Link from "next/link"

export default function ManagementPage() {
  const managementSections = [
    {
      title: "Gestión de Reclamos",
      description: "Administrar todos los reclamos del sistema",
      icon: FileText,
      href: "/admin/management/complaints",
      color: "bg-blue-500",
    },
    {
      title: "Gestión de Usuarios",
      description: "Administrar usuarios y roles del sistema",
      icon: Users,
      href: "/admin/management/users",
      color: "bg-green-500",
    },
    {
      title: "Gestión de FAQs",
      description: "Administrar preguntas frecuentes del chatbot",
      icon: MessageSquare,
      href: "/admin/management/faqs",
      color: "bg-purple-500",
    },
    {
      title: "Gestión de Entidades",
      description: "Administrar entidades, categorías y subcategorías",
      icon: Building2,
      href: "/admin/management/entities",
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="p-6 md:ml-64">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión del Sistema</h1>
        <p className="text-gray-600 mt-2">Administra todos los aspectos del sistema de reclamos desde un solo lugar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {managementSections.map((section) => {
          const Icon = section.icon
          return (
            <Card key={section.href} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${section.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    <CardDescription className="mt-1">{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href={section.href}>
                  <Button className="w-full">Acceder</Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
