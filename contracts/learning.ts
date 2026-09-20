export type Mode = "sum" | "product" | "even" | "odd-sum" | "squares" | "even-sum" | "subtract" | "double" | "replace";
export type Puzzle = {
  slug: string;
  title: string;
  topic: string;
  summary: string;
  mode: Mode;
  limit: number;
  target: number;
  minutes: number;
  question: string;
  options: string[];
  correct: number;
  hint: string;
};
export const puzzles: Puzzle[] = [
  {
    slug: "a-running-total",
    title: "A running total",
    topic: "Loops & state",
    summary: "Follow a value as a loop builds it, one number at a time.",
    mode: "sum",
    limit: 3,
    target: 15,
    minutes: 8,
    question: "Why does total keep growing instead of starting over?",
    options: [
      "print changes the value",
      "total is initialized before the loop",
      "number always stays the same",
    ],
    correct: 1,
    hint: "Where is total first assigned, and is that line inside the loop?",
  },
  {
    slug: "a-growing-product",
    title: "A growing product",
    topic: "Accumulators",
    summary: "Explore why a product starts at one, and what each pass changes.",
    mode: "product",
    limit: 3,
    target: 120,
    minutes: 10,
    question: "What would happen if total started at zero?",
    options: [
      "The result would stay zero",
      "The result would be unchanged",
      "Only the first number would change",
    ],
    correct: 0,
    hint: "What happens when you multiply any number by zero?",
  },
  {
    slug: "count-the-evens",
    title: "Count the evens",
    topic: "Conditions",
    summary: "See how a condition decides which loop iterations count.",
    mode: "even",
    limit: 3,
    target: 3,
    minutes: 10,
    question: "When does total increase in this loop?",
    options: [
      "On every pass",
      "When number is greater than one",
      "When number is divisible by two",
    ],
    correct: 2,
    hint: "What does a remainder of zero tell you about division by two?",
  },
  { slug: "sum-the-odds", title: "Sum the odd values", topic: "Filtering & accumulation", summary: "Separate testing a value from adding it to a running total.", mode: "odd-sum", limit: 3, target: 9, minutes: 10, question: "Why does the second iteration leave total unchanged?", options: ["The loop stops at one", "Two fails the odd-number condition", "Every second update is delayed"], correct: 1, hint: "Evaluate the remainder for two. Does the condition allow the addition?" },
  { slug: "squares-in-a-loop", title: "Squares in a loop", topic: "Expressions & state", summary: "Distinguish squaring each input from squaring an accumulated result.", mode: "squares", limit: 3, target: 55, minutes: 12, question: "Which expression is added on the third pass?", options: ["The current total squared", "Three plus three", "Three multiplied by three"], correct: 2, hint: "Which variable appears on both sides of the multiplication?" },
  { slug: "sum-not-count", title: "Sum, not count", topic: "Conditions & aggregates", summary: "Compare counting accepted values with adding their magnitudes.", mode: "even-sum", limit: 3, target: 12, minutes: 10, question: "What is added when number equals four?", options: ["Four", "One", "The number of previous matches"], correct: 0, hint: "Read the expression after +=. Is it a constant or the current number?" },
  { slug: "a-falling-total", title: "A falling total", topic: "Signed arithmetic", summary: "Trace an accumulator that moves below zero and keeps decreasing.", mode: "subtract", limit: 3, target: -15, minutes: 9, question: "Why is the output negative?", options: ["range generates negative numbers", "Positive numbers are subtracted from zero", "print changes the sign"], correct: 1, hint: "Starting at zero, which direction does subtracting one move the total?" },
  { slug: "double-each-time", title: "Double each time", topic: "Repeated multiplication", summary: "Notice when a loop variable controls repetitions without entering the arithmetic.", mode: "double", limit: 3, target: 32, minutes: 11, question: "What role does number play in the update?", options: ["It is the multiplier", "It is added to total", "It counts passes; the multiplier stays two"], correct: 2, hint: "Look for number in the update expression. What value actually multiplies total?" },
  { slug: "replace-or-accumulate", title: "Replace or accumulate?", topic: "Assignment", summary: "Investigate why assigning a new value forgets the earlier state.", mode: "replace", limit: 3, target: 5, minutes: 8, question: "Why is the output only the final number?", options: ["Each assignment replaces the previous total", "Only the last loop iteration runs", "The other values are printed invisibly"], correct: 0, hint: "Compare = with +=. Does the previous value of total appear on the right?" },
];
export const stages = [
  "Predict",
  "Run",
  "Investigate",
  "Modify",
  "Make",
] as const;
export type Frame = {
  number: number | null;
  before: number;
  total: number;
  line: number;
  note: string;
};
export function getPuzzle(slug: string): Puzzle | undefined {
  return puzzles.find((p) => p.slug === slug);
}
export function source(puzzle: Puzzle, limit = puzzle.limit): string[] {
  const initial = puzzle.mode === "product" || puzzle.mode === "double" ? 1 : 0;
  const updates: Record<Mode, string[]> = {
    sum: ["    total += number"], product: ["    total *= number"],
    even: ["    if number % 2 == 0:", "        total += 1"],
    "odd-sum": ["    if number % 2 != 0:", "        total += number"],
    squares: ["    total += number * number"],
    "even-sum": ["    if number % 2 == 0:", "        total += number"],
    subtract: ["    total -= number"], double: ["    total *= 2"], replace: ["    total = number"],
  };
  return [
    "total = " + initial,
    "for number in range(1, " + (limit + 1) + "):",
    ...updates[puzzle.mode],
    "print(total)",
  ];
}
export function trace(puzzle: Puzzle, limit = puzzle.limit): Frame[] {
  if (!Number.isInteger(limit) || limit < 1 || limit > 6)
    throw new RangeError("The guided exercise supports bounds from 1 to 6.");
  let total = puzzle.mode === "product" || puzzle.mode === "double" ? 1 : 0;
  const frames: Frame[] = [
    {
      number: null,
      before: total,
      total,
      line: 0,
      note: "Initialize total before the loop.",
    },
  ];
  for (let number = 1; number <= limit; number++) {
    const before = total;
    if (puzzle.mode === "sum") total += number;
    else if (puzzle.mode === "product") total *= number;
    else if (puzzle.mode === "even" && number % 2 === 0) total += 1;
    else if (puzzle.mode === "odd-sum" && number % 2 !== 0) total += number;
    else if (puzzle.mode === "even-sum" && number % 2 === 0) total += number;
    else if (puzzle.mode === "squares") total += number * number;
    else if (puzzle.mode === "subtract") total -= number;
    else if (puzzle.mode === "double") total *= 2;
    else if (puzzle.mode === "replace") total = number;
    const conditional = ["even", "odd-sum", "even-sum"].includes(puzzle.mode);
    const accepted = puzzle.mode === "odd-sum" ? number % 2 !== 0 : number % 2 === 0;
    frames.push({
      number,
      before,
      total,
      line: conditional ? (accepted ? 3 : 2) : 2,
      note:
        conditional && !accepted
          ? "The condition is false; total stays the same."
          : puzzle.mode === "double" ? "Multiply the previous total by two." : "Update total using this iteration's number.",
    });
  }
  frames.push({
    number: null,
    before: total,
    total,
    line: source(puzzle, limit).length - 1,
    note: "The loop ends. Print the final total.",
  });
  return frames;
}
export function answer(puzzle: Puzzle, limit = puzzle.limit): number {
  return trace(puzzle, limit).at(-1)!.total;
}
export function integer(value: string): number | null {
  return /^-?\d+$/.test(value.trim()) && Number.isSafeInteger(Number(value))
    ? Number(value)
    : null;
}
