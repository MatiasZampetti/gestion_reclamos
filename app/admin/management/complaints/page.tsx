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
import { Search, Filter, Eye, CheckCircle, RotateCcw, FileText } from "lucide-react"
import { mockComplaints } from "@/lib/mock-data"
import type { Complaint } from "@/types/complaint"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function AdminComplaintsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints)
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>(mockComplaints)
  const [searchTerm, setSearchTerm] = useState("")
  const [entityFilter, setEntityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

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
    let filtered = complaints

    if (searchTerm) {
      filtered = filtered.filter(
        (complaint) =>
          complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (entityFilter !== "all") {
      filtered = filtered.filter((complaint) => complaint.entity === entityFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((complaint) => complaint.status === statusFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((complaint) => complaint.category === categoryFilter)
    }

    setFilteredComplaints(filtered)
  }, [complaints, searchTerm, entityFilter, statusFilter, categoryFilter])

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const handleStatusChange = (complaintId: string, newStatus: "open" | "closed") => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === complaintId ? { ...complaint, status: newStatus, updatedAt: new Date() } : complaint,
      ),
    )

    toast({
      title: `Reclamo ${newStatus === "closed" ? "cerrado" : "reabierto"}`,
      description: `El reclamo ha sido ${newStatus === "closed" ? "cerrado" : "reabierto"} exitosamente.`,
    })
  }

  const entities = ["Municipios", "Escuelas", "Clubes", "Cooperativas"]
  const categories = [...new Set(complaints.map((c) => c.category))]

  const getStatusColor = (status: string) => {
    return status === "open" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 md:ml-64">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Reclamos</h1>
            </div>
            <p className="text-gray-600">Administra todos los reclamos del sistema</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar reclamos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={entityFilter} onValueChange={setEntityFilter}>
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filtrar por entidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las entidades</SelectItem>
                    {entities.map((entity) => (
                      <SelectItem key={entity} value={entity}>
                        {entity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="open">Abiertos</SelectItem>
                    <SelectItem value="closed">Cerrados</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{filteredComplaints.length}</div>
                <p className="text-sm text-gray-600">Total Filtrados</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {filteredComplaints.filter((c) => c.status === "open").length}
                </div>
                <p className="text-sm text-gray-600">Abiertos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-gray-600">
                  {filteredComplaints.filter((c) => c.status === "closed").length}
                </div>
                <p className="text-sm text-gray-600">Cerrados</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredComplaints.reduce((sum, c) => sum + c.votes.positive + c.votes.negative, 0)}
                </div>
                <p className="text-sm text-gray-600">Total Votos</p>
              </CardContent>
            </Card>
          </div>

          {/* Complaints List */}
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <Card key={complaint.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarFallback>{complaint.authorName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{complaint.title}</h3>
                          <p className="text-gray-600 mb-3 line-clamp-2">{complaint.description}</p>

                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline">{complaint.entity}</Badge>
                            <Badge variant="secondary">{complaint.category}</Badge>
                            <Badge variant="outline" className="text-xs">
                              {complaint.subcategory}
                            </Badge>
                            <Badge className={getStatusColor(complaint.status)}>
                              {complaint.status === "open" ? "Abierto" : "Cerrado"}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Por: {complaint.authorName}</span>
                            <span>Creado: {complaint.createdAt.toLocaleDateString()}</span>
                            <span>Ubicación: {complaint.location}</span>
                            <span>
                              Votos: +{complaint.votes.positive} -{complaint.votes.negative}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Link href={`/complaints/${complaint.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>

                      {complaint.status === "open" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(complaint.id, "closed")}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Cerrar
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(complaint.id, "open")}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Reabrir
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredComplaints.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron reclamos</h3>
              <p className="text-gray-500">No hay reclamos que coincidan con los filtros aplicados.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
