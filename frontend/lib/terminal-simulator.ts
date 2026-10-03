export type TerminalState = {
  cwd:string; remote:boolean; localCwd:string; notes:string; staged:string|null;
  committed:string; reviewed:string|null; commits:{message:string;content:string}[]; evidence:string[];
};
export type TerminalResult={state:TerminalState;output:string;code:number};
const localRoot="/workspace/project", remoteRoot="/srv/project";
const localLog="INFO service started\nERROR payment timed out\nINFO retry scheduled\nERROR inventory unavailable\n";
const remoteLog="INFO connected to staging\nERROR database connection refused\n";
export function initialTerminal():TerminalState {return {cwd:localRoot,localCwd:localRoot,remote:false,notes:"Observe before changing.\n",staged:null,committed:"Observe before changing.\n",reviewed:null,commits:[],evidence:[]};}
type Token={value:string;operator:boolean};
function tokens(command:string):Token[] {
  if(!command.trim() || command.length>240 || /[\n\r]/.test(command) || command.includes(String.fromCharCode(0)))throw new Error("Enter one command of at most 240 characters.");
  const result:Token[]=[];let word="",quote="",started=false;
  const flush=()=>{if(started){result.push({value:word,operator:false});word="";started=false;}};
  for(const char of command){
    if(quote){if(char===quote)quote="";else {if(quote==='"' && /[$`\\]/.test(char))throw new Error("Expansion and escapes are outside this simulator's subset.");word+=char;}continue;}
    if(char==="'" || char==='"'){quote=char;started=true;}
    else if(/\s/.test(char))flush();
    else if(char==="|" || char===">"){flush();result.push({value:char,operator:true});}
    else if(/[;&$`\\<*?()]/.test(char))throw new Error("This simulator supports listed commands, simple quotes, one-file echo redirection and read-only pipes. No expansion, chaining or scripts.");
    else {word+=char;started=true;}
  }
  if(quote)throw new Error("Close the matching quote before running the command.");flush();return result;
}
function resolvePath(cwd:string,path:string) {
  const parts=(path.startsWith("/")?path:cwd+"/"+path).split("/");const result:string[]=[];
  for(const part of parts){if(part==="..")result.pop();else if(part && part!==".")result.push(part);}
  return "/"+result.join("/");
}
function mark(state:TerminalState,item:string){if(!state.evidence.includes(item))state.evidence.push(item);}
export function terminalGoal(id:string,state:TerminalState):boolean {
  const has=(item:string)=>state.evidence.includes(item);
  if(id==="files")return has("local-log-location")&&has("local-errors");
  if(id==="pipes")return has("error-count");
  if(id==="git")return has("reviewed-commit")&&has("uncommitted-inspected")&&state.notes!==state.committed;
  if(id==="ssh")return has("remote-location")&&has("remote-errors")&&has("returned-local");
  if(id==="security")return has("own-order")&&has("denied-order")&&has("trusted-price")&&has("invalid-quantity");
  return false;
}
export function runTerminal(current:TerminalState,command:string):TerminalResult {
  const state:TerminalState={...current,commits:[...current.commits],evidence:[...current.evidence]};
  const fail=(output:string,code=2):TerminalResult=>({state:current,output,code});
  try {
    const parsed=tokens(command);const redirect=parsed.findIndex(t=>t.operator&&t.value===">");
    if(redirect>=0){
      if(state.remote || parsed[0]?.value!=="echo" || redirect!==2 || parsed.length!==4 || parsed[1].operator || parsed[3].operator || resolvePath(state.cwd,parsed[3].value)!==localRoot+"/notes.txt")return fail("Only echo 'your note' > notes.txt in the local project is supported. Redirection replaces this fictional file.");
      state.notes=parsed[1].value+"\n";return {state,output:"",code:0};
    }
    const groups:string[][]=[[]];
    for(const token of parsed){if(token.operator){if(!groups.at(-1)?.length)throw new Error("A pipe needs a command on both sides.");groups.push([]);}else groups.at(-1)!.push(token.value);}
    if(!groups.at(-1)?.length || groups.length>3)throw new Error("Use one to three commands with no empty pipe segment.");
    if(groups.length>1 && groups.some(g=>!["cat","grep","wc"].includes(g[0])))return fail("Pipelines here support cat, grep -F and wc -l only; they do not change files.");
    let output="",code=0;let errorLines=false;
    const root=state.remote?remoteRoot:localRoot;
    const files:Record<string,string>={[root+"/README.md"]:"This is a fictional learning project. Inspect before changing.\n",[root+"/logs/app.log"]:state.remote?remoteLog:localLog,[root+"/notes.txt"]:state.remote?"Staging notes.\n":state.notes};
    const read=(path:string)=>{const full=resolvePath(state.cwd,path);if(!Object.hasOwn(files,full))throw new Error("No such fictional file: "+path);return files[full];};
    for(let i=0;i<groups.length;i++){
      const args=groups[i],name=args[0],stdin=i>0?output:undefined;
      code=0;
      if(name==="pwd" && args.length===1){output=state.cwd+"\n";if(state.remote)mark(state,"remote-location");else if(state.cwd===localRoot+"/logs")mark(state,"local-log-location");else if(state.evidence.includes("remote-errors"))mark(state,"returned-local");}
      else if(name==="hostname" && args.length===1)output=state.remote?"practice.test\n":"your-laptop (simulated)\n";
      else if(name==="ls" && (args.length===1 || (args.length===2&&args[1]==="-a")))output=(args[1]==="-a"?".\n..\n":"")+(state.cwd===root+"/logs"?"app.log\n":"README.md\nlogs/\nnotes.txt\n");
      else if(name==="cd" && args.length===2){const next=resolvePath(state.cwd,args[1]);if(![root,root+"/logs"].includes(next))return fail("That directory is outside this fictional project's two-directory filesystem.",1);state.cwd=next;output="";}
      else if(name==="cat" && args.length===2)output=read(args[1]);
      else if(name==="grep" && args[1]==="-F" && (args.length===4 || (args.length===3&&stdin!==undefined))){const input=args.length===4?read(args[3]):stdin!;const lines=input.split("\n");if(lines.at(-1)==="")lines.pop();const found=lines.filter(line=>line.includes(args[2]));output=found.length?found.join("\n")+"\n":"";code=found.length?0:1;
        if(args[2]==="ERROR" && input===(state.remote?remoteLog:localLog)){mark(state,state.remote?"remote-errors":"local-errors");errorLines=!state.remote;}
      }
      else if(name==="wc" && args[1]==="-l" && (args.length===3 || (args.length===2&&stdin!==undefined))){const input=args.length===3?read(args[2]):stdin!;const count=(input.match(/\n/g)||[]).length;output=String(count)+(args.length===3?" "+args[2]:"")+"\n";if(i>0&&errorLines&&count===2)mark(state,"error-count");}
      else if(name==="echo" && args.length===2)output=args[1]+"\n";
      else if(name==="ssh" && args.length===2 && args[1]==="learner@practice.test" && !state.remote){state.localCwd=state.cwd;state.cwd=remoteRoot;state.remote=true;output="SIMULATED connection. Host fingerprint was verified through a trusted channel in this exercise. No network connection or credentials are used.\n";}
      else if(name==="exit" && args.length===1 && state.remote){state.remote=false;state.cwd=state.localCwd;output="Simulated remote session closed. You are back on your laptop.\n";}
      else if(name==="git" && !state.remote && state.cwd===localRoot){
        if(args.length===2&&args[1]==="status"){output="On branch main (simulation)\n"+(state.staged!==null&&state.staged!==state.committed?"Changes staged for commit: notes.txt\n":"No staged changes\n")+(state.notes!==(state.staged??state.committed)?"Changes not staged: notes.txt\n":"No unstaged changes\n");if(state.commits.length&&state.notes!==state.committed)mark(state,"uncommitted-inspected");}
        else if(args.length===3&&args[1]==="add"&&args[2]==="notes.txt"){state.staged=state.notes;output="";}
        else if(args[1]==="diff"&&(args.length===2||(args.length===3&&args[2]==="--staged"))){const staged=args.length===3;const before=staged?state.committed:(state.staged??state.committed);const after=staged?(state.staged??state.committed):state.notes;if(staged)state.reviewed=state.staged;output=before===after?"":"Simplified diff for notes.txt\n- "+before.trimEnd()+"\n+ "+after.trimEnd()+"\n";}
        else if(args.length===4&&args[1]==="commit"&&args[2]==="-m"&&args[3].trim()){
          if(state.staged===null || state.staged===state.committed)return fail("Nothing changed in the staging area. git add captures a file's current contents.",1);
          if(state.commits.length>=8)return fail("Eight simulated commits reached. Reset the exercise to start again.",1);
          if(state.reviewed===state.staged)mark(state,"reviewed-commit");state.committed=state.staged;state.staged=null;state.commits.push({message:args[3],content:state.committed});output="[simulated commit "+state.commits.length+"] "+args[3]+"\nOnly staged content was recorded; nothing was pushed.\n";
        } else if(args.length===3&&args[1]==="log"&&args[2]==="--oneline")output=[...state.commits].reverse().map((c,n)=>"sim-"+(state.commits.length-n)+" "+c.message).join("\n")+"\nsim-0 Initial note\n";
        else return fail("Supported Git subset: status, diff, diff --staged, add notes.txt, commit -m 'message', log --oneline.");
      }
      else if(name==="curl" && args[1]==="-i"){
        if(args.length===3&&args[2]==="https://shop.test/orders/mine"){mark(state,"own-order");output='SIMULATED HTTP 200\n{"owner":"learner","totalCents":1200}\n';}
        else if(args.length===3&&args[2]==="https://shop.test/orders/someone-else"){mark(state,"denied-order");output='SIMULATED HTTP 403\n{"error":"Not permitted for this signed-in user"}\n';}
        else if(args.length===7&&args[2]==="-X"&&args[3]==="POST"&&args[4]==="https://shop.test/checkout"&&args[5]==="-d"){
          let body:unknown;try{body=JSON.parse(args[6]);}catch{return fail("Use a quoted JSON object for this simulated checkout.");}
          if(!body||typeof body!=="object"||Array.isArray(body))return fail("Checkout expects a JSON object.");
          const quantity=(body as Record<string,unknown>).quantity;
          if(!Number.isInteger(quantity)||Number(quantity)<1||Number(quantity)>5){mark(state,"invalid-quantity");output='SIMULATED HTTP 400\n{"error":"Quantity must be an integer from 1 to available stock 5"}\n';}
          else {if((body as Record<string,unknown>).unitPrice===1)mark(state,"trusted-price");output='SIMULATED HTTP 200\n'+JSON.stringify({quantity,totalCents:1200*Number(quantity),priceSource:"server catalog; client unitPrice ignored"})+"\n";}
        }else return fail("curl never connects to the internet here. Only the three shop.test lesson requests are supported.");
      }
      else return fail("Command or options not supported in this simulation. Read the exercise's command examples; no real command was executed.",127);
    }
    return {state,output:output.slice(0,3000),code};
  }catch(error){return fail(error instanceof Error?error.message:"Could not interpret the command.");}
}
