import { Property, Requirement } from '@prisma/client'

// =========================================================================
// 🎯 CORE: MATCHING ENGINE - Supply vs. Demand
// =========================================================================

/**
 * Normaliza las ubicaciones para comparación (quita acentos, minúsculas, etc.)
 */
const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

/**
 * Calcula el porcentaje de coincidencia entre Propiedad y Requerimiento.
 * 
 * Reglas de Match:
 * - Ubicación: Debe coincidir con alguna de las zonas de interés del requerimiento.
 * - Precio: Propiedad <= Presupuesto usuario (Tolerancia +10% negociable).
 * - Dormitorios/Baños: Mayor o Igual.
 */
export function calculateMatchScore(property: Property, req: Requirement): number {
    let score = 0
    // let totalWeight = 0; // Usado para debug

    // 1. Ubicación (Peso: 40%) - CRÍTICO
    // req.zoneInterest es un array de zonas (ej: ['Las Condes', 'Vitacura'])
    const zones = req.zoneInterest || []
    const propertyLocation = normalize(property.location)

    // Verificamos si la ubicación de la propiedad coincide con alguna zona de interés
    if (zones.length > 0) {
        if (zones.some(zone => propertyLocation.includes(normalize(zone)))) {
            score += 40
        } else {
            return 0 // Si busca en zona específica y no coincide, bye.
        }
    } else {
        // Si no especificó zonas, asumimos match global (score bajo)
        score += 10
    }
    // totalWeight += 40

    // 2. Precio (Peso: 30%)
    const propertyPrice = Number(property.price) || 0
    const reqBudget = Number(req.budgetMax) || 0

    if (propertyPrice <= reqBudget) {
        score += 30
    } else if (propertyPrice <= reqBudget * 1.1) {
        score += 15 // Match parcial (negociable)
    }
    // totalWeight += 30

    // 3. Características (Peso: 20%)
    // Manejar nulos con (?? 0)
    // Usamos coalescing operator para propiedades que pueden ser null
    if ((property.bedrooms ?? 0) >= (req.minBedrooms ?? 0)) score += 10
    if ((property.bathrooms ?? 0) >= (req.minBathrooms ?? 0)) score += 10
    // totalWeight += 20

    // 4. Score final (Max 90 con reglas actuales, +10 bonus si es distressed)
    // Podríamos normalizar a 100

    return score
}

// =========================================================================
// 🔒 SECURITY: FUZZY LOCATION - "Ubicación Difusa"
// =========================================================================

/**
 * Retorna una ubicación "difusa" para seguridad antes del match.
 * Oculta la dirección exacta.
 */
export function getFuzzyLocation(property: Property) {
    // Si la ubicación es "Av. Apoquindo 4500, Las Condes"
    // Retorna "Sector Metro Escuela Militar, Las Condes" (Simulado)

    const parts = property.location.split(',')
    const comuna = parts[parts.length - 1]?.trim() || property.location

    return {
        display: `Sector Exclusivo en ${comuna}`,
        lat: property.latitude ? Number(property.latitude) + (Math.random() - 0.5) * 0.01 : null, // Jitter
        // Nota: property.lat no existe en schema, es property.latitude (Decimal)
        lng: property.longitude ? Number(property.longitude) + (Math.random() - 0.5) * 0.01 : null, // Jitter
        isExact: false
    }
}

// =========================================================================
// 🏹 ARCHER HOOK: DISTRESSED ASSET MONITOR
// =========================================================================

/**
 * Analiza si una propiedad es una oportunidad "Distressed" basada en precio de mercado.
 * Retorna un flag y el % de descuento estimado.
 */
export function analyzeDistressedAsset(property: Property) {
    // Simulador de Precio Mercado por m2 (en UF)
    const MARKET_VALUES: Record<string, number> = {
        'las condes': 95,
        'vitacura': 110,
        'providencia': 90,
        'lo barnechea': 100,
        'temuco': 45,
        'concon': 55,
        'santiago': 60
    }

    const comuna = normalize(property.location).split(',').pop()?.trim() || ''
    // Buscar precio mercado aproximado
    let marketValueSqM = 50 // Default

    for (const [key, val] of Object.entries(MARKET_VALUES)) {
        if (comuna.includes(key)) {
            marketValueSqM = val
            break
        }
    }

    // Calcular precio por m2 de la propiedad
    // Asumimos que precio está en CLP, convertimos a UF aprox (38.000)
    const priceCLP = Number(property.price)
    const priceUF = property.currency === 'UF' ? priceCLP : priceCLP / 38000
    const sqMeters = property.squareMeters || 1

    const propertyValueSqM = priceUF / sqMeters

    // Si el valor está 15% por debajo del mercado -> Distressed
    const discount = ((marketValueSqM - propertyValueSqM) / marketValueSqM) * 100
    const isDistressed = discount > 15

    return {
        isDistressed,
        estimatedDiscount: Math.round(discount),
        marketValue: marketValueSqM * sqMeters
    }
}
