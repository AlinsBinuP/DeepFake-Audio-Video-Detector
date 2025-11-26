import React, { useEffect, useRef } from 'react';
import { AnalysisStatus } from '../types';

interface BackgroundParticlesProps {
  status: AnalysisStatus;
  verdict?: 'REAL' | 'DEEPFAKE DETECTED' | 'UNCERTAIN';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseX: number; // For returning to flow
  baseY: number;
}

export const BackgroundParticles: React.FC<BackgroundParticlesProps> = ({ status, verdict }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number | null>(null);
  
  // We use a ref to track props inside the animation loop to avoid restarting the loop on every render
  const propsRef = useRef({ status, verdict });

  useEffect(() => {
    propsRef.current = { status, verdict };
  }, [status, verdict]);

  // Configuration map based on state
  const getConfig = () => {
    const { status, verdict } = propsRef.current;
    
    switch (status) {
      case AnalysisStatus.ANALYZING:
        // High energy, computing look
        return { 
          r: 99, g: 102, b: 241, // Indigo-500
          speedMult: 3.5, 
          connectionDist: 180, 
          jitter: 0 
        };
      case AnalysisStatus.COMPLETE:
        if (verdict === 'REAL') {
          // Calm, harmonious Green
          return { 
            r: 16, g: 185, b: 129, // Emerald-500
            speedMult: 0.6, 
            connectionDist: 140, 
            jitter: 0 
          };
        }
        if (verdict === 'DEEPFAKE DETECTED') {
          // Warning Red, chaotic
          return { 
            r: 239, g: 68, b: 68, // Red-500
            speedMult: 2.0, 
            connectionDist: 140, 
            jitter: 2.5 
          };
        }
        // Uncertain / Amber
        return { 
          r: 245, g: 158, b: 11, 
          speedMult: 1, 
          connectionDist: 140, 
          jitter: 0 
        };
      case AnalysisStatus.ERROR:
         return { r: 156, g: 163, b: 175, speedMult: 0.1, connectionDist: 100, jitter: 0 };
      case AnalysisStatus.IDLE:
      default:
        // Default calm state
        return { 
          r: 99, g: 102, b: 241, 
          speedMult: 0.8, 
          connectionDist: 140, 
          jitter: 0 
        };
    }
  };

  const initParticles = (width: number, height: number) => {
    // Density calculation: fewer particles on mobile for performance
    const area = width * height;
    const particleCount = Math.min(Math.floor(area / 12000), 80); 
    
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: 0, 
        baseY: 0,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      });
    }
    particlesRef.current = particles;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    let frame = 0;

    const animate = () => {
      frame++;
      const config = getConfig();
      
      // Clear with very slight fade for trail effect if desired, but clearRect is cleaner for this style
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      
      // Draw Connections first (behind particles)
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        // Basic movement update
        p1.x += p1.vx * config.speedMult;
        p1.y += p1.vy * config.speedMult;

        // Screen wrapping
        if (p1.x < 0) p1.x = canvas.width;
        if (p1.x > canvas.width) p1.x = 0;
        if (p1.y < 0) p1.y = canvas.height;
        if (p1.y > canvas.height) p1.y = 0;

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < config.connectionDist) {
            // Opacity based on distance
            const opacity = 0.15 * (1 - dist / config.connectionDist);
            
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${config.r}, ${config.g}, ${config.b}, ${opacity})`;
            
            // Apply jitter if needed (for Deepfake alert)
            let jx1 = 0, jy1 = 0, jx2 = 0, jy2 = 0;
            if (config.jitter > 0) {
                 jx1 = (Math.random() - 0.5) * config.jitter;
                 jy1 = (Math.random() - 0.5) * config.jitter;
                 jx2 = (Math.random() - 0.5) * config.jitter;
                 jy2 = (Math.random() - 0.5) * config.jitter;
            }

            ctx.moveTo(p1.x + jx1, p1.y + jy1);
            ctx.lineTo(p2.x + jx2, p2.y + jy2);
            ctx.stroke();
          }
        }
      }

      // Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        let drawX = p.x;
        let drawY = p.y;
        
        if (config.jitter > 0) {
            drawX += (Math.random() - 0.5) * config.jitter * 2;
            drawY += (Math.random() - 0.5) * config.jitter * 2;
        }

        ctx.beginPath();
        ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${config.r}, ${config.g}, ${config.b}, 0.5)`;
        ctx.fill();
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none transition-colors duration-1000"
      style={{ opacity: 0.6 }} // Subtle global opacity
    />
  );
};