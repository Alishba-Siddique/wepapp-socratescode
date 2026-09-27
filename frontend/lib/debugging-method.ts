import type { DebugQuestion } from "./coding-problems.ts";

export const debuggingSteps: { title: string; idea: string; question: DebugQuestion }[] = [
  { title: "Read the symptom", idea: "A bug is a difference between the behavior you need and the behavior you observe. An error message is evidence, not a judgment about you. Read its last line first, then inspect the named line in your own code.",
    question: { prompt: "The program starts, then stops at print(totla) with NameError: name 'totla' is not defined. What kind of failure is this?", options: ["A logic bug: it finished with the wrong answer", "A runtime error: an instruction could not finish", "A syntax error: Python could not read the program"], correct: 1, feedback: ["It did not finish. Python stopped when it could not find that name.", "Yes. Inspect the spelling and where the variable was assigned before changing anything else.", "Python could read this instruction. The failure happened while looking up a name during execution."] } },
  { title: "Make it reproducible", idea: "Write the input, expected result, and actual result. Keep shrinking the input while the failure still happens. A small reproducer makes each change easier to follow. Our basket should add prices, but the supplied program remembers only the last price.",
    question: { prompt: "Which input proves this basket program is wrong?", options: ["[7]: expected 7, actual 7", "[]: expected 0, actual 0", "[4, 2]: expected 6, actual 2"], correct: 2, feedback: ["One item hides the mistake. The observed result still matches the requirement.", "The empty input works here. Keep a case where expected and actual differ.", "Exactly. Two different prices are enough to reproduce the loss of earlier state."] } },
  { title: "Find the first mismatch", idea: "A debugger lets you pause a program and inspect values. A breakpoint is a chosen pause location; stepping advances execution; a watch shows a value. Here you will use an authored trace, not a live debugger. Compare the state after each update with what it should mean.",
    question: { prompt: "Where does total first stop representing the sum of the prices already visited?", options: ["When total starts at zero", "After visiting the first price", "After visiting the second price"], correct: 2, feedback: ["Before any price, a total of zero is correct.", "After just 4, the total is still correct. Inspect the next update.", "Yes. The second update loses the earlier price. That is stronger evidence than merely noticing the final answer is wrong."] } },
  { title: "Repair, then challenge it", idea: "State a hypothesis before editing: which operation could explain the mismatch? Change one cause at a time. Re-run the failing case, then cases that already worked. A regression test keeps an old bug from quietly returning. Passing a few cases is evidence, not proof for every input.",
    question: { prompt: "What is the strongest check of a proposed basket repair?", options: ["Run the original failing case, empty and single baskets, and a basket ending in a free item", "Check only [4, 2] because it originally failed", "Change several lines until one example passes"], correct: 0, feedback: ["Exactly. Reproduce the fix and protect behavior that already worked. The free final item helps reveal whether earlier prices survive.", "That confirms one result but may miss a newly broken empty or single-item basket.", "Several changes at once make it harder to tell which idea was right. Test one hypothesis at a time."] } },
];
export const basketTraceCode = "total = 0\nfor price in [4, 2]:\n    total = price\nprint(total)";
export const basketTrace = [
  { line: 0, step: "Before the loop", actual: 0, expected: 0, why: "No items have been processed yet." },
  { line: 2, step: "After price = 4", actual: 4, expected: 4, why: "The first update looks correct. One-item tests cannot reveal this bug." },
  { line: 2, step: "After price = 2", actual: 2, expected: 6, why: "The earlier 4 has disappeared. The update replaced the total instead of retaining earlier work." },
  { line: 3, step: "Display the result", actual: 2, expected: 6, why: "print reveals the mismatch; it did not cause it. Investigate the earlier update." },
];
export function parseDebuggingProgress(raw: string | null): number {
  if (!raw || raw.length > 128) return 0;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return 0;
    const row = value as Record<string, unknown>;
    return row.version === 1 && Number.isInteger(row.completed) && Number(row.completed) >= 0 && Number(row.completed) <= debuggingSteps.length ? Number(row.completed) : 0;
  } catch { return 0; }
}

export const notebookFields = [
  { key: "input", label: "Smallest input that reproduces the bug", prompt: "Keep it small. Can you remove an item and still see the same failure?" },
  { key: "expected", label: "Expected behavior", prompt: "What should happen according to the problem's rule?" },
  { key: "actual", label: "Observed behavior", prompt: "Record the returned value or exact error. Keep observations separate from guesses." },
  { key: "hypothesis", label: "My hypothesis", prompt: "Which operation might explain the first mismatch, and why?" },
  { key: "experiment", label: "One change or test to try", prompt: "What result would support or contradict your hypothesis?" },
  { key: "outcome", label: "What happened and what I learned", prompt: "Was the hypothesis supported? Which regression cases did you check?" },
] as const;
export type DebugNotebook = Record<(typeof notebookFields)[number]["key"], string>;
export function emptyDebugNotebook(): DebugNotebook { return { input: "", expected: "", actual: "", hypothesis: "", experiment: "", outcome: "" }; }
export function parseDebugNotebook(raw: string | null): DebugNotebook {
  const result = emptyDebugNotebook();
  if (!raw || raw.length > 40000) return result;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return result;
    const row = value as Record<string, unknown>;
    if (row.version !== 1 || !row.notes || typeof row.notes !== "object" || Array.isArray(row.notes)) return result;
    const notes = row.notes as Record<string, unknown>;
    if (notebookFields.some(field => typeof notes[field.key] !== "string" || (notes[field.key] as string).length > 1000)) return result;
    for (const field of notebookFields) result[field.key] = notes[field.key] as string;
    return result;
  } catch { return result; }
}
export function notebookMarkdown(title: string, notes: DebugNotebook): string {
  return `# Debugging notebook: ${title}\n\nPersonal observations, not a verified assessment.\n\n` + notebookFields.map(field => `## ${field.label}\n\n${(notes[field.key] || "Not recorded yet.").replace(/\r\n?/g, "\n").split("\n").map(line => `    ${line}`).join("\n")}\n`).join("\n");
}
