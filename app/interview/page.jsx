// // // "use client";

// // // import { useState } from "react";
// // // import { extractSkills } from "@/lib/skills";
// // // import { generateQuestions } from "@/lib/questions";
// // // import { technicalScore } from "@/lib/scoring";

// // // export default function InterviewPage() {
// // //   const [resume, setResume] = useState("");
// // //   const [questions, setQuestions] = useState([]);
// // //   const [index, setIndex] = useState(0);
// // //   const [answer, setAnswer] = useState("");
// // //   const [result, setResult] = useState(null);

// // //   const startInterview = () => {
// // //     const skills = extractSkills(resume);
// // //     const qs = generateQuestions(skills);
// // //     setQuestions(qs);
// // //   };

// // //   const startSpeech = () => {
// // //     const SpeechRecognition =
// // //       window.SpeechRecognition || window.webkitSpeechRecognition;
// // //     const recognition = new SpeechRecognition();

// // //     recognition.lang = "en-US";
// // //     recognition.continuous = true;

// // //     recognition.onresult = (e) => {
// // //       let text = "";
// // //       for (let i = e.resultIndex; i < e.results.length; i++) {
// // //         text += e.results[i][0].transcript;
// // //       }
// // //       setAnswer(text);
// // //     };

// // //     recognition.start();
// // //     setTimeout(() => recognition.stop(), 10000);
// // //   };

// // //   const analyze = async () => {
// // //     const res = await fetch("/api/grammar", {
// // //       method: "POST",
// // //       body: JSON.stringify({ text: answer }),
// // //     });

// // //     const data = await res.json();
// // //     const tech = technicalScore(answer);

// // //     setResult({
// // //       grammar: data.grammar,
// // //       english: data.english,
// // //       technical: tech,
// // //       final: ((data.grammar + data.english + tech) / 3).toFixed(1),
// // //     });
// // //   };

// // //   if (!questions.length) {
// // //     return (
// // //       <div className="p-6 max-w-2xl mx-auto">
// // //         <textarea
// // //           className="w-full border p-3"
// // //           rows="8"
// // //           placeholder="Paste your resume here..."
// // //           onChange={(e) => setResume(e.target.value)}
// // //         />
// // //         <button
// // //           onClick={startInterview}
// // //           className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
// // //         >
// // //           Start Interview
// // //         </button>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="p-6 max-w-2xl mx-auto">
// // //       <h2 className="font-bold mb-2">
// // //         Question {index + 1}
// // //       </h2>
// // //       <p className="mb-4">{questions[index]}</p>

// // //       <button
// // //         onClick={startSpeech}
// // //         className="bg-green-600 text-white px-4 py-2 rounded mb-2"
// // //       >
// // //         Speak Answer
// // //       </button>

// // //       <textarea
// // //         className="w-full border p-3 mb-3"
// // //         rows="5"
// // //         value={answer}
// // //         onChange={(e) => setAnswer(e.target.value)}
// // //       />

// // //       <button
// // //         onClick={analyze}
// // //         className="bg-blue-600 text-white px-4 py-2 rounded"
// // //       >
// // //         Analyze
// // //       </button>

// // //       {result && (
// // //         <div className="mt-4 space-y-1">
// // //           <p>Grammar: {result.grammar}/10</p>
// // //           <p>English: {result.english}/10</p>
// // //           <p>Technical: {result.technical}/10</p>
// // //           <p className="font-bold">Final Score: {result.final}/10</p>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // "use client";

// // import { useState } from "react";

// // /* -----------------------------
// //    PDF TEXT EXTRACTION (CDN)
// // -------------------------------- */
// // async function extractTextFromPDF(file) {
// //   if (!window.pdfjsLib) {
// //     alert("PDF.js not loaded");
// //     return "";
// //   }

// //   const pdfjsLib = window.pdfjsLib;
// //   pdfjsLib.GlobalWorkerOptions.workerSrc = null;

// //   const buffer = await file.arrayBuffer();
// //   const pdf = await pdfjsLib.getDocument({
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

// // /* -----------------------------
// //    RESUME ANALYSIS
// // -------------------------------- */
// // const SKILL_KEYWORDS = {
// //   react: ["react", "hooks", "jsx"],
// //   nextjs: ["next.js", "app router", "ssr"],
// //   javascript: ["javascript", "closure", "promise"],
// //   node: ["node", "express"],
// //   html: ["html"],
// //   css: ["css", "flexbox", "grid"],
// // };

// // function analyzeResume(text) {
// //   const lower = text.toLowerCase();

// //   const skills = Object.keys(SKILL_KEYWORDS).filter((skill) =>
// //     SKILL_KEYWORDS[skill].some((k) => lower.includes(k))
// //   );

