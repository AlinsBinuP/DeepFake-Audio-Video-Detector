import React, { useState } from 'react';
import { UploadZone } from './components/UploadZone';
import { ResultsCard } from './components/ResultsCard';
import { Features } from './components/Features';
import { FloatingCard } from './components/FloatingCard';
import { BackgroundParticles } from './components/BackgroundParticles';
import { analyzeMedia } from './services/geminiService';
import { AnalysisResult, AnalysisStatus } from './types';
import { Activity, Github } from 'lucide-react';

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
    <div className="min-h-screen relative flex flex-col items-center overflow-hidden bg-[#f8fafc]">
      
      {/* Dynamic Background */}
      <BackgroundParticles status={status} verdict={result?.verdict} />

      {/* Navigation / Header */}
      <header className="z-10 w-full max-w-6xl mx-auto p-6 flex justify-between items-center">
        <FloatingCard delay={-2} className="flex items-center gap-2 text-indigo-900">
           <div className="p-2 bg-indigo-900 rounded-lg text-white">
             <Activity className="w-5 h-5" />
           </div>
           <span className="font-bold text-xl tracking-tight">VerifiSight AI</span>
        </FloatingCard>
        
        <FloatingCard delay={-1} className="hidden sm:block">
            <nav className="flex gap-6 text-sm font-medium text-gray-500">
                <a href="#" className="hover:text-indigo-600 transition-colors">How it works</a>
                <a href="#" className="hover:text-indigo-600 transition-colors">API</a>
                <a href="#" className="hover:text-indigo-600 transition-colors">About</a>
            </nav>
        </FloatingCard>
      </header>

      {/* Main Content Area */}
      <main className="z-10 flex-1 w-full flex flex-col items-center justify-center p-4 sm:p-8 space-y-12 sm:space-y-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl">
          <FloatingCard delay={0}>
             <h1 className="text-5xl sm:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                Verify Sight. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  Restore Trust.
                </span>
             </h1>
          </FloatingCard>
          
          <FloatingCard delay={1.5} className="max-w-xl mx-auto">
             <p className="text-lg sm:text-xl text-slate-500 font-light">
               Instantly analyze media authenticity using state-of-the-art deep learning models to detect manipulation.
             </p>
          </FloatingCard>
        </div>

        {/* Dynamic Interaction Zone */}
        <div className="w-full flex flex-col items-center">
          {errorMsg && (
            <FloatingCard className="mb-6 w-full max-w-lg">
                <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-100 flex items-center justify-center text-center">
                    {errorMsg}
                </div>
            </FloatingCard>
          )}

          {status === AnalysisStatus.COMPLETE && result ? (
            <ResultsCard result={result} onReset={handleReset} />
          ) : (
            <UploadZone onFileSelect={handleFileSelect} status={status} />
          )}
        </div>

        {/* Feature Blocks - Only show on idle or error to keep focus on results when complete */}
        {(status === AnalysisStatus.IDLE || status === AnalysisStatus.ERROR) && (
             <Features />
        )}

      </main>

      {/* Footer */}
      <footer className="z-10 w-full p-6 mt-12 text-center text-gray-400 text-sm">
        <FloatingCard delay={3}>
           <div className="flex flex-col items-center gap-2">
             <p>&copy; {new Date().getFullYear()} VerifiSight AI. All rights reserved.</p>
             <div className="flex gap-4">
               <a href="#" className="hover:text-gray-600"><Github className="w-4 h-4" /></a>
             </div>
           </div>
        </FloatingCard>
      </footer>

    </div>
  );
};

export default App;
