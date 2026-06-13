export interface UserProfile {
  name: string;
  examType: string;
  examDate: string; // YYYY-MM-DD
  onboardingCompleted: boolean;
}

export interface JournalAnalysis {
  emotion: string;
  stressLevel: number; // 1-10
  triggers: string[];
  copingCategory: 'academic_overload' | 'anxiety_panic' | 'low_motivation' | 'burnout' | 'peer_pressure' | 'general_stress';
  copingText: string;
  empathyQuote: string;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO String
  text: string;
  moodEmoji: string;
  moodLabel: string;
  analysis?: JournalAnalysis;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string; // ISO String
}

export interface Affirmation {
  text: string;
  author: string;
  specialty?: string;
}
