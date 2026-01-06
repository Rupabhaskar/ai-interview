// // // "use client";

// // // import { useState } from "react";

// // // /* ================================
// // //    PDF TEXT EXTRACTION (CDN)
// // // ================================ */
// // // async function extractTextFromPDF(file) {
// // //   if (!window.pdfjsLib) {
// // //     alert("PDF.js not loaded");
// // //     return "";
// // //   }

// // //   const pdfjsLib = window.pdfjsLib;
// // //   pdfjsLib.GlobalWorkerOptions.workerSrc = null;

// // //   const buffer = await file.arrayBuffer();
// // //   const pdf = await pdfjsLib.getDocument({
// // //     data: buffer,
// // //     disableWorker: true,
// // //   }).promise;

// // //   let text = "";
// // //   for (let i = 1; i <= pdf.numPages; i++) {
// // //     const page = await pdf.getPage(i);
// // //     const content = await page.getTextContent();
// // //     text += content.items.map((i) => i.str).join(" ") + "\n";
// // //   }
// // //   return text;
// // // }

// // // /* ================================
// // //    RESUME ANALYSIS
// // // ================================ */
// // // const SKILL_KEYWORDS = [
// // //   "react",
// // //   "next.js",
// // //   "javascript",
// // //   "node",
// // //   "html",
// // //   "css",
// // //   "express",
// // // ];

// // // function analyzeResume(text) {
// // //   const lower = text.toLowerCase();
// // //   return SKILL_KEYWORDS.filter((s) => lower.includes(s));
// // // }

// // // /* ================================
// // //    QUESTION GENERATION
// // // ================================ */
// // // function generateQuestions(skills) {
// // //   const skillBased = skills.flatMap((s) => [
// // //     `Explain your experience with ${s}.`,
// // //     `What challenges did you face while using ${s}?`,
// // //   ]);

// // //   const technical = skills.map(
// // //     (s) => `Explain a technical concept related to ${s}.`
// // //   );

// // //   const communication = [
// // //     "Introduce yourself.",
// // //     "Explain a complex topic in simple words.",
// // //     "Describe a challenge you faced and how you solved it.",
// // //     "How do you handle feedback?",
// // //     "How do you communicate in a team?",
// // //   ];

// // //   return [...skillBased, ...technical, ...communication].slice(0, 15);
// // // }

// // // /* ================================
// // //    SCORING LOGIC
// // // ================================ */
// // // function grammarAndEnglishScore(text) {
// // //   const words = text.split(" ").length;
// // //   const sentences = text.split(/[.!?]/).length;

// // //   const grammar = Math.max(10 - Math.abs(sentences - 3), 4);
// // //   const english = Math.min(10, Math.max(4, words / 5));

// // //   return { grammar, english };
// // // }

// // // function meaningScore(text) {
// // //   const fillers = ["um", "uh", "like", "you know"];
// // //   const fillerCount = fillers.filter((f) =>
// // //     text.toLowerCase().includes(f)
// // //   ).length;

// // //   let score = 8;
// // //   if (text.length < 50) score -= 2;
// // //   if (fillerCount > 2) score -= 2;

// // //   return Math.max(score, 3);
// // // }

// // // function technicalScore(text, skills) {
// // //   const lower = text.toLowerCase();
// // //   let matched = 0;

// // //   skills.forEach((s) => {
// // //     if (lower.includes(s)) matched++;
// // //   });

// // //   return Math.min(10, matched * 2);
// // // }

// // // /* ================================
// // //    MAIN COMPONENT
// // // ================================ */
// // // export default function InterviewPage() {
// // //   const [questions, setQuestions] = useState([]);
// // //   const [skills, setSkills] = useState([]);
// // //   const [current, setCurrent] = useState(0);
// // //   const [answer, setAnswer] = useState("");
// // //   const [results, setResults] = useState([]);
// // //   const [started, setStarted] = useState(false);
// // //   const [loading, setLoading] = useState(false);
// // //   const [showDetails, setShowDetails] = useState(false);

