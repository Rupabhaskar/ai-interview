"use client";

import { useEffect, useState } from "react";

/* ================================
   PDF TEXT EXTRACTION
================================ */
async function extractTextFromPDF(file) {
  if (!window.pdfjsLib) {
    alert("PDF.js not loaded");
    return "";
  }

  const buffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({
    data: buffer,
    disableWorker: true,
  }).promise;

  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((i) => i.str).join(" ") + "\n";
  }
  return text;
}

/* ================================
   RESUME ANALYSIS
================================ */
const STORAGE_KEY = "resumeAnalysisV1";

const SKILL_KEYWORDS = [
  "react",
  "next.js",
  "javascript",
  "node",
  "html",
  "css",
  "express",
  "typescript",
  "redux",
  "tailwind",
  "mongodb",
  "postgresql",
  "mysql",
  "graphql",
  "docker",
  "aws",
  "git",
  "jest",
  "cypress",
  "python",
];

const SECTION_HEADINGS = {
  summary: ["summary", "professional summary", "objective", "about me"],
  experience: [
    "experience",
    "work experience",
    "professional experience",
    "employment",
  ],
  education: ["education", "academic", "academics"],
  skills: ["skills", "technical skills", "core skills"],
  projects: ["projects", "project", "personal projects"],
  certifications: ["certifications", "certification", "licenses"],
  achievements: ["achievements", "awards", "honors"],
  languages: ["languages", "language"],
};

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "your",
  "you",
  "are",
  "was",
  "were",
  "have",
  "has",
  "had",
  "but",
  "not",
  "about",
  "into",
  "over",
  "such",
  "also",
  "their",
  "them",
  "our",
  "we",
  "they",
  "his",
  "her",
  "she",
  "him",
  "who",
  "what",
  "when",
  "where",
  "why",
  "how",
  "all",
  "any",
  "can",
  "will",
  "may",
  "more",
  "less",
  "per",
]);

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function extractMatches(text, regex) {
  const matches = text.match(regex);
  return matches ? Array.from(new Set(matches)) : [];
}

function extractEmails(text) {
  return extractMatches(
    text,
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
  );
}

