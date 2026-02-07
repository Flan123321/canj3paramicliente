// ============================================================
// 🏢 CANJEPARAMICLIENTE - Type Definitions
// ============================================================
// Tipos auxiliares para uso en la aplicación
// Los tipos principales se generan automáticamente desde Prisma
// ============================================================

import type {
    User,
    Property,
    Requirement,
    Match,
    PropertyType,
    PropertyStatus,
    MatchStatus,
    RequirementPriority
} from '@prisma/client'

// Re-export Prisma types
export type {
    User,
    Property,
    Requirement,
    Match,
    PropertyType,
    PropertyStatus,
    MatchStatus,
    RequirementPriority
}

// ============================================================
// Extended Types with Relations
// ============================================================

export type PropertyWithOwner = Property & {
    owner: User
}

export type PropertyWithImages = Property & {
    images: PropertyImage[]
}

export type PropertyFull = Property & {
    owner: User
    images: PropertyImage[]
    matches: Match[]
}

export type RequirementWithUser = Requirement & {
    user: User
}

export type RequirementWithMatches = Requirement & {
    matches: (Match & {
        property: Property
    })[]
}

export type MatchFull = Match & {
    property: PropertyWithOwner
    requirement: RequirementWithUser
}

// ============================================================
// API Response Types
// ============================================================

export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

export interface PaginatedResponse<T> {
    items: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

// ============================================================
// Form Input Types
// ============================================================

export interface CreatePropertyInput {
    title: string
    description?: string
    price: number
    currency?: string
    location: string
    address?: string
    propertyType: PropertyType
    squareMeters: number
    landSquareMeters?: number
    bedrooms?: number
    bathrooms?: number
    parkingSpots?: number
    yearBuilt?: number
}

export interface CreateRequirementInput {
    budgetMin?: number
    budgetMax: number
    currency?: string
    zoneInterest: string[]
    propertyTypes: PropertyType[]
    minSquareMeters?: number
    maxSquareMeters?: number
    minBedrooms?: number
    minBathrooms?: number
    acceptsExchange?: boolean
    exchangeNotes?: string
    priority?: RequirementPriority
}

// ============================================================
// Search & Filter Types
// ============================================================

export interface PropertyFilters {
    location?: string
    propertyType?: PropertyType
    minPrice?: number
    maxPrice?: number
    minSquareMeters?: number
    maxSquareMeters?: number
    minBedrooms?: number
    isAvailable?: boolean
}

export interface RequirementFilters {
    minBudget?: number
    maxBudget?: number
    zoneInterest?: string[]
    propertyTypes?: PropertyType[]
    isActive?: boolean
    priority?: RequirementPriority
}

// ============================================================
// Admin Types (Shadow Fields)
// ============================================================

export interface AdminPropertyView extends Property {
    // Campos visibles solo para administradores
    isDistressed: boolean
    archerFlag: boolean
    opportunityScore: number | null
    internalNotes: string | null
}

export interface OpportunityAnalysis {
    propertyId: string
    archerFlag: boolean
    opportunityScore: number
    isDistressed: boolean
    analysisDate: Date
    notes: string
}

// ============================================================
// PropertyImage type (since it's not re-exported from Prisma)
// ============================================================

export interface PropertyImage {
    id: string
    url: string
    altText: string | null
    order: number
    isPrimary: boolean
    createdAt: Date
    propertyId: string
}
