---
type: product
updated: 2026-09-20
---
# Platform guide
[[Home]] ? [[Learning Design]] ? [[Architecture]]

The product serves people who can currently get code from AI but cannot yet explain or produce it independently. Assume missing vocabulary and missing mental models, not missing intelligence. Use respectful language and small, concrete examples.

## Learning loop
1. Open `/start` if you are new to coding. Learn assignment, loops and debugging with predictions, guided traces and changed examples. Then write the trail-total function in the real editor. Continue to `/curriculum` and **A running total** for deeper practice.
2. Inspect changing state. Incorrect predictions are information, not a penalty.
3. Investigate the rule, modify the input, then explain your result.
4. Move to `/practice` to write Python in the full editor. The simple editor is an accessible fallback. Public checks explain expected and actual values; they do not prove general correctness.
   Choose **Debugging** for three original repair exercises: a basket that forgets earlier prices, a temperature count that includes zero, and an inbox function that returns too early. Predict the original code, narrow down the cause, then repair and run it. Passing checks for the current draft unlocks an explanation and self-review checklist. Editing or running custom input requires a fresh full check before that review appears again.
5. Open `/patterns/[id]` to connect a small decision to a real product. Predict, step through the example, question an assumption and write your explanation.
6. Open `/design` for system, database and architecture interviews. State requirements, make a design, challenge its failure behavior, then answer a follow-up aloud.

## What is saved
Guest PRIMM progress and coding/design drafts stay in this browser. Coding and design drafts are shared by users of the same browser; do not write secrets. Design answers can be exported to Markdown for Obsidian. Pattern reflections currently last only while their page is open.
Debugging uses the same saved editor drafts. Questions always refer to the original broken program, which remains available for inspection. Explanations and question selections stay in the current page only; no prose grading, account completion, remote execution or model request is involved.

Open `/debugging` or **Learn debugging** in the sidebar before the repair exercises. Four stages teach reading errors, reproducing a failure, finding the first state mismatch and checking a repair. The trace is an authored visualization, not a live Python debugger. Lesson progress resumes locally; review does not erase it.

The **My debugging notebook** section below each repair workspace stores evidence and hypotheses separately from the temporary post-check reflection. Use **Save notebook** deliberately, or **Export debugging notes** to download Markdown for Obsidian. Each exercise has its own notebook. No account sync or automatic grading; the last explicit save in the same browser wins. Export before leaving if storage is unavailable.

With a configured account service, sign in at `/account`, explicitly import guest PRIMM progress if wanted, and use **Save to account** in a lab. Existing account progress wins an import conflict. Account drafts are tab memory until saved; a reload loads the server version. Coding/design drafts are not yet account-synchronized.

## Honest expectations
Questions, feedback and review criteria are authored content. No live AI grading or solution generation is connected. Six design exercises are introductory interview practice, not a full senior curriculum. Learners still need implementation projects, debugging, operating systems, networking, testing, collaboration and real operational experience. See [[Learning Design]] for planned progression.

First-steps progress uses its own bounded, versioned browser record. Unavailable storage falls back to tab memory with an explicit warning; it is not account sync. Only passing the full public trail-total check set after all three lessons records practice success. It does not grade the learner's explanation or establish mastery.

## Build your own regression suite
In any Python problem, expand **Build my own test cases**. Name a case, enter its JSON input and predict its JSON result before running. Save up to six cases, edit or remove them, and use **Run my tests**. A mismatch may be a bug or a mistaken expectation. These cases save in this browser and do not replace the platform checks. A failed save leaves the cases usable in the current tab. See [[features/Personal Regression Tests]].

## Think beside LeetCode
Open **Chrome companion** in the navigation for the downloadable preview and installation instructions. Load it unpacked in Chrome, open a problem, invoke the extension, then explicitly select the current problem or paste its URL. Work through five thinking stages, choose a topic for authored questions, save local notes, or export Markdown to this vault. No API key is needed. This is not an AI solver, a Web Store release or account-synced storage. See [[features/Chrome Companion]].

## Build a small product
Choose **Build a product** in the sidebar. Decide how to identify a repeated notification, inspect three deliveries, write a plan, and implement the inbox in the embedded Python editor. After all platform checks pass, explain your design and its limits. Changing code or reloading requires a new passing run. Notes and code drafts are browser-local; export project notes as Markdown for Obsidian. The same original coding problem is available in the practice bank (now 24 problems).

## Engineering basics
Open **Engineering basics** in the navigation (`/foundations`). Predict what a command does, inspect simulated output, then explain the concept in another situation. Start with files, then pipelines, Git, SSH and secure business rules. No software installation, real shell or credentials are needed. The command reference labels tools beyond the supported simulator subset.
