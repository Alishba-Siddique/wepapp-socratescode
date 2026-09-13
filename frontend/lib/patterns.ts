export type Pattern = {
  id: string;
  title: string;
  group: string;
  cue: string;
  question: string;
  guidance: string;
  caution: string;
  practice: { title: string; url: string }[];
};
export const patterns: Pattern[] = [
  {
    id: "two-pointers",
    title: "Two pointers",
    group: "Sequences",
    cue: "Compare candidates from opposite ends of a sorted sequence.",
    question:
      "Which pairs become impossible when the current sum is too small?",
    guidance:
      "With the left value fixed, every value before the right pointer is no larger than the current right value. If their sum is already too small, moving right inward cannot help. Which pointer removes only impossible pairs?",
    caution:
      "Sorting is an assumption, not a detail. Unsorted input needs a different argument.",
    practice: [
      {
        title: "Two Sum II - Input Array Is Sorted",
        url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
      },
      {
        title: "Remove Duplicates from Sorted Array",
        url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
      },
    ],
  },
  {
    id: "sliding-window",
    title: "Sliding window",
    group: "Sequences",
    cue: "Reuse state while a contiguous range grows or shrinks.",
    question:
      "When a fixed-size window moves one step, which two values change its sum?",
    guidance:
      "One value leaves and another enters. Trace a window over [-5, -2, -7]: what should the initial best sum be if every candidate is negative?",
    caution:
      "A variable window needs a condition that supports safe shrinking; negative values can break simple sum-based reasoning.",
    practice: [
      {
        title: "Maximum Average Subarray I",
        url: "https://leetcode.com/problems/maximum-average-subarray-i/",
      },
      {
        title: "Minimum Size Subarray Sum",
        url: "https://leetcode.com/problems/minimum-size-subarray-sum/",
      },
    ],
  },
  {
    id: "fast-slow-pointers",
    title: "Fast and slow pointers",
    group: "Sequences",
    cue: "Compare two speeds through a linked sequence.",
    question: "Inside a cycle, how does the gap change on each move?",
    guidance:
      "The faster pointer gains one step per turn. Think of the gap modulo the cycle length: can it keep changing without reaching zero?",
    caution:
      "Check both the fast pointer and its next node before advancing twice.",
    practice: [
      {
        title: "Linked List Cycle",
        url: "https://leetcode.com/problems/linked-list-cycle/",
      },
      {
        title: "Middle of the Linked List",
        url: "https://leetcode.com/problems/middle-of-the-linked-list/",
      },
    ],
  },
  {
    id: "cyclic-sort",
    title: "Cyclic sort",
    group: "Sequences",
    cue: "Place bounded integer values into their matching indices.",
    question: "What must be true before using a value as an array index?",
    guidance:
      "First verify its range. Then compare the destination value with the current value. What happens if equal duplicates keep swapping forever?",
    caution:
      "The valid range and duplicate policy determine the index mapping.",
    practice: [
      {
        title: "Missing Number",
        url: "https://leetcode.com/problems/missing-number/",
      },
      {
        title: "Find All Numbers Disappeared in an Array",
        url: "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/",
      },
    ],
  },
  {
    id: "bitwise-xor",
    title: "Bitwise XOR",
    group: "Sequences",
    cue: "Use cancellation when values appear in pairs.",
    question: "What remains after each repeated value cancels with itself?",
    guidance:
      "XOR is associative and a value XOR itself is zero. Try regrouping [9, 4, 9] without changing the result.",
    caution:
      "The simple accumulator assumes exactly one unpaired value and every other value appears twice.",
    practice: [
      {
        title: "Single Number",
        url: "https://leetcode.com/problems/single-number/",
      },
      {
        title: "Number Complement",
        url: "https://leetcode.com/problems/number-complement/",
      },
    ],
  },
  {
    id: "binary-search",
    title: "Modified binary search",
    group: "Sequences",
    cue: "Discard a provably irrelevant part of an ordered search space.",
    question: "What evidence lets you discard an entire half?",
    guidance:
      "State an invariant describing where the answer could still be. Then verify that each update preserves it and makes the remaining interval smaller.",
    caution:
      "Rotated search with duplicates can lose the ordering evidence needed for logarithmic time.",
    practice: [
      {
        title: "Binary Search",
        url: "https://leetcode.com/problems/binary-search/",
      },
      {
        title: "Find Smallest Letter Greater Than Target",
        url: "https://leetcode.com/problems/find-smallest-letter-greater-than-target/",
      },
    ],
  },
  {
    id: "breadth-first-search",
    title: "Tree breadth-first search",
    group: "Trees & graphs",
    cue: "Explore one tree layer before the next.",
    question: "Why capture the queue length before processing a level?",
    guidance:
      "Children join the same queue as you visit parents. A fixed count separates the current level from the next one. What goes wrong if you keep processing until the queue is empty?",
    caution:
      "General graphs also need a visited set to avoid revisiting cycles.",
    practice: [
      {
        title: "Minimum Depth of Binary Tree",
        url: "https://leetcode.com/problems/minimum-depth-of-binary-tree/",
      },
      {
        title: "Binary Tree Level Order Traversal",
        url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
      },
    ],
  },
  {
    id: "depth-first-search",
    title: "Tree depth-first search",
    group: "Trees & graphs",
    cue: "Carry state down a path, then return to explore another.",
    question: "When does a root-to-leaf path actually end?",
    guidance:
      "Reaching the target sum at an internal node does not finish a root-to-leaf path. Check the children before deciding a path qualifies.",
    caution:
      "An unbalanced tree can use linear stack space; an explicit stack may be safer for deep inputs.",
    practice: [
      {
        title: "Path Sum",
        url: "https://leetcode.com/problems/path-sum/",
      },
      {
        title: "Maximum Depth of Binary Tree",
        url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
      },
    ],
  },
  {
    id: "merge-intervals",
    title: "Merge intervals",
    group: "Sequences",
    cue: "Order ranges so overlap can be handled locally.",
    question:
      "After sorting by start, which existing range could overlap the next one?",
    guidance:
      "Compare with the most recently merged range. Its end represents everything merged so far. Should a new nested interval ever move that end backward?",
    caution:
      "Handle an empty list first. Decide whether touching endpoints count as overlap.",
    practice: [
      {
        title: "Merge Intervals",
        url: "https://leetcode.com/problems/merge-intervals/",
      },
      {
        title: "Insert Interval",
        url: "https://leetcode.com/problems/insert-interval/",
      },
    ],
  },
  {
    id: "linked-list-reversal",
    title: "Linked-list reversal",
    group: "Sequences",
    cue: "Redirect links while preserving access to the unvisited suffix.",
    question: "Which reference would you lose by overwriting next immediately?",
    guidance:
      "Save the next node before changing the link. Track the reversed prefix and untouched suffix after each step. What must connect them when reversing only a subrange?",
    caution:
      "Reason about empty and single-node lists before reversing a longer one.",
    practice: [
      {
        title: "Reverse Linked List",
        url: "https://leetcode.com/problems/reverse-linked-list/",
      },
      {
        title: "Swap Nodes in Pairs",
        url: "https://leetcode.com/problems/swap-nodes-in-pairs/",
      },
    ],
  },
  {
    id: "top-k",
    title: "Top K elements",
    group: "Heaps",
    cue: "Keep only the strongest candidates in a bounded heap.",
    question:
      "For the largest K values, which candidate should be easiest to remove?",
    guidance:
      "The smallest retained value is the first to discard when a better candidate arrives. Which heap orientation exposes it at the root?",
    caution:
      "Validate K. This method retains K candidates; it does not sort the whole input.",
    practice: [
      {
        title: "Kth Largest Element in a Stream",
        url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
      },
      {
        title: "Kth Largest Element in an Array",
        url: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
      },
    ],
  },
  {
    id: "subsets",
    title: "Subsets",
    group: "Search & DP",
    cue: "Explore the choice to include or exclude each item.",
    question:
      "How many existing subsets gain a companion when one new item arrives?",
    guidance:
      "Each old subset creates one new subset containing the new item. Draw the decisions for two distinct items before generalizing.",
    caution:
      "Duplicate input values need a deduplication rule. Output size itself grows exponentially.",
    practice: [
      {
        title: "Subsets",
        url: "https://leetcode.com/problems/subsets/",
      },
      {
        title: "Subsets II",
        url: "https://leetcode.com/problems/subsets-ii/",
      },
    ],
  },
  {
    id: "topological-sort",
    title: "Topological sort",
    group: "Trees & graphs",
    cue: "Order tasks while respecting directed prerequisites.",
    question: "What does zero remaining in-degree tell you about a task?",
    guidance:
      "All its prerequisites have been processed. Remove its outgoing dependencies and look for newly ready tasks. What does it mean if unfinished tasks remain but none is ready?",
    caution:
      "A full ordering exists only when the directed dependency graph has no cycle.",
    practice: [
      {
        title: "Course Schedule",
        url: "https://leetcode.com/problems/course-schedule/",
      },
      {
        title: "Course Schedule II",
        url: "https://leetcode.com/problems/course-schedule-ii/",
      },
    ],
  },
  {
    id: "k-way-merge",
    title: "K-way merge",
    group: "Heaps",
    cue: "Combine sorted streams using their current front values.",
    question: "Why can the next global minimum only be at a stream's front?",
    guidance:
      "Every later value in a sorted stream is at least its front value. After consuming the smallest front, which stream alone needs a replacement candidate?",
    caution:
      "Skip empty streams and use a tie-breaker when heap entries contain non-comparable objects.",
    practice: [
      {
        title: "Kth Smallest Element in a Sorted Matrix",
        url: "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/",
      },
      {
        title: "Find K Pairs with Smallest Sums",
        url: "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/",
      },
    ],
  },
  {
    id: "backtracking",
    title: "Backtracking",
    group: "Search & DP",
    cue: "Build a candidate, reject invalid branches, and undo choices.",
    question: "Which partial choice is already impossible to complete?",
    guidance:
      "For balanced parentheses, compare closing and opening counts at every prefix. Can a prefix with more closing brackets ever be repaired by adding characters later?",
    caution:
      "Restore mutable state when leaving a branch. Count output storage separately from the search stack.",
    practice: [
      {
        title: "Generate Parentheses",
        url: "https://leetcode.com/problems/generate-parentheses/",
      },
      {
        title: "Combination Sum",
        url: "https://leetcode.com/problems/combination-sum/",
      },
    ],
  },
  {
    id: "two-heaps",
    title: "Two heaps",
    group: "Heaps",
    cue: "Maintain the boundary between a lower and an upper half.",
    question: "Which two invariants make the middle values accessible?",
    guidance:
      "Every lower-half value must be no greater than every upper-half value, and their sizes must stay balanced. Which roots determine the median for an even count?",
    caution:
      "Define empty-stream behavior. Sliding-window deletion requires additional bookkeeping.",
    practice: [
      {
        title: "Find Median from Data Stream",
        url: "https://leetcode.com/problems/find-median-from-data-stream/",
      },
      {
        title: "Sliding Window Median",
        url: "https://leetcode.com/problems/sliding-window-median/",
      },
    ],
  },
  {
    id: "knapsack",
    title: "0/1 knapsack",
    group: "Search & DP",
    cue: "Compare taking or skipping an item under a capacity limit.",
    question: "Why must a one-dimensional capacity loop run backward?",
    guidance:
      "A backward update reads states from before the current item was used. Try a forward update with one item: could the same item contribute more than once?",
    caution:
      "Each item is usable once. Coin Change is an unbounded variant and needs a different transition.",
    practice: [
      {
        title: "Partition Equal Subset Sum",
        url: "https://leetcode.com/problems/partition-equal-subset-sum/",
      },
      {
        title: "Target Sum",
        url: "https://leetcode.com/problems/target-sum/",
      },
    ],
  },
];
