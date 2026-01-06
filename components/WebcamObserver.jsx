"use client";

import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";

export default function WebcamObserver() {
  const webcamRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(true);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setHasPermission(true))
      .catch(() => setHasPermission(false));
  }, []);

  if (!hasPermission) {
    return (
      <div className="fixed top-2 right-2 bg-red-500 text-white p-2 rounded text-xs z-50">
        Camera permission denied
      </div>
    );
  }

  return (
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
  );
}
