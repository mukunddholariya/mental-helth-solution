import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. AI features will fail.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY_FOR_BUILD",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. Journal Analysis Endpoint
app.post("/api/journal/analyze", async (req, res) => {
  try {
    const { text, examType, studentName } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Journal text is required" });
    }

    const ai = getAiClient();
    const systemPrompt = `You are a warm, highly empathetic clinical/academic psychologist and wellness counselor customized for Indian competitive exam aspirants (JEE, NEET, UPSC, CA, CAT, GATE, etc.). 
Analyze the provided student student journal entry. Diagnose their emotional state, stress severity, core triggers, and identify appropriate coping strategies.`;

    const userPrompt = `Student Name: ${studentName || "Aspirant"}
Exam Type: ${examType || "Competitive Exams"}
Journal Entry: "${text}"

Analyze this journal entry and extract the structured information specified in the response schema. Keep the coping suggestions highly practical, actionable, and non-judgmental (specific to the pressures of ${examType}).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["emotion", "stressLevel", "triggers", "copingCategory", "copingText", "empathyQuote"],
          properties: {
            emotion: {
              type: Type.STRING,
              description: "The primary dominant emotion, e.g., 'Anxious', 'Burnt Out', 'Overwhelmed', 'Doubtful', 'Demotivated', 'Guilty', 'Calm', 'Hopeful'."
            },
            stressLevel: {
              type: Type.INTEGER,
              description: "A stress score from 1 to 10 (1 = extremely calm, 10 = critical crisis/panic stress)."
            },
            triggers: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Specific triggers detected in student entry, e.g., 'Physics Backlog', 'Mock test score', 'Parental comparisons', 'Lack of sleep', 'Fear of failure', 'Procrastination'."
            },
            copingCategory: {
              type: Type.STRING,
              description: "Category of stress for custom exercises. Must be one of: 'academic_overload', 'anxiety_panic', 'low_motivation', 'burnout', 'peer_pressure', 'general_stress'."
            },
            copingText: {
              type: Type.STRING,
              description: "A short, actionable step-by-step coaching mental exercise or structural solution tailored specifically to their journal content. E.g., dynamic box breathing steps, chunking physics backlog into three 20-minute sessions today, etc."
            },
            empathyQuote: {
              type: Type.STRING,
              description: "An incredibly comforting, warm, deeply psychological response validating their feelings without toxic positivity. E.g., 'It is completely valid to feel exhausted when tackling such a vast syllabus. You are carrying a lot, but you do not have to carry it all perfectly today.'"
            }
          }
        }
      }
    });

    const parsedResult = JSON.parse(response.text || "{}");
    res.json(parsedResult);
  } catch (error: any) {
    console.error("Error analyzing journal entry:", error);
    res.status(500).json({ 
      error: "Failed to analyze journal entry from server.", 
      details: error.message 
    });
  }
});

// 2. Empathetic Companion Chat (Manas) Endpoint
app.post("/api/chat/companion", async (req, res) => {
  try {
    const { messages, examType, studentName, recentAnalysis } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Message history is required" });
    }

    const ai = getAiClient();

    // Prepare system prompt for Manas with student context
    const contextStr = `The student is ${studentName || "an aspirant"} preparing for the highly competitive ${examType || "Competitive Exams"}.
${recentAnalysis ? `Their latest journal entry indicates they are feeling "${recentAnalysis.emotion}" with a stress level of ${recentAnalysis.stressLevel}/10. Current triggers include: ${recentAnalysis.triggers ? recentAnalysis.triggers.join(", ") : "N/A"}.` : ""}`;

    const systemInstruction = `You are Manas - a warm, deeply empathetic AI wellness companion for Indian students preparing for intense competitive exams like JEE, NEET, UPSC, CAT, GATE, CUET, and boards.
You are a mentor and mental wellness anchor, NOT a clinical replacement. You never give dry, bulleted textbook lists or dismissive advice. Under no circumstances should you use toxic positivity (e.g. saying 'just stay positive' or 'be happy').
Instead, follow these guidelines:
1. Empathy and validation first: Always validate their intense exhaustion, exam anxiety, parental pressure, or syllabus overwhelm immediately. Say things which let them feel heard.
2. Context Aware: You understand the severe stakes of Indian exams, such as long coaching hours, vast reference books (HC Verma, Irodov, NCERT, Laxmikanth, etc.), mock test rankings, the feeling of backlogs, and parental sacrifices. Use this familiarity naturally.
3. Conversational and Interactive: Ask gentle follow-up questions to invite them to express how they feel rather than lecturing. Keep responses human, split into 2-3 readable paragraph chunks.
4. One Actionable Step: Always end with exactly one small, tiny, manageable action (e.g., 'How about we just drink a glass of water and try a 2-minute posture stretch right now?' or 'Could we write down just one topic you feel good about?').
5. Safe Escalation: If you notice signs of self-harm, hopelessness, or suicide, suggest they take a breath and contact supportive numbers, e.g., iCall (9152987821) or Vandrevala Foundation (9999 666 555) immediately, with care.

Current Student Profile Context:
${contextStr}`;

    // Map message history into Gemini chat contents array
    // Ensure we handle role translation, start with 'user' and alternate correctly
    const sanitizeMessages = (rawMsgs: any[]) => {
      const sanitized: { role: "user" | "model"; parts: { text: string }[] }[] = [];
      
      // Filter out leading model/system messages
      const firstUserIndex = rawMsgs.findIndex(m => m.role === "user");
      const relevantMsgs = firstUserIndex !== -1 ? rawMsgs.slice(firstUserIndex) : rawMsgs;

      relevantMsgs.forEach((msg) => {
        const transRole: "user" | "model" = msg.role === "user" ? "user" : "model";
        if (sanitized.length === 0) {
          if (transRole === "user") {
            sanitized.push({ role: "user", parts: [{ text: msg.text }] });
          }
        } else {
          const lastTurn = sanitized[sanitized.length - 1];
          if (lastTurn.role === transRole) {
            lastTurn.parts[0].text += `\n\n${msg.text}`;
          } else {
            sanitized.push({ role: transRole, parts: [{ text: msg.text }] });
          }
        }
      });

      // If empty, supply a baseline first message
      if (sanitized.length === 0) {
        sanitized.push({ role: "user", parts: [{ text: "Hello" }] });
      }
      return sanitized;
    };

    const contents = sanitizeMessages(messages);

    // Generate companion response
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
        topP: 0.95
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error inside Manas companion chatbot:", error);
    res.status(500).json({ 
      error: "Manas companion is briefly unavailable.", 
      details: error.message 
    });
  }
});

// Serve frontend build and Vite development setup
const run = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

run();
