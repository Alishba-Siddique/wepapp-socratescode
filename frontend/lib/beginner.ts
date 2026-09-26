export type BeginnerQuestion = { prompt: string; options: string[]; correct: number; feedback: string[] };
export type BeginnerLesson = {
  title: string; idea: string; vocabulary: string; code: string;
  prediction: BeginnerQuestion;
  frames: { line: number; state: string; why: string }[];
  transfer: BeginnerQuestion;
};
export const beginnerLessons: BeginnerLesson[] = [
  {
    title: "A name for a value",
    idea: "A shopping app remembers how many items are in your basket. A variable gives a value a name so the program can use it later.",
    vocabulary: "Read Python from top to bottom. The = sign assigns the value on its right to the name on its left. It does not mean that both sides must already be equal. print displays a value.",
    code: "items = 2\nitems = items + 1\nprint(items)",
    prediction: { prompt: "What will this program display?", options: ["2", "3", "1"], correct: 1, feedback: ["That was the starting value. What does the second line change?", "Yes. Read the old value, add one, then store the new value.", "One is the amount added. What value was already stored?"] },
    frames: [
      { line: 0, state: "items = 2", why: "The name items now refers to the number 2." },
      { line: 1, state: "items = 3", why: "First calculate 2 + 1. Then replace the value associated with items." },
      { line: 2, state: "display: 3", why: "print displays the current value. It does not change items." },
    ],
    transfer: { prompt: "Now start with items = 5 and replace the second line with items = 1. What is displayed?", options: ["6", "5", "1"], correct: 2, feedback: ["Look for a plus sign. Does the new line add anything?", "The second assignment replaces the starting value. Read that line again.", "Exactly. Assignment replaces a value; adding requires an explicit calculation."] },
  },
  {
    title: "One small step, repeated",
    idea: "A program can process several values by repeating an instruction. A loop visits each item in a list, one at a time, in order.",
    vocabulary: "[2, 3] is a list containing two numbers. for step in steps gives the name step to each number in turn. The indented line belongs to the loop. The final print is outside it.",
    code: "steps = [2, 3]\nposition = 0\nfor step in steps:\n    position = position + step\nprint(position)",
    prediction: { prompt: "Where does position finish after both steps?", options: ["3", "5", "2"], correct: 1, feedback: ["That is the last step. Does the update keep the position reached before it?", "Yes. Start at zero, move two, then move three more.", "That is the position after the first step. There is one more item in the list."] },
    frames: [
      { line: 0, state: "steps = [2, 3]", why: "Remember the two moves in their original order." },
      { line: 1, state: "position = 0", why: "Before any move, the position is zero." },
      { line: 3, state: "step = 2; position = 2", why: "First visit: 0 + 2 becomes the new position." },
      { line: 3, state: "step = 3; position = 5", why: "Second visit: keep the earlier position and add 3." },
      { line: 4, state: "display: 5", why: "The list has no more items. Leave the loop and display the position." },
    ],
    transfer: { prompt: "Replace the list with [4, -1]. A negative step moves backward. What position is displayed?", options: ["-1", "3", "5"], correct: 1, feedback: ["Keep the position after the first move, then apply the backward step.", "Yes. The same update works: zero to four, then back one to three.", "Adding -1 decreases the position. Which direction does that step represent?"] },
  },
  {
    title: "Find where the thinking changes",
    idea: "Debugging means finding where a program behaves differently from what you intended. Trace a small input and compare the state after each line.",
    vocabulary: "def introduces a function: a named group of instructions. data is the input given to it. return sends the answer back to its caller. A function must return the answer expected by the problem; print only displays it.",
    code: "def solve(data):\n    position = 0\n    for step in data:\n        position = step\n    return position",
    prediction: { prompt: "This function should combine moves. For data = [2, 3], what does this buggy version actually return?", options: ["5", "0", "3"], correct: 2, feedback: ["That is the intended answer. Does the indented update actually add the old position?", "Zero is the starting value, but the loop assigns two new values.", "Correct. Each assignment replaces the previous position, so only the last move remains."] },
    frames: [
      { line: 1, state: "position = 0", why: "The function starts with no movement." },
      { line: 3, state: "step = 2; position = 2", why: "The first assignment looks right because there was no earlier movement." },
      { line: 3, state: "step = 3; position = 3", why: "Here the earlier movement is lost. The old position is not used." },
      { line: 4, state: "returned: 3; intended: 5", why: "The first mismatch points to the update, not the return line." },
    ],
    transfer: { prompt: "Which change would preserve the movement already made, including when a step is negative?", options: ["Keep the old position and add the current step", "Add one each time", "Always return the last step"], correct: 0, feedback: ["Yes. Describe that update in Python yourself in the next challenge.", "That counts moves. Would one move of seven have the same distance as one move of two?", "That still discards every earlier move. Which information must survive each visit?"] },
  },
];

export type BeginnerProgress = { version: 1; completed: number; practicePassed: boolean };
export const emptyBeginner: BeginnerProgress = { version: 1, completed: 0, practicePassed: false };
export function parseBeginner(raw: string | null): BeginnerProgress {
  if (!raw || raw.length > 512) return { ...emptyBeginner };
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return { ...emptyBeginner };
    const row = value as Record<string, unknown>;
    if (row.version !== 1 || !Number.isInteger(row.completed) || Number(row.completed) < 0 || Number(row.completed) > beginnerLessons.length || typeof row.practicePassed !== "boolean") return { ...emptyBeginner };
    return { version: 1, completed: Number(row.completed), practicePassed: row.completed === beginnerLessons.length && row.practicePassed };
  } catch { return { ...emptyBeginner }; }
}
export function completeBeginnerLesson(state: BeginnerProgress, index: number): BeginnerProgress {
  if (!Number.isInteger(index) || index < 0 || index >= beginnerLessons.length || index > state.completed) return state;
  return { ...state, completed: Math.max(state.completed, index + 1) };
}
