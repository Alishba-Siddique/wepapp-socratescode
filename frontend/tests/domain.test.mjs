import { test } from "node:test";
import assert from "node:assert/strict";
import { puzzles, trace, answer, integer, source } from "../lib/puzzles.ts";
import { parseProgress } from "../lib/progress.ts";
import { practiceProblems, filterPractice } from "../lib/practice.ts";
import { codingProblems } from "../lib/coding-problems.ts";
import { patterns } from "../lib/patterns.ts";
import { productLessons } from "../lib/product-lessons.ts";
import { designChallenges } from "../lib/design-challenges.ts";
import { beginnerLessons, parseBeginner, completeBeginnerLesson } from "../lib/beginner.ts";
import { basketTrace, emptyDebugNotebook, notebookMarkdown, parseDebugNotebook, parseDebuggingProgress } from "../lib/debugging-method.ts";
import { parsePersonalTests, parseTestValue } from "../lib/personal-tests.ts";
import { initialTerminal, runTerminal, terminalGoal } from "../lib/terminal-simulator.ts";
import { foundationLessons, parseFoundationProgress } from "../lib/engineering-foundations.ts";

test("all engineering lessons reach their objective through the documented commands",()=>{
  for(const lesson of foundationLessons){let state=initialTerminal();assert.equal(terminalGoal(lesson.id,state),false);for(const command of lesson.commands){const result=runTerminal(state,command);assert.equal(result.code,0,command+": "+result.output);state=result.state;}assert(terminalGoal(lesson.id,state),lesson.id);}
});
test("Git commits the reviewed staged snapshot while later edits remain local",()=>{
  let state=initialTerminal();for(const command of ['echo "reviewed" > notes.txt','git add notes.txt','echo "later" > notes.txt','git diff --staged','git commit -m "Review snapshot"'])state=runTerminal(state,command).state;
  assert.equal(state.committed,"reviewed\n");assert.equal(state.notes,"later\n");assert.equal(state.staged,null);assert.match(runTerminal(state,"git status").output,/Changes not staged/);assert.equal(state.commits.length,1);
});
test("terminal rejects execution, expansion, unknown hosts and paths without changing state",()=>{
  const state=initialTerminal();for(const command of ['rm -rf /','pwd; whoami','echo $(id)','echo "${SECRET}"','cat ../../etc/passwd','ssh root@example.com','curl -i https://example.com','echo "oops','echo x > ../README.md','pwd | cd logs','cat logs/app.log |','x'.repeat(241),'pwd\nls']){const result=runTerminal(state,command);assert.notEqual(result.code,0,command);assert.deepEqual(result.state,state);}
  assert.equal(runTerminal(state,`echo '<script>alert(1)</script>'`).output,'<script>alert(1)</script>\n');
  assert.equal(runTerminal(state,`echo 'a | b > c'`).output,'a | b > c\n');
  assert.equal(runTerminal(state,'grep -F missing logs/app.log').code,1);
  const empty=runTerminal(state,'grep -F missing logs/app.log | wc -l');assert.equal(empty.code,0);assert.equal(empty.output,'0\n');
});
test("simulated shop checks ownership and validates quantity using a trusted price",()=>{
  const state=initialTerminal();assert.match(runTerminal(state,'curl -i https://shop.test/orders/someone-else').output,/403/);
  for(const quantity of [-1,0,6,1.5,'1',null])assert.match(runTerminal(state,`curl -i -X POST https://shop.test/checkout -d '${JSON.stringify({quantity})}'`).output,/400/);
  const result=runTerminal(state,`curl -i -X POST https://shop.test/checkout -d '{"quantity":2,"unitPrice":1}'`);assert.match(result.output,/"totalCents":2400/);assert.equal(result.code,0);
});
test("SSH changes only the fictional context and restores the local directory",()=>{
  let state=runTerminal(initialTerminal(),'cd logs').state;state=runTerminal(state,'ssh learner@practice.test').state;assert.equal(state.cwd,'/srv/project');assert.match(runTerminal(state,'cat logs/app.log').output,/database connection refused/);state=runTerminal(state,'exit').state;assert.equal(state.cwd,'/workspace/project/logs');assert.equal(state.remote,false);
});
test("foundation progress accepts known lessons only and bounds browser data",()=>{
  assert.deepEqual(parseFoundationProgress('{"version":1,"completed":["git","git"]}'),['git']);
  for(const raw of [null,'{','null','[]','x'.repeat(1001),'{"version":2,"completed":["git"]}','{"version":1,"completed":["admin"]}','{"version":1,"completed":[42]}'])assert.deepEqual(parseFoundationProgress(raw),[]);
});

import { emptyProjectDraft, parseProjectDraft, projectMarkdown, inboxProblem, inboxTrace } from "../lib/product-project.ts";

