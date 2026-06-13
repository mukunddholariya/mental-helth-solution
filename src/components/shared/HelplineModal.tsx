import React from "react";
import { STUDENT_HELPLINES } from "@/src/data";
import { X, ShieldAlert, PhoneCall, HelpCircle, Heart, Lock, AlertCircle } from "lucide-react";

interface HelplineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelplineModal({ isOpen, onClose }: HelplineModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none animate-fadeIn" id="helpline-modal-backdrop">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden" id="helpline-modal-card">
        {/* Decorative corner warning glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl"></div>

        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4" id="helpline-modal-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-500/15 text-rose-400 rounded-xl flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block font-sans">Student Safety Net</span>
              <h3 className="text-lg font-bold text-white font-display">Mental Wellness Helplines India</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            id="close-helpline-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reassurance text */}
        <div className="my-5 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl" id="helpline-reassurance">
          <div className="flex gap-2.5">
            <Heart className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-305 leading-relaxed text-slate-300">
              Aspirant exams are incredibly intense, and we know how overwhelming it gets. Please remember: <strong>mock marks do not equal your worth.</strong> It is completely normal to reach out for a listening human ear when stakes feel too heavy.
            </p>
          </div>
        </div>

        {/* Helpline list mapping */}
        <div className="space-y-4" id="helplines-content-list">
          {STUDENT_HELPLINES.map((h) => (
            <div key={h.number} className="bg-slate-950 border border-slate-800 hover:border-slate-700/60 transition p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3" id={`helpline-modal-item-${h.number}`}>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-xs sm:text-sm font-display tracking-widest">{h.name}</span>
                  <span className="text-[9px] bg-emerald-400/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">{h.hours}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal font-sans max-w-sm">{h.description}</p>
              </div>

              {/* Instant Call anchor button */}
              <a
                href={`tel:${h.number}`}
                className="w-full sm:w-auto px-4 py-2.5 bg-rose-500 hover:bg-rose-600 hover:-translate-y-0.5 text-white rounded-lg flex items-center justify-center gap-2 text-xs font-bold font-mono transition-all transform shrink-0 active:translate-y-0"
              >
                <PhoneCall className="w-4 h-4 shrink-0" />
                <span>Call {h.number}</span>
              </a>
            </div>
          ))}
        </div>

        {/* Privacy Lock footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500" id="helpline-modal-footer">
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 shrink-0 text-emerald-400/60" />
            <span>Confidential & Free Call Services</span>
          </span>
          <span className="italic">You are not alone in this.</span>
        </div>
      </div>
    </div>
  );
}
