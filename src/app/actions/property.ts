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

    // Extraer datos textuales
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const currency = formData.get('currency') as string || 'CLP'
    const bedrooms = parseInt(formData.get('bedrooms') as string)
    const bathrooms = parseInt(formData.get('bathrooms') as string)
    const squareMeters = parseInt(formData.get('squareMeters') as string)
    const location = formData.get('location') as string
    const propertyType = formData.get('propertyType') as any || 'APARTMENT'

    // 📸 MOCK IMAGE LOGIC
    // Como no tenemos S3 bucket configurado en este entorno, asignamos una imagen 
    // de alta calidad de Unsplash basada en el tipo de propiedad para que la DEMO se vea profesional.

    // Arrays de imágenes de stock premium
    const HOUSE_IMAGES = [
        "https://images.unsplash.com/photo-1600596542815-60c37c6525fa?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
    ]
    const APARTMENT_IMAGES = [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1035&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"
    ]

    const imagePool = propertyType === 'HOUSE' ? HOUSE_IMAGES : APARTMENT_IMAGES
    const randomImage = imagePool[Math.floor(Math.random() * imagePool.length)]

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
                status: 'ACTIVE',
                // Guardamos la imagen en la tabla relacionada PropertyImage
                images: {
                    create: [
                        { url: randomImage, isPrimary: true }
                    ]
                }
            }
        })

        console.log(`[ACTION] Property created: ${property.id}`)

        // 2. Ejecutar Lógica de Negocio (Matches, etc.)
        await updateDistressedStatus(property.id)
        await findMatchesForProperty(property.id)

        // 3. Revalidar
        revalidatePath('/dashboard')
        revalidatePath('/buscar')

    } catch (error) {
        console.error('[ACTION] Error uploading property:', error)
        throw new Error('Failed to upload property')
    }

    // Éxito -> Al dashboard
    redirect('/dashboard')
}

// ============================================================
// 📊 DASHBOARD ACTION: GET MY MATCHES
// ============================================================

export async function getMatchesForUser() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const propertyMatches = await prisma.match.findMany({
        where: {
            property: {
                ownerId: user.id
            }
        },
        include: {
            requirement: {
                include: { user: true }
            },
            property: {
                include: {
                    images: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return propertyMatches
}

// ============================================================
// 🗺️ MAP ACTION: GET ALL PROPERTIES
// ============================================================

export async function getAllProperties() {
    const properties = await prisma.property.findMany({
        where: {
            status: 'ACTIVE',
        },
        include: {
            images: true, // Incluimos imágenes para el mapa
            owner: {
                select: { name: true, isVerified: true, reputationScore: true }
            }
        },
        take: 50,
        orderBy: { createdAt: 'desc' }
    })

    return properties
}
