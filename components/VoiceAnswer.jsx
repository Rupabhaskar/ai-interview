// "use client";

// import { useEffect, useRef, useState } from "react";

// export default function VoiceAnswer({ onFinal }) {
//   const [listening, setListening] = useState(false);
//   const [text, setText] = useState("");
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SR) return;

//     const rec = new SR();
//     rec.lang = "en-US";
//     rec.continuous = true;
//     rec.interimResults = true;

//     rec.onresult = (e) => {
//       let t = "";
//       for (let i = e.resultIndex; i < e.results.length; i++) {
//         t += e.results[i][0].transcript;
//       }
//       setText(t);
//     };

//     rec.onend = () => setListening(false);
//     recognitionRef.current = rec;
//   }, []);

//   const toggle = () => {
//     if (!recognitionRef.current) return;

//     if (listening) {
//       recognitionRef.current.stop();
//       onFinal(text);
//     } else {
//       setText("");
//       recognitionRef.current.start();
//     }
//     setListening(!listening);
//   };

//   return (
//     <>
//       <button
//         onClick={toggle}
//         className={`w-full py-3 rounded text-sm font-semibold ${
//           listening ? "bg-red-600" : "bg-blue-600"
//         } text-white`}
//       >
//         {listening ? "🛑 Stop Recording" : "🎙️ Start Answer"}
//       </button>

//       <div className="mt-3 p-3 border rounded bg-gray-50 text-sm min-h-[80px]">
//         {text || "Your answer will appear here…"}
//       </div>
//     </>
//   );
// }




"use client";

import { useEffect, useRef, useState } from "react";

export default function VoiceAnswer({ onFinal }) {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const recognitionRef = useRef(null);

  /* ================================
     INIT SPEECH RECOGNITION
  ================================ */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;        // ✅ keep listening
    recognition.interimResults = true;    // ✅ live text

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setText((prev) => prev + " " + transcript);
    };

    recognition.onerror = (e) => {
      console.error("Speech error:", e);
    };

    recognitionRef.current = recognition;
  }, []);

  /* ================================
     START RECORDING
  ================================ */
  const startRecording = () => {
    if (!recognitionRef.current || listening) return;

    setText("");
    recognitionRef.current.start();
    setListening(true);
  };

  /* ================================
     STOP RECORDING
  ================================ */
  const stopRecording = () => {
    if (!recognitionRef.current || !listening) return;

    recognitionRef.current.stop();
    setListening(false);
    onFinal(text.trim()); // ✅ send final text to parent
  };

  return (
    <div>
      {/* ===== BUTTONS ===== */}
      <div className="flex gap-3">
        <button
          onClick={startRecording}
          disabled={listening}
          className={`w-full py-3 rounded text-sm font-semibold ${
            listening
              ? "bg-gray-300 text-gray-600"
              : "bg-blue-600 text-white"
          }`}
        >
          🎙️ Start Recording
        </button>

        <button
          onClick={stopRecording}
          disabled={!listening}
          className={`w-full py-3 rounded text-sm font-semibold ${
            listening
              ? "bg-red-600 text-white"
              : "bg-gray-300 text-gray-600"
          }`}
        >
          🛑 Stop
        </button>
      </div>

      {/* ===== LIVE TRANSCRIPTION ===== */}
      <div className="mt-3 p-3 border rounded bg-gray-50 text-sm min-h-[100px]">
        {text || "Your spoken answer will appear here..."}
      </div>
    </div>
  );
}
