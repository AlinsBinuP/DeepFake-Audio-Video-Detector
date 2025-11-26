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

      // Dynamic background color based on status
      let gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width);

      if (status === AnalysisStatus.ANALYZING) {
        gradient.addColorStop(0, '#1e1b4b'); // Indigo 950
        gradient.addColorStop(1, '#020617'); // Slate 950
      } else if (status === AnalysisStatus.COMPLETE && verdict === 'REAL') {
        gradient.addColorStop(0, '#064e3b'); // Emerald 900
        gradient.addColorStop(1, '#020617');
      } else if (status === AnalysisStatus.COMPLETE && verdict === 'DEEPFAKE DETECTED') {
        gradient.addColorStop(0, '#881337'); // Rose 900
        gradient.addColorStop(1, '#020617');
      } else {
        gradient.addColorStop(0, '#0f172a'); // Slate 900
        gradient.addColorStop(1, '#020617');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
  }, [status, verdict]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
};