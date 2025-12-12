import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Header from '@/components/header'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'

// SF Pro Display Font
const sfProDisplay = localFont({
  src: [
    {
      path: './fonts/sfprodisplayregular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/sfprodisplaymedium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/sfprodisplaybold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-sf-pro',
  display: 'swap',
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
        {/* Bootstrap Icons */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={`${sfProDisplay.variable} font-sf-pro`}>
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
