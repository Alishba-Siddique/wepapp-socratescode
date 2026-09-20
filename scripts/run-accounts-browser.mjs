import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdirSync, createWriteStream } from "node:fs";
import path from "node:path";
const root = process.cwd();
const databaseUrl = process.env.TEST_DATABASE_URL;
if (!databaseUrl || !new URL(databaseUrl).pathname.endsWith("_test")) throw new Error("Set TEST_DATABASE_URL to a dedicated database ending in _test.");
const output = path.resolve(process.env.TEST_ARTIFACT_DIR || "test-results/accounts"); mkdirSync(output, {recursive:true});
const origin = "http://localhost:3103";
const runId = randomUUID();
const env = {...process.env, DATABASE_URL:databaseUrl, BETTER_AUTH_SECRET:randomUUID()+randomUUID(), BETTER_AUTH_URL:origin, APP_ORIGIN:origin, NODE_ENV:"test", HOST:"127.0.0.1", PORT:"4103", GATEWAY_URL:"http://127.0.0.1:4103"};
const services=[]; const logs=[];
function launch(cwd, args, name, environment=env) {
  const log=createWriteStream(path.join(output,`${name}.log`)); logs.push(log);
  const child=spawn(process.execPath,args,{cwd,env:environment,stdio:["ignore","pipe","pipe"]});
  child.stdout.pipe(log); child.stderr.pipe(log); services.push(child);
  return child;
}
async function ready(url, child) {
  for(let i=0;i<120;i++) {
    if(child.exitCode!==null) throw new Error("Service exited before readiness; inspect test logs.");
    try { if((await fetch(url,{signal:AbortSignal.timeout(1000)})).ok)return; } catch {}
    await new Promise(resolve=>setTimeout(resolve,500));
  }
  throw new Error("Account test service did not become ready.");
}
try {
  const gateway=launch(path.join(root,"gateway"),["dist/gateway/src/main.js"],"gateway");
  await ready("http://127.0.0.1:4103/health",gateway);
  const frontend=launch(path.join(root,"frontend"),["node_modules/next/dist/bin/next","start","--port","3103"],"frontend",{...env,NODE_ENV:"production"});
  await ready(origin,frontend);
  for(const browser of (process.env.ACCOUNT_BROWSERS || "chromium,firefox,webkit").split(",")) {
    const code=await new Promise((resolve,reject)=>{
      const test=spawn(process.execPath,["frontend/tests/accounts-browser.mjs"],{cwd:root,env:{...env,WEB_APP_URL:origin,BROWSER:browser,E2E_RUN_ID:runId,TEST_ARTIFACT_DIR:path.join(output,browser)},stdio:"inherit"});
      test.on("error",reject); test.on("exit",resolve);
    });
    if(code!==0)throw new Error(`Account browser journey failed: ${browser}`);
  }
} catch(error) { console.error(error.message); process.exitCode=1; }
finally {
  for(const child of services) child.kill("SIGTERM");
  for(const log of logs) log.end();
  const {PrismaClient}=await import("../gateway/node_modules/@prisma/client/default.js");
  const {PrismaPg}=await import("../gateway/node_modules/@prisma/adapter-pg/dist/index.mjs");
  const db=new PrismaClient({adapter:new PrismaPg({connectionString:databaseUrl})});
  try { await db.user.deleteMany({where:{email:{startsWith:`browser-${runId}-`,endsWith:"@example.test"}}}); }
  catch { console.error("Could not clean test users because the test database is unavailable."); process.exitCode=1; }
  finally { await db.$disconnect(); }
}
