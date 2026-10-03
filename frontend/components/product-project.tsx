"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CodingWorkspace } from "./coding-workspace";
import { emptyProjectDraft, inboxProblem, inboxTrace, parseProjectDraft, projectMarkdown, type ProjectDraft } from "@/lib/product-project";

const storageKey="socratescode:project:notification-inbox:v1";
export function ProductProject() {
  const [draft,setDraft]=useState(emptyProjectDraft);
  const [ready,setReady]=useState(false);
  const [status,setStatus]=useState("Loading your project notes…");
  const [choice,setChoice]=useState(""); const [feedback,setFeedback]=useState("");
  const [frame,setFrame]=useState(0); const [passed,setPassed]=useState(false);
  useEffect(()=>{
    let saved=emptyProjectDraft(); let message="Notes save in this browser. No account sync.";
    try {saved=parseProjectDraft(localStorage.getItem(storageKey));} catch {message="Browser storage is unavailable. Notes remain in this tab until you leave.";}
    // Hydrate the browser-owned draft after the server render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(saved); setReady(true); setStatus(message);
  },[]);
  function save(next:ProjectDraft) {
    setDraft(next);
    try {localStorage.setItem(storageKey,JSON.stringify(next));setStatus("Project notes saved in this browser.");}
    catch {setStatus("Could not save. Your notes remain in this tab; export before leaving.");}
  }
  function checkBrief() {
    if(choice==="id") {save({...draft,briefAccepted:true});setFeedback("Yes. Identity is the ID; equal messages can belong to different notifications.");}
    else setFeedback(choice==="message"?"Two different notifications can have the same words. Which field identifies the delivery?":"A retry can arrive later. Arrival time alone does not tell you whether you have seen its ID.");
  }
  function exportNotes() {
    const url=URL.createObjectURL(new Blob([projectMarkdown(draft)],{type:"text/markdown;charset=utf-8"}));
    const link=document.createElement("a");link.href=url;link.download="notification-inbox-engineering-notes.md";document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  const traced=draft.traceSeen===inboxTrace.length-1;
  return <div className="dashboard product-project page-enter"><div className="page-heading"><div><p className="eyebrow">FROM AN ALGORITHM TO A PRODUCT.</p><h1>Build something.<br/><em>Explain every decision.</em></h1><p>Project 01 · A notification inbox that handles repeated deliveries. Define its behavior, trace a tiny example, write Python, then review the engineering tradeoffs.</p></div></div>
    <p className="beginner-return">New to loops and lists? <Link href="/start">Start from zero</Link>. Not sure how to investigate a failure? <Link href="/debugging">Learn debugging</Link>.</p>
    <article className="beginner-lesson"><p className="eyebrow">01 / DEFINE THE BEHAVIOR</p><h2>One notification. Even after a retry.</h2><p>Imagine a build-status inbox. A sender retries a delivery because it did not receive an acknowledgement. For this project, repeated IDs describe the same notification. Keep the first message for an ID and preserve the order in which distinct IDs first arrive.</p><p><strong>Vocabulary:</strong> an ID is a name for one notification. A retry sends it again. A membership check asks whether an ID is already in a collection. The unread count measures notifications, not delivery attempts.</p>
    <div className="beginner-question"><fieldset disabled={!ready || draft.briefAccepted}><legend>Two deliveries say “Build finished”. What tells you whether they are the same notification?</legend>{[["message","The message text"],["id","The notification ID"],["time","Which one arrived later"]].map(([value,label])=><label key={value}><input type="radio" name="inbox-identity" value={value} checked={choice===value} onChange={()=>setChoice(value)}/>{label}</label>)}</fieldset><button className="button secondary" disabled={!ready || !choice || draft.briefAccepted} onClick={checkBrief}>Check the requirement</button><p role="status">{feedback || (draft.briefAccepted?"Requirement understood: compare IDs, not message text.":"Choose an answer before moving to the trace.")}</p></div></article>
    {draft.briefAccepted && <article className="beginner-lesson project-milestone"><p className="eyebrow">02 / PREDICT AND INVESTIGATE</p><h2>Follow three deliveries.</h2><p>The read list is <code>{'["b"]'}</code>. Before each next delivery, predict the IDs and unread count. This is an authored trace, not your program running.</p><div className="beginner-trace" aria-live="polite"><strong>{inboxTrace[frame].event}</strong><p>Inbox IDs: {JSON.stringify(inboxTrace[frame].ids)} · Unread: {inboxTrace[frame].unread}</p><p>{inboxTrace[frame].explanation}</p></div><div className="project-actions"><button className="button secondary" disabled={frame===0} onClick={()=>setFrame(frame-1)}>Previous delivery</button><button className="button primary" disabled={frame===inboxTrace.length-1} onClick={()=>{const next=frame+1;setFrame(next);save({...draft,traceSeen:Math.max(draft.traceSeen,next)});}}>Next delivery</button></div><label className="field">My implementation plan<textarea rows={4} maxLength={1500} value={draft.plan} onChange={event=>save({...draft,plan:event.target.value})} placeholder="What will I remember? What should be true after every delivery?"/></label><p>Python toolbox: a list preserves a sequence; a set can track membership; a dictionary maps a key to a value. Decide which jobs your collections need to do before writing code.</p></article>}
    {traced && <section className="project-milestone" aria-label="Implement the inbox"><p className="eyebrow">03 / IMPLEMENT AND CHALLENGE</p><p>Implement the contract below. Try the visible checks, then design a personal case that could expose a different mistake. Passing examples are evidence, not proof for every input.</p><CodingWorkspace problem={inboxProblem} onChecksChanged={setPassed}/></section>}
    {traced && <article className="beginner-lesson project-milestone" aria-label="Engineering review"><p className="eyebrow">04 / REVIEW THE DESIGN</p><h2>{passed?"Your examples pass. What remains?":"Pass the platform checks to review this version."}</h2>{passed?<><p>Compare the work required to search a growing list with checking membership in a set. What extra memory would you use? Explain why retaining the first event preserves the contract.</p><label className="field">My engineering review<textarea rows={5} maxLength={1500} value={draft.review} onChange={event=>save({...draft,review:event.target.value})} placeholder="My invariant, the case that challenged it, the cost, and what a real service would need…"/></label><details><summary>Questions an engineering reviewer would ask</summary><ul><li>Did you test repeated IDs, equal messages with different IDs, empty deliveries and unknown read IDs?</li><li>Could a second invocation or service restart forget the IDs you saw? Where would durable state belong?</li><li>Could two workers accept the same ID at once? How could an atomic uniqueness rule help?</li><li>What should happen if a retry has different content? Our first-arrival policy is a product choice, not a universal rule.</li><li>How would you separate users so one user cannot read another user&apos;s inbox?</li></ul></details><p>For the real messaging problem behind this exercise, read the <a href="https://www.rabbitmq.com/docs/reliability" target="_blank" rel="noopener noreferrer">RabbitMQ reliability guide (opens in a new tab)</a>. Our inbox scenario is an illustrative design, not RabbitMQ integration.</p><p>This review is authored self-assessment. The exercise has no durable database, concurrent workers, network delivery or access-control implementation.</p></>:<p>Use <strong>Run all checks</strong> in the project editor. Personal tests alone do not unlock this review. Editing code or reloading requires a new passing run.</p>}</article>}
    <div className="project-actions project-milestone"><button className="button secondary" disabled={!ready} onClick={exportNotes}>Export project notes</button><Link className="button secondary" href="/patterns">Explore pattern lessons</Link></div><p role="status" className="project-storage">{status}</p><small>Local learning notes are shared by this browser&apos;s users. Avoid secrets. Later tabs can overwrite earlier saves.</small>
  </div>;
}
