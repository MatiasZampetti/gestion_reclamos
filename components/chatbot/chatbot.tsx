"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X, Search, ArrowLeft, Bot, Sparkles } from "lucide-react"
import { mockFAQs } from "@/lib/mock-admin-data"
import type { FAQ } from "@/types/faq"

interface ChatMessage {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

export function Chatbot() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [faqs] = useState<FAQ[]>(mockFAQs.filter((faq) => faq.isActive))
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [view, setView] = useState<"categories" | "faqs" | "chat">("categories")
  const [isTyping, setIsTyping] = useState(false)

  const shouldShowChatbot = !pathname.startsWith("/auth/login")

  useEffect(() => {
    if (selectedCategory) {
      const categoryFaqs = faqs.filter((faq) => faq.category === selectedCategory)
      setFilteredFaqs(categoryFaqs)
    } else {
      setFilteredFaqs(faqs)
    }
  }, [selectedCategory, faqs])

  useEffect(() => {
    if (searchTerm) {
      const filtered = faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredFaqs(filtered)
    } else if (selectedCategory) {
      const categoryFaqs = faqs.filter((faq) => faq.category === selectedCategory)
      setFilteredFaqs(categoryFaqs)
    } else {
      setFilteredFaqs(faqs)
    }
  }, [searchTerm, selectedCategory, faqs])

  const categories = [...new Set(faqs.map((faq) => faq.category))]

  const resetChat = () => {
    setView("categories")
    setSelectedCategory(null)
    setSelectedFaq(null)
    setSearchTerm("")
    setMessages([])
    setIsTyping(false)
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setView("faqs")
  }

  const handleFaqSelect = (faq: FAQ) => {
    setSelectedFaq(faq)
    setView("chat")
    setIsTyping(true)

    setMessages([
      {
        id: "1",
        type: "user",
        content: faq.question,
        timestamp: new Date(),
      },
    ])

    // Simulate bot typing
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: "2",
          type: "bot",
          content: faq.answer,
          timestamp: new Date(),
        },
      ])
    }, 1500)
  }

  const handleOpenDialog = () => {
    setIsOpen(true)
    if (messages.length === 0) {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages([
          {
            id: "welcome",
            type: "bot",
            content:
              "¡Hola! Soy el asistente virtual del sistema de reclamos. Puedo ayudarte con preguntas frecuentes. ¿En qué puedo ayudarte?",
            timestamp: new Date(),
          },
        ])
      }, 1000)
    }
  }

  const handleCloseDialog = () => {
    setIsOpen(false)
    resetChat()
  }

  const renderCategories = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="relative mx-auto mb-4">
          <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <div className="absolute -top-1 -right-1">
            <Sparkles className="h-6 w-6 text-yellow-400 animate-bounce" />
          </div>
        </div>
        <h3 className="text-lg font-semibold">¿En qué puedo ayudarte?</h3>
        <p className="text-sm text-gray-600">Selecciona una categoría para ver las preguntas frecuentes</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {categories.map((category) => {
          const categoryCount = faqs.filter((faq) => faq.category === category).length
          return (
            <Button
              key={category}
              variant="outline"
              className="h-auto p-4 justify-between bg-transparent hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              onClick={() => handleCategorySelect(category)}
            >
              <div className="text-left">
                <div className="font-medium">{category}</div>
                <div className="text-sm text-gray-500">{categoryCount} preguntas</div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {categoryCount}
              </Badge>
            </Button>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>¿No encuentras lo que buscas?</strong>
          <br />
          También puedes buscar directamente en todas las preguntas usando el campo de búsqueda.
        </p>
      </div>
    </div>
  )

  const renderFaqs = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={() => setView("categories")} className="hover:bg-blue-50">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="font-semibold">{selectedCategory}</h3>
          <p className="text-sm text-gray-600">{filteredFaqs.length} preguntas disponibles</p>
        </div>
      </div>

      <div className="space-y-2">
        {filteredFaqs.map((faq) => (
          <Button
            key={faq.id}
            variant="outline"
            className="h-auto p-3 text-left justify-start bg-transparent hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
            onClick={() => handleFaqSelect(faq)}
          >
            <div className="flex-1">
              <div className="font-medium text-sm">{faq.question}</div>
            </div>
          </Button>
        ))}
      </div>

      {filteredFaqs.length === 0 && (
        <div className="text-center py-8">
          <Bot className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No se encontraron preguntas en esta categoría.</p>
        </div>
      )}
    </div>
  )

  const renderChat = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b">
        <Button variant="ghost" size="sm" onClick={() => setView("faqs")} className="hover:bg-blue-50">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h3 className="font-semibold">Asistente Virtual</h3>
          <p className="text-sm text-gray-600">Respuesta a tu consulta</p>
        </div>
      </div>

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gradient-to-r from-gray-100 to-blue-50 text-gray-900 border border-gray-200"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">{message.timestamp.toLocaleTimeString()}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-r from-gray-100 to-blue-50 p-3 rounded-lg border border-gray-200">
                <div className="flex items-center gap-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">Escribiendo...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="mt-4 pt-4 border-t">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setView("categories")} className="flex-1 hover:bg-blue-50">
            Ver más categorías
          </Button>
          <Button variant="outline" size="sm" onClick={() => setView("faqs")} className="flex-1 hover:bg-blue-50">
            Más preguntas
          </Button>
        </div>
      </div>
    </div>
  )

  if (!shouldShowChatbot) {
    return null
  }

  return (
    <>
      <Button
        onClick={handleOpenDialog}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 z-50 transform hover:scale-110 transition-all duration-300 animate-pulse"
        size="icon"
      >
        <div className="relative">
          <Bot className="h-7 w-7" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      </Button>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md h-[600px] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <DialogTitle className="text-gray-900">Asistente Virtual</DialogTitle>
                  <p className="text-sm text-gray-600">Sistema de Reclamos • En línea</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCloseDialog} className="hover:bg-white/50">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 p-6 overflow-hidden">
            {view !== "categories" && (
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar en todas las preguntas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-blue-200 focus:border-blue-400"
                  />
                </div>
              </div>
            )}

            <div className="h-full">
              {view === "categories" && renderCategories()}
              {view === "faqs" && renderFaqs()}
              {view === "chat" && renderChat()}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
