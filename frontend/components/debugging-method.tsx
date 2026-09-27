"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { basketTrace, basketTraceCode, debuggingSteps } from "@/lib/debugging-method";
import { completeDebuggingStep, useDebuggingProgress } from "@/lib/debugging-progress";
import { DebugQuestionCheck } from "./debugging-coach";

function MethodStep({ index, onContinue }: { index: number; onContinue: () => void }) {
  const step = debuggingSteps[index];
  const [correct, setCorrect] = useState(false);
  const [frame, setFrame] = useState(0);
  const [traced, setTraced] = useState(false);
  const current = basketTrace[frame];
  return <article className="beginner-lesson method-lesson"><p className="eyebrow">STEP {index + 1} / A REPEATABLE METHOD</p><h2>{step.title}</h2><p>{step.idea}</p>
    {index === 0 && <div className="bug-types">
      <section><h3>Syntax</h3><p>Python cannot read the instruction.</p><code>if price &gt; 0</code><p>A missing colon is one possible cause. Check the reported line and the line before it.</p></section>
      <section><h3>Runtime</h3><p>The program starts but an instruction fails.</p><code>NameError: name &apos;totla&apos; is not defined</code><p>Inspect the name and the assignments that should have created it.</p></section>
      <section><h3>Logic</h3><p>The program finishes, but the answer violates the rule.</p><code>expected: 6; actual: 2</code><p>Compare intermediate values; the last line may only reveal an earlier mistake.</p></section>
    </div>}
    {(index === 1 || index === 2) && <pre className="beginner-code" aria-label="Original basket program"><code>{basketTraceCode.split("\n").map((line, i) => <span key={i} data-current={index === 2 && current.line === i}>{line}{"\n"}</span>)}</code></pre>}
    {index === 1 && <aside className="beginner-vocabulary"><strong>Reproduce before you repair</strong><p>The list in this example is [4, 2]. For the question below, imagine replacing just that list. Keep the same program and compare what each input reveals.</p></aside>}
    {index === 2 && <section className="method-trace" aria-label="State comparison"><p>Guided trace of this fixed example. The highlighted instruction has just executed.</p>
      <div role="status" aria-atomic="true"><h3>{current.step}</h3><dl><div><dt>Actual total</dt><dd>{current.actual}</dd></div><div><dt>Expected total so far</dt><dd>{current.expected}</dd></div></dl><p>{current.actual === current.expected ? "State still matches the rule." : "Mismatch: earlier work has been lost."}</p><p>{current.why}</p></div>
      <div className="method-actions"><button className="button secondary" disabled={frame === 0} onClick={() => setFrame(value => value - 1)}>Previous state</button><button className="button secondary" disabled={frame === basketTrace.length - 1} onClick={() => { const next = frame + 1; setFrame(next); if (next === basketTrace.length - 1) setTraced(true); }}>Next state</button><small>State {frame + 1} of {basketTrace.length}</small></div>
    </section>}
    {index === 3 && <aside className="beginner-vocabulary"><strong>When the fix goes into a real product</strong><p>Add a test for the original failure, ask a teammate to review the change, release it through your checks, and watch the relevant errors or behavior. If the release causes harm, use the team&apos;s rollback procedure. Avoid putting passwords or customer data in debugging notes.</p></aside>}
    {index !== 2 || traced ? <DebugQuestionCheck question={step.question} onCorrect={() => setCorrect(true)} /> : <p>Inspect all four states to unlock the next question.</p>}
    <button className="button primary" disabled={!correct} onClick={onContinue}>{index === 3 ? "Finish and practise" : "Save and continue"}</button>
  </article>;
}

export function DebuggingMethod() {
  const { completed, temporary } = useDebuggingProgress();
  const [selected, setSelected] = useState<number | null>(null);
  const heading = useRef<HTMLDivElement>(null);
  const active = Math.min(selected ?? completed, completed);
  function go(index: number) { setSelected(index); heading.current?.focus(); }
  return <div className="dashboard page-enter beginner-page"><div className="page-heading"><div><p className="eyebrow">OBSERVE. QUESTION. TEST.</p><h1>Learn to debug.<br /><em>One clue at a time.</em></h1><p>You do not need to guess the fix. Learn how to turn a confusing failure into a small question you can test. New to variables and loops? <Link prefetch={false} href="/start">Start with your first line.</Link></p></div></div>
    <nav className="beginner-steps" aria-label="Debugging method">{debuggingSteps.map((step, i) => <button key={step.title} disabled={i > completed} aria-current={active === i ? "step" : undefined} onClick={() => go(i)}><small>0{i + 1}{i < completed ? " / REVIEW" : ""}</small>{step.title}</button>)}</nav>
    <p className="storage-note" role="status">{temporary ? "Browser storage is unavailable. Lesson progress stays in this tab until you reload or leave." : "Lesson progress is saved in this browser, shared by its users. It is not account sync."}</p>
    <div ref={heading} tabIndex={-1} className="beginner-focus" aria-label="Current debugging lesson">{active < debuggingSteps.length ? <MethodStep key={active} index={active} onContinue={() => { completeDebuggingStep(active); go(active + 1); }} /> : <article className="beginner-lesson"><p className="eyebrow">PUT THE METHOD TO WORK</p><h2>Now investigate a real program.</h2><p>You have practised the method. Next, make a repair yourself and use the debugging notebook to record your input, evidence, hypothesis and experiment. Completion of this lesson is practice, not a mastery score.</p><div className="method-practice"><Link className="button primary" prefetch={false} href="/solve/debug-basket-total">Repair the basket total</Link><Link className="button secondary" prefetch={false} href="/solve/debug-temperature-boundary">Investigate a boundary</Link><Link className="button secondary" prefetch={false} href="/solve/debug-inbox-return">Find an early return</Link></div><button className="text-button" onClick={() => go(0)}>Review the method</button></article>}</div>
  </div>;
}
