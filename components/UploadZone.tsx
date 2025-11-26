import React, { useState, useRef } from 'react';
import { Upload, FileVideo, FileAudio, Loader2 } from 'lucide-react';
import { FloatingCard } from './FloatingCard';
import { AnalysisStatus } from '../types';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  status: AnalysisStatus;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, status }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcess(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    if (status !== AnalysisStatus.ANALYZING) {
        inputRef.current?.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcess(e.target.files[0]);
    }
  };

  const validateAndProcess = (file: File) => {
    const validTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'audio/mpeg', 'audio/wav', 'audio/mp3'];
    const maxSize = 20 * 1024 * 1024; // 20MB limit for inline data transfer

    if (!validTypes.includes(file.type)) {
      alert("Please upload a supported video or audio format (MP4, MOV, WebM, MP3, WAV).");
      return;
    }

    if (file.size > maxSize) {
      alert("File is too large. For this demo, please upload files smaller than 20MB.");
      return;
    }

    onFileSelect(file);
  };

  const isAnalyzing = status === AnalysisStatus.ANALYZING;

  return (
    <FloatingCard className="w-full max-w-2xl cursor-pointer" delay={0}>
      <div 
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative overflow-hidden rounded-3xl border-2 border-dashed bg-white p-12 text-center transition-all duration-300
          ${isDragging ? 'border-indigo-500 bg-indigo-50 shadow-xl' : 'border-gray-200 shadow-lg'}
          ${isAnalyzing ? 'pointer-events-none opacity-80' : 'hover:border-indigo-300'}
        `}
      >
        <input 
          type="file" 
          ref={inputRef} 
          onChange={handleInputChange} 
          className="hidden" 
          accept="video/*,audio/*"
        />

        <div className="flex flex-col items-center justify-center space-y-6">
            {isAnalyzing ? (
                 <div className="flex flex-col items-center animate-pulse">
                    <div className="rounded-full bg-indigo-100 p-6 mb-4">
                        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800">Analyzing Media...</h3>
                    <p className="text-gray-500">Scanning for deep learning artifacts</p>
                 </div>
            ) : (
                <>
                    <div className={`rounded-full p-6 transition-colors ${isDragging ? 'bg-indigo-200' : 'bg-gray-50'}`}>
                        <Upload className={`h-12 w-12 ${isDragging ? 'text-indigo-700' : 'text-gray-400'}`} />
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-gray-800">
                        {isDragging ? 'Drop it like it\'s hot' : 'Drop Video/Audio Here'}
                        </h3>
                        <p className="text-gray-500">
                        or <span className="text-indigo-600 font-medium underline decoration-2 underline-offset-2">click to upload</span>
                        </p>
                    </div>

                    <div className="flex items-center space-x-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        <span className="flex items-center"><FileVideo className="mr-1 h-3 w-3" /> MP4, MOV, WEBM</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="flex items-center"><FileAudio className="mr-1 h-3 w-3" /> MP3, WAV</span>
                    </div>
                </>
            )}
        </div>
      </div>
    </FloatingCard>
  );
};