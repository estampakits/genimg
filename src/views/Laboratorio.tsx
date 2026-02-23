import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagicWand, Image, CheckCircle, Warning, Copy, PaperPlaneRight, CircleNotch } from '@phosphor-icons/react';
import { fetchStyles, fetchTemplates, generatePrompts } from '../lib/api';
import type { StyleDNA, Template } from '../lib/api';

export default function Laboratorio() {
    const [styles, setStyles] = useState<StyleDNA[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loadingInitial, setLoadingInitial] = useState(true);

    const [topic, setTopic] = useState('');
    const [styleId, setStyleId] = useState('');
    const [templateId, setTemplateId] = useState('');
    const [variationMode, setVariationMode] = useState('suave');
    const [applyDieCut, setApplyDieCut] = useState(false);

    const [isGenerating, setIsGenerating] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        async function load() {
            const [s, t] = await Promise.all([fetchStyles(), fetchTemplates()]);
            setStyles(s);
            setTemplates(t);
            if (s.length > 0) setStyleId(s[0].id.toString());
            if (t.length > 0) setTemplateId(t[0].id.toString());
            setLoadingInitial(false);
        }
        load();
    }, []);

    // Update die-cut switch based on template default
    useEffect(() => {
        const t = templates.find(t => t.id.toString() === templateId);
        if (t) {
            setApplyDieCut(t.die_cut_default === 1);
        }
    }, [templateId, templates]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setResults(null);
        setIsGenerating(true);

        try {
            const data = await generatePrompts({ topic, style_id: styleId, template_id: templateId, variation_mode: variationMode, apply_die_cut: applyDieCut ? 1 : 0 });
            setResults(data);
        } catch (err: any) {
            setError(err.message || 'Error construyendo la fórmula.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        // Simple mock toast
        alert("¡Prompt Copiado a Midjourney!");
    };

    if (loadingInitial) return <div className="flex justify-center items-center h-64 text-textMuted"><CircleNotch className="animate-spin text-3xl" /></div>;

    return (
        <div className="flex flex-col lg:flex-row gap-8 pb-16">
            {/* Editor Panel */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full lg:w-[45%] glass-panel rounded-2xl p-6 lg:p-8 flex flex-col relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-surface rounded-lg border border-borderSubtle">
                        <MagicWand className="text-primary text-xl" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Mesa de Mezclas</h2>
                        <p className="text-xs text-textMuted uppercase tracking-wider font-semibold mt-1">Sintaxis V6.0 Abstracta</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-textDim flex flex-col">
                            <span>Tema Principal (Sujeto)</span>
                            <span className="text-xs text-textMuted font-normal mt-0.5">La idea core. Ej: "Una calavera de neon" o "Lali en concierto".</span>
                        </label>
                        <textarea
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full bg-surface border border-borderSubtle rounded-lg p-3 text-white placeholder-textMuted/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none h-24"
                            placeholder="Describí tu idea aquí..."
                            required
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-textDim">Style DNA Base</label>
                            <select
                                value={styleId}
                                onChange={e => setStyleId(e.target.value)}
                                className="w-full bg-surface border border-borderSubtle rounded-lg p-3 text-white focus:outline-none focus:border-primary/50 appearance-none transition-colors"
                                required
                            >
                                {styles.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-textDim">Plantilla de Producto</label>
                            <select
                                value={templateId}
                                onChange={e => setTemplateId(e.target.value)}
                                className="w-full bg-surface border border-borderSubtle rounded-lg p-3 text-white focus:outline-none focus:border-primary/50 appearance-none transition-colors"
                                required
                            >
                                {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface/50 p-4 rounded-xl border border-borderSubtle/50">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-textDim">Modo Variación</label>
                            <select value={variationMode} onChange={e => setVariationMode(e.target.value)} className="w-full bg-background border border-borderSubtle rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary/50 appearance-none">
                                <option value="suave">Suave (Fiel al AD)</option>
                                <option value="creativa">Creativa (Chaos & Weights)</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                            <label className="text-sm font-medium text-textDim cursor-pointer flex items-center gap-2 select-none">
                                <Image className="text-primary" />
                                <span>Aplicar Troquelado</span>
                            </label>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={applyDieCut} onChange={e => setApplyDieCut(e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-surface peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-textMuted peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border border-borderSubtle peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isGenerating}
                        className="w-full mt-4 bg-primary hover:bg-primaryHover text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {isGenerating ? (
                            <CircleNotch className="animate-spin text-xl" />
                        ) : (
                            <>
                                Construir Fórmula <PaperPlaneRight weight="fill" className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </motion.div>

            {/* Results Panel */}
            <div className="w-full lg:w-[55%] flex flex-col">
                <AnimatePresence mode="wait">
                    {!results && !isGenerating && !error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex flex-col items-center justify-center text-center p-12 border border-dashed border-borderSubtle rounded-2xl bg-surface/20"
                        >
                            <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6 shadow-xl border border-borderSubtle">
                                <Image className="text-4xl text-textMuted/50" weight="duotone" />
                            </div>
                            <h3 className="text-xl font-bold text-textDim mb-2">Plataforma Lista</h3>
                            <p className="text-sm text-textMuted max-w-sm">
                                Configura los parámetros a la izquierda. El motor se encargará de ensamblar la sintaxis técnica rigurosa de Midjourney v6.
                            </p>
                        </motion.div>
                    )}

                    {error && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-red-950/30 border border-red-900 rounded-2xl flex items-start gap-3">
                            <Warning className="text-red-500 text-xl mt-0.5 shrink-0" weight="fill" />
                            <div>
                                <h4 className="font-bold text-red-400 mb-1">Error al procesar</h4>
                                <p className="text-sm text-red-300/80">{error}</p>
                            </div>
                        </motion.div>
                    )}

                    {results && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="p-4 bg-emerald-950/20 border border-emerald-900/50 rounded-xl flex items-center gap-3">
                                <CheckCircle className="text-emerald-500 text-xl" weight="fill" />
                                <span className="text-emerald-400 font-medium text-sm">Fórmulas construidas con éxito. Copia y pega directamente en Midjourney.</span>
                            </div>

                            {results.negative_base && (
                                <div className="p-5 glass-panel rounded-xl border-red-900/20 bg-red-950/10">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2 flex items-center gap-2">
                                        <Warning /> Filtros Negativos Detectados
                                    </h4>
                                    <p className="font-mono text-xs text-red-300/80 leading-relaxed">{results.negative_base}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                {results.prompts.map((p: any, i: number) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        key={i}
                                        className="glass-panel p-5 rounded-xl border-l-4 border-l-primary hover:border-borderSubtle transition-all group"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-sm font-bold text-white uppercase tracking-wider">{p.type}</span>
                                            <button
                                                onClick={() => handleCopy(p.text)}
                                                className="flex items-center gap-2 text-xs font-semibold text-primary/80 hover:text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-md transition-colors"
                                            >
                                                <Copy weight="bold" /> Copiar Fórmula
                                            </button>
                                        </div>
                                        <p className="font-mono text-sm leading-relaxed text-emerald-400/90 break-words selection:bg-primary/30">
                                            {p.text}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