test("product project validates local milestones and exports notes without markup execution", () => {
  const draft={...emptyProjectDraft(),briefAccepted:true,traceSeen:3,plan:"Remember IDs",review:"<img src=x>\n# literal"};
  assert.deepEqual(parseProjectDraft(JSON.stringify(draft)),draft);
  for (const row of [null,"{",JSON.stringify({...draft,version:2}),JSON.stringify({...draft,traceSeen:4}),JSON.stringify({...draft,traceSeen:1.5}),JSON.stringify({...draft,briefAccepted:false}),JSON.stringify({...draft,plan:"x".repeat(1501)}),"x".repeat(20001)]) assert.deepEqual(parseProjectDraft(row),emptyProjectDraft());
  assert(projectMarkdown(draft).includes("    <img src=x>\n    # literal"));
  assert.deepEqual(inboxTrace.at(-1).ids,["a","b"]);
  assert.equal(inboxTrace.at(-1).unread,1);
  assert.equal(codingProblems.filter(p=>p.slug===inboxProblem.slug).length,1);
  assert.equal(inboxProblem.tests.length,6);
});

test("personal test cases preserve false/null and reject unbounded or invalid inputs", () => {
  for (const raw of ["", "[1,]", "1e999", '"'+"x".repeat(1500)+'"', '['.repeat(14)+'0'+']'.repeat(14)]) assert.throws(()=>parseTestValue(raw));
  assert.deepEqual(parseTestValue('[0,false,null]'),[0,false,null]);
  const cases=[{name:"False is a value",input:false,expected:null}];
  assert.deepEqual(parsePersonalTests(JSON.stringify({version:1,cases})),cases);
  for(const raw of [null,"{","[]",JSON.stringify({version:2,cases}),JSON.stringify({version:1,cases:Array(7).fill(cases[0])}),JSON.stringify({version:1,cases:[{name:"Missing result",input:0}]}),JSON.stringify({version:1,cases:[{...cases[0],name:""}]})])assert.deepEqual(parsePersonalTests(raw),[]);
});

test("debugging lesson progress and notebooks reject corrupt or oversized browser data", () => {
  for (const raw of [null, "{", "[]", "null", "x".repeat(129), '{"version":1,"completed":99}', '{"version":1,"completed":-1}', '{"version":1,"completed":2.5}', '{"version":2,"completed":4}']) assert.equal(parseDebuggingProgress(raw), 0);
  assert.equal(parseDebuggingProgress('{"version":1,"completed":4}'), 4);
  const notes = { ...emptyDebugNotebook(), input: "[4, 2]", expected: "6", actual: "2", hypothesis: "The old total is overwritten." };
  assert.deepEqual(parseDebugNotebook(JSON.stringify({version:1, notes})), notes);
  for (const raw of [null, "[]", "{", "x".repeat(40001), JSON.stringify({version:2,notes}), JSON.stringify({version:1,notes:{...notes,input:42}}), JSON.stringify({version:1,notes:{...notes,outcome:"x".repeat(1001)}})]) assert.deepEqual(parseDebugNotebook(raw), emptyDebugNotebook());
  const exported = notebookMarkdown("Basket", {...notes,hypothesis:"<img src=x>\n# injected heading\n```"});
  assert(exported.includes("    <img src=x>\n    # injected heading\n    ```"));
  assert.equal(basketTrace.findIndex(frame => frame.actual !== frame.expected), 2);
  assert.equal(basketTrace[2].expected, 4 + 2);
});

test("beginner progress rejects corrupt, oversized and incompatible data without unlocking later steps", () => {
  for (const raw of [null, "{", "[]", "null", "x".repeat(513), '{"version":2,"completed":3,"practicePassed":true}', '{"version":1,"completed":99,"practicePassed":true}', '{"version":1,"completed":1.5,"practicePassed":false}']) {
    assert.deepEqual(parseBeginner(raw), {version:1,completed:0,practicePassed:false});
  }
  const start = parseBeginner(null);
  assert.deepEqual(completeBeginnerLesson(start, 2), start);
  assert.deepEqual(completeBeginnerLesson(start, -1), start);
  const first = completeBeginnerLesson(start, 0);
  assert.equal(first.completed, 1);
  assert.equal(completeBeginnerLesson(first, 0).completed, 1);
  assert.equal(parseBeginner('{"version":1,"completed":1,"practicePassed":true}').practicePassed, false);
  assert.equal(parseBeginner('{"version":1,"completed":3,"practicePassed":true}').practicePassed, true);
  for (const lesson of beginnerLessons) {
    for (const question of [lesson.prediction, lesson.transfer]) {
      assert(question.correct >= 0 && question.correct < question.options.length);
      assert.equal(question.feedback.length, question.options.length);
    }
    assert(lesson.frames.every(frame => frame.line >= 0 && frame.line < lesson.code.split("\n").length));
  }
});
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
  assert.equal(codingProblems.length,24);
  assert.equal(new Set(codingProblems.map(p=>p.slug)).size,codingProblems.length);
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
