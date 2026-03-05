"use client";

import { useState, useCallback } from "react";
import ResumeAnalyzer from "@/components/ResumeAnalyzer";
import InterviewCard from "@/components/InterviewCard";
import ModelSelector from "@/components/ModelSelector";
import QuestionSpeaker from "@/components/QuestionSpeaker";
import VoiceAnswer from "@/components/VoiceAnswer";
import WebcamObserver from "@/components/WebcamObserver";
import PhotoCaptureStep from "@/components/PhotoCaptureStep";

const SESSION_KEY = "interviewSessionV1";
const MAX_QUESTIONS = 10;

function clampScore(value) {
  return Math.max(0, Math.min(10, value));
}

function scoreAnswer(answer, skills = []) {
  const normalized = answer.trim();
  if (!normalized) return { length: 0, structure: 0, technical: 0, total: 0 };

  const words = normalized.split(/\s+/).length;
  const sentences = normalized
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean).length;

  const lengthScore = clampScore(words / 12);
  const structureScore = clampScore(10 - Math.abs(sentences - 3) * 2);

  const lower = normalized.toLowerCase();
  const matchedSkills = skills.filter((s) => lower.includes(s.toLowerCase()));
  const technicalScore = clampScore(matchedSkills.length * 3);

  const total = clampScore(
    (lengthScore + structureScore + technicalScore) / 3
  );

  return {
    length: Number(lengthScore.toFixed(1)),
    structure: Number(structureScore.toFixed(1)),
    technical: Number(technicalScore.toFixed(1)),
    total: Number(total.toFixed(1)),
  };
}

export default function InterviewPage() {
  const [phase, setPhase] = useState("resume");
  const [questions, setQuestions] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [current, setCurrent] = useState(0);
  const [model, setModel] = useState("Model 2");
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState([]);
  const [referencePhoto, setReferencePhoto] = useState(null);

  const handleFaceNotDetected = useCallback(() => {
    alert("Face not detected! Please ensure your face is clearly visible in the camera.");
  }, []);

  const handleFaceMismatch = useCallback(() => {
    alert("Face does not match! Please ensure you are the same person who started the interview.");
  }, []);

  if (phase === "resume") {
    return (
      <ResumeAnalyzer
        onReady={({ questions, analysis }) => {
          setQuestions(questions.slice(0, MAX_QUESTIONS));
          setAnalysis(analysis || null);
          setPhase("photoCapture");
        }}
      />
    );
  }

  if (phase === "photoCapture") {
    return (
      <PhotoCaptureStep
        onComplete={({ photo, descriptor }) => {
          setReferencePhoto({ photo, descriptor });
          setPhase("interview");
        }}
      />
    );
  }

  if (phase === "interview" && current >= questions.length) {
    const average =
      results.reduce((sum, r) => sum + r.scores.total, 0) /
      Math.max(results.length, 1);

    return (
      <InterviewCard>
        <p className="text-sm text-gray-500 mb-2">Interview completed</p>
        <h2 className="text-xl font-semibold mb-4">
          Final Score: {average.toFixed(1)}/10
        </h2>

        <div className="space-y-3 text-sm text-gray-700">
          {results.map((r, index) => (
            <div key={`${index}-${r.question.slice(0, 10)}`}>
              <p className="font-semibold mb-1">
                Q{index + 1}. {r.question}
              </p>
              <p>Answer score: {r.scores.total}/10</p>
            </div>
          ))}
        </div>
      </InterviewCard>
    );
  }

  const submitAnswer = () => {
    const scores = scoreAnswer(answer, analysis?.skills || []);
    const entry = {
      question: questions[current],
      answer,
      scores,
      createdAt: new Date().toISOString(),
    };

    const nextResults = [...results, entry];
    setResults(nextResults);
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        results: nextResults,
        questions,
        updatedAt: new Date().toISOString(),
      })
    );

    setAnswer("");
    setCurrent((c) => c + 1);
  };

  return (
    <>
      {/* Webcam Floating View */}
      <WebcamObserver
        onFaceNotDetected={handleFaceNotDetected}
        onFaceMismatch={handleFaceMismatch}
        referenceDescriptor={referencePhoto?.descriptor}
      />

      <InterviewCard>
        <p className="text-xs text-gray-500 mb-2">
          Question {current + 1} / {questions.length}
        </p>

        <p className="font-semibold mb-3">{questions[current]}</p>

        <ModelSelector value={model} onChange={setModel} />

        <div className="mt-3">
          <QuestionSpeaker text={questions[current]} model={model} />
        </div>

        <div className="mt-4">
          <VoiceAnswer onFinal={setAnswer} />
        </div>

        <button
          onClick={submitAnswer}
          disabled={!answer.trim()}
          className="w-full mt-4 bg-black text-white py-3 rounded font-semibold disabled:opacity-50"
        >
          Next Question
        </button>
      </InterviewCard>
    </>
  );
}
