import test from 'node:test';
import assert from 'node:assert/strict';
import { candidateBody, createAPI } from './vercel-release.mjs';
const project = {id:'prj_test',name:'lab',rootDirectory:'frontend',framework:'nextjs',link:{type:'github',repoId:123,org:'owner',repo:'lab'}};
test('candidates pin verified source and defer production domains', () => {
  const body = candidateBody(project, 'a'.repeat(40), 'owner/lab');
  assert.equal(body.autoAssignCustomDomains, false);
  assert.equal(body.gitSource.ref, 'a'.repeat(40));
  assert.equal(body.gitSource.sha, body.meta.githubCommitSha);
  assert.equal(body.target, 'production');
  for (const p of [{...project,rootDirectory:null},{...project,framework:null},{...project,link:{...project.link,repo:'other'}}]) assert.throws(() => candidateBody(p, 'a'.repeat(40), 'owner/lab'));
  assert.throws(() => candidateBody(project, 'main', 'owner/lab'));
});
test('API credentials stay on Vercel and mutations are never automatically retried', async () => {
  const calls = [];
  const api = createAPI('test-secret', 'team_test', async (url, options) => {
    calls.push({url,options}); return new Response('private detail', {status:403});
  });
  await assert.rejects(() => api('/v13/deployments', {}), /HTTP 403/);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.vercel.com/v13/deployments?teamId=team_test');
  assert.equal(calls[0].options.redirect, 'error');
  await assert.rejects(() => api('https://evil.test'), /Invalid API path/);
  assert.equal(calls.length, 1);
});
