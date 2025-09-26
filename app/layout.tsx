import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/AuthContext"
import { CartProvider } from "@/contexts/CartContext"
import { AnimationProvider } from "@/contexts/AnimationContext"
import { NotificationProvider } from "@/contexts/NotificationContext"
import { PremiumNavigation } from "@/components/layout/PremiumNavigation"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "EcoFinds - Sustainable Second-Hand Marketplace",
  description: "Discover unique finds and promote sustainable consumption",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <ErrorBoundary>
            <AuthProvider>
              <CartProvider>
                <NotificationProvider>
                  <AnimationProvider>
                    <PremiumNavigation>
                      {children}
                    </PremiumNavigation>
                    <Toaster />
                  </AnimationProvider>
                </NotificationProvider>
              </CartProvider>
            </AuthProvider>
          </ErrorBoundary>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
