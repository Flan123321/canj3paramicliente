import { redirect } from 'next/navigation'
import { getUser, getUserProfile } from '../auth/actions'
import { updateProfile } from '../actions/user'
import Link from 'next/link'
import { ArrowLeft, User, Mail, Phone, Save, Camera } from 'lucide-react'

// ============================================================
// 👤 USER PROFILE - Edit & View
// ============================================================

export default async function ProfilePage() {
    const user = await getUser()
    if (!user) redirect('/auth/login')

    const profile = await getUserProfile()

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-8 px-4 font-sans">

            {/* Header */}
            <div className="w-full max-w-md flex items-center mb-8 relative">
                <Link href="/dashboard" className="absolute left-0 p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="w-full text-center text-xl font-bold text-slate-900">Mi Perfil</h1>
            </div>

            {/* Profile Card */}
            <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-gray-100">

                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative group cursor-pointer">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-50 shadow-inner">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                                    <User className="w-10 h-10" />
                                </div>
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                            <Camera className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <form
                    action={async (formData) => {
                        'use server'
                        await updateProfile(formData)
                    }}
                    className="space-y-5"
                >

                    {/* Name */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Nombre Completo
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                name="name"
                                type="text"
                                defaultValue={profile?.name || ''}
                                placeholder="Tu nombre"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 font-medium focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Email (Readonly) */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-slate-500 font-medium cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Teléfono
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                name="phone"
                                type="tel"
                                defaultValue={profile?.phone || ''}
                                placeholder="+56 9 1234 5678"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 font-medium focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Checkbox Hidden for Avatar Update Demo */}
                    <div className="flex items-center gap-2 pt-2">
                        <input type="checkbox" name="updateAvatar" value="true" id="updateAvatar" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                        <label htmlFor="updateAvatar" className="text-sm text-slate-500">
                            Actualizar foto de perfil (Generar nueva)
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        <Save className="w-5 h-5" />
                        Guardar Cambios
                    </button>

                </form>

            </div>

            {/* Verification Badge */}
            {profile?.is_verified && (
                <div className="mt-6 flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-100">
                    <ShieldCheckIcon className="w-5 h-5" />
                    <span className="text-sm font-bold">Corredor Verificado</span>
                </div>
            )}
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
