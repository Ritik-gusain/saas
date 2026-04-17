import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Luminescent.io - Team AI Chatbot SaaS',
  description: 'Team-based AI chatbot powered by Bytez API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
