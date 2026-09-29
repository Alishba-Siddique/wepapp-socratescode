import { emptyDraft, exportNotes, parseDraft, parseProblem, stages, topicHints, type Problem, type Topic } from "./model.js";
function element<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error("Missing panel element: " + id);
  return node as T;
}
let problem: Problem | null = null;
let draft = emptyDraft();
let dirty = false;
let nudges = 0;
let loading = false;
const note = element<HTMLTextAreaElement>("note");
const status = element("status");
const topic = element<HTMLSelectElement>("topic");
const navigation = element("stages");
function key() { return "socratic-notes:v1:" + problem!.slug; }
function render() {
  element("coach").hidden = !problem;
  if (!problem) return;
  element("problem-title").textContent = problem.title;
  const link = element<HTMLAnchorElement>("problem-link"); link.href = problem.url; link.textContent = problem.url;
  navigation.replaceChildren();
  stages.forEach((stage, index) => {
    const button = document.createElement("button"); button.textContent = `${index + 1}. ${stage.title}`; button.type = "button";
    if (index === draft.stage) button.setAttribute("aria-current", "step");
    button.addEventListener("click", () => { draft.stage = index; dirty = true; nudges = 0; render(); element("question").focus(); });
    navigation.append(button);
  });
  element("question").textContent = stages[draft.stage].question;
  note.value = draft.notes[draft.stage]; topic.value = draft.topic;
  element("nudge-list").replaceChildren(); element("review").replaceChildren();
  element<HTMLButtonElement>("nudge").disabled = false;
  element<HTMLButtonElement>("next").textContent = draft.stage === stages.length - 1 ? "Review my reasoning" : "Next thinking step";
}
function busy(value: boolean) {
  loading = value;
  for (const id of ["capture", "use-url", "save", "delete"]) element<HTMLButtonElement>(id).disabled = value;
  note.disabled = value; topic.disabled = value; element<HTMLButtonElement>("next").disabled = value;
  navigation.querySelectorAll("button").forEach(button => { button.disabled = value; });
  element("coach").setAttribute("aria-busy", String(value));
}
async function load(next: Problem) {
  if (loading) return;
  if (dirty && !window.confirm("Save or export first to keep your unsaved notes. Discard unsaved changes and load this problem?")) return;
  busy(true);
  try {
    const data = await chrome.storage.local.get("socratic-notes:v1:" + next.slug);
    draft = parseDraft(data["socratic-notes:v1:" + next.slug]);
    status.textContent = "Notes loaded for this problem. Save changes explicitly. Reconnect when you switch problems.";
  } catch {
    draft = emptyDraft(); status.textContent = "Storage is unavailable. You can write and export notes in this panel; saving may fail.";
  } finally { problem = next; dirty = false; nudges = 0; busy(false); render(); }
}
element("capture").addEventListener("click", async () => {
  if (loading) return;
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const next = parseProblem(tab?.url ?? "", tab?.title);
    if (!next) { status.textContent = "Open a LeetCode problem and click the extension's toolbar icon on that tab, or paste its URL below. Other sites are not supported yet."; return; }
    await load(next);
  } catch { status.textContent = "Chrome did not grant access to this tab. Click the toolbar icon on a LeetCode problem, or use its URL below."; }
});
element("url-form").addEventListener("submit", event => {
  event.preventDefault();
  const next = parseProblem(element<HTMLInputElement>("problem-url").value.trim());
  if (!next) { status.textContent = "Use an HTTPS LeetCode problem URL, such as https://leetcode.com/problems/two-sum/."; return; }
  void load(next);
});
note.addEventListener("input", () => { draft.notes[draft.stage] = note.value.slice(0, 1500); dirty = true; status.textContent = "Unsaved notes. Save or export before closing the panel."; });
topic.addEventListener("change", () => { draft.topic = topic.value as Topic; dirty = true; nudges = 0; render(); });
element("nudge").addEventListener("click", () => {
  const hints = topicHints[draft.topic];
  if (nudges >= hints.length) return;
  const item = document.createElement("p"); item.textContent = hints[nudges++]; element("nudge-list").append(item);
  element<HTMLButtonElement>("nudge").disabled = nudges >= hints.length;
});
element("next").addEventListener("click", () => {
  if (!draft.notes[draft.stage].trim()) { status.textContent = "Write one idea, question or uncertainty first. It does not need to be correct."; note.focus(); return; }
  if (draft.stage < stages.length - 1) { draft.stage++; nudges = 0; dirty = true; render(); element("question").focus(); }
  else {
    const list = element("review"); list.replaceChildren();
    const heading = document.createElement("p"); heading.textContent = "Self-review, not an AI grade. Can you answer these without looking at a solution?"; list.append(heading);
    stages.forEach(stage => stage.review.forEach(question => { const item = document.createElement("p"); item.textContent = question; list.append(item); }));
  }
});
element("save").addEventListener("click", async () => {
  if (!problem || loading) return;
  busy(true);
  const serialized = JSON.stringify(draft);
  try { await chrome.storage.local.set({ [key()]: JSON.parse(serialized) }); dirty = JSON.stringify(draft) !== serialized; status.textContent = dirty ? "Saved the earlier version. You have newer unsaved changes." : "Saved on this device for this problem. No account sync."; }
  catch { status.textContent = "Could not save. Your notes remain in this panel; export before closing."; }
  finally { busy(false); }
});
element("export").addEventListener("click", () => {
  if (!problem) return;
  const url = URL.createObjectURL(new Blob([exportNotes(problem, draft)], { type: "text/markdown;charset=utf-8" }));
  const link = document.createElement("a"); link.href = url; link.download = `${problem.slug}-socratic-notes.md`; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
element("delete").addEventListener("click", async () => {
  if (!problem || loading || !window.confirm("Delete saved notes and the open draft for this problem?")) return;
  busy(true);
  try { await chrome.storage.local.remove(key()); draft = emptyDraft(); dirty = false; nudges = 0; render(); status.textContent = "Notes deleted for this problem."; }
  catch { status.textContent = "Could not delete saved notes. Your open draft is unchanged."; }
  finally { busy(false); }
});
