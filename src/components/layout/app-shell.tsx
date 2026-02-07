'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, PlusCircle, Repeat2, User } from 'lucide-react'

// ============================================================
// 🧭 BOTTOM NAVIGATION - Mobile First
// ============================================================

const navItems = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/buscar', label: 'Buscar', icon: Search },
    { href: '/publicar', label: 'Publicar', icon: PlusCircle, isMain: true },
    { href: '/matches', label: 'Matches', icon: Repeat2 },
    { href: '/perfil', label: 'Perfil', icon: User },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-gray-200/50 safe-area-pb">
            <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    if (item.isMain) {
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center justify-center -mt-6"
                            >
                                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105 active:scale-95">
                                    <Icon className="w-6 h-6" strokeWidth={2} />
                                </div>
                            </Link>
                        )
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${isActive
                                    ? 'text-blue-600'
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <Icon
                                className={`w-5 h-5 mb-1 transition-transform ${isActive ? 'scale-110' : ''
                                    }`}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span className={`text-[10px] font-medium ${isActive ? 'text-blue-600' : ''
                                }`}>
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}

// ============================================================
// 📱 APP SHELL - Layout con Bottom Nav
// ============================================================

interface AppShellProps {
    children: React.ReactNode
    showNav?: boolean
}

export function AppShell({ children, showNav = true }: AppShellProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <main className={showNav ? 'pb-20' : ''}>
                {children}
            </main>

            {/* Bottom Navigation */}
            {showNav && <BottomNav />}
        </div>
    )
}
