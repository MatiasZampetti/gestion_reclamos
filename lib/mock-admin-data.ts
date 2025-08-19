import type { User } from "@/types/auth"
import type { FAQ } from "@/types/faq"

export const mockUsers: User[] = [
  {
    id: "1",
    email: "cliente@test.com",
    name: "Cliente Test",
    role: "client",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "2",
    email: "maria.gonzalez@email.com",
    name: "María González",
    role: "client",
    createdAt: new Date("2024-01-12"),
  },
  {
    id: "3",
    email: "carlos.rodriguez@email.com",
    name: "Carlos Rodríguez",
    role: "client",
    createdAt: new Date("2024-01-14"),
  },
  {
    id: "4",
    email: "ana.lopez@email.com",
    name: "Ana López",
    role: "client",
    createdAt: new Date("2024-01-16"),
  },
  {
    id: "admin",
    email: "admin@test.com",
    name: "Administrador",
    role: "admin",
    createdAt: new Date("2024-01-01"),
  },
]

export const mockFAQs: FAQ[] = [
  {
    id: "1",
    question: "¿Cómo puedo crear un nuevo reclamo?",
    answer:
      "Para crear un nuevo reclamo, ve al Dashboard y haz clic en el botón 'Crear Nuevo Reclamo'. Completa el formulario con toda la información requerida: entidad, categoría, subcategoría, descripción y ubicación. También puedes agregar una foto opcional.",
    category: "Reclamos",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    question: "¿Puedo editar mi reclamo después de crearlo?",
    answer:
      "Sí, puedes editar tus reclamos desde la sección 'Mis Reclamos'. Solo puedes editar los reclamos que tú mismo has creado. Haz clic en el ícono de editar y modifica la información que necesites.",
    category: "Reclamos",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    question: "¿Cómo funciona el sistema de votación?",
    answer:
      "Puedes votar 'Me parece bien' o 'No me parece bien' en los reclamos de otros usuarios. No puedes votar en tus propios reclamos. Los votos ayudan a priorizar los reclamos más importantes para la comunidad.",
    category: "Votación",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    question: "¿Qué tipos de entidades puedo reportar?",
    answer:
      "Puedes crear reclamos para Municipios, Escuelas, Clubes y Cooperativas. Cada entidad tiene categorías específicas como Alumbrado Público, Infraestructura Escolar, Servicios Deportivos, etc.",
    category: "General",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "5",
    question: "¿Cuánto tiempo toma resolver un reclamo?",
    answer:
      "El tiempo de resolución depende de la complejidad del reclamo y la entidad responsable. Los administradores revisan todos los reclamos y los derivan a las entidades correspondientes. Puedes seguir el estado de tu reclamo desde tu dashboard.",
    category: "General",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "6",
    question: "¿Puedo eliminar mi reclamo?",
    answer:
      "Sí, puedes eliminar tus propios reclamos desde la sección 'Mis Reclamos'. Ten en cuenta que esta acción no se puede deshacer.",
    category: "Reclamos",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]
