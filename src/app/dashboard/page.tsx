import { redirect } from 'next/navigation'
import { getUser, getUserProfile } from '../auth/actions'
import { getMatchesForUser } from '../actions/property'
import Link from 'next/link'
import { Search, Home, TrendingUp, ArrowRight, User as UserIcon } from 'lucide-react'

// ============================================================
// 🌟 NEW DASHBOARD - "SIMPLE & DIRECT"
// ============================================================

export default async function DashboardPage() {
    // 1. Auth Check
    const user = await getUser()
    if (!user) redirect('/auth/login')

    const profile = await getUserProfile()
    const matches = await getMatchesForUser()

    return (
        <div className="min-h-screen bg-gray-50 pb-24 font-sans">
            {/* Header Mínimalista */}
            <header className="bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 rounded-lg p-1.5">
                        <span className="text-white font-bold text-lg">C</span>
                    </div>
                    <span className="font-bold text-slate-800 text-lg">CanjeParaMiCliente</span>
                </div>

                <Link href="/perfil" className="relative group">
                    {profile?.avatarUrl ? (
                        <img src={profile.avatarUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 border-2 border-white shadow-sm hover:bg-slate-300 transition-colors">
                            <UserIcon className="w-5 h-5" />
                        </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </Link>
            </header>

            <main className="max-w-md mx-auto px-6 py-8">

                {/* Hero Text */}
                <h1 className="text-2xl font-bold text-slate-900 text-center mb-10 leading-tight">
                    ¿Cómo podemos ayudarte hoy?
                </h1>

                {/* Main Actions - The "Big Buttons" */}
                <div className="space-y-4 mb-12">
                    {/* Opción 1: Buscar (Tengo Cliente) */}
                    <Link href="/buscar" className="block group">
                        <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-600/20 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="w-6 h-6" />
                            </div>

                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                                <Search className="w-7 h-7 text-white" strokeWidth={2.5} />
                            </div>

                            <h2 className="text-xl font-bold mb-1">Tengo un Cliente</h2>
                            <p className="text-blue-100 text-sm font-medium opacity-90">
                                Busco una propiedad para mi cliente
                            </p>
                        </div>
                    </Link>

                    {/* Opción 2: Publicar (Tengo Propiedad) */}
                    <Link href="/publicar" className="block group">
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="w-6 h-6" />
                            </div>

                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                                <Home className="w-7 h-7 text-slate-700" strokeWidth={2} />
                            </div>

                            <h2 className="text-xl font-bold text-slate-900 mb-1">Tengo una Propiedad</h2>
                            <p className="text-slate-500 text-sm font-medium">
                                Busco un comprador para mi propiedad
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Recent Opportunities Feed */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-slate-800 text-lg">Oportunidades Recientes</h3>
                    </div>

                    <div className="space-y-4">
                        {matches.length > 0 ? (
                            matches.map((match) => (
                                <MatchCard key={match.id} match={match} />
                            ))
                        ) : (
                            <EmptyState />
                        )}
                    </div>
                </section>
            </main>
        </div>
    )
}

// 🃏 Componentes UI Auxiliares

function MatchCard({ match }: { match: any }) {
    // Intentamos obtener la imagen, si no hay, fallback
    const image = match.property.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1000'

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="relative h-48">
                <img
                    src={image}
                    alt="Property"
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-800 shadow-sm">
                    {match.matchScore}% Match
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className="font-bold text-slate-900 text-lg leading-tight mb-1">
                            {match.property.title}
                        </h4>
                        <p className="text-slate-500 text-sm flex items-center gap-1">
                            {match.property.location}
                        </p>
                    </div>
                    <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-lg text-sm border border-slate-100">
                        {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(match.property.price))}
                    </span>
                </div>

                <div className="flex gap-2 mt-4">
                    <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg">
                        {match.property.propertyType === 'APARTMENT' ? 'Depto' : 'Casa'}
                    </span>
                    <span className="text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
                        {match.property.bedrooms}D / {match.property.bathrooms}B
                    </span>
                </div>

                <button className="w-full mt-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all text-sm">
                    Solicitar Canje
                </button>
            </div>
        </div>
    )
}

function EmptyState() {
    return (
        <div className="bg-white rounded-2xl p-8 text-center border-2 border-dashed border-slate-100">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-6 h-6 text-slate-300" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-1">No hay matches aún</h4>
            <p className="text-sm text-slate-500">
                Publica una propiedad o crea un requerimiento para ver oportunidades aquí.
            </p>
        </div>
    )
}
