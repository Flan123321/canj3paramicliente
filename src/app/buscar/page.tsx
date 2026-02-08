import { getAllProperties } from '../actions/property'
import Link from 'next/link'
import { MapPin, Search as SearchIcon, Filter, List, ArrowLeft } from 'lucide-react'

// ============================================================
// 🗺️ INTERACTIVE MAP SEARCH
// ============================================================

export default async function SearchPage() {
    const properties = await getAllProperties()

    return (
        <div className="h-screen flex flex-col relative overflow-hidden bg-slate-100">

            {/* 1. Header Flotante */}
            <div className="absolute top-4 left-4 right-4 z-20 flex gap-2">
                <Link href="/dashboard" className="bg-white p-3 rounded-xl shadow-lg hover:bg-gray-50 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                </Link>

                <div className="flex-1 bg-white rounded-xl shadow-lg flex items-center px-4 py-2 gap-2 border border-gray-100">
                    <SearchIcon className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar en Las Condes..."
                        className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-400"
                    />
                </div>

                <button className="bg-white p-3 rounded-xl shadow-lg hover:bg-gray-50 transition-colors">
                    <Filter className="w-5 h-5 text-gray-700" />
                </button>
            </div>

            {/* 2. MAPA FALSO INTERACTIVO (Background) */}
            <div className="absolute inset-0 z-0">
                {/* Usamos una imagen de mapa estilizada como fondo */}
                <div
                    className="w-full h-full bg-cover bg-center opacity-80"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')` }}
                />
                <div className="absolute inset-0 bg-blue-900/10 pointer-events-none" />

                {/* Simulated Pins */}
                {properties.map((prop, idx) => {
                    // Generamos posiciones aleatorias para simular distribución en el mapa
                    // Usamos el ID para consistencia en re-renders (simple hash)
                    const pseudoRandom = (seed: string) => {
                        let h = 0xdeadbeef;
                        for (let i = 0; i < seed.length; i++)
                            h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
                        return ((h ^ h >>> 16) >>> 0) / 4294967296;
                    }

                    const top = 20 + (pseudoRandom(prop.id + 'top') * 60) // 20-80%
                    const left = 10 + (pseudoRandom(prop.id + 'left') * 80) // 10-90%

                    return (
                        <div
                            key={prop.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10 hover:z-50 transition-all duration-300"
                            style={{ top: `${top}%`, left: `${left}%` }}
                        >
                            <div className="relative">
                                {/* Pin */}
                                <div className="bg-blue-600 text-white px-3 py-1 rounded-full shadow-lg font-bold text-xs border-2 border-white transform group-hover:scale-110 transition-transform flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></span>
                                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', notation: 'compact' }).format(Number(prop.price))}
                                </div>

                                {/* Shape triangle */}
                                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-blue-600 mx-auto mt-[-1px]"></div>

                                {/* Tooltip Card (On Hover/Click) */}
                                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white rounded-xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    <div className="h-24 rounded-lg overflow-hidden mb-2 relative">
                                        <img
                                            src={prop.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'}
                                            alt={prop.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-1 right-1 bg-black/50 text-white text-[10px] px-1.5 rounded backdrop-blur-sm">
                                            {prop.propertyType === 'APARTMENT' ? 'Depto' : 'Casa'}
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-xs truncate">{prop.title}</h4>
                                    <p className="text-[10px] text-slate-500 truncate">{prop.location}</p>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-blue-600 font-bold text-xs">
                                            {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', notation: 'compact' }).format(Number(prop.price))}
                                        </span>
                                        {/* Fake verified badge */}
                                        {prop.owner?.isVerified && (
                                            <span className="text-[10px] text-green-600 font-medium flex items-center">
                                                <ShieldCheckIcon className="w-3 h-3 mr-0.5" /> Verif.
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* 3. Bottom Sheet (Lista rápida) */}
            <div className="absolute bottom-4 left-4 right-4 z-20">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/20 max-h-[30vh] overflow-y-auto no-scrollbar">
                    <div className="flex justify-between items-center mb-3 sticky top-0 bg-white/0 z-10">
                        <h3 className="font-bold text-slate-800 text-sm">
                            {properties.length} Propiedades en zona
                        </h3>
                        <button className="text-blue-600 text-xs font-bold flex items-center gap-1">
                            <List className="w-3 h-3" /> Ver lista completa
                        </button>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                        {properties.map((prop) => (
                            <div key={prop.id} className="min-w-[200px] bg-white rounded-xl p-2 shadow-sm border border-slate-100 snap-center">
                                <div className="h-24 rounded-lg overflow-hidden mb-2 relative">
                                    <img
                                        src={prop.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'}
                                        alt={prop.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h4 className="font-bold text-slate-900 text-xs truncate">{prop.title}</h4>
                                <p className="text-blue-600 font-bold text-xs mt-1">
                                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', notation: 'compact' }).format(Number(prop.price))}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function ShieldCheckIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
