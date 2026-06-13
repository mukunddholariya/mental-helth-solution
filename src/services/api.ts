import { JournalAnalysis, ChatMessage } from "@/src/types";

export interface JournalAnalyzePayload {
  text: string;
  examType: string;
  studentName: string;
}

export interface ChatCompanionPayload {
  messages: { role: string; text: string }[];
  examType: string;
  studentName: string;
  recentAnalysis: JournalAnalysis | null;
}

export async function analyzeJournal(payload: JournalAnalyzePayload): Promise<JournalAnalysis> {
  const response = await fetch("/api/journal/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Analysis failed. Server returned an error.");
  }

  return response.json();
}

export async function sendCompanionChat(payload: ChatCompanionPayload): Promise<{ text: string }> {
  const response = await fetch("/api/chat/companion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Companion API returned an error");
  }

  return response.json();
}
