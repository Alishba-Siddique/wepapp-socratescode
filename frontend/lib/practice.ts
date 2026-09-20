import { patterns } from "./patterns.ts";
export type PracticeProblem = { id: string; title: string; topic: string; source: "LeetCode" | "CSES"; url: string; question: string; focus: string; reviewed: string };
const cses: [number, string, string, string, string][] = [
  [1083, "Missing Number", "Arithmetic & invariants", "What remains when a complete collection is compared with an incomplete one?", "Prove the range and uniqueness assumptions before choosing arithmetic or XOR."],
  [1069, "Repetitions", "Sequences", "Which event ends a run of equal characters?", "Track the current run separately from the best run, including the final one."],
  [1094, "Increasing Array", "Greedy reasoning", "Can a decision about this element change a value already fixed to its left?", "Distinguish the required height from the total adjustment cost."],
  [1621, "Distinct Numbers", "Sets & hashing", "What information can be discarded once a value has been seen?", "Compare sorting and a set, including their memory costs."],
  [1084, "Apartments", "Two pointers", "When a candidate is too small, could it satisfy any later request?", "State the safe-discard argument after sorting both collections."],
  [1090, "Ferris Wheel", "Two pointers", "If the heaviest remaining item cannot pair with the lightest, who could it pair with?", "Explain why the extreme pair controls the next decision."],
  [1640, "Sum of Two Values", "Sets & hashing", "Which earlier value would complete the current candidate?", "Keep original positions and ensure an element is not reused."],
  [1643, "Maximum Subarray Sum", "Dynamic programming", "When does carrying an earlier partial sum make the next candidate worse?", "Handle a sequence whose every value is negative."],
  [1141, "Playlist", "Sliding window", "How far must the left boundary move after a repeated value?", "A boundary must never move backward after an old occurrence."],
  [1620, "Factory Machines", "Binary search", "If a deadline is sufficient, what can you say about a later deadline?", "Search a monotone feasibility condition and protect arithmetic bounds."],
  [1645, "Nearest Smaller Values", "Monotonic stack", "Which earlier candidates become permanently useless after this value arrives?", "Check equal values and what an empty stack means."],
  [1661, "Subarray Sums II", "Prefix sums", "Which two accumulated totals describe a contiguous interval?", "Count repeated prefix totals; a set would lose multiplicity."],
  [1634, "Minimizing Coins", "Dynamic programming", "What smaller target remains after selecting the last coin?", "Represent unreachable states explicitly and justify reuse."],
  [1639, "Edit Distance", "Dynamic programming", "What do the two coordinates of a subproblem mean?", "Define the empty-prefix boundaries before transitions."],
  [1145, "Increasing Subsequence", "Binary search", "Why might a smaller ending value leave more possibilities for the future?", "Separate a compact search structure from the actual subsequence."],
  [1192, "Counting Rooms", "Graph traversal", "What proves that a newly reached cell belongs to a region already counted?", "Make visited-state timing and grid bounds explicit."],
  [1667, "Message Route", "Breadth-first search", "Why does the first visit give the shortest number of edges here?", "Store predecessors if you need a route, not just its length."],
  [1679, "Course Schedule", "Topological order", "Which dependency count proves that a task can be chosen now?", "Account for cycles and disconnected components."],
  [1675, "Road Reparation", "Spanning trees", "How can a new connection be tested for creating a cycle?", "A minimum connection plan must also reach every component."],
  [1646, "Static Range Sum Queries", "Prefix sums", "Which accumulated part appears twice and must be removed?", "Write the interval convention down before subtracting prefix totals."],
];
const references: PracticeProblem[] = patterns.flatMap(pattern => pattern.practice.map(item => ({
  id: `leetcode-${item.url.split("/").filter(Boolean).at(-1)}`,
  title: item.title, topic: pattern.title, source: "LeetCode" as const, url: item.url,
  question: pattern.question, focus: pattern.caution, reviewed: "2026-09-14",
})));
export const practiceProblems: PracticeProblem[] = [...new Map(references.map(item => [item.id, item])).values(), ...cses.map(([id,title,topic,question,focus]) => ({ id: `cses-${id}`, title, topic, question, focus, source: "CSES" as const, url: `https://cses.fi/problemset/task/${id}`, reviewed: "2026-09-14" }))];
export function filterPractice(query: string, source: string, topic: string) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return practiceProblems.filter(p => (source === "All sources" || p.source === source) && (topic === "All topics" || p.topic === topic) && terms.every(term => `${p.title} ${p.topic} ${p.question} ${p.focus}`.toLowerCase().includes(term)));
}
