import React, { useMemo } from 'react';

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Optional manual delay override
  intensity?: 'low' | 'medium' | 'high';
}

export const FloatingCard: React.FC<FloatingCardProps> = ({ 
  children, 
  className = '', 
  delay,
  intensity = 'medium'
}) => {
  // Generate random animation parameters to make the floating feel organic
  const animationStyle = useMemo(() => {
    const randomDuration = 5 + Math.random() * 4; // Between 5s and 9s
    const randomDelay = delay !== undefined ? delay : Math.random() * -5; // Start at different offsets
    
    return {
      animationDuration: `${randomDuration}s`,
      animationDelay: `${randomDelay}s`,
    };
  }, [delay]);

  return (
    <div 
      className={`floating transition-all duration-500 ease-in-out hover:shadow-2xl hover:scale-[1.02] ${className}`}
      style={animationStyle}
    >
      {children}
    </div>
  );
};
