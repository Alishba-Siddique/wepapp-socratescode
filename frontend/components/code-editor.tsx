"use client";
import Editor, { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor/editor/editor.api.js";
import "monaco-editor/languages/definitions/python/register.js";
loader.config({ monaco });
globalThis.MonacoEnvironment = { getWorkerUrl: () => "/editor/editor.worker.js" };
export default function CodeEditor({ code, onChange }: { code: string; onChange: (code: string) => void }) {
  return <Editor height="460px" language="python" value={code} onChange={value => onChange((value || "").slice(0,20000))} theme="socratescode" beforeMount={monaco => monaco.editor.defineTheme("socratescode",{ base:"vs",inherit:true,rules:[{token:"comment",foreground:"82776B",fontStyle:"italic"},{token:"keyword",foreground:"754934"},{token:"string",foreground:"497052"}],colors:{"editor.background":"#FFFEFA","editor.lineHighlightBackground":"#F4EDE4","editorLineNumber.foreground":"#A99A8A","editorCursor.foreground":"#754934","editor.selectionBackground":"#E6D4C4"}})} options={{fontSize:14,fontFamily:"'JetBrains Mono', monospace",minimap:{enabled:false},padding:{top:20},scrollBeyondLastLine:false,automaticLayout:true,tabSize:4,wordWrap:"on",accessibilitySupport:"on",ariaLabel:"Python solution editor",fixedOverflowWidgets:true}} loading={<p className="editor-loading" role="status">Loading the code editor…</p>} />;
}
