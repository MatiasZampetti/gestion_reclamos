import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { Chatbot } from "@/components/chatbot/chatbot"
import { LayoutWrapper } from "@/components/layout/layout-wrapper"

export const metadata: Metadata = {
  title: "Sistema de Reclamos",
  description: "Gestión de reclamos para sociedades",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
          <Toaster />
          <Chatbot />
        </AuthProvider>
      </body>
    </html>
  )
}
