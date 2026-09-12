export type Mode = "sum" | "product" | "even";
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
  const initial = puzzle.mode === "product" ? 1 : 0;
  return [
    "total = " + initial,
    "for number in range(1, " + (limit + 1) + "):",
    ...(puzzle.mode === "even"
      ? ["    if number % 2 == 0:", "        total += 1"]
      : [
          puzzle.mode === "product"
            ? "    total *= number"
            : "    total += number",
        ]),
    "print(total)",
  ];
}
export function trace(puzzle: Puzzle, limit = puzzle.limit): Frame[] {
  if (!Number.isInteger(limit) || limit < 1 || limit > 6)
    throw new RangeError("The guided exercise supports bounds from 1 to 6.");
  let total = puzzle.mode === "product" ? 1 : 0;
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
    else if (number % 2 === 0) total += 1;
    frames.push({
      number,
      before,
      total,
      line: puzzle.mode === "even" ? (number % 2 === 0 ? 3 : 2) : 2,
      note:
        puzzle.mode === "even" && number % 2 !== 0
          ? "The condition is false; total stays the same."
          : "Update total using this iteration's number.",
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
