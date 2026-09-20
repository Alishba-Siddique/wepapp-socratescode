import {spawn} from 'node:child_process';
import {mkdirSync,createWriteStream} from 'node:fs';
import path from 'node:path';
const output=path.resolve(process.env.TEST_ARTIFACT_DIR || 'test-results/local');
const port=process.env.TEST_PORT || '3001';
if(!/^\d{4,5}$/.test(port))throw new Error('Invalid test port');
const baseURL='http://localhost:'+port;
mkdirSync(output,{recursive:true});
const log=createWriteStream(path.join(output,'server.log'));
const server=spawn(process.execPath,['frontend/node_modules/next/dist/bin/next','start','frontend','--port',port],{cwd:process.cwd(),env:process.env,stdio:['ignore','pipe','pipe']});
server.stdout.pipe(log);server.stderr.pipe(log);
let serverError;
server.on('error',error=>{serverError=error;});
try {
 let ready=false;
 for(let attempt=0;attempt<60;attempt++){
  if(serverError)throw serverError;
  if(server.exitCode!==null)throw new Error('Production server exited before becoming ready.');
  try{const response=await fetch(baseURL,{signal:AbortSignal.timeout(1000)});if(response.ok){ready=true;break;}}catch{}
  await new Promise(resolve=>setTimeout(resolve,500));
 }
 if(!ready)throw new Error('Production server did not become ready.');
 for (const script of ['frontend/tests/browser.mjs','frontend/tests/learning-browser.mjs']) {
  const code=await new Promise((resolve,reject)=>{const test=spawn(process.execPath,[script],{env:{...process.env,WEB_APP_URL:baseURL,TEST_ARTIFACT_DIR:output},stdio:'inherit'});test.on('error',reject);test.on('exit',resolve);});
  if(code!==0)throw new Error('Browser journey failed: '+script);
 }
} catch(error) {console.error(error.message);process.exitCode=1;}
finally {server.kill('SIGTERM');log.end();}
