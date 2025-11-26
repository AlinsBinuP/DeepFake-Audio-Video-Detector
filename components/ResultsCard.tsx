import React from 'react';
import { AnalysisResult } from '../types';
import { CheckCircle2, AlertTriangle, HelpCircle, ShieldCheck, RefreshCcw } from 'lucide-react';
import { FloatingCard } from './FloatingCard';

interface ResultsCardProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({ result, onReset }) => {
  const isFake = result.verdict === 'DEEPFAKE DETECTED';
  const isReal = result.verdict === 'REAL';
  
  // Dynamic styles based on verdict
  const themeColor = isReal ? 'emerald' : isFake ? 'rose' : 'amber';
  const Icon = isReal ? ShieldCheck : isFake ? AlertTriangle : HelpCircle;

  return (
    <FloatingCard className="w-full max-w-2xl" delay={2}>
      <div className="overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-100">
        {/* Header Banner */}
        <div className={`bg-${themeColor}-500 p-6 text-white flex items-center justify-between`}>
           <div className="flex items-center space-x-3">
             <Icon className="h-8 w-8" />
             <h2 className="text-2xl font-bold tracking-tight">Analysis Complete</h2>
           </div>
           <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
             VerifiSight AI
           </span>
        </div>

        <div className="p-8 space-y-8">
            {/* Verdict Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left space-y-2">
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Verdict</p>
                    <h3 className={`text-4xl md:text-5xl font-extrabold text-${themeColor}-600 leading-tight`}>
                        {result.verdict}
                    </h3>
                </div>
                
                {/* Circular Score Indicator */}
                <div className="relative h-32 w-32 flex-shrink-0">
                     <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                        {/* Background Circle */}
                        <circle cx="50" cy="50" r="40" className="text-gray-100" strokeWidth="8" stroke="currentColor" fill="transparent" />
                        {/* Progress Circle */}
                        <circle 
                            cx="50" cy="50" r="40" 
                            className={`text-${themeColor}-500 transition-all duration-1000 ease-out`}
                            strokeWidth="8" 
                            strokeDasharray={251.2} 
                            strokeDashoffset={251.2 - (251.2 * result.score) / 100}
                            strokeLinecap="round"
                            stroke="currentColor" 
                            fill="transparent" 
                        />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className={`text-2xl font-bold text-${themeColor}-600`}>{Math.round(result.score)}%</span>
                         <span className="text-[10px] uppercase font-bold text-gray-400">Real</span>
                     </div>
                </div>
            </div>

            <div className="h-px w-full bg-gray-100"></div>

            {/* Reasoning Section */}
            <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">AI Reasoning</p>
                <p className="text-lg text-gray-700 leading-relaxed font-light">
                    "{result.reasoning}"
                </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex justify-center md:justify-end">
                <button 
                    onClick={onReset}
                    className="group flex items-center space-x-2 px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                    <RefreshCcw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                    <span>Analyze Another File</span>
                </button>
            </div>
        </div>
      </div>
    </FloatingCard>
  );
};
