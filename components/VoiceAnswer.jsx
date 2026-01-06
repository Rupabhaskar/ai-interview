// // // "use client";

// // // import { useEffect, useRef, useState } from "react";

// // // export default function VoiceAnswer({ onFinal }) {
// // //   const [listening, setListening] = useState(false);
// // //   const [text, setText] = useState("");
// // //   const recognitionRef = useRef(null);

// // //   useEffect(() => {
// // //     const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
// // //     if (!SR) return;

// // //     const rec = new SR();
// // //     rec.lang = "en-US";
// // //     rec.continuous = true;
// // //     rec.interimResults = true;

// // //     rec.onresult = (e) => {
// // //       let t = "";
// // //       for (let i = e.resultIndex; i < e.results.length; i++) {
// // //         t += e.results[i][0].transcript;
// // //       }
// // //       setText(t);
// // //     };

// // //     rec.onend = () => setListening(false);
// // //     recognitionRef.current = rec;
// // //   }, []);

// // //   const toggle = () => {
// // //     if (!recognitionRef.current) return;

// // //     if (listening) {
// // //       recognitionRef.current.stop();
// // //       onFinal(text);
// // //     } else {
// // //       setText("");
// // //       recognitionRef.current.start();
// // //     }
// // //     setListening(!listening);
// // //   };

// // //   return (
// // //     <>
// // //       <button
// // //         onClick={toggle}
// // //         className={`w-full py-3 rounded text-sm font-semibold ${
// // //           listening ? "bg-red-600" : "bg-blue-600"
// // //         } text-white`}
// // //       >
// // //         {listening ? "🛑 Stop Recording" : "🎙️ Start Answer"}
// // //       </button>

// // //       <div className="mt-3 p-3 border rounded bg-gray-50 text-sm min-h-[80px]">
// // //         {text || "Your answer will appear here…"}
// // //       </div>
// // //     </>
// // //   );
// // // }




// // "use client";

// // import { useEffect, useRef, useState } from "react";

// // export default function VoiceAnswer({ onFinal }) {
// //   const [listening, setListening] = useState(false);
// //   const [text, setText] = useState("");

// //   const recognitionRef = useRef(null);
// //   const forceStopRef = useRef(false);

// //   useEffect(() => {
// //     const SpeechRecognition =
// //       window.SpeechRecognition || window.webkitSpeechRecognition;

// //     if (!SpeechRecognition) {
// //       alert("Speech Recognition not supported in this browser");
// //       return;
// //     }

// //     const recognition = new SpeechRecognition();
// //     recognition.lang = "en-US";
// //     recognition.continuous = true;
// //     recognition.interimResults = true;

// //     recognition.onresult = (event) => {
// //       let transcript = "";
// //       for (let i = event.resultIndex; i < event.results.length; i++) {
// //         transcript += event.results[i][0].transcript;
// //       }
// //       setText((prev) => prev + " " + transcript);
// //     };

// //     recognition.onend = () => {
// //       // 🔥 KEEP RECORDING unless user clicks Stop
// //       if (listening && !forceStopRef.current) {
// //         recognition.start();
// //       }
// //     };

// //     recognitionRef.current = recognition;
// //   }, [listening]);

// //   const startRecording = () => {
// //     if (!recognitionRef.current) return;

// //     setText("");
// //     forceStopRef.current = false;
// //     setListening(true);
// //     recognitionRef.current.start();
// //   };

// //   const stopRecording = () => {
// //     if (!recognitionRef.current) return;

// //     forceStopRef.current = true;
// //     recognitionRef.current.stop();
// //     setListening(false);
// //     onFinal(text.trim());
// //   };

// //   return (
// //     <div>
// //       {!listening ? (
// //         <button
// //           onClick={startRecording}
// //           className="w-full bg-blue-600 text-white py-3 rounded font-semibold"
// //         >
// //           🎙️ Start Recording
// //         </button>
// //       ) : (
// //         <button
// //           onClick={stopRecording}
// //           className="w-full bg-red-600 text-white py-3 rounded font-semibold"
// //         >
// //           🛑 Stop Recording
// //         </button>
// //       )}

