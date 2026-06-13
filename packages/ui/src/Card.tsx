import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "solid" | "glass" | "glowing" | "flat";
  glowColor?: "emerald" | "rose" | "teal";
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

export function Card({
  children,
  variant = "solid",
  glowColor = "emerald",
  className = "",
  ...props
}: CardProps) {
  const baseStyles = "rounded-2xl border transition-all duration-300 relative overflow-hidden";
  
  const variantStyles = {
    solid: "bg-slate-950 border-slate-800",
    flat: "bg-slate-900 border-slate-800/60",
    glass: "bg-slate-950/60 backdrop-blur-md border-slate-800",
    glowing: `bg-slate-950 border-slate-805 ${
      glowColor === "emerald" 
        ? "border-emerald-500/20 shadow-lg shadow-emerald-500/[0.02]" 
        : glowColor === "rose"
        ? "border-rose-500/20 shadow-lg shadow-rose-500/[0.02]"
        : "border-teal-500/20 shadow-lg shadow-teal-500/[0.02]"
    }`
  };

  const glowBlurLayer = variant === "glowing" && (
    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-20 -z-10 ${
      glowColor === "emerald" 
        ? "bg-emerald-500" 
        : glowColor === "rose"
        ? "bg-rose-500"
        : "bg-teal-500"
    }`} aria-hidden="true" />
  );

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {glowBlurLayer}
      {children}
    </div>
  );
}
