import { redirect } from 'next/navigation'
import { getUser, getUserProfile, logout } from '../auth/actions'
import { getMatchesForUser } from '../actions/property'
import Link from 'next/link'
import { Bell, Flame, TrendingUp } from 'lucide-react'

// ============================================================
// 📊 DASHBOARD - "MIS CANJES"
// ============================================================

export default async function DashboardPage() {
    const user = await getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const profile = await getUserProfile()

    // 1. Cargar Matches Reales
    const matches = await getMatchesForUser()
    const matchCount = matches.length

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold text-gray-900 flex items-center gap-1">
                        Canje<span className="text-blue-600">ParaMiCliente</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 hidden sm:block">
                            {profile?.name || user.email}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {profile?.name?.[0] || 'U'}
                        </div>
                        <form action={logout}>
                            <button
                                type="submit"
                                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                            >
                                Salir
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Welcome & Stats */}
                <div className="grid md:grid-cols-4 gap-6">
                    <div className="md:col-span-3">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Hola, {profile?.name?.split(' ')[0] || 'Corredor'}
                        </h1>
                        <p className="text-gray-500">
                            Aquí tienes el resumen de tu actividad hoy.
                        </p>
                    </div>

                    {/* Archer Score Card (Fake for demo) */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 text-white shadow-lg flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-semibold">Reputación</p>
                            <p className="text-2xl font-bold text-yellow-400">Level 3</p>
                        </div>
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                            ⭐
                        </div>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatBox label="Propiedades" value="0" icon="🏠" />
                    <StatBox label="Requerimientos" value="0" icon="🎯" />
                    <StatBox label="Matches" value={matchCount.toString()} icon="🔥" highlight />
                    <StatBox label="Vistas" value="0" icon="👁️" />
                </div>

                {/* 🚀 MATCHES FEED (El Core del Dashboard) */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Flame className="w-5 h-5 text-orange-500" />
                            Oportunidades de Match
                        </h2>
                        {matchCount > 0 && (
                            <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">
                                {matchCount} Nuevos
                            </span>
                        )}
                    </div>

                    {matches.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">Sin matches por ahora</h3>
                            <p className="text-sm text-gray-500 mb-6">Estamos buscando compradores para tus propiedades.</p>
                            <Link href="/publicar">
                                <button className="btn-primary px-6 py-2 text-sm">
                                    Publicar Propiedad
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {matches.map((match) => (
                                <MatchCard key={match.id} match={match} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-4">
                    <Link href="/publicar" className="group">
                        <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-1">
                            <h3 className="font-bold text-lg mb-1">Publicar Propiedad</h3>
                            <p className="text-blue-100 text-sm">Sube una nueva propiedad y encuentra matches instantáneos.</p>
                        </div>
                    </Link>
                    <Link href="/requerimientos/nuevo" className="group">
                        <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-lg hover:shadow-gray-500/30 transition-all hover:-translate-y-1">
                            <h3 className="font-bold text-lg mb-1">Crear Requerimiento</h3>
                            <p className="text-gray-400 text-sm">Define qué busca tu cliente y recibe notificaciones.</p>
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    )
}

function StatBox({ label, value, icon, highlight }: any) {
    return (
        <div className={`bg-white rounded-xl p-4 border ${highlight ? 'border-orange-200 bg-orange-50/50' : 'border-gray-100'} shadow-sm`}>
            <div className="flex justify-between items-start mb-2">
                <span className="text-2xl">{icon}</span>
                {highlight && <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className={`text-xs ${highlight ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>{label}</p>
        </div>
    )
}

function MatchCard({ match }: { match: any }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg">
                    {match.matchScore}%
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-900">
                        {match.property ? `Match para: ${match.property.title}` : 'Match encontrado'}
                    </p>
                    <p className="text-xs text-gray-500">
                        {match.requirement?.user?.name || 'Usuario Anónimo'} busca en {match.property?.location}
                    </p>
                </div>
            </div>

            <button className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Contactar
            </button>
        </div>
    )
}
