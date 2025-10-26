import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

// ✅ Use Inter (a built-in Google font)
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AQI Monitor',
  description: 'Track real-time air quality levels and get safety tips',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* ✅ Apply font class to body */}
      <body className={inter.className}>{children}</body>
    </html>
  )
}
