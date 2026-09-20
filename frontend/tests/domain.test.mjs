import { test } from "node:test";
import assert from "node:assert/strict";
import { puzzles, trace, answer, integer, source } from "../lib/puzzles.ts";
import { parseProgress } from "../lib/progress.ts";
import { practiceProblems, filterPractice } from "../lib/practice.ts";
import { codingProblems } from "../lib/coding-problems.ts";
import { patterns } from "../lib/patterns.ts";
import { productLessons } from "../lib/product-lessons.ts";
import { designChallenges } from "../lib/design-challenges.ts";
test("every pattern has a sourced usable lesson with a valid practice destination", () => {
  assert.deepEqual(new Set(productLessons.map(item=>item.id)),new Set(patterns.map(item=>item.id)));
  for(const lesson of productLessons) {
    assert(codingProblems.some(problem=>problem.slug===lesson.practice));
    assert(lesson.correct>=0 && lesson.correct<lesson.options.length);
    assert.equal(lesson.options.length,lesson.feedback.length);
    assert(lesson.frames.length>=3);
    assert.equal(new URL(lesson.source.url).protocol,"https:");
  }
});
test("licensed imports preserve provenance, runnable inputs and essential rules", () => {
  assert.equal(codingProblems.length,20);
  assert.equal(new Set(codingProblems.map(p=>p.slug)).size,20);
  const imported=codingProblems.filter(p=>p.source);
  assert.equal(imported.length,8);
  assert.equal(imported.reduce((sum,p)=>sum+p.tests.length,0),88);
  for(const p of imported) {
    assert.match(p.source.revision,/^[a-f0-9]{40}$/);
    assert.equal(p.source.license,"MIT");
    assert(p.tests.length>=3);
    assert(p.source.url.includes(p.source.revision));
    for(const sample of p.tests)assert(!sample.expected?.error);
  }
  assert.match(codingProblems.find(p=>p.slug==="exercism-leap").description,/400/);
});
test("design curriculum covers all requested tracks with original staged exercises", () => {
  assert.equal(designChallenges.length,6);
  for(const track of ["System design","Database design","Architecture"])assert.equal(designChallenges.filter(c=>c.track===track).length,2);
  for(const c of designChallenges) {assert.equal(c.steps.length,3);assert(c.steps.every(step=>step.review.length>=2));}
});
test("all guided traces produce the expected state transitions", () => {
  assert.deepEqual(
    puzzles.map((p) => answer(p)),
    [6, 6, 1, 4, 14, 2, -6, 8, 3],
  );
  assert.deepEqual(
    trace(puzzles[0]).map((f) => f.total),
    [0, 1, 3, 6, 6],
  );
  assert.deepEqual(
    trace(puzzles[1], 4).map((f) => f.total),
    [1, 1, 2, 6, 24, 24],
  );
  assert.deepEqual(
    trace(puzzles[2], 6).map((f) => f.total),
    [0, 0, 1, 1, 2, 2, 3, 3],
  );
  for (const p of puzzles)
    for (let limit = 1; limit <= 6; limit++) {
      const rows = trace(p, limit);
      assert.equal(rows.length, limit + 2);
      assert.equal(rows.at(-1).line, source(p, limit).length - 1);
    }
});
test("modified examples and make targets agree", () => {
  assert.equal(answer(puzzles[0], 4), 10);
  assert.equal(answer(puzzles[0], 5), 15);
  assert.equal(answer(puzzles[1], 5), 120);
  assert.equal(answer(puzzles[2], 6), 3);
});
test("every lab has a reachable target and distinct trace semantics", () => {
  assert.equal(new Set(puzzles.map(p => p.slug)).size, 9);
  for (const puzzle of puzzles) {
    assert([2,3,4,5,6].some(limit => answer(puzzle, limit) === puzzle.target), puzzle.slug);
    assert(puzzle.correct >= 0 && puzzle.correct < puzzle.options.length);
  }
  assert.deepEqual(trace(puzzles[3], 5).map(f => f.total), [0,1,1,4,4,9,9]);
  assert.deepEqual(trace(puzzles[4], 4).map(f => f.total), [0,1,5,14,30,30]);
  assert.deepEqual(trace(puzzles[5], 6).map(f => f.total), [0,0,2,2,6,6,12,12]);
  assert.deepEqual(trace(puzzles[6], 3).map(f => f.total), [0,-1,-3,-6,-6]);
  assert.deepEqual(trace(puzzles[7], 4).map(f => f.total), [1,2,4,8,16,16]);
  assert.deepEqual(trace(puzzles[8], 3).map(f => f.total), [0,1,2,3,3]);
});
test("practice references are unique and combined filters find the right material", () => {
  assert.equal(practiceProblems.filter(p => p.source === "CSES").length, 20);
  assert.equal(new Set(practiceProblems.map(p => p.url)).size, practiceProblems.length);
  for (const problem of practiceProblems) assert(["leetcode.com", "cses.fi"].includes(new URL(problem.url).hostname));
  assert.deepEqual(filterPractice("range sum", "CSES", "Prefix sums").map(p => p.id), ["cses-1646"]);
  assert.equal(filterPractice("nonexistent", "All sources", "All topics").length, 0);
});
test("bounds and predictions are validated", () => {
  for (const limit of [0, 7, 2.5, NaN, Infinity])
    assert.throws(() => trace(puzzles[0], limit), RangeError);
  for (const input of ["", "1.5", "NaN", "6e1", "hello", "9007199254740992"])
    assert.equal(integer(input), null);
  assert.equal(integer(" 6 "), 6);
  assert.equal(integer("-2"), -2);
});
test("corrupt browser progress cannot crash or unlock unsupported stages", () => {
  assert.deepEqual(parseProgress("{"), {});
  assert.deepEqual(parseProgress("[]"), {});
  const state = parseProgress(
    JSON.stringify({
      good: {
        stage: 99,
        traceIndex: -4,
        modifiedLimit: 999,
        prediction: 5,
        completed: true,
      },
      bad: null,
    }),
  );
  assert.equal(state.good.stage, 4);
  assert.equal(state.good.traceIndex, 0);
  assert.equal(state.good.modifiedLimit, 6);
  assert.equal(state.good.prediction, "");
  assert.equal(state.bad, undefined);
  assert.equal(
    parseProgress('{"a":{"stage":0,"completed":true}}').a.completed,
    false,
  );
});
