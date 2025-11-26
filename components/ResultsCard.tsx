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
  const bgColor = isReal ? 'bg-emerald-500/10' : 'bg-rose-500/10';
  const borderColor = isReal ? 'border-emerald-500/20' : 'border-rose-500/20';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className={`glass-panel rounded-3xl overflow-hidden border ${borderColor}`}>

        {/* Header Status Bar */}
        <div className={`p-6 ${bgColor} border-b ${borderColor} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            {isReal ? (
              <Shield className="w-6 h-6 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-6 h-6 text-rose-400" />
            )}
            <span className={`font-display font-bold text-lg tracking-wide ${scoreColor}`}>
              ANALYSIS COMPLETE
            </span>
          </div>
          <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Main Verdict Column */}
          <div className="flex flex-col items-center justify-center text-center space-y-6 border-b md:border-b-0 md:border-r border-white/5 pb-8 md:pb-0 md:pr-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className={`w-32 h-32 rounded-full flex items-center justify-center border-4 ${isReal ? 'border-emerald-500/30' : 'border-rose-500/30'} relative`}
            >
              <div className={`absolute inset-0 rounded-full ${isReal ? 'bg-emerald-500/20' : 'bg-rose-500/20'} animate-pulse-slow`}></div>
              {isReal ? (
                <CheckCircle className="w-16 h-16 text-emerald-400 relative z-10" />
              ) : (
                <AlertTriangle className="w-16 h-16 text-rose-400 relative z-10" />
              )}
            </motion.div>

            <div>
              <h2 className="text-4xl font-bold text-white font-display mb-2">{result.verdict}</h2>
              <p className="text-slate-400 text-sm">Based on deep learning analysis</p>
            </div>
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-center space-y-6">

            {/* Confidence Score */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-slate-300">
                <span>Authenticity Score</span>
                <span className={scoreColor}>{result.score}%</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.score}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-full rounded-full ${isReal ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 'bg-gradient-to-r from-rose-600 to-rose-400'}`}
                />
              </div>
            </div>

            {/* Reasoning */}
            <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 mb-2 text-indigo-400">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">AI Reasoning</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                {result.reasoning}
              </p>
            </div>

            <button
              onClick={onReset}
              className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all flex items-center justify-center gap-2 group"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Analyze Another File
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
};
