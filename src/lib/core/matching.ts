import { PrismaClient, Property, Requirement } from '@prisma/client'
import { calculateMatchScore, analyzeDistressedAsset } from './engine'

const prisma = new PrismaClient()

// ============================================================
// 🧠 MATCHING LOGIC - The Brain of the Operation
// ============================================================

/**
 * Busca requerimientos compatibles para una nueva propiedad y crea Matches.
 * Esta función debe llamarse DESPUÉS de guardar/actualizar una propiedad.
 */
export async function findMatchesForProperty(propertyId: string) {
    console.log(`[MATCHING] 🔍 Starting search for property: ${propertyId}`)

    // 1. Obtener la propiedad con todos sus detalles
    const property = await prisma.property.findUnique({
        where: { id: propertyId }
    })

    if (!property) {
        console.error(`[MATCHING] ❌ Property ${propertyId} not found`)
        return 0
    }

    // 2. Buscar Requerimientos Potenciales (Filtro grueso en BD)
    // Buscamos requerimientos que:
    // - Estén activos
    // - Tengan presupuesto maximo >= precio propiedad (o un margen de negociación)
    // - (Opcional) Coincidan en tipo de propiedad si se filtra

    // Nota: El filtro de ubicación lo hacemos en memoria por ahora (o PostGIS futuro)
    const potentialReqs = await prisma.requirement.findMany({
        where: {
            isActive: true,
            // Aceptamos requerimientos con presupuesto hasta un 10% MENOR al precio (Regateo)
            budgetMax: {
                gte: Number(property.price) * 0.9
            }
        }
    })

    console.log(`[MATCHING] Found ${potentialReqs.length} potential requirements (budget check).`)

    const matchesToCreate = []

    // 3. Filtrado Fino y Scoring (En memoria)
    for (const req of potentialReqs) {
        // Calcular Score usando el Engine (importado)
        // Nota: Asegúrate que calculateMatchScore maneje los tipos Property y Requirement
        const score = calculateMatchScore(property, req)

        // Si el score supera el umbral (ej: 40%), es un match válido
        // Umbral bajo para fomentar interacción
        if (score >= 40) {
            matchesToCreate.push({
                propertyId: property.id,
                requirementId: req.id,
                matchScore: score,
                status: 'PENDING', // Uso string literal que coincida con enum MatchStatus
                // Prisma se encarga de current timestamp
            })
        }
    }

    // 4. Guardar Matches en Batch
    if (matchesToCreate.length > 0) {
        // Mapeamos al formato que Prisma espera para createMany
        const data = matchesToCreate.map(m => ({
            propertyId: m.propertyId,
            requirementId: m.requirementId,
            matchScore: m.matchScore,
            status: 'PENDING' as const // Forzar enum
        }))

        const result = await prisma.match.createMany({
            data,
            skipDuplicates: true // Clave compuesta propertyId_requirementId evita duplicados
        })

        console.log(`[MATCHING] 🚀 Created ${result.count} new matches!`)

        // TODO: Aquí dispararíamos las notificaciones Realtime
        // await notifyUsers(matchesToCreate)

        return result.count
    }

    return 0
}

/**
 * Función auxiliar para actualizar el estado "Distressed" de una propiedad automáticamente
 */
export async function updateDistressedStatus(propertyId: string) {
    const property = await prisma.property.findUnique({ where: { id: propertyId } })
    if (!property) return

    const { isDistressed, estimatedDiscount } = analyzeDistressedAsset(property)

    if (isDistressed) {
        await prisma.property.update({
            where: { id: propertyId },
            data: {
                isDistressed: true,
                opportunityScore: estimatedDiscount, // Guardamos el % de descuento como score
                internalNotes: `Detected automatically. Est. Discount: ${estimatedDiscount}% below market.`
            }
        })
        console.log(`[ARCHER HOOK] 💎 Property ${propertyId} marked as DISTRESSED (${estimatedDiscount}% off)`)
    }
}
