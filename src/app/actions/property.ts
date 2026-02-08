'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { findMatchesForProperty, updateDistressedStatus } from '@/lib/core/matching'
// Asegúrate de tener una forma de obtener el usuario actual (ej: Supabase Auth)
import { createClient } from '@/lib/supabase/server'

// ============================================================
// 🚀 SERVER ACTION: UPLOAD PROPERTY
// ============================================================

export async function uploadProperty(formData: FormData) {
    const supabase = await createClient() // Await añadido
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    // Extraer datos del FormData (simplificado para demo)
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const currency = formData.get('currency') as string || 'CLP'
    const bedrooms = parseInt(formData.get('bedrooms') as string)
    const bathrooms = parseInt(formData.get('bathrooms') as string)
    const squareMeters = parseInt(formData.get('squareMeters') as string)
    const location = formData.get('location') as string
    const propertyType = formData.get('propertyType') as any || 'APARTMENT' // Default simple

    // 1. Guardar Propiedad en BD
    try {
        const property = await prisma.property.create({
            data: {
                title,
                description,
                price,
                currency,
                bedrooms,
                bathrooms,
                squareMeters,
                location,
                propertyType,
                ownerId: user.id,
                status: 'ACTIVE'
            }
        })

        console.log(`[ACTION] Property created: ${property.id}`)

        // 2. Ejecutar Lógica de Negocio (Async - No bloqueante idealmente)
        // En Vercel/Serverless esto debe esperarse o usar un Queue, aquí lo hacemos await rápido
        await updateDistressedStatus(property.id)
        await findMatchesForProperty(property.id)

        // 3. Revalidar cache y Redireccionar
        revalidatePath('/dashboard')
        revalidatePath('/buscar')

    } catch (error) {
        console.error('[ACTION] Error uploading property:', error)
        // No podemos retornar objeto si vamos a hacer redirect después, pero si falla antes sí.
        // Mejor lanzar error para que el cliente lo maneje
        throw new Error('Failed to upload property')
    }

    // Éxito -> Al dashboard
    redirect('/dashboard')
}

// ============================================================
// 📊 DASHBOARD ACTION: GET MY MATCHES
// ============================================================

export async function getMatchesForUser() {
    const supabase = await createClient() // Await añadido
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    // Buscar matches donde:
    // A) Soy dueño de la Propiedad (Alguien quiere mi casa)
    // B) Soy dueño del Requerimiento (Encontré una casa)

    // Caso A: Mis Propiedades tienen matches
    const propertyMatches = await prisma.match.findMany({
        where: {
            property: {
                ownerId: user.id
            }
        },
        include: {
            requirement: {
                include: { user: true } // Datos del interesado
            },
            property: true // Datos de mi propiedad
        },
        orderBy: { createdAt: 'desc' }
    })

    return propertyMatches
}
