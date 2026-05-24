'use client';

import React from 'react';

interface StatCounterProps {
  value: string | number;
  label: string;
  variant?: 'default' | 'accent' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export const StatCounter: React.FC<StatCounterProps> = ({
  value,
  label,
  variant = 'default',
  size = 'md',
}) => {
  const variantStyles = {
    default: 'bg-white border-black text-black',
    accent: 'bg-yellow-400 border-black text-black',
    dark: 'bg-black border-black text-white',
  };

  const sizeStyles = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

  return (
    <div className={`border-3 ${variantStyles[variant]} ${sizeStyles[size]}`}>
      <div className="text-center">
        <p className="text-2xl md:text-4xl font-bold font-bold uppercase tracking-tighter mb-1">
          {value}
        </p>
        <p className="text-xs md:text-sm font-mono font-bold uppercase opacity-75">
          {label}
        </p>
      </div>
    </div>
  );
};

export default StatCounter;