// //       <div className="mt-3 p-3 border rounded bg-gray-50 text-sm min-h-[100px]">
// //         {text || "Listening... Speak your answer"}
// //       </div>
// //     </div>
// //   );
// // }


// "use client";

// import { useEffect, useRef, useState } from "react";

// export default function VoiceAnswer({ onFinal }) {
//   const [listening, setListening] = useState(false);
//   const [finalText, setFinalText] = useState("");
//   const [interimText, setInterimText] = useState("");

//   const recognitionRef = useRef(null);
//   const shouldListenRef = useRef(false);

//   useEffect(() => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       alert("Speech Recognition not supported in this browser");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.continuous = true;
//     recognition.interimResults = true;

//     recognition.onresult = (event) => {
//       let interim = "";
//       let final = "";

//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const transcript = event.results[i][0].transcript;
//         if (event.results[i].isFinal) {
//           final += transcript + " ";
//         } else {
//           interim += transcript;
//         }
//       }

//       if (final) {
//         setFinalText((prev) => prev + final);
//       }
//       setInterimText(interim);
//     };

//     recognition.onend = () => {
//       // 🔥 Restart ONLY if user still wants to speak
//       if (shouldListenRef.current) {
//         recognition.start();
//       }
//     };

//     recognitionRef.current = recognition;
//   }, []);

//   const startRecording = () => {
//     if (!recognitionRef.current) return;

//     setFinalText("");
//     setInterimText("");
//     shouldListenRef.current = true;
//     setListening(true);

//     try {
//       recognitionRef.current.start();
//     } catch {
//       // prevents DOMException if already started
//     }
//   };

//   const stopRecording = () => {
//     if (!recognitionRef.current) return;

//     shouldListenRef.current = false;
//     setListening(false);
//     recognitionRef.current.stop();

//     onFinal(finalText.trim());
//   };

//   return (
//     <div>
//       {!listening ? (
//         <button
//           onClick={startRecording}
//           className="w-full bg-blue-600 text-white py-3 rounded font-semibold"
//         >
//           🎙️ Start Recording
//         </button>
//       ) : (
//         <button
//           onClick={stopRecording}
//           className="w-full bg-red-600 text-white py-3 rounded font-semibold"
//         >
//           🛑 Stop Recording
//         </button>
//       )}

//       <div className="mt-3 p-3 border rounded bg-gray-50 text-sm min-h-[120px]">
//         <span className="text-black">{finalText}</span>
//         <span className="text-gray-400">{interimText}</span>
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useRef, useState } from "react";

export default function VoiceAnswer({ onFinal }) {
  const [listening, setListening] = useState(false);
  const [finalText, setFinalText] = useState("");
  const [interimText, setInterimText] = useState("");

  const recognitionRef = useRef(null);
  const shouldListenRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let final = "";
      let interim = "";

      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + " ";
        } else {
          interim += transcript;
        }
      }

      setFinalText(final.trim());
      setInterimText(interim);
    };

    recognition.onend = () => {
      // restart ONLY if user is still recording
      if (shouldListenRef.current) {
        try {
          recognition.start();
        } catch {}
      }
    };

    recognition.onerror = (err) => {
      console.error("Speech recognition error:", err);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current) return;

    setFinalText("");
    setInterimText("");
    shouldListenRef.current = true;
    setListening(true);

    try {
      recognitionRef.current.start();
    } catch {}
  };

  const stopRecording = () => {
    if (!recognitionRef.current) return;

    shouldListenRef.current = false;
    setListening(false);
    recognitionRef.current.stop();

    onFinal?.(finalText.trim());
  };

  return (
    <div>
      {!listening ? (
        <button
          onClick={startRecording}
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold"
        >
          🎙️ Start Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="w-full bg-red-600 text-white py-3 rounded font-semibold"
        >
          🛑 Stop Recording
        </button>
      )}

      <div className="mt-3 p-3 border rounded bg-gray-50 text-sm min-h-[120px]">
        <span className="text-black">{finalText} </span>
        <span className="text-gray-400">{interimText}</span>
      </div>
    </div>
  );
}
