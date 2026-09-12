import { test } from "node:test";
import assert from "node:assert/strict";
import { puzzles, trace, answer, integer, source } from "../lib/puzzles.ts";
import { parseProgress } from "../lib/progress.ts";
test("all guided traces produce the expected state transitions", () => {
  assert.deepEqual(
    puzzles.map((p) => answer(p)),
    [6, 6, 1],
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
