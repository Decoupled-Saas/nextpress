import { ReactNode } from 'react'
import Link from 'next/link'
import { ThemeProvider } from '@/contexts/theme-context'
import UserMenu from '@/components/user-menu'
import { checkRole } from '@/lib/rbac'
import { Toaster } from "@/components/ui/sonner"
import {ThemeSelector} from "@/components/theme-selector";

interface DashboardLayoutProps {
    children: ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
    await checkRole(['admin', 'editor'])

    return (
        <ThemeProvider>
            <div className="min-h-screen bg-background text-foreground">
                <header className="border-b">
                    <div className="container mx-auto px-4 py-6">
                        <nav className="flex justify-between items-center">
                            <Link href="/dashboard" className="text-2xl font-bold">
                                NextPress Dashboard
                            </Link>
                            <div className="flex items-center space-x-4">
                                <Link href="/" className="text-blue-500 hover:underline">
                                    View Site
                                </Link>
                                <ThemeSelector />
                                <UserMenu />
                            </div>
                        </nav>
                    </div>
                </header>
                <div className="flex">
                    <aside className="w-64 bg-secondary h-screen p-4">
                        <nav>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/dashboard" className="block p-2 hover:bg-primary/10 rounded">
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard/posts" className="block p-2 hover:bg-primary/10 rounded">
                                        Posts
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard/pages" className="block p-2 hover:bg-primary/10 rounded">
                                        Pages
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard/menu" className="block p-2 hover:bg-primary/10 rounded">
                                        Menu
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard/users" className="block p-2 hover:bg-primary/10 rounded">
                                        Users
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard/plans" className="block p-2 hover:bg-primary/10 rounded">
                                        Plans
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </aside>
                    <main className="flex-1 p-8">
                        {children}
                    </main>
                </div>
                <Toaster/>
            </div>
        </ThemeProvider>
    )
}

