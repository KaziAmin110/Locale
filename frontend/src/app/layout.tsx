import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import LoadingSpinner from './components/LoadingSpinner'

export const metadata: Metadata = {
  title: 'Locale - Find Your Perfect Living Space',
  description: 'Discover apartments, meet potential roommates, and explore local spots that match your lifestyle',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <LoadingSpinner size="lg" />
            </div>
          }>
            {children}
          </Suspense>
        </div>
      </body>
    </html>
  )
}