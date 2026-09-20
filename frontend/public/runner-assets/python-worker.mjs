import { loadPyodide } from "../python-runtime/pyodide.mjs";
self.onmessage = async event => {
  const { code, tests } = event.data;
  let output = "";
  const append = text => { if(output.length < 12000) output += String(text).slice(0,12000-output.length)+"\n"; };
  try {
    const py = await loadPyodide({ indexURL:new URL("../python-runtime/",import.meta.url).href, stdout:append, stderr:append });
    self.postMessage({type:"running"});
    // Only problem inputs and learner code cross this boundary. No session,
    // account state, hidden answers, network service or application capability.
    py.globals.set("__learner_source", code);
    py.globals.set("__test_inputs", JSON.stringify(tests));
    const result = await py.runPythonAsync(`
import json as __json
import traceback as __traceback
__namespace = {"__name__": "__main__"}
__results = []
try:
    exec(compile(__learner_source, "solution.py", "exec"), __namespace)
    __solve = __namespace.get("solve")
    if not callable(__solve):
        raise TypeError("Define a function named solve(data).")
    for __input in __json.loads(__test_inputs):
        try:
            __value = __solve(__input)
            __results.append({"value": __json.loads(__json.dumps(__value, allow_nan=False))})
        except Exception as __error:
            __results.append({"error": type(__error).__name__ + ": " + str(__error)[:1000]})
except BaseException:
    __results = [{"error": __traceback.format_exc()[-3000:]}]
__json.dumps(__results, allow_nan=False)
`);
    self.postMessage({type:"result",result:JSON.parse(result),output:output.slice(0,12000)});
  } catch(error) { self.postMessage({type:"error",message:String(error.message || error).slice(0,3000),output:output.slice(0,12000)}); }
};
