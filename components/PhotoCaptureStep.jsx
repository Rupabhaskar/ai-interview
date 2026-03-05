"use client";

import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import InterviewCard from "./InterviewCard";
import {
  FilesetResolver,
  FaceDetector,
} from "@mediapipe/tasks-vision";
import { extractFaceDescriptor } from "@/lib/faceRecognition";

const MEDIAPIPE_SUPPRESS =
  /INFO:.*TensorFlow Lite|gl_context\.cc|GL version|Graph successfully started|inference_feedback_manager|GL_INVALID_FRAMEBUFFER|I\d{4} \d{2}:\d{2}:\d{2}|W\d{4} \d{2}:\d{2}:\d{2}/;
function suppressLogs() {
  const orig = { log: console.log, info: console.info, warn: console.warn, error: console.error };
  const filter = (fn) => (...args) => {
    if (MEDIAPIPE_SUPPRESS.test(String(args[0] ?? ""))) return;
    fn.apply(console, args);
  };
  console.log = filter(orig.log);
  console.info = filter(orig.info);
  console.warn = filter(orig.warn);
  console.error = filter(orig.error);
  return () => {
    console.log = orig.log;
    console.info = orig.info;
    console.warn = orig.warn;
    console.error = orig.error;
  };
}

const WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite";

const FACE_DETECTED_FRAMES = 12; // ~1.2 sec at 10fps
const MIN_FACE_SIZE = 0.07; // Min face area as fraction of frame
const EDGE_MARGIN = 0.05; // Face must be fully inside frame with 5% margin from each edge

