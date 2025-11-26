import React, { useState } from 'react';
import { UploadZone } from './components/UploadZone';
import { ResultsCard } from './components/ResultsCard';
import { Features } from './components/Features';
import { FloatingCard } from './components/FloatingCard';
import { BackgroundParticles } from './components/BackgroundParticles';
import { analyzeMedia } from './services/geminiService';
import { AnalysisResult, AnalysisStatus } from './types';
import { Activity, Github, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setStatus(AnalysisStatus.ANALYZING);
    setErrorMsg(null);
    try {
      const analysis = await analyzeMedia(file);
      setResult(analysis);
      setStatus(AnalysisStatus.COMPLETE);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "An unexpected error occurred.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(AnalysisStatus.IDLE);
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center overflow-hidden selection:bg-indigo-500/30">

      {/* Dynamic Background */}
      <BackgroundParticles status={status} verdict={result?.verdict} />

      {/* Navigation / Header */}
      <header className="z-10 w-full max-w-7xl mx-auto p-6 flex justify-between items-center">
        <FloatingCard delay={0} className="border-none bg-transparent shadow-none backdrop-blur-none">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-white">VerifiSight<span className="text-indigo-400">.ai</span></span>
          </div>
        </FloatingCard>

        <FloatingCard delay={0.1} className="hidden sm:block glass-panel rounded-full px-6 py-2">
          <nav className="flex gap-8 text-sm font-medium text-slate-300">
            <a href="#" className="hover:text-white transition-colors">Technology</a>
            <a href="#" className="hover:text-white transition-colors">API</a>
            <a href="#" className="hover:text-white transition-colors">About</a>
          </nav>
        </FloatingCard>
      </header>

      {/* Main Content Area */}
      <main className="z-10 flex-1 w-full flex flex-col items-center justify-center p-4 sm:p-8 space-y-12 sm:space-y-16 max-w-7xl mx-auto">

        <AnimatePresence mode="wait">
          {status === AnalysisStatus.IDLE && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8 max-w-4xl"
            >
              <h1 className="text-6xl sm:text-8xl font-bold text-white tracking-tight leading-[1.1] drop-shadow-2xl">
                Truth in <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">
                  Every Pixel.
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
                Advanced forensic analysis powered by multimodal AI to detect deepfakes and digital manipulation instantly.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Interaction Zone */}
        <div className="w-full flex flex-col items-center relative z-20">
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 w-full max-w-lg"
              >
                <div className="bg-red-500/10 text-red-200 px-6 py-4 rounded-xl border border-red-500/20 flex items-center justify-center text-center backdrop-blur-md">
                  {errorMsg}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full max-w-3xl">
            {status === AnalysisStatus.COMPLETE && result ? (
              <ResultsCard result={result} onReset={handleReset} />
            ) : (
              <UploadZone onFileSelect={handleFileSelect} status={status} />
            )}
          </div>
        </div>

        {/* Feature Blocks */}
        {(status === AnalysisStatus.IDLE || status === AnalysisStatus.ERROR) && (
          <Features />
        )}

      </main>

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
  );
};

export default App;
