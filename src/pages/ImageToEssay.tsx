import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Copy, Check, Loader2, Sparkles } from 'lucide-react';
import { generateEssay } from '../../services/geminiService';
import { UploadZone } from '../../components/UploadZone';
import { AnalysisStatus } from '../../types';

export const ImageToEssay: React.FC = () => {
    const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
    const [essay, setEssay] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleFileSelect = async (file: File) => {
        setStatus(AnalysisStatus.ANALYZING);
        setEssay(null);
        try {
            const result = await generateEssay(file);
            setEssay(result);
            setStatus(AnalysisStatus.COMPLETE);
        } catch (error) {
            console.error("Essay generation failed", error);
            setStatus(AnalysisStatus.ERROR);
        }
    };

    const handleCopy = () => {
        if (essay) {
            navigator.clipboard.writeText(essay);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center min-h-[80vh]">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6 max-w-3xl mb-12"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-sm font-medium mb-4">
                    <FileText className="w-4 h-4" />
                    <span>Visual Analysis Engine</span>
                </div>

                <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tight leading-tight">
                    Images to <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400">
                        Insights.
                    </span>
                </h1>

                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                    Upload any image and let our AI craft a detailed, academic-quality essay analyzing its composition, context, and deeper meaning.
                </p>
            </motion.div>

            {/* Upload Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-2xl mb-12"
            >
                <UploadZone onFileSelect={handleFileSelect} status={status} />
            </motion.div>

            {/* Result Section */}
            <AnimatePresence>
                {status === AnalysisStatus.COMPLETE && essay && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        className="w-full max-w-4xl"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 rounded-3xl opacity-20 blur-lg"></div>
                            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">

                                <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-pink-500/20 rounded-lg">
                                            <Sparkles className="w-5 h-5 text-pink-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-white">Generated Analysis</h3>
                                            <p className="text-slate-400 text-sm">AI-generated academic essay</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/5"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                        <span className="text-sm font-medium">{copied ? 'Copied' : 'Copy Text'}</span>
                                    </button>
                                </div>

                                <div className="prose prose-invert max-w-none">
                                    <div className="text-slate-300 leading-relaxed whitespace-pre-wrap font-light text-lg">
                                        {essay}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};
