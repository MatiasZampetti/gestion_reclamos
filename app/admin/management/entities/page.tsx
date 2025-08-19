"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Building2, FolderOpen, Tag } from "lucide-react"
import { complaintData } from "@/lib/complaint-data"

interface Entity {
  id: string
  name: string
  description: string
  categoriesCount: number
}

interface Category {
  id: string
  name: string
  entityId: string
  entityName: string
  subcategoriesCount: number
}

interface Subcategory {
  id: string
  name: string
  categoryId: string
  categoryName: string
  entityName: string
}

export default function EntitiesManagementPage() {
  // Convert complaint data to manageable format
  const [entities, setEntities] = useState<Entity[]>(() => {
    return Object.keys(complaintData).map((entityName) => ({
      id: entityName.toLowerCase().replace(/\s+/g, "-"),
      name: entityName,
      description: `Gestión de reclamos para ${entityName.toLowerCase()}`,
      categoriesCount: Object.keys(complaintData[entityName]).length,
    }))
  })

  const [categories, setCategories] = useState<Category[]>(() => {
    const cats: Category[] = []
    Object.entries(complaintData).forEach(([entityName, entityCategories]) => {
      Object.keys(entityCategories).forEach((categoryName) => {
        cats.push({
          id: `${entityName}-${categoryName}`.toLowerCase().replace(/\s+/g, "-"),
          name: categoryName,
          entityId: entityName.toLowerCase().replace(/\s+/g, "-"),
          entityName,
          subcategoriesCount: entityCategories[categoryName].length,
        })
      })
    })
    return cats
  })

  const [subcategories, setSubcategories] = useState<Subcategory[]>(() => {
    const subcats: Subcategory[] = []
    Object.entries(complaintData).forEach(([entityName, entityCategories]) => {
      Object.entries(entityCategories).forEach(([categoryName, subcategoryList]) => {
        subcategoryList.forEach((subcategoryName) => {
          subcats.push({
            id: `${entityName}-${categoryName}-${subcategoryName}`.toLowerCase().replace(/\s+/g, "-"),
            name: subcategoryName,
            categoryId: `${entityName}-${categoryName}`.toLowerCase().replace(/\s+/g, "-"),
            categoryName,
            entityName,
          })
        })
      })
    })
    return subcats
  })

  const [editingEntity, setEditingEntity] = useState<Entity | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null)
  const [isEntityDialogOpen, setIsEntityDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isSubcategoryDialogOpen, setIsSubcategoryDialogOpen] = useState(false)

  const handleSaveEntity = (formData: FormData) => {
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    if (editingEntity) {
      setEntities(entities.map((e) => (e.id === editingEntity.id ? { ...e, name, description } : e)))
    } else {
      const newEntity: Entity = {
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        description,
        categoriesCount: 0,
      }
      setEntities([...entities, newEntity])
    }

    setEditingEntity(null)
    setIsEntityDialogOpen(false)
  }

  const handleSaveCategory = (formData: FormData) => {
    const name = formData.get("name") as string
    const entityId = formData.get("entityId") as string
    const entityName = entities.find((e) => e.id === entityId)?.name || ""

    if (editingCategory) {
      setCategories(categories.map((c) => (c.id === editingCategory.id ? { ...c, name, entityId, entityName } : c)))
    } else {
      const newCategory: Category = {
        id: `${entityId}-${name}`.toLowerCase().replace(/\s+/g, "-"),
        name,
        entityId,
        entityName,
        subcategoriesCount: 0,
      }
      setCategories([...categories, newCategory])
    }

    setEditingCategory(null)
    setIsCategoryDialogOpen(false)
  }

  const handleSaveSubcategory = (formData: FormData) => {
    const name = formData.get("name") as string
    const categoryId = formData.get("categoryId") as string
    const category = categories.find((c) => c.id === categoryId)

    if (editingSubcategory) {
      setSubcategories(
        subcategories.map((s) =>
          s.id === editingSubcategory.id
            ? { ...s, name, categoryId, categoryName: category?.name || "", entityName: category?.entityName || "" }
            : s,
        ),
      )
    } else {
      const newSubcategory: Subcategory = {
        id: `${categoryId}-${name}`.toLowerCase().replace(/\s+/g, "-"),
        name,
        categoryId,
        categoryName: category?.name || "",
        entityName: category?.entityName || "",
      }
      setSubcategories([...subcategories, newSubcategory])
    }

    setEditingSubcategory(null)
    setIsSubcategoryDialogOpen(false)
  }

  const handleDeleteEntity = (id: string) => {
    setEntities(entities.filter((e) => e.id !== id))
    // Also delete related categories and subcategories
    const relatedCategories = categories.filter((c) => c.entityId === id)
    relatedCategories.forEach((cat) => {
      setSubcategories(subcategories.filter((s) => s.categoryId !== cat.id))
    })
    setCategories(categories.filter((c) => c.entityId !== id))
  }

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id))
    setSubcategories(subcategories.filter((s) => s.categoryId !== id))
  }

  const handleDeleteSubcategory = (id: string) => {
    setSubcategories(subcategories.filter((s) => s.id !== id))
  }

  return (
    <div className="p-6 md:ml-64">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Entidades</h1>
        <p className="text-gray-600 mt-2">Administra entidades, categorías y subcategorías del sistema de reclamos</p>
      </div>

      <Tabs defaultValue="entities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="entities" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Entidades ({entities.length})
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Categorías ({categories.length})
          </TabsTrigger>
          <TabsTrigger value="subcategories" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Subcategorías ({subcategories.length})
          </TabsTrigger>
        </TabsList>

        {/* Entities Tab */}
        <TabsContent value="entities" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Entidades</h2>
            <Dialog open={isEntityDialogOpen} onOpenChange={setIsEntityDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingEntity(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Entidad
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form action={handleSaveEntity}>
                  <DialogHeader>
                    <DialogTitle>{editingEntity ? "Editar Entidad" : "Nueva Entidad"}</DialogTitle>
                    <DialogDescription>
                      {editingEntity ? "Modifica los datos de la entidad" : "Crea una nueva entidad para el sistema"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={editingEntity?.name || ""}
                        placeholder="Ej: Hospitales"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        name="description"
                        defaultValue={editingEntity?.description || ""}
                        placeholder="Descripción de la entidad"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEntityDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">{editingEntity ? "Guardar Cambios" : "Crear Entidad"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entities.map((entity) => (
              <Card key={entity.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{entity.name}</CardTitle>
                      <CardDescription className="mt-1">{entity.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">{entity.categoriesCount} categorías</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingEntity(entity)
                        setIsEntityDialogOpen(true)
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                          <Trash2 className="h-3 w-3 mr-1" />
                          Eliminar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar entidad?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción eliminará la entidad "{entity.name}" y todas sus categorías y subcategorías
                            asociadas. Esta acción no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteEntity(entity.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Categorías</h2>
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingCategory(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Categoría
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form action={handleSaveCategory}>
                  <DialogHeader>
                    <DialogTitle>{editingCategory ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
                    <DialogDescription>
                      {editingCategory ? "Modifica los datos de la categoría" : "Crea una nueva categoría"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={editingCategory?.name || ""}
                        placeholder="Ej: Alumbrado Público"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="entityId">Entidad</Label>
                      <Select name="entityId" defaultValue={editingCategory?.entityId || ""} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una entidad" />
                        </SelectTrigger>
                        <SelectContent>
                          {entities.map((entity) => (
                            <SelectItem key={entity.id} value={entity.id}>
                              {entity.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">{editingCategory ? "Guardar Cambios" : "Crear Categoría"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription className="mt-1">Entidad: {category.entityName}</CardDescription>
                    </div>
                    <Badge variant="secondary">{category.subcategoriesCount} subcategorías</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingCategory(category)
                        setIsCategoryDialogOpen(true)
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                          <Trash2 className="h-3 w-3 mr-1" />
                          Eliminar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción eliminará la categoría "{category.name}" y todas sus subcategorías asociadas.
                            Esta acción no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCategory(category.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Subcategories Tab */}
        <TabsContent value="subcategories" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Subcategorías</h2>
            <Dialog open={isSubcategoryDialogOpen} onOpenChange={setIsSubcategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingSubcategory(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Subcategoría
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form action={handleSaveSubcategory}>
                  <DialogHeader>
                    <DialogTitle>{editingSubcategory ? "Editar Subcategoría" : "Nueva Subcategoría"}</DialogTitle>
                    <DialogDescription>
                      {editingSubcategory ? "Modifica los datos de la subcategoría" : "Crea una nueva subcategoría"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={editingSubcategory?.name || ""}
                        placeholder="Ej: Lámparas quemadas"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoryId">Categoría</Label>
                      <Select name="categoryId" defaultValue={editingSubcategory?.categoryId || ""} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.entityName} - {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsSubcategoryDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">{editingSubcategory ? "Guardar Cambios" : "Crear Subcategoría"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subcategories.map((subcategory) => (
              <Card key={subcategory.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{subcategory.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {subcategory.entityName} → {subcategory.categoryName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingSubcategory(subcategory)
                        setIsSubcategoryDialogOpen(true)
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                          <Trash2 className="h-3 w-3 mr-1" />
                          Eliminar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar subcategoría?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción eliminará la subcategoría "{subcategory.name}". Esta acción no se puede
                            deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteSubcategory(subcategory.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
