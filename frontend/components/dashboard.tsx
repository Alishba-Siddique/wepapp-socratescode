"use client";
import { useAccount } from "./account-provider";
import Link from "next/link";
import { useState } from "react";
import { puzzles, stages } from "@/lib/puzzles";
import { useProgress } from "@/lib/progress";
export function Dashboard({
  view = "overview",
}: {
  view?: "overview" | "curriculum" | "progress";
}) {
  const progress = useProgress();
  const { user } = useAccount();
  const [query, setQuery] = useState("");
  const completed = puzzles.filter((p) => progress[p.slug]?.completed);
  const active =
    puzzles
      .filter((p) => progress[p.slug] && !progress[p.slug].completed)
      .sort(
        (a, b) => progress[b.slug].updatedAt - progress[a.slug].updatedAt,
      )[0] ||
    puzzles.find((p) => !progress[p.slug]?.completed) ||
    puzzles[0];
  const filtered = puzzles.filter((p) =>
    (p.title + p.topic).toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="dashboard page-enter">
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            {view === "overview"
              ? "ONE QUESTION AT A TIME"
              : "BUILD YOUR FOUNDATIONS"}
          </p>
          <h1>
            {view === "overview" ? (
              <>
                A little practice.
                <br />
                <em>A clearer mind.</em>
              </>
            ) : view === "curriculum" ? (
              "Your learning path."
            ) : (
              "Your progress, earned."
            )}
          </h1>
          <p>
            {view === "overview"
              ? "Build the habit of understanding before you run."
              : view === "curriculum"
                ? "Small guided labs. Five ways to think through each one."
                : user ? "Your saved reasoning and the work open in this account session." : "A record of the reasoning you have practiced in this browser."}
          </p>
        </div>
        <div className="session-tag">
          <span>PRIMM</span>
          <small>
            Predict. Run. Investigate.
            <br />
            Modify. Make.
          </small>
        </div>
      </div>
      {view === "curriculum" && <section className="product-context"><p className="eyebrow">START FROM ZERO. BUILD INDEPENDENCE.</p><h2>Your next step, not a wall of topics.</h2><ol><li><Link prefetch={false} href="/learn/a-running-total">Learn to follow a small program</Link> — predict and trace our guided labs below.</li><li><Link prefetch={false} href="/practice">Write your own Python</Link> — start with totals, conditions and strings.</li><li><Link prefetch={false} href="/patterns">Recognize patterns with Socrates</Link> — explain why an approach fits and where products use it.</li><li><Link prefetch={false} href="/design/learning-schema">Model data and protect it</Link> — work from entities to constraints and concurrent updates.</li><li><Link prefetch={false} href="/design">Discuss systems and architecture</Link> — defend assumptions, failures and tradeoffs.</li></ol><p>Senior-level growth also needs building, operating and improving real projects. Deeper projects, debugging interviews and evaluated mock interviews are future curriculum; finishing these introductory exercises is not a senior-readiness certification.</p></section>}
      <div className="metrics">
        <div>
          <span>
            {completed.length}
            <small> / {puzzles.length}</small>
          </span>
          <p>Labs completed</p>
        </div>
        <div>
          <span>
            {
              puzzles.filter(
                (p) => progress[p.slug] && !progress[p.slug].completed,
              ).length
            }
          </span>
          <p>In progress</p>
        </div>
        <div>
          <span>
            {puzzles.reduce(
              (sum, p) => sum + (progress[p.slug]?.hints || 0),
              0,
            )}
          </span>
          <p>Guiding questions used</p>
        </div>
      </div>
      {view === "overview" && (
        <section className="continue-card">
          <div>
            <span className="eyebrow">
              {progress[active.slug]
                ? "PICK UP YOUR THREAD"
                : completed.length ? "YOUR NEXT SMALL BREAKTHROUGH" : "YOUR FIRST SMALL BREAKTHROUGH"}
            </span>
            <h2>{active.title}</h2>
            <p>{active.summary}</p>
            <div className="tags">
              <span>{active.topic}</span>
              <span>{active.minutes} min guide</span>
              <span>Python</span>
            </div>
            <Link prefetch={false} className="button primary" href={"/learn/" + active.slug}>
              {progress[active.slug]?.completed ? "Review this lab" : progress[active.slug]
                ? "Continue learning"
                : completed.length ? "Start your next lab" : "Start your first lab"}{" "}
              <span aria-hidden="true">&#8599;</span>
            </Link>
          </div>
          <div className="continue-visual" aria-hidden="true">
            <span>QUESTION / REASON / UNDERSTAND</span>
            <div className="number-chain">
              <i>{active.mode === "product" ? 1 : 0}</i>
              <b>{active.mode === "product" ? "×" : active.mode === "even" ? "→" : "+"}</b>
              <i>1</i>
              <b>{active.mode === "product" ? "×" : active.mode === "even" ? "→" : "+"}</b>
              <i>2</i>
              <b>{active.mode === "product" ? "×" : active.mode === "even" ? "→" : "+"}</b>
              <i>3</i>
            </div>
            <p>The answer is only the beginning.</p>
            <code>What changes on the next line?</code>
          </div>
        </section>
      )}
      {view === "progress" && completed.length === 0 ? (
        <section className="empty-state">
          <span className="empty-symbol">?</span>
          <h2>Your first insight belongs here.</h2>
          <p>Complete a guided lab to see your progress and reflection.</p>
          <Link prefetch={false} href={"/learn/" + active.slug} className="button primary">
            Start a lab
          </Link>
        </section>
      ) : (
        <section className="catalog">
          <div className="section-heading">
            <h2>
              {view === "progress"
                ? "Completed labs"
                : "Explore the foundations"}
            </h2>
            {view !== "progress" && (
              <label className="search-label">
                <span className="sr-only">Find a lab</span>
                <input
                  type="search"
                  placeholder="Find a lab"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
            )}
          </div>
          <div className="lab-grid">
            {(view === "progress" ? completed : filtered).map((p, index) => (
              <Link prefetch={false} href={"/learn/" + p.slug} className="lab-card" key={p.slug}>
                <div className="lab-card-top">
                  <span>0{index + 1} / FOUNDATION</span>
                  <span aria-hidden="true">&#8599;</span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
                <div className="lab-card-footer">
                  <span>{p.topic}</span>
                  <span>
                    {progress[p.slug]?.completed
                      ? "Completed"
                      : progress[p.slug]
                        ? stages[progress[p.slug].stage]
                        : p.minutes + " min"}
                  </span>
                </div>
                {view === "progress" && (
                  <blockquote>{progress[p.slug].reflection}</blockquote>
                )}
              </Link>
            ))}
          </div>
          {view !== "progress" && filtered.length === 0 && (
            <p className="empty-search">
              No labs match that search. Try loops or product.
            </p>
          )}
        </section>
      )}
      <p className="storage-note">
        {user ? "Account work loads from your saved progress. Use Save to account inside each lab before leaving." : "Guest progress stays in this browser. Sign in to save labs across devices."}
      </p>
    </div>
  );
}
