import { describe, it, expect, vi, beforeEach } from "vitest";
import { analyzeJournal, sendCompanionChat } from "./api";
import { JournalAnalysis } from "../types";

describe("API Client Services", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("analyzeJournal should make a POST request with correct payload and return analyzed data", async () => {
    const mockAnalysisOutput: JournalAnalysis = {
      emotion: "Anxious",
      stressLevel: 7,
      triggers: ["Syllabus weight", "Mock test scores"],
      copingCategory: "academic_overload",
      copingText: "Take 5 slow breaths and break down the syllabus into three tiny segments.",
      empathyQuote: "You are doing incredibly well. Your worth is not defined by raw scores."
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockAnalysisOutput
    });
    vi.stubGlobal("fetch", mockFetch);

    const payload = {
      text: "I feel very stressed about my physics backlog.",
      examType: "JEE",
      studentName: "Mukund"
    };

    const result = await analyzeJournal(payload);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith("/api/journal/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    expect(result).toEqual(mockAnalysisOutput);
  });

  it("analyzeJournal should throw an error if the status is not ok", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false
    });
    vi.stubGlobal("fetch", mockFetch);

    const payload = {
      text: "Overwhelmed...",
      examType: "NEET",
      studentName: "Priya"
    };

    await expect(analyzeJournal(payload)).rejects.toThrow("Analysis failed. Server returned an error.");
  });

  it("sendCompanionChat should make a POST request and return a generated response", async () => {
    const mockChatOutput = { text: "I hear you, Priya. NEET syllabus is vast, let us focus together." };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockChatOutput
    });
    vi.stubGlobal("fetch", mockFetch);

    const payload = {
      messages: [{ role: "user", text: "How to deal with biology bulk facts?" }],
      examType: "NEET",
      studentName: "Priya",
      recentAnalysis: null
    };

    const result = await sendCompanionChat(payload);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith("/api/chat/companion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    expect(result).toEqual(mockChatOutput);
  });

  it("sendCompanionChat should throw an error if status is not ok", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false
    });
    vi.stubGlobal("fetch", mockFetch);

    const payload = {
      messages: [{ role: "user", text: "Hello" }],
      examType: "Boards",
      studentName: "Rohan",
      recentAnalysis: null
    };

    await expect(sendCompanionChat(payload)).rejects.toThrow("Companion API returned an error");
  });
});
