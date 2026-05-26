// components/ui/BrutalistButton.tsx

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface BrutalistButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const VARIANT_STYLES = {
  primary:
    "bg-[#FFFF00] text-black border-black hover:bg-black hover:text-[#FFFF00]",
  danger: "bg-white text-red-600 border-red-600 hover:bg-red-600 hover:text-white",
  ghost: "bg-white text-black border-black hover:bg-[#FFFF00]",
};

const SIZE_STYLES = {
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-base px-6 py-3",
};

export function BrutalistButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...props
}: BrutalistButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`
        border-3 font-black tracking-wider uppercase font-mono
        shadow-[4px_4px_0px_black]
        hover:shadow-[6px_6px_0px_black]
        hover:translate-x-[-2px] hover:translate-y-[-2px]
        active:shadow-[2px_2px_0px_black]
        active:translate-x-[2px] active:translate-y-[2px]
        transition-all duration-75
        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:hover:translate-x-0 disabled:hover:translate-y-0
        disabled:hover:shadow-[4px_4px_0px_black]
        ${VARIANT_STYLES[variant]}
        ${SIZE_STYLES[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
