export const SKILLS = {
  react: ["react", "hooks", "jsx"],
  nextjs: ["next.js", "app router", "ssr"],
  javascript: ["javascript", "closure", "promise"],
  html: ["html", "semantic"],
  css: ["css", "flexbox", "grid"],
};

export function extractSkills(resumeText) {
  const text = resumeText.toLowerCase();
  const found = [];

  for (const skill in SKILLS) {
    if (SKILLS[skill].some((k) => text.includes(k))) {
      found.push(skill);
    }
  }

  return found;
}
