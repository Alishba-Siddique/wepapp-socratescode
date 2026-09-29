"use client";
import { useEffect, useState } from "react";
import { maxPersonalTests, parsePersonalTests, parseTestValue, type PersonalTest } from "@/lib/personal-tests";

export function PersonalTests({ slug, busy, onRun, onChange }: { slug: string; busy: boolean; onRun: (tests: PersonalTest[]) => void; onChange: () => void }) {
  const key = `socratescode:personal-tests:v1:${slug}`;
  const [store, setStore] = useState<{ cases: PersonalTest[]; ready: boolean; status: string }>({ cases: [], ready: false, status: "Loading your test cases…" });
  const [name, setName] = useState(""); const [input, setInput] = useState(""); const [expected, setExpected] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  useEffect(() => {
    let cases: PersonalTest[] = []; let status = "Add a case to start your own regression suite.";
    try { cases = parsePersonalTests(localStorage.getItem(key)); }
    catch { status = "Browser storage is unavailable. Your cases will stay in this tab until you leave."; }
    // Load external browser data after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStore({ cases, ready: true, status });
  }, [key]);
  function persist(cases: PersonalTest[]) {
    let status = "Your test cases are saved in this browser.";
    try { localStorage.setItem(key, JSON.stringify({ version: 1, cases })); }
    catch { status = "Could not save. Your test cases remain usable in this tab until you leave."; }
    setStore({ cases, ready: true, status }); onChange();
  }
  function reset() { setName(""); setInput(""); setExpected(""); setEditing(null); }
  function save(event: React.FormEvent) {
    event.preventDefault();
    if (busy || !store.ready) return;
    try {
      if (!name.trim()) throw new Error("Give your case a short name describing what it checks.");
      if (editing === null && store.cases.length >= maxPersonalTests) throw new Error("Keep up to six focused cases. Edit or remove an existing case first.");
      let parsedInput, parsedExpected;
      try { parsedInput = parseTestValue(input); } catch { throw new Error("Input must be small, valid JSON with finite numbers (up to 1,500 characters). Use [] for an empty list."); }
      try { parsedExpected = parseTestValue(expected); } catch { throw new Error("Expected result must be small, valid JSON with finite numbers. Write null for Python None, and quote strings."); }
      const entry = { name: name.trim(), input: parsedInput, expected: parsedExpected };
      persist(editing === null ? [...store.cases, entry] : store.cases.map((item, index) => index === editing ? entry : item)); reset();
    } catch (error) { setStore(value => ({ ...value, status: error instanceof Error ? error.message : "Check this test case." })); }
  }
  return <section className="personal-tests" aria-label="My regression tests"><details><summary>Build my own test cases</summary><p>Before running, work out the expected result yourself. Try an empty input, a boundary, and a case that broke an earlier version. A mismatch can mean a code bug or an incorrect expectation.</p>
    <details><summary>What makes a useful test?</summary><ol><li><strong>Arrange:</strong> choose a small input allowed by the problem.</li><li><strong>Predict:</strong> calculate the expected result from the rule, not from your code.</li><li><strong>Check:</strong> run it, compare the results, and investigate a mismatch.</li><li><strong>Keep:</strong> save the case so it catches the same mistake after another change.</li></ol><p>For a sum rule, [2, 3] should produce 5. A test with one item alone may miss code that remembers only the last item. Follow this problem&apos;s constraints; these checks do not validate whether your inputs belong to its domain.</p></details>
    {store.ready && <><form onSubmit={save}><fieldset disabled={busy}><legend>{editing === null ? "Design a test" : `Edit case ${editing + 1}`}</legend><label className="field">Case name<input maxLength={60} value={name} onChange={event => setName(event.target.value)} placeholder="For example: empty input" /></label><div className="test-case-fields"><label className="field">Test input (JSON)<textarea rows={3} maxLength={1500} value={input} onChange={event => setInput(event.target.value)} /></label><label className="field">Expected result (JSON)<textarea rows={3} maxLength={1500} value={expected} onChange={event => setExpected(event.target.value)} /></label></div><button className="button secondary" type="submit">{editing === null ? "Add test case" : "Update test case"}</button>{editing !== null && <button className="text-button" type="button" onClick={reset}>Cancel edit</button>}</fieldset></form>
    <ol className="personal-case-list">{store.cases.map((item, index) => <li key={index}><strong>{item.name}</strong><pre>{JSON.stringify(item.input)}{" → "}{JSON.stringify(item.expected)}</pre><div><button type="button" className="text-button" disabled={busy} aria-label={`Edit test ${index + 1}: ${item.name}`} onClick={() => { setEditing(index); setName(item.name); setInput(JSON.stringify(item.input)); setExpected(JSON.stringify(item.expected)); }}>Edit</button><button type="button" className="text-button" disabled={busy} aria-label={`Remove test ${index + 1}: ${item.name}`} onClick={() => { persist(store.cases.filter((_, i) => i !== index)); reset(); }}>Remove</button></div></li>)}</ol>
    <button className="button primary" type="button" disabled={busy || !store.cases.length || editing !== null} onClick={() => onRun(store.cases)}>Run my tests</button><p>{store.cases.length} / {maxPersonalTests} saved cases. Saved cases run; an unfinished form does not.</p></>}
    <p role="status">{store.status}</p><small>Local practice only. Cases are shared by this browser&apos;s users, saved per problem, and do not count as passing the platform&apos;s checks.</small></details></section>;
}