// //   const projects = text
// //     .split("\n")
// //     .filter(
// //       (l) =>
// //         l.toLowerCase().includes("project") ||
// //         l.toLowerCase().includes("developed") ||
// //         l.toLowerCase().includes("built")
// //     )
// //     .slice(0, 3);

// //   return { skills, projects };
// // }

// // /* -----------------------------
// //    QUESTION GENERATORS
// // -------------------------------- */
// // function generateSkillQuestions(skills) {
// //   return skills.flatMap((s) => [
// //     `Explain your experience with ${s}.`,
// //     `What challenges did you face while using ${s}?`,
// //   ]);
// // }

// // function generateTechnicalQuestions(skills) {
// //   return skills.map(
// //     (s) => `Explain a technical concept in ${s} you are confident with.`
// //   );
// // }

// // function generateCommunicationQuestions() {
// //   return [
// //     "Introduce yourself.",
// //     "Explain a complex topic in simple words.",
// //     "Describe a challenge you faced and how you solved it.",
// //     "How do you handle feedback?",
// //     "How do you communicate with team members?",
// //   ];
// // }

// // /* -----------------------------
// //    MAIN COMPONENT
// // -------------------------------- */
// // export default function InterviewPage() {
// //   const [questions, setQuestions] = useState([]);
// //   const [current, setCurrent] = useState(0);
// //   const [started, setStarted] = useState(false);
// //   const [loading, setLoading] = useState(false);

// //   const handlePDFUpload = async (e) => {
// //     const file = e.target.files[0];
// //     if (!file) return;

// //     setLoading(true);

// //     const text = await extractTextFromPDF(file);
// //     const { skills } = analyzeResume(text);

// //     const skillQs = generateSkillQuestions(skills);
// //     const techQs = generateTechnicalQuestions(skills);
// //     const commQs = generateCommunicationQuestions();

// //     const allQuestions = [
// //       ...skillQs.slice(0, 6), // Skill-based
// //       ...techQs.slice(0, 4),  // Technical
// //       ...commQs.slice(0, 5),  // Communication
// //     ].slice(0, 15); // TOTAL 15 QUESTIONS

// //     setQuestions(allQuestions);
// //     setStarted(true);
// //     setLoading(false);
// //   };

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
// //             onChange={handlePDFUpload}
// //             className="mb-4"
// //           />

// //           {loading && (
// //             <p className="text-sm text-gray-600">
// //               Analyzing resume...
// //             </p>
// //           )}
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen flex items-center justify-center p-6">
// //       <div className="bg-white p-6 rounded shadow max-w-xl w-full">
// //         <h2 className="text-sm text-gray-500 mb-1">
// //           Question {current + 1} of {questions.length}
// //         </h2>

// //         <p className="text-lg font-semibold mb-6">
// //           {questions[current]}
// //         </p>

// //         <button
// //           onClick={() => setCurrent((c) => c + 1)}
// //           disabled={current === questions.length - 1}
// //           className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
// //         >
// //           {current === questions.length - 1
// //             ? "Interview Completed"
// //             : "Next Question"}
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useState } from "react";

// /* ================================
//    PDF TEXT EXTRACTION (CDN)
// ================================ */
// async function extractTextFromPDF(file) {
//   if (!window.pdfjsLib) {
//     alert("PDF.js not loaded");
//     return "";
//   }

//   const pdfjsLib = window.pdfjsLib;
//   pdfjsLib.GlobalWorkerOptions.workerSrc = null;

//   const buffer = await file.arrayBuffer();
//   const pdf = await pdfjsLib.getDocument({
//     data: buffer,
//     disableWorker: true,
//   }).promise;

//   let text = "";
//   for (let i = 1; i <= pdf.numPages; i++) {
//     const page = await pdf.getPage(i);
//     const content = await page.getTextContent();
//     text += content.items.map((i) => i.str).join(" ") + "\n";
//   }
//   return text;
// }

// /* ================================
//    RESUME ANALYSIS
// ================================ */
// const SKILL_KEYWORDS = [
//   "react",
//   "next.js",
//   "javascript",
//   "node",
//   "html",
//   "css",
//   "express",
// ];

// function analyzeResume(text) {
//   const lower = text.toLowerCase();
//   return SKILL_KEYWORDS.filter((s) => lower.includes(s));
// }

// /* ================================
//    QUESTION GENERATION
// ================================ */
// function generateQuestions(skills) {
//   const skillBased = skills.flatMap((s) => [
//     `Explain your experience with ${s}.`,
//     `What challenges did you face while using ${s}?`,
//   ]);

//   const technical = skills.map(
//     (s) => `Explain a technical concept related to ${s}.`
//   );

