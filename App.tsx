import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Landing } from './src/pages/Landing.tsx';
import { Detector } from './src/pages/Detector.tsx';
import { FloatingCard } from './components/FloatingCard';
import { Github, Menu, X } from 'lucide-react';
import { ImageGenerator } from './src/pages/ImageGenerator.tsx';
import { ImageToEssay } from './src/pages/ImageToEssay.tsx';
import { LiveDetector } from './src/pages/LiveDetector.tsx';
import { DocumentSummarizer } from './src/pages/DocumentSummarizer.tsx';
import { ThreeDMotion } from './src/pages/ThreeDMotion.tsx';
import { ImageUpscaler } from './src/pages/ImageUpscaler.tsx';
import { BackgroundRemover } from './src/pages/BackgroundRemover.tsx';
import { MagicEraser } from './src/pages/MagicEraser.tsx';
import { YouTubeSummarizer } from './src/pages/YouTubeSummarizer.tsx';
import { TextToSpeech } from './src/pages/TextToSpeech.tsx';
import { ImageToPdf } from './src/pages/ImageToPdf.tsx';


const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    { path: '/image-generator', label: 'Image Gen', color: 'hover:bg-purple-500/10 hover:text-purple-400', activeColor: 'bg-purple-500/10 text-purple-400 shadow-lg shadow-purple-500/5' },
    { path: '/3d-motion', label: '3D Motion', color: 'hover:bg-cyan-500/10 hover:text-cyan-400', activeColor: 'bg-cyan-500/10 text-cyan-400 shadow-lg shadow-cyan-500/5' },
    { path: '/upscaler', label: 'Upscaler', color: 'hover:bg-emerald-500/10 hover:text-emerald-400', activeColor: 'bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/5' },
    { path: '/remove-bg', label: 'Remove BG', color: 'hover:bg-rose-500/10 hover:text-rose-400', activeColor: 'bg-rose-500/10 text-rose-400 shadow-lg shadow-rose-500/5' },
    { path: '/magic-eraser', label: 'Magic Eraser', color: 'hover:bg-amber-500/10 hover:text-amber-400', activeColor: 'bg-amber-500/10 text-amber-400 shadow-lg shadow-amber-500/5' },
    { path: '/youtube-summarizer', label: 'YouTube Notes', color: 'hover:bg-red-500/10 hover:text-red-400', activeColor: 'bg-red-500/10 text-red-400 shadow-lg shadow-red-500/5' },
    { path: '/text-to-speech', label: 'TTS', color: 'hover:bg-violet-500/10 hover:text-violet-400', activeColor: 'bg-violet-500/10 text-violet-400 shadow-lg shadow-violet-500/5' },
    { path: '/image-to-essay', label: 'Essay Writer', color: 'hover:bg-yellow-500/10 hover:text-yellow-400', activeColor: 'bg-yellow-500/10 text-yellow-400 shadow-lg shadow-yellow-500/5' },
    { path: '/image-to-pdf', label: 'PDF Tools', color: 'hover:bg-orange-500/10 hover:text-orange-400', activeColor: 'bg-orange-500/10 text-orange-400 shadow-lg shadow-orange-500/5' },
    { path: '/detector', label: 'Detector', color: 'hover:bg-indigo-500/10 hover:text-indigo-400', activeColor: 'bg-indigo-500/10 text-indigo-400 shadow-lg shadow-indigo-500/5' },
    // { path: '/live-detector', label: 'Live Guard', color: 'hover:bg-green-500/10 hover:text-green-400', activeColor: 'bg-green-500/10 text-green-400 shadow-lg shadow-green-500/5' },
    { path: '/summarizer', label: 'Summarizer', color: 'hover:bg-teal-500/10 hover:text-teal-400', activeColor: 'bg-teal-500/10 text-teal-400 shadow-lg shadow-teal-500/5' },
  ];

  return (
    <header className="z-50 w-full fixed top-0 left-0 right-0 pointer-events-none">
      <div className="w-full max-w-7xl mx-auto px-4 pt-3 pb-2 flex flex-col gap-3 pointer-events-auto">
        <div className="flex items-center justify-between xl:justify-center relative">
          <FloatingCard delay={0} className="border-none bg-transparent shadow-none backdrop-blur-none flex-shrink-0">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/logo_final.jpg" alt="Prism Studio Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow duration-300 animate-glow" />
              <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-white animate-text-glow">Prism<span className="text-primary"> Studio</span></span>
            </Link>
          </FloatingCard>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors backdrop-blur-md"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden xl:flex justify-center">
          <FloatingCard delay={0.1} className="glass-panel rounded-2xl px-3 py-2 bg-black/40 backdrop-blur-xl border border-white/10">
            <nav className="flex items-center gap-1 flex-wrap justify-center">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${isActive(item.path)
                    ? item.activeColor
                    : `text-slate-400 ${item.color} hover:bg-white/5`
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </FloatingCard>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="xl:hidden absolute top-full left-0 right-0 px-4 pt-2">
            <FloatingCard delay={0} className="w-full glass-panel rounded-2xl p-4 bg-black/60 backdrop-blur-xl border border-white/10 max-h-[80vh] overflow-y-auto">
              <nav className="grid grid-cols-2 gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center text-center ${isActive(item.path)
                      ? item.activeColor
                      : `text-slate-400 ${item.color} bg-white/5 hover:bg-white/10`
                      }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </FloatingCard>
          </div>
        )}
      </div>
    </header>
  );
};


const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen relative flex flex-col overflow-hidden selection:bg-primary/30 bg-slate-950">

        <Navigation />

        <div className="flex-1 pt-24">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/detector" element={<Detector />} />
            <Route path="/image-generator" element={<ImageGenerator />} />
            <Route path="/3d-motion" element={<ThreeDMotion />} />
            <Route path="/upscaler" element={<ImageUpscaler />} />
            <Route path="/remove-bg" element={<BackgroundRemover />} />
            <Route path="/magic-eraser" element={<MagicEraser />} />
            <Route path="/youtube-summarizer" element={<YouTubeSummarizer />} />
            <Route path="/text-to-speech" element={<TextToSpeech />} />
            <Route path="/image-to-essay" element={<ImageToEssay />} />
            <Route path="/image-to-pdf" element={<ImageToPdf />} />
            {/* <Route path="/live-detector" element={<LiveDetector />} /> */}
            <Route path="/summarizer" element={<DocumentSummarizer />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="z-10 w-full p-8 mt-12 text-center text-slate-500 text-sm border-t border-white/5 bg-black/20 backdrop-blur-xl">
          <div className="flex flex-col items-center gap-4">
            <p>&copy; {new Date().getFullYear()} Prism Studio. By Alins Binu.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            </div>
          </div>
        </footer>

      </div>
    </Router>
  );
};

export default App;
