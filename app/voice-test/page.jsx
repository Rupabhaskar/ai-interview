// "use client";

// import { useState, useRef } from "react";

// export default function VoiceTestPage() {
//   const [listening, setListening] = useState(false);
//   const [text, setText] = useState("");
//   const recognitionRef = useRef(null);

//   const startListening = () => {
//     // Check browser support
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       alert("Speech Recognition not supported in this browser.");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.continuous = true;
//     recognition.interimResults = true;

//     recognition.onresult = (event) => {
//       let finalTranscript = "";
//       let interimTranscript = "";

//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const transcript = event.results[i][0].transcript;
//         if (event.results[i].isFinal) {
//           finalTranscript += transcript + " ";
//         } else {
//           interimTranscript += transcript;
//         }
//       }

//       setText((prev) => prev + finalTranscript);
//     };

//     recognition.onerror = (e) => {
//       console.error("Speech recognition error:", e);
//       setListening(false);
//     };

//     recognition.onend = () => {
//       setListening(false);
//     };

//     recognitionRef.current = recognition;
//     recognition.start();
//     setListening(true);
//   };

//   const stopListening = () => {
//     recognitionRef.current?.stop();
//     setListening(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6">
//       <div className="bg-white p-6 rounded shadow max-w-xl w-full">
//         <h1 className="text-xl font-bold mb-4">
//           Speech to Text – Test Page
//         </h1>

//         <div className="flex gap-4 mb-4">
//           {!listening ? (
//             <button
//               onClick={startListening}
//               className="bg-green-600 text-white px-4 py-2 rounded"
//             >
//               Start Speaking
//             </button>
//           ) : (
//             <button
//               onClick={stopListening}
//               className="bg-red-600 text-white px-4 py-2 rounded"
//             >
//               Stop
//             </button>
//           )}
//         </div>

//         <textarea
//           className="w-full border p-3 rounded"
//           rows="8"
//           placeholder="Your spoken text will appear here..."
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//         />

//         <p className="text-sm text-gray-500 mt-3">
//           Tip: Use Google Chrome for best results.
//         </p>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useRef } from "react";

export default function VoiceTestPage() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const recognitionRef = useRef(null);

  const startListening = async () => {
    if (listening) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    try {
      // Ask mic permission explicitly
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      alert("Microphone permission denied.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript + " ";
        }
      }

      if (finalText) {
        setText((prev) => prev + finalText);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);
      alert(`Speech recognition error: ${event.error}`);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
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
          rows="8"
          placeholder="Your spoken text will appear here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <p className="text-sm text-gray-500 mt-3">
          Use Google Chrome • Allow microphone • Run on localhost
        </p>
      </div>
    </div>
  );
}
