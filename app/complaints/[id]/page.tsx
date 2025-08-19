"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, MapPin, Calendar, ArrowLeft, Edit, Trash2 } from "lucide-react"
import { mockComplaints } from "@/lib/mock-data"
import type { Complaint } from "@/types/complaint"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface ComplaintDetailPageProps {
  params: {
    id: string
  }
}

export default function ComplaintDetailPage({ params }: ComplaintDetailPageProps) {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [userVote, setUserVote] = useState<"positive" | "negative" | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    const foundComplaint = mockComplaints.find((c) => c.id === params.id)
    if (foundComplaint) {
      setComplaint(foundComplaint)
      setUserVote(foundComplaint.votes.userVotes[user.id] || null)
    }
  }, [user, params.id, router])

  if (!user || !complaint) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const isOwnComplaint = user.id === complaint.authorId
  const canVote = !isOwnComplaint

  const handleVote = (voteType: "positive" | "negative") => {
    if (!canVote) return

    const newVote = userVote === voteType ? null : voteType
    setUserVote(newVote)

    // Update complaint votes (mock implementation)
    setComplaint((prev) => {
      if (!prev) return prev

      const newUserVotes = { ...prev.votes.userVotes }
      if (newVote) {
        newUserVotes[user.id] = newVote
      } else {
        delete newUserVotes[user.id]
      }

      return {
        ...prev,
        votes: {
          positive:
            voteType === "positive"
              ? newVote
                ? prev.votes.positive + 1
                : prev.votes.positive - 1
              : userVote === "positive"
                ? prev.votes.positive - 1
                : prev.votes.positive,
          negative:
            voteType === "negative"
              ? newVote
                ? prev.votes.negative + 1
                : prev.votes.negative - 1
              : userVote === "negative"
                ? prev.votes.negative - 1
                : prev.votes.negative,
          userVotes: newUserVotes,
        },
      }
    })
  }

  const handleDelete = () => {
    if (confirm("¿Estás seguro de que quieres eliminar este reclamo?")) {
      toast({
        title: "Reclamo eliminado",
        description: "El reclamo ha sido eliminado exitosamente.",
      })
      router.push("/complaints/my")
    }
  }

  const getStatusColor = (status: string) => {
    return status === "open" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 md:ml-64">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{complaint.title}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">{complaint.entity}</Badge>
                  <Badge variant="secondary">{complaint.category}</Badge>
                  <Badge variant="outline" className="text-xs">
                    {complaint.subcategory}
                  </Badge>
                  <Badge className={getStatusColor(complaint.status)}>
                    {complaint.status === "open" ? "Abierto" : "Cerrado"}
                  </Badge>
                </div>
              </div>

              {isOwnComplaint && (
                <div className="flex gap-2">
                  <Link href={`/complaints/edit/${complaint.id}`}>
                    <Button variant="outline">
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleDelete}
                    className="text-red-600 hover:text-red-700 bg-transparent"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{complaint.authorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{complaint.authorName}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Creado el {complaint.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Descripción</h3>
                      <p className="text-gray-700 leading-relaxed">{complaint.description}</p>
                    </div>

                    {complaint.location && (
                      <div>
                        <h3 className="font-semibold mb-2">Ubicación</h3>
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="h-4 w-4" />
                          <span>{complaint.location}</span>
                        </div>
                      </div>
                    )}

                    {complaint.photo && (
                      <div>
                        <h3 className="font-semibold mb-2">Imagen</h3>
                        <img
                          src={complaint.photo || "/placeholder.svg"}
                          alt="Foto del reclamo"
                          className="w-full max-w-md h-64 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Voting */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Votación</h3>
                </CardHeader>
                <CardContent>
                  {canVote ? (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 mb-4">¿Qué opinas sobre este reclamo?</p>
                      <Button
                        variant={userVote === "positive" ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => handleVote("positive")}
                      >
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        Me parece bien ({complaint.votes.positive})
                      </Button>
                      <Button
                        variant={userVote === "negative" ? "destructive" : "outline"}
                        className="w-full justify-start"
                        onClick={() => handleVote("negative")}
                      >
                        <ThumbsDown className="mr-2 h-4 w-4" />
                        No me parece bien ({complaint.votes.negative})
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 mb-4">{isOwnComplaint ? "Este es tu reclamo" : "Votación"}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4 text-green-600" />
                          <span>{complaint.votes.positive} votos positivos</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <ThumbsDown className="h-4 w-4 text-red-600" />
                          <span>{complaint.votes.negative} votos negativos</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Details */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Detalles</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Entidad</p>
                    <p className="text-sm">{complaint.entity}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Categoría</p>
                    <p className="text-sm">{complaint.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Subcategoría</p>
                    <p className="text-sm">{complaint.subcategory}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Estado</p>
                    <p className="text-sm">{complaint.status === "open" ? "Abierto" : "Cerrado"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Última actualización</p>
                    <p className="text-sm">{complaint.updatedAt.toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
