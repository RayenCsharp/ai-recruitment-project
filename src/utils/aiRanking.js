const STOP_WORDS = new Set([
  "and",
  "or",
  "with",
  "for",
  "the",
  "a",
  "an",
  "to",
  "of",
  "in",
  "on",
  "at",
  "is",
  "are",
]);

const normalize = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (text) =>
  normalize(text)
    .split(" ")
    .filter((token) => token && !STOP_WORDS.has(token));

export const rankCvAgainstJob = ({ skills = [], description = "", cvText = "" }) => {
  const cvTokens = new Set(tokenize(cvText));
  const jobTokens = new Set(tokenize(description));

  const normalizedSkills = skills
    .map((skill) => normalize(skill))
    .filter(Boolean);

  const matchedSkills = normalizedSkills.filter((skill) => {
    const skillTokens = skill.split(" ").filter(Boolean);
    return skillTokens.every((token) => cvTokens.has(token));
  });

  const missingSkills = normalizedSkills.filter(
    (skill) => !matchedSkills.includes(skill)
  );

  let semanticHits = 0;
  jobTokens.forEach((token) => {
    if (cvTokens.has(token)) {
      semanticHits += 1;
    }
  });

  const skillsWeight = normalizedSkills.length
    ? matchedSkills.length / normalizedSkills.length
    : 0.5;

  const semanticWeight = jobTokens.size ? semanticHits / jobTokens.size : 0.5;

  const score = Math.round((skillsWeight * 0.7 + semanticWeight * 0.3) * 100);

  return {
    score: Math.max(1, Math.min(score, 99)),
    matchedSkills,
    missingSkills,
  };
};
