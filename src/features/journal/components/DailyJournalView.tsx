import React, { useState } from "react";
import { JournalEntry, JournalAnalysis, MOOD_EMOJIS, analyzeJournal } from "@manas/core";
import { PenTool, BrainCircuit, Heart, Calendar, Smile, ShieldAlert, ArrowRight, Loader2, Sparkles, CheckCircle } from "lucide-react";

interface DailyJournalProps {
  examType: string;
  studentName: string;
  onSaveEntry: (entry: JournalEntry) => void;
  onStartChat: (analysis: JournalAnalysis) => void;
}

const FILLER_PROMPTS: Record<string, string[]> = {
  JEE: [
    "How did today's mock tests go? Are backlogs like physics/maths weighing you down?",
    "Did peer competition or ranking comparison creep in today? Express it here.",
    "Are formulas, mechanics, or physical chemistry numericals making you feel stuck?"
  ],
  NEET: [
    "Are organic chemistry mechanisms or bulk bio names becoming hard to retain?",
    "Did you feel overwhelmed by Mock Test rankings or question practice today?",
    "Are you keeping up on sleep, or is study burnout beginning to drain your stamina?"
  ],
  UPSC: [
    "How is the GS syllabus overload affecting you today? Did answer-writing feel sluggish?",
    "Is the fear of unpredictable prelims or parent/peer expectations pressing on you?",
    "Did you lose track of time or feel stuck in a creative/retentive plateau today?"
  ],
  Default: [
    "What's on your mind today? Let out the academic overload, doubts, or wins.",
    "Did peer comparison or fear of failure impact your focus today?",
    "How have your energy levels and sleep been while trying to hit today's targets?"
  ]
};

