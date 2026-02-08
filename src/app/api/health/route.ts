import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // Intentamos una consulta simple a la DB
        const userCount = await prisma.user.count()
        return NextResponse.json({
            status: 'ok',
            dbConnection: true,
            userCount,
            env: process.env.NODE_ENV
        })
    } catch (error: any) {
        console.error('Health Check Error:', error)
        return NextResponse.json({
            status: 'error',
            dbConnection: false,
            error: error.message
        }, { status: 500 })
    }
}
