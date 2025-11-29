import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Eraser, Download, RefreshCw, Wand2, Loader2, Undo } from 'lucide-react';
import { BackgroundParticles } from '../../components/BackgroundParticles';
import { AnalysisStatus } from '../../types';

export const MagicEraser: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [brushSize, setBrushSize] = useState(20);
    const [isDrawing, setIsDrawing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (image && canvasRef.current && containerRef.current && imageRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const { width, height } = containerRef.current.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height;

            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.lineWidth = brushSize;
        }
    }, [image]);

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) ctx.lineWidth = brushSize;
        }
    }, [brushSize]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setImage(event.target?.result as string);
            setResultImage(null);
            setError(null);
        };
        reader.readAsDataURL(file);
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) ctx.beginPath();
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        let x, y;

        if ('touches' in e) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = (e as React.MouseEvent).clientX - rect.left;
            y = (e as React.MouseEvent).clientY - rect.top;
        }

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const clearMask = () => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };

    const handleErase = async () => {
        if (!image || !canvasRef.current || !imageRef.current) return;

        setIsProcessing(true);
        setError(null);

        setTimeout(() => {
            try {
                const resultCanvas = document.createElement('canvas');
                const img = imageRef.current!;
                resultCanvas.width = img.naturalWidth;
                resultCanvas.height = img.naturalHeight;

                const ctx = resultCanvas.getContext('2d', { willReadFrequently: true });
                if (!ctx) throw new Error("Could not create context");

                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, resultCanvas.width, resultCanvas.height);
                const pixels = imageData.data;

                const maskCanvas = canvasRef.current!;
                const maskCtx = maskCanvas.getContext('2d');
                if (!maskCtx) throw new Error("No mask context");

                const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
                const scaleX = resultCanvas.width / maskCanvas.width;
                const scaleY = resultCanvas.height / maskCanvas.height;

                for (let my = 0; my < maskCanvas.height; my++) {
                    for (let mx = 0; mx < maskCanvas.width; mx++) {
                        const mi = (my * maskCanvas.width + mx) * 4;

                        if (maskData.data[mi] > 100) {
                            const startX = Math.floor(mx * scaleX);
                            const startY = Math.floor(my * scaleY);
                            const endX = Math.min(Math.ceil((mx + 1) * scaleX), resultCanvas.width);
                            const endY = Math.min(Math.ceil((my + 1) * scaleY), resultCanvas.height);

                            let sampleX = startX;
                            let sampleY = startY - Math.floor(brushSize * scaleY);
                            sampleY = Math.max(0, Math.min(sampleY, resultCanvas.height - 1));
                            sampleX = Math.max(0, Math.min(sampleX, resultCanvas.width - 1));

                            const si = (sampleY * resultCanvas.width + sampleX) * 4;
                            const r = pixels[si];
                            const g = pixels[si + 1];
                            const b = pixels[si + 2];

                            for (let y = startY; y < endY; y++) {
                                for (let x = startX; x < endX; x++) {
                                    const i = (y * resultCanvas.width + x) * 4;
                                    pixels[i] = r;
                                    pixels[i + 1] = g;
                                    pixels[i + 2] = b;
                                }
                            }
                        }
                    }
                }

                ctx.putImageData(imageData, 0, 0);
                setResultImage(resultCanvas.toDataURL('image/png'));

            } catch (err: any) {
                console.error("Erasing failed", err);
                setError(err.message || "Failed to erase object");
            } finally {
                setIsProcessing(false);
            }
        }, 100);
    };

    return (
        <>
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-700/20 via-slate-950 to-black"></div>
                <BackgroundParticles status={AnalysisStatus.IDLE} />
            </div>

            <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center relative z-10">

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-300 text-sm font-medium backdrop-blur-sm">
                        <Eraser className="w-4 h-4" />
                        <span>Object Removal</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white font-display">
                        Magic <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-gray-400 to-slate-200 animate-gradient-x">Eraser</span>
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Paint over objects to remove them with content-aware fill.
                    </p>
                </motion.div>

                <div className="w-full max-w-5xl">
                    {!image ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-2xl mx-auto"
                        >
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-500/30 rounded-3xl cursor-pointer hover:border-slate-500/60 hover:bg-white/5 transition-all group bg-white/5 backdrop-blur-md">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <div className="p-4 rounded-full bg-slate-500/10 mb-4 group-hover:bg-slate-500/20 transition-colors">
                                        <Upload className="w-12 h-12 text-slate-400" />
                                    </div>
                                    <p className="text-xl font-semibold text-white mb-2">Upload image to edit</p>
                                    <p className="text-sm text-slate-400">PNG, JPG</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col gap-8">
                            <div className="flex-1 w-full relative group">
                                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/50 shadow-2xl" ref={containerRef}>
                                    <img
                                        ref={imageRef}
                                        src={resultImage || image}
                                        alt="Workspace"
                                        className="w-full h-auto block select-none pointer-events-none"
                                    />

                                    {!resultImage && (
                                        <canvas
                                            ref={canvasRef}
                                            className="absolute inset-0 cursor-crosshair touch-none"
                                            onMouseDown={startDrawing}
                                            onMouseMove={draw}
                                            onMouseUp={stopDrawing}
                                            onMouseLeave={stopDrawing}
                                            onTouchStart={startDrawing}
                                            onTouchMove={draw}
                                            onTouchEnd={stopDrawing}
                                        />
                                    )}

                                    {isProcessing && (
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                                            <Loader2 className="w-12 h-12 text-slate-200 animate-spin mb-4" />
                                            <p className="text-slate-200 font-medium animate-pulse">Processing...</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                                    {!resultImage ? (
                                        <>
                                            <div className="flex items-center gap-3 px-4 border-r border-white/10">
                                                <span className="text-xs text-slate-400 uppercase font-bold">Brush Size</span>
                                                <input
                                                    type="range"
                                                    min="5"
                                                    max="50"
                                                    value={brushSize}
                                                    onChange={(e) => setBrushSize(Number(e.target.value))}
                                                    className="w-32 accent-slate-400"
                                                />
                                            </div>
                                            <button
                                                onClick={clearMask}
                                                className="p-2 text-slate-400 hover:text-white transition-colors"
                                                title="Clear Mask"
                                            >
                                                <Undo className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={handleErase}
                                                disabled={isProcessing}
                                                className="px-6 py-2 bg-slate-200 text-black font-bold rounded-lg hover:bg-white transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50"
                                            >
                                                <Wand2 className="w-4 h-4" />
                                                Erase Object
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.href = resultImage;
                                                    link.download = `magic-eraser-${Date.now()}.png`;
                                                    link.click();
                                                }}
                                                className="px-6 py-2 bg-slate-200 text-black font-bold rounded-lg hover:bg-white transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                                            >
                                                <Download className="w-4 h-4" />
                                                Download
                                            </button>
                                            <button
                                                onClick={() => {
                                                    // Make the result the new base image
                                                    setImage(resultImage);
                                                    setResultImage(null);
                                                    clearMask();
                                                }}
                                                className="px-6 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
                                            >
                                                <Undo className="w-4 h-4" />
                                                Edit More
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => {
                                            setImage(null);
                                            setResultImage(null);
                                        }}
                                        className="px-4 py-2 text-slate-400 hover:text-red-400 transition-colors flex items-center gap-2 ml-auto"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Start Over
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center backdrop-blur-sm"
                                        >
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
