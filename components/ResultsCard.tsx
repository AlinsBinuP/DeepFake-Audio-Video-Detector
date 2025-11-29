import React from 'react';
import { AnalysisResult } from '../types';
import { CheckCircle, AlertTriangle, RefreshCw, Shield, ShieldAlert, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResultsCardProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({ result, onReset }) => {
  const isReal = result.verdict === 'REAL';
  const scoreColor = isReal ? 'text-emerald-400' : 'text-rose-400';
  const bgColor = isReal ? 'bg-emerald-500/5' : 'bg-rose-500/5';
  const borderColor = isReal ? 'border-emerald-500/20' : 'border-rose-500/20';
  const glowColor = isReal ? 'shadow-emerald-500/20' : 'shadow-rose-500/20';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full relative group"
    >
      {/* Ambient Glow */}
      <div className={`absolute -inset-1 rounded-[2rem] bg-gradient-to-r ${isReal ? 'from-emerald-600/20 to-teal-600/20' : 'from-rose-600/20 to-orange-600/20'} blur-xl opacity-50 group-hover:opacity-75 transition duration-1000`}></div>

      <div className={`relative glass-panel rounded-[1.8rem] overflow-hidden border ${borderColor} ${glowColor} shadow-2xl`}>

        {/* Header Status Bar */}
        <div className={`p-6 ${bgColor} border-b ${borderColor} flex items-center justify-between backdrop-blur-md`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isReal ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
              {isReal ? (
                <Shield className="w-5 h-5 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-rose-400" />
              )}
            </div>
            <span className={`font-display font-bold text-lg tracking-wide ${scoreColor}`}>
              ANALYSIS COMPLETE
            </span>
          </div>
          <div className="text-xs font-mono text-slate-500 uppercase tracking-widest opacity-70">
            ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Main Verdict Column */}
          <div className="flex flex-col items-center justify-center text-center space-y-8 border-b md:border-b-0 md:border-r border-white/5 pb-8 md:pb-0 md:pr-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className={`w-40 h-40 rounded-full flex items-center justify-center border-4 ${isReal ? 'border-emerald-500/30' : 'border-rose-500/30'} relative`}
            >
              <div className={`absolute inset-0 rounded-full ${isReal ? 'bg-emerald-500/10' : 'bg-rose-500/10'} animate-pulse-slow`}></div>
              <div className={`absolute inset-4 rounded-full ${isReal ? 'bg-emerald-500/20' : 'bg-rose-500/20'} blur-xl`}></div>
              {isReal ? (
                <CheckCircle className="w-20 h-20 text-emerald-400 relative z-10 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
              ) : (
                <AlertTriangle className="w-20 h-20 text-rose-400 relative z-10 drop-shadow-[0_0_15px_rgba(251,113,133,0.5)]" />
              )}
            </motion.div>

            <div>
              <h2 className={`text-5xl font-bold font-display mb-3 tracking-tight ${isReal ? 'text-white' : 'text-white'}`}>
                {result.verdict}
              </h2>
              <p className="text-slate-400 font-light">
                Confidence: <span className={scoreColor}>{result.score}%</span>
              </p>
            </div>
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-center space-y-8">

            {/* Confidence Score */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium text-slate-300">
                <span>Authenticity Score</span>
                <span className={scoreColor}>{result.score}%</span>
              </div>
              <div className="h-4 bg-slate-900/50 rounded-full overflow-hidden border border-white/5 p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.score}%` }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  className={`h-full rounded-full shadow-lg ${isReal ? 'bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-emerald-500/20' : 'bg-gradient-to-r from-rose-600 to-rose-400 shadow-rose-500/20'}`}
                />
              </div>
            </div>

            {/* Reasoning */}
            <div className="bg-slate-900/40 rounded-2xl p-6 border border-white/5 relative overflow-hidden group/reasoning">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50"></div>
              <div className="flex items-center gap-2 mb-3 text-indigo-400">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">AI Reasoning</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed font-light">
                {result.reasoning}
              </p>
            </div>

            <button
              onClick={onReset}
              className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
              Analyze Another File
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
};
