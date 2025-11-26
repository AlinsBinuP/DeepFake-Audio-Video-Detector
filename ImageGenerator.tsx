import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Image as ImageIcon, Download, Share2, Loader2 } from 'lucide-react';
import { generateImage } from '../../services/geminiService';
import { FloatingCard } from '../../components/FloatingCard';

export const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        setGeneratedImage(null);
        try {
            const imageUrl = await generateImage(prompt);
            setGeneratedImage(imageUrl);
        } catch (error) {
            console.error("Failed to generate image", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center min-h-[80vh]">

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6 max-w-3xl mb-16"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-4">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Powered Imagination</span>
                </div>

                <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tight leading-tight">
                    Dream it. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400">
                        Visualize it.
                    </span>
                </h1>

                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                    Transform your thoughts into stunning visuals with our advanced AI generation engine. Just describe what you see in your mind.
                </p>
            </motion.div>

            {/* Input Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-2xl relative z-20"
            >
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                    <div className="relative flex items-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="A futuristic city floating in the clouds, cyberpunk style..."
                            className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 px-4 py-3 text-lg"
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt.trim()}
                            className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isGenerating ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    <span>Generate</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Result Section */}
            <div className="mt-16 w-full max-w-4xl flex justify-center">
                <AnimatePresence mode="wait">
                    {isGenerating && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="aspect-square w-full max-w-md rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4 backdrop-blur-sm"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse"></div>
                                <Loader2 className="w-12 h-12 text-indigo-400 animate-spin relative z-10" />
                            </div>
                            <p className="text-slate-400 font-medium animate-pulse">Weaving pixels...</p>
                        </motion.div>
                    )}

                    {!isGenerating && generatedImage && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative group w-full max-w-2xl"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl opacity-20 blur-lg group-hover:opacity-30 transition duration-700"></div>
                            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/50">
                                <img
                                    src={generatedImage}
                                    alt="Generated Art"
                                    className="w-full h-auto object-cover"
                                />

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
                                    <div className="text-white/80 text-sm font-medium line-clamp-1 max-w-[70%]">
                                        {prompt}
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors border border-white/10">
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                        <button className="p-2.5 rounded-full bg-white text-black hover:bg-indigo-50 transition-colors shadow-lg">
                                            <Download className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </div>
    );
};
