"use client";
import { useState } from "react";
import type { DebugExercise, DebugQuestion } from "@/lib/coding-problems";

function Check({ question, onCorrect }: { question: DebugQuestion; onCorrect: () => void }) {
  const [choice, setChoice] = useState(-1);
  const [checked, setChecked] = useState(-1);
  return <form className="debug-question" onSubmit={event => { event.preventDefault(); if (choice < 0) return; setChecked(choice); if (choice === question.correct) onCorrect(); }}>
    <fieldset><legend>{question.prompt}</legend>{question.options.map((option, index) => <label key={option}><input type="radio" name="debug-answer" checked={choice === index} onChange={() => { setChoice(index); setChecked(-1); }} />{option}</label>)}</fieldset>
    <button type="submit" className="button secondary" disabled={choice < 0}>Check my reasoning</button>
    <p role="status">{checked >= 0 ? question.feedback[checked] : "Predict what is written, even if it is not what you intended."}</p>
  </form>;
}

export function DebuggingCoach({ exercise }: { exercise: DebugExercise }) {
  const [predicted, setPredicted] = useState(false);
  const [diagnosed, setDiagnosed] = useState(false);
  return <section className="debug-coach" aria-label="Debug with Socrates">
    <p className="eyebrow">DEBUG WITH SOCRATES</p><h2>Find the cause before the fix.</h2>
    <p>{exercise.scenario}</p><details><summary>Words you need for this exercise</summary><p>{exercise.vocabulary}</p></details>
    <details><summary>Inspect the original broken program</summary><pre><code>{exercise.code}</code></pre><p>These questions refer to this original program. Your editor draft may already have changes.</p></details>
    <h3>1. Predict the mistake</h3><Check question={exercise.prediction} onCorrect={() => setPredicted(true)} />
    {predicted && <><h3>2. Narrow it down</h3><Check question={exercise.diagnosis} onCorrect={() => setDiagnosed(true)} /></>}
    {diagnosed && <div className="debug-next" role="status"><h3>3. Make one deliberate change</h3><p>Repair the Python in the editor, then run all checks. If a case still fails, compare its input, expected result and actual result. The questions identify the cause; you write the repair.</p><a href="#python-repair" className="button secondary">Go to my editor</a></div>}
  </section>;
}

export function DebuggingReflection({ exercise }: { exercise: DebugExercise }) {
  const [answer, setAnswer] = useState("");
  const [review, setReview] = useState(false);
  return <section className="debug-reflection" aria-label="Explain your repair"><h3>4. Explain why your repair works</h3><p>Passing visible cases is a useful check. Explaining the cause is a separate skill.</p>
    <label className="field">What went wrong, what did you change, and which input proves it?<textarea rows={4} maxLength={2000} value={answer} onChange={event => { setAnswer(event.target.value); setReview(false); }} /></label>
    <button className="button secondary" disabled={!answer.trim()} onClick={() => setReview(true)}>Review my explanation</button>
    {review && <div role="status"><p>This is a self-review, not an AI grade. Compare your explanation with these questions:</p><ul>{exercise.review.map(question => <li key={question}>{question}</li>)}</ul></div>}
    <small>Your explanation stays in this tab and clears when you leave or reload. It is not sent to a model.</small>
  </section>;
}
