"use client";
import Link from "next/link";
import { useState } from "react";
import { filterPractice, practiceProblems } from "@/lib/practice";
import { codingProblems } from "@/lib/coding-problems";
const topics = [...new Set(practiceProblems.map(p => p.topic))].sort();
export function PracticeBank() {
  const [view,setView] = useState("Solve here");
  const [query, setQuery] = useState(""); const [source, setSource] = useState("All sources"); const [topic, setTopic] = useState("All topics");
  const visible = filterPractice(query, source, topic);
  function reset() { setQuery(""); setSource("All sources"); setTopic("All topics"); }
  return <div className="dashboard page-enter practice-bank">
    <div className="page-heading"><div><p className="eyebrow">A QUESTION BEFORE EVERY SOLUTION.</p><h1>Practice with <em>intention.</em></h1><p>{codingProblems.length} coding problems to solve right here. Read, write Python, run checks, and work toward understanding.</p></div></div>
    <div className="pattern-intro"><p>Build confidence in our nine guided labs, then explore a wider challenge. Each practice reference starts with a Socratic question.</p><Link prefetch={false} href="/curriculum">Start with a guided lab →</Link></div>
    <div className="pattern-filters" role="group" aria-label="Practice mode">{["Solve here","Reference library"].map(item=><button key={item} aria-pressed={view===item} onClick={()=>setView(item)}>{item}</button>)}</div>
    {view==="Solve here"?<><label className="field native-search">Find a coding problem<input type="search" placeholder="Try conditions, strings, or graphs" value={query} onChange={e=>setQuery(e.target.value)}/></label><div className="native-problems">{codingProblems.filter(p=>`${p.title} ${p.topic} ${p.description}`.toLowerCase().includes(query.toLowerCase().trim())).map(p=><Link prefetch={false} className="native-problem" href={`/solve/${p.slug}`} key={p.slug}><span>{p.level} / {p.topic}</span><h2>{p.title}</h2><p>{p.description.slice(0,160)}{p.description.length>160?"…":""}</p><strong>Solve with Python →</strong></Link>)}</div>{!codingProblems.some(p=>`${p.title} ${p.topic} ${p.description}`.toLowerCase().includes(query.toLowerCase().trim()))&&<div className="pattern-empty"><p>No coding problems match that search.</p><button onClick={()=>setQuery("")}>Clear search</button></div>}</>:<>
    <div className="practice-tools"><label className="field">Search problems<input type="search" placeholder="Try prefix, cycles, or coins" value={query} onChange={e => setQuery(e.target.value)} /></label><label className="field">Problem source<select value={source} onChange={e => setSource(e.target.value)}>{["All sources", "CSES", "LeetCode"].map(s => <option key={s}>{s}</option>)}</select></label><label className="field">Problem topic<select value={topic} onChange={e => setTopic(e.target.value)}>{["All topics", ...topics].map(t => <option key={t}>{t}</option>)}</select></label></div>
    <p role="status" className="pattern-count">{visible.length} of {practiceProblems.length} problems</p>
    <div className="practice-list">{visible.map((p, index) => <article className="practice-card" key={p.id}>
      <span className="practice-number">{String(index + 1).padStart(2, "0")}</span><div><div className="pattern-meta"><span>{p.topic}</span><span>{p.source}</span></div><h2>{p.title}</h2><p className="practice-question">{p.question}</p><details><summary>Before you start</summary><p>{p.focus}</p><p>Write down your invariant, a small counterexample, and the time and space cost you expect. The original source provides the full statement and constraints.</p></details></div><a className="button secondary" href={p.url} target="_blank" rel="noopener noreferrer">Open problem ↗<span className="sr-only">: {p.title} on {p.source} (opens in a new tab)</span></a>
    </article>)}</div>
    {!visible.length && <div className="pattern-empty"><h2>No problems match these filters.</h2><p>Try a broader topic or another keyword.</p><button onClick={reset}>Clear filters</button></div>}
    <footer className="pattern-sources"><p>These reference titles link to their publishers; statements and solutions are not copied into this reference list. Choose Solve here for problems with a built-in editor. External submissions do not count as completed socratescode labs.</p><p>CSES references reviewed September 14, 2026. Difficulty varies by background; we do not invent publisher difficulty labels.</p></footer></>}
  </div>;
}