// // //   const handleResumeUpload = async (e) => {
// // //     const file = e.target.files[0];
// // //     if (!file) return;

// // //     setLoading(true);
// // //     const text = await extractTextFromPDF(file);
// // //     const detectedSkills = analyzeResume(text);

// // //     setSkills(detectedSkills);
// // //     setQuestions(generateQuestions(detectedSkills));
// // //     setStarted(true);
// // //     setLoading(false);
// // //   };

// // //   const submitAnswer = () => {
// // //     const { grammar, english } = grammarAndEnglishScore(answer);
// // //     const meaning = meaningScore(answer);
// // //     const technical = technicalScore(answer, skills);

// // //     setResults([
// // //       ...results,
// // //       {
// // //         question: questions[current],
// // //         grammar,
// // //         english,
// // //         meaning,
// // //         technical,
// // //       },
// // //     ]);

// // //     setAnswer("");
// // //     setCurrent(current + 1);
// // //   };

// // //   /* ================================
// // //      FINAL SCORE CALCULATION
// // //   ================================ */
// // //   const average = (key) =>
// // //     (
// // //       results.reduce((sum, r) => sum + r[key], 0) / results.length
// // //     ).toFixed(1);

// // //   const finalScore =
// // //     (
// // //       (Number(average("grammar")) +
// // //         Number(average("english")) +
// // //         Number(average("meaning")) +
// // //         Number(average("technical"))) /
// // //       4
// // //     ).toFixed(1);

// // //   /* ================================
// // //      UI STATES
// // //   ================================ */

