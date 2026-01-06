export function technicalScore(answer, skills) {
  const lower = answer.toLowerCase();
  let matched = 0;

  skills.forEach((skill) => {
    if (lower.includes(skill)) matched++;
  });

  return Math.min(10, matched * 2);
}

export function meaningScore(answer) {
  const fillers = ["umm", "uh", "like", "you know"];
  const sentences = answer.split(/[.!?]/).length;
  const fillerCount = fillers.filter(f => answer.includes(f)).length;

  let score = 8;
  if (sentences < 2) score -= 2;
  if (fillerCount > 2) score -= 2;

  return Math.max(score, 3);
}
