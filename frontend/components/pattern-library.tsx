"use client";
import { useState } from "react";
import Link from "next/link";
import { patterns } from "@/lib/patterns";
import { getProductLesson } from "@/lib/product-lessons";

const groups = [
  "All patterns",
  "Sequences",
  "Trees & graphs",
  "Heaps",
  "Search & DP",
];
export function PatternLibrary() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState(groups[0]);
  const visible = patterns.filter(
    (p) =>
      (group === groups[0] || p.group === group) &&
      `${p.title} ${p.cue} ${p.question} ${getProductLesson(p.id)?.product} ${p.practice.map((item) => item.title).join(" ")}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <div className="dashboard page-enter pattern-library">
      <div className="page-heading">
        <div>
          <p className="eyebrow">RECOGNIZE. QUESTION. REASON.</p>
          <h1>
            Find the pattern.
            <br />
            <em>Understand the why.</em>
          </h1>
          <p>
            Learn to reason without a generated solution. Explore seventeen
            patterns with Socratic questions, worked traces, and real product applications.
          </p>
        </div>
      </div>
      <div className="pattern-intro">
        <p>
          New to tracing code? Build your foundations in our guided PRIMM labs
          first. Then predict a small example, investigate each decision, and
          explain why the pattern fits before you code it yourself.
        </p>
        <Link prefetch={false} href="/curriculum">
          Explore guided labs <span aria-hidden="true">→</span>
        </Link>
      </div>
      <p><Link prefetch={false} href="/practice">Browse the searchable practice bank →</Link></p>
      <div className="pattern-tools">
        <label>
          Find a pattern
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try median, sorted, or prerequisites"
          />
        </label>
        <div
          className="pattern-filters"
          role="group"
          aria-label="Pattern family"
        >
          {groups.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={item === group}
              onClick={() => setGroup(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <p className="pattern-count" role="status">
        {visible.length} of {patterns.length} patterns
      </p>
      <div className="pattern-grid">
        {visible.map((p) => (
          <article className="pattern-card" key={p.id} id={p.id}>
            <div className="pattern-meta">
              <span>{String(patterns.indexOf(p) + 1).padStart(2, "0")}</span>
              <span>{p.group}</span>
            </div>
            <h2>{p.title}</h2>
            <p>{p.cue}</p>
            <div className="pattern-product"><span>WHERE THIS IS USED</span><p>{getProductLesson(p.id)?.product}</p><small>{getProductLesson(p.id)?.evidence}</small></div>
            <Link className="button primary" prefetch={false} href={`/patterns/${p.id}`}>Learn with Socrates<span className="sr-only">: {p.title}</span> →</Link>
            <div className="pattern-question">
              <span>ASK YOURSELF</span>
              <h3>{p.question}</h3>
            </div>
            <details>
              <summary>A question to go deeper</summary>
              <p>{p.guidance}</p>
              <p className="pattern-caution">
                <strong>Check the assumption.</strong> {p.caution}
              </p>
            </details>
            <div className="pattern-practice">
              <span>PRACTICE ON LEETCODE</span>
              {p.practice.map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.title}
                  <span className="sr-only"> (opens in a new tab)</span>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
      {visible.length === 0 && (
        <div className="pattern-empty">
          <h2>No patterns match yet.</h2>
          <p>Try a different keyword or return to the full library.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setGroup(groups[0]);
            }}
          >
            Clear filters
          </button>
        </div>
      )}
      <footer className="pattern-sources">
        <p>
          Original socratescode questions, organized from the supplied
          interview-pattern notes. Explore the{" "}
          <a
            href="https://github.com/monarchmaisuriya/pareto-problem-set"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pareto Problem Set (opens in a new tab)
          </a>{" "}
          for another practice reference.
        </p>
        <p>
          External exercises run on LeetCode and may require an account. Reading
          a note does not mark a guided lab complete.
        </p>
      </footer>
    </div>
  );
}
