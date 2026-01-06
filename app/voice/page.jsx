"use client";

import { useEffect, useState } from "react";

// Map UI names → actual system voice names
const VOICE_MODELS = [
  {
    label: "Model 1",
    voiceName: "Microsoft David - English (United States)",
  },
  {
    label: "Model 2",
    voiceName: "Microsoft Mark - English (United States)",
  },
  {
    label: "Model 3",
    voiceName: "Microsoft Zira - English (United States)",
  },
];

export default function VoicePage() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedModel, setSelectedModel] = useState(VOICE_MODELS[0].label);

  useEffect(() => {
    const loadVoices = () => {
      const systemVoices = window.speechSynthesis.getVoices();

      // Keep only voices that exist on the system
      const available = VOICE_MODELS
        .map((model) => ({
          ...model,
          voice: systemVoices.find((v) => v.name === model.voiceName),
        }))
        .filter((model) => model.voice);

      setVoices(available);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = () => {
    if (!text.trim()) return;

    const model = voices.find((v) => v.label === selectedModel);
    if (!model || !model.voice) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = model.voice;
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 500 }}>
      <h2>Text to Speech</h2>

      <textarea
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type text..."
        style={{ width: "100%" }}
      />

      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        style={{ marginTop: 10, width: "100%" }}
      >
        {voices.map((model) => (
          <option key={model.label} value={model.label}>
            {model.label}
          </option>
        ))}
      </select>

      <button onClick={speak} style={{ marginTop: 15 }}>
        Speak
      </button>
    </div>
  );
}
