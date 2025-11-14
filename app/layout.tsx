import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'Samsun Forum - Samsunun Dijital Meydanı',
  description: 'Samsun için hyper-local forum platformu. Şehir sakinlerinin buluşma noktası.',
  keywords: ['samsun', 'forum', 'samsun forum', 'samsunspor', 'samsun etkinlik'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body className={plusJakartaSans.variable}>
        <div className="relative flex min-h-screen w-full flex-col">
          <Header />
          {children}
        </div>
      </body>
    </html>
  )
}

