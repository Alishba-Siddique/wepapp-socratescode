import { cp, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
const root=process.cwd();
await mkdir(path.join(root,"public/editor"),{recursive:true});
const workerAssets=path.join(root,"node_modules/monaco-editor/min/vs/assets");
const editorWorker=(await readdir(workerAssets)).find(name=>name.startsWith("editor.worker-")&&name.endsWith(".js"));
if(!editorWorker)throw new Error("Pinned Monaco editor worker was not found");
await cp(path.join(workerAssets,editorWorker),path.join(root,"public/editor/editor.worker.js"));
await cp(path.join(root,"node_modules/monaco-editor/LICENSE"),path.join(root,"public/editor/LICENSE"));
await mkdir(path.join(root,"public/python-runtime"),{recursive:true});
for(const entry of await readdir(path.join(root,"node_modules/pyodide"))) {
  if(/\.(m?js|wasm|zip|json)$/.test(entry) || /LICENSE/.test(entry)) await cp(path.join(root,"node_modules/pyodide",entry),path.join(root,"public/python-runtime",entry));
}
console.log("Prepared self-hosted Monaco and Python runtime assets.");
