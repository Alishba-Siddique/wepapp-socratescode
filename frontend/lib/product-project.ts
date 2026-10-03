import type { CodingProblem } from "./coding-problems.ts";

export const inboxProblem: CodingProblem = {
  slug: "project-notification-inbox", title: "An inbox that remembers", topic: "Product engineering", level: "Developing",
  description: "Build the data transformation behind a notification inbox. A delivery may be retried, so the same notification ID can arrive more than once. Keep the first event for each ID, preserve first-arrival order, and mark which notifications have been read.",
  contract: "data contains events (objects with id and message) and readIds (strings). Return {items: [{id, message, read}], unread: number}. Keep the first message for each ID. read is a boolean determined by membership in readIds. Ignore read IDs that have no event.",
  constraints: ["events and readIds each contain 0–50 entries.", "IDs and messages are nonempty strings of at most 80 characters. Inputs already follow this schema.", "Two different IDs may have the same message. Do not merge them.", "This is a single-batch in-memory exercise, not a durable or concurrent notification service."],
  hints: ["What identifies a notification: its message or its ID?", "What information tells you whether an ID has appeared earlier?", "Which collection preserves first-arrival order? Which question only needs a membership check?", "Should a read ID without a matching event change the unread count?"],
  tests: [
    { name: "One new message", input: { events: [{id:"a",message:"Welcome"}],readIds:[] }, expected: {items:[{id:"a",message:"Welcome",read:false}],unread:1} },
    { name: "A retried delivery", input: {events:[{id:"a",message:"Welcome"},{id:"a",message:"Welcome"}],readIds:[]}, expected:{items:[{id:"a",message:"Welcome",read:false}],unread:1} },
    { name: "First arrival wins", input:{events:[{id:"b",message:"First"},{id:"a",message:"Second"},{id:"b",message:"Changed"}],readIds:["b"]}, expected:{items:[{id:"b",message:"First",read:true},{id:"a",message:"Second",read:false}],unread:1} },
    { name: "Same words, different notifications", input:{events:[{id:"a",message:"Update"},{id:"b",message:"Update"}],readIds:[]}, expected:{items:[{id:"a",message:"Update",read:false},{id:"b",message:"Update",read:false}],unread:2} },
    { name: "Unknown and repeated read IDs", input:{events:[{id:"a",message:"Ready"}],readIds:["missing","a","a"]}, expected:{items:[{id:"a",message:"Ready",read:true}],unread:0} },
    { name: "No deliveries", input:{events:[],readIds:["missing"]}, expected:{items:[],unread:0} },
  ],
};

export const inboxTrace = [
  { event:"Before deliveries", ids:[], unread:0, explanation:"The inbox is empty. The read list contains b, but no notification has arrived." },
  { event:"a: Build finished", ids:["a"], unread:1, explanation:"a is a new ID and is not in the read list. Keep it as unread." },
  { event:"b: Review requested", ids:["a","b"], unread:1, explanation:"b is new and is already in the read list. Keep it, but do not increase unread." },
  { event:"a: Build finished (retry)", ids:["a","b"], unread:1, explanation:"a is already present. A repeated delivery does not add a second notification." },
] as const;

export type ProjectDraft = {version:1; briefAccepted:boolean; traceSeen:number; plan:string; review:string};
export function emptyProjectDraft(): ProjectDraft { return {version:1,briefAccepted:false,traceSeen:0,plan:"",review:""}; }
export function parseProjectDraft(raw:string|null): ProjectDraft {
  if (!raw || raw.length>20000) return emptyProjectDraft();
  try {
    const value:unknown=JSON.parse(raw);
    if (!value || typeof value!=="object" || Array.isArray(value)) return emptyProjectDraft();
    const row=value as Record<string,unknown>;
    if (row.version!==1 || typeof row.briefAccepted!=="boolean" || !Number.isInteger(row.traceSeen) || Number(row.traceSeen)<0 || Number(row.traceSeen)>=inboxTrace.length || (!row.briefAccepted && row.traceSeen!==0) || typeof row.plan!=="string" || row.plan.length>1500 || typeof row.review!=="string" || row.review.length>1500) return emptyProjectDraft();
    return {version:1,briefAccepted:row.briefAccepted,traceSeen:Number(row.traceSeen),plan:row.plan,review:row.review};
  } catch { return emptyProjectDraft(); }
}
export function projectMarkdown(draft:ProjectDraft) {
  const literal=(text:string)=>text.split(/\r?\n/).map(line=>"    "+line).join("\n");
  return `# My notification inbox project\n\nLocal learning notes, not a verified assessment or production service.\n\n## My plan\n\n${literal(draft.plan)}\n\n## My engineering review\n\n${literal(draft.review)}\n`;
}
