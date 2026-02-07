import Link from 'next/link'
import { AppShell } from '@/components/layout/app-shell'
import { PropertyCard } from '@/components/property/property-card'
import { ArrowRight, Zap, Shield, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

// ============================================================
// 🏠 HOME PAGE - Clean Utility Design
// ============================================================

export default function HomePage() {
  return (
    <AppShell>
      {/* Hero Section */}
      <section className="px-6 pt-12 pb-8 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Encuentra el canje perfecto para tu cliente
          </h1>
          <p className="text-gray-500 text-lg mb-8">
            Conecta con otros corredores y cierra operaciones de canje de forma rápida y segura.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/publicar">
              <Button className="btn-primary h-12 px-8 text-base font-semibold w-full sm:w-auto">
                Publicar Propiedad
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/buscar">
              <Button variant="outline" className="h-12 px-8 text-base font-medium border-gray-200 hover:bg-gray-50 w-full sm:w-auto">
                Explorar Propiedades
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="px-6 py-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">1,250+</p>
            <p className="text-xs text-gray-500 mt-1">Propiedades</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-600">340+</p>
            <p className="text-xs text-gray-500 mt-1">Canjes exitosos</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">89</p>
            <p className="text-xs text-gray-500 mt-1">Corredores</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            ¿Por qué usar CanjeParaMiCliente?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Zap}
              title="Rápido"
              description="Publica en segundos y recibe matches instantáneos."
            />
            <FeatureCard
              icon={Shield}
              title="Seguro"
              description="Solo corredores verificados. Transacciones protegidas."
            />
            <FeatureCard
              icon={Users}
              title="Red de Confianza"
              description="Conecta con la comunidad de corredores más activa de Chile."
            />
          </div>
        </div>
      </section>

      {/* Recent Properties */}
      <section className="px-6 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Propiedades recientes
            </h2>
            <Link href="/buscar" className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700">
              Ver todas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Properties */}
            <PropertyCard
              id="1"
              title="Departamento en Las Condes"
              location="Las Condes, Santiago"
              price={185000000}
              bedrooms={3}
              squareMeters={95}
              estimatedYield={5.2}
            />
            <PropertyCard
              id="2"
              title="Casa en Providencia"
              location="Providencia, Santiago"
              price={320000000}
              bedrooms={4}
              squareMeters={180}
            />
            <PropertyCard
              id="3"
              title="Depto con vista al mar"
              location="Viña del Mar, Valparaíso"
              price={145000000}
              bedrooms={2}
              squareMeters={72}
              estimatedYield={6.1}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-12 bg-white">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            ¿Tienes una propiedad para canjear?
          </h2>
          <p className="text-gray-500 mb-6">
            Publica gratis y encuentra el match perfecto para tu cliente.
          </p>
          <Link href="/publicar">
            <Button className="btn-mint h-12 px-8 text-base font-semibold">
              Publicar Ahora — Es Gratis
            </Button>
          </Link>
        </div>
      </section>
    </AppShell>
  )
}

// ============================================================
// FEATURE CARD
// ============================================================

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Zap
  title: string
  description: string
}) {
  return (
    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  )
}
