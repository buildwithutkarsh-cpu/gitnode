'use client';

import React from 'react';
import { BrutalistButtonProps } from '@/types';

export const BrutalistButton: React.FC<
  BrutalistButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({
  label,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const baseStyles =
    'border-3 border-black font-bold uppercase transition-brutal cursor-pointer font-mono tracking-widest';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantStyles = {
    primary: `
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'bg-black text-white hover:bg-yellow-400 hover:text-black hover:border-black'}
    `,
    secondary: `
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'bg-white text-black border-black hover:bg-black hover:text-white'}
    `,
    danger: `
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-white hover:text-red-600 border-red-600 hover:border-red-600'}
    `,
  };

  const brutalistClass = `
    brutal-border
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${className}
  `;

  return (
    <button
      className={brutalistClass}
      disabled={disabled}
      {...props}
    >
      {children || label}
    </button>
  );
};

export default BrutalistButton;