import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Play, Pause, Volume2, Settings, StopCircle, Sparkles, AudioLines } from 'lucide-react';
import { BackgroundParticles } from '../../components/BackgroundParticles';
import { AnalysisStatus } from '../../types';

export const TextToSpeech: React.FC = () => {
    const [text, setText] = useState('');
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    const [volume, setVolume] = useState(1);
    const [showSettings, setShowSettings] = useState(false);

    const synth = window.speechSynthesis;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | undefined>(undefined);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    // Load voices
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = synth.getVoices();
            setVoices(availableVoices);
            if (availableVoices.length > 0 && !selectedVoice) {
                // Prefer English voices
                const defaultVoice = availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
                setSelectedVoice(defaultVoice);
            }
        };

        loadVoices();
        if (synth.onvoiceschanged !== undefined) {
            synth.onvoiceschanged = loadVoices;
        }
    }, []);

    // Visualizer Setup (Simulated for TTS as we can't easily get stream from SpeechSynthesis)
    // We'll create a visualizer that reacts to the "isPlaying" state with random data
    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const draw = () => {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (!isPlaying) {
                // Draw flat line
                ctx.beginPath();
                ctx.moveTo(0, canvas.height / 2);
                ctx.lineTo(canvas.width, canvas.height / 2);
                ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)'; // Violet
                ctx.lineWidth = 2;
                ctx.stroke();
                animationRef.current = requestAnimationFrame(draw);
                return;
            }

            // Draw frequency bars
            const bars = 50;
            const barWidth = canvas.width / bars;

            for (let i = 0; i < bars; i++) {
                const height = Math.random() * canvas.height * 0.8;
                const x = i * barWidth;
                const y = (canvas.height - height) / 2;

                const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                gradient.addColorStop(0, '#8b5cf6'); // Violet-500
                gradient.addColorStop(1, '#ec4899'); // Pink-500

                ctx.fillStyle = gradient;
                ctx.fillRect(x, y, barWidth - 2, height);
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying]);

    const handlePlay = () => {
        if (synth.paused) {
            synth.resume();
            setIsPlaying(true);
            return;
        }

        if (synth.speaking) {
            synth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        utterance.onend = () => setIsPlaying(false);
        utterance.onstart = () => setIsPlaying(true);
        utterance.onerror = () => setIsPlaying(false);

        synth.speak(utterance);
    };

    const handlePause = () => {
        synth.pause();
        setIsPlaying(false);
    };

    const handleStop = () => {
        synth.cancel();
        setIsPlaying(false);
    };

    return (
        <>
            {/* Custom Background - Violet/Soundwave Theme */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-slate-950 to-black"></div>
                <BackgroundParticles status={AnalysisStatus.IDLE} />
            </div>

            <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium backdrop-blur-sm">
                        <Volume2 className="w-4 h-4" />
                        <span>Neural Voice Engine</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white font-display">
                        Text to <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-purple-400 animate-gradient-x">Speech</span>
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Transform written text into lifelike spoken audio with customizable voices.
                    </p>
                </motion.div>

                <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Input Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl opacity-0 group-hover:opacity-30 transition duration-500 blur"></div>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Type something to speak..."
                                className="w-full h-64 bg-black/40 border border-white/10 rounded-2xl p-6 text-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50 transition-colors resize-none glass-panel leading-relaxed"
                            />
                        </div>

                        {/* Visualizer */}
                        <div className="h-32 bg-black/40 rounded-2xl border border-white/10 overflow-hidden relative backdrop-blur-sm">
                            <canvas
                                ref={canvasRef}
                                width={800}
                                height={128}
                                className="w-full h-full opacity-80"
                            />
                            {!isPlaying && !text && (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-600 gap-2">
                                    <AudioLines className="w-5 h-5" />
                                    <span className="text-sm font-medium">Audio Visualizer</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Controls Sidebar */}
                    <div className="space-y-6">
                        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Voice</label>
                                <select
                                    value={selectedVoice?.name || ''}
                                    onChange={(e) => {
                                        const voice = voices.find(v => v.name === e.target.value);
                                        if (voice) setSelectedVoice(voice);
                                    }}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors"
                                >
                                    {voices.map((voice) => (
                                        <option key={voice.name} value={voice.name}>
                                            {voice.name} ({voice.lang})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Advanced Controls Toggle */}
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                            >
                                <Settings className="w-4 h-4" />
                                {showSettings ? 'Hide Settings' : 'Show Settings'}
                            </button>

                            <AnimatePresence>
                                {showSettings && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="space-y-4 overflow-hidden"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs text-slate-400">
                                                <span>Speed</span>
                                                <span>{rate}x</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0.5"
                                                max="2"
                                                step="0.1"
                                                value={rate}
                                                onChange={(e) => setRate(Number(e.target.value))}
                                                className="w-full accent-violet-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs text-slate-400">
                                                <span>Pitch</span>
                                                <span>{pitch}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0.5"
                                                max="2"
                                                step="0.1"
                                                value={pitch}
                                                onChange={(e) => setPitch(Number(e.target.value))}
                                                className="w-full accent-violet-500"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="pt-4 flex gap-2">
                                {isPlaying ? (
                                    <button
                                        onClick={handlePause}
                                        className="flex-1 py-3 bg-amber-500/20 text-amber-400 border border-amber-500/50 rounded-xl font-bold hover:bg-amber-500/30 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Pause className="w-5 h-5" />
                                        Pause
                                    </button>
                                ) : (
                                    <button
                                        onClick={handlePlay}
                                        disabled={!text}
                                        className="flex-1 py-3 bg-white text-black rounded-xl font-bold hover:bg-violet-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-violet-500/20"
                                    >
                                        <Play className="w-5 h-5 fill-current" />
                                        Speak
                                    </button>
                                )}
                                <button
                                    onClick={handleStop}
                                    disabled={!isPlaying && !synth.speaking}
                                    className="p-3 bg-white/5 text-white border border-white/10 rounded-xl hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-all disabled:opacity-50"
                                >
                                    <StopCircle className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
