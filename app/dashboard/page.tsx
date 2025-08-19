"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ComplaintCard } from "@/components/complaints/complaint-card"
import { Plus, Search, Filter } from "lucide-react"
import { mockComplaints } from "@/lib/mock-data"
import type { Complaint } from "@/types/complaint"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints)
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>(mockComplaints)
  const [searchTerm, setSearchTerm] = useState("")
  const [entityFilter, setEntityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
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
          complaint.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (entityFilter !== "all") {
      filtered = filtered.filter((complaint) => complaint.entity === entityFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((complaint) => complaint.status === statusFilter)
    }

    setFilteredComplaints(filtered)
  }, [complaints, searchTerm, entityFilter, statusFilter])

  const handleVote = (complaintId: string, voteType: "positive" | "negative") => {
    if (!user) return

    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === complaintId) {
          const currentVote = complaint.votes.userVotes[user.id]
          const newUserVotes = { ...complaint.votes.userVotes }

          if (currentVote === voteType) {
            // Remove vote
            delete newUserVotes[user.id]
            return {
              ...complaint,
              votes: {
                ...complaint.votes,
                positive: voteType === "positive" ? complaint.votes.positive - 1 : complaint.votes.positive,
                negative: voteType === "negative" ? complaint.votes.negative - 1 : complaint.votes.negative,
                userVotes: newUserVotes,
              },
            }
          } else {
            // Add or change vote
            newUserVotes[user.id] = voteType
            return {
              ...complaint,
              votes: {
                positive:
                  voteType === "positive"
                    ? complaint.votes.positive + 1
                    : currentVote === "positive"
                      ? complaint.votes.positive - 1
                      : complaint.votes.positive,
                negative:
                  voteType === "negative"
                    ? complaint.votes.negative + 1
                    : currentVote === "negative"
                      ? complaint.votes.negative - 1
                      : complaint.votes.negative,
                userVotes: newUserVotes,
              },
            }
          }
        }
        return complaint
      }),
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const entities = ["Municipios", "Escuelas", "Clubes", "Cooperativas"]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Simplified layout structure with md:ml-64 */}
      <div className="p-6 md:ml-64">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Gestiona y visualiza todos los reclamos</p>
            </div>
            <Link href="/complaints/new">
              <Button
                size="lg"
                className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 text-white font-bold shadow-2xl hover:shadow-blue-500/25 transform hover:scale-110 transition-all duration-300 border-0 px-8 py-4 text-lg animate-pulse hover:animate-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-md blur opacity-30 animate-pulse"></div>
                <div className="relative flex items-center">
                  <Plus className="mr-3 h-6 w-6 animate-bounce" />✨ Crear Nuevo Reclamo ✨
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar reclamos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="w-full md:w-48">
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
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="open">Abiertos</SelectItem>
              <SelectItem value="closed">Cerrados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-600">Total Reclamos</h3>
            <p className="text-2xl font-bold text-gray-900">{complaints.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-600">Abiertos</h3>
            <p className="text-2xl font-bold text-green-600">{complaints.filter((c) => c.status === "open").length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-600">Cerrados</h3>
            <p className="text-2xl font-bold text-gray-600">{complaints.filter((c) => c.status === "closed").length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-600">Mis Reclamos</h3>
            <p className="text-2xl font-bold text-blue-600">
              {complaints.filter((c) => c.authorId === user.id).length}
            </p>
          </div>
        </div>

        {/* Complaints Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredComplaints.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} onVote={handleVote} />
          ))}
        </div>

        {filteredComplaints.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron reclamos que coincidan con los filtros.</p>
          </div>
        )}
      </div>
    </div>
  )
}
