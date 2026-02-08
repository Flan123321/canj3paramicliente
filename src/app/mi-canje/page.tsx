'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Home, Building, DollarSign, ArrowRight, Search, PlusCircle, Trees, Layout } from 'lucide-react'
import { useRouter } from 'next/navigation'

// ============================================================
// 🔮 MI CANJE: VIRTUAL GUIDE (The Magic)
// ============================================================

type GuideStep = 'ACTION' | 'OPERATION' | 'TYPE' | 'BUDGET'
type ActionType = 'SEARCH' | 'PUBLISH'
type OperationType = 'SALE' | 'RENT'
type PropertyType = 'HOUSE' | 'APARTMENT' | 'LAND' | 'AGRICULTURAL' | 'PARCEL'

interface GuideState {
    step: GuideStep
    action: ActionType | null
    operation: OperationType | null
    propertyType: PropertyType | null
    budget: string
}

export default function MiCanjePage() {
    const router = useRouter()
    const [state, setState] = useState<GuideState>({
        step: 'ACTION',
        action: null,
        operation: null,
        propertyType: null,
        budget: ''
    })

    const handleSelect = (key: keyof GuideState, value: any, nextStep: GuideStep | 'FINISH') => {
        setState(prev => ({ ...prev, [key]: value, step: nextStep as GuideStep }))

        if (nextStep === 'FINISH') {
            handleFinish({ ...state, [key]: value })
        }
    }

    const handleFinish = (finalState: GuideState) => {
        // Redirigir según la acción seleccionada
        if (finalState.action === 'SEARCH') {
            // Ir al buscador con filtros aplicados (query params)
            console.log('Searching with:', finalState)
            router.push(`/buscar?type=${finalState.propertyType}&op=${finalState.operation}`)
        } else {
            // Ir al publicador con datos precargados
            console.log('Publishing with:', finalState)
            router.push(`/publicar?type=${finalState.propertyType}&op=${finalState.operation}`)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10 pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

            <header className="absolute top-6 left-6 flex items-center gap-2 z-10">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-md border border-white/10">
                    <span className="text-xl">✨</span>
                </div>
                <span className="font-bold tracking-tight">Mi Canje Virtual</span>
            </header>

            <main className="w-full max-w-2xl relative z-10">
                <AnimatePresence mode='wait'>
                    {/* STEP 1: ACTION */}
                    {state.step === 'ACTION' && (
                        <QuestionStep
                            key="ACTION"
                            question="¿Qué deseas hacer hoy?"
                            subtitle="Te ayudaremos a encontrar el match perfecto."
                        >
                            <OptionCard
                                icon={Search}
                                title="Buscar Oportunidades"
                                description="Encontrar propiedades para mis clientes"
                                onClick={() => handleSelect('action', 'SEARCH', 'OPERATION')}
                            />
                            <OptionCard
                                icon={PlusCircle}
                                title="Publicar Propiedad"
                                description="Subir una propiedad para canje"
                                onClick={() => handleSelect('action', 'PUBLISH', 'OPERATION')}
                            />
                        </QuestionStep>
                    )}

                    {/* STEP 2: OPERATION */}
                    {state.step === 'OPERATION' && (
                        <QuestionStep
                            key="OPERATION"
                            question="¿Qué tipo de operación?"
                            subtitle={state.action === 'SEARCH' ? '¿Qué buscan tus clientes?' : '¿Cómo quieres ofrecer la propiedad?'}
                            onBack={() => setState(prev => ({ ...prev, step: 'ACTION' }))}
                        >
                            <OptionCard
                                icon={DollarSign}
                                title="Venta"
                                description="Operaciones de compraventa"
                                onClick={() => handleSelect('operation', 'SALE', 'TYPE')}
                            />
                            <OptionCard
                                icon={Layout} // Placeholder icon for Rent
                                title="Arriendo"
                                description="Alquileres a largo plazo"
                                onClick={() => handleSelect('operation', 'RENT', 'TYPE')}
                            />
                        </QuestionStep>
                    )}

                    {/* STEP 3: PROPERTY TYPE */}
                    {state.step === 'TYPE' && (
                        <QuestionStep
                            key="TYPE"
                            question="¿Qué tipo de propiedad?"
                            subtitle="Selecciona la categoría principal."
                            onBack={() => setState(prev => ({ ...prev, step: 'OPERATION' }))}
                        >
                            <div className="grid grid-cols-2 gap-4 w-full">
                                <OptionCardSmall icon={Home} label="Casa" onClick={() => handleSelect('propertyType', 'HOUSE', 'BUDGET')} />
                                <OptionCardSmall icon={Building} label="Departamento" onClick={() => handleSelect('propertyType', 'APARTMENT', 'BUDGET')} />
                                <OptionCardSmall icon={Trees} label="Parcela" onClick={() => handleSelect('propertyType', 'PARCEL', 'BUDGET')} />
                                <OptionCardSmall icon={Layout} label="Terreno" onClick={() => handleSelect('propertyType', 'LAND', 'BUDGET')} />
                                <OptionCardSmall icon={Layout} label="Agrícola" onClick={() => handleSelect('propertyType', 'AGRICULTURAL', 'BUDGET')} />
                            </div>
                        </QuestionStep>
                    )}

                    {/* STEP 4: BUDGET (Input) */}
                    {state.step === 'BUDGET' && (
                        <BudgetStep
                            action={state.action}
                            // @ts-ignore
                            onBack={() => setState(prev => ({ ...prev, step: 'TYPE' }))}
                            onFinish={(val: string) => handleSelect('budget', val, 'FINISH')}
                        />
                    )}

                </AnimatePresence>
            </main>
        </div>
    )
}

function QuestionStep({ question, subtitle, children, onBack }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center text-center w-full"
        >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                {question}
            </h1>
            <p className="text-lg text-blue-200/80 mb-12 max-w-md">
                {subtitle}
            </p>

            <div className="grid gap-4 w-full max-w-lg">
                {children}
            </div>

            {onBack && (
                <button
                    onClick={onBack}
                    className="mt-8 text-sm text-white/50 hover:text-white transition-colors"
                >
                    Volver atrás
                </button>
            )}
        </motion.div>
    )
}

