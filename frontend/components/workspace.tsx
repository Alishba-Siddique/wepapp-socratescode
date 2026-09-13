"use client";
import Link from "next/link";
import { useState } from "react";
import {
  answer,
  integer,
  source,
  stages,
  trace,
  type Puzzle,
} from "@/lib/puzzles";
import { emptyProgress, saveProgress, useProgress } from "@/lib/progress";

export function Workspace({ puzzle }: { puzzle: Puzzle }) {
  const all = useProgress();
  const progress = all[puzzle.slug] || emptyProgress;
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [hint, setHint] = useState(false);
  const stage = selected ?? progress.stage;
  const frames = trace(puzzle);
  const index = Math.min(progress.traceIndex, frames.length - 1);
  const frame = frames[index];
  const lines = source(
    puzzle,
    stage === 3
      ? progress.modifiedLimit
      : stage === 4
        ? progress.makeLimit
        : puzzle.limit,
  );
  const update = (change: Parameters<typeof saveProgress>[1]) =>
    saveProgress(puzzle.slug, change);
  const advance = (next: number) => {
    update({ stage: Math.max(progress.stage, next) });
    setSelected(next);
    setFeedback("");
    setHint(false);
  };
  const next = () => {
    if (stage === 0) {
      if (integer(progress.prediction) === null) {
        setFeedback(
          "Enter a whole-number prediction first. It is okay to be uncertain.",
        );
        return;
      }
      advance(1);
    } else if (stage === 1) {
      if (index < frames.length - 1) return;
      advance(2);
    } else if (stage === 2) {
      if (progress.choice !== puzzle.correct) {
        setFeedback(puzzle.hint);
        return;
      }
      advance(3);
    } else if (stage === 3) {
      if (progress.modifiedLimit === puzzle.limit) {
        setFeedback(
          "Choose a different upper bound so you can explore a change.",
        );
        return;
      }
      if (
        integer(progress.modifiedPrediction) !==
        answer(puzzle, progress.modifiedLimit)
      ) {
        setFeedback(
          "Follow each pass with the new upper bound. Which values change total?",
        );
        return;
      }
      advance(4);
    } else {
      if (answer(puzzle, progress.makeLimit) !== puzzle.target) {
        setFeedback(
          "Trace the loop with this bound. Does it reach the target, or stop too soon?",
        );
        return;
      }
      if (progress.reflection.trim().length < 12) {
        setFeedback(
          "Write a short reflection about how you reached the target.",
        );
        return;
      }
      update({
        completed: true,
        reflection: progress.reflection.trim(),
        stage: 4,
      });
      setFeedback(
        "Lab completed. Your reflection has been saved in this browser.",
      );
    }
  };
  const titles = [
    "Think before you run.",
    "Make every step visible.",
    "Find the reason behind it.",
    "Change one thing.",
    "Make the idea your own.",
  ];
  const instructions = [
    "Read the code and predict the printed value of total. You can learn from any prediction.",
    "Walk through the loop. Notice the value that carries into the next iteration.",
    "Use the trace to explain one important detail about this loop.",
    "Choose a new upper bound and predict how it changes the printed result.",
    "Choose an upper bound that produces the target, then explain your reasoning.",
  ];
  return (
    <div className="workspace page-enter">
      <div className="lesson-top">
        <Link prefetch={false} href="/curriculum">Back to learning path</Link>
        <span>
          {puzzle.topic} <i /> GUIDED PYTHON LAB
        </span>
      </div>
      <div className="lesson-heading">
        <div>
          <p className="eyebrow">FOUNDATIONS / PRIMM</p>
          <h1>{puzzle.title}</h1>
        </div>
        <span className="lesson-status">
          {progress.completed
            ? "Completed"
            : "Stage " + (stage + 1) + " of 5"}
        </span>
      </div>
      <nav className="stage-navigation" aria-label="Learning stages">
        {stages.map((name, n) => (
          <button
            type="button"
            key={name}
            disabled={n > progress.stage}
            aria-current={stage === n ? "step" : undefined}
            onClick={() => {
              setSelected(n);
              setFeedback("");
              setHint(false);
            }}
          >
            <span>{n < progress.stage ? "Done" : "0" + (n + 1)}</span>
            {name}
            <small>
              {n > progress.stage
                ? "Locked"
                : stage === n
                  ? "Current"
                  : "Review"}
            </small>
          </button>
        ))}
      </nav>
      <div className="learning-columns">
        <section className="code-pane" aria-label="Code and trace">
          <div className="pane-top">
            <span>the_question.py</span>
            <span>PYTHON</span>
          </div>
          <pre className="lesson-code">
            <code>
              {lines.map((line, n) => (
                <span
                  key={n}
                  className={
                    stage === 1 && n === frame.line ? "active-line" : ""
                  }
                >
                  <i aria-hidden="true">{n + 1}</i>
                  {line}
                </span>
              ))}
            </code>
          </pre>
          <div className="code-footnote">
            Guided example / Bound: 1 to{" "}
            {stage === 3
              ? progress.modifiedLimit
              : stage === 4
                ? progress.makeLimit
                : puzzle.limit}
            , inclusive
          </div>
          {stage === 1 && (
            <div className="trace-panel">
              <div className="section-heading">
                <h2>State, made visible</h2>
                <span>
                  {index} / {frames.length - 1} steps
                </span>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Step</th>
                      <th>number</th>
                      <th>total before</th>
                      <th>total after</th>
                    </tr>
                  </thead>
                  <tbody>
                    {frames.slice(0, index + 1).map((row, n) => (
                      <tr key={n} className={n === index ? "current-row" : ""}>
                        <td>{n}</td>
                        <td>{row.number ?? "-"}</td>
                        <td>{row.before}</td>
                        <td>{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="trace-note" aria-live="polite">
                {frame.note}
              </p>
              <div className="trace-controls">
                <button
                  className="button secondary"
                  disabled={index === 0}
                  onClick={() => update({ traceIndex: index - 1 })}
                >
                  Previous
                </button>
                <button
                  className="button primary"
                  disabled={index === frames.length - 1}
                  onClick={() => update({ traceIndex: index + 1 })}
                >
                  Next trace step
                </button>
              </div>
            </div>
          )}
          {stage !== 1 && (
            <div className="code-question">
              <span>THE QUESTION TO KEEP ASKING</span>
              <p>
                What changes here,
                <br />
                <em>and what stays the same?</em>
              </p>
              <small>Trace the state. Trust your reasoning.</small>
            </div>
          )}
        </section>
        <section className="activity-pane" aria-labelledby="activity-title">
          <p className="eyebrow">
            0{stage + 1} / {stages[stage].toUpperCase()}
          </p>
          <h2 id="activity-title">{titles[stage]}</h2>
          <p className="activity-intro">{instructions[stage]}</p>
          {stage === 0 && (
            <label className="field">
              What will total print?
              <input
                inputMode="numeric"
                type="text"
                maxLength={20}
                value={progress.prediction}
                onChange={(e) => {
                  update({ prediction: e.target.value });
                  setFeedback("");
                }}
                placeholder="Your prediction"
              />
              <small>Commit to an idea before looking at the trace.</small>
            </label>
          )}
          {stage === 1 && (
            <div className="prediction-summary">
              <span>Your prediction</span>
              <strong>{progress.prediction}</strong>
              {index === frames.length - 1 && (
                <p>
                  {integer(progress.prediction) === frame.total
                    ? "Your prediction matches the trace. Now investigate why."
                    : "The trace prints " +
                      frame.total +
                      ". Compare the changes with your prediction, then investigate."}
                </p>
              )}
            </div>
          )}
          {stage === 2 && (
            <fieldset className="choices">
              <legend>{puzzle.question}</legend>
              {puzzle.options.map((option, n) => (
                <label key={option}>
                  <input
                    type="radio"
                    name="reason"
                    checked={progress.choice === n}
                    onChange={() => {
                      update({ choice: n });
                      setFeedback("");
                    }}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </fieldset>
          )}
          {stage === 3 && (
            <div className="activity-fields">
              <label className="field">
                New inclusive upper bound
                <select
                  value={progress.modifiedLimit}
                  onChange={(e) => {
                    update({
                      modifiedLimit: Number(e.target.value),
                      modifiedPrediction: "",
                    });
                    setFeedback("");
                  }}
                >
                  {[2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Predict the new printed total
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={20}
                  value={progress.modifiedPrediction}
                  onChange={(e) => {
                    update({ modifiedPrediction: e.target.value });
                    setFeedback("");
                  }}
                  placeholder="Trace it before answering"
                />
              </label>
            </div>
          )}
          {stage === 4 && (
            <div className="activity-fields">
              <div className="target-value">
                <span>Your target output</span>
                <strong>{puzzle.target}</strong>
              </div>
              <label className="field">
                Choose the inclusive upper bound
                <select
                  value={progress.makeLimit}
                  onChange={(e) => {
                    update({ makeLimit: Number(e.target.value) });
                    setFeedback("");
                  }}
                >
                  {[2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                What helped you reach that target?
                <textarea
                  value={progress.reflection}
                  maxLength={600}
                  rows={4}
                  onChange={(e) => {
                    update({ reflection: e.target.value });
                    setFeedback("");
                  }}
                  placeholder="Explain what the loop accumulates and why this bound works."
                />
              </label>
            </div>
          )}
          <div className="feedback" role="status">
            {feedback}
          </div>
          {progress.completed && stage === 4 ? (
            <div className="completion-note">
              <h3>A small problem. A new insight.</h3>
              <p>
                You completed all five activities and recorded a reflection.
              </p>
              <Link prefetch={false} href="/progress" className="button primary">
                View my progress
              </Link>
            </div>
          ) : (
            <button
              className="button primary activity-next"
              onClick={next}
              disabled={stage === 1 && index < frames.length - 1}
            >
              {stage === 4
                ? "Complete this lab"
                : "Continue to " + stages[stage + 1]}{" "}
              <span aria-hidden="true">&#8594;</span>
            </button>
          )}
          <div className="tutor-note">
            <span className="tutor-symbol">?</span>
            <div>
              <h3>A question, not a shortcut.</h3>
              {hint ? (
                <p>
                  {stage === 0 || stage === 2
                    ? puzzle.hint
                    : "What value enters each pass, and what value leaves it?"}
                </p>
              ) : (
                <button
                  onClick={() => {
                    setHint(true);
                    update({ hints: progress.hints + 1 });
                  }}
                >
                  Ask a guiding question
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
      <p className="storage-note">
        This lab traces a bounded example. A general Python editor and live AI
        tutor are not connected yet.
      </p>
    </div>
  );
}
