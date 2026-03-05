"use client";

const MODEL_URL =
  "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model";
const FACE_MATCH_THRESHOLD = 0.6; // euclidean distance > 0.6 = different person

let faceapi = null;
let modelsLoaded = false;

async function loadFaceApi() {
  if (faceapi) return faceapi;
  faceapi = await import("@vladmandic/face-api");
  return faceapi;
}

export async function loadFaceRecognitionModels() {
  if (modelsLoaded) return true;
  const api = await loadFaceApi();
  await api.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
  await api.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  await api.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  modelsLoaded = true;
  return true;
}

export async function extractFaceDescriptor(input) {
  const api = await loadFaceApi();
  if (!modelsLoaded) await loadFaceRecognitionModels();

  const result = await api
    .detectSingleFace(input, new api.SsdMobilenetv1Options({ minConfidence: 0.5 }))
    .withFaceLandmarks()
    .withFaceDescriptor();

  return result?.descriptor ?? null;
}

export async function compareFacesAsync(descriptor1, descriptor2) {
  if (!descriptor1 || !descriptor2) return false;
  const api = await loadFaceApi();
  const d1 = Array.isArray(descriptor1) ? descriptor1 : Array.from(descriptor1);
  const d2 = Array.isArray(descriptor2) ? descriptor2 : Array.from(descriptor2);
  const distance = api.euclideanDistance(d1, d2);
  return distance <= FACE_MATCH_THRESHOLD;
}
