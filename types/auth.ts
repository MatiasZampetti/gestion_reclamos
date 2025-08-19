export interface User {
  id: string
  email: string
  name: string
  role: "client" | "admin"
  createdAt: Date
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}
