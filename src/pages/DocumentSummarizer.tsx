import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, Sparkles, Loader2, AlignLeft, List, AlignJustify, File as FileIcon, Copy, Check } from 'lucide-react';
import { summarizeDocument } from '../../services/geminiService';
import { SummaryOptions } from '../../types';
import { useDropzone } from 'react-dropzone';
import ReactMarkdown from 'react-markdown';

export const DocumentSummarizer: React.FC = () => {
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summary, setSummary] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [options, setOptions] = useState<SummaryOptions>({
        length: 'medium',
        format: 'paragraph'
    });

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setText(''); // Clear text if file is uploaded
            setError(null);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt']
        },
        maxFiles: 1
    });

    const handleSummarize = async () => {
        if (!text.trim() && !file) return;

        setIsSummarizing(true);
        setSummary(null);
        setError(null);

        try {
            const content = file || text;
            const result = await summarizeDocument(content, options);
            setSummary(result);
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : "Failed to generate summary. Please try again.";
            setError(errorMessage);
        } finally {
            setIsSummarizing(false);
        }
    };

    const handleCopy = () => {
        if (summary) {
            navigator.clipboard.writeText(summary);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <>
            {/* Custom Background - Teal/Cyan Theme */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-slate-950 to-black"></div>
            </div>

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center min-h-[80vh] relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-8 max-w-3xl mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium mb-4 backdrop-blur-sm">
                        <FileText className="w-4 h-4" />
                        <span>Intelligent Analysis</span>
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tight leading-tight font-display drop-shadow-2xl">
                        Instant <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 animate-gradient-x">
                            Summaries
                        </span>
                    </h1>

                    <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Transform lengthy documents into concise, actionable insights. Upload a PDF or paste text to get started.
                    </p>
                </motion.div>

                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Input Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        {/* File Upload */}
                        <div
                            {...getRootProps()}
                            className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-8 flex flex-col items-center justify-center gap-4
                            ${isDragActive ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:border-emerald-500/50 hover:bg-white/5'}
                            ${file ? 'bg-emerald-500/5 border-emerald-500/30' : ''}
                        `}
                        >
                            <input {...getInputProps()} />
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 rounded-2xl -z-10"></div>

                            {file ? (
                                <>
                                    <div className="p-4 rounded-full bg-emerald-500/20 text-emerald-400">
                                        <FileIcon className="w-8 h-8" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white font-medium">{file.name}</p>
                                        <p className="text-slate-400 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                        className="text-xs text-red-400 hover:text-red-300 underline"
                                    >
                                        Remove
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="p-4 rounded-full bg-white/5 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors text-slate-400">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <p className="text-white font-medium">Drop PDF or TXT here</p>
                                        <p className="text-slate-500 text-sm">or click to browse</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Text Input Separator */}
                        <div className="flex items-center gap-4 text-slate-600">
                            <div className="h-px flex-1 bg-white/10"></div>
                            <span className="text-sm font-medium">OR PASTE TEXT</span>
                            <div className="h-px flex-1 bg-white/10"></div>
                        </div>

                        {/* Text Area */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-30 transition duration-500 blur"></div>
                            <textarea
                                value={text}
                                onChange={(e) => { setText(e.target.value); setFile(null); }}
                                placeholder="Paste your text here..."
                                className="w-full h-48 bg-black/40 border border-white/10 rounded-2xl p-4 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none glass-panel"
                            />
                        </div>

                        {/* Controls */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Length</label>
                                <div className="flex bg-black/40 rounded-xl p-1 border border-white/10">
                                    {(['short', 'medium', 'long'] as const).map((l) => (
                                        <button
                                            key={l}
                                            onClick={() => setOptions({ ...options, length: l })}
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize
                                            ${options.length === l ? 'bg-emerald-500/20 text-emerald-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}
                                        `}
                                        >
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Format</label>
                                <div className="flex bg-black/40 rounded-xl p-1 border border-white/10">
                                    <button
                                        onClick={() => setOptions({ ...options, format: 'paragraph' })}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2
                                        ${options.format === 'paragraph' ? 'bg-emerald-500/20 text-emerald-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}
                                    `}
                                    >
                                        <AlignLeft className="w-4 h-4" />
                                        <span className="hidden sm:inline">Para</span>
                                    </button>
                                    <button
                                        onClick={() => setOptions({ ...options, format: 'bullet-points' })}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2
                                        ${options.format === 'bullet-points' ? 'bg-emerald-500/20 text-emerald-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}
                                    `}
                                    >
                                        <List className="w-4 h-4" />
                                        <span className="hidden sm:inline">Bullets</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSummarize}
                            disabled={isSummarizing || (!text && !file)}
                            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-emerald-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isSummarizing ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5 text-emerald-600" />
                                    <span>Generate Summary</span>
                                </>
                            )}
                        </button>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center backdrop-blur-sm"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Output Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="h-full min-h-[500px]"
                    >
                        <div className="h-full rounded-3xl glass-card border border-white/10 p-8 relative overflow-hidden flex flex-col">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-50"></div>

                            {/* Header with Copy Button */}
                            {summary && (
                                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-emerald-400" />
                                        Summary
                                    </h3>
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/5 active:scale-95"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                        <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy'}</span>
                                    </button>
                                </div>
                            )}

                            {!summary && !isSummarizing && (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-4">
                                    <AlignJustify className="w-16 h-16 opacity-20" />
                                    <p className="font-light">Summary will appear here</p>
                                </div>
                            )}

                            {isSummarizing && (
                                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                                    <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                                    <p className="text-emerald-400/80 animate-pulse font-medium">Analyzing content...</p>
                                </div>
                            )}

                            {summary && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="prose prose-invert prose-emerald max-w-none overflow-y-auto custom-scrollbar pr-2"
                                >
                                    <ReactMarkdown
                                        components={{
                                            h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-white mt-6 mb-3" {...props} />,
                                            h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-white mt-5 mb-2" {...props} />,
                                            h3: ({ node, ...props }) => <h3 className="text-lg font-semibold text-white mt-4 mb-2" {...props} />,
                                            p: ({ node, ...props }) => <p className="mb-3 text-slate-200 leading-relaxed" {...props} />,
                                            strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 space-y-1" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />,
                                            li: ({ node, ...props }) => <li className="text-slate-200" {...props} />,
                                        }}
                                    >
                                        {summary}
                                    </ReactMarkdown>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};
