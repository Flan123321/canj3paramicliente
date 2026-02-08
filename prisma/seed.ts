import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Start seeding...')

    // 1. Limpiar BD (Opcional, cuidado en prod)
    // await prisma.match.deleteMany()
    // await prisma.requirement.deleteMany()
    // await prisma.property.deleteMany()
    // await prisma.user.deleteMany()

    // 2. Crear Usuarios "Compradores"
    const buyer1 = await prisma.user.upsert({
        where: { email: 'comprador1@example.com' },
        update: {},
        create: {
            email: 'comprador1@example.com',
            name: 'Juan Pérez (Inversionista)',
            isVerified: true,
            reputationScore: 85,
        },
    })

    const buyer2 = await prisma.user.upsert({
        where: { email: 'comprador2@example.com' },
        update: {},
        create: {
            email: 'comprador2@example.com',
            name: 'María González (Familia)',
            isVerified: true,
            reputationScore: 92,
        },
    })

    const buyer3 = await prisma.user.upsert({
        where: { email: 'comprador3@example.com' },
        update: {},
        create: {
            email: 'comprador3@example.com',
            name: 'Carlos "El Tiburón" (Flipper)',
            isVerified: true,
            reputationScore: 70,
        },
    })

    console.log('✅ Users created/upserted')

    // 3. Crear Requerimientos (Lo que buscan)

    // Requerimiento 1: Busca Casa en Las Condes/Vitacura hasta 500M
    await prisma.requirement.create({
        data: {
            userId: buyer1.id,
            budgetMax: 500000000,
            currency: 'CLP',
            zoneInterest: ['Las Condes', 'Vitacura', 'Lo Barnechea'],
            propertyTypes: ['HOUSE'],
            minBedrooms: 3,
            minBathrooms: 2,
            priority: 'HIGH',
            isActive: true,
        }
    })

    // Requerimiento 2: Busca Depto en Santiago Centro/Providencia para Inversión (hasta 150M)
    await prisma.requirement.create({
        data: {
            userId: buyer1.id, // Mismo inversor busca otra cosa
            budgetMax: 150000000,
            currency: 'CLP',
            zoneInterest: ['Santiago', 'Providencia', 'Ñuñoa'],
            propertyTypes: ['APARTMENT'],
            minBedrooms: 1,
            minSquareMeters: 30,
            priority: 'MEDIUM',
            isActive: true,
        }
    })

    // Requerimiento 3: Familia busca casa grande en La Reina (hasta 400M)
    await prisma.requirement.create({
        data: {
            userId: buyer2.id,
            budgetMax: 400000000,
            currency: 'CLP',
            zoneInterest: ['La Reina', 'Peñalolén'],
            propertyTypes: ['HOUSE'],
            minBedrooms: 4,
            minBathrooms: 3,
            priority: 'URGENT', // Urgente!
            isActive: true,
        }
    })

    // Requerimiento 4: "El Tiburón" busca oportunidades baratas en cualquier lado (hasta 80M)
    await prisma.requirement.create({
        data: {
            userId: buyer3.id,
            budgetMax: 80000000,
            currency: 'CLP',
            zoneInterest: ['Santiago', 'Estación Central', 'San Miguel', 'Temuco'],
            propertyTypes: ['APARTMENT', 'HOUSE'],
            priority: 'HIGH',
            isActive: true,
            exchangeNotes: 'Pago contado si es oportunidad.'
        }
    })

    console.log('✅ Requirements created')
    console.log('🌱 Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
