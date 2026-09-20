# Content and licensing
[[Home]] ? [[Learning Design]] ? [[DSA in Products]]

## GitHub import
The importer fetches DATA only from the reviewed MIT-licensed `exercism/problem-specifications` repository. It never runs downloaded setup scripts, reference solutions or tests. Eight exercises contribute 88 selected success cases: isogram, pangram, leap, reverse-string, raindrops, armstrong-numbers, hamming and scrabble-score.

Run `node scripts/import-github-problems.mjs` at the repository root. Existing manifests pin the source revision; `--refresh` explicitly selects a new upstream revision and requires content review. The current revision is recorded in `reference/github-import/manifest.json`, together with file hashes and selected canonical UUIDs. The source license is retained in `reference/github-import/LICENSE`. The importer handles both legacy description.md and split introduction.md/instructions.md layouts. It rejects missing licenses, oversized files, unexpected schema and insufficient cases.

Each imported problem displays attribution, revision and its source link. Inputs are passed as JSON dictionaries to `solve(data)`; error/exception cases are excluded, up to 20 public success cases are selected, and the interface states that adaptation. The 12 other native problems and Socratic hints are original project content. Imported prose is rendered as text, never trusted HTML.

## Other references
The 54 LeetCode/CSES reference entries link to publisher exercises; their statements and solutions are not scraped. The Pareto repository is a linked reading reference, not a copied question bank. A repository being public is not sufficient reuse permission.

The user-provided DSA PDF and pattern notes inform topic coverage. The original PDF is user material; do not claim its distribution license has been verified. Its full contents are not embedded into the public app. Review topic classifications before turning references into exercises.

Third-party runtime notices must travel with self-hosted editor/Python assets. Pin dependencies and retain their licenses; npm audit does not prove the safety of prebundled vendor code. The editor uses the ESM build with its sanitizer explicitly redirected to the patched installed DOMPurify.
