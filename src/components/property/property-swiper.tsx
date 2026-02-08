'use client'

import React, { useState } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { X, Check, MapPin, BedDouble, Maximize, TrendingUp, DollarSign, Filter } from 'lucide-react'
import Image from 'next/image'

// ============================================================
// 🃏 PROPERTY SWIPER - Tinder B2B Professional
// ============================================================

interface Property {
    id: string
    title: string
    location: string
    price: number
    currency: string
    bedrooms: number
    bathrooms: number
    squareMeters: number
    imageUrl: string
    yield?: number // Rentabilidad estimada
    tags?: string[]
}

// ============================================================
// 🃏 MOCK DATA - Decks Separados (Venta vs Arriendo)
// ============================================================

const SALE_DECK: Property[] = [
    {
        id: 'sale-3',
        title: 'Casa Familiar La Reina',
        location: 'La Reina, Santiago',
        price: 450000000,
        currency: 'CLP',
        bedrooms: 5,
        bathrooms: 4,
        squareMeters: 280,
        imageUrl: 'https://images.unsplash.com/photo-1600596542815-22b845074783?q=80&w=1000&auto=format&fit=crop',
        tags: ['Remodelada']
    },
    {
        id: 'sale-2',
        title: 'Departamento Vista Mar',
        location: 'Concón, Valparaíso',
        price: 185000000,
        currency: 'CLP',
        bedrooms: 3,
        bathrooms: 2,
        squareMeters: 95,
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop',
        tags: ['Turístico']
    },
    {
        id: 'sale-1',
        title: 'Edificio Lagos',
        location: 'Temuco, Araucanía',
        price: 185000000, // Precio estimado venta
        currency: 'CLP',
        bedrooms: 2,
        bathrooms: 2,
        squareMeters: 75,
        imageUrl: '/edificio-lagos.jpg', // Imagen Local
        yield: 5.2,
        tags: ['Oportunidad', '2% Comisión']
    }
]

const RENT_DECK: Property[] = [
    {
        id: 'rent-2',
        title: 'Oficina Moderna Providencia',
        location: 'Providencia, Santiago',
        price: 25, // UF
        currency: 'UF',
        bedrooms: 4,
        bathrooms: 3,
        squareMeters: 140,
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop',
        tags: ['Comercial', 'Arriendo']
    },
    {
        id: 'rent-1',
        title: 'Edificio Jardín de Reyes',
        location: 'Centro, Temuco',
        price: 450000,
        currency: 'CLP',
        bedrooms: 3,
        bathrooms: 2,
        squareMeters: 85, // Estimado
        imageUrl: '/edificio-jardin-reyes.jpg', // Imagen Local
        tags: ['Arriendo', 'Comisión 50%']
    }
]

