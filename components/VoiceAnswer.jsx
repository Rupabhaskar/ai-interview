"use client";

import { useEffect, useRef, useState } from "react";

export default function VoiceAnswer({ onFinal }) {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (e) => {
      let t = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        t += e.results[i][0].transcript;
      }
      setText(t);
    };

    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
  }, []);

  const toggle = () => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      onFinal(text);
    } else {
      setText("");
      recognitionRef.current.start();
    }
    setListening(!listening);
  };

  return (
    <>
      <button
        onClick={toggle}
        className={`w-full py-3 rounded text-sm font-semibold ${
          listening ? "bg-red-600" : "bg-blue-600"
        } text-white`}
      >
        {listening ? "🛑 Stop Recording" : "🎙️ Start Answer"}
      </button>

      <div className="mt-3 p-3 border rounded bg-gray-50 text-sm min-h-[80px]">
        {text || "Your answer will appear here…"}
      </div>
    </>
  );
}
