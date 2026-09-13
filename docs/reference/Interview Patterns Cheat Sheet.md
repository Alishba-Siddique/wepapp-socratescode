# Coding Interview — Common LeetCode Patterns Cheat Sheet

> All 17 core coding interview patterns. Sorted by **commonality × difficulty** — most frequent and easiest patterns first, rarest and hardest at the bottom. For each: how to spot it, the core idea, a clean code example, and LeetCode practice problems.

---

## 1. Two Pointers

**Frequency: ★★★★★ | Difficulty: Easy**

### How to Spot It
- Sorted array or linked list
- "Find a pair/triplet that satisfies a condition"
- "Remove duplicates in-place"
- "Is this a palindrome?"
- Keywords: **pair, triplet, sorted, in-place, compare from both ends**

### The Pattern
Use two pointers (often one at the start and one at the end) that move toward each other, or one slow and one fast, to avoid nested loops and achieve O(n) time.

### Core Example — Pair with Target Sum (sorted array)

```python
def pair_with_target_sum(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            return [left, right]
        if current_sum < target:
            left += 1
        else:
            right -= 1
    return [-1, -1]

# arr = [1, 2, 3, 4, 6], target = 6 → [1, 3]
```

> **Time: O(n)** — each pointer moves at most n steps.
> **Space: O(1)** — only two pointer variables.

