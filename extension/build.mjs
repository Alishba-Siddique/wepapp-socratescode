import ts from '../frontend/node_modules/typescript/lib/typescript.js';
import {mkdirSync,copyFileSync,readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
const out=path.join(root,'unpacked');
const program=ts.createProgram(readdirSync(path.join(root,'src')).filter(name=>name.endsWith('.ts')).map(name=>path.join(root,'src',name)),{strict:true,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022,moduleResolution:ts.ModuleResolutionKind.Bundler,lib:['lib.es2022.d.ts','lib.dom.d.ts'],types:[],skipLibCheck:true,noEmitOnError:true,newLine:ts.NewLineKind.LineFeed,outDir:out});
const diagnostics=ts.getPreEmitDiagnostics(program);
if(diagnostics.length){console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCanonicalFileName:file=>file,getCurrentDirectory:()=>root,getNewLine:()=> '\n'}));process.exit(1);}
if(program.emit().emitSkipped)process.exit(1);
mkdirSync(out,{recursive:true});
for(const name of ['manifest.json','panel.html','panel.css'])copyFileSync(path.join(root,'static',name),path.join(out,name));
console.log('Built and type-checked extension/unpacked. Load this folder in Chrome.');
