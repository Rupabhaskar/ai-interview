export function technicalScore(text) {
  const keywords = [
    "react",
    "hook",
    "component",
    "state",
    "props",
    "effect",
    "javascript",
  ];

  const lower = text.toLowerCase();
  let matched = 0;

  keywords.forEach((k) => {
    if (lower.includes(k)) matched++;
  });

  return Math.round((matched / keywords.length) * 10);
}
