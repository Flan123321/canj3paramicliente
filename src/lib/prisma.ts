import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

// ============================================================
// 🗄️ PRISMA CLIENT - Configuración para Prisma 7 + Supabase
// ============================================================

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
    pool: Pool | undefined
}

// Validar que DATABASE_URL esté configurada
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
}

// Crear pool de conexiones (reutilizado en development para hot-reload)
const pool = globalForPrisma.pool ?? new Pool({
    connectionString: databaseUrl,
})

// Crear adapter de PostgreSQL para Prisma 7
const adapter = new PrismaPg(pool)

// Crear cliente de Prisma con el adapter
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    adapter,
})

// En desarrollo, guardar referencias globales para evitar múltiples conexiones
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
    globalForPrisma.pool = pool
}

export default prisma
