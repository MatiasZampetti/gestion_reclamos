"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { ComplaintCard } from "@/components/complaints/complaint-card"
import { Plus, FileText } from "lucide-react"
import type { Complaint } from "@/types/complaint"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { getStoredComplaints, deleteComplaint } from "@/lib/complaint-storage"

export default function MyComplaintsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [complaints, setComplaints] = useState<Complaint[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    const loadComplaints = () => {
      const storedComplaints = getStoredComplaints()
      setComplaints(storedComplaints)
    }

    loadComplaints()

    // Listen for storage changes to update in real-time
    const handleStorageChange = () => {
      loadComplaints()
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [user, router])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const myComplaints = complaints.filter((complaint) => complaint.authorId === user.id)

  const handleEdit = (complaint: Complaint) => {
    router.push(`/complaints/edit/${complaint.id}`)
  }

  const handleDelete = (complaintId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este reclamo?")) {
      deleteComplaint(complaintId)
      setComplaints((prev) => prev.filter((complaint) => complaint.id !== complaintId))
      toast({
        title: "Reclamo eliminado",
        description: "El reclamo ha sido eliminado exitosamente.",
      })
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 md:ml-64">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mis Reclamos</h1>
                <p className="text-gray-600 mt-1">Gestiona todos tus reclamos creados</p>
              </div>
              <Link href="/complaints/new">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-5 w-5" />
                  Crear Nuevo Reclamo
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-600">Total</h3>
              <p className="text-2xl font-bold text-gray-900">{myComplaints.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-600">Abiertos</h3>
              <p className="text-2xl font-bold text-green-600">
                {myComplaints.filter((c) => c.status === "open").length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-600">Cerrados</h3>
              <p className="text-2xl font-bold text-gray-600">
                {myComplaints.filter((c) => c.status === "closed").length}
              </p>
            </div>
          </div>

          {/* Complaints Grid */}
          {myComplaints.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {myComplaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  showActions={true}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes reclamos aún</h3>
              <p className="text-gray-500 mb-6">Crea tu primer reclamo para comenzar a gestionar tus solicitudes.</p>
              <Link href="/complaints/new">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Primer Reclamo
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
