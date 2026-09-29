# socratescode Chrome companion

A Manifest V3 side panel that helps you reason through a LeetCode problem without generating its solution. This is a developer preview, not a Chrome Web Store release, and is independent of LeetCode.

## Install and use

Download the preview from the app's [/companion page](https://wepapp-socratescode.vercel.app/companion), extract it, open `chrome://extensions`, enable Developer mode, and choose **Load unpacked** with the extracted folder. Use Chrome 116 or newer.

Open a LeetCode problem and click the extension's toolbar action. Choose **Use current LeetCode problem**, or paste its URL. Work through Understand, Predict, Reason, Investigate and Explain. Choose a topic for authored question nudges. Save notes explicitly, export Markdown for Obsidian, or delete the current problem's notes. Reconnect explicitly after changing problems.

No API key, account, model provider or hosted backend is needed. Guidance is authored, not generated or a correctness assessment. Notes are local to this Chrome profile, are not encrypted by the extension, and do not sync to your app account. Avoid entering secrets or private customer information. Unsaved changes remain in the open panel only; concurrent panels use last-save-wins.

## Build and verify

Install the existing frontend dependencies first (`cd frontend && npm ci`). From the repository root:

```sh
node extension/build.mjs
node --test extension/tests/model.test.mjs
python extension/package.py
python extension/package.py --check
```

Load `extension/unpacked` for local development. The generated six-file ZIP lives in `frontend/public/downloads/`; CI checks that it matches source. No remote scripts, runtime dependency download, telemetry, model calls or paid service is used by the panel.

With Playwright's bundled Chromium installed, `node extension/tests/browser.mjs` tests the installed extension, real extension storage, guidance, export, invalid URLs, storage failures and narrow layout. CI runs this in the existing Chromium job. A manual toolbar smoke check is still required: open a real LeetCode problem, invoke the action, capture its title/URL, switch problems, and reconnect. The automated capture fixture does not prove Chrome's user-gesture permission grant.

## Permissions and boundaries

- `sidePanel`: host the thinking workspace.
- `activeTab`: temporary title/URL access after an explicit toolbar gesture.
- `storage`: save bounded, versioned notes per problem.

There are no host permissions, content scripts, code injection, history access, page-content scraping or submission automation. Only canonical HTTPS URLs on `leetcode.com` and `www.leetcode.com` are accepted; query strings and fragments are discarded. Problem text and editor contents are never read. Learner notes render as text and export as indented Markdown blocks. The panel CSP forbids network connections and remote script execution.

Implementation references: [Chrome sidePanel](https://developer.chrome.com/docs/extensions/reference/api/sidePanel), [activeTab](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab), [Playwright extension testing](https://playwright.dev/docs/chrome-extensions).
