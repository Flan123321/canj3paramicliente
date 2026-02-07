'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// ============================================================
// 🔐 SERVER ACTIONS - Autenticación
// ============================================================

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name: name,
            },
        },
    })

    if (authError) {
        return { error: authError.message }
    }

    // 2. Crear registro en tabla users (si el signup fue exitoso)
    if (authData.user) {
        const { error: dbError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                email: email,
                name: name,
            })

        if (dbError) {
            console.error('Error creating user record:', dbError)
            // No retornamos error aquí porque el usuario ya fue creado en Auth
        }
    }

    revalidatePath('/', 'layout')

    // Redirigir a verificación de email o dashboard según configuración
    return {
        success: true,
        message: 'Revisa tu email para confirmar tu cuenta'
    }
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}

export async function getUser() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export async function getUserProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    return profile
}
