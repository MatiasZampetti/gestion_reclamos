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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, X, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { getEntities, getCategories, getSubcategories } from "@/lib/complaint-data"
import { saveComplaint } from "@/lib/complaint-storage"
import type { Complaint } from "@/types/complaint"

export default function NewComplaintPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Form state
  const [title, setTitle] = useState("")
  const [entity, setEntity] = useState("")
  const [category, setCategory] = useState("")
  const [subcategory, setSubcategory] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Cascade data
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
  }, [user, router])

  // Update categories when entity changes
  useEffect(() => {
    if (entity) {
      const categories = getCategories(entity)
      setAvailableCategories(categories)
      setCategory("")
      setSubcategory("")
      setAvailableSubcategories([])
    } else {
      setAvailableCategories([])
      setCategory("")
      setSubcategory("")
      setAvailableSubcategories([])
    }
  }, [entity])

  // Update subcategories when category changes
  useEffect(() => {
    if (entity && category) {
      const subcategories = getSubcategories(entity, category)
      setAvailableSubcategories(subcategories)
      setSubcategory("")
    } else {
      setAvailableSubcategories([])
      setSubcategory("")
    }
  }, [entity, category])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("La imagen no puede superar los 5MB")
        return
      }

      if (!file.type.startsWith("image/")) {
        setError("Solo se permiten archivos de imagen")
        return
      }

      setPhoto(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setError("")
    }
  }

  const removePhoto = () => {
    setPhoto(null)
    setPhotoPreview(null)
  }

  const generateTitle = () => {
    if (subcategory && location) {
      setTitle(`${subcategory} en ${location}`)
    } else if (subcategory) {
      setTitle(subcategory)
    }
  }

  const clearForm = () => {
    setTitle("")
    setEntity("")
    setCategory("")
    setSubcategory("")
    setDescription("")
    setLocation("")
    setPhoto(null)
    setPhotoPreview(null)
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validation
    if (!title.trim()) {
      setError("El título es obligatorio")
      setLoading(false)
      return
    }

    if (!entity || !category || !subcategory) {
      setError("Debes seleccionar entidad, categoría y subcategoría")
      setLoading(false)
      return
    }

    if (!description.trim()) {
      setError("La descripción es obligatoria")
      setLoading(false)
      return
    }

    if (description.length < 20) {
      setError("La descripción debe tener al menos 20 caracteres")
      setLoading(false)
      return
    }

    try {
      const newComplaint: Complaint = {
        id: Date.now().toString(),
        title: title.trim(),
        entity,
        category,
        subcategory,
        description: description.trim(),
        location: location.trim(),
        photo: photoPreview || undefined,
        authorId: user!.id,
        authorName: user!.name,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "open",
        votes: {
          positive: 0,
          negative: 0,
          userVotes: {},
        },
      }

      // Save to localStorage
      saveComplaint(newComplaint)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "¡Reclamo creado exitosamente! 🎉",
        description: "Tu reclamo ha sido registrado y será revisado por los administradores.",
      })

      clearForm()
      router.push("/complaints/my")
    } catch (err) {
      setError("Error al crear el reclamo. Inténtalo nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    clearForm()
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const entities = getEntities()

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
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Reclamo</h1>
            </div>
            <p className="text-gray-600">Completa el formulario para registrar tu reclamo</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Información del Reclamo</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Entity Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="entity">
                      Entidad <span className="text-red-500">*</span>
                    </Label>
                    <Select value={entity} onValueChange={setEntity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una entidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {entities.map((ent) => (
                          <SelectItem key={ent} value={ent}>
                            {ent}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Categoría <span className="text-red-500">*</span>
                    </Label>
                    <Select value={category} onValueChange={setCategory} disabled={!entity}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={entity ? "Selecciona una categoría" : "Primero selecciona una entidad"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subcategory Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="subcategory">
                      Subcategoría <span className="text-red-500">*</span>
                    </Label>
                    <Select value={subcategory} onValueChange={setSubcategory} disabled={!category}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={category ? "Selecciona una subcategoría" : "Primero selecciona una categoría"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubcategories.map((subcat) => (
                          <SelectItem key={subcat} value={subcat}>
                            {subcat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Ej: Av. Principal 123, Barrio Centro"
                      onBlur={generateTitle}
                    />
                    <p className="text-sm text-gray-500">Especifica dónde ocurre el problema</p>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Título del Reclamo <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ej: Lámparas quemadas en Av. Principal"
                      maxLength={100}
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Un título claro y descriptivo</span>
                      <span>{title.length}/100</span>
                    </div>
                    {subcategory && location && !title && (
                      <Button type="button" variant="outline" size="sm" onClick={generateTitle}>
                        Generar título automático
                      </Button>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Descripción <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe detalladamente el problema, cuándo ocurre, cómo afecta, etc."
                      rows={5}
                      maxLength={1000}
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Mínimo 20 caracteres. Sé específico y detallado.</span>
                      <span>{description.length}/1000</span>
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="photo">Foto (Opcional)</Label>
                    {!photoPreview ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">Sube una imagen que muestre el problema</p>
                          <p className="text-xs text-gray-500">PNG, JPG hasta 5MB</p>
                          <input
                            type="file"
                            id="photo"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("photo")?.click()}
                          >
                            Seleccionar Imagen
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={photoPreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={removePhoto}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? "Creando reclamo..." : "Crear Reclamo"}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
