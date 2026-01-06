export function generateSkillQuestions(skills) {
  const map = {
    react: [
      "Explain React hooks",
      "How does state management work in React?",
    ],
    nextjs: [
      "What is SSR in Next.js?",
      "Explain App Router",
    ],
    javascript: [
      "What is closure?",
      "Explain promises",
    ],
    node: [
      "How does Node.js handle async tasks?",
    ],
  };

  let questions = [];
  skills.forEach(skill => {
    if (map[skill]) questions.push(...map[skill]);
  });

  return questions;
}

export function generateProjectQuestions(projects) {
  return projects.map(
    p => `Explain the project: "${p}". What was your role and challenges?`
  );
}