export default function DailyJournal({ examType, studentName, onSaveEntry, onStartChat }: DailyJournalProps) {
  const [selectedMood, setSelectedMood] = useState(MOOD_EMOJIS[2]); // Default Neutral
  const [entryText, setEntryText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<JournalAnalysis | null>(null);

  const prompts = FILLER_PROMPTS[examType] || FILLER_PROMPTS.Default;

  // Cycle comforting messages
  const loadingMessages = [
    "Manas is reading your words with full empathy...",
    "Understanding the academic context and triggers...",
    "Synthesizing personalized mental coping exercises...",
    "Almost ready: Tailoring comforting words for you..."
  ];

  const handleTextAnalyze = async () => {
    if (!entryText.trim()) {
      alert("Please write something about your day before submitting.");
      return;
    }

    setIsAnalyzing(true);
    setLoadingStep(0);

    // Increment loading text as simulated timeline steps
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 1800);

    try {
      const data = await analyzeJournal({
        text: entryText,
        examType,
        studentName
      });
      setAnalysisResult(data);

      // Save to parents' log triggers
      const entry: JournalEntry = {
        id: Math.random().toString(36).substring(2, 9),
        date: new Date().toISOString(),
        text: entryText,
        moodEmoji: selectedMood.emoji,
        moodLabel: selectedMood.label,
        analysis: data
      };

      onSaveEntry(entry);
    } catch (err) {
      console.error(err);
      // Fallback offline analysis if network or key is missing
      const fallback: JournalAnalysis = {
        emotion: selectedMood.label.split(" ")[0] || "Stressed",
        stressLevel: selectedMood.score,
        triggers: ["Syllabus load", "Exam Pressure"],
        copingCategory: "general_stress",
        copingText: "Take 5 slow breaths. Ground yourself using the 5-4-3-2-1 technique: list 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. This returns focus to the present.",
        empathyQuote: "It is incredibly normal to feel this way. The fact that you are sitting here trying your best is a victory in itself."
      };
      setAnalysisResult(fallback);

      const entry: JournalEntry = {
        id: Math.random().toString(36).substring(2, 9),
        date: new Date().toISOString(),
        text: entryText,
        moodEmoji: selectedMood.emoji,
        moodLabel: selectedMood.label,
        analysis: fallback
      };
      onSaveEntry(entry);
    } finally {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setEntryText("");
    setAnalysisResult(null);
  };

  return (
    <div className="w-full space-y-6" id="daily-journal-wrapper">
      {/* Upper header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4" id="journal-heading">
        <div>
          <h2 className="text-2xl font-bold text-white font-display flex items-center gap-2">
            <PenTool className="w-6 h-6 text-emerald-400" aria-hidden="true" />
            Daily Journal & Check-in
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Let's offload the pressure. Write what is on your mind and let Manas analyze triggers.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg" id="active-context-badge">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true"></span>
          <span>Context: <strong>{examType}</strong> Aspirant</span>
        </div>
      </div>

      {!analysisResult ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="journal-editor-zone">
          {/* Main prompt guide and writing pad */}
          <div className="lg:col-span-8 space-y-6">
            {/* Dynamic Suggestive prompt */}
            <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl relative overflow-hidden" id="dynamic-prompt-box">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" aria-hidden="true" /> Warm Check-In Prompt
                  </div>
                  <p className="text-sm italic text-slate-300">
                    "{prompts[activePromptIndex]}"
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePromptIndex((prev) => (prev + 1) % prompts.length)}
                  className="text-xs text-slate-400 hover:text-emerald-400 shrink-0 transition underline decoration-dotted underline-offset-4 cursor-pointer"
                  id="cycle-prompt"
                  aria-label="Cycle to another journal writing prompt advice"
                >
                  Try another
                </button>
              </div>
            </div>

            {/* Quick pre-mood emoji selection */}
            <div>
              <span id="mood-selector-label" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                How is your emotional energy right now?
              </span>
              <div 
                className="grid grid-cols-5 gap-2 md:grid-cols-5" 
                id="emoji-grid"
                role="group"
                aria-labelledby="mood-selector-label"
              >
                {MOOD_EMOJIS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setSelectedMood(item)}
                    aria-label={item.label}
                    aria-pressed={selectedMood.label === item.label}
                    className={`p-3 rounded-xl flex flex-col items-center justify-center border transition transform active:scale-95 cursor-pointer ${
                      selectedMood.label === item.label
                        ? "bg-slate-800 border-emerald-400/80 shadow-md shadow-emerald-500/5 text-white"
                        : "bg-slate-950/50 border-slate-800/80 hover:bg-slate-805 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span className="text-2xl" role="img" aria-label={item.label}>{item.emoji}</span>
                    <span className="text-[9px] mt-1.5 text-center leading-tight truncate w-full">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Core writing canvas */}
            <div>
              <label htmlFor="journal-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Write freely. No filters, no grades, no comparisons.
              </label>
              <div className="relative">
                <textarea
                  id="journal-input"
                  value={entryText}
                  onChange={(e) => setEntryText(e.target.value)}
                  placeholder="Today felt heavy because of organic chemistry backlog... / I am feeling anxious about my mock score... / Honestly, I studied 6 hours and feel satisfied but physically exhausted..."
                  rows={8}
                  className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-slate-200 placeholder-slate-600 font-sans leading-relaxed resize-none"
                />
                <div className="absolute bottom-3 right-3 text-[10px] text-slate-500 font-mono">
                  {entryText.length} characters
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex justify-end" id="journal-submit-area">
              <button
                type="button"
                onClick={handleTextAnalyze}
                disabled={isAnalyzing || !entryText.trim()}
                className="px-6 py-3.5 bg-emerald-400 hover:bg-emerald-300 disabled:bg-slate-800 disabled:text-slate-600 font-bold rounded-xl text-slate-950 text-xs uppercase tracking-wider flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition cursor-pointer"
                id="analyse-journal-btn"
                aria-label="Submit journal and analyze emotional coping ideas with Manas"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" aria-hidden="true" />
                    Analyzing entry...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-4 h-4 text-slate-950" aria-hidden="true" />
                    Submit & Analyze Coping Ideas
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Guidelines Sidebar */}
          <div className="lg:col-span-4 space-y-4" id="journal-guide-column">
            <div className="bg-slate-950/40 border border-slate-800/80 p-5 rounded-2xl" id="guide-inner">
              <h3 className="text-slate-250 font-bold mb-3 flex items-center gap-1.5 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                The Power of Journaling
              </h3>
              <ul className="space-y-3 text-xs text-slate-400" role="list">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-1.5" aria-hidden="true"></span>
                  <span>Writing down stress activates prefrontal cortex regulation, cooling down the panic circuits (amygdala).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-1.5" aria-hidden="true"></span>
                  <span>Don't worry about correct spelling or handwriting. Write in whatever language combination (Hinglish/English) feels natural!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-1.5" aria-hidden="true"></span>
                  <span>Extracting your stress triggers helps separate yourself from the panic, making complex problems feel smaller and solvable.</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-teal-500/5 to-emerald-500/5 border border-emerald-500/10 p-5 rounded-2xl relative overflow-hidden" id="manas-pledge">
              <h4 className="text-white font-bold text-xs mb-1 font-display">Our Privacy Sanctuary</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Manas is built client-authoritatively. All written entries are stored directly inside your device's Sandbox storage. Only the momentary entry text is analyzed in the cloud - creating a secure private space.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Insight Card Screen after analysis is completed */
        <div className="bg-slate-950/30 border border-slate-800/80 rounded-2xl p-6 md:p-8 space-y-6" id="journal-insight-view">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4" id="insight-title-row">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/15 text-emerald-400 rounded-xl flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Analysis Finished</span>
                <h3 className="text-lg font-bold text-white font-display">AI Personal Insight Card</h3>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white border border-slate-850 bg-slate-900/60 transition px-3 py-1.5 rounded-lg hover:border-slate-700 cursor-pointer"
              id="reset-journal-entry"
            >
              Write another entry
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6" id="insights-layout">
            {/* Tone and Stress Level (Left side inside card grid) */}
            <div className="md:col-span-4 space-y-5">
              {/* Dominant tone badge */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl" id="insight-emotion">
                <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Dominant Tone</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  <span className="text-xl font-bold text-white font-display uppercase tracking-wide">
                    {analysisResult.emotion}
                  </span>
                </div>
              </div>

              {/* Stress score slider bar indicator */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl" id="insight-stress-score">
                <div className="flex justify-between items-center mb-1">
                  <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Stress Level</span>
                  <span className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded ${
                    analysisResult.stressLevel <= 4 
                      ? "text-teal-400 bg-teal-500/10" 
                      : analysisResult.stressLevel <= 7 
                      ? "text-amber-400 bg-amber-500/10" 
                      : "text-rose-400 bg-rose-500/10"
                  }`}>
                    {analysisResult.stressLevel} / 10
                  </span>
                </div>
                {/* Visual bar container */}
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden mt-2 border border-slate-850">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      analysisResult.stressLevel <= 4
                        ? "bg-teal-400"
                        : analysisResult.stressLevel <= 7
                        ? "bg-amber-400"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${analysisResult.stressLevel * 10}%` }}
                  />
                </div>
                <span className="block text-[10px] text-slate-400 mt-2 italic text-left">
                  {analysisResult.stressLevel >= 8 
                    ? "Severe Pressure. Time to decelerate study work and breathe." 
                    : analysisResult.stressLevel >= 5 
                    ? "Moderate overload. Let's make things slightly simpler." 
                    : "Manageable state. You have full charge of this focus."}
                </span>
              </div>

              {/* Triggers identified tags list */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl" id="insight-triggers">
                <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Identified Triggers</span>
                <div className="flex flex-wrap gap-1.5" id="triggers-tags">
                  {analysisResult.triggers && analysisResult.triggers.length > 0 ? (
                    analysisResult.triggers.map((trig) => (
                      <span key={trig} className="text-[11px] bg-slate-950 border border-slate-800 px-2 py-1 rounded text-slate-300">
                        🚨 {trig}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-slate-500">None clearly extracted</span>
                  )}
                </div>
              </div>
            </div>

            {/* Core empathetic message and recommendation (Right side) */}
            <div className="md:col-span-8 space-y-5">
              {/* Empathetic quote block */}
              <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-5 relative" id="insight-quote-container">
                <Heart className="w-10 h-10 text-emerald-400/10 absolute right-4 top-4" />
                <span className="block text-[10px] font-semibold text-emerald-400 uppercase tracking-widest mb-1.5">A Voice of Comfort</span>
                <p className="text-slate-200 text-sm italic font-sans leading-relaxed">
                  "{analysisResult.empathyQuote}"
                </p>
              </div>

              {/* Actionable coaching recommendation */}
              <div className="bg-slate-905 border border-slate-800 rounded-xl p-5" id="insight-coaching-box">
                <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Tailored Coping Exercise</span>
                <div className="space-y-2 text-slate-300 text-xs leading-relaxed" id="coping-text-content">
                  <p className="whitespace-pre-line font-sans text-slate-350">{analysisResult.copingText}</p>
                </div>
              </div>

              {/* Interactive buttons row */}
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-end pt-2" id="insight-actions">
                <button
                  onClick={() => onStartChat(analysisResult)}
                  className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition cursor-pointer"
                  id="insight-chat-transition"
                >
                  <span>Talk with Manas on this</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reassuring Loading Overlay during process */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6" id="journal-loading-overlay">
          <div className="w-full max-w-sm text-center space-y-6" id="loading-card">
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center" id="loading-spinner-container">
              {/* Ripple Ring animate */}
              <div className="absolute inset-0 border border-emerald-500/20 rounded-full scale-125 animate-ping duration-1000"></div>
              <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-xl"></div>
              <Loader2 className="w-12 h-12 text-emerald-400 animate-spin relative" />
            </div>
            <div className="space-y-2">
              <h4 className="text-white font-extrabold font-display tracking-wide text-lg">Analyzing emotional weight</h4>
              <p className="text-slate-400 text-xs min-h-[3.5rem] px-4 font-sans leading-relaxed">
                {loadingMessages[loadingStep]}
              </p>
            </div>
            <div className="flex justify-center gap-1.5" id="dots-progress">
              {loadingMessages.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i === loadingStep ? "bg-emerald-400 w-4" : "bg-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