//   const communication = [
//     "Introduce yourself.",
//     "Explain a complex topic in simple words.",
//     "Describe a challenge you faced and how you solved it.",
//     "How do you handle feedback?",
//     "How do you communicate in a team?",
//   ];

//   return [...skillBased, ...technical, ...communication].slice(0, 15);
// }

// /* ================================
//    SCORING LOGIC (FREE)
// ================================ */
// function grammarAndEnglishScore(text) {
//   const words = text.split(" ").length;
//   const sentences = text.split(/[.!?]/).length;

//   const grammar = Math.max(10 - Math.abs(sentences - 3), 4);
//   const english = Math.min(10, Math.max(4, words / 5));

//   return { grammar, english };
// }

// function meaningScore(text) {
//   const fillers = ["um", "uh", "like", "you know"];
//   const fillerCount = fillers.filter((f) =>
//     text.toLowerCase().includes(f)
//   ).length;

//   let score = 8;
//   if (text.length < 50) score -= 2;
//   if (fillerCount > 2) score -= 2;

//   return Math.max(score, 3);
// }

// function technicalScore(text, skills) {
//   const lower = text.toLowerCase();
//   let matched = 0;

//   skills.forEach((s) => {
//     if (lower.includes(s)) matched++;
//   });

//   return Math.min(10, matched * 2);
// }

// /* ================================
//    MAIN COMPONENT
// ================================ */
// export default function InterviewPage() {
//   const [questions, setQuestions] = useState([]);
//   const [skills, setSkills] = useState([]);
//   const [current, setCurrent] = useState(0);
//   const [answer, setAnswer] = useState("");
//   const [results, setResults] = useState([]);
//   const [started, setStarted] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleResumeUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setLoading(true);
//     const text = await extractTextFromPDF(file);
//     const detectedSkills = analyzeResume(text);

//     setSkills(detectedSkills);
//     setQuestions(generateQuestions(detectedSkills));
//     setStarted(true);
//     setLoading(false);
//   };

//   const submitAnswer = () => {
//     const { grammar, english } = grammarAndEnglishScore(answer);
//     const meaning = meaningScore(answer);
//     const technical = technicalScore(answer, skills);

//     setResults([
//       ...results,
//       {
//         question: questions[current],
//         grammar,
//         english,
//         meaning,
//         technical,
//       },
//     ]);

//     setAnswer("");
//     setCurrent(current + 1);
//   };

//   /* ================================
//      UI STATES
//   ================================ */

//   if (!started) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-6">
//         <div className="bg-white p-6 rounded shadow max-w-md w-full">
//           <h1 className="text-xl font-bold mb-4">
//             Upload Resume PDF
//           </h1>
//           <input
//             type="file"
//             accept="application/pdf"
//             onChange={handleResumeUpload}
//           />
//           {loading && (
//             <p className="text-sm text-gray-600 mt-2">
//               Analyzing resume...
//             </p>
//           )}
//         </div>
//       </div>
//     );
//   }

//   if (current >= questions.length) {
//     return (
//       <div className="p-6 max-w-3xl mx-auto">
//         <h2 className="text-xl font-bold mb-4">
//           Interview Results
//         </h2>

//         {results.map((r, i) => (
//           <div key={i} className="border p-4 mb-4 rounded">
//             <p className="font-semibold mb-2">
//               {r.question}
//             </p>
//             <p>Grammar: {r.grammar}/10</p>
//             <p>English: {r.english}/10</p>
//             <p>Meaning: {r.meaning}/10</p>
//             <p>Technical: {r.technical}/10</p>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6">
//       <div className="bg-white p-6 rounded shadow max-w-xl w-full">
//         <p className="text-sm text-gray-500 mb-1">
//           Question {current + 1} of {questions.length}
//         </p>

//         <p className="text-lg font-semibold mb-4">
//           {questions[current]}
//         </p>

//         <textarea
//           className="w-full border p-3 mb-4"
//           rows="5"
//           value={answer}
//           onChange={(e) => setAnswer(e.target.value)}
//           placeholder="Type your answer here..."
//         />

//         <button
//           onClick={submitAnswer}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Submit Answer
//         </button>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";

