import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Sparkle, Flask, Swatches, FlowArrow } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

import Dashboard from './views/Dashboard';
import StyleDNA from './views/StyleDNA';
import Laboratorio from './views/Laboratorio';

export default function App() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 glass-panel border-b-0 border-t-0 border-x-0 border-b-borderSubtle">
        <div className="px-6 h-16 flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-blue-800 rounded-lg text-white shadow-lg">
              <Sparkle weight="fill" className="text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-none">LA FÓRMULA</h1>
              <p className="text-[10px] text-primary uppercase font-medium tracking-widest mt-0.5">Prompt Engine V4.3</p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <NavLink to="/" className={({ isActive }) => `px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2 ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-textDim hover:text-white hover:bg-surfaceHover'}`}>
              <FlowArrow weight="duotone" /> Dashboard
            </NavLink>
            <NavLink to="/styles" className={({ isActive }) => `px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2 ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-textDim hover:text-white hover:bg-surfaceHover'}`}>
              <Swatches weight="duotone" /> Style DNA
            </NavLink>
            <NavLink to="/lab" className={({ isActive }) => `px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2 ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-textDim hover:text-white hover:bg-surfaceHover'}`}>
              <Flask weight="duotone" /> Laboratorio
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/styles" element={<StyleDNA />} />
              <Route path="/lab" element={<Laboratorio />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
