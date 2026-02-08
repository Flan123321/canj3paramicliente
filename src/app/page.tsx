import Link from 'next/link'
import { CheckCircle2, ShieldCheck, Map, Users, ArrowRight } from 'lucide-react'

// ============================================================
// 👋 WELCOME / ONBOARDING SCREEN
// ============================================================

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* 1. Hero / Value Prop */}
      <main className="flex-1 flex flex-col justify-center px-6 py-12 text-center max-w-md mx-auto w-full">

        <div className="mb-8 relative">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-blue-200 rotation-3">
            <span className="text-4xl font-bold text-white">C</span>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white">
            Validados
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
          La red exclusiva para <span className="text-blue-600">Corredores Pro</span>
        </h1>

        <p className="text-slate-500 text-lg mb-10 leading-relaxed">
          Conecta, comparte y cierra canjes de forma rápida y segura en la comunidad más confiable de Chile.
        </p>

        {/* Value Props List */}
        <div className="space-y-6 mb-12 text-left">
          <ValueProp
            icon={ShieldCheck}
            title="Corredores 100% Validados"
            desc="Solo profesionales verificados con rut y registro."
          />
          <ValueProp
            icon={Map}
            title="Mapa Interactivo de Canjes"
            desc="Encuentra oportunidades geo-referenciadas en tiempo real."
          />
          <ValueProp
            icon={Users}
            title="Comunidad Activa"
            desc="Más de 1,200 corredores buscando cerrar negocios hoy."
          />
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/auth/signup" className="block w-full">
            <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              Crear Cuenta Gratis
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>

          <Link href="/auth/login" className="block w-full">
            <button className="w-full py-4 bg-white text-slate-600 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-[0.98] transition-all">
              Ya tengo cuenta
            </button>
          </Link>
        </div>

        <p className="mt-8 text-xs text-slate-400">
          Al registrarte aceptas nuestros Términos y Condiciones de uso exclusivo para corredores.
        </p>
      </main>
    </div>
  )
}

function ValueProp({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0 mt-1">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <h3 className="font-bold text-slate-900 text-base">{title}</h3>
        <p className="text-slate-500 text-sm leading-snug">{desc}</p>
      </div>
    </div>
  )
}
