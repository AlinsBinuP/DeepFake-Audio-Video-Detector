import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Upload, Image as ImageIcon, Layers, MousePointer2, Sparkles } from 'lucide-react';
import { BackgroundParticles } from '../../components/BackgroundParticles';
import { AnalysisStatus } from '../../types';

export const ThreeDMotion: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [isHovering, setIsHovering] = useState(false);

    // Mouse position values
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring animation for tilt
    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    // Calculate rotation based on mouse position
    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

    // Parallax layer transforms
    const layer1X = useTransform(mouseX, [-0.5, 0.5], ["-20px", "20px"]);
    const layer1Y = useTransform(mouseY, [-0.5, 0.5], ["-20px", "20px"]);

    const layer2X = useTransform(mouseX, [-0.5, 0.5], ["-40px", "40px"]);
    const layer2Y = useTransform(mouseY, [-0.5, 0.5], ["-40px", "40px"]);

    // Glare effect - MOVED TO TOP LEVEL
    const glareBackgroundPosition = useTransform(mouseX, [-0.5, 0.5], ["0% 0%", "100% 100%"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseXVal = e.clientX - rect.left;
        const mouseYVal = e.clientY - rect.top;

        const xPct = mouseXVal / width - 0.5;
        const yPct = mouseYVal / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovering(false);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-medium backdrop-blur-sm">
                        <Layers className="w-4 h-4" />
                        <span>Holographic Engine</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white font-display">
                        3D Motion <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Generator</span>
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Transform any static image into an interactive 3D holographic experience.
                        Move your mouse to control the perspective.
                    </p>
                </motion.div>

                {/* Main Interaction Area */}
                <div className="w-full max-w-4xl flex flex-col md:flex-row gap-12 items-center justify-center">

                    {/* Controls / Upload */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="w-full md:w-1/3 space-y-6"
                    >
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Upload className="w-5 h-5 text-cyan-400" />
                                Upload Image
                            </h3>

                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-cyan-500/50 hover:bg-white/5 transition-all group">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-cyan-400 mb-2 transition-colors" />
                                    <p className="text-sm text-slate-400">Click to upload</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-3 text-sm text-slate-400">
                                    <MousePointer2 className="w-4 h-4 text-cyan-400" />
                                    <span>Move mouse to tilt</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-400">
                                    <Layers className="w-4 h-4 text-cyan-400" />
                                    <span>Parallax depth effect</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-400">
                                    <Sparkles className="w-4 h-4 text-cyan-400" />
                                    <span>Holographic glare</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 3D Stage */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="w-full md:w-2/3 flex justify-center perspective-1000"
                        style={{ perspective: "1000px" }}
                    >
                        {image ? (
                            <motion.div
                                style={{
                                    rotateX,
                                    rotateY,
                                    transformStyle: "preserve-3d"
                                }}
                                onMouseMove={handleMouseMove}
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={handleMouseLeave}
                                className="relative w-full max-w-md aspect-[3/4] rounded-2xl cursor-crosshair group"
                            >
                                {/* Base Shadow */}
                                <div className="absolute inset-4 bg-cyan-500/20 blur-3xl -z-10 transform translate-y-10 opacity-50 transition-opacity group-hover:opacity-100"></div>

                                {/* Main Card Container */}
                                <div className="absolute inset-0 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl transform-style-3d">

                                    {/* Background Layer (Furthest) */}
                                    <motion.div
                                        style={{ x: layer1X, y: layer1Y }}
                                        className="absolute inset-[-20px] bg-cover bg-center opacity-50 blur-sm scale-110"
                                        initial={false}
                                    >
                                        <img src={image} alt="Background" className="w-full h-full object-cover" />
                                    </motion.div>

                                    {/* Middle Layer (Main Image) */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <img src={image} alt="Main" className="w-full h-full object-cover" />
                                    </div>

                                    {/* Foreground Layer (Floating Particles/Overlay) */}
                                    <motion.div
                                        style={{ x: layer2X, y: layer2Y }}
                                        className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 mix-blend-overlay pointer-events-none"
                                    />

                                    {/* Glare Effect */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"
                                        style={{
                                            background: `linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.2) 25%, transparent 30%)`,
                                            backgroundPosition: glareBackgroundPosition,
                                            backgroundSize: "200% 200%",
                                            mixBlendMode: "overlay"
                                        }}
                                    />

                                    {/* Border Glow */}
                                    <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/30 transition-colors"></div>
                                </div>

                            </motion.div>
                        ) : (
                            <div className="w-full max-w-md aspect-[3/4] rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500">
                                <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                                <p>Upload an image to start</p>
                            </div>
                        )}
                    </motion.div>

                </div>
            </div>
        </>
    );
};
