import {spawn} from 'node:child_process';
import {mkdirSync,createWriteStream} from 'node:fs';
import path from 'node:path';
const output=path.resolve(process.env.TEST_ARTIFACT_DIR || 'test-results/local');
mkdirSync(output,{recursive:true});
const log=createWriteStream(path.join(output,'server.log'));
const server=spawn(process.execPath,['frontend/node_modules/next/dist/bin/next','start','frontend','--port','3001'],{cwd:process.cwd(),env:process.env,stdio:['ignore','pipe','pipe']});
server.stdout.pipe(log);server.stderr.pipe(log);
let serverError;
server.on('error',error=>{serverError=error;});
try {
 let ready=false;
 for(let attempt=0;attempt<60;attempt++){
  if(serverError)throw serverError;
  if(server.exitCode!==null)throw new Error('Production server exited before becoming ready.');
  try{const response=await fetch('http://localhost:3001',{signal:AbortSignal.timeout(1000)});if(response.ok){ready=true;break;}}catch{}
  await new Promise(resolve=>setTimeout(resolve,500));
 }
 if(!ready)throw new Error('Production server did not become ready.');
 const code=await new Promise((resolve,reject)=>{const test=spawn(process.execPath,['frontend/tests/browser.mjs'],{env:{...process.env,WEB_APP_URL:'http://localhost:3001',TEST_ARTIFACT_DIR:output},stdio:'inherit'});test.on('error',reject);test.on('exit',resolve);});
 if(code!==0)throw new Error('Browser journey failed.');
} catch(error) {console.error(error.message);process.exitCode=1;}
finally {server.kill('SIGTERM');log.end();}
