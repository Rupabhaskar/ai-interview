"use client";

import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import {
  FilesetResolver,
  FaceDetector,
} from "@mediapipe/tasks-vision";
import {
  loadFaceRecognitionModels,
  extractFaceDescriptor,
  compareFacesAsync,
} from "@/lib/faceRecognition";

// MediaPipe/TensorFlow/WebGL logs via console.*; suppress to avoid console noise
const MEDIAPIPE_SUPPRESS_PATTERN =
  /INFO:.*TensorFlow Lite|Replacing \d+ node\(s\) with delegate|gl_context\.cc|GL version|OpenGL error checking is disabled|Graph successfully started|inference_feedback_manager|Feedback manager|GL_INVALID_FRAMEBUFFER_OPERATION|Framebuffer is incomplete|Attachment has zero size|I\d{4} \d{2}:\d{2}:\d{2}|W\d{4} \d{2}:\d{2}:\d{2}/;
function suppressMediaPipeLogs() {
  const orig = { log: console.log, info: console.info, warn: console.warn, error: console.error };
  const filter = (fn) => (...args) => {
    const msg = String(args[0] ?? "");
    if (MEDIAPIPE_SUPPRESS_PATTERN.test(msg)) return;
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

// How far down (as fraction of frame 0-1) before showing warning
const DOWN_THRESHOLD = 0.12;
// How far left/right (as fraction of frame 0-1) before showing warning
const SIDE_THRESHOLD = 0.15;
// Smoothing: how many frames to average for baseline
const BASELINE_SAMPLES = 5;
// Frames without face before "not detected" alert (~3 sec at 10fps)
const NO_FACE_ALERT_THRESHOLD = 30;

export default function WebcamObserver({
  onFaceNotDetected,
  onFaceMismatch,
  referenceDescriptor,
}) {
  const webcamRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(true);
  const [faceDownWarning, setFaceDownWarning] = useState(false);
  const [faceSideWarning, setFaceSideWarning] = useState(false);
  const [detectorReady, setDetectorReady] = useState(false);
  const faceDetectorRef = useRef(null);
  const baselineYRef = useRef(null);
  const baselineXRef = useRef(null);
  const baselineSamplesRef = useRef([]);
  const noFaceCountRef = useRef(0);
  const [faceNotDetectedAlert, setFaceNotDetectedAlert] = useState(false);
  const [faceMismatchWarning, setFaceMismatchWarning] = useState(false);
  const lastFaceMatchCheckRef = useRef(0);
  const faceMismatchAlertedRef = useRef(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const restore = suppressMediaPipeLogs();
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

    async function initDetector() {
      try {
        const vision = await FilesetResolver.forVisionTasks(WASM_URL);
        const detector = await FaceDetector.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL },
          runningMode: "IMAGE",
          minDetectionConfidence: 0.5,
        });
        if (!cancelled) {
          faceDetectorRef.current = detector;
          setDetectorReady(true);
        }
      } catch (err) {
        console.error("Face detector init failed:", err);
      }
    }

    initDetector();
    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (referenceDescriptor) {
      loadFaceRecognitionModels().catch(console.warn);
    }
  }, [referenceDescriptor]);

  useEffect(() => {
    if (!hasPermission || !detectorReady) return;

    const detector = faceDetectorRef.current;
    let lastTimestamp = 0;
    let videoReadySince = 0;

    async function checkFaceMatch(video) {
      if (!referenceDescriptor || !video?.videoWidth) return;
      const now = performance.now();
      if (now - lastFaceMatchCheckRef.current < 1000) return;
      lastFaceMatchCheckRef.current = now;

      try {
        const currentDescriptor = await extractFaceDescriptor(video);
        if (!currentDescriptor) {
          setFaceMismatchWarning(false);
          return;
        }
        const matches = await compareFacesAsync(referenceDescriptor, currentDescriptor);
        if (!matches) {
          setFaceMismatchWarning(true);
          if (!faceMismatchAlertedRef.current) {
            faceMismatchAlertedRef.current = true;
            onFaceMismatch?.();
          }
        } else {
          setFaceMismatchWarning(false);
          faceMismatchAlertedRef.current = false;
        }
      } catch {
        setFaceMismatchWarning(false);
      }
    }

    function detect() {
      const webcam = webcamRef.current;
      const video = webcam?.video;

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

      if (now - lastTimestamp < 80) {
        rafRef.current = requestAnimationFrame(detect);
        return;
      }
      lastTimestamp = now;

      try {
        const result = detector.detect(video);
        const detections = result?.detections ?? [];

        if (detections.length > 0) {
          noFaceCountRef.current = 0;
          setFaceNotDetectedAlert(false);

          if (referenceDescriptor) {
            checkFaceMatch(video);
          } else {
            setFaceMismatchWarning(false);
          }

          const face = detections[0];
          const box = face.boundingBox;
          if (box) {
            const isNormalized = box.originY <= 1 && box.height <= 1;
            const centerX = box.originX + box.width / 2;
            const centerY = box.originY + box.height / 2;
            const normalizedX = isNormalized
              ? centerX
              : centerX / video.videoWidth;
            const normalizedY = isNormalized
              ? centerY
              : centerY / video.videoHeight;

            if (baselineYRef.current === null) {
              baselineSamplesRef.current.push({ x: normalizedX, y: normalizedY });
              if (baselineSamplesRef.current.length >= BASELINE_SAMPLES) {
                const samples = baselineSamplesRef.current;
                const avgX =
                  samples.reduce((a, s) => a + s.x, 0) / samples.length;
                const avgY =
                  samples.reduce((a, s) => a + s.y, 0) / samples.length;
                baselineXRef.current = avgX;
                baselineYRef.current = avgY;
              }
            } else {
              const baselineX = baselineXRef.current;
              const baselineY = baselineYRef.current;

              if (normalizedY > baselineY + DOWN_THRESHOLD) {
                setFaceDownWarning(true);
              } else {
                setFaceDownWarning(false);
              }

              if (
                normalizedX > baselineX + SIDE_THRESHOLD ||
                normalizedX < baselineX - SIDE_THRESHOLD
              ) {
                setFaceSideWarning(true);
              } else {
                setFaceSideWarning(false);
              }
            }
          }
        } else {
          setFaceDownWarning(false);
          setFaceSideWarning(false);
          setFaceMismatchWarning(false);
          faceMismatchAlertedRef.current = false;
          noFaceCountRef.current += 1;
          if (noFaceCountRef.current === NO_FACE_ALERT_THRESHOLD) {
            setFaceNotDetectedAlert(true);
            onFaceNotDetected?.();
          }
        }
      } catch (err) {
        console.warn("Face detection error:", err);
      }

      rafRef.current = requestAnimationFrame(detect);
    }

    detect();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [hasPermission, detectorReady, referenceDescriptor, onFaceNotDetected, onFaceMismatch]);

  if (!hasPermission) {
    return (
      <div className="fixed top-2 right-2 bg-red-500 text-white p-2 rounded text-xs z-50">
        Camera permission denied
      </div>
    );
  }

  return (
    <>
      {faceDownWarning && (
        <div
          className="
            fixed z-[60] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2
            bg-amber-500/95 text-black px-6 py-4 rounded-xl shadow-lg
            text-center font-semibold text-lg animate-pulse
          "
        >
          ⚠️ Please look up — keep your face in view
        </div>
      )}

      {faceSideWarning && !faceDownWarning && (
        <div
          className="
            fixed z-[60] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2
            bg-amber-500/95 text-black px-6 py-4 rounded-xl shadow-lg
            text-center font-semibold text-lg animate-pulse
          "
        >
          ⚠️ Please keep your face centered — look at the camera
        </div>
      )}

      {faceNotDetectedAlert && (
        <div
          className="
            fixed z-[60] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2
            bg-red-500/95 text-white px-6 py-4 rounded-xl shadow-lg
            text-center font-semibold text-lg animate-pulse
          "
        >
          ⚠️ Face not detected — please ensure your face is clearly visible in the camera
        </div>
      )}

      {faceMismatchWarning && (
        <div
          className="
            fixed z-[60] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2
            bg-red-500/95 text-white px-6 py-4 rounded-xl shadow-lg
            text-center font-semibold text-lg animate-pulse
          "
        >
          ⚠️ Face does not match — please ensure you are the same person who started the interview
        </div>
      )}

      <div
        className="
          fixed z-50 overflow-hidden rounded-xl border border-gray-300 bg-black
          top-2 left-1/2 -translate-x-1/2
          sm:left-auto sm:translate-x-0 sm:top-4 sm:right-4
          w-[140px] h-[190px]
          sm:w-[180px] sm:h-[240px]
        "
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          mirrored
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: "user",
          }}
          className="w-full h-full object-cover"
        />
      </div>
    </>
  );
}
