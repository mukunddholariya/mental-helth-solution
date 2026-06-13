import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "gradient";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "submit" | "reset" | "button";
  id?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-display font-bold rounded-xl transition-all duration-205 outline-none select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-4.5 py-2.5 text-xs sm:text-sm",
    lg: "px-6 py-3.5 text-sm sm:text-base"
  };

  const variantStyles = {
    primary: "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/10 active:scale-98",
    secondary: "bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-850 hover:text-white hover:border-slate-700 active:scale-98",
    danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/10 active:scale-98",
    ghost: "bg-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-850",
    gradient: "bg-gradient-to-tr from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/10 active:scale-98"
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" aria-hidden="true" />}
      {children}
    </button>
  );
}
