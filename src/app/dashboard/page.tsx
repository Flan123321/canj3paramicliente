import { redirect } from 'next/navigation'
import { getUser, getUserProfile, logout } from '../auth/actions'
import Link from 'next/link'

export default async function DashboardPage() {
    const user = await getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const profile = await getUserProfile()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="text-xl font-bold text-white">
                            Canje<span className="text-orange-500">ParaMiCliente</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            <span className="text-slate-400 text-sm">
                                {profile?.name || user.email}
                            </span>
                            <form action={logout}>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    Cerrar sesión
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        ¡Bienvenido, {profile?.name?.split(' ')[0] || 'Corredor'}!
                    </h1>
                    <p className="text-slate-400">
                        Gestiona tus propiedades y requerimientos desde aquí.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Propiedades"
                        value="0"
                        description="Publicadas"
                        icon="🏠"
                        href="/propiedades"
                    />
                    <StatsCard
                        title="Requerimientos"
                        value="0"
                        description="Activos"
                        icon="🎯"
                        href="/requerimientos"
                    />
                    <StatsCard
                        title="Matches"
                        value="0"
                        description="Nuevos"
                        icon="🔗"
                        href="/matches"
                    />
                    <StatsCard
                        title="Reputación"
                        value={profile?.reputation_score || 0}
                        description="Puntos"
                        icon="⭐"
                        href="/perfil"
                    />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <QuickActionCard
                        title="Publicar Propiedad"
                        description="Agrega una nueva propiedad a tu portafolio"
                        buttonText="Nueva Propiedad"
                        href="/propiedades/nueva"
                        gradient="from-blue-500 to-blue-600"
                    />
                    <QuickActionCard
                        title="Crear Requerimiento"
                        description="Define lo que tu cliente está buscando"
                        buttonText="Nuevo Requerimiento"
                        href="/requerimientos/nuevo"
                        gradient="from-orange-500 to-orange-600"
                    />
                </div>
            </main>
        </div>
    )
}

function StatsCard({ title, value, description, icon, href }: {
    title: string
    value: string | number
    description: string
    icon: string
    href: string
}) {
    return (
        <Link
            href={href}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 hover:border-slate-600 transition-all group"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-slate-400 text-sm mb-1">{title}</p>
                    <p className="text-3xl font-bold text-white mb-1">{value}</p>
                    <p className="text-slate-500 text-sm">{description}</p>
                </div>
                <span className="text-3xl group-hover:scale-110 transition-transform">{icon}</span>
            </div>
        </Link>
    )
}

function QuickActionCard({ title, description, buttonText, href, gradient }: {
    title: string
    description: string
    buttonText: string
    href: string
    gradient: string
}) {
    return (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6">
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-slate-400 mb-4">{description}</p>
            <Link
                href={href}
                className={`inline-block py-2 px-4 bg-gradient-to-r ${gradient} text-white font-medium rounded-lg hover:opacity-90 transition-opacity`}
            >
                {buttonText}
            </Link>
        </div>
    )
}
