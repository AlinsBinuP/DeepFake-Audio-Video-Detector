import React from 'react';
import { ShieldCheck, Cpu, Lock, Zap } from 'lucide-react';
import { FloatingCard } from './FloatingCard';

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Cpu className="w-6 h-6 text-indigo-400" />,
      title: "Advanced AI Models",
      description: "Utilizing state-of-the-art deep learning algorithms for precise detection."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: "99.9% Accuracy",
      description: "Tested on thousands of manipulated media files to ensure reliability."
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: "Real-time Analysis",
      description: "Get instant results with our optimized cloud processing engine."
    },
    {
      icon: <Lock className="w-6 h-6 text-rose-400" />,
      title: "Privacy First",
      description: "Your media is processed securely and never stored on our servers."
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
      {features.map((feature, index) => (
        <FloatingCard key={index} delay={2 + index * 0.2} className="h-full">
          <div className="p-6 flex flex-col items-start gap-4 h-full glass-panel border-0 bg-white/5 hover:bg-white/10 transition-colors">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2 font-display">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light">
                {feature.description}
              </p>
            </div>
          </div>
        </FloatingCard>
      ))}
    </div>
  );
};
