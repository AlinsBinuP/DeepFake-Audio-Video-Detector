import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Copy, Check, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { generateEssay } from '../../services/geminiService';
import { UploadZone } from '../../components/UploadZone';
import { AnalysisStatus } from '../../types';
import ReactMarkdown from 'react-markdown';

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
        <>
            {/* Custom Background - Amber/Orange Theme */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-slate-950 to-black"></div>
            </div>

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center min-h-[80vh] relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-8 max-w-3xl mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-sm font-medium mb-4 backdrop-blur-sm">
                        <BookOpen className="w-4 h-4" />
                        <span>Visual Analysis Engine</span>
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tight leading-tight font-display drop-shadow-2xl">
                        Images to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 animate-gradient-x">
                            Insights.
                        </span>
                    </h1>

                    <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Upload any image and let our AI craft a detailed, academic-quality essay analyzing its composition, context, and deeper meaning.
                    </p>
                </motion.div>

                {/* Upload Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full max-w-2xl mb-16 relative z-20"
                >
                    <UploadZone
                        onFileSelect={handleFileSelect}
                        status={status}
                        accept={{ 'image/*': [] }}
                        title="Upload Image"
                        subtitle="Supports JPG, PNG, WEBP"
                        icon={<Sparkles className="w-10 h-10 text-pink-400 group-hover:text-pink-300 transition-colors" />}
                    />
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
                                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 rounded-[2.5rem] opacity-20 blur-xl group-hover:opacity-30 transition duration-1000"></div>
                                <div className="relative glass-panel rounded-[2rem] p-8 sm:p-12 shadow-2xl border border-white/10">

                                    <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-pink-500/10 rounded-xl border border-pink-500/20">
                                                <FileText className="w-6 h-6 text-pink-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-white font-display">Generated Analysis</h3>
                                                <p className="text-slate-400 text-sm font-light">AI-generated academic essay</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleCopy}
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/5 active:scale-95"
                                        >
                                            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                            <span className="text-sm font-medium">{copied ? 'Copied' : 'Copy Text'}</span>
                                        </button>
                                    </div>

                                    <div className="prose prose-invert max-w-none">
                                        <ReactMarkdown
                                            components={{
                                                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-white mt-6 mb-4" {...props} />,
                                                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-white mt-5 mb-3" {...props} />,
                                                h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-white mt-4 mb-2" {...props} />,
                                                p: ({ node, ...props }) => <p className="mb-4 text-slate-300 leading-relaxed" {...props} />,
                                                strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                                                li: ({ node, ...props }) => <li className="text-slate-300" {...props} />,
                                            }}
                                        >
                                            {essay}
                                        </ReactMarkdown>
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </>
    );
};