// // //   if (!started) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center p-6">
// // //         <div className="bg-white p-6 rounded shadow max-w-md w-full">
// // //           <h1 className="text-xl font-bold mb-4">
// // //             Upload Resume PDF
// // //           </h1>
// // //           <input
// // //             type="file"
// // //             accept="application/pdf"
// // //             onChange={handleResumeUpload}
// // //           />
// // //           {loading && (
// // //             <p className="text-sm text-gray-600 mt-2">
// // //               Analyzing resume...
// // //             </p>
// // //           )}
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   if (current >= questions.length) {
// // //     return (
// // //       <div className="p-6 max-w-3xl mx-auto">
// // //         <h2 className="text-2xl font-bold mb-6">
// // //           Final Interview Score
// // //         </h2>

// // //         {/* ===== SCORE SHEET ===== */}
// // //         <div className="grid grid-cols-2 gap-4 mb-6">
// // //           <div className="border p-4 rounded">
// // //             Grammar: {average("grammar")}/10
// // //           </div>
// // //           <div className="border p-4 rounded">
// // //             English: {average("english")}/10
// // //           </div>
// // //           <div className="border p-4 rounded">
// // //             Meaning: {average("meaning")}/10
// // //           </div>
// // //           <div className="border p-4 rounded">
// // //             Technical: {average("technical")}/10
// // //           </div>
// // //         </div>

// // //         <div className="text-xl font-bold mb-4">
// // //           Final Score: {finalScore}/10
// // //         </div>

// // //         {/* ===== DETAILS BUTTON ===== */}
// // //         <button
// // //           onClick={() => setShowDetails(!showDetails)}
// // //           className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
// // //         >
// // //           {showDetails ? "Hide Details" : "Know More (View Details)"}
// // //         </button>

// // //         {/* ===== DETAILED SCORES ===== */}
// // //         {showDetails && (
// // //           <div>
// // //             {results.map((r, i) => (
// // //               <div key={i} className="border p-4 mb-4 rounded">
// // //                 <p className="font-semibold mb-2">
// // //                   Q{i + 1}. {r.question}
// // //                 </p>
// // //                 <p>Grammar: {r.grammar}/10</p>
// // //                 <p>English: {r.english}/10</p>
// // //                 <p>Meaning: {r.meaning}/10</p>
// // //                 <p>Technical: {r.technical}/10</p>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         )}
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="min-h-screen flex items-center justify-center p-6">
// // //       <div className="bg-white p-6 rounded shadow max-w-xl w-full">
// // //         <p className="text-sm text-gray-500 mb-1">
// // //           Question {current + 1} of {questions.length}
// // //         </p>

// // //         <p className="text-lg font-semibold mb-4">
// // //           {questions[current]}
// // //         </p>

// // //         <textarea
// // //           className="w-full border p-3 mb-4"
// // //           rows="5"
// // //           value={answer}
// // //           onChange={(e) => setAnswer(e.target.value)}
// // //           placeholder="Type your answer here..."
// // //         />

// // //         <button
// // //           onClick={submitAnswer}
// // //           className="bg-blue-600 text-white px-4 py-2 rounded"
// // //         >
// // //           Submit Answer
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // }



// // "use client";

// // import { useState, useEffect } from "react";

// // /* ================================
// //    PDF TEXT EXTRACTION (CDN)
// // ================================ */
// // async function extractTextFromPDF(file) {
// //   if (!window.pdfjsLib) {
// //     alert("PDF.js not loaded");
// //     return "";
// //   }

// //   const buffer = await file.arrayBuffer();
// //   const pdf = await window.pdfjsLib.getDocument({
// //     data: buffer,
// //     disableWorker: true,
// //   }).promise;

// //   let text = "";
// //   for (let i = 1; i <= pdf.numPages; i++) {
// //     const page = await pdf.getPage(i);
// //     const content = await page.getTextContent();
// //     text += content.items.map((i) => i.str).join(" ") + "\n";
// //   }
// //   return text;
// // }

// // /* ================================
// //    RESUME ANALYSIS
// // ================================ */
// // const SKILL_KEYWORDS = [
// //   "react",
// //   "next.js",
// //   "javascript",
// //   "node",
// //   "html",
// //   "css",
// //   "express",
// // ];

// // function analyzeResume(text) {
// //   const lower = text.toLowerCase();
// //   return SKILL_KEYWORDS.filter((s) => lower.includes(s));
// // }

// // /* ================================
// //    QUESTION GENERATION
// // ================================ */
// // function generateQuestions(skills) {
// //   const skillBased = skills.flatMap((s) => [
// //     `Explain your experience with ${s}.`,
// //     `What challenges did you face while using ${s}?`,
// //   ]);

// //   const communication = [
// //     "Introduce yourself.",
// //     "Explain a complex topic in simple words.",
// //     "Describe a challenge you faced and how you solved it.",
// //     "How do you handle feedback?",
// //     "How do you communicate in a team?",
// //   ];

// //   return [...skillBased, ...communication].slice(0, 15);
// // }

// // /* ================================
// //    SCORING LOGIC
// // ================================ */
// // function grammarAndEnglishScore(text) {
// //   const words = text.split(" ").length;
// //   const sentences = text.split(/[.!?]/).length;

// //   const grammar = Math.max(10 - Math.abs(sentences - 3), 4);
// //   const english = Math.min(10, Math.max(4, words / 5));

// //   return { grammar, english };
// // }

// // function meaningScore(text) {
// //   const fillers = ["um", "uh", "like", "you know"];
// //   const fillerCount = fillers.filter((f) =>
// //     text.toLowerCase().includes(f)
// //   ).length;

// //   let score = 8;
// //   if (text.length < 50) score -= 2;
// //   if (fillerCount > 2) score -= 2;

// //   return Math.max(score, 3);
// // }

// // function technicalScore(text, skills) {
// //   const lower = text.toLowerCase();
// //   let matched = 0;

// //   skills.forEach((s) => {
// //     if (lower.includes(s)) matched++;
// //   });

// //   return Math.min(10, matched * 2);
// // }

// // /* ================================
// //    VOICE MODELS (OPEN SOURCE)
// // ================================ */
// // const VOICE_MODELS = [
// //   {
// //     label: "Model 1",
// //     voiceName: "Microsoft David - English (United States)",
// //   },
// //   {
// //     label: "Model 2", // DEFAULT
// //     voiceName: "Microsoft Mark - English (United States)",
// //   },
// //   {
// //     label: "Model 3",
// //     voiceName: "Microsoft Zira - English (United States)",
// //   },
// // ];

// // /* ================================
// //    MAIN COMPONENT
// // ================================ */
// // export default function InterviewPage() {
// //   const [questions, setQuestions] = useState([]);
// //   const [skills, setSkills] = useState([]);
// //   const [current, setCurrent] = useState(0);
// //   const [answer, setAnswer] = useState("");
// //   const [results, setResults] = useState([]);
// //   const [started, setStarted] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [showDetails, setShowDetails] = useState(false);

// //   /* ===== VOICE STATE ===== */
// //   const [voices, setVoices] = useState([]);
// //   const [selectedModel, setSelectedModel] = useState("Model 2");

// //   useEffect(() => {
// //     const loadVoices = () => {
// //       const systemVoices = window.speechSynthesis.getVoices();

// //       const available = VOICE_MODELS.map((model) => ({
// //         ...model,
// //         voice: systemVoices.find((v) => v.name === model.voiceName),
// //       })).filter((m) => m.voice);

// //       setVoices(available);
// //     };

// //     loadVoices();
// //     window.speechSynthesis.onvoiceschanged = loadVoices;

// //     return () => {
// //       window.speechSynthesis.onvoiceschanged = null;
// //     };
// //   }, []);

// //   const speakQuestion = () => {
// //     const model = voices.find((v) => v.label === selectedModel);
// //     if (!model || !model.voice) return;

// //     const utterance = new SpeechSynthesisUtterance(
// //       questions[current]
// //     );
// //     utterance.voice = model.voice;
// //     utterance.rate = 1;
// //     utterance.pitch = 1;

// //     window.speechSynthesis.cancel();
// //     window.speechSynthesis.speak(utterance);
// //   };

// //   /* ================================
// //      HANDLERS
// // ================================ */
// //   const handleResumeUpload = async (e) => {
// //     const file = e.target.files[0];
// //     if (!file) return;

// //     setLoading(true);
// //     const text = await extractTextFromPDF(file);
// //     const detectedSkills = analyzeResume(text);

// //     setSkills(detectedSkills);
// //     setQuestions(generateQuestions(detectedSkills));
// //     setStarted(true);
// //     setLoading(false);
// //   };

// //   const submitAnswer = () => {
// //     const { grammar, english } = grammarAndEnglishScore(answer);
// //     const meaning = meaningScore(answer);
// //     const technical = technicalScore(answer, skills);

// //     setResults([
// //       ...results,
// //       {
// //         question: questions[current],
// //         grammar,
// //         english,
// //         meaning,
// //         technical,
// //       },
// //     ]);

// //     setAnswer("");
// //     setCurrent(current + 1);
// //   };

// //   /* ================================
// //      FINAL SCORE
// // ================================ */
// //   const average = (key) =>
// //     (
// //       results.reduce((sum, r) => sum + r[key], 0) / results.length
// //     ).toFixed(1);

// //   const finalScore =
// //     (
// //       (Number(average("grammar")) +
// //         Number(average("english")) +
// //         Number(average("meaning")) +
// //         Number(average("technical"))) /
// //       4
// //     ).toFixed(1);

// //   /* ================================
// //      UI STATES
// // ================================ */
// //   if (!started) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center p-6">
// //         <div className="bg-white p-6 rounded shadow max-w-md w-full">
// //           <h1 className="text-xl font-bold mb-4">
// //             Upload Resume PDF
// //           </h1>
// //           <input
// //             type="file"
// //             accept="application/pdf"
// //             onChange={handleResumeUpload}
// //           />
// //           {loading && (
// //             <p className="text-sm text-gray-600 mt-2">
// //               Analyzing resume...
// //             </p>
// //           )}
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (current >= questions.length) {
// //     return (
// //       <div className="p-6 max-w-3xl mx-auto">
// //         <h2 className="text-2xl font-bold mb-6">
// //           Final Interview Score
// //         </h2>

// //         <div className="grid grid-cols-2 gap-4 mb-6">
// //           <div className="border p-4 rounded">
// //             Grammar: {average("grammar")}/10
// //           </div>
// //           <div className="border p-4 rounded">
// //             English: {average("english")}/10
// //           </div>
// //           <div className="border p-4 rounded">
// //             Meaning: {average("meaning")}/10
// //           </div>
// //           <div className="border p-4 rounded">
// //             Technical: {average("technical")}/10
// //           </div>
// //         </div>

// //         <div className="text-xl font-bold mb-4">
// //           Final Score: {finalScore}/10
// //         </div>

// //         <button
// //           onClick={() => setShowDetails(!showDetails)}
// //           className="bg-blue-600 text-white px-4 py-2 rounded"
// //         >
// //           {showDetails ? "Hide Details" : "Know More"}
// //         </button>

// //         {showDetails && (
// //           <div className="mt-6">
// //             {results.map((r, i) => (
// //               <div key={i} className="border p-4 mb-4 rounded">
// //                 <p className="font-semibold mb-2">
// //                   Q{i + 1}. {r.question}
// //                 </p>
// //                 <p>Grammar: {r.grammar}/10</p>
// //                 <p>English: {r.english}/10</p>
// //                 <p>Meaning: {r.meaning}/10</p>
// //                 <p>Technical: {r.technical}/10</p>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen flex items-center justify-center p-6">
// //       <div className="bg-white p-6 rounded shadow max-w-xl w-full">
// //         <p className="text-sm text-gray-500 mb-1">
// //           Question {current + 1} of {questions.length}
// //         </p>

// //         <p className="text-lg font-semibold mb-2">
// //           {questions[current]}
// //         </p>

// //         <div className="flex gap-3 mb-4">
// //           <select
// //             value={selectedModel}
// //             onChange={(e) => setSelectedModel(e.target.value)}
// //             className="border px-2 py-1 rounded"
// //           >
// //             {voices.map((v) => (
// //               <option key={v.label} value={v.label}>
// //                 {v.label}
// //               </option>
// //             ))}
// //           </select>

// //           <button
// //             onClick={speakQuestion}
// //             className="bg-green-600 text-white px-3 py-1 rounded"
// //           >
// //             🔊 Speak Question
// //           </button>
// //         </div>

// //         <textarea
// //           className="w-full border p-3 mb-4"
// //           rows="5"
// //           value={answer}
// //           onChange={(e) => setAnswer(e.target.value)}
// //           placeholder="Type your answer here..."
// //         />

// //         <button
// //           onClick={submitAnswer}
// //           className="bg-blue-600 text-white px-4 py-2 rounded"
// //         >
// //           Submit Answer
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }








"use client";

import { useState, useEffect } from "react";
import ResumeAnalyzer from "@/components/ResumeAnalyzer";

/* ================================
   SCORING LOGIC
================================ */
function grammarAndEnglishScore(text) {
  const words = text.split(" ").length;
  const sentences = text.split(/[.!?]/).length;
  return {
    grammar: Math.max(10 - Math.abs(sentences - 3), 4),
    english: Math.min(10, Math.max(4, words / 5)),
  };
}

function meaningScore(text) {
  let score = 8;
  if (text.length < 50) score -= 2;
  return Math.max(score, 3);
}

function technicalScore(text, skills) {
  let matched = 0;
  const lower = text.toLowerCase();
  skills.forEach((s) => lower.includes(s) && matched++);
  return Math.min(10, matched * 2);
}

/* ================================
   PAGE
================================ */
export default function InterviewPage() {
  const [questions, setQuestions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [started, setStarted] = useState(false);

  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");

  /* ===== VOICE STATE ===== */
  const [voices, setVoices] = useState([]);
  const [voiceReady, setVoiceReady] = useState(false);

  /* ================================
     LOAD VOICES (MOBILE SAFE)
================================ */
  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();

      if (v.length > 0) {
        setVoices(v);
        setVoiceReady(true);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  /* ================================
     SPEAK QUESTION (SAFE)
================================ */
  const speakQuestion = () => {
    if (!voiceReady) {
      alert("Voice not supported on this device/browser");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      questions[current]
    );

    // ✅ Mobile-safe: use first available system voice
    utterance.voice = voices[0];
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const submitAnswer = () => {
    setAnswer("");
    setCurrent((c) => c + 1);
  };

  /* ================================
     RESUME STEP
================================ */
  if (!started) {
    return (
      <ResumeAnalyzer
        onReady={({ skills, questions }) => {
          setSkills(skills);
          setQuestions(questions);
          setStarted(true);
        }}
      />
    );
  }

  /* ================================
     INTERVIEW UI (MOBILE)
================================ */
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-5 rounded-xl shadow">
        <p className="text-xs text-gray-500 mb-2">
          Question {current + 1} / {questions.length}
        </p>

        <p className="text-base font-semibold mb-3">
          {questions[current]}
        </p>

        {/* MODEL LABEL (UI ONLY) */}
        <div className="text-xs text-gray-600 mb-2">
          Voice Model: <strong>Model 2 (Default)</strong>
        </div>

        <button
          onClick={speakQuestion}
          disabled={!voiceReady}
          className={`w-full py-3 rounded text-sm font-semibold ${
            voiceReady
              ? "bg-green-600 text-white"
              : "bg-gray-300 text-gray-600"
          }`}
        >
          🔊 Speak Question
        </button>

        {!voiceReady && (
          <p className="text-xs text-red-500 mt-2">
            Voice not supported on this browser.  
            Try Chrome Desktop / Edge.
          </p>
        )}

        <textarea
          className="w-full border rounded p-3 mt-4 text-sm"
          rows="5"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer..."
        />

        <button
          onClick={submitAnswer}
          className="w-full bg-blue-600 text-white py-3 rounded mt-4 text-sm font-semibold"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
}










// // "use client";

// // import { useState, useEffect } from "react";
// // import ResumeAnalyzer from "@/components/ResumeAnalyzer";

// // /* ================================
// //    SCORING LOGIC
// // ================================ */
// // function grammarAndEnglishScore(text) {
// //   const words = text.split(" ").length;
// //   const sentences = text.split(/[.!?]/).length;

// //   const grammar = Math.max(10 - Math.abs(sentences - 3), 4);
// //   const english = Math.min(10, Math.max(4, words / 5));

// //   return { grammar, english };
// // }

// // function meaningScore(text) {
// //   const fillers = ["um", "uh", "like", "you know"];
// //   const fillerCount = fillers.filter((f) =>
// //     text.toLowerCase().includes(f)
// //   ).length;

// //   let score = 8;
// //   if (text.length < 50) score -= 2;
// //   if (fillerCount > 2) score -= 2;

// //   return Math.max(score, 3);
// // }

// // function technicalScore(text, skills) {
// //   const lower = text.toLowerCase();
// //   let matched = 0;

// //   skills.forEach((s) => {
// //     if (lower.includes(s)) matched++;
// //   });

// //   return Math.min(10, matched * 2);
// // }

// // /* ================================
// //    VOICE MODELS
// // ================================ */
// // const VOICE_MODELS = [
// //   { label: "Model 1", voiceName: "Microsoft David - English (United States)" },
// //   { label: "Model 2", voiceName: "Microsoft Mark - English (United States)" },
// //   { label: "Model 3", voiceName: "Microsoft Zira - English (United States)" },
// // ];

// // /* ================================
// //    PAGE
// // ================================ */
// // export default function InterviewPage() {
// //   const [questions, setQuestions] = useState([]);
// //   const [skills, setSkills] = useState([]);
// //   const [started, setStarted] = useState(false);

// //   const [current, setCurrent] = useState(0);
// //   const [answer, setAnswer] = useState("");
// //   const [results, setResults] = useState([]);

// //   /* ===== VOICE ===== */
// //   const [voices, setVoices] = useState([]);
// //   const [selectedModel, setSelectedModel] = useState("Model 2");

// //   useEffect(() => {
// //     const loadVoices = () => {
// //       const systemVoices = window.speechSynthesis.getVoices();
// //       const available = VOICE_MODELS.map((m) => ({
// //         ...m,
// //         voice: systemVoices.find(v => v.name === m.voiceName),
// //       })).filter(v => v.voice);

// //       setVoices(available);
// //     };

// //     loadVoices();
// //     window.speechSynthesis.onvoiceschanged = loadVoices;

// //     return () => {
// //       window.speechSynthesis.onvoiceschanged = null;
// //     };
// //   }, []);

// //   const speakQuestion = () => {
// //     const model = voices.find(v => v.label === selectedModel);
// //     if (!model) return;

// //     const utterance = new SpeechSynthesisUtterance(
// //       questions[current]
// //     );
// //     utterance.voice = model.voice;

// //     window.speechSynthesis.cancel();
// //     window.speechSynthesis.speak(utterance);
// //   };

// //   const submitAnswer = () => {
// //     const { grammar, english } = grammarAndEnglishScore(answer);
// //     const meaning = meaningScore(answer);
// //     const technical = technicalScore(answer, skills);

// //     setResults([
// //       ...results,
// //       { grammar, english, meaning, technical, question: questions[current] },
// //     ]);

// //     setAnswer("");
// //     setCurrent(current + 1);
// //   };

// //   /* ================================
// //      STEP 1: RESUME ANALYZER
// // ================================ */
// //   if (!started) {
// //     return (
// //       <ResumeAnalyzer
// //         onReady={({ skills, questions }) => {
// //           setSkills(skills);
// //           setQuestions(questions);
// //           setStarted(true);
// //         }}
// //       />
// //     );
// //   }

// //   /* ================================
// //      INTERVIEW UI
// // ================================ */
// //   return (
// //     <div className="min-h-screen flex items-center justify-center p-6">
// //       <div className="bg-white p-6 rounded shadow max-w-xl w-full">
// //         <p className="text-sm text-gray-500 mb-1">
// //           Question {current + 1} of {questions.length}
// //         </p>

// //         <p className="text-lg font-semibold mb-2">
// //           {questions[current]}
// //         </p>

// //         <div className="flex gap-3 mb-4">
// //           <select
// //             value={selectedModel}
// //             onChange={(e) => setSelectedModel(e.target.value)}
// //             className="border px-2 py-1 rounded"
// //           >
// //             {voices.map(v => (
// //               <option key={v.label} value={v.label}>
// //                 {v.label}
// //               </option>
// //             ))}
// //           </select>

// //           <button
// //             onClick={speakQuestion}
// //             className="bg-green-600 text-white px-3 py-1 rounded"
// //           >
// //             🔊 Speak Question
// //           </button>
// //         </div>

// //         <textarea
// //           className="w-full border p-3 mb-4"
// //           rows="5"
// //           value={answer}
// //           onChange={(e) => setAnswer(e.target.value)}
// //           placeholder="Type your answer..."
// //         />

// //         <button
// //           onClick={submitAnswer}
// //           className="bg-blue-600 text-white px-4 py-2 rounded"
// //         >
// //           Submit Answer
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }




// "use client";

// import { useState, useEffect } from "react";
// import ResumeAnalyzer from "@/components/ResumeAnalyzer";

// /* ================================
//    SCORING LOGIC
// ================================ */
// function grammarAndEnglishScore(text) {
//   const words = text.split(" ").length;
//   const sentences = text.split(/[.!?]/).length;
//   return {
//     grammar: Math.max(10 - Math.abs(sentences - 3), 4),
//     english: Math.min(10, Math.max(4, words / 5)),
//   };
// }

// function meaningScore(text) {
//   let score = 8;
//   if (text.length < 50) score -= 2;
//   return Math.max(score, 3);
// }

// function technicalScore(text, skills) {
//   let matched = 0;
//   const lower = text.toLowerCase();
//   skills.forEach((s) => lower.includes(s) && matched++);
//   return Math.min(10, matched * 2);
// }

// /* ================================
//    MODEL LABELS (UI ONLY)
// ================================ */
// const MODELS = ["Model 1", "Model 2", "Model 3"];

// /* ================================
//    PAGE
// ================================ */
// export default function InterviewPage() {
//   const [questions, setQuestions] = useState([]);
//   const [skills, setSkills] = useState([]);
//   const [started, setStarted] = useState(false);

//   const [current, setCurrent] = useState(0);
//   const [answer, setAnswer] = useState("");

//   /* ===== VOICE ===== */
//   const [voices, setVoices] = useState([]);
//   const [selectedModel, setSelectedModel] = useState("Model 2");
//   const [voiceReady, setVoiceReady] = useState(false);

//   /* ================================
//      LOAD SYSTEM VOICES (MOBILE SAFE)
// ================================ */
//   useEffect(() => {
//     const loadVoices = () => {
//       const v = window.speechSynthesis.getVoices();
//       if (v.length > 0) {
//         setVoices(v);
//         setVoiceReady(true);
//       }
//     };

//     loadVoices();
//     window.speechSynthesis.onvoiceschanged = loadVoices;

//     return () => {
//       window.speechSynthesis.onvoiceschanged = null;
//     };
//   }, []);

//   /* ================================
//      MAP MODEL → VOICE
// ================================ */
//   const getVoiceForModel = () => {
//     if (!voices.length) return null;

//     // Model index: 0,1,2
//     const index =
//       selectedModel === "Model 1"
//         ? 0
//         : selectedModel === "Model 2"
//         ? 1
//         : 2;

//     // Fallback-safe
//     return voices[index] || voices[0];
//   };

//   /* ================================
//      SPEAK QUESTION
// ================================ */
//   const speakQuestion = () => {
//     if (!voiceReady) {
//       alert("Text-to-Speech not supported on this browser.");
//       return;
//     }

//     const utterance = new SpeechSynthesisUtterance(
//       questions[current]
//     );

//     utterance.voice = getVoiceForModel();
//     utterance.rate = 1;
//     utterance.pitch = 1;

//     window.speechSynthesis.cancel();
//     window.speechSynthesis.speak(utterance);
//   };

//   const submitAnswer = () => {
//     setAnswer("");
//     setCurrent((c) => c + 1);
//   };

//   /* ================================
//      RESUME STEP
// ================================ */
//   if (!started) {
//     return (
//       <ResumeAnalyzer
//         onReady={({ skills, questions }) => {
//           setSkills(skills);
//           setQuestions(questions);
//           setStarted(true);
//         }}
//       />
//     );
//   }

//   /* ================================
//      INTERVIEW UI (MOBILE FRIENDLY)
// ================================ */
//   return (
//     <div className="min-h-screen flex items-center justify-center px-4">
//       <div className="bg-white w-full max-w-md p-5 rounded-xl shadow">
//         <p className="text-xs text-gray-500 mb-2">
//           Question {current + 1} / {questions.length}
//         </p>

//         <p className="text-base font-semibold mb-3">
//           {questions[current]}
//         </p>

//         {/* MODEL SELECTOR (NOW WORKS ON MOBILE) */}
//         <select
//           value={selectedModel}
//           onChange={(e) => setSelectedModel(e.target.value)}
//           className="w-full border rounded px-3 py-2 text-sm mb-3"
//         >
//           {MODELS.map((m) => (
//             <option key={m} value={m}>
//               {m}
//             </option>
//           ))}
//         </select>

//         <button
//           onClick={speakQuestion}
//           disabled={!voiceReady}
//           className={`w-full py-3 rounded text-sm font-semibold ${
//             voiceReady
//               ? "bg-green-600 text-white"
//               : "bg-gray-300 text-gray-600"
//           }`}
//         >
//           🔊 Speak Question
//         </button>

//         {!voiceReady && (
//           <p className="text-xs text-red-500 mt-2">
//             Voice not supported on this device.
//           </p>
//         )}

//         <textarea
//           className="w-full border rounded p-3 mt-4 text-sm"
//           rows="5"
//           value={answer}
//           onChange={(e) => setAnswer(e.target.value)}
//           placeholder="Type your answer..."
//         />

//         <button
//           onClick={submitAnswer}
//           className="w-full bg-blue-600 text-white py-3 rounded mt-4 text-sm font-semibold"
//         >
//           Submit Answer
//         </button>
//       </div>
//     </div>
//   );
// }