function extractPhones(text) {
  return extractMatches(
    text,
    /(\+?\d{1,3}[\s.-]?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/g
  );
}

function extractUrls(text) {
  return extractMatches(text, /https?:\/\/[^\s]+/gi);
}

function extractYears(text) {
  return extractMatches(text, /\b(19|20)\d{2}\b/g).sort();
}

function extractSection(text, headings, allHeadings) {
  const lower = text.toLowerCase();
  let startIndex = -1;

  for (const heading of headings) {
    const regex = new RegExp(`\\b${escapeRegExp(heading)}\\b`, "i");
    const match = regex.exec(lower);
    if (match) {
      startIndex = match.index;
      break;
    }
  }

  if (startIndex < 0) return "";

  let endIndex = lower.length;
  const searchBase = lower.slice(startIndex + 1);

  for (const heading of allHeadings) {
    const regex = new RegExp(`\\b${escapeRegExp(heading)}\\b`, "i");
    const match = regex.exec(searchBase);
    if (match) {
      endIndex = Math.min(endIndex, startIndex + 1 + match.index);
    }
  }

  return text.slice(startIndex, endIndex).trim();
}

function extractSkillTokens(sectionText) {
  if (!sectionText) return [];
  const tokens = sectionText
    .split(/[,|/•\n]+/)
    .map((t) => t.replace(/[-–—]/g, " ").trim())
    .filter((t) => t.length > 1 && t.length < 40);

  const blacklist = new Set([
    "skills",
    "technical skills",
    "core skills",
  ]);

  return Array.from(
    new Set(tokens.filter((t) => !blacklist.has(t.toLowerCase())))
  );
}

function topKeywords(text, limit = 8) {
  const words = normalizeText(text)
    .toLowerCase()
    .split(" ")
    .map((w) => w.replace(/[^a-z0-9.+#]/g, ""))
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  const counts = new Map();
  words.forEach((w) => counts.set(w, (counts.get(w) || 0) + 1));

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

function summarizeText(text) {
  const sentences = text
    .replace(/\n+/g, " ")
    .split(/[.!?]\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return sentences.slice(0, 2).join(". ").trim();
}

function analyzeResume(text) {
  const lower = text.toLowerCase();
  return SKILL_KEYWORDS.filter((s) => lower.includes(s));
}

function buildAnalysis(text) {
  const normalized = normalizeText(text);
  const allHeadings = Object.values(SECTION_HEADINGS).flat();

  const sections = Object.fromEntries(
    Object.entries(SECTION_HEADINGS).map(([key, headings]) => [
      key,
      extractSection(text, headings, allHeadings),
    ])
  );

  const detectedSkills = analyzeResume(text);
  const sectionSkills = extractSkillTokens(sections.skills);
  const skills = Array.from(new Set([...detectedSkills, ...sectionSkills]));

  const analysis = {
    summary: summarizeText(text),
    stats: {
      wordCount: normalized ? normalized.split(" ").length : 0,
      charCount: normalized.length,
      topKeywords: topKeywords(text),
    },
    contact: {
      emails: extractEmails(text),
      phones: extractPhones(text),
      links: extractUrls(text),
    },
    years: extractYears(text),
    sections,
    skills,
  };

  return analysis;
}

/* ================================
   QUESTION GENERATION
================================ */
function generateQuestions(analysis) {
  const { skills, sections } = analysis;

  const resumeBased = [];
  const technical = [];

  if (skills.length > 0) {
    skills.forEach((skill) => {
      technical.push(
        `Tell me about a time you used ${skill} at work.`,
        `Walk me through a ${skill} feature you built — what was your approach?`,
        `What’s something you learned the hard way while working with ${skill}?`,
        `If you joined a new team using ${skill}, what would you check first?`
      );
    });
  } else {
    technical.push(
      "What are the technical skills you feel most confident in, and why?"
    );
  }

  if (sections.experience) {
    resumeBased.push(
      "Pick one role from your experience section and explain your impact."
    );
    resumeBased.push(
      "Describe a challenging situation in your experience and how you handled it."
    );
  } else {
    resumeBased.push(
      "Tell me about your most relevant work experience for this role."
    );
  }

  if (sections.projects) {
    resumeBased.push(
      "Describe one project from your resume and the trade-offs you made."
    );
    resumeBased.push(
      "What was your specific contribution to a project listed on your resume?"
    );
  } else {
    resumeBased.push(
      "Tell me about a project you are most proud of and why."
    );
  }

  if (sections.certifications) {
    resumeBased.push(
      "Which certification on your resume has been most valuable and why?"
    );
  } else {
    resumeBased.push(
      "Have you completed any certifications or courses relevant to this role?"
    );
  }

  if (sections.languages) {
    resumeBased.push(
      "How do you use your language skills in a professional setting?"
    );
  } else {
    resumeBased.push(
      "Do you work with multilingual teams or customers? How do you adapt?"
    );
  }

  if (sections.achievements) {
    resumeBased.push(
      "Tell me about one achievement on your resume and how you measured success."
    );
  } else {
    resumeBased.push(
      "What professional achievement are you most proud of?"
    );
  }

  const nonTechnical = [
    "Why does this role feel like a good fit for you right now?",
    "Tell me about a time you disagreed with a teammate — how did you handle it?",
    "How do you stay organized when you have multiple deadlines?",
    "Tell me about feedback you received that changed how you work.",
  ];

  const combined = [...technical, ...resumeBased, ...nonTechnical];
  return combined.slice(0, 15);
}

/* ================================
   COMPONENT
================================ */
export default function ResumeAnalyzer({ onReady }) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [storedQuestions, setStoredQuestions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      setAnalysis(parsed.analysis || null);
      setExtractedText(parsed.text || "");
      setStoredQuestions(parsed.questions || []);
    } catch (err) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const text = await extractTextFromPDF(file);
      if (!text.trim()) {
        throw new Error("No readable text found in this PDF.");
      }
      const resumeAnalysis = buildAnalysis(text);
      const questions = generateQuestions(resumeAnalysis);

      const payload = {
        text,
        analysis: resumeAnalysis,
        questions,
        updatedAt: new Date().toISOString(),
        fileName: file.name,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

      setExtractedText(text);
      setAnalysis(resumeAnalysis);
      setStoredQuestions(questions);

      onReady({
        skills: resumeAnalysis.skills,
        questions,
        analysis: resumeAnalysis,
        text,
      });
    } catch (err) {
      setError(err.message || "Unable to analyze this resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow">
        <h1 className="text-xl font-bold mb-4 text-center">
          Upload Resume
        </h1>

        <input
          type="file"
          accept="application/pdf"
          onChange={handleUpload}
          className="w-full text-sm"
        />

        {loading && (
          <p className="text-sm text-gray-500 mt-3 text-center">
            Analyzing resume…
          </p>
        )}

        {error && (
          <p className="text-sm text-red-500 mt-3 text-center">{error}</p>
        )}
      </div>

      {analysis && (
        <button
          onClick={() => {
            localStorage.removeItem(STORAGE_KEY);
            setAnalysis(null);
            setExtractedText("");
            setStoredQuestions([]);
          }}
          className="mt-4 text-xs text-red-600 hover:underline"
        >
          Clear stored resume
        </button>
      )}

      {analysis && storedQuestions.length > 0 && (
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem(STORAGE_KEY);
            setAnalysis(null);
            setExtractedText("");
            setStoredQuestions([]);
          }}
          className="mt-2 text-[11px] text-gray-400 hover:text-red-600"
        >
          Clear debug data
        </button>
      )}
    </div>
  );
}
