import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/contexts/theme-context'
import SessionWrapper from '@/components/session-wrapper'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'NextPress',
  description: 'A WordPress-like CMS built with Next.js',
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <SessionWrapper>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </SessionWrapper>
      </body>
      </html>
  )
}

