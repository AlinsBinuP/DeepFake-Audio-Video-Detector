import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Github, Linkedin, Mail, ArrowRight, Code, Cpu, Globe, Instagram, Twitter, Youtube, Sparkles, Zap, Lock, FileText, Layers, Eraser, Volume2, BookOpen, Box, Pen, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BackgroundParticles } from '../../components/BackgroundParticles';
import { AnalysisStatus } from '../../types';

export const Landing: React.FC = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <>
            <BackgroundParticles status={AnalysisStatus.IDLE} />

            <main className="z-10 flex-1 w-full flex flex-col items-center justify-center p-4 sm:p-8 max-w-7xl mx-auto pt-24 overflow-x-hidden">

                {/* Hero Section */}
                <motion.section
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center space-y-8 mb-16 sm:mb-32 max-w-5xl mx-auto relative"
                >
                    {/* Decorative Elements */}
                    <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse will-change-[opacity,transform]"></div>
                    <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-1000 will-change-[opacity,transform]"></div>

                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-medium backdrop-blur-md hover:bg-white/10 transition-colors cursor-default">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Your Complete AI Toolkit</span>
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-5xl sm:text-8xl font-bold text-white tracking-tight leading-[1.1] font-display drop-shadow-2xl">
                        Prism<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x"> Studio</span>
                    </motion.h1>

                    <motion.div variants={itemVariants} className="relative max-w-4xl mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl rounded-full"></div>
                        <div className="relative p-6 sm:p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm">
                            <motion.p className="text-xl sm:text-2xl text-slate-300 font-light leading-relaxed tracking-wide">
                                Your all-in-one <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">AI powerhouse</span>.
                                Generate images, enhance photos, analyze content, and <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">transform your workflow</span>.
                                <br className="hidden sm:block mt-4" />
                                <span className="block mt-2 text-lg sm:text-xl text-slate-400">From creation to analysis—everything you need in one place.</span>
                            </motion.p>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6 pt-4">
                        <Link to="/magic-eraser" className="group relative px-8 py-4 rounded-full bg-white text-black font-bold text-lg overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all hover:scale-105 active:scale-95">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                            <span className="relative flex items-center gap-2">
                                Launch Magic Eraser
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                        <Link to="/image-generator" className="group relative px-8 py-4 rounded-full bg-white text-black font-bold text-lg overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all hover:scale-105 active:scale-95">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                            <span className="relative flex items-center gap-2">
                                Generate Images
                                <Cpu className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            </span>
                        </Link>
                        <a href="#developer" className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all hover:scale-105 active:scale-95 backdrop-blur-sm">
                            Meet the Creator
                        </a>
                    </motion.div>

                    {/* Stats / Trust Indicators */}
                    <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-white/5 mt-12">
                        {[
                            { label: "AI Tools", value: "12+", icon: Zap },
                            { label: "Processing", value: "< 3s", icon: Sparkles },
                            { label: "Privacy", value: "100%", icon: Lock },
                            { label: "Models", value: "Multi-Modal", icon: Cpu },
                        ].map((stat, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                                <stat.icon className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                                <div className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </motion.section>

                {/* Features Grid */}
                <motion.section
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-32"
                >
                    {[
                        { title: "Deepfake Detector", desc: "Forensic analysis of video & audio artifacts.", icon: Shield, link: "/detector", color: "from-indigo-500 to-blue-500" },
                        { title: "Doc Summarizer", desc: "Instant summaries for any document.", icon: FileText, link: "/summarizer", color: "from-cyan-500 to-teal-500" },
                        { title: "Image Generator", desc: "Create stunning AI art instantly.", icon: Cpu, link: "/image-generator", color: "from-purple-500 to-pink-500" },
                        { title: "Image Upscaler", desc: "Enhance images with AI-powered 2x upscaling.", icon: Zap, link: "/upscaler", color: "from-emerald-500 to-teal-500" },
                        { title: "Magic Eraser", desc: "Blur unwanted objects from photos instantly.", icon: Eraser, link: "/magic-eraser", color: "from-slate-400 to-gray-400" },
                        { title: "YouTube Notes", desc: "Generate study notes from educational videos.", icon: BookOpen, link: "/youtube-summarizer", color: "from-blue-500 to-indigo-500" },
                        { title: "Essay Writer", desc: "Transform images into academic essays with AI.", icon: Pen, link: "/image-to-essay", color: "from-pink-500 to-orange-500" },
                        { title: "Text to Speech", desc: "Convert text to lifelike spoken audio.", icon: Volume2, link: "/text-to-speech", color: "from-violet-500 to-fuchsia-500" }
                    ].map((feature, i) => (
                        <Link key={i} to={feature.link} className="group relative">
                            <motion.div
                                variants={itemVariants}
                                className="h-full p-8 rounded-[2rem] bg-black/40 border border-white/10 backdrop-blur-md overflow-hidden relative transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group-hover:border-white/20"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                            </motion.div>
                        </Link>
                    ))}
                </motion.section>

                {/* Developer Section */}
                <motion.section
                    id="developer"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="w-full max-w-5xl mb-24"
                >
                    <div className="relative rounded-[3rem] bg-gradient-to-br from-slate-900 to-black border border-white/10 p-8 sm:p-12 overflow-hidden group">
                        {/* Animated Background */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full group-hover:bg-indigo-600/30 transition-colors duration-700 will-change-[background-color]"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full group-hover:bg-purple-600/30 transition-colors duration-700 will-change-[background-color]"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                            {/* Profile Image with Glow */}
                            <div className="relative shrink-0 group-hover:scale-105 transition-transform duration-500">
                                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 animate-pulse"></div>
                                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full p-1 bg-black relative overflow-hidden">
                                    <img
                                        src="/developer.jpg"
                                        alt="Alins Binu"
                                        className="w-full h-full rounded-full object-cover border-4 border-black"
                                    />
                                </div>
                            </div>

                            <div className="text-center md:text-left space-y-6 flex-1">
                                <div>
                                    <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold tracking-wider mb-2 border border-indigo-500/30">
                                        LEAD DEVELOPER
                                    </div>
                                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-2 font-display">Alins Binu</h2>
                                    <p className="text-slate-400 text-lg">Crafting the future of AI-powered productivity.</p>
                                </div>

                                <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                                    {[
                                        { icon: Github, href: "https://github.com/AlinsBinuP", label: "GitHub", color: "hover:bg-slate-800" },
                                        { icon: Linkedin, href: "https://www.linkedin.com/in/alins-binu-4351b6292/", label: "LinkedIn", color: "hover:bg-blue-900/50" },
                                        { icon: Instagram, href: "https://www.instagram.com/alinsbinu/", label: "Instagram", color: "hover:bg-pink-900/50" },
                                        { icon: Facebook, href: "https://www.facebook.com/alinsbinu.palamoottil/", label: "Facebook", color: "hover:bg-blue-800/50" },
                                        { icon: Twitter, href: "https://x.com/generaladdictz", label: "X / Twitter", color: "hover:bg-slate-800" },
                                        { icon: Youtube, href: "https://www.youtube.com/@futlotest", label: "YouTube", color: "hover:bg-red-900/50" },
                                        { icon: Mail, href: "https://mail.google.com/mail/?view=cm&fs=1&to=alinsbinukochuthovala@gmail.com", label: "Email", color: "hover:bg-emerald-900/50" },
                                    ].map((social, i) => (
                                        <a
                                            key={i}
                                            href={social.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={`p-4 rounded-2xl bg-white/5 border border-white/10 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${social.color} group/icon`}
                                            aria-label={social.label}
                                        >
                                            <social.icon className="w-6 h-6 group-hover/icon:scale-110 transition-transform" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

            </main>
        </>
    );
};
