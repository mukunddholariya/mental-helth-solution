import { Affirmation } from "./types";

export const EXAM_OPTIONS = [
  { id: "JEE", name: "JEE (Engineering)" },
  { id: "NEET", name: "NEET (Pre-Medical)" },
  { id: "UPSC", name: "UPSC CSE (Civil Services)" },
  { id: "CAT", name: "CAT / GMAT (Management)" },
  { id: "GATE", name: "GATE (Post-Graduation)" },
  { id: "CUET", name: "CUET / Boards (Undergraduate)" },
  { id: "Boards", name: "Class 10/12 Board Exams" },
  { id: "Other", name: "Other Competitive Exam" }
];

export const STUDENT_HELPLINES = [
  {
    name: "iCall (TISS Helpline)",
    number: "9152987821",
    hours: "Mon-Sat: 10 AM to 8 PM",
    description: "Free, confidential telephone and email based counseling service run by professional counsellors.",
  },
  {
    name: "Vandrevala Foundation",
    number: "9999666555",
    hours: "24x7 Available",
    description: "Round-the-clock free counseling support provided by trained mental health experts.",
  },
  {
    name: "NIMHANS Toll Free Line",
    number: "080-46110007",
    hours: "24x7 Available",
    description: "National Institute of Mental Health and Neurosciences dedicated support line."
  }
];

export const BREATHING_PATTERNS = [
  {
    id: "box",
    name: "Box Breathing",
    description: "Excellent for intense anxiety, racing thoughts, or immediate panic control.",
    inhale: 4,
    holdIn: 4,
    exhale: 4,
    holdOut: 4,
  },
  {
    id: "relax",
    name: "4-7-8 Deep Focus",
    description: "Calms the nervous system, helpful for transitioning into deep study sessions or sleep.",
    inhale: 4,
    holdIn: 7,
    exhale: 8,
    holdOut: 0,
  },
  {
    id: "equal",
    name: "Balanced Flow (5-0-5)",
    description: "A gentle rhythm to steady erratic heartbeats and improve mental clarity.",
    inhale: 5,
    holdIn: 0,
    exhale: 5,
    holdOut: 0,
  }
];

export const DEFAULT_AFFIRMATIONS: Record<string, Affirmation[]> = {
  JEE: [
    { text: "Your worth is not defined by raw mock percentile ranks. Your determination matters.", author: "Manas Compassion Guide" },
    { text: "Take this syllabus one concept, one numerical at a time. The final result is a journey, not a single snapshot.", author: "HC Verma Mentorship Reflection" },
    { text: "Calculus and physics require a calm brain. Rest is an essential part of active problem-solving skills.", author: "Aspirant Guide" }
  ],
  NEET: [
    { text: "A compassionate, great doctor starts by learning to show self-compassion first.", author: "Manas Compassion Guide" },
    { text: "Remember why you started this journey. You are studying to heal lives, not just clear an MCQ cutoff.", author: "Biology Concept Guide" },
    { text: "Your brain integrates complex anatomical and biochemical pathways best when you give it quality sleep.", author: "Medical Aspirant Anchor" }
  ],
  UPSC: [
    { text: "The vastness of Indian administration requires a resilient spirit, not a perfect mind. Take a breath.", author: "Manas Compassion Guide" },
    { text: "One answer file, one essay, one editorial. True steel is forged daily in consistency, not overnight panic.", author: "Civil Services Anchor" },
    { text: "Keep a perspective of the country you want to serve, but do not neglect the person you are right now.", author: "Administrator Mentor" }
  ],
  CAT: [
    { text: "High-stakes percentiles require absolute mental agility. Clarity is maximized of a tranquil baseline.", author: "Manas Compassion Guide" },
    { text: "A strategic leader manages energy, not just hours. Schedule mandatory rest periods without guilt.", author: "Management Mentor" }
  ],
  GATE: [
    { text: "Complex systems engineering calls for an unhurried perspective. Breathe out the heavy overload.", author: "Manas Compassion Guide" },
    { text: "Your research and engineering competence are deep skills. Trust your practice, one problem code at a time.", author: "Tech Grad Council" }
  ],
  Cuet: [
    { text: "This transition period is a chapter of self-discovery. You are capable of thriving in whatever comes next.", author: "Student Anchor" }
  ],
  Default: [
    { text: "Your mind is a muscle that performs best when it is allowed to recharge. Take a brief break without apologizing.", author: "Manas Compassion Guide" },
    { text: "This exam prep is a temporary phase of life. It is not the final verdict of your intelligence or future.", author: "Mental Resilience Mentor" },
    { text: "One step, one page, one hour of effort. Celebrate these micro-victories. They build true confidence.", author: "Aspirant Mental Health Initiative" }
  ]
};

export const MOOD_EMOJIS = [
  { emoji: "😔", label: "Low / Exhausted", score: 2 },
  { emoji: "😰", label: "Anxious / Panicked", score: 4 },
  { emoji: "😐", label: "Overwhelmed / Stressed", score: 5 },
  { emoji: "🙂", label: "Focusing", score: 7 },
  { emoji: "✨", label: "Hopeful / Confident", score: 9 }
];
