import React from 'react';
import { Zap, Eye, Lock } from 'lucide-react';
import { FloatingCard } from './FloatingCard';

const FeatureBlock: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  desc: string; 
  delay: number 
}> = ({ icon, title, desc, delay }) => (
  <FloatingCard className="h-full" delay={delay}>
    <div className="h-full rounded-2xl bg-white p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-sm">{desc}</p>
    </div>
  </FloatingCard>
);

export const Features: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto px-4">
      <FeatureBlock 
        icon={<Zap className="h-6 w-6" />}
        title="Real-Time Analysis"
        desc="Powered by Gemini Flash 2.5, our pipeline processes audio and visual data frames in seconds."
        delay={1}
      />
      <FeatureBlock 
        icon={<Eye className="h-6 w-6" />}
        title="Multimodal Detection"
        desc="Detects anomalies across both audio spectrographs and visual pixel data simultaneously."
        delay={2.5}
      />
      <FeatureBlock 
        icon={<Lock className="h-6 w-6" />}
        title="Privacy First"
        desc="Your media is analyzed in a secure, ephemeral session. We do not store your uploads."
        delay={0.5}
      />
    </div>
  );
};
