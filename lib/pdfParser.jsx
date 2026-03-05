"use client";

export async function extractTextFromPDF(file) {
  if (!window.pdfjsLib) {
    throw new Error("PDF.js not loaded");
  }

  const pdfjsLib = window.pdfjsLib;

  // Set workerSrc to silence deprecation (use disableWorker for main-thread parsing)
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }

  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
    disableWorker: true,
  }).promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map(item => item.str).join(" ");
    fullText += text + "\n";
  }

  return fullText;
}
