import React, { useCallback, useState } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { UploadCloud, FileVideo, FileAudio, Loader2, Scan, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisStatus } from '../types';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  status: AnalysisStatus;
  accept?: Accept;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFileSelect,
  status,
  accept = {
    'video/*': [],
    'audio/*': []
  },
  title = "Upload Video or Audio",
  subtitle = "Supports MP4, MOV, MP3, WAV",
  icon
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    disabled: status === AnalysisStatus.ANALYZING
  });

  return (
    <div className="w-full relative group/zone">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-[2rem] opacity-20 group-hover/zone:opacity-75 blur transition duration-1000 group-hover/zone:duration-200"></div>
      <div
        {...getRootProps()}
        className={`
          relative cursor-pointer
          rounded-[1.9rem] border-2 border-dashed transition-all duration-500 ease-out
          ${isDragActive ? 'border-indigo-400 bg-slate-900/80 scale-[1.01]' : 'border-slate-700/50 hover:border-indigo-500/50 bg-slate-900/60 hover:bg-slate-900/80'}
          ${status === AnalysisStatus.ANALYZING ? 'opacity-50 pointer-events-none border-transparent' : ''}
          h-80 flex flex-col items-center justify-center overflow-hidden backdrop-blur-xl
        `}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <input {...getInputProps()} />

        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
        </div>

        <AnimatePresence mode="wait">
          {status === AnalysisStatus.ANALYZING ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-6 z-10"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse"></div>
                <Loader2 className="w-16 h-16 text-indigo-400 animate-spin relative z-10" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-display font-semibold text-white tracking-wide">Analyzing Media</h3>
                <p className="text-slate-400 font-light">Running advanced forensic models...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-6 z-10 p-8 text-center"
            >
              <div className="relative group-hover:scale-110 transition-transform duration-500">
                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-full"></div>
                <div className="w-24 h-24 bg-slate-800/40 rounded-3xl flex items-center justify-center border border-slate-700/50 group-hover:border-indigo-500/50 transition-colors shadow-2xl shadow-black/50">
                  {isDragActive ? (
                    <Scan className="w-10 h-10 text-indigo-400 animate-pulse" />
                  ) : (
                    icon || (
                      <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                    )
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-3xl font-bold text-white font-display tracking-tight">
                  {isDragActive ? "Drop to Analyze" : title}
                </h3>
                <p className="text-slate-400 max-w-xs mx-auto font-light leading-relaxed">
                  Drag & drop your file here, or click to browse.
                  <br />
                  <span className="text-xs text-slate-500 mt-3 block font-mono tracking-wider uppercase opacity-70">{subtitle}</span>
                </p>
              </div>

              {/* Only show default icons if using default accept types */}
              {!icon && (
                <div className="flex gap-3 mt-2">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/30 border border-slate-700/50 text-xs font-medium text-slate-400 backdrop-blur-sm">
                    <FileVideo className="w-3.5 h-3.5" /> Video
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/30 border border-slate-700/50 text-xs font-medium text-slate-400 backdrop-blur-sm">
                    <FileAudio className="w-3.5 h-3.5" /> Audio
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};