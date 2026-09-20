const origin = new URL(process.env.DEPLOYMENT_URL || process.env.WEB_APP_URL || 'http://localhost:3001');
const local = ['localhost','127.0.0.1'].includes(origin.hostname);
if ((!local && (origin.protocol !== 'https:' || !/^[a-z0-9-]+\.vercel\.app$/.test(origin.hostname))) || origin.username || origin.password || origin.search || origin.hash || origin.pathname !== '/') throw new Error('Unsupported smoke-test origin.');
const headers = process.env.VERCEL_AUTOMATION_BYPASS_SECRET ? {'x-vercel-protection-bypass':process.env.VERCEL_AUTOMATION_BYPASS_SECRET} : {};
for(const [route,status,marker] of [['/',200,'A little practice.'],['/curriculum',200,'Your learning path.'],['/patterns',200,'Find the pattern.'],['/patterns/sliding-window',200,'Make it make sense.'],['/practice',200,'Practice with'],['/solve/trail-total',200,'Python'],['/design',200,'Design with'],['/design/learning-schema',200,'Model a learning platform'],['/learn/a-running-total',200,'A running total'],['/progress',200,'Your progress, earned.'],['/learn/missing-lab',404,'This lab is not here.']]) {
 let passed=false;
 for(let attempt=0;attempt<5;attempt++) {
  const response=await fetch(new URL(route,origin),{headers,redirect:'error',signal:AbortSignal.timeout(20000)});
  const text=await response.text();
  if(response.status===status && text.includes(marker)){passed=true;break;}
  if(attempt<4)await new Promise(resolve=>setTimeout(resolve,2000));
 }
 if(!passed)throw new Error('Smoke test failed at '+route);
 console.log('PASS '+route);
}