export default function PhotoCaptureStep({ onComplete }) {
  const webcamRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(true);
  const [detectorReady, setDetectorReady] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [canStart, setCanStart] = useState(false);
  const [faceHint, setFaceHint] = useState(""); // "full" | "partial" | "none"
  const [isCapturing, setIsCapturing] = useState(false);
  const faceDetectorRef = useRef(null);
  const consecutiveFramesRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const restore = suppressLogs();
    return restore;
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setHasPermission(true))
      .catch(() => setHasPermission(false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const vision = await FilesetResolver.forVisionTasks(WASM_URL);
        const detector = await FaceDetector.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL },
          runningMode: "IMAGE",
          minDetectionConfidence: 0.6,
        });
        if (!cancelled) {
          faceDetectorRef.current = detector;
          setDetectorReady(true);
        }
      } catch (err) {
        console.error("Face detector init failed:", err);
      }
    }
    init();
    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!hasPermission || !detectorReady) return;

    const detector = faceDetectorRef.current;
    let lastTs = 0;
    let videoReadySince = 0;

    function detect() {
      const video = webcamRef.current?.video;
      if (!video || !faceDetectorRef.current) {
        rafRef.current = requestAnimationFrame(detect);
        return;
      }
      if (!video.videoWidth || !video.videoHeight) {
        videoReadySince = 0;
        rafRef.current = requestAnimationFrame(detect);
        return;
      }

      const now = performance.now();
      if (videoReadySince === 0) videoReadySince = now;
      if (now - videoReadySince < 400) {
        rafRef.current = requestAnimationFrame(detect);
        return;
      }
      if (now - lastTs < 100) {
        rafRef.current = requestAnimationFrame(detect);
        return;
      }
      lastTs = now;

      try {
        const result = detector.detect(video);
        const detections = result?.detections ?? [];

        if (detections.length > 0) {
          const face = detections[0];
          const box = face.boundingBox;
          if (box) {
            const isNorm = box.originY <= 1 && box.height <= 1;
            const x = isNorm ? box.originX : box.originX / video.videoWidth;
            const y = isNorm ? box.originY : box.originY / video.videoHeight;
            const w = isNorm ? box.width : box.width / video.videoWidth;
            const h = isNorm ? box.height : box.height / video.videoHeight;
            const area = w * h;

            // Face must be fully inside frame (not cut off at edges)
            const fullFace =
              x >= EDGE_MARGIN &&
              y >= EDGE_MARGIN &&
              x + w <= 1 - EDGE_MARGIN &&
              y + h <= 1 - EDGE_MARGIN;

            if (area >= MIN_FACE_SIZE && fullFace) {
              consecutiveFramesRef.current += 1;
              setFaceHint("full");
              if (consecutiveFramesRef.current >= FACE_DETECTED_FRAMES) {
                setFaceDetected(true);
                setCanStart(true);
              }
            } else {
              consecutiveFramesRef.current = 0;
              setFaceDetected(false);
              setCanStart(false);
              setFaceHint(detections.length > 0 ? "partial" : "none");
            }
          } else {
            consecutiveFramesRef.current = 0;
            setFaceDetected(false);
            setCanStart(false);
            setFaceHint("none");
          }
        } else {
          consecutiveFramesRef.current = 0;
          setFaceDetected(false);
          setCanStart(false);
          setFaceHint("none");
        }
      } catch {
        consecutiveFramesRef.current = 0;
        setFaceDetected(false);
        setCanStart(false);
        setFaceHint("none");
      }

      rafRef.current = requestAnimationFrame(detect);
    }

    detect();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [hasPermission, detectorReady]);

  const handleStart = async (skipVerification = false) => {
    if (!canStart && !skipVerification) return;
    setIsCapturing(true);
    try {
      const screenshot = webcamRef.current?.getScreenshot?.();
      if (!screenshot) {
        onComplete({ photo: null, descriptor: null });
        return;
      }
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = screenshot;
      });
      let descriptor = null;
      if (!skipVerification) {
        try {
          descriptor = await extractFaceDescriptor(img);
        } catch (err) {
          console.warn("Face descriptor extraction failed:", err);
        }
      }
      onComplete({ photo: screenshot, descriptor });
    } catch (err) {
      console.warn("Capture failed:", err);
      onComplete({ photo: null, descriptor: null });
    } finally {
      setIsCapturing(false);
    }
  };

  if (!hasPermission) {
    return (
      <InterviewCard>
        <p className="text-red-500">Camera permission denied. Please allow camera access.</p>
      </InterviewCard>
    );
  }

  return (
    <>
      <div
        className="
          fixed z-50 overflow-hidden rounded-xl border-2 border-gray-300 bg-black
          top-4 left-1/2 -translate-x-1/2
          w-[200px] h-[260px]
        "
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          mirrored
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "user" }}
          className="w-full h-full object-cover"
        />
        {faceDetected && (
          <div className="absolute inset-0 border-4 border-green-500 rounded-xl pointer-events-none" />
        )}
      </div>

      <InterviewCard>
        <h2 className="text-lg font-semibold mb-2">Verify your identity</h2>
        <p className="text-sm text-gray-600 mb-4">
          Position your <strong>full face</strong> in the frame — no half face or cut-off. Move back so your complete face fits inside the box.
        </p>

        <div className="mb-4 p-3 rounded-lg bg-gray-100">
          {faceDetected ? (
            <p className="text-green-600 font-medium flex items-center gap-2">
              <span className="text-xl">✓</span> Full face detected — you can start
            </p>
          ) : faceHint === "partial" ? (
            <p className="text-amber-600 font-medium flex items-center gap-2">
              <span className="text-xl">!</span> Full face required — move back and center so your complete face is visible
            </p>
          ) : (
            <p className="text-amber-600 font-medium flex items-center gap-2">
              <span className="text-xl">!</span> Position your full face clearly in the camera
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => handleStart(false)}
          disabled={!canStart || isCapturing}
          className="w-full bg-black text-white py-3 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
        >
          {isCapturing ? "Capturing…" : "Capture & Start Interview"}
        </button>

        <button
          type="button"
          onClick={() => handleStart(true)}
          disabled={isCapturing}
          className="w-full mt-2 py-2 text-sm text-gray-500 hover:text-gray-700 underline disabled:opacity-50"
        >
          Skip verification & continue
        </button>
      </InterviewCard>
    </>
  );
}
