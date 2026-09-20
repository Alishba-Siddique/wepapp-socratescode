"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { starterCode, type CodingProblem, type JsonValue } from "@/lib/coding-problems";
const CodeEditor = dynamic(() => import("./code-editor"), { ssr:false, loading:() => <p className="editor-loading">Loading the editor…</p> });
type Result = { value?: JsonValue; error?: string };
function equal(a: JsonValue | undefined, b: JsonValue): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((item,index) => equal(item,b[index]));
  if (a && b && typeof a === "object" && typeof b === "object" && !Array.isArray(a) && !Array.isArray(b)) return Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(key => equal(a[key],b[key]));
  return false;
}
export function CodingWorkspace({ problem }: { problem: CodingProblem }) {
  const [code,setCode] = useState(starterCode); const [simple,setSimple] = useState(false);
  const [phase,setPhase] = useState<"idle"|"loading"|"running">("idle");
  const [message,setMessage] = useState(""); const [output,setOutput] = useState("");
  const [results,setResults] = useState<Result[]>([]); const [checkedCode,setCheckedCode] = useState("");
  const [hints,setHints] = useState(0); const [custom,setCustom] = useState(JSON.stringify(problem.tests[0].input));
  const [customRun,setCustomRun] = useState(false); const [saved,setSaved] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const key = `socratescode:code:v1:${problem.slug}`;
  useEffect(() => {
    try { const draft=localStorage.getItem(key); if(draft && draft.length<=20000) {
      // Restore an external browser draft; no authentication data is stored here.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCode(draft);
    } } catch {}
    return () => stopRef.current?.();
  },[key]);
  function update(value: string) {
    setCode(value);
    try { localStorage.setItem(key,value); setSaved("Draft saved on this browser"); } catch { setSaved("Draft is open in this tab; browser storage is unavailable"); }
  }
  function run(allTests: boolean) {
    if(phase!=="idle")return;
    let inputs: JsonValue[];
    if(allTests)inputs=problem.tests.map(test=>test.input);
    else { try { if(custom.length>5000)throw new Error(); inputs=[JSON.parse(custom)]; } catch { setMessage("Enter valid JSON for the custom input (up to 5,000 characters)."); return; } }
    setCustomRun(!allTests); setResults([]); setOutput(""); setMessage("Loading Python. The first run downloads the local runtime."); setPhase("loading");
    const iframe=document.createElement("iframe"); iframe.title="Isolated Python execution"; iframe.hidden=true; iframe.setAttribute("sandbox","allow-scripts"); iframe.src="/runner";
    const id=crypto.randomUUID(); let started=false; let ready=false;
    function cleanup() {
      window.removeEventListener("message",receive);if(timer.current)clearTimeout(timer.current);stopRef.current=null;
      // Terminate the worker before removing its owner frame. Removing a frame
      // alone does not reliably stop an actively running worker in every engine.
      const finish=()=>{clearTimeout(shutdown);window.removeEventListener("message",stopped);iframe.remove();};
      const stopped=(event:MessageEvent)=>{if(event.source===iframe.contentWindow&&event.data?.type==="stopped"&&event.data.id===id)finish();};
      const shutdown=setTimeout(finish,1000);
      window.addEventListener("message",stopped);
      iframe.contentWindow?.postMessage({type:"stop",id},"*");
    }
    function timeout(seconds:number, text:string) {if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>{cleanup();setPhase("idle");setMessage(text);},seconds*1000);}
    function receive(event:MessageEvent) {
      if(event.source!==iframe.contentWindow || event.origin!=="null" || !event.data || typeof event.data!=="object")return;
      const data=event.data;
      if(data.type==="runner-ready" && !ready) { ready=true; iframe.contentWindow?.postMessage({type:"run",id,code,tests:inputs},"*"); return; }
      if(data.id!==id)return;
      if(data.type==="running" && !started) {started=true;setPhase("running");setMessage("Running your Python…");timeout(5,"Execution stopped after five seconds. Check for a loop that never finishes.");}
      else if(data.type==="result") {
        const rows:Result[]=Array.isArray(data.result)?data.result.slice(0,inputs.length).map((row:unknown)=>{
          if(!row || typeof row!=="object")return {error:"Invalid result returned by the program."};
          const entry=row as Record<string,unknown>;
          if(typeof entry.error==="string")return {error:entry.error.slice(0,3000)};
          try {const encoded=JSON.stringify(entry.value);if(!encoded || encoded.length>20000)throw new Error();return {value:JSON.parse(encoded) as JsonValue};}catch{return {error:"Result exceeds the supported JSON output limit."};}
        }):[];
        setResults(rows);setOutput(typeof data.output==="string"?data.output.slice(0,12000):"");setCheckedCode(code);
        const passed=allTests && rows.length===problem.tests.length && rows.every((row,index)=>!row.error && equal(row.value,problem.tests[index].expected));
        setMessage(allTests ? passed ? "All practice checks passed. Can you explain why your approach works?" : "Some checks need another look. Compare the expected value with your result." : "Custom run finished.");
        setPhase("idle");cleanup();
      } else if(data.type==="error") {setMessage(String(data.message||"Python could not complete this run.").slice(0,3000));setOutput(String(data.output||"").slice(0,12000));setPhase("idle");cleanup();}
    }
    window.addEventListener("message",receive);stopRef.current=cleanup;document.body.appendChild(iframe);
    timeout(60,"Python could not load in time. Check your connection and try again.");
  }
  return <div className="coding-workspace page-enter">
    <div className="lesson-top"><Link prefetch={false} href="/practice">← Problem library</Link><span>{problem.level} / {problem.topic}</span></div>
    <div className="coding-heading"><div><p className="eyebrow">THINK IT THROUGH. WRITE IT YOURSELF.</p><h1>{problem.title}</h1></div><span className="session-tag">PYTHON</span></div>
    <div className="coding-columns">
      <section className="problem-statement" aria-label="Problem description"><h2>The problem</h2><p>{problem.description}</p>{problem.source&&<aside className="problem-attribution">Adapted from <a href={problem.source.url} target="_blank" rel="noopener noreferrer">{problem.source.name} (opens in a new tab)</a> ? {problem.source.license} license ? revision {problem.source.revision.slice(0,7)}. Selected public cases; error cases excluded.</aside>}<details><summary>New to Python? Start here</summary><p>A function is a named set of instructions. <code>data</code> is the input passed to yours. <code>return</code> sends your answer back; <code>print</code> only shows a message in the console.</p><p>A variable stores a value. A loop repeats steps. A condition chooses whether a step runs. Indentation groups Python instructions. JSON lists look like [1, 2]; objects look like <code>{'{"values": [1, 2]}'}</code> and become Python dictionaries.</p><p>First work through the example with a pencil. Write the steps in everyday words. Then replace one step at a time with Python.</p><Link prefetch={false} href="/learn/a-running-total">Walk through a program before writing one ?</Link></details><h3>Your function</h3><p>{problem.contract}</p><code className="function-contract">def solve(data):</code><h3>Constraints</h3><ul>{problem.constraints.map(item=><li key={item}>{item}</li>)}</ul><h3>Example</h3><div className="problem-example"><span>INPUT</span><pre>{JSON.stringify(problem.tests[0].input,null,2)}</pre><span>EXPECTED RETURN VALUE</span><pre>{JSON.stringify(problem.tests[0].expected)}</pre></div><details><summary>All practice cases</summary>{problem.tests.map(test=><div className="public-case" key={test.name}><strong>{test.name}</strong><p><code>{JSON.stringify(test.input)}</code> → <code>{JSON.stringify(test.expected)}</code></p></div>)}</details><div className="coding-hints"><h3>Think it through with Socrates</h3><p>Before coding, describe the answer in everyday words. What information must you remember?</p>{problem.hints.slice(0,hints).map(hint=><p key={hint}>{hint}</p>)}<button className="button secondary" disabled={hints===problem.hints.length} onClick={()=>setHints(n=>n+1)}>{hints===problem.hints.length?"All questions shown":"Show a guiding question"}</button></div></section>
      <section className="coding-panel" aria-label="Python coding workspace"><div className="editor-toolbar"><span>solution.py</span><button className="text-button" onClick={()=>setSimple(value=>!value)}>{simple?"Use full editor":"Use simple editor"}</button><button className="text-button" onClick={()=>{if(window.confirm("Replace this draft with the starter code?"))update(starterCode);}}>Reset code</button></div>
        {simple?<textarea className="simple-code-editor" aria-label="Python solution editor" spellCheck={false} value={code} maxLength={20000} onChange={event=>update(event.target.value)}/>:<CodeEditor code={code} onChange={update}/>}
        <div className="editor-footer"><small>{saved||"Write Python; return your answer from solve(data)."}</small><small>{code.length.toLocaleString()} / 20,000 characters</small></div>
        <div className="run-toolbar"><button className="button primary" disabled={phase!=="idle"} onClick={()=>run(true)}>{phase==="loading"?"Loading Python…":phase==="running"?"Running…":"Run all checks"}</button>{phase!=="idle"&&<button className="button secondary" onClick={()=>{stopRef.current?.();setPhase("idle");setMessage("Execution stopped. Your code is unchanged.");}}>Stop execution</button>}</div>
        <details className="custom-input"><summary>Try your own input</summary><label className="field">Custom input (JSON)<textarea rows={3} value={custom} maxLength={5000} onChange={event=>setCustom(event.target.value)}/></label><button className="button secondary" disabled={phase!=="idle"} onClick={()=>run(false)}>Run custom input</button></details>
        <div className="run-status" role="status">{message}</div>{results.length>0&&checkedCode!==code&&<p className="changed-code">You have changed your code. Run again to check this version.</p>}
        <div className="case-results">{results.map((result,index)=><div className="case-result" key={index} data-passed={!customRun&&!result.error&&equal(result.value,problem.tests[index]?.expected)}><strong>{customRun?"Custom input":problem.tests[index]?.name||"Execution"}</strong><span>{result.error?"Error":customRun?"Returned":equal(result.value,problem.tests[index]?.expected)?"Passed":"Needs attention"}</span><pre>{result.error||`Returned: ${JSON.stringify(result.value)}${customRun?"":`\nExpected: ${JSON.stringify(problem.tests[index]?.expected)}`}`}</pre></div>)}</div>
        <details className="stdout" open={!!output}><summary>Console output</summary><pre>{output||"print() output will appear here."}</pre></details><p className="runner-note">Python runs on your device in a separate worker. Checks are visible practice cases, not a verified assessment. Standard-library exercises only; package installation and access to application services are blocked.</p>
      </section>
    </div>
  </div>;
}
