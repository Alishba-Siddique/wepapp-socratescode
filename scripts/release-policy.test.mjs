import test from 'node:test';
import assert from 'node:assert/strict';
import {deploymentURL,commitSHA,verifyDeployment} from './release-policy.mjs';
test('release URLs reject injection, credentials, redirects and unrelated hosts',()=>{
 assert.equal(deploymentURL('https://my-app-123.vercel.app\n'),'https://my-app-123.vercel.app');
 for(const value of ['http://app.vercel.app','https://app.vercel.app.evil.test','https://evil.test','https://user:secret@app.vercel.app','https://app.vercel.app/path','https://app.vercel.app?next=evil','https://app.vercel.app:8443','https://app.vercel.app#x','$(whoami)']) assert.throws(()=>deploymentURL(value));
});
test('release identity requires a full SHA and a ready build from the intended project',()=>{
 const sha='a'.repeat(40);
 assert.equal(commitSHA(sha),sha);
 for(const v of ['main','abc123','a'.repeat(39),'A'.repeat(40)])assert.throws(()=>commitSHA(v));
 const valid={projectId:'prj_test',readyState:'READY',target:'production',meta:{githubCommitSha:sha}};
 assert.equal(verifyDeployment(valid,'prj_test',sha),valid);
 assert.throws(()=>verifyDeployment(valid,'prj_other',sha));
 assert.throws(()=>verifyDeployment({...valid,readyState:'ERROR'},'prj_test',sha));
 assert.throws(()=>verifyDeployment({...valid,target:'preview'},'prj_test',sha));
 assert.throws(()=>verifyDeployment(valid,'prj_test','b'.repeat(40)));
});
