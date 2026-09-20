// Fetch reviewed exercise specifications as DATA. Never execute repository code.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
const repository="exercism/problem-specifications";
const destination="frontend/lib/data/github-problems.json";
const manifestPath="docs/reference/github-import/manifest.json";
const selections=[
  ["isogram","Isogram","Sets & strings","Return whether data.phrase contains no repeated letters, ignoring case, spaces and hyphens."],
  ["pangram","Pangram","Sets & strings","Return whether data.sentence contains every English alphabet letter, ignoring case."],
  ["leap","Leap year","Boolean logic","Return whether data.year is a leap year under the Gregorian rules."],
  ["reverse-string","Reverse a string","Sequences","Return data.value with its characters in reverse order."],
  ["raindrops","Raindrops","Divisibility","Return the raindrop string for data.number using the rules in the description."],
  ["armstrong-numbers","Armstrong numbers","Digits & arithmetic","Return whether data.number equals the sum of each digit raised to the number of digits."],
  ["hamming","Hamming distance","Parallel traversal","Return the count of differing positions in data.strand1 and data.strand2. This adaptation includes only equal-length strands."],
  ["scrabble-score","Scrabble score","Lookup tables","Return the letter score of data.word, ignoring case."],
];
async function get(url) {
  const response=await fetch(url,{headers:{"User-Agent":"socratescode-content-import","Accept":"application/vnd.github+json"},signal:AbortSignal.timeout(20000)});
  if(!response.ok){const error=new Error(`Source download failed (${response.status}): ${url}`);error.status=response.status;throw error;}
  const text=await response.text();if(text.length>1000000)throw new Error("Source file exceeds import limit.");return text;
}
let prior;
try{prior=JSON.parse(await readFile(manifestPath,"utf8"));}catch{}
const revision=prior && !process.argv.includes("--refresh") ? prior.revision : JSON.parse(await get(`https://api.github.com/repos/${repository}/commits/main`)).sha;
if(!/^[a-f0-9]{40}$/.test(revision))throw new Error("Invalid source revision.");
const raw=`https://raw.githubusercontent.com/${repository}/${revision}`;
const license=await get(`${raw}/LICENSE`);
if(!license.includes("Permission is hereby granted, free of charge") || !license.includes("copyright notice"))throw new Error("Source license requires review before import.");
const hash=text=>createHash("sha256").update(text).digest("hex");
function leaves(cases){return cases.flatMap(item=>Array.isArray(item.cases)?leaves(item.cases):[item]);}
const problems=[];const sources=[];
for(const [slug,title,topic,contract] of selections){
  const prefix=`exercises/${slug}`;
  let descriptionPath=`${prefix}/description.md`;
  let description;
  let introduction="";
  try { description=await get(`${raw}/${descriptionPath}`); }
  catch(error) { if(error.status!==404)throw error; descriptionPath=`${prefix}/instructions.md`; description=await get(`${raw}/${descriptionPath}`); }
  if(descriptionPath.endsWith("instructions.md")) {
    try { introduction=await get(`${raw}/${prefix}/introduction.md`); } catch(error) { if(error.status!==404)throw error; }
  }
  const canonical=await get(`${raw}/${prefix}/canonical-data.json`);
  const data=JSON.parse(canonical);
  if(data.exercise!==slug || !Array.isArray(data.cases))throw new Error(`Unexpected canonical schema: ${slug}`);
  const cases=leaves(data.cases).filter(item=>item.input && "expected" in item && !(typeof item.expected==="object" && item.expected!==null && "error" in item.expected)).slice(0,20);
  if(cases.length<3)throw new Error(`Not enough reviewed success cases: ${slug}`);
  problems.push({slug:`exercism-${slug}`,title,topic,level:"Foundation",description:description.replace(/^#+\s+.*$/gm,"").replace(/!\[[^\]]*\]\([^)]*\)/g,"").replace(/\[([^\]]+)\]\([^)]*\)/g,"$1").replace(/`/g,"").trim(),contract,constraints:["Use solve(data); data is the JSON object shown in each case.","This adaptation uses the selected public canonical cases listed below.","Return a JSON-compatible value; do not print the answer instead of returning it."],hints:["Can you work through the first example using only words and a small table?","Which input detail changes the decision you make at each step?","What boundary case could disprove your first approach?"],tests:cases.map(item=>({name:item.description,input:item.input,expected:item.expected})),source:{name:"Exercism contributors",repository,revision,url:`https://github.com/${repository}/tree/${revision}/${prefix}`,license:"MIT"}});
  const problem=problems.at(-1);
  problem.contract=problem.contract.replace(/data\.([A-Za-z]+)/g, 'data["$1"]');
  if(introduction)problem.description=introduction+"\n\n"+problem.description;
  problem.description=problem.description.replace(/~~~~[\s\S]*?~~~~/g,"").replace(/^\[[^\]]+\]:.*$/gm,"").replace(/\[([^\]]+)\]\[[^\]]+\]/g,"$1").replace(/\[([^\]]+)\]\([^)]*\)/g,"$1").replace(/^#+\s+/gm,"").replace(/\*\*/g,"").replace(/`/g,"").trim();
  sources.push({slug,descriptionPath,descriptionSha256:hash(description),introductionSha256:introduction?hash(introduction):null,canonicalSha256:hash(canonical),caseIds:cases.map(item=>item.uuid)});
}
await mkdir("frontend/lib/data",{recursive:true});await mkdir("docs/reference/github-import",{recursive:true});
await writeFile(destination,JSON.stringify(problems,null,2)+"\n");
await writeFile("docs/reference/github-import/LICENSE",license);
await writeFile(manifestPath,JSON.stringify({repository,revision,license:"MIT",licenseSha256:hash(license),sources},null,2)+"\n");
console.log(`Imported ${problems.length} licensed problems and ${problems.reduce((n,p)=>n+p.tests.length,0)} public cases from ${repository}@${revision.slice(0,7)}.`);
