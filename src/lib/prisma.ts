import { PrismaClient } from '@prisma/client'

// ============================================================
// 🗄️ PRISMA CLIENT - Configuración Estándar (Más compatible con Vercel)
// ============================================================

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Validar que DATABASE_URL esté configurada (para debug, aunque Prisma fallará solo si falta)
const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL

if (!databaseUrl && process.env.NODE_ENV === 'production') {
    // Solo lanzamos error explícito en build/prod para evitar builds rotos mudos
    console.error('⚠️ DATABASE_URL (or DIRECT_URL) is missing explicitly in code check.')
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // Prisma 7 leerá automáticamente la config de prisma.config.ts
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
