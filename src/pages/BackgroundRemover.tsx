import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Download, Scissors, Image as ImageIcon, Sparkles, Layers, RefreshCw } from 'lucide-react';
import { BackgroundParticles } from '../../components/BackgroundParticles';
import { AnalysisStatus } from '../../types';
import { removeBackground } from "@imgly/background-removal";

export const BackgroundRemover: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState("Initializing AI...");

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const imageUrl = event.target?.result as string;
            setOriginalImage(imageUrl);
            setProcessedImage(null);
            processImage(imageUrl);
        };
        reader.readAsDataURL(file);
    };

    const processImage = async (imageUrl: string) => {
        setIsProcessing(true);
        setProgress(0);
        setLoadingText("Loading AI Model...");

        try {
            // Simulate progress for better UX since actual progress isn't granular
            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) return prev;
                    return prev + 5;
                });
            }, 500);

            const blob = await removeBackground(imageUrl, {
                progress: (key, current, total) => {
                    // Optional: Use actual progress if available
                    // const p = Math.round((current / total) * 100);
                    // setProgress(p);
                }
            });

            clearInterval(progressInterval);
            setProgress(100);
            setLoadingText("Finalizing...");

            const url = URL.createObjectURL(blob);
            setProcessedImage(url);
        } catch (error) {
            console.error("Background removal failed:", error);
            setLoadingText("Failed to process image");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!processedImage) return;
        const link = document.createElement('a');
        link.href = processedImage;
        link.download = `bg-removed-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            {/* Custom Background for this page - Rose/Red Theme */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-900/20 via-black to-black"></div>
                <BackgroundParticles status={AnalysisStatus.IDLE} />
            </div>

            <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-medium backdrop-blur-sm">
                        <Scissors className="w-4 h-4" />
                        <span>AI Cutout Engine</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white font-display">
                        Background <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500">Remover</span>
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Instantly remove backgrounds from any image.
                        100% free, private, and runs entirely in your browser.
                    </p>
                </motion.div>

                {/* Main Content */}
                <div className="w-full max-w-6xl">

                    {!originalImage ? (
                        // Upload Section
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-2xl mx-auto"
                        >
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-rose-500/30 rounded-3xl cursor-pointer hover:border-rose-500/60 hover:bg-white/5 transition-all group bg-white/5 backdrop-blur-md">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <div className="p-4 rounded-full bg-rose-500/10 mb-4 group-hover:bg-rose-500/20 transition-colors">
                                        <Upload className="w-12 h-12 text-rose-400" />
                                    </div>
                                    <p className="text-xl font-semibold text-white mb-2">Upload image to cut out</p>
                                    <p className="text-sm text-slate-400">PNG, JPG • Automatic AI Detection</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>

                            {/* Info Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                                {[
                                    { icon: Scissors, title: "Precise Cutouts", desc: "Hair-level detail" },
                                    { icon: Layers, title: "Transparent", desc: "Save as PNG" },
                                    { icon: Sparkles, title: "100% Free", desc: "Unlimited use" }
                                ].map((item, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center group hover:border-rose-500/30 transition-colors">
                                        <item.icon className="w-6 h-6 text-rose-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                        <div className="text-white font-semibold text-sm">{item.title}</div>
                                        <div className="text-slate-400 text-xs">{item.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        // Results View
                        <div className="space-y-8">

                            {/* Progress Bar */}
                            <AnimatePresence>
                                {isProcessing && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="max-w-md mx-auto text-center"
                                    >
                                        <div className="flex justify-between text-sm text-slate-300 mb-2">
                                            <span>{loadingText}</span>
                                            <span>{Math.round(progress)}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-rose-500 to-pink-500"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ type: "spring", stiffness: 50 }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2">First run may take a moment to load models.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Comparison Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Original */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-white">Original</h3>
                                    </div>
                                    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900 aspect-square flex items-center justify-center p-4">
                                        <img src={originalImage} alt="Original" className="max-w-full max-h-full object-contain" />
                                    </div>
                                </div>

                                {/* Result */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-white">Background Removed</h3>
                                        {processedImage && <span className="text-xs text-rose-400 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">Ready</span>}
                                    </div>
                                    <div className="relative rounded-2xl overflow-hidden border border-rose-500/20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] aspect-square flex items-center justify-center p-4">
                                        {/* Checkerboard pattern for transparency */}
                                        <div className="absolute inset-0 opacity-20" style={{
                                            backgroundImage: `linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)`,
                                            backgroundSize: `20px 20px`,
                                            backgroundPosition: `0 0, 0 10px, 10px -10px, -10px 0px`
                                        }}></div>

                                        {processedImage ? (
                                            <motion.img
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                src={processedImage}
                                                alt="Processed"
                                                className="relative z-10 max-w-full max-h-full object-contain drop-shadow-2xl"
                                            />
                                        ) : (
                                            <div className="relative z-10 text-slate-500 flex flex-col items-center">
                                                <Scissors className="w-12 h-12 animate-pulse mb-2 opacity-50" />
                                                <p className="text-sm">Processing...</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            {processedImage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-center gap-4"
                                >
                                    <button
                                        onClick={handleDownload}
                                        className="px-8 py-4 bg-rose-500 text-white font-semibold rounded-xl hover:bg-rose-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
                                    >
                                        <Download className="w-5 h-5" />
                                        Download PNG
                                    </button>
                                    <button
                                        onClick={() => {
                                            setOriginalImage(null);
                                            setProcessedImage(null);
                                        }}
                                        className="px-8 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                        New Image
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
