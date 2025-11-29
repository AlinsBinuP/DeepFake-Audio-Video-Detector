import React, { useEffect, useRef } from 'react';
import { AnalysisStatus } from '../types';

interface BackgroundParticlesProps {
  status: AnalysisStatus;
  verdict?: 'REAL' | 'DEEPFAKE DETECTED' | 'UNCERTAIN';
}

export const BackgroundParticles: React.FC<BackgroundParticlesProps> = ({ status, verdict }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0) this.x = canvas!.width;
        if (this.x > canvas!.width) this.x = 0;
        if (this.y < 0) this.y = canvas!.height;
        if (this.y > canvas!.height) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const getBackgroundGradient = () => {
    const centerColor = (() => {
      if (status === AnalysisStatus.ANALYZING) return '#1e1b4b'; // Indigo 950
      if (status === AnalysisStatus.COMPLETE) {
        if (verdict === 'REAL') return '#064e3b'; // Emerald 900
        if (verdict === 'DEEPFAKE DETECTED') return '#881337'; // Rose 900
      }
      return '#0f172a'; // Slate 900
    })();

    return `radial-gradient(circle at center, ${centerColor} 0%, #020617 100%)`;
  };

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none transition-[background] duration-1000 ease-in-out"
      style={{ background: getBackgroundGradient() }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};