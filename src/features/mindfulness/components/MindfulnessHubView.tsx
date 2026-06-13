import React, { useState, useEffect, useRef } from "react";
import { BREATHING_PATTERNS, DEFAULT_AFFIRMATIONS } from "@/src/data";
import { Wind, ShieldAlert, Sparkles, AlertCircle, RefreshCw, Volume2, Music, Check, Compass, Play, Pause } from "lucide-react";

interface MindfulnessHubProps {
  examType: string;
}

export default function MindfulnessHub({ examType }: MindfulnessHubProps) {
  // Breathing state hooks
  const [activePattern, setActivePattern] = useState(BREATHING_PATTERNS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<"Inhale" | "Hold (In)" | "Exhale" | "Hold (Out)">("Inhale");
  const [secondsRemaining, setSecondsRemaining] = useState(activePattern.inhale);
  const [cycleCount, setCycleCount] = useState(0);

  // Affirmations state hooks
  const affirmations = DEFAULT_AFFIRMATIONS[examType] || DEFAULT_AFFIRMATIONS.Default;
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [shuffledText, setShuffledText] = useState(affirmations[0]);

  // Audio simulation state (for zen sound/vibration feedback)
  const [isMuted, setIsMuted] = useState(true);

  // Refs for tracking breathing state avoiding stale callbacks
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset breathing on pattern change
  useEffect(() => {
    setIsPlaying(false);
    setPhase("Inhale");
    setSecondsRemaining(activePattern.inhale);
    setCycleCount(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [activePattern]);

  // Unified breathing machine timer loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Transition phase logic
          let nextPhase: typeof phase = "Inhale";
          let nextDuration = 0;

          if (phase === "Inhale") {
            if (activePattern.holdIn > 0) {
              nextPhase = "Hold (In)";
              nextDuration = activePattern.holdIn;
            } else {
              nextPhase = "Exhale";
              nextDuration = activePattern.exhale;
            }
          } else if (phase === "Hold (In)") {
            nextPhase = "Exhale";
            nextDuration = activePattern.exhale;
          } else if (phase === "Exhale") {
            if (activePattern.holdOut > 0) {
              nextPhase = "Hold (Out)";
              nextDuration = activePattern.holdOut;
            } else {
              nextPhase = "Inhale";
              nextDuration = activePattern.inhale;
              setCycleCount((c) => c + 1);
            }
          } else if (phase === "Hold (Out)") {
            nextPhase = "Inhale";
            nextDuration = activePattern.inhale;
            setCycleCount((c) => c + 1);
          }

          setPhase(nextPhase);
          return nextDuration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, phase, activePattern]);

  const handleToggleBreathing = () => {
    setIsPlaying(!isPlaying);
  };

  const handleResetBreathing = () => {
    setIsPlaying(false);
    setPhase("Inhale");
    setSecondsRemaining(activePattern.inhale);
    setCycleCount(0);
  };

  const handleNextAffirmation = () => {
    setAffirmationIndex((prev) => {
      const nextIdx = (prev + 1) % affirmations.length;
      setShuffledText(affirmations[nextIdx]);
      return nextIdx;
    });
  };

  // Get current scale factor for visual breathing ring
  const getScaleFactor = (): number => {
    if (!isPlaying) return 1.0;
    
    // Inhale -> grow from 1.0 to 1.45
    if (phase === "Inhale") {
      const duration = activePattern.inhale;
      const passed = duration - secondsRemaining;
      return 1.0 + (passed / duration) * 0.45;
    }
    // Hold (In) -> stay maximum at 1.45
    if (phase === "Hold (In)") {
      return 1.45;
    }
    // Exhale -> shrink from 1.45 to 1.0
    if (phase === "Exhale") {
      const duration = activePattern.exhale;
      const passed = duration - secondsRemaining;
      return 1.45 - (passed / duration) * 0.45;
    }
    // Hold (Out) -> stay minimum at 1.0
    return 1.0;
  };

  // Setup dynamic color based on the state phase
  const getPhaseColor = () => {
    switch (phase) {
      case "Inhale": return "text-teal-400 stroke-teal-400 shadow-teal-500/10";
      case "Hold (In)": return "text-emerald-400 stroke-emerald-400 shadow-emerald-500/10";
      case "Exhale": return "text-indigo-400 stroke-indigo-400 shadow-indigo-500/10";
      case "Hold (Out)": return "text-amber-400 stroke-amber-400 shadow-amber-500/10";
    }
  };

  const currentScale = getScaleFactor();

  return (
    <div className="w-full space-y-8" id="mindfulness-wrapper">
      {/* Header title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4" id="mindfulness-header">
        <div>
          <h2 className="text-2xl font-bold text-white font-display flex items-center gap-2">
            <Wind className="w-6 h-6 text-emerald-400" />
            Adaptive Mindfulness Hub
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Realign your vagus nerve and slow racing thoughts before hitting the textbooks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="mindfulness-grid">
        {/* Breathing Machine Area (Left/Middle Column) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800/80 p-6 md:p-8 rounded-2xl flex flex-col items-center justify-between" id="breathing-coach-zone">
          <div className="w-full" id="coach-selector">
            <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest text-center mb-3">
              Step 1: Pick a Breathing Rhythm
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" id="pattern-pockets">
              {BREATHING_PATTERNS.map((pattern) => (
                <button
                  key={pattern.id}
                  onClick={() => setActivePattern(pattern)}
                  className={`p-3.5 rounded-xl border transition text-left cursor-pointer hover:border-emerald-500/40 relative overflow-hidden ${
                    activePattern.id === pattern.id
                      ? "bg-slate-900 border-emerald-400 text-white"
                      : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className="block font-bold text-xs">{pattern.name}</span>
                  <span className="block text-[10px] text-slate-400 mt-1 leading-normal truncate">{pattern.description}</span>
                  {activePattern.id === pattern.id && (
                    <div className="absolute top-1 right-2 w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Large Interactive Pulsing Circle Lung Indicator */}
          <div className="my-10 relative flex items-center justify-center h-64 w-64" id="pulsing-interactive-globe">
            {/* outer ripple rings based on current scale */}
            <div
              className={`absolute inset-0 rounded-full bg-emerald-500/5 border border-emerald-500/15 duration-300 transition-all`}
              style={{ transform: `scale(${currentScale * 1.15})` }}
            />
            <div
              className={`absolute inset-0 rounded-full bg-teal-500/5 duration-500 transition-all`}
              style={{ transform: `scale(${currentScale * 1.3})` }}
            />

            {/* Main Center circle pulsing */}
            <div
              className={`h-48 w-48 rounded-full bg-gradient-to-tr from-slate-900 to-slate-805 border border-slate-700/60 shadow-xl flex flex-col items-center justify-center transition-all duration-300 relative`}
              style={{ transform: `scale(${currentScale})` }}
            >
              {/* Inner glowing core based on phase */}
              <div
                className={`absolute inset-4 rounded-full bg-gradient-to-br opacity-10 blur-md transition-all ${
                  phase === "Inhale" ? "from-teal-400 to-teal-600" :
                  phase === "Hold (In)" ? "from-emerald-400 to-emerald-600" :
                  phase === "Exhale" ? "from-indigo-400 to-indigo-600" :
                  "from-amber-400 to-amber-600"
                }`}
              />

              <div className="z-10 text-center space-y-1 select-none" id="bubble-readouts">
                <span className={`block text-xs uppercase tracking-widest font-extrabold duration-300 ${getPhaseColor()}`}>
                  {phase}
                </span>
                <span className="block text-4xl font-extrabold font-display text-white mt-1">
                  {secondsRemaining}s
                </span>
                <span className="block text-[9px] text-slate-500 font-sans tracking-wide">
                  Cycle: {cycleCount}
                </span>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="w-full space-y-4" id="breathing-controls">
            <div className="flex justify-center items-center gap-3">
              <button
                onClick={handleToggleBreathing}
                className={`px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition transform active:scale-95 ${
                  isPlaying
                    ? "bg-amber-400 hover:bg-amber-300 text-slate-950"
                    : "bg-emerald-400 hover:bg-emerald-300 text-slate-950"
                }`}
                id="breathing-toggle-btn"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 text-slate-950 fill-slate-950" /> Pause cycle
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-slate-950 fill-slate-950" /> Start meditation
                  </>
                )}
              </button>

              {(isPlaying || secondsRemaining !== activePattern.inhale || cycleCount > 0) && (
                <button
                  onClick={handleResetBreathing}
                  className="px-4 py-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-400 hover:text-white text-xs uppercase tracking-wider transition cursor-pointer active:scale-95"
                  id="breathing-reset-btn"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Instruction line */}
            <p className="text-[11px] text-slate-500 text-center font-sans">
              {isPlaying 
                ? `${phase === 'Inhale' ? 'Breathe in slowly through your nose...' : phase === 'Hold (In)' ? 'Hold your breath gently. Keep shoulders loose.' : phase === 'Exhale' ? 'Exhale fully through pursed lips...' : 'Rest with empty lungs before next stretch...'}`
                : "Match your heart rhythm to the circle's expansion. Find your center."}
            </p>
          </div>
        </div>

        {/* Affirmations Deck & Emergency Support (Right columns) */}
        <div className="lg:col-span-5 space-y-6" id="mindfulness-sidecar">
          {/* Affirmation slider card */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden" id="affirmation-card-scaffold">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl"></div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3" id="affirmations-top">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 font-sans">
                <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "12s" }} /> Exam Affirmations Deck
              </span>
              <span className="text-[9px] bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">
                {examType} Filter
              </span>
            </div>

            <div className="py-6 min-h-[9rem] flex flex-col justify-center" id="affirmation-body">
              <p className="text-sm font-display text-slate-100 font-medium leading-relaxed italic text-left">
                "{shuffledText?.text}"
              </p>
              <span className="block text-[11px] text-slate-400 mt-3 text-left font-sans">
                - {shuffledText?.author}
              </span>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800/40" id="affirmation-footer">
              <button
                onClick={handleNextAffirmation}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer transition underline decoration-dotted underline-offset-4"
                id="shuffle-affirmations"
              >
                <span>Draw next card</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Emergency pre-test crisis coping cards */}
          <div className="bg-rose-500/5 border border-rose-500/15 rounded-2xl p-6" id="emergency-calmdown">
            <h3 className="text-white font-bold font-display text-sm tracking-wide flex items-center gap-1.5 text-rose-300">
              <Compass className="w-5 h-5 text-rose-400" />
              Pre-Exam Panic Mode?
            </h3>
            <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
              If you are sitting in the exam hall lobby, or experiencing a sudden heartbeat spike right now:
            </p>
            <div className="mt-4 space-y-3" id="pre-exam-panics-actions">
              <div className="bg-slate-950 border border-slate-850 p-2.5 rounded-xl flex items-start gap-2.5" id="emergency-step-1">
                <span className="w-5 h-5 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                <div>
                  <span className="block font-bold text-slate-200 text-xs">Double-Inhale Sighing</span>
                  <span className="block text-[10px] text-slate-400 leading-normal mt-0.5">
                    Inhale deeply through your nose twice consecutively (one full, one quick top-up), then let out a slow, long sigh through your mouth. Do this three times. It expands the alveoli lungs to immediately drop carbon dioxide stress.
                  </span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-850 p-2.5 rounded-xl flex items-start gap-2.5" id="emergency-step-2">
                <span className="w-5 h-5 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                <div>
                  <span className="block font-bold text-slate-200 text-xs">Loosen structural physical grip</span>
                  <span className="block text-[10px] text-slate-400 leading-normal mt-0.5">
                    Drop your shoulders fully. Unclench your jaw. Place your palms flat face up on your thighs. Let go of active muscle holds.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
