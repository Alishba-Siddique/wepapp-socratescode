import { pathToFileURL } from 'node:url';
import { commitSHA, deploymentURL, verifyDeployment } from './release-policy.mjs';

export function candidateBody(project, sha, repository) {
  commitSHA(sha);
  if (!project.id?.startsWith('prj_') || project.rootDirectory !== 'frontend' || project.framework !== 'nextjs') throw new Error('Unexpected frontend project settings.');
  const link = project.link;
  if (link?.type !== 'github' || !link.repoId || `${link.org}/${link.repo}` !== repository) throw new Error('Project must be linked to the expected GitHub repository.');
  return { name: project.name, project: project.id, target: 'production', autoAssignCustomDomains: false,
    gitSource: { type: 'github', repoId: String(link.repoId), ref: sha, sha }, meta: { githubCommitSha: sha } };
}

export function createAPI(token, team, request = fetch) {
  if (!token || !/^team_[a-zA-Z0-9]+$/.test(team || '')) throw new Error('Missing scoped deployment configuration.');
  return async (path, body) => {
    if (!/^\/v\d+\//.test(path) || path.includes('?')) throw new Error('Invalid API path.');
    const response = await request(`https://api.vercel.com${path}?teamId=${encodeURIComponent(team)}`, {
      method: body === undefined ? 'GET' : 'POST', redirect: 'error',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }), signal: AbortSignal.timeout(30000),
    });
    // Do not echo API bodies: errors can include configuration or credentials.
    if (!response.ok) throw new Error(`Vercel ${body === undefined ? 'lookup' : 'mutation'} failed: HTTP ${response.status}`);
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  };
}

async function waitFor(read, accept, timeout) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const value = await read();
    if (accept(value)) return value;
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  throw new Error('Vercel operation exceeded its deadline. Inspect the deployment before retrying.');
}

async function main() {
  const mode = process.argv[2];
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!/^prj_[a-zA-Z0-9]+$/.test(projectId || '')) throw new Error('Invalid project identity.');
  const api = createAPI(process.env.VERCEL_TOKEN, process.env.VERCEL_ORG_ID);
  if (mode === 'candidate') {
    const sha = commitSHA(process.env.RELEASE_SHA);
    const project = await api(`/v9/projects/${projectId}`);
    // Use the project-scoped deployment API. CLI pull also queries the owning
    // team, requiring broader permissions than this release needs.
    const created = await api('/v13/deployments', candidateBody(project, sha, process.env.GITHUB_REPOSITORY));
    if (!/^dpl_[a-zA-Z0-9]+$/.test(created.id || '')) throw new Error('Missing candidate identity.');
    const candidate = await waitFor(() => api(`/v13/deployments/${created.id}`), data => {
      if (['ERROR', 'CANCELED'].includes(data.readyState)) throw new Error(`Candidate ${created.id} failed to build.`);
      return data.readyState === 'READY';
    }, 20 * 60 * 1000);
    verifyDeployment(candidate, projectId, sha);
    if (candidate.autoAssignCustomDomains !== false) throw new Error('Candidate must defer production domain assignment.');
    console.log(deploymentURL(`https://${candidate.url}`));
  } else if (mode === 'promote' || mode === 'rollback') {
    const url = deploymentURL(process.env.DEPLOYMENT_URL || '');
    const candidate = await api(`/v13/deployments/${new URL(url).hostname}`);
    verifyDeployment(candidate, projectId, mode === 'promote' ? commitSHA(process.env.RELEASE_SHA) : undefined);
    if (!/^dpl_[a-zA-Z0-9]+$/.test(candidate.id || '')) throw new Error('Invalid deployment identity.');
    await api(`/v${mode === 'promote' ? 10 : 1}/projects/${projectId}/${mode}/${candidate.id}`, {});
    await waitFor(() => api(`/v9/projects/${projectId}`), project => project.targets?.production?.id === candidate.id, 5 * 60 * 1000);
    console.log(`Production points to verified deployment ${candidate.id}.`);
  } else throw new Error('Unknown deployment operation.');
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch(error => { console.error(error.message); process.exitCode = 1; });
