"use client";

import { useEffect, useState } from "react";

export default function QuestionSpeaker({ text, model }) {
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) setVoices(v);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = () => {
    if (!voices.length) return;

    const index = model === "Model 1" ? 0 : model === "Model 2" ? 1 : 2;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices[index] || voices[0];

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      className="w-full bg-green-600 text-white py-3 rounded text-sm font-semibold"
    >
      🔊 Speak Question
    </button>
  );
}