### LeetCode Practice
| Problem | Difficulty | Link |
|---------|-----------|------|
| Two Sum II - Input Array Is Sorted | Easy | [LC 167](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) |
| Remove Duplicates from Sorted Array | Easy | [LC 26](https://leetcode.com/problems/remove-duplicates-from-sorted-array/) |
| Valid Palindrome | Easy | [LC 125](https://leetcode.com/problems/valid-palindrome/) |
| 3Sum | Medium | [LC 15](https://leetcode.com/problems/3sum/) |
| Container With Most Water | Medium | [LC 11](https://leetcode.com/problems/container-with-most-water/) |
| Trapping Rain Water | Hard | [LC 42](https://leetcode.com/problems/trapping-rain-water/) |

---

## 2. Sliding Window

**Frequency: ★★★★★ | Difficulty: Easy–Medium**

### How to Spot It
- Contiguous subarray or substring
- "Maximum/minimum sum of size k"
- "Longest/shortest substring with condition"
- "At most k distinct characters"
- Keywords: **contiguous, subarray, substring, window, consecutive**

### The Pattern
Maintain a window defined by two pointers. Expand the window by advancing the right pointer; shrink it by advancing the left. Track the window state (sum, character counts, etc.) incrementally instead of recomputing from scratch.

### Core Example — Maximum Sum Subarray of Size K

```python
def max_sum_subarray(arr, k):
    window_sum, max_sum = 0, 0
    window_start = 0

    for window_end in range(len(arr)):
        window_sum += arr[window_end]

        if window_end >= k - 1:
            max_sum = max(max_sum, window_sum)
            window_sum -= arr[window_start]
            window_start += 1

    return max_sum

# arr = [2, 1, 5, 1, 3, 2], k = 3 → 9 (subarray [5, 1, 3])
```

> **Time: O(n)** — single pass through the array.
> **Space: O(1)** — only tracking sum and pointers.

### LeetCode Practice
| Problem | Difficulty | Link |
|---------|-----------|------|
| Maximum Average Subarray I | Easy | [LC 643](https://leetcode.com/problems/maximum-average-subarray-i/) |
| Minimum Size Subarray Sum | Medium | [LC 209](https://leetcode.com/problems/minimum-size-subarray-sum/) |
| Longest Substring Without Repeating Characters | Medium | [LC 3](https://leetcode.com/problems/longest-substring-without-repeating-characters/) |
| Longest Substring with At Most K Distinct Characters | Medium | [LC 340](https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/) |
| Permutation in String | Medium | [LC 567](https://leetcode.com/problems/permutation-in-string/) |
| Minimum Window Substring | Hard | [LC 76](https://leetcode.com/problems/minimum-window-substring/) |

---

## 3. Fast & Slow Pointers (Floyd's Cycle Detection)

**Frequency: ★★★★☆ | Difficulty: Easy–Medium**

### How to Spot It
- "Does this linked list have a cycle?"
- "Find the middle of a linked list"
- "Is this number happy?"
- Anything involving **cycle detection** in a sequence or linked list
- Keywords: **cycle, circular, middle, loop**

### The Pattern
Use two pointers: `slow` moves 1 step at a time, `fast` moves 2 steps. If there's a cycle, they'll meet. If `fast` reaches the end, there's no cycle. The meeting point also helps find the cycle start.

### Core Example — Linked List Cycle Detection

```python
def has_cycle(head):
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False
```

> **Time: O(n)** — fast pointer traverses the list at most once (or meets slow within one cycle).
> **Space: O(1)** — only two pointer variables.

### LeetCode Practice
| Problem | Difficulty | Link |
|---------|-----------|------|
| Linked List Cycle | Easy | [LC 141](https://leetcode.com/problems/linked-list-cycle/) |
| Middle of the Linked List | Easy | [LC 876](https://leetcode.com/problems/middle-of-the-linked-list/) |
| Happy Number | Easy | [LC 202](https://leetcode.com/problems/happy-number/) |
| Linked List Cycle II | Medium | [LC 142](https://leetcode.com/problems/linked-list-cycle-ii/) |
| Palindrome Linked List | Medium | [LC 234](https://leetcode.com/problems/palindrome-linked-list/) |
| Find the Duplicate Number | Medium | [LC 287](https://leetcode.com/problems/find-the-duplicate-number/) |

---

## 4. Cyclic Sort

**Frequency: ★★★★☆ | Difficulty: Easy–Medium**

### How to Spot It
- Array contains numbers in range `[0, n]` or `[1, n]`
- "Find the missing number"
- "Find all duplicates"
- "Find the first missing positive"
- Keywords: **missing number, duplicate, range 1 to n, in-place, no extra space**

### The Pattern
Since numbers are in a known range, each number `x` should be at index `x` (or `x-1`). Iterate through the array: if the current number isn't at its correct index, swap it there. After one pass, any index where `arr[i] != i` reveals a missing or duplicate number.

### Core Example — Find the Missing Number

```python
def find_missing_number(nums):
    n = len(nums)
    i = 0
    while i < n:
        correct_idx = nums[i]
        if nums[i] < n and nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1

    for i in range(n):
        if nums[i] != i:
            return i
    return n

# [4, 0, 3, 1] → missing = 2
```

> **Time: O(n)** — each number is swapped at most once, plus one final scan.
> **Space: O(1)** — sorting is done in-place.

### LeetCode Practice
| Problem | Difficulty | Link |
|---------|-----------|------|
| Missing Number | Easy | [LC 268](https://leetcode.com/problems/missing-number/) |
| Find All Numbers Disappeared in an Array | Easy | [LC 448](https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/) |
| Set Mismatch | Easy | [LC 645](https://leetcode.com/problems/set-mismatch/) |
| Find All Duplicates in an Array | Medium | [LC 442](https://leetcode.com/problems/find-all-duplicates-in-an-array/) |
| First Missing Positive | Hard | [LC 41](https://leetcode.com/problems/first-missing-positive/) |

---

## 5. Bitwise XOR

**Frequency: ★★★☆☆ | Difficulty: Easy–Medium**

### How to Spot It
- "Find the single number" (all others appear twice)
- "Find two non-repeating numbers"
- "Complement of a number"
- Constraint: O(1) extra space, numbers appear in pairs
- Keywords: **single number, XOR, bit manipulation, appears once, no extra memory**

### The Pattern
Key XOR properties: `a ^ a = 0`, `a ^ 0 = a`, XOR is commutative and associative. XOR-ing all elements cancels out duplicates, leaving the unique element(s).

### Core Example — Single Number

```python
def single_number(nums):
    result = 0
    for num in nums:
        result ^= num
    return result

# [1, 4, 2, 1, 3, 2, 3] → 4
```

> **Time: O(n)** — single pass XOR-ing all elements.
> **Space: O(1)** — one accumulator variable.

### LeetCode Practice
| Problem | Difficulty | Link |
|---------|-----------|------|
| Single Number | Easy | [LC 136](https://leetcode.com/problems/single-number/) |
| Number Complement | Easy | [LC 476](https://leetcode.com/problems/number-complement/) |
| Flipping an Image | Easy | [LC 832](https://leetcode.com/problems/flipping-an-image/) |
| Single Number II | Medium | [LC 137](https://leetcode.com/problems/single-number-ii/) |
| Single Number III | Medium | [LC 260](https://leetcode.com/problems/single-number-iii/) |

---

## 6. Modified Binary Search

**Frequency: ★★★★☆ | Difficulty: Medium**

### How to Spot It
- Sorted or rotated sorted array
- "Find position / boundary"
- "Search in infinite list"
- O(log n) time requirement
- Keywords: **sorted, search, rotated, find position, binary**

### The Pattern
Classic binary search, but adapted: the key is identifying which "half" to discard. In rotated arrays, check which half is sorted. For boundary problems, don't return immediately — tighten the bound and keep going.

### Core Example — Search in Rotated Sorted Array

```python
def search(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid

        # Left half is sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1

    return -1
```

> **Time: O(log n)** — halves the search space each iteration.
> **Space: O(1)** — only pointer variables.

### LeetCode Practice
| Problem | Difficulty | Link |
|---------|-----------|------|
| Binary Search | Easy | [LC 704](https://leetcode.com/problems/binary-search/) |
| Find Smallest Letter Greater Than Target | Easy | [LC 744](https://leetcode.com/problems/find-smallest-letter-greater-than-target/) |
| Search in Rotated Sorted Array | Medium | [LC 33](https://leetcode.com/problems/search-in-rotated-sorted-array/) |
| Find Minimum in Rotated Sorted Array | Medium | [LC 153](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) |
| Search a 2D Matrix | Medium | [LC 74](https://leetcode.com/problems/search-a-2d-matrix/) |
| Median of Two Sorted Arrays | Hard | [LC 4](https://leetcode.com/problems/median-of-two-sorted-arrays/) |

---

## 7. BFS — Tree Breadth-First Search

**Frequency: ★★★★☆ | Difficulty: Medium**

### How to Spot It
- "Level order traversal"
- "Minimum depth"
- "Connect nodes at the same level"
- Any tree problem asking you to process **level by level**
- Keywords: **level, breadth, layer, left-to-right, zigzag**

### The Pattern
Use a queue. Process all nodes at the current level before moving to the next. For each level, record the queue size, then pop that many nodes, processing them and adding their children.

### Core Example — Level Order Traversal

```python
from collections import deque

def level_order(root):
    if not root:
        return []
    result = []
    queue = deque([root])

    while queue:
        level_size = len(queue)
        current_level = []
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(current_level)

    return result
```

> **Time: O(n)** — every node is visited exactly once.
> **Space: O(n)** — the queue can hold up to n/2 nodes (widest level).

### LeetCode Practice
| Problem | Difficulty | Link |
|---------|-----------|------|
| Minimum Depth of Binary Tree | Easy | [LC 111](https://leetcode.com/problems/minimum-depth-of-binary-tree/) |
| Binary Tree Level Order Traversal | Medium | [LC 102](https://leetcode.com/problems/binary-tree-level-order-traversal/) |
| Binary Tree Level Order Traversal II | Medium | [LC 107](https://leetcode.com/problems/binary-tree-level-order-traversal-ii/) |
| Binary Tree Zigzag Level Order Traversal | Medium | [LC 103](https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/) |
| Binary Tree Right Side View | Medium | [LC 199](https://leetcode.com/problems/binary-tree-right-side-view/) |

---

## 8. DFS — Tree Depth-First Search

**Frequency: ★★★★☆ | Difficulty: Medium**

### How to Spot It
- "Path sum from root to leaf"
- "All paths matching a condition"
- "Max depth / diameter"
- Traversal: preorder, inorder, postorder
- Keywords: **path, root-to-leaf, depth, sum along path, all paths**

### The Pattern
Recurse (or use a stack). At each node, make a decision, recurse on children, and either return a value or accumulate results. For path problems, pass the running state down and backtrack when returning.

### Core Example — Path Sum (root-to-leaf)

```python
def has_path_sum(root, target_sum):
    if not root:
        return False

    # Leaf node check
    if not root.left and not root.right:
        return root.val == target_sum

    # Recurse with reduced target
    return (has_path_sum(root.left, target_sum - root.val) or
            has_path_sum(root.right, target_sum - root.val))
```

> **Time: O(n)** — visits every node once in the worst case.
> **Space: O(h)** — recursion stack depth equals tree height h (O(log n) balanced, O(n) skewed).

### LeetCode Practice
| Problem | Difficulty | Link |
|---------|-----------|------|
| Path Sum | Easy | [LC 112](https://leetcode.com/problems/path-sum/) |
| Maximum Depth of Binary Tree | Easy | [LC 104](https://leetcode.com/problems/maximum-depth-of-binary-tree/) |
| Diameter of Binary Tree | Easy | [LC 543](https://leetcode.com/problems/diameter-of-binary-tree/) |
| Path Sum II | Medium | [LC 113](https://leetcode.com/problems/path-sum-ii/) |
| Sum Root to Leaf Numbers | Medium | [LC 129](https://leetcode.com/problems/sum-root-to-leaf-numbers/) |
| Binary Tree Maximum Path Sum | Hard | [LC 124](https://leetcode.com/problems/binary-tree-maximum-path-sum/) |

---

## 9. Merge Intervals

**Frequency: ★★★★☆ | Difficulty: Medium**

### How to Spot It
- "Merge overlapping intervals"
- "Insert a new interval"
- "Find free time / gaps between intervals"
- Input is a list of intervals `[start, end]`
- Keywords: **intervals, overlapping, merge, schedule, time range, conflicts**

### The Pattern
Sort intervals by start time, then iterate. For each interval, either merge it with the previous one (if they overlap) or start a new merged interval. Two intervals overlap when `a.start <= b.end` (after sorting).

### Core Example — Merge Overlapping Intervals

```python
def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]

    for i in range(1, len(intervals)):
        if intervals[i][0] <= merged[-1][1]:  # overlapping
            merged[-1][1] = max(merged[-1][1], intervals[i][1])
        else:
            merged.append(intervals[i])

    return merged

# [[1,4],[2,5],[7,9]] → [[1,5],[7,9]]
```

> **Time: O(n log n)** — dominated by the sort; the merge pass is O(n).
> **Space: O(n)** — for the merged output list (O(log n) if counting only sort space).

### LeetCode Practice
| Problem | Difficulty | Link |
|---------|-----------|------|
| Merge Intervals | Medium | [LC 56](https://leetcode.com/problems/merge-intervals/) |
| Insert Interval | Medium | [LC 57](https://leetcode.com/problems/insert-interval/) |
| Interval List Intersections | Medium | [LC 986](https://leetcode.com/problems/interval-list-intersections/) |
| Non-overlapping Intervals | Medium | [LC 435](https://leetcode.com/problems/non-overlapping-intervals/) |
| Meeting Rooms II | Medium | [LC 253](https://leetcode.com/problems/meeting-rooms-ii/) |

---

## 10. In-place Reversal of a Linked List

**Frequency: ★★★☆☆ | Difficulty: Medium**

### How to Spot It
- "Reverse a linked list" (whole or sub-section)
- "Reverse nodes in groups of k"
- Must do it **in-place** (O(1) space)
- Keywords: **reverse, in-place, linked list, k-group**

### The Pattern
Use three pointers: `prev`, `current`, `next`. At each step, save `current.next`, point `current.next` to `prev`, then advance both pointers. For sub-list reversals, remember the nodes before/after the reversed section to reconnect.

### Core Example — Reverse a Linked List

```python
def reverse(head):
    prev, current = None, head
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    return prev
```

> **Time: O(n)** — single pass through the list.
> **Space: O(1)** — only three pointer variables.

### LeetCode Practice
| Problem | Difficulty | Link |
|---------|-----------|------|
| Reverse Linked List | Easy | [LC 206](https://leetcode.com/problems/reverse-linked-list/) |
| Swap Nodes in Pairs | Medium | [LC 24](https://leetcode.com/problems/swap-nodes-in-pairs/) |
| Reverse Linked List II | Medium | [LC 92](https://leetcode.com/problems/reverse-linked-list-ii/) |
| Rotate List | Medium | [LC 61](https://leetcode.com/problems/rotate-list/) |
| Reverse Nodes in k-Group | Hard | [LC 25](https://leetcode.com/problems/reverse-nodes-in-k-group/) |

---

## 11. Top K Elements

**Frequency: ★★★★☆ | Difficulty: Medium**

### How to Spot It
- "Find the k largest / k smallest"
- "k most frequent elements"
- "k closest points"
- Keywords: **top k, kth largest, k most frequent, k closest**

### The Pattern
Use a **heap** (min-heap of size k for "k largest", max-heap of size k for "k smallest"). Iterate through elements, push onto heap, and pop when size exceeds k. The heap always contains your answer.

### Core Example — Kth Largest Element

```python
import heapq

def find_kth_largest(nums, k):
    min_heap = []
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    return min_heap[0]

# nums = [3,2,1,5,6,4], k = 2 → 5
```

> **Time: O(n log k)** — each of n elements may trigger a heap push/pop of size k.
> **Space: O(k)** — the heap stores at most k elements.

### LeetCode Practice
| Problem | Difficulty | Link |
|---------|-----------|------|
| Kth Largest Element in a Stream | Easy | [LC 703](https://leetcode.com/problems/kth-largest-element-in-a-stream/) |
| Kth Largest Element in an Array | Medium | [LC 215](https://leetcode.com/problems/kth-largest-element-in-an-array/) |
| Top K Frequent Elements | Medium | [LC 347](https://leetcode.com/problems/top-k-frequent-elements/) |
| K Closest Points to Origin | Medium | [LC 973](https://leetcode.com/problems/k-closest-points-to-origin/) |
| Sort Characters By Frequency | Medium | [LC 451](https://leetcode.com/problems/sort-characters-by-frequency/) |
| Reorganize String | Medium | [LC 767](https://leetcode.com/problems/reorganize-string/) |

---

## 12. Subsets (BFS / Backtracking)

**Frequency: ★★★☆☆ | Difficulty: Medium**

### How to Spot It
- "Generate all subsets / combinations / permutations"
- "Power set"
- "All possible arrangements"
- Keywords: **all subsets, combinations, permutations, generate all, power set**

### The Pattern
**Iterative (BFS-style):** Start with an empty set. For each new number, take all existing subsets and create new subsets by adding the current number to each.

**Recursive (Backtracking):** At each position, choose to include or exclude the current element, then recurse.

### Core Example — All Subsets

```python
def subsets(nums):
    result = [[]]
    for num in nums:
        result += [subset + [num] for subset in result]
    return result

# [1, 2, 3] → [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]
```

> **Time: O(n × 2ⁿ)** — there are 2ⁿ subsets, and copying each takes up to O(n).
> **Space: O(n × 2ⁿ)** — storing all subsets in the output.

### LeetCode Practice
| Problem | Difficulty | Link |
|---------|-----------|------|
| Subsets | Medium | [LC 78](https://leetcode.com/problems/subsets/) |
| Subsets II | Medium | [LC 90](https://leetcode.com/problems/subsets-ii/) |
| Permutations | Medium | [LC 46](https://leetcode.com/problems/permutations/) |
| Combinations | Medium | [LC 77](https://leetcode.com/problems/combinations/) |
| Letter Combinations of a Phone Number | Medium | [LC 17](https://leetcode.com/problems/letter-combinations-of-a-phone-number/) |
| Generate Parentheses | Medium | [LC 22](https://leetcode.com/problems/generate-parentheses/) |

---

## 13. Topological Sort (Graph)

**Frequency: ★★★☆☆ | Difficulty: Medium–Hard**

### How to Spot It
- "Order of tasks given dependencies"
- "Course schedule — is it possible?"
- "Find a valid ordering"
- Directed acyclic graph (DAG) with dependencies
- Keywords: **prerequisites, dependencies, ordering, schedule, DAG, before/after**

### The Pattern
Build an adjacency list and in-degree count. Start with all nodes that have in-degree 0 (no dependencies). Process them via BFS: for each processed node, decrement the in-degree of its neighbors. If a neighbor's in-degree hits 0, add it to the queue. If you process all nodes, a valid ordering exists.

### Core Example — Course Schedule (Can Finish?)

```python
from collections import deque, defaultdict

def can_finish(num_courses, prerequisites):
    graph = defaultdict(list)
    in_degree = [0] * num_courses

    for course, prereq in prerequisites:
        graph[prereq].append(course)
        in_degree[course] += 1

    queue = deque([i for i in range(num_courses) if in_degree[i] == 0])
    count = 0

    while queue:
        node = queue.popleft()
        count += 1
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return count == num_courses
```

> **Time: O(V + E)** — every vertex and edge is processed once (V = courses, E = prerequisites).
> **Space: O(V + E)** — adjacency list + in-degree array + queue.

### LeetCode Practice
| Problem | Difficulty | Link |
|---------|-----------|------|
| Course Schedule | Medium | [LC 207](https://leetcode.com/problems/course-schedule/) |
| Course Schedule II | Medium | [LC 210](https://leetcode.com/problems/course-schedule-ii/) |
| Minimum Height Trees | Medium | [LC 310](https://leetcode.com/problems/minimum-height-trees/) |
| Sequence Reconstruction | Medium | [LC 444](https://leetcode.com/problems/sequence-reconstruction/) |
| Alien Dictionary | Hard | [LC 269](https://leetcode.com/problems/alien-dictionary/) |

---

## 14. K-way Merge

**Frequency: ★★☆☆☆ | Difficulty: Medium–Hard**

### How to Spot It
- "Merge k sorted lists / arrays"
- "Kth smallest element from sorted lists"
- "Smallest range covering elements from k lists"
- Keywords: **k sorted, merge sorted, kth smallest across lists**

### The Pattern
Use a **min-heap** that always holds one element from each of the k lists. Pop the smallest, then push the next element from that same list. This gives you a globally sorted stream from k sorted inputs in O(N log k) time.

### Core Example — Merge K Sorted Lists

```python
import heapq

def merge_k_lists(lists):
    min_heap = []
    # Seed the heap with the first element from each list
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(min_heap, (lst.val, i, lst))

    dummy = current = ListNode(0)
    while min_heap:
        val, i, node = heapq.heappop(min_heap)
        current.next = node
        current = current.next
        if node.next:
            heapq.heappush(min_heap, (node.next.val, i, node.next))

    return dummy.next
```

> **Time: O(N log k)** — N total elements, each heap operation is O(log k) where k = number of lists.
> **Space: O(k)** — the heap holds one node from each of the k lists.

### LeetCode Practice
| Problem | Difficulty | Link |
|---------|-----------|------|
| Kth Smallest Element in a Sorted Matrix | Medium | [LC 378](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/) |
| Find K Pairs with Smallest Sums | Medium | [LC 373](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/) |
| Merge k Sorted Lists | Hard | [LC 23](https://leetcode.com/problems/merge-k-sorted-lists/) |
| Smallest Range Covering Elements from K Lists | Hard | [LC 632](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/) |

---

## 15. Backtracking

**Frequency: ★★★☆☆ | Difficulty: Hard**

### How to Spot It
- "Find all valid configurations"
- "Place N queens"
- "Solve sudoku"
- Constraint satisfaction with exploration + undo
- Keywords: **all valid, solve, place, N-queens, sudoku, generate valid, constraint**

### The Pattern
Explore all possible solutions by building candidates incrementally. At each step, if a constraint is violated, **backtrack** (undo the last choice) and try the next option. Prune branches early to avoid unnecessary work.

### Core Example — Generate Valid Parentheses

```python
def generate_parentheses(n):
    result = []

    def backtrack(current, open_count, close_count):
        if len(current) == 2 * n:
            result.append(current)
            return
        if open_count < n:
            backtrack(current + '(', open_count + 1, close_count)
        if close_count < open_count:
            backtrack(current + ')', open_count, close_count + 1)

    backtrack('', 0, 0)
    return result

# n = 3 → ["((()))", "(()())", "(())()", "()(())", "()()()"]
```

> **Time: O(4ⁿ / √n)** — bounded by the nth Catalan number of valid combinations.
> **Space: O(n)** — recursion depth is 2n; output space is O(4ⁿ / √n) if counting results.

### LeetCode Practice
| Problem | Difficulty | Link |
|---------|-----------|------|
| Generate Parentheses | Medium | [LC 22](https://leetcode.com/problems/generate-parentheses/) |
| Combination Sum | Medium | [LC 39](https://leetcode.com/problems/combination-sum/) |
| Word Search | Medium | [LC 79](https://leetcode.com/problems/word-search/) |
| Palindrome Partitioning | Medium | [LC 131](https://leetcode.com/problems/palindrome-partitioning/) |
| N-Queens | Hard | [LC 51](https://leetcode.com/problems/n-queens/) |
| Sudoku Solver | Hard | [LC 37](https://leetcode.com/problems/sudoku-solver/) |

---

## 16. Two Heaps

**Frequency: ★★☆☆☆ | Difficulty: Hard**

### How to Spot It
- "Find the median" of a stream
- "Sliding window median"
- Need to track the **middle** of a dynamic dataset
- Keywords: **median, stream, balanced partition, middle element**

### The Pattern
Maintain two heaps: a **max-heap** for the smaller half and a **min-heap** for the larger half. Balance them so their sizes differ by at most 1. The median is always at the top of one or both heaps.

### Core Example — Find Median from Data Stream

```python
import heapq

class MedianFinder:
    def __init__(self):
        self.max_heap = []  # smaller half (inverted for max-heap)
        self.min_heap = []  # larger half

    def add_num(self, num):
        heapq.heappush(self.max_heap, -num)
        # Ensure max_heap's top <= min_heap's top
        heapq.heappush(self.min_heap, -heapq.heappop(self.max_heap))
        # Balance sizes: max_heap can have at most 1 more
        if len(self.min_heap) > len(self.max_heap):
            heapq.heappush(self.max_heap, -heapq.heappop(self.min_heap))

    def find_median(self):
        if len(self.max_heap) > len(self.min_heap):
            return -self.max_heap[0]
        return (-self.max_heap[0] + self.min_heap[0]) / 2
```

> **Time: O(log n)** per `add_num`, **O(1)** per `find_median` — heap insertions/removals are logarithmic.
> **Space: O(n)** — both heaps together store all n elements.

### LeetCode Practice
| Problem | Difficulty | Link |
|---------|-----------|------|
| Find Median from Data Stream | Hard | [LC 295](https://leetcode.com/problems/find-median-from-data-stream/) |
| Sliding Window Median | Hard | [LC 480](https://leetcode.com/problems/sliding-window-median/) |
| IPO | Hard | [LC 502](https://leetcode.com/problems/ipo/) |

---

## 17. 0/1 Knapsack (Dynamic Programming)

**Frequency: ★★☆☆☆ | Difficulty: Hard**

### How to Spot It
- "Maximum value with weight constraint"
- "Can you partition into equal subsets?"
- "Count of subset sum"
- Each item is either taken or not (no fractions)
- Keywords: **knapsack, subset sum, partition, take or skip, capacity, maximize/minimize with constraint**

### The Pattern
Build a DP table where `dp[i][w]` = best value using items `0..i` with capacity `w`. For each item, choose max of (skip it → `dp[i-1][w]`) vs (take it → `dp[i-1][w - weight[i]] + value[i]`). Can often be space-optimized to 1D by iterating capacity in reverse.

### Core Example — 0/1 Knapsack

```python
def knapsack(profits, weights, capacity):
    n = len(profits)
    dp = [0] * (capacity + 1)

    for i in range(n):
        # Traverse in reverse to avoid using same item twice
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + profits[i])

    return dp[capacity]

# profits=[1,6,10,16], weights=[1,2,3,5], capacity=7 → 22
```

> **Time: O(n × C)** — n items × C capacity; pseudo-polynomial.
> **Space: O(C)** — 1D DP array of size capacity + 1 (optimized from O(n × C) 2D table).

### LeetCode Practice
| Problem | Difficulty | Link |
|---------|-----------|------|
| Partition Equal Subset Sum | Medium | [LC 416](https://leetcode.com/problems/partition-equal-subset-sum/) |
| Target Sum | Medium | [LC 494](https://leetcode.com/problems/target-sum/) |
| Last Stone Weight II | Medium | [LC 1049](https://leetcode.com/problems/last-stone-weight-ii/) |
| Ones and Zeroes | Medium | [LC 474](https://leetcode.com/problems/ones-and-zeroes/) |
| Coin Change | Medium | [LC 322](https://leetcode.com/problems/coin-change/) |
| Combination Sum IV | Medium | [LC 377](https://leetcode.com/problems/combination-sum-iv/) |

---

## Quick Reference: Pattern Selection Cheatsheet

| If you see... | Think... |
|---|---|
| Sorted array, find pair/triplet | **Two Pointers** |
| Contiguous subarray/substring with condition | **Sliding Window** |
| Linked list cycle / find middle | **Fast & Slow Pointers** |
| Numbers in range [0,n], find missing/duplicate | **Cyclic Sort** |
| Single number, O(1) space, pairs cancel | **Bitwise XOR** |
| Sorted array, O(log n) search | **Modified Binary Search** |
| Tree: level-by-level processing | **BFS** |
| Tree: root-to-leaf paths, depth | **DFS** |
| List of intervals, overlapping ranges | **Merge Intervals** |
| Reverse linked list in-place | **In-place LL Reversal** |
| "K largest / smallest / most frequent" | **Top K Elements** (heap) |
| Generate all subsets/permutations/combos | **Subsets / Backtracking** |
| Task ordering with dependencies | **Topological Sort** |
| Merge k sorted collections | **K-way Merge** (heap) |
| Find all valid configurations / constraint solving | **Backtracking** |
| Find median of stream / balanced halves | **Two Heaps** |
| Take/skip items with capacity constraint | **0/1 Knapsack (DP)** |