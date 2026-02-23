import { useEffect, useState } from 'react';
import { fetchStyles } from '../lib/api';
import type { StyleDNA } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleNotch, Fingerprint, MagnifyingGlass } from '@phosphor-icons/react';

export default function StyleDNAView() {
    const [styles, setStyles] = useState<StyleDNA[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function load() {
            const data = await fetchStyles();
            setStyles(data);
            setLoading(false);
        }
        load();
    }, []);

    const filtered = styles.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.tags.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                        <Fingerprint className="text-primary" /> Librería Style DNA
                    </h2>
                    <p className="text-textMuted text-sm">Administra los núcleos artísticos (ADNs) que alimentan al motor de prompts.</p>
                </div>

                <div className="relative w-full md:w-72">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o tag..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-surface border border-borderSubtle py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:border-primary/50 text-sm text-white"
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center py-24">
                        <CircleNotch className="animate-spin text-4xl text-primary/50" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filtered.map((style, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                key={style.id}
                                className="glass-panel group rounded-xl overflow-hidden hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="h-48 relative overflow-hidden bg-surfaceHover">
                                    {style.image ? (
                                        <img src={style.image.startsWith('http') ? style.image : `https://estampakits.com/gen/${style.image}`} alt={style.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center"><Fingerprint className="text-5xl text-borderSubtle" /></div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80"></div>
                                    <h3 className="absolute bottom-4 left-4 font-bold text-lg text-white leading-tight pr-4">{style.name}</h3>
                                </div>

                                <div className="p-5 flex flex-col gap-4">
                                    <p className="text-sm text-textDim line-clamp-2 min-h-[40px]">{style.description || 'Sin descripción disponible.'}</p>

                                    <div className="flex flex-wrap gap-2">
                                        {style.tags.split(',').slice(0, 3).map(t => t.trim()).filter(Boolean).map((t, idx) => (
                                            <span key={idx} className="text-[10px] px-2 py-1 rounded bg-surface border border-borderSubtle text-textMuted uppercase tracking-wider">{t}</span>
                                        ))}
                                    </div>

                                    <div className="mt-2 text-[10px] font-mono text-primary/70 bg-surface/50 p-2 rounded truncate border border-primary/10">
                                        <span className="font-bold text-primary">DNA:</span> {style.style_dna}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {filtered.length === 0 && (
                            <div className="col-span-full py-12 text-center text-textMuted">No se encontraron estilos para "{search}".</div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
