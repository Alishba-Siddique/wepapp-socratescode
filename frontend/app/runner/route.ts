import { randomBytes } from "node:crypto";
export const runtime = "nodejs";
export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const nonce = randomBytes(18).toString("base64");
  const workerURL = JSON.stringify(`${origin}/runner-assets/python-worker.mjs`);
  const script = `let worker; let runId; let deadline; let running=false; addEventListener('message', event => {
    if(event.source===parent && event.data?.type==='stop' && event.data.id===runId) {
      clearTimeout(deadline); worker?.terminate(); parent.postMessage({type:'stopped',id:runId},'*'); return;
    }
    if(event.source !== parent || !event.data || event.data.type !== 'run' || worker) return;
    const payload=event.data; runId=payload.id;
    const bootstrap='const ready=import('+JSON.stringify(${workerURL})+'); self.onmessage=async event=>{try{await ready;self.onmessage(event);}catch(error){self.postMessage({type:"error",message:String(error)});}};';
    const url=URL.createObjectURL(new Blob([bootstrap],{type:'text/javascript'}));
    // A classic worker can start in an opaque iframe across browsers. Its
    // dynamic import still loads the reviewed ESM runtime with CORS and CSP.
    worker=new Worker(url);
    const expire=()=>{worker.terminate();parent.postMessage({type:'error',id:runId,message:running?'Execution stopped after five seconds. Check for a loop that never finishes.':'Python could not load in time. Try again.'},'*');};
    deadline=setTimeout(expire,60000);
    worker.onmessage=e=>{
      if(e.data?.type==='running'&&!running){running=true;clearTimeout(deadline);deadline=setTimeout(expire,5000);}
      if(e.data?.type==='result'||e.data?.type==='error'){clearTimeout(deadline);worker.terminate();URL.revokeObjectURL(url);}
      parent.postMessage({...e.data,id:runId},'*');
    };
    worker.onerror=()=>{clearTimeout(deadline);worker.terminate();parent.postMessage({type:'error',id:runId,message:'Python could not start. Reload and try again.'},'*');};
    worker.postMessage(payload);
  }); addEventListener('pagehide',()=>worker?.terminate()); parent.postMessage({type:'runner-ready'},'*');`;
  const csp = `default-src 'none'; script-src 'nonce-${nonce}' 'unsafe-eval' 'wasm-unsafe-eval' blob: ${origin}/runner-assets/ ${origin}/python-runtime/; worker-src blob: ${origin}/runner-assets/ ${origin}/python-runtime/; connect-src ${origin}/python-runtime/; base-uri 'none'; form-action 'none'; frame-src 'none'; sandbox allow-scripts`;
  return new Response(`<!doctype html><html><head><meta charset="utf-8"><title>Python practice runner</title></head><body><script nonce="${nonce}">${script}</script></body></html>`, {headers:{"Content-Type":"text/html; charset=utf-8","Content-Security-Policy":csp,"Cache-Control":"no-store","Referrer-Policy":"no-referrer"}});
}
