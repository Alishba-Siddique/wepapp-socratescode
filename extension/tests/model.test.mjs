import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {emptyDraft,exportNotes,parseDraft,parseProblem} from '../src/model.ts';
test('problem context restricts origins and strips tracking data',()=>{
  for(const url of ['http://leetcode.com/problems/two-sum/','https://leetcode.com.evil.test/problems/two-sum/','https://user:pass@leetcode.com/problems/two-sum/','https://leetcode.com:9999/problems/two-sum/','https://leetcode.com/discuss/','javascript:alert(1)','https://leetcode.com/problems/%3Cscript%3E/'])assert.equal(parseProblem(url),null);
  assert.deepEqual(parseProblem('https://www.leetcode.com/problems/two-sum/description/?envId=abc#private','Two Sum - LeetCode'),{slug:'two-sum',url:'https://leetcode.com/problems/two-sum/',title:'Two Sum'});
});
test('notes are bounded and exports treat prose as literal text',()=>{
  for(const row of [null,[],{...emptyDraft(),stage:99},{...emptyDraft(),topic:'__proto__'},{...emptyDraft(),notes:['x']},{...emptyDraft(),notes:Array(5).fill('x'.repeat(1501))}])assert.deepEqual(parseDraft(row),emptyDraft());
  const draft={...emptyDraft(),notes:['<script>bad</script>\n# heading','','','','']};
  assert.deepEqual(parseDraft(draft),draft);
  assert(exportNotes(parseProblem('https://leetcode.com/problems/two-sum'),draft).includes('    <script>bad</script>\n    # heading'));
});
test('manifest restricts privileges and network access',()=>{
  const manifest=JSON.parse(readFileSync(new URL('../static/manifest.json',import.meta.url),'utf8'));
  assert.equal(manifest.manifest_version,3);
  assert.deepEqual(manifest.permissions,['activeTab','sidePanel','storage']);
  assert.equal(manifest.host_permissions,undefined);
  assert.equal(manifest.content_scripts,undefined);
  assert.match(manifest.content_security_policy.extension_pages,/connect-src 'none'/);
});
