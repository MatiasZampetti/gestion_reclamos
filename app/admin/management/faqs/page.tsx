"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { MessageSquare, Plus, Edit, Trash2, Search } from "lucide-react"
import { mockFAQs } from "@/lib/mock-admin-data"
import type { FAQ } from "@/types/faq"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function AdminFAQsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [faqs, setFaqs] = useState<FAQ[]>(mockFAQs)
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>(mockFAQs)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Form state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
    isActive: true,
  })
  const [formError, setFormError] = useState("")

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
    let filtered = faqs

    if (searchTerm) {
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((faq) => faq.category === categoryFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((faq) => faq.isActive === (statusFilter === "active"))
    }

    setFilteredFaqs(filtered)
  }, [faqs, searchTerm, categoryFilter, statusFilter])

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const categories = [...new Set(faqs.map((faq) => faq.category))]

  const resetForm = () => {
    setFormData({
      question: "",
      answer: "",
      category: "",
      isActive: true,
    })
    setEditingFaq(null)
    setFormError("")
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (faq: FAQ) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      isActive: faq.isActive,
    })
    setEditingFaq(faq)
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    if (!formData.question.trim() || !formData.answer.trim() || !formData.category.trim()) {
      setFormError("Todos los campos son obligatorios")
      return
    }

    if (formData.question.length < 10) {
      setFormError("La pregunta debe tener al menos 10 caracteres")
      return
    }

    if (formData.answer.length < 20) {
      setFormError("La respuesta debe tener al menos 20 caracteres")
      return
    }

    if (editingFaq) {
      // Update existing FAQ
      setFaqs((prev) =>
        prev.map((faq) =>
          faq.id === editingFaq.id
            ? {
                ...faq,
                question: formData.question.trim(),
                answer: formData.answer.trim(),
                category: formData.category.trim(),
                isActive: formData.isActive,
                updatedAt: new Date(),
              }
            : faq,
        ),
      )
      toast({
        title: "FAQ actualizada",
        description: "La pregunta frecuente ha sido actualizada exitosamente.",
      })
    } else {
      // Create new FAQ
      const newFaq: FAQ = {
        id: Date.now().toString(),
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        category: formData.category.trim(),
        isActive: formData.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setFaqs((prev) => [newFaq, ...prev])
      toast({
        title: "FAQ creada",
        description: "La nueva pregunta frecuente ha sido creada exitosamente.",
      })
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const handleDelete = (faqId: string) => {
    const faqToDelete = faqs.find((faq) => faq.id === faqId)
    if (!faqToDelete) return

    if (confirm(`¿Estás seguro de que quieres eliminar la FAQ "${faqToDelete.question}"?`)) {
      setFaqs((prev) => prev.filter((faq) => faq.id !== faqId))
      toast({
        title: "FAQ eliminada",
        description: "La pregunta frecuente ha sido eliminada exitosamente.",
      })
    }
  }

  const handleToggleStatus = (faqId: string) => {
    setFaqs((prev) =>
      prev.map((faq) => (faq.id === faqId ? { ...faq, isActive: !faq.isActive, updatedAt: new Date() } : faq)),
    )

    const faq = faqs.find((f) => f.id === faqId)
    toast({
      title: `FAQ ${faq?.isActive ? "desactivada" : "activada"}`,
      description: `La pregunta frecuente ha sido ${faq?.isActive ? "desactivada" : "activada"}.`,
    })
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 md:ml-64">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                  <h1 className="text-3xl font-bold text-gray-900">Gestión de FAQs</h1>
                </div>
                <p className="text-gray-600">Administra las preguntas frecuentes del chatbot</p>
              </div>
              <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Nueva FAQ
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

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

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="active">Activas</SelectItem>
                    <SelectItem value="inactive">Inactivas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{filteredFaqs.length}</div>
                <p className="text-sm text-gray-600">Total FAQs</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {filteredFaqs.filter((faq) => faq.isActive).length}
                </div>
                <p className="text-sm text-gray-600">Activas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-gray-600">
                  {filteredFaqs.filter((faq) => !faq.isActive).length}
                </div>
                <p className="text-sm text-gray-600">Inactivas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
                <p className="text-sm text-gray-600">Categorías</p>
              </CardContent>
            </Card>
          </div>

          {/* FAQs List */}
          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <Card key={faq.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{faq.category}</Badge>
                        <Badge variant={faq.isActive ? "default" : "secondary"}>
                          {faq.isActive ? "Activa" : "Inactiva"}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-3">{faq.answer}</p>
                      <div className="text-sm text-gray-500">
                        Creada: {faq.createdAt.toLocaleDateString()} | Actualizada: {faq.updatedAt.toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <div className="flex items-center gap-2">
                        <Switch checked={faq.isActive} onCheckedChange={() => handleToggleStatus(faq.id)} />
                      </div>
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(faq)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(faq.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron FAQs</h3>
              <p className="text-gray-500">No hay preguntas frecuentes que coincidan con los filtros aplicados.</p>
            </div>
          )}

          {/* Create/Edit Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingFaq ? "Editar FAQ" : "Nueva FAQ"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                  <Alert variant="destructive">
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="question">Pregunta</Label>
                  <Input
                    id="question"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="¿Cómo puedo...?"
                    maxLength={200}
                  />
                  <div className="text-sm text-gray-500 text-right">{formData.question.length}/200</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="answer">Respuesta</Label>
                  <Textarea
                    id="answer"
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    placeholder="Para hacer esto, debes..."
                    rows={5}
                    maxLength={1000}
                  />
                  <div className="text-sm text-gray-500 text-right">{formData.answer.length}/1000</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ej: Reclamos, General, Votación"
                    maxLength={50}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">FAQ activa (visible en el chatbot)</Label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingFaq ? "Actualizar FAQ" : "Crear FAQ"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  )
}
