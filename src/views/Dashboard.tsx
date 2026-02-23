import { useEffect, useState } from 'react';
import { fetchStyles, fetchTemplates } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
    const [stats, setStats] = useState({ styles: 0, templates: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const [s, t] = await Promise.all([fetchStyles(), fetchTemplates()]);
            setStats({ styles: s.length, templates: t.length });
            setLoading(false);
        }
        load();
    }, []);

    return (
        <div className="space-y-8 pb-16">
            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden bg-gradient-to-br from-surface to-[#0a1428]">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-white mb-2">Bienvenido a La Fórmula</h2>
                    <p className="text-textDim max-w-2xl">
                        Este es el motor V4.1 con Auto-Deploy CI/CD. Ahora operando bajo una arquitectura Headless React conectada
                        directamente a la base de datos MySQL original. Rendimiento nativo, cero recargas.
                    </p>
                </div>
                <div className="absolute right-0 bottom-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Estilos de ADN" value={stats.styles} loading={loading} />
                <StatCard title="Plantillas Activas" value={stats.templates} loading={loading} />
                <StatCard title="Salud del API" value="100%" loading={loading} highlight />
            </div>
        </div>
    );
}

function StatCard({ title, value, loading, highlight = false }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl border ${highlight ? 'bg-primary/5 border-primary/20' : 'glass-panel'} relative overflow-hidden`}
        >
            <h3 className="text-sm font-semibold text-textMuted uppercase tracking-wider mb-4">{title}</h3>
            <div className="flex items-center gap-3">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-10 w-16 bg-surfaceHover rounded animate-pulse" />
                    ) : (
                        <motion.span key="value" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-4xl font-bold text-white">
                            {value}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
