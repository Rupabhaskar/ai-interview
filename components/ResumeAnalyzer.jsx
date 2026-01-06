// "use client";

// import { useState } from "react";

// /* ================================
//    PDF TEXT EXTRACTION
// ================================ */
// async function extractTextFromPDF(file) {
//   if (!window.pdfjsLib) {
//     alert("PDF.js not loaded");
//     return "";
//   }

//   const buffer = await file.arrayBuffer();
//   const pdf = await window.pdfjsLib.getDocument({
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

//   const communication = [
//     "Introduce yourself.",
//     "Explain a complex topic in simple words.",
//     "Describe a challenge you faced and how you solved it.",
//     "How do you handle feedback?",
//     "How do you communicate in a team?",
//   ];

//   return [...skillBased, ...communication].slice(0, 15);
// }

// /* ================================
//    COMPONENT
// ================================ */
// export default function ResumeAnalyzer({ onReady }) {
//   const [loading, setLoading] = useState(false);

//   const handleUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setLoading(true);

//     const text = await extractTextFromPDF(file);
//     const skills = analyzeResume(text);
//     const questions = generateQuestions(skills);

//     onReady({ skills, questions });
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6">
//       <div className="bg-white p-6 rounded shadow max-w-md w-full">
//         <h1 className="text-xl font-bold mb-4">
//           Upload Resume PDF
//         </h1>

//         <input
//           type="file"
//           accept="application/pdf"
//           onChange={handleUpload}
//         />

//         {loading && (
//           <p className="text-sm text-gray-600 mt-2">
//             Analyzing resume...
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";

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

  const communication = [
    "Introduce yourself.",
    "Explain a complex topic in simple words.",
    "Describe a challenge you faced and how you solved it.",
    "How do you handle feedback?",
    "How do you communicate in a team?",
  ];

  return [...skillBased, ...communication].slice(0, 15);
}

/* ================================
   COMPONENT
================================ */
export default function ResumeAnalyzer({ onReady }) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const text = await extractTextFromPDF(file);
    const skills = analyzeResume(text);
    const questions = generateQuestions(skills);

    onReady({ skills, questions });
    setLoading(false);
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
      </div>
    </div>
  );
}
