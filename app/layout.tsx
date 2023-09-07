"use client"
import './globals.css'
import { Inter } from 'next/font/google'
import Header from '@/components/header'
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html suppressHydrationWarning>
      <body className={`min-h-screen overflow-hidden ${inter.className}`} >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem >
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
