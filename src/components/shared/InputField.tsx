import React, { forwardRef } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, icon, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full font-sans">
        <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
          {label}
        </label>
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-slate-500 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full bg-slate-950 border rounded-xl text-slate-200 text-sm py-2.5 px-4 focus:outline-none transition-all duration-200 ${
              icon ? "pl-11" : ""
            } ${
              error
                ? "border-rose-500/50 focus:border-rose-500/80 focus:ring-1 focus:ring-rose-500/20"
                : "border-slate-800 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/15"
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-[10px] text-rose-450 text-rose-400 font-medium px-1 flex items-center gap-1.5 animate-fadeIn">
            <span>⚠️</span> {error}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
