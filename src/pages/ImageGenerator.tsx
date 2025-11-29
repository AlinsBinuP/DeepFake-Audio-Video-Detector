import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Image as ImageIcon, Download, Share2, Loader2, Wand2 } from 'lucide-react';
import { generateImage } from '../../services/geminiService';

export const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('Initializing...');
    const [error, setError] = useState<string | null>(null);

    const simulateProgress = () => {
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) return prev; // Hold at 90% until complete
                const increment = Math.random() * 15;
                return Math.min(prev + increment, 90);
            });
        }, 500);

        const texts = ["Interpreting prompt...", "Weaving pixels...", "Adding details...", "Polishing visuals...", "Almost there..."];
        let textIndex = 0;
        const textInterval = setInterval(() => {
            setLoadingText(texts[textIndex % texts.length]);
            textIndex++;
        }, 2000);

        return () => {
            clearInterval(interval);
            clearInterval(textInterval);
        };
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        setGeneratedImage(null);
        setError(null);
        const cleanup = simulateProgress();

        try {
            const imageUrl = await generateImage(prompt);
            setProgress(100);
            setLoadingText("Complete!");
            // Small delay to show 100%
            setTimeout(() => {
                setGeneratedImage(imageUrl);
                setIsGenerating(false);
            }, 500);
        } catch (error) {
            console.error("Failed to generate image", error);
            setError(error instanceof Error ? error.message : "Failed to generate image");
            setIsGenerating(false);
        } finally {
            cleanup();
        }
    };

    const handleDownload = async () => {
        if (!generatedImage) return;
        try {
            const response = await fetch(generatedImage);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `generated-art-${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed", err);
            setError("Failed to download image.");
        }
    };

    return (
        <>
            {/* Custom Background - Purple/Fuchsia Theme */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-black"></div>
            </div>

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center min-h-[80vh] relative z-10">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-8 max-w-3xl mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-hover text-sm font-medium mb-4 backdrop-blur-sm">
                        <Wand2 className="w-4 h-4" />
                        <span>AI Powered Imagination</span>
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tight leading-tight font-display drop-shadow-2xl">
                        Dream it. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-pink-500 animate-gradient-x">
                            Visualize it.
                        </span>
                    </h1>

                    <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
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
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-pink-500 rounded-2xl opacity-30 group-hover:opacity-60 blur transition duration-500"></div>
                        <div className="relative flex items-center glass-panel rounded-2xl p-2 shadow-2xl">
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="A futuristic city floating in the clouds, cyberpunk style..."
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 px-6 py-4 text-lg font-light"
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                            />
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !prompt.trim()}
                                className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
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

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center backdrop-blur-sm"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Result Section */}
                <div className="mt-20 w-full max-w-4xl flex justify-center">
                    <AnimatePresence mode="wait">
                        {isGenerating && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="aspect-square w-full max-w-md rounded-3xl glass-card flex flex-col items-center justify-center gap-8 p-8"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary blur-2xl opacity-20 animate-pulse"></div>
                                    <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10" />
                                </div>

                                <div className="w-full max-w-xs space-y-4">
                                    <div className="flex justify-between text-sm font-medium text-slate-300">
                                        <span>{loadingText}</span>
                                        <span>{Math.round(progress)}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-primary to-accent"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ type: "spring", stiffness: 50 }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {!isGenerating && generatedImage && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative group w-full max-w-2xl"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-br from-primary to-accent rounded-[2rem] opacity-20 blur-xl group-hover:opacity-40 transition duration-700"></div>
                                <div className="relative rounded-[1.8rem] overflow-hidden border border-white/10 shadow-2xl bg-black/50">
                                    <img
                                        src={generatedImage}
                                        alt="Generated Art"
                                        className="w-full h-auto object-cover"
                                    />

                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-8">
                                        <div className="text-white/90 text-sm font-medium line-clamp-2 max-w-[70%] backdrop-blur-sm bg-black/30 p-2 rounded-lg border border-white/5">
                                            {prompt}
                                        </div>
                                        <div className="flex gap-3">
                                            <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors border border-white/10 hover:scale-110 active:scale-95">
                                                <Share2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={handleDownload}
                                                className="p-3 rounded-full bg-white text-black hover:bg-indigo-50 transition-colors shadow-lg hover:scale-110 active:scale-95"
                                            >
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
        </>
    );
};