export function PropertySwiper() {
    const [operationType, setOperationType] = useState<'SALE' | 'RENT'>('SALE')
    const [cards, setCards] = useState<Property[]>(SALE_DECK)

    // Efecto para cambiar el deck cuando cambia el tipo de operación
    React.useEffect(() => {
        setCards(operationType === 'SALE' ? SALE_DECK : RENT_DECK)
    }, [operationType])

    const removeCard = (id: string, direction: 'left' | 'right') => {
        setCards((prev) => prev.filter((card) => card.id !== id))
        console.log(`Card ${id} swiped ${direction}`)
    }

    const resetDeck = () => {
        setCards(operationType === 'SALE' ? SALE_DECK : RENT_DECK)
    }

    return (
        <div className="flex flex-col h-full w-full relative">
            {/* Header / Filtros */}
            <div className="absolute top-4 left-0 right-0 z-50 px-4 flex justify-between items-center w-full max-w-md mx-auto pointer-events-none">
                {/* Espacio vacío para balancear */}
                <div className="w-10"></div>

                {/* Operation Toggle */}
                <div className="flex bg-white/90 backdrop-blur-md rounded-full p-1 shadow-lg pointer-events-auto border border-gray-100">
                    <button
                        onClick={() => setOperationType('SALE')}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${operationType === 'SALE'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Venta
                    </button>
                    <button
                        onClick={() => setOperationType('RENT')}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${operationType === 'RENT'
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Arriendo
                    </button>
                </div>

                {/* Filter Button */}
                <div className="pointer-events-auto">
                    <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Deck Container */}
            <div className="flex-1 flex flex-col items-center justify-center relative px-4 overflow-hidden pt-20 pb-4">
                <div className="relative w-full max-w-md h-[65vh] md:h-[600px]">
                    <AnimatePresence>
                        {cards.map((card, index) => (
                            <Card
                                key={card.id}
                                property={card}
                                active={index === cards.length - 1}
                                removeCard={removeCard}
                            />
                        ))}
                    </AnimatePresence>

                    {cards.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-3xl border border-gray-100">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${operationType === 'SALE' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                                }`}>
                                <Check className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">¡Todo al día en {operationType === 'SALE' ? 'Ventas' : 'Arriendos'}!</h3>
                            <p className="text-gray-500">
                                No hay más propiedades disponibles en esta categoría.
                            </p>
                            <button
                                onClick={resetDeck}
                                className="mt-6 px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50"
                            >
                                Volver a ver
                            </button>
                        </div>
                    )}
                </div>

                {/* Actions Bar (Bottom) */}
                {cards.length > 0 && (
                    <div className="mt-6 flex gap-8 items-center justify-center w-full max-w-xs">
                        <button
                            onClick={() => removeCard(cards[cards.length - 1].id, 'left')}
                            className="w-14 h-14 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 shadow-lg flex items-center justify-center transition-all active:scale-110"
                        >
                            <X className="w-7 h-7" strokeWidth={2.5} />
                        </button>

                        <button
                            onClick={() => removeCard(cards[cards.length - 1].id, 'right')}
                            className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-500 to-blue-600 border-none text-white shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all active:scale-110"
                        >
                            <Check className="w-7 h-7" strokeWidth={3} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

interface CardProps {
    property: Property
    active: boolean
    removeCard: (id: string, direction: 'left' | 'right') => void
}

function Card({ property, active, removeCard }: CardProps) {
    const x = useMotionValue(0)
    const rotate = useTransform(x, [-200, 200], [-10, 10])
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0])

    const likeOpacity = useTransform(x, [50, 150], [0, 1])
    const nopeOpacity = useTransform(x, [-150, -50], [1, 0])

    const borderColor = useTransform(
        x,
        [-200, 0, 200],
        ['rgba(239, 68, 68, 0.5)', 'rgba(229, 231, 235, 1)', 'rgba(59, 130, 246, 0.5)']
    )

    const handleDragEnd = (_: any, info: any) => {
        if (info.offset.x > 100) {
            removeCard(property.id, 'right')
        } else if (info.offset.x < -100) {
            removeCard(property.id, 'left')
        }
    }

    if (!active) return (
        <div className="absolute top-0 left-0 w-full h-full bg-white rounded-3xl shadow-xl border border-gray-100 p-0 transform scale-95 opacity-50 -z-10 translate-y-4">
        </div>
    )

    const formatPrice = (price: number, currency: string) => {
        if (currency === 'UF') {
            return `UF ${price.toLocaleString('es-CL')}`
        }
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0,
        }).format(price)
    }

    const formattedPrice = formatPrice(property.price, property.currency)

    return (
        <motion.div
            style={{ x, rotate, opacity, borderColor, borderWidth: 1 }}
            drag="x"
            dragConstraints={{ left: -300, right: 300 }}
            onDragEnd={handleDragEnd}
            className="absolute top-0 left-0 w-full h-full bg-white rounded-3xl shadow-2xl cursor-grab active:cursor-grabbing overflow-hidden group select-none"
            whileTap={{ scale: 1.02 }}
        >
            {/* Etiquetas Flotantes */}
            <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 z-20 transform -rotate-12 pointer-events-none">
                <div className="border-4 border-blue-500 text-blue-500 font-bold text-3xl px-4 py-1 rounded-lg uppercase tracking-wider bg-white/20 backdrop-blur-sm">
                    Canjear
                </div>
            </motion.div>
            <motion.div style={{ opacity: nopeOpacity }} className="absolute top-8 right-8 z-20 transform rotate-12 pointer-events-none">
                <div className="border-4 border-red-500 text-red-500 font-bold text-3xl px-4 py-1 rounded-lg uppercase tracking-wider bg-white/20 backdrop-blur-sm">
                    Pasar
                </div>
            </motion.div>

            {/* Imagen Principal */}
            <div className="relative h-[65%] w-full bg-gray-200">
                <Image
                    src={property.imageUrl}
                    alt={property.title}
                    fill
                    className="object-cover pointer-events-none"
                    priority
                />

                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

                <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                    {/* ARCHER HOOK: Distressed Asset Badge */}
                    {property.id === 'sale-1' && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 border border-white/20"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z" /><path d="M11 3 8 9l4 13 4-13-3-6" /></svg>
                            Oportunidad Archer
                        </motion.div>
                    )}

                    {property.yield && (
                        <div className="bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {property.yield}% Rentabilidad
                        </div>
                    )}
                    {property.tags?.map(tag => (
                        <div key={tag} className="bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                            {tag}
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-3xl font-bold drop-shadow-md">{formattedPrice}</p>
                    {/* Archer Hook: Price Insight */}
                    {property.id === 'sale-1' && (
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded text-white backdrop-blur-sm mt-1 inline-block">
                            📉 12% bajo mercado
                        </span>
                    )}
                </div>
            </div>

            {/* Detalles */}
            <div className="h-[35%] p-6 flex flex-col justify-between bg-white relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
                    <div className="h-full w-1/3 bg-blue-500 rounded-r-full" />
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-1 line-clamp-2">
                        {property.title}
                    </h2>
                    <div className="flex items-center text-gray-500 mb-4">
                        <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                        <span className="text-sm font-medium">{property.location}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-2 border-t border-gray-100">
                        <Feature icon={BedDouble} value={`${property.bedrooms} Dorm`} />
                        <Feature icon={Maximize} value={`${property.squareMeters} m²`} />
                        <Feature icon={DollarSign} value="Comisión 2%" />
                    </div>
                </div>

                <div className="pt-2">
                    <p className="text-xs text-center text-gray-400 font-medium uppercase tracking-wide">
                        Desliza para decidir · Toca para ver más
                    </p>
                </div>
            </div>
        </motion.div>
    )
}

function Feature({ icon: Icon, value }: { icon: any, value: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-xl">
            <Icon className="w-5 h-5 text-gray-400 mb-1" strokeWidth={1.5} />
            <span className="text-xs font-semibold text-gray-700">{value}</span>
        </div>
    )
}
