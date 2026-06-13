import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, JournalAnalysis, STUDENT_HELPLINES, sendCompanionChat } from "@manas/core";
import { Send, Smile, Info, RefreshCw, Sparkles, MessageCircle, AlertTriangle, PhoneCall, ShieldAlert, Heart, Volume2 } from "lucide-react";

interface CompanionChatProps {
  examType: string;
  studentName: string;
  recentAnalysis?: JournalAnalysis | null;
  messages: ChatMessage[];
  onAddMessage: (msg: ChatMessage) => void;
  onClearHistory: () => void;
}

const CONSTANT_SUGGESTED_PROMPTS = [
  "How do I deal with heavy parental expectations?",
  "I scored low in my mock test, how to stay hopeful?",
  "How can I break down extreme syllabus overload?",
  "I feel physically exhausted but feel guilty for sleeping.",
  "What is the best way to deal with competitive peer comparisons?"
];

export default function CompanionChat({
  examType,
  studentName,
  recentAnalysis,
  messages,
  onAddMessage,
  onClearHistory
}: CompanionChatProps) {
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [crisisDetected, setCrisisDetected] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages or typing state updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Check input for severe distress keywords
  const checkCrisisKeywords = (text: string): boolean => {
    const keywords = [
      "give up my life", "commit suicide", "kill myself", "end my life",
      "want to die", "hanging myself", "self harm", "harm myself", "no reason to live",
      "ending this", "kill-myself", "end the pain permanent"
    ];
    const normalized = text.toLowerCase();
    return keywords.some(keyword => normalized.includes(keyword));
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Trigger crisis UI if detected
    const isCrisis = checkCrisisKeywords(textToSend);
    if (isCrisis) {
      setCrisisDetected(true);
    }

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      role: "user",
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    onAddMessage(userMsg);
    setInputText("");
    setIsTyping(true);

    try {
      const data = await sendCompanionChat({
        messages: [...messages, userMsg].map(m => ({ role: m.role, text: m.text })),
        examType,
        studentName,
        recentAnalysis: recentAnalysis || null
      });

      const aiMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        role: "model",
        text: data.text || "I'm always beside you to listen, but I temporarily lost connection. Let's take a deep breath together.",
        timestamp: new Date().toISOString()
      };

      onAddMessage(aiMsg);
    } catch (err: any) {
      console.error(err);
      // Fallback response:
      const fallbackMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        role: "model",
        text: `Hey, I hit a brief connection hiccup, but I hear you. When things get intense with ${examType} syllabus, it's completely valid to feel this way. Let's take 3 cycles of Box Breathing right now to calm the nervous system.`,
        timestamp: new Date().toISOString()
      };
      onAddMessage(fallbackMsg);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  // Simple clean formatting helper to parse code blocks, list markers, and standard bold highlights safely
  const formatMessageText = (rawText: string) => {
    return rawText.split("\n\n").map((para, i) => {
      // Inline block code or list parses
      const formattedLines = para.split("\n").map((line, j) => {
        // Bullet list points format
        if (line.trim().startsWith("*") || line.trim().startsWith("-")) {
          const cleanLine = line.replace(/^[\s*-]+/, "").trim();
          return (
            <li key={`line-${j}`} className="list-disc ml-5 mb-1.5 text-slate-300 pl-1 leading-relaxed">
              {parseBoldtext(cleanLine)}
            </li>
          );
        }
        // Ordered list format
        if (/^\d+\./.test(line.trim())) {
          const cleanLine = line.replace(/^\d+\.\s*/, "").trim();
          return (
            <li key={`line-${j}`} className="list-decimal ml-5 mb-1.5 text-slate-300 pl-1 leading-relaxed">
              {parseBoldtext(cleanLine)}
            </li>
          );
        }
        // Normal paragraph sub-line
        return <p key={`line-${j}`} className="mb-2 text-slate-200 leading-relaxed last:mb-0">{parseBoldtext(line)}</p>;
      });

      return (
        <div key={`para-${i}`} className="mb-4 last:mb-0 font-sans text-sm">
          {formattedLines}
        </div>
      );
    });
  };

  // Replace **bold** words with <strong> tag rendering
  const parseBoldtext = (textStr: string) => {
    const parts = textStr.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={idx} className="text-white font-semibold text-teal-400">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl" id="chat-component">
      {/* Companion chat header info */}
      <div className="flex items-center justify-between bg-slate-900 border-b border-slate-800 px-5 py-4 shrink-0" id="chat-header">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-slate-950 font-bold text-lg font-display">
              M
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white font-display text-sm tracking-wide">Manas Companion</span>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-widest">Active Partner</span>
            </div>
            <span className="text-slate-400 text-[10px] block">Tailores for your {examType} mental resilience</span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2" id="chat-header-actions">
          {messages.length > 1 && (
            <button
              type="button"
              onClick={onClearHistory}
              title="Clear entire session history"
              className="text-xs text-slate-400 hover:text-rose-400 bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              id="clear-chat-log"
              aria-label="Clear chat conversational logs"
            >
              <RefreshCw className="w-3 h-3" aria-hidden="true" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main message layout panel */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 bg-gradient-to-b from-slate-950 to-slate-900/60" id="chat-messages-scroll-pane" role="log" aria-label="Chat messages history log">
        {/* Helper Banner describing Context */}
        {recentAnalysis && (
          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 text-emerald-300 text-[11px] leading-relaxed flex items-center gap-2.5" id="context-relay-banner">
            <Info className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>
              Manas has integrated your journal context: currently processing <strong>{recentAnalysis.emotion}</strong> feelings and focusing on stress management.
            </span>
          </div>
        )}

        {/* Distress HELPLINE Prompt detected via keywords */}
        {crisisDetected && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-slate-200" id="crisis-helpline-alert">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-2">
                <h5 className="text-rose-300 font-bold text-xs uppercase tracking-wide">Critical Support available</h5>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  I hear your intense pain and difficulty, but as an AI, I am not a substitute for human professional support. Your life is extremely precious. Please take a moment to speak to a trained counselor:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2" id="crisis-contacts">
                  {STUDENT_HELPLINES.slice(0, 2).map((h) => (
                    <div key={h.number} className="bg-slate-950 border border-rose-500/20 p-2.5 rounded-lg flex items-center justify-between" id={`helpline-item-${h.number}`}>
                      <div>
                        <span className="block font-bold text-[11px] text-white">{h.name}</span>
                        <span className="block text-[10px] text-rose-300 font-mono mt-0.5">{h.hours}</span>
                      </div>
                      <a href={`tel:${h.number}`} className="bg-rose-500 hover:bg-rose-600 text-white p-2 rounded-md transition transform active:scale-95 flex items-center gap-1.5 text-xs font-bold font-mono">
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{h.number}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat History map list */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            id={`message-row-${msg.id}`}
          >
            {msg.role !== "user" && (
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 font-bold font-display flex items-center justify-center text-xs tracking-wider shrink-0 mt-1">
                M
              </div>
            )}
            <div
              className={`max-w-[82%] rounded-2xl p-4 font-sans leading-relaxed text-sm ${
                msg.role === "user"
                  ? "bg-emerald-400 text-slate-950 font-medium rounded-tr-none px-4.5 py-3.5"
                  : "bg-slate-800/60 border border-slate-700/50 rounded-tl-none text-slate-200"
              }`}
            >
              {/* Output parsing logic */}
              {msg.role === "user" ? (
                <p className="whitespace-pre-line text-slate-950 text-xs sm:text-sm font-medium">{msg.text}</p>
              ) : (
                formatMessageText(msg.text)
              )}
              {/* Optional time footer */}
              <span className={`block text-[8px] mt-2.5 text-right font-mono ${msg.role === "user" ? "text-slate-800" : "text-slate-500"}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {/* Companion is currently thinking status anim */}
        {isTyping && (
          <div className="flex items-start gap-3 justify-start" id="typing-indicator">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 font-bold font-display flex items-center justify-center text-xs tracking-wider shrink-0 mt-1 animate-pulse">
              M
            </div>
            <div className="bg-slate-800/60 border border-slate-705 rounded-2xl rounded-tl-none p-4 text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              <span className="text-xs italic text-slate-500 pl-1.5">Manas is reflecting...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompting bubbles quick panel */}
      {messages.length <= 1 && !isTyping && (
        <div className="px-5 pt-3 pb-1 border-t border-slate-800/40 shrink-0" id="suggested-prompts-tray">
          <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400/80" aria-hidden="true" /> Or pick a common stressor to ask
          </span>
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-none" id="suggestions-bubbles" role="group" aria-label="Suggested questions">
            {CONSTANT_SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="text-[11px] bg-slate-900 border border-slate-800 hover:border-emerald-400/50 hover:bg-slate-850 px-3 py-1.5 rounded-lg text-slate-350 transition transition-transform shrink-0 cursor-pointer active:scale-95"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input panel block footer */}
      <form onSubmit={handleFormSubmit} className="bg-slate-900/90 border-t border-slate-800 p-4 shrink-0 flex items-center gap-2.5" id="chat-input-row" aria-label="Send messages form">
        <label htmlFor="chat-user-input" className="sr-only">Type your message to Manas</label>
        <input
          id="chat-user-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Manas for a tailored coping task, parental pressure advice..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 font-sans focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-sm"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="bg-emerald-400 hover:bg-emerald-300 disabled:bg-slate-850 disabled:text-slate-600 p-3 rounded-xl transition text-slate-950 font-bold shrink-0 cursor-pointer active:scale-95 flex items-center justify-center shadow-md shadow-emerald-500/10"
          id="send-chat-btn"
          aria-label="Send message"
        >
          <Send className="w-4 h-4 text-slate-950" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
