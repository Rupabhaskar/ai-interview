export const SKILL_KEYWORDS = {
  react: ["react", "hooks", "jsx"],
  nextjs: ["next.js", "app router", "ssr"],
  javascript: ["javascript", "es6", "closure"],
  node: ["node", "express"],
  html: ["html"],
  css: ["css", "flexbox", "grid"],
};

export function analyzeResume(text) {
  const lower = text.toLowerCase();

  // Skill detection
  const skills = Object.keys(SKILL_KEYWORDS).filter(skill =>
    SKILL_KEYWORDS[skill].some(k => lower.includes(k))
  );

  // Project detection (basic)
  const projectLines = text
    .split("\n")
    .filter(line =>
      line.toLowerCase().includes("project") ||
      line.toLowerCase().includes("developed") ||
      line.toLowerCase().includes("built")
    );

  return {
    skills,
    projects: projectLines.slice(0, 3),
  };
}
