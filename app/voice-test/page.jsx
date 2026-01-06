"use client";

import { useEffect, useRef, useState } from "react";

export default function VoiceTestPage() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setText(transcript);
    };

    recognition.onerror = (e) => {
      console.error("Speech error:", e.error);
      setListening(false);
    };

    recognition.onend = () => {
      if (listening) recognition.start(); // keep listening
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [listening]);

  const startListening = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      recognitionRef.current.start();
      setListening(true);
    } catch {
      alert("Microphone permission denied.");
    }
  };

  const stopListening = () => {
    recognitionRef.current.stop();
    setListening(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white p-6 rounded shadow max-w-xl w-full">
        <h1 className="text-xl font-bold mb-4">
          Speech to Text – Test Page
        </h1>

        <div className="flex gap-4 mb-4">
          {!listening ? (
            <button
              onClick={startListening}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Start Speaking
            </button>
          ) : (
            <button
              onClick={stopListening}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Stop
            </button>
          )}
        </div>

        <textarea
          className="w-full border p-3 rounded"
          rows={8}
          value={text}
          placeholder="Your spoken text will appear here..."
          readOnly
        />

        <p className="text-sm text-gray-500 mt-3">
          Chrome only • Allow microphone • Run on localhost or HTTPS
        </p>
      </div>
    </div>
  );
}
