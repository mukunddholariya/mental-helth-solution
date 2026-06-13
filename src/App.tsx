import React, { useState } from "react";
import Onboarding from "@/src/features/onboarding/components/OnboardingView";
import DailyJournal from "@/src/features/journal/components/DailyJournalView";
import CompanionChat from "@/src/features/chat/components/CompanionChatView";
import MindfulnessHub from "@/src/features/mindfulness/components/MindfulnessHubView";
import AnalyticsTrends from "@/src/features/trends/components/AnalyticsTrendsView";
import HelplineModal from "@/src/components/shared/HelplineModal";
import { UserProfile, JournalEntry, ChatMessage, JournalAnalysis } from "@/src/types";
import { EXAM_OPTIONS } from "@/src/data";
import { useLocalStorage } from "@/src/hooks/useLocalStorage";
import { Card } from "@/src/components/shared/Card";
import { Button } from "@/src/components/shared/Button";
import { InputField } from "@/src/components/shared/InputField";
import {
  Sparkles,
  BrainCircuit,
  MessageSquare,
  Wind,
  TrendingUp,
  Settings2,
  ShieldAlert,
  Heart,
  Calendar,
  Smile,
  RefreshCw,
  LogOut,
  User,
  CheckCircle,
  HelpCircle
} from "lucide-react";

