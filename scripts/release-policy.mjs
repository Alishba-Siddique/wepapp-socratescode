import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
export function deploymentURL(value) {
  const url = new URL(value.trim());
  if (url.protocol !== 'https:' || !/^[a-z0-9-]+\.vercel\.app$/.test(url.hostname) || url.port || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error('Expected an immutable Vercel deployment URL.');
  return url.origin;
}
export function commitSHA(value) {
  if (!/^[a-f0-9]{40}$/.test(value || '')) throw new Error('Expected a complete commit SHA.');
  return value;
}
export function verifyDeployment(data, project, sha) {
  if (data.projectId !== project || data.readyState !== 'READY' || data.target !== 'production') throw new Error('Deployment must be a ready production build belonging to this project.');
  const actual = data.meta?.githubCommitSha || data.gitSource?.sha;
  if (sha && actual !== sha) throw new Error('Deployment commit differs from the tested commit.');
  return data;
}
async function main() {
  const mode = process.argv[2];
  if (mode === 'environment') {
    for (const key of ['VERCEL_TOKEN', 'VERCEL_ORG_ID', 'VERCEL_PROJECT_ID']) if (!process.env[key]) throw new Error('Missing configuration: ' + key);
    commitSHA(process.env.RELEASE_SHA);
  } else if (mode === 'capture') {
    const url = deploymentURL(readFileSync(process.argv[3], 'utf8'));
    const sha = commitSHA(process.env.RELEASE_SHA);
    appendFileSync(process.env.GITHUB_OUTPUT, 'url=' + url + '\n');
    writeFileSync('release.json', JSON.stringify({url,sha,project:process.env.VERCEL_PROJECT_ID,run:process.env.GITHUB_RUN_ID,createdAt:new Date().toISOString()},null,2));
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, '### Verified release candidate\n' + url + '\nCommit: ' + sha + '\n');
  } else if (mode === 'ownership') {
    const url = deploymentURL(process.env.DEPLOYMENT_URL || '');
    if (!process.env.VERCEL_TOKEN || !process.env.VERCEL_PROJECT_ID || !process.env.VERCEL_ORG_ID) throw new Error('Missing deployment credentials or project identity.');
    const api = 'https://api.vercel.com/v13/deployments/' + new URL(url).hostname + '?teamId=' + encodeURIComponent(process.env.VERCEL_ORG_ID);
    const response = await fetch(api,{headers:{Authorization:'Bearer '+process.env.VERCEL_TOKEN},signal:AbortSignal.timeout(20000)});
    if (!response.ok) throw new Error('Deployment lookup failed: HTTP ' + response.status);
    verifyDeployment(await response.json(),process.env.VERCEL_PROJECT_ID,process.env.RELEASE_SHA || undefined);
    console.log('Deployment ownership and state verified.');
  } else if (mode === 'current-main') {
    const sha = commitSHA(process.env.RELEASE_SHA);
    const response=await fetch('https://api.github.com/repos/'+process.env.GITHUB_REPOSITORY+'/git/ref/heads/main',{headers:{Authorization:'Bearer '+process.env.GH_TOKEN,Accept:'application/vnd.github+json'},signal:AbortSignal.timeout(20000)});
    if (!response.ok || (await response.json()).object?.sha !== sha) throw new Error('A newer main commit exists. Release its candidate instead.');
  } else throw new Error('Unknown release-policy command.');
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch(error=>{console.error(error.message);process.exitCode=1;});
