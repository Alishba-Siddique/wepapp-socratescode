export const stages = [
  { title: "Understand", question: "In your own words, what must the answer represent? What inputs are allowed?", review: ["Did you distinguish the input from the required output?", "Which constraint might change your approach?"] },
  { title: "Predict", question: "Work through one tiny example by hand. What do you expect before running anything?", review: ["Can you explain each change in your example?", "What happens at an empty, smallest or boundary input, if allowed?"] },
  { title: "Reason", question: "What information must you remember as you process the input? What should remain true after every step?", review: ["State the meaning of your current state in one sentence.", "Why does your next step preserve that meaning?"] },
  { title: "Investigate", question: "Which smallest example could disprove your approach? If it fails, where does the state first differ from your expectation?", review: ["Separate the observed result from your hypothesis.", "What single change or test would support or reject your hypothesis?"] },
  { title: "Explain", question: "Why should this work for every allowed input? How do the work and extra memory grow as the input grows?", review: ["Count repeated operations; do not guess complexity from the number of loops alone.", "Explain a tradeoff, one remaining doubt, and the regression case you would keep."] },
] as const;
export const topicHints = {
  general: ["What would the simplest correct approach do?", "Which repeated work could you avoid?", "Can you construct a case where your current assumption fails?"],
  arrays: ["Does the order of the values matter to the answer?", "What have you learned after visiting the first few elements?", "Which earlier information will you need when the next element arrives?"],
  strings: ["Does the question care about positions, frequencies, or contiguous parts?", "What changes when a character repeats?", "Which exact boundary defines the part you are considering?"],
  trees: ["What smaller question could you ask about a child or neighboring node?", "What stops a visit from repeating forever?", "Which result needs to travel back from a smaller part?"],
  testing: ["Which input distinguishes your intended rule from the rule your code actually follows?", "Can a one-element example hide the mistake?", "After your repair, which previously working case could break?"],
} as const;
export type Topic = keyof typeof topicHints;
export type Problem = { slug: string; url: string; title: string };
export type Draft = { version: 1; stage: number; topic: Topic; notes: string[] };
export function parseProblem(raw: string, title = ""): Problem | null {
  if (raw.length > 2048) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || !["leetcode.com", "www.leetcode.com"].includes(url.hostname) || url.port || url.username || url.password) return null;
    const match = /^\/problems\/([a-z0-9]+(?:-[a-z0-9]+)*)\/(?:.*)?$/.exec(url.pathname.endsWith("/") ? url.pathname : url.pathname + "/");
    if (!match || match[1].length > 160) return null;
    const name = title.replace(/\s*[-|–]\s*LeetCode.*$/i, "").trim().slice(0, 180);
    return { slug: match[1], url: `https://leetcode.com/problems/${match[1]}/`, title: name || match[1].split("-").map(part => part[0].toUpperCase() + part.slice(1)).join(" ") };
  } catch { return null; }
}
export function emptyDraft(): Draft { return { version: 1, stage: 0, topic: "general", notes: stages.map(() => "") }; }
export function parseDraft(value: unknown): Draft {
  if (!value || typeof value !== "object" || Array.isArray(value)) return emptyDraft();
  const row = value as Record<string, unknown>;
  if (row.version !== 1 || !Number.isInteger(row.stage) || Number(row.stage) < 0 || Number(row.stage) >= stages.length || typeof row.topic !== "string" || !Object.hasOwn(topicHints, row.topic) || !Array.isArray(row.notes) || row.notes.length !== stages.length || !row.notes.every(note => typeof note === "string" && note.length <= 1500)) return emptyDraft();
  return { version: 1, stage: Number(row.stage), topic: row.topic as Topic, notes: [...row.notes] as string[] };
}
export function exportNotes(problem: Problem, draft: Draft): string {
  return `# My Socratic reasoning: ${problem.slug}\n\nProblem: ${problem.url}\n\nPersonal notes; self-review only.\n\n` + stages.map((stage, index) => `## ${stage.title}\n\n${(draft.notes[index] || "Not recorded yet.").replace(/\r\n?/g, "\n").split("\n").map(line => `    ${line}`).join("\n")}\n`).join("\n");
}