function OptionCard({ icon: Icon, title, description, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="group flex items-center p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/50 rounded-2xl transition-all duration-300 w-full text-left"
        >
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-lg text-white group-hover:text-blue-200 transition-colors">{title}</h3>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </button>
    )
}

function OptionCardSmall({ icon: Icon, label, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center justify-center p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/50 rounded-2xl transition-all duration-300"
        >
            <Icon className="w-8 h-8 text-blue-400 mb-3" />
            <span className="font-medium text-white">{label}</span>
        </button>
    )
}

function BudgetStep({ action, onBack, onFinish }: any) {
    const [value, setValue] = useState('')

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center text-center w-full"
        >
            <h1 className="text-4xl font-bold mb-4">
                {action === 'SEARCH' ? '¿Cuál es el presupuesto máximo?' : '¿Cuál es el valor estimado?'}
            </h1>
            <p className="text-lg text-blue-200/80 mb-12">
                Ingresa un valor aproximado en Pesos (CLP)
            </p>

            <div className="w-full max-w-md relative mb-8">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Ej: 150000000"
                    className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-2xl font-bold text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                    autoFocus
                />
            </div>

            <button
                onClick={() => onFinish(value)}
                disabled={!value}
                className="w-full max-w-md py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
                {action === 'SEARCH' ? 'Buscar Propiedades' : 'Continuar a Publicar'}
                <ArrowRight className="w-5 h-5" />
            </button>

            <button
                onClick={onBack}
                className="mt-6 text-sm text-white/50 hover:text-white transition-colors"
            >
                Volver atrás
            </button>
        </motion.div>
    )
}
