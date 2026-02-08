'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Zap } from 'lucide-react'

// ============================================================
// ⚡ SPEED: REALTIME PUSH NOTIFICATIONS
// ============================================================

export function PushNotificationSimulator() {
    const [show, setShow] = useState(false)

    useEffect(() => {
        // Simular una notificación "Realtime" a los 5 segundos de entrar
        const timer = setTimeout(() => {
            setShow(true)
        }, 8000)

        const hideTimer = setTimeout(() => {
            setShow(false)
        }, 14000)

        return () => {
            clearTimeout(timer)
            clearTimeout(hideTimer)
        }
    }, [])

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-4 left-4 right-4 z-50 flex justify-center pointer-events-none"
                >
                    <div className="bg-gray-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm pointer-events-auto border border-gray-700">
                        <div className="bg-yellow-500/20 p-2 rounded-full">
                            <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">¡Nuevo Match Detectado!</h4>
                            <p className="text-xs text-gray-300">Cliente buscando en Temuco (Presupuesto $190M)</p>
                        </div>
                        <button
                            onClick={() => setShow(false)}
                            className="bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg ml-2 hover:bg-gray-200 transition-colors"
                        >
                            Ver
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
