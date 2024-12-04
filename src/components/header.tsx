'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { ThemeSelector } from './theme-selector'
import UserMenu from './user-menu'

interface HeaderProps {
  menuItems: { id: string; label: string; url: string }[]
}

export default function Header({ menuItems }: HeaderProps) {
  const { data: session } = useSession()

  return (
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              NextPress
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/blog" className="text-blue-500 hover:underline">
                Blog
              </Link>
              {menuItems.map((item) => (
                  <Link key={item.id} href={item.url} className="text-blue-500 hover:underline">
                    {item.label}
                  </Link>
              ))}
              <ThemeSelector />
              <UserMenu />
              {session?.user?.role === 'admin' && (
                  <Link href="/dashboard" className="text-blue-500 hover:underline">
                    Dashboard
                  </Link>
              )}
            </div>
          </nav>
        </div>
      </header>
  )
}

