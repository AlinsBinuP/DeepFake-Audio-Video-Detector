import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home } from './src/pages/Home.tsx';
import { FloatingCard } from './components/FloatingCard';
import { ShieldCheck, Github, Image as ImageIcon, FileText } from 'lucide-react';
import { ImageGenerator } from './src/pages/ImageGenerator.tsx';
import { ImageToEssay } from './src/pages/ImageToEssay.tsx';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="z-50 w-full max-w-7xl mx-auto p-6 flex justify-between items-center fixed top-0 left-0 right-0 pointer-events-none">
      <FloatingCard delay={0} className="pointer-events-auto border-none bg-transparent shadow-none backdrop-blur-none">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow duration-300">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-white">VerifiSight<span className="text-indigo-400">.ai</span></span>
        </Link>
      </FloatingCard>

      <FloatingCard delay={0.1} className="pointer-events-auto hidden sm:block glass-panel rounded-full px-2 py-2 bg-black/40 backdrop-blur-xl border border-white/10">
        <nav className="flex items-center">
          <Link
            to="/"
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive('/') ? 'bg-white/10 text-white shadow-lg shadow-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            Detector
          </Link>
          <Link
            to="/image-generator"
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive('/image-generator') ? 'bg-white/10 text-white shadow-lg shadow-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            Image Gen
          </Link>
          <Link
            to="/image-to-essay"
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive('/image-to-essay') ? 'bg-white/10 text-white shadow-lg shadow-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            Essay Writer
          </Link>
        </nav>
      </FloatingCard>
    </header>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen relative flex flex-col overflow-hidden selection:bg-indigo-500/30 bg-[#0a0a0a]">

        <Navigation />

        <div className="flex-1 pt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/image-generator" element={<ImageGenerator />} />
            <Route path="/image-to-essay" element={<ImageToEssay />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="z-10 w-full p-8 mt-12 text-center text-slate-500 text-sm border-t border-white/5 bg-black/20 backdrop-blur-xl">
          <div className="flex flex-col items-center gap-4">
            <p>&copy; {new Date().getFullYear()} VerifiSight AI. By Alins Binu.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            </div>
          </div>
        </footer>

      </div>
    </Router>
  );
};

export default App;
