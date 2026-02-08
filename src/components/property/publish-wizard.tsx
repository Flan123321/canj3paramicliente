'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Home, Building2, MapPin, Camera, DollarSign, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'

// ============================================================
// 🧙 PUBLISH WIZARD - Step-by-Step Form (Instagram-easy)
// ============================================================

type PropertyType = 'HOUSE' | 'APARTMENT' | null
type WizardStep = 1 | 2 | 3 | 4

interface WizardData {
    propertyType: PropertyType
    location: string
    comuna: string
    price: string
    bedrooms: string
    bathrooms: string
    squareMeters: string
    photos: File[]
}

const TOTAL_STEPS = 4

import { uploadProperty } from '@/app/actions/property'

export function PublishWizard() {
    const [step, setStep] = useState<WizardStep>(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [data, setData] = useState<WizardData>({
        propertyType: null,
        location: '',
        comuna: '',
        price: '',
        bedrooms: '',
        bathrooms: '',
        squareMeters: '',
        photos: [],
    })

    const progress = (step / TOTAL_STEPS) * 100

    const nextStep = () => {
        if (step < TOTAL_STEPS) setStep((step + 1) as WizardStep)
    }

    const prevStep = () => {
        if (step > 1) setStep((step - 1) as WizardStep)
    }

    const canProceed = () => {
        switch (step) {
            case 1:
                return data.propertyType !== null
            case 2:
                // Debe haber una comuna o ubicacion
                return data.comuna.trim() !== '' || data.location.trim() !== ''
            case 3:
                return data.price.trim() !== ''
            default:
                return true
        }
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        const formData = new FormData()

        // Mapeo de datos para el Server Action
        formData.append('title', `${data.propertyType === 'HOUSE' ? 'Casa' : 'Departamento'} en ${data.comuna || 'Santiago'}`)
        formData.append('description', `Excelente oportunidad en ${data.location}.`)
        formData.append('price', data.price)
        formData.append('currency', 'CLP') // Asumimos CLP por ahora
        formData.append('bedrooms', data.bedrooms || '0')
        formData.append('bathrooms', data.bathrooms || '0')
        formData.append('squareMeters', data.squareMeters || '0')
        formData.append('location', `${data.location}, ${data.comuna}`)
        formData.append('propertyType', data.propertyType || 'APARTMENT')

        // TODO: Manejar fotos cuando tengamos storage

        try {
            await uploadProperty(formData)
            // La redirección ocurre en el server action
        } catch (error) {
            console.error(error)
            alert('Error al publicar propiedad. Intenta de nuevo.')
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
                <div className="flex items-center justify-between px-4 h-14">
                    <button
                        onClick={prevStep}
                        disabled={step === 1 || isSubmitting}
                        className="p-2 -ml-2 text-gray-500 hover:text-gray-900 disabled:opacity-30"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <span className="text-sm font-medium text-gray-500">
                        Paso {step} de {TOTAL_STEPS}
                    </span>

                    <button
                        onClick={() => {/* Close wizard */ }}
                        disabled={isSubmitting}
                        className="text-sm text-gray-500 hover:text-gray-900 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                </div>
                <Progress value={progress} className="h-1 rounded-none" />
            </header>

            {/* Content */}
            <main className="flex-1 px-6 py-8 max-w-lg mx-auto w-full">
                {step === 1 && (
                    <StepPropertyType
                        selected={data.propertyType}
                        onSelect={(type) => setData({ ...data, propertyType: type })}
                    />
                )}

                {step === 2 && (
                    <StepLocation
                        comuna={data.comuna}
                        location={data.location}
                        onChange={(field, value) => setData({ ...data, [field]: value })}
                    />
                )}

                {step === 3 && (
                    <StepDetails
                        data={data}
                        onChange={(field, value) => setData({ ...data, [field]: value })}
                    />
                )}

                {step === 4 && (
                    <StepConfirm data={data} />
                )}
            </main>

            {/* Footer */}
            <footer className="sticky bottom-0 p-4 bg-white border-t border-gray-100 safe-area-pb">
                <Button
                    onClick={step === TOTAL_STEPS ? handleSubmit : nextStep}
                    disabled={!canProceed() || isSubmitting}
                    className="w-full h-12 btn-primary text-base font-semibold disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Publicando...
                        </span>
                    ) : step === TOTAL_STEPS ? (
                        <span className="flex items-center gap-2">
                            <Check className="w-5 h-5" />
                            Publicar Propiedad
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            Continuar
                            <ChevronRight className="w-5 h-5" />
                        </span>
                    )}
                </Button>
            </footer>
        </div>
    )
}

// ============================================================
// STEP 1: ¿Qué tienes?
// ============================================================

function StepPropertyType({
    selected,
    onSelect,
}: {
    selected: PropertyType
    onSelect: (type: PropertyType) => void
}) {
    return (
        <div className="animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                ¿Qué tipo de propiedad tienes?
            </h1>
            <p className="text-gray-500 mb-8">
                Selecciona el tipo de propiedad que quieres publicar
            </p>

            <div className="grid grid-cols-2 gap-4">
                <PropertyTypeCard
                    icon={Home}
                    label="Casa"
                    selected={selected === 'HOUSE'}
                    onClick={() => onSelect('HOUSE')}
                />
                <PropertyTypeCard
                    icon={Building2}
                    label="Departamento"
                    selected={selected === 'APARTMENT'}
                    onClick={() => onSelect('APARTMENT')}
                />
            </div>
        </div>
    )
}

