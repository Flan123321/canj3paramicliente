'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { getUser } from '@/app/auth/actions'

// ============================================================
// 👤 USER ACTIONS - Profile Management
// ============================================================

export async function updateProfile(formData: FormData) {
    const user = await getUser()
    if (!user) {
        throw new Error('Unauthorized')
    }

    const name = formData.get('name') as string
    const phone = formData.get('phone') as string

    // Avatar Mock Logic (Si el usuario quiere cambiar foto, usamos un avatar de UI Faces por ahora)
    // En producción iría a Supabase Storage
    const shouldUpdateAvatar = formData.get('updateAvatar') === 'true'
    const mockAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200`

    try {
        const dataToUpdate: any = {
            name,
            phone
        }

        if (shouldUpdateAvatar) {
            dataToUpdate.avatarUrl = mockAvatar
        }

        await prisma.user.update({
            where: { id: user.id },
            data: dataToUpdate
        })

        revalidatePath('/perfil')
        revalidatePath('/dashboard') // Actualizar avatar en header

        return { success: true }
    } catch (e) {
        console.error('Error updating profile:', e)
        return { error: 'Failed to update profile' }
    }
}
