import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Header from '@/components/header'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'

// Google Font'u yükle
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
})

// Sayfa meta bilgileri (SEO için)
export const metadata: Metadata = {
  title: 'OMÜForum - Ondokuz Mayıs Üniversitesi Öğrenci Forumu',
  description: 'OMÜ öğrencilerinin dijital buluşma noktası. Not paylaşımı, etkinlikler, itiraflar ve daha fazlası.',
  keywords: ['omü', 'omu', 'ondokuz mayıs üniversitesi', 'forum', 'öğrenci', 'samsun', 'üniversite'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="dark">
      <head>
        {/* Material Symbols iconlarını yükle */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body className={plusJakartaSans.variable}>
        <ThemeProvider>
          <AuthProvider>
            <div className="relative flex min-h-screen w-full flex-col">
              <Header />
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}