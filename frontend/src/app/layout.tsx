import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import LoadingSpinner from './components/LoadingSpinner'

export const metadata: Metadata = {
  title: 'CityMate - Find Your New City Life',
  description: 'Discover apartments, meet people, and explore places in your new city',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="min-h-screen bg-white">
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