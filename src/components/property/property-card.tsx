'use client'

import Image from 'next/image'
import { MapPin, BedDouble, Maximize, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

// ============================================================
// 🏠 PROPERTY CARD - Diseño Minimalista Airbnb-style
// ============================================================

interface PropertyCardProps {
    id: string
    imageUrl?: string
    title: string
    location: string
    price: number
    currency?: string
    bedrooms?: number
    squareMeters?: number
    estimatedYield?: number // Rentabilidad estimada %
    onRequestSwap?: (id: string) => void
}

export function PropertyCard({
    id,
    imageUrl,
    title,
    location,
    price,
    currency = 'CLP',
    bedrooms,
    squareMeters,
    estimatedYield,
    onRequestSwap,
}: PropertyCardProps) {
    const formattedPrice = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0,
    }).format(price)

    return (
        <article className="bg-white rounded-2xl overflow-hidden card-hover border border-gray-100 group">
            {/* Image Container */}
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 9.3V4h-3v2.6L12 3 2 12h3v8h5v-6h4v6h5v-8h3l-3-2.7zm-9 .7c0-1.1.9-2 2-2s2 .9 2 2h-4z" />
                        </svg>
                    </div>
                )}

                {/* Yield Badge */}
                {estimatedYield && estimatedYield > 0 && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        {estimatedYield}% anual
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Location */}
                <div className="flex items-center gap-1 text-gray-500 text-sm mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{location}</span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                    {title}
                </h3>

                {/* Features */}
                <div className="flex items-center gap-3 text-gray-500 text-sm mb-3">
                    {bedrooms && (
                        <div className="flex items-center gap-1">
                            <BedDouble className="w-4 h-4" />
                            <span>{bedrooms}</span>
                        </div>
                    )}
                    {squareMeters && (
                        <div className="flex items-center gap-1">
                            <Maximize className="w-4 h-4" />
                            <span>{squareMeters} m²</span>
                        </div>
                    )}
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                        <p className="text-lg font-bold text-gray-900">
                            {formattedPrice}
                        </p>
                    </div>
                    <Button
                        onClick={() => onRequestSwap?.(id)}
                        className="btn-primary px-4 py-2 text-sm"
                    >
                        Solicitar Canje
                    </Button>
                </div>
            </div>
        </article>
    )
}

// ============================================================
// 📋 PROPERTY CARD SKELETON - Loading State
// ============================================================

export function PropertyCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
            <div className="aspect-[4/3] bg-gray-200" />
            <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="h-6 bg-gray-200 rounded w-24" />
                    <div className="h-9 bg-gray-200 rounded w-28" />
                </div>
            </div>
        </div>
    )
}