function PropertyTypeCard({
    icon: Icon,
    label,
    selected,
    onClick,
}: {
    icon: typeof Home
    label: string
    selected: boolean
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${selected
                ? 'border-blue-500 bg-blue-50 text-blue-600'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
        >
            <Icon className={`w-10 h-10 mb-3 ${selected ? 'text-blue-500' : ''}`} strokeWidth={1.5} />
            <span className="font-medium">{label}</span>
        </button>
    )
}

// ============================================================
// STEP 2: Ubicación
// ============================================================

function StepLocation({
    comuna,
    location,
    onChange,
}: {
    comuna: string
    location: string
    onChange: (field: string, value: string) => void
}) {
    const comunas = [
        'Las Condes', 'Providencia', 'Vitacura', 'Ñuñoa', 'Santiago Centro',
        'La Reina', 'Lo Barnechea', 'Peñalolén', 'Maipú', 'Puente Alto'
    ]

    return (
        <div className="animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                ¿Dónde está ubicada?
            </h1>
            <p className="text-gray-500 mb-8">
                Ingresa la ubicación de tu propiedad
            </p>

            <div className="space-y-6">
                {/* Quick Select Comunas */}
                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                        Comunas populares
                    </Label>
                    <div className="flex flex-wrap gap-2">
                        {comunas.map((c) => (
                            <button
                                key={c}
                                onClick={() => onChange('comuna', c)}
                                className={`px-3 py-1.5 rounded-full text-sm transition-all ${comuna === c
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Manual Input */}
                <div>
                    <Label htmlFor="location" className="text-sm font-medium text-gray-700 mb-2 block">
                        O escribe la dirección
                    </Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            id="location"
                            value={location}
                            onChange={(e) => onChange('location', e.target.value)}
                            placeholder="Ej: Av. Apoquindo 3000"
                            className="pl-10 h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// STEP 3: Precio y Detalles
// ============================================================

// ============================================================
// STEP 3: Precio y Detalles (Photos Updated)
// ============================================================

function StepDetails({
    data,
    onChange,
}: {
    data: WizardData
    onChange: (field: string, value: any) => void
}) {
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // Convert to array
            const newFiles = Array.from(e.target.files)
            onChange('photos', [...data.photos, ...newFiles])
        }
    }

    const removePhoto = (index: number) => {
        const newPhotos = [...data.photos]
        newPhotos.splice(index, 1)
        onChange('photos', newPhotos)
    }

    return (
        <div className="animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Detalles de la propiedad
            </h1>
            <p className="text-gray-500 mb-8">
                Ingresa el precio y características principales
            </p>

            <div className="space-y-6">
                {/* Price */}
                <div>
                    <Label htmlFor="price" className="text-sm font-medium text-gray-700 mb-2 block">
                        Precio (CLP)
                    </Label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            id="price"
                            type="number"
                            value={data.price}
                            onChange={(e) => onChange('price', e.target.value)}
                            placeholder="150000000"
                            className="pl-10 h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="bedrooms" className="text-sm font-medium text-gray-700 mb-2 block">
                            Dormitorios
                        </Label>
                        <Input
                            id="bedrooms"
                            type="number"
                            value={data.bedrooms}
                            onChange={(e) => onChange('bedrooms', e.target.value)}
                            placeholder="3"
                            className="h-12 text-center text-lg font-medium"
                        />
                    </div>
                    <div>
                        <Label htmlFor="bathrooms" className="text-sm font-medium text-gray-700 mb-2 block">
                            Baños
                        </Label>
                        <Input
                            id="bathrooms"
                            type="number"
                            value={data.bathrooms}
                            onChange={(e) => onChange('bathrooms', e.target.value)}
                            placeholder="2"
                            className="h-12 text-center text-lg font-medium"
                        />
                    </div>
                    <div>
                        <Label htmlFor="sqm" className="text-sm font-medium text-gray-700 mb-2 block">
                            m² útiles
                        </Label>
                        <Input
                            id="sqm"
                            type="number"
                            value={data.squareMeters}
                            onChange={(e) => onChange('squareMeters', e.target.value)}
                            placeholder="120"
                            className="h-12 text-center text-lg font-medium"
                        />
                    </div>
                </div>

                {/* Photo Upload Real */}
                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Fotos de la propiedad
                    </Label>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        {data.photos.map((file, i) => (
                            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => removePhoto(i)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors bg-gray-50"
                        >
                            <Camera className="w-6 h-6 mb-1" />
                            <span className="text-xs">Agregar</span>
                        </button>
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                    />

                    <p className="text-xs text-gray-400">
                        * En modo demo, las imágenes se guardarán localmente en el navegador.
                    </p>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// STEP 4: Confirmación
// ============================================================

function StepConfirm({ data }: { data: WizardData }) {
    const formattedPrice = data.price
        ? new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0,
        }).format(Number(data.price))
        : '-'

    return (
        <div className="animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-emerald-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                ¡Todo listo!
            </h1>
            <p className="text-gray-500 mb-8 text-center">
                Revisa los datos antes de publicar
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                <SummaryRow label="Tipo" value={data.propertyType === 'HOUSE' ? 'Casa' : 'Departamento'} />
                <SummaryRow label="Ubicación" value={data.comuna || data.location || '-'} />
                <SummaryRow label="Precio" value={formattedPrice} highlight />
                <SummaryRow label="Dormitorios" value={data.bedrooms || '-'} />
                <SummaryRow label="Baños" value={data.bathrooms || '-'} />
                <SummaryRow label="Superficie" value={data.squareMeters ? `${data.squareMeters} m²` : '-'} />
            </div>
        </div>
    )
}

function SummaryRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-gray-500">{label}</span>
            <span className={`font-medium ${highlight ? 'text-lg text-blue-600' : 'text-gray-900'}`}>
                {value}
            </span>
        </div>
    )
}
