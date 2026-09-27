"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { beginnerLessons, completeBeginnerLesson, type BeginnerQuestion } from "@/lib/beginner";
import { readBeginnerProgress, saveBeginnerProgress, useBeginnerProgress } from "@/lib/beginner-progress";

function Question({ question, onCorrect }: { question: BeginnerQuestion; onCorrect: () => void }) {
  const [choice, setChoice] = useState(-1);
  const [checked, setChecked] = useState(-1);
  return <form className="beginner-question" onSubmit={event => { event.preventDefault(); if (choice < 0) return; setChecked(choice); if (choice === question.correct) onCorrect(); }}>
    <fieldset><legend>{question.prompt}</legend>{question.options.map((option, index) => <label key={option}><input type="radio" name="answer" checked={choice === index} onChange={() => { setChoice(index); setChecked(-1); }} />{option}</label>)}</fieldset>
    <button className="button secondary" disabled={choice < 0} type="submit">Check my thinking</button>
    <p role="status">{checked >= 0 ? question.feedback[checked] : "Choose an answer. A mistake is a useful place to start."}</p>
  </form>;
}

function Lesson({ index, onContinue }: { index: number; onContinue: () => void }) {
  const lesson = beginnerLessons[index];
  const [predicted, setPredicted] = useState(false);
  const [frame, setFrame] = useState(-1);
  const [transfer, setTransfer] = useState(false);
  return <article className="beginner-lesson">
    <p className="eyebrow">STEP {index + 1} / UNDERSTAND BEFORE YOU RUN</p>
    <h2>{lesson.title}</h2><p>{lesson.idea}</p>
    <aside className="beginner-vocabulary"><strong>Before we begin</strong><p>{lesson.vocabulary}</p></aside>
    <pre className="beginner-code" aria-label="Python example"><code>{lesson.code.split("\n").map((line, i) => <span key={i} data-current={frame >= 0 && lesson.frames[frame].line === i}>{line}{"\n"}</span>)}</code></pre>
    <Question question={lesson.prediction} onCorrect={() => setPredicted(true)} />
    <section className="beginner-trace" aria-label="Guided trace"><h3>Make each change visible</h3><p>This is a guided trace of the example above. Real Python execution comes in your independent challenge.</p>
      <button className="button secondary" onClick={() => setFrame(value => Math.min(value + 1, lesson.frames.length - 1))} disabled={!predicted || frame === lesson.frames.length - 1}>{frame < 0 ? "Trace the first line" : "Trace the next change"}</button>
      {!predicted && <p>Check a correct prediction to unlock the trace.</p>}
      <div aria-live="polite" aria-atomic="true">{frame >= 0 && <><strong>{lesson.frames[frame].state}</strong><p>{lesson.frames[frame].why}</p><small>Change {frame + 1} of {lesson.frames.length}</small></>}</div>
    </section>
    {frame === lesson.frames.length - 1 && <section><h3>Change one thing</h3><Question question={lesson.transfer} onCorrect={() => setTransfer(true)} /></section>}
    <button className="button primary" disabled={!transfer} onClick={onContinue}>{index < 2 ? "Save and continue" : "Open my independent challenge"}</button>
  </article>;
}

export function BeginnerNextStep() {
  const { progress } = useBeginnerProgress();
  return <section className="beginner-entry"><div><p className="eyebrow">YOUR FIRST STEPS</p><h2>{progress.practicePassed ? "Take the idea somewhere new." : "No coding background needed."}</h2><p>{progress.practicePassed ? "You tried the first journey. Next, practise predicting a running total and explain every change." : "Learn what a variable means, follow a loop, find a mistake, then write a small function yourself."}</p></div><Link prefetch={false} className="button primary" href={progress.practicePassed ? "/learn/a-running-total" : "/start"}>{progress.practicePassed ? "Try the next guided lab" : progress.completed ? "Continue my first steps" : "Start from zero"}</Link></section>;
}

export function BeginnerJourney() {
  const { progress, temporary } = useBeginnerProgress();
  const [selected, setSelected] = useState<number | null>(null);
  const heading = useRef<HTMLDivElement>(null);
  const active = Math.min(selected ?? progress.completed, progress.completed);
  function go(index: number) { setSelected(index); heading.current?.focus(); }
  return <div className="dashboard page-enter beginner-page">
    <div className="page-heading"><div><p className="eyebrow">SMALL STEPS. YOUR OWN THINKING.</p><h1>Your first line.<br /><em>Your own reasoning.</em></h1><p>No prerequisites. No timer. Socrates will ask you to predict, look closely, and try again. You can revisit a finished step at any time.</p></div></div>
    <nav className="beginner-steps" aria-label="First steps">{[...beginnerLessons.map(lesson => lesson.title), "Write it yourself"].map((title, i) => <button key={title} disabled={i > progress.completed} aria-current={active === i ? "step" : undefined} onClick={() => go(i)}><small>0{i + 1}{i < progress.completed ? " / REVIEW" : ""}</small>{title}</button>)}</nav>
    <p className="storage-note" role="status">{temporary ? "Browser storage is unavailable. Your progress stays in this tab until you leave or reload." : "First-steps progress is saved on this browser, shared by its users. It is not synced to your account."}</p>
    <div ref={heading} tabIndex={-1} className="beginner-focus" aria-label="Current learning step">
      {active < beginnerLessons.length ? <Lesson key={active} index={active} onContinue={() => { saveBeginnerProgress(completeBeginnerLesson(readBeginnerProgress(), active)); go(active + 1); }} /> : <article className="beginner-lesson"><p className="eyebrow">STEP 4 / LESS GUIDANCE, MORE THINKING</p><h2>{progress.practicePassed ? "Your first practice checks passed." : "Write it yourself."}</h2><p>A trail can move forward and backward. Write a function that returns its final position. You have seen the idea; now express it yourself with different inputs.</p><ul><li>Before typing: what must you remember after each move?</li><li>For [4, -2, 7], predict the final position on paper.</li><li>What should an empty trail return?</li><li>Use the editor, run the checks, and inspect the first mismatch.</li></ul><p>Need help with syntax? The editor has a Python vocabulary guide and optional Socratic hints. There is no penalty for using them.</p><Link prefetch={false} className="button primary" href="/solve/trail-total">{progress.practicePassed ? "Revisit the Python challenge" : "Write my Python function"}</Link>{progress.practicePassed && <section className="beginner-trace"><h3>Can you explain the idea without looking?</h3><p>Why do you start at zero? Why does a negative move need no separate update? Passing the visible cases is practice evidence, not proof of independent mastery.</p><Link prefetch={false} href="/learn/a-running-total" className="button secondary">Next: investigate a running total</Link><Link prefetch={false} href="/solve/debug-basket-total" className="button secondary">Try a real debugging task</Link></section>}</article>}
    </div>
  </div>;
}