/* ================================
   PDF TEXT EXTRACTION (CDN)
================================ */
async function extractTextFromPDF(file) {
  if (!window.pdfjsLib) {
    alert("PDF.js not loaded");
    return "";
  }

  const pdfjsLib = window.pdfjsLib;
  pdfjsLib.GlobalWorkerOptions.workerSrc = null;

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({
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
const SKILL_KEYWORDS = [
  "react",
  "next.js",
  "javascript",
  "node",
  "html",
  "css",
  "express",
];

function analyzeResume(text) {
  const lower = text.toLowerCase();
  return SKILL_KEYWORDS.filter((s) => lower.includes(s));
}

/* ================================
   QUESTION GENERATION
================================ */
function generateQuestions(skills) {
  const skillBased = skills.flatMap((s) => [
    `Explain your experience with ${s}.`,
    `What challenges did you face while using ${s}?`,
  ]);

  const technical = skills.map(
    (s) => `Explain a technical concept related to ${s}.`
  );

  const communication = [
    "Introduce yourself.",
    "Explain a complex topic in simple words.",
    "Describe a challenge you faced and how you solved it.",
    "How do you handle feedback?",
    "How do you communicate in a team?",
  ];

  return [...skillBased, ...technical, ...communication].slice(0, 15);
}

/* ================================
   SCORING LOGIC
================================ */
function grammarAndEnglishScore(text) {
  const words = text.split(" ").length;
  const sentences = text.split(/[.!?]/).length;

  const grammar = Math.max(10 - Math.abs(sentences - 3), 4);
  const english = Math.min(10, Math.max(4, words / 5));

  return { grammar, english };
}

function meaningScore(text) {
  const fillers = ["um", "uh", "like", "you know"];
  const fillerCount = fillers.filter((f) =>
    text.toLowerCase().includes(f)
  ).length;

  let score = 8;
  if (text.length < 50) score -= 2;
  if (fillerCount > 2) score -= 2;

  return Math.max(score, 3);
}

function technicalScore(text, skills) {
  const lower = text.toLowerCase();
  let matched = 0;

  skills.forEach((s) => {
    if (lower.includes(s)) matched++;
  });

  return Math.min(10, matched * 2);
}

/* ================================
   MAIN COMPONENT
================================ */
export default function InterviewPage() {
  const [questions, setQuestions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState([]);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const text = await extractTextFromPDF(file);
    const detectedSkills = analyzeResume(text);

    setSkills(detectedSkills);
    setQuestions(generateQuestions(detectedSkills));
    setStarted(true);
    setLoading(false);
  };

  const submitAnswer = () => {
    const { grammar, english } = grammarAndEnglishScore(answer);
    const meaning = meaningScore(answer);
    const technical = technicalScore(answer, skills);

    setResults([
      ...results,
      {
        question: questions[current],
        grammar,
        english,
        meaning,
        technical,
      },
    ]);

    setAnswer("");
    setCurrent(current + 1);
  };

  /* ================================
     FINAL SCORE CALCULATION
  ================================ */
  const average = (key) =>
    (
      results.reduce((sum, r) => sum + r[key], 0) / results.length
    ).toFixed(1);

  const finalScore =
    (
      (Number(average("grammar")) +
        Number(average("english")) +
        Number(average("meaning")) +
        Number(average("technical"))) /
      4
    ).toFixed(1);

  /* ================================
     UI STATES
  ================================ */

  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white p-6 rounded shadow max-w-md w-full">
          <h1 className="text-xl font-bold mb-4">
            Upload Resume PDF
          </h1>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleResumeUpload}
          />
          {loading && (
            <p className="text-sm text-gray-600 mt-2">
              Analyzing resume...
            </p>
          )}
        </div>
      </div>
    );
  }

  if (current >= questions.length) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">
          Final Interview Score
        </h2>

        {/* ===== SCORE SHEET ===== */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border p-4 rounded">
            Grammar: {average("grammar")}/10
          </div>
          <div className="border p-4 rounded">
            English: {average("english")}/10
          </div>
          <div className="border p-4 rounded">
            Meaning: {average("meaning")}/10
          </div>
          <div className="border p-4 rounded">
            Technical: {average("technical")}/10
          </div>
        </div>

        <div className="text-xl font-bold mb-4">
          Final Score: {finalScore}/10
        </div>

        {/* ===== DETAILS BUTTON ===== */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
        >
          {showDetails ? "Hide Details" : "Know More (View Details)"}
        </button>

        {/* ===== DETAILED SCORES ===== */}
        {showDetails && (
          <div>
            {results.map((r, i) => (
              <div key={i} className="border p-4 mb-4 rounded">
                <p className="font-semibold mb-2">
                  Q{i + 1}. {r.question}
                </p>
                <p>Grammar: {r.grammar}/10</p>
                <p>English: {r.english}/10</p>
                <p>Meaning: {r.meaning}/10</p>
                <p>Technical: {r.technical}/10</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white p-6 rounded shadow max-w-xl w-full">
        <p className="text-sm text-gray-500 mb-1">
          Question {current + 1} of {questions.length}
        </p>

        <p className="text-lg font-semibold mb-4">
          {questions[current]}
        </p>

        <textarea
          className="w-full border p-3 mb-4"
          rows="5"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
        />

        <button
          onClick={submitAnswer}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
}
