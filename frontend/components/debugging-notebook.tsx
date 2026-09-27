"use client";
import { useEffect, useState } from "react";
import { emptyDebugNotebook, notebookFields, notebookMarkdown, parseDebugNotebook } from "@/lib/debugging-method";

export function DebuggingNotebook({ slug, title }: { slug: string; title: string }) {
  const key = `socratescode:debug-notebook:v1:${slug}`;
  const [state, setState] = useState({ notes: emptyDebugNotebook(), ready: false, status: "Loading your notebook…" });
  useEffect(() => {
    let notes = emptyDebugNotebook();
    let status = "Notes loaded. Save changes to keep them in this browser.";
    try { notes = parseDebugNotebook(localStorage.getItem(key)); }
    catch { status = "Browser storage is unavailable. You can write here and export your notes before leaving."; }
    // Restore an external browser notebook after hydration; never store credentials.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ notes, ready: true, status });
  }, [key]);
  function save() {
    let status = "Notebook saved on this browser.";
    try { localStorage.setItem(key, JSON.stringify({ version: 1, notes: state.notes })); }
    catch { status = "Could not save in this browser. Your notes remain in this tab; export them before leaving."; }
    setState(value => ({ ...value, status }));
  }
  function download() {
    const url = URL.createObjectURL(new Blob([notebookMarkdown(title, state.notes)], { type: "text/markdown;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${slug}-debugging-notebook.md`; document.body.appendChild(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <section className="debug-notebook" aria-label="Debugging notebook"><details><summary>My debugging notebook</summary><p>Think like an investigator: separate evidence from guesses. Save deliberately, or export these notes to your Obsidian vault. Notes are shared by users of this browser; do not include secrets or private customer data.</p>
    {state.ready && <><div className="notebook-fields">{notebookFields.map(field => <label className="field" key={field.key}>{field.label}<small>{field.prompt}</small><textarea rows={3} maxLength={1000} value={state.notes[field.key]} onChange={event => setState(value => ({ ...value, notes: { ...value.notes, [field.key]: event.target.value }, status: "Unsaved changes. Save or export before leaving this page." }))} /></label>)}</div><div className="method-actions"><button className="button secondary" onClick={save}>Save notebook</button><button className="button secondary" onClick={download}>Export debugging notes</button></div></>}
    <p role="status">{state.status}</p><small>Notes are not graded or sent to a model. No account synchronization.</small></details></section>;
}
