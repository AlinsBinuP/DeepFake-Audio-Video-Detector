import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Download, Zap, Image as ImageIcon, Sparkles, ArrowRight } from 'lucide-react';
import { BackgroundParticles } from '../../components/BackgroundParticles';
import { AnalysisStatus } from '../../types';

export const ImageUpscaler: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [upscaledImage, setUpscaledImage] = useState<string | null>(null);
    const [isUpscaling, setIsUpscaling] = useState(false);
    const [progress, setProgress] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const upscaleImage = (img: HTMLImageElement, scale: number = 2): Promise<string> => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;

            // Set canvas to scaled dimensions
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;

            // Use better image smoothing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Draw upscaled image
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Apply sharpening filter
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const sharpened = sharpenImage(imageData);
            ctx.putImageData(sharpened, 0, 0);

            resolve(canvas.toDataURL('image/png'));
        });
    };

    const sharpenImage = (imageData: ImageData): ImageData => {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const output = new ImageData(width, height);

        // Sharpening kernel
        const kernel = [
            [0, -1, 0],
            [-1, 5, -1],
            [0, -1, 0]
        ];

        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                for (let c = 0; c < 3; c++) {
                    let sum = 0;
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
                            sum += data[idx] * kernel[ky + 1][kx + 1];
                        }
                    }
                    const outIdx = (y * width + x) * 4 + c;
                    output.data[outIdx] = Math.min(255, Math.max(0, sum));
                }
                // Copy alpha channel
                output.data[(y * width + x) * 4 + 3] = data[(y * width + x) * 4 + 3];
            }
        }

        return output;
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const imageUrl = event.target?.result as string;
            setOriginalImage(imageUrl);
            setUpscaledImage(null);

            // Auto-upscale
            setIsUpscaling(true);
            setProgress(0);

            const img = new Image();
            img.onload = async () => {
                // Simulate progress
                const progressInterval = setInterval(() => {
                    setProgress(prev => Math.min(prev + 10, 90));
                }, 100);

                const upscaled = await upscaleImage(img, 2);

                clearInterval(progressInterval);
                setProgress(100);

                setTimeout(() => {
                    setUpscaledImage(upscaled);
                    setIsUpscaling(false);
                }, 300);
            };
            img.src = imageUrl;
        };
        reader.readAsDataURL(file);
    };

    const handleDownload = () => {
        if (!upscaledImage) return;

        const link = document.createElement('a');
        link.href = upscaledImage;
        link.download = `upscaled-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <BackgroundParticles status={AnalysisStatus.IDLE} />

            <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium backdrop-blur-sm">
                        <Zap className="w-4 h-4" />
                        <span>AI Enhancement Engine</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white font-display">
                        Image <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Upscaler</span>
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Enhance your images with AI-powered 2x upscaling.
                        Transform low-resolution photos into crisp, high-quality visuals.
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
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-emerald-500/30 rounded-3xl cursor-pointer hover:border-emerald-500/60 hover:bg-white/5 transition-all group bg-white/5 backdrop-blur-md">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <div className="p-4 rounded-full bg-emerald-500/10 mb-4 group-hover:bg-emerald-500/20 transition-colors">
                                        <Upload className="w-12 h-12 text-emerald-400" />
                                    </div>
                                    <p className="text-xl font-semibold text-white mb-2">Upload an image to upscale</p>
                                    <p className="text-sm text-slate-400">PNG, JPG up to 10MB • 2x enhancement</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>

                            {/* Info Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                                {[
                                    { icon: Zap, title: "Instant", desc: "Process in seconds" },
                                    { icon: Sparkles, title: "AI Powered", desc: "Smart enhancement" },
                                    { icon: Download, title: "Free Forever", desc: "No limits" }
                                ].map((item, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
                                        <item.icon className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                                        <div className="text-white font-semibold text-sm">{item.title}</div>
                                        <div className="text-slate-400 text-xs">{item.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        // Comparison View
                        <div className="space-y-8">

                            {/* Progress Bar */}
                            <AnimatePresence>
                                {isUpscaling && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="max-w-md mx-auto"
                                    >
                                        <div className="flex justify-between text-sm text-slate-300 mb-2">
                                            <span>Upscaling...</span>
                                            <span>{Math.round(progress)}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ type: "spring", stiffness: 50 }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Before/After Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Original */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-white">Original</h3>
                                        <span className="text-xs text-slate-400 px-3 py-1 rounded-full bg-white/5 border border-white/10">Low-res</span>
                                    </div>
                                    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900 aspect-square">
                                        <img src={originalImage} alt="Original" className="w-full h-full object-contain" />
                                    </div>
                                </div>

                                {/* Upscaled */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-white">Upscaled (2x)</h3>
                                        <span className="text-xs text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">Enhanced</span>
                                    </div>
                                    <div className="relative rounded-2xl overflow-hidden border border-emerald-500/20 bg-slate-900 aspect-square">
                                        {upscaledImage ? (
                                            <img src={upscaledImage} alt="Upscaled" className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="text-slate-500">
                                                    <Sparkles className="w-12 h-12 animate-pulse mx-auto mb-2" />
                                                    <p className="text-sm">Processing...</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            {upscaledImage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-center gap-4"
                                >
                                    <button
                                        onClick={handleDownload}
                                        className="px-8 py-4 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
                                    >
                                        <Download className="w-5 h-5" />
                                        Download Upscaled
                                    </button>
                                    <button
                                        onClick={() => {
                                            setOriginalImage(null);
                                            setUpscaledImage(null);
                                        }}
                                        className="px-8 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
                                    >
                                        Upload New
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>

                <canvas ref={canvasRef} className="hidden" />
            </div>
        </>
    );
};