export default function App() {
  // 1. Load profile settings from custom hook
  const [profile, setProfile] = useLocalStorage<UserProfile | null>("manas_profile", null);

  // 2. Load journals list from custom hook
  const [journals, setJournals] = useLocalStorage<JournalEntry[]>("manas_journals", []);

  // 3. Load chat logs from custom hook
  const [chatMessages, setChatMessages] = useLocalStorage<ChatMessage[]>("manas_chat", []);

  // 4. Interface state control hooks
  const [activeTab, setActiveTab] = useState<"journal" | "chat" | "mindfulness" | "trends">("journal");
  const [isHelplineOpen, setIsHelplineOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile | null>(null);

  // Handle onboarding callback
  const handleOnboardingComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    // Inject custom initial warm greetings inside Manas conversations list
    const initialGreet: ChatMessage = {
      id: "initial-greet",
      role: "model",
      text: `Hello, **${newProfile.name}**! 🌸 I am **Manas**, your dedicated exam-wellness partner through the intense journey of preparing for the highly challenging **${newProfile.examType}** exam. 

I know how vast this syllabus is, how heavy mock test grades feel, and how intense peer comparison can get. I am here to listen. 

Please offload your thoughts anytime in your **Daily Journal Check-in**, try our visual **Guided Breathing coach** inside the Exercise Center, or speak with me right here. How is your focus today? Let's tackle it one step at a time.`,
      timestamp: new Date().toISOString()
    };
    setChatMessages([initialGreet]);
  };

  // Add a message into history
  const handleAddChatMessage = (msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  };

  const handleClearChatHistory = () => {
    if (window.confirm("Are you sure you want to clear your conversation history with Manas?")) {
      const refreshedGreet: ChatMessage = {
        id: `refresh-${Date.now()}`,
        role: "model",
        text: `History cleared successfully. Understood. I am here, **${profile?.name || "Aspirant"}**, ready to write a fresh chapter of preparation wellness. How are your focus coordinates right now?`,
        timestamp: new Date().toISOString()
      };
      setChatMessages([refreshedGreet]);
    }
  };

  const handleSaveJournalEntry = (entry: JournalEntry) => {
    setJournals((prev) => [entry, ...prev]);
  };

  // Transition from journal card results directly into active companion chat
  const handleStartChatFromAnalysis = (analysis: JournalAnalysis) => {
    const contextualMessage: ChatMessage = {
      id: `ctx-${Date.now()}`,
      role: "model",
      text: `Thank you for sharing your thoughts in the journal. I see you are holding a lot of emotional density right now, feeling **${analysis.emotion}** (Stress Index: ${analysis.stressLevel}/10). 

We detected these triggers: **${analysis.triggers.join(", ") || "syllabus loads"}**. 

Please know your breathing and emotional stamina is what makes clearing competitive papers possible. Let's process this stress. How can I help support you?`,
      timestamp: new Date().toISOString()
    };
    setChatMessages((prev) => [...prev, contextualMessage]);
    setActiveTab("chat");
  };

  // Profile Edit controls
  const handleOpenEditProfile = () => {
    if (profile) {
      setTempProfile({ ...profile });
      setIsEditingProfile(true);
    }
  };

  const handleSaveEditedProfile = () => {
    if (tempProfile && tempProfile.name.trim()) {
      setProfile({ ...tempProfile });
      setIsEditingProfile(false);
    } else {
      alert("Please specify a valid name.");
    }
  };

  const handleFactoryReset = () => {
    if (window.confirm("Are you sure you want to completely erase all data? This deletes your onboarding setup, all journal logs, and chats. This operation is irreversible!")) {
      localStorage.clear();
      setProfile(null);
      setJournals([]);
      setChatMessages([]);
      setActiveTab("journal");
      setIsEditingProfile(false);
    }
  };

  // Onboarding gate render
  if (!profile || !profile.onboardingCompleted) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Active dashboard view coordinate mapping
  const latestJournal = journals[0] || null;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950" id="manas-workspace-root">
      {/* Decorative background gradients */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main header navbar */}
      <header className="bg-slate-950/80 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md px-4 sm:px-6 py-4" id="app-navbar">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4" id="navbar-content">
          {/* Logo and Exam Tracker title */}
          <div className="flex items-center gap-3" id="brand-indicator">
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-slate-950 font-display font-extrabold text-xl shadow-lg shadow-emerald-500/10">
              M
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white font-display tracking-tight flex items-center gap-1.5">
                Mental Wellness Tracker
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-sans mt-0.5">
                <span>Aspirant: <strong>{profile.name}</strong></span>
                <span className="w-1.5 h-1.5 bg-slate-700 rounded-full"></span>
                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wide">
                  {EXAM_OPTIONS.find((e) => e.id === profile.examType)?.name.split(" ")[0] || profile.examType}
                </span>
              </div>
            </div>
          </div>

          {/* Quick interactive utility links */}
          <div className="flex flex-wrap items-center justify-center gap-3" id="navbar-right-utilities">
            {/* Quick edits settings */}
            <button
              onClick={handleOpenEditProfile}
              className="text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer hover:border-slate-700"
              id="edit-profile-action"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>

            {/* Helpline quick center alert anchor */}
            <button
              onClick={() => setIsHelplineOpen(true)}
              className="text-xs text-rose-300 hover:text-rose-200 bg-rose-950/40 border border-rose-500/20 hover:border-rose-500/50 px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer font-bold shrink-0 animate-pulse"
              id="helplines-modal-trigger-btn"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Get Helplines 📞</span>
            </button>
          </div>
        </div>
      </header>

      {/* Profile Modification Inline Dialog Modal */}
      {isEditingProfile && tempProfile && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 selection:bg-teal-500 selection:text-slate-950" id="profile-edit-modal">
          <Card variant="glowing" glowColor="emerald" className="w-full max-w-md p-6" id="profile-edit-card">
            <h3 className="text-white font-extrabold text-base font-display mb-4">Edit Aspirant Coordinates</h3>
            
            <div className="space-y-4 font-sans" id="edit-profile-inputs">
              <InputField
                label="Change Name"
                type="text"
                value={tempProfile.name}
                error={!tempProfile.name.trim() ? "Profile name cannot remain empty." : undefined}
                onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
              />

              <div id="edit-profile-exam-select" className="space-y-1.5 w-full font-sans">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Focus Competitive Exam
                </label>
                <select
                  value={tempProfile.examType}
                  onChange={(e) => setTempProfile({ ...tempProfile, examType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm py-2.5 px-4 focus:outline-none focus:border-emerald-500/60 transition appearance-none cursor-pointer"
                >
                  {EXAM_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-slate-900">{opt.name}</option>
                  ))}
                </select>
              </div>

              <InputField
                label="Change TARGET Date"
                type="date"
                value={tempProfile.examDate}
                error={!tempProfile.examDate ? "Expected exam date is required." : undefined}
                onChange={(e) => setTempProfile({ ...tempProfile, examDate: e.target.value })}
              />
            </div>

            {/* Action buttons inside edit profile */}
            <div className="flex items-center justify-between gap-3 mt-6 border-t border-slate-800 pt-4" id="edit-profile-buttons-row">
              <button
                onClick={handleFactoryReset}
                className="text-xs text-rose-400 hover:text-rose-350 font-bold hover:underline transition uppercase tracking-wider cursor-pointer font-sans"
                id="profile-factory-reset-action"
              >
                Erase All Data
              </button>

              <div className="flex gap-2">
                <Button
                  onClick={() => setIsEditingProfile(false)}
                  variant="ghost"
                  size="sm"
                  id="cancel-edit"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEditedProfile}
                  variant="primary"
                  size="sm"
                  disabled={!tempProfile.name.trim() || !tempProfile.examDate}
                  id="save-edit-btn"
                >
                  Save Coordinates
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Main Navigation tabs bar */}
      <nav className="bg-slate-950 border-b border-slate-850 sticky top-[73px] sm:top-[73px] z-30 shrink-0" id="app-nav-tabs">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-none flex" id="tabs-inner">
          <button
            onClick={() => setActiveTab("journal")}
            className={`py-3.5 px-4 font-display font-bold text-xs uppercase tracking-wider border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              activeTab === "journal"
                ? "border-emerald-400 text-emerald-400 bg-emerald-500/[0.02]"
                : "border-transparent text-slate-400 hover:text-slate-250"
            }`}
            id="tab-btn-journal"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Daily check-in</span>
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`py-3.5 px-4 font-display font-bold text-xs uppercase tracking-wider border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              activeTab === "chat"
                ? "border-emerald-400 text-emerald-400 bg-emerald-500/[0.02]"
                : "border-transparent text-slate-400 hover:text-slate-250"
            }`}
            id="tab-btn-chat"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Manas Chat companion</span>
          </button>

          <button
            onClick={() => setActiveTab("mindfulness")}
            className={`py-3.5 px-4 font-display font-bold text-xs uppercase tracking-wider border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              activeTab === "mindfulness"
                ? "border-emerald-400 text-emerald-400 bg-emerald-500/[0.02]"
                : "border-transparent text-slate-400 hover:text-slate-250"
            }`}
            id="tab-btn-mindfulness"
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Mindfulness Gym</span>
          </button>

          <button
            onClick={() => setActiveTab("trends")}
            className={`py-3.5 px-4 font-display font-bold text-xs uppercase tracking-wider border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              activeTab === "trends"
                ? "border-emerald-400 text-emerald-400 bg-emerald-500/[0.02]"
                : "border-transparent text-slate-400 hover:text-slate-250"
            }`}
            id="tab-btn-trends"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Stress analytics</span>
          </button>
        </div>
      </nav>

      {/* Primary responsive workspace zone */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8" id="manas-active-view-port">
        <div className="w-full bg-slate-900 border border-slate-800/60 p-6 md:p-8 rounded-2xl" id="active-panel">
          {activeTab === "journal" && (
            <DailyJournal
              examType={profile.examType}
              studentName={profile.name}
              onSaveEntry={handleSaveJournalEntry}
              onStartChat={handleStartChatFromAnalysis}
            />
          )}

          {activeTab === "chat" && (
            <CompanionChat
              examType={profile.examType}
              studentName={profile.name}
              recentAnalysis={latestJournal?.analysis}
              messages={chatMessages}
              onAddMessage={handleAddChatMessage}
              onClearHistory={handleClearChatHistory}
            />
          )}

          {activeTab === "mindfulness" && (
            <MindfulnessHub examType={profile.examType} />
          )}

          {activeTab === "trends" && (
            <AnalyticsTrends
              entries={journals}
              examType={profile.examType}
              examDate={profile.examDate}
            />
          )}
        </div>
      </main>

      {/* Persistent mini informational bar footer */}
      <footer className="bg-slate-950 border-t border-slate-850 px-4 py-3 shrink-0" id="app-footer">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[10px] text-slate-500" id="footer-content">
          <span>🛡️ Verified Local Storage Vault active. Your journal is secret and safe on device.</span>
          <span>Designed with Empathy for Competitive Exam Aspirants · 2026</span>
        </div>
      </footer>

      {/* Floating emergency helpline drawer modal */}
      <HelplineModal isOpen={isHelplineOpen} onClose={() => setIsHelplineOpen(false)} />
    </div>
  );
}
