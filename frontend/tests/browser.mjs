import { chromium, firefox, webkit } from "@playwright/test";
import path from "node:path";
import { mkdirSync } from "node:fs";
import assert from "node:assert/strict";
const baseURL = process.env.WEB_APP_URL || "http://localhost:3001";
const artifactDir = path.resolve(process.env.TEST_ARTIFACT_DIR || "test-results/local");
mkdirSync(artifactDir, {recursive:true});
const engine = {chromium,firefox,webkit}[process.env.BROWSER || "chromium"];
if (!engine) throw new Error("Unsupported browser");
(async () => {
 const browser = await engine.launch({ channel: engine === chromium && process.platform === "win32" ? "msedge" : undefined, headless: true });
 const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
 const bypass=process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
 if(bypass){
  const origin=new URL(baseURL);
  if(origin.protocol!=="https:" || !origin.hostname.endsWith(".vercel.app"))throw new Error("Unsupported protected preview host");
  await context.route(origin.origin+"/**",route=>route.continue({headers:{...route.request().headers(),"x-vercel-protection-bypass":bypass}}));
 }
 // Authenticated preview traces can contain protection headers; never persist them.
 if(!bypass)await context.tracing.start({screenshots:true,snapshots:true});
 const page=await context.newPage();
 try {

  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  await page.goto(baseURL);
  await page.getByRole("link",{name:/Start your first lab/}).click();
  await page.getByRole("button",{name:/Continue to Run/}).click();
  await page.getByRole("status").filter({hasText:/whole-number prediction/}).waitFor();
  assert(await page.locator(".stage-navigation button").nth(1).isDisabled());
  await page.getByLabel("What will total print?").fill("7");
  await page.getByRole("button",{name:/Continue to Run/}).click();
  await page.getByRole("heading",{name:"Make every step visible."}).waitFor();
  for(let i=0;i<4;i++)await page.getByRole("button",{name:/Next trace step/}).click();
  await page.getByText("The trace prints 6.",{exact:false}).waitFor();
  await page.getByRole("button",{name:/Continue to Investigate/}).click();
  await page.getByLabel("print changes the value").check();
  await page.getByRole("button",{name:/Continue to Modify/}).click();
  await page.getByRole("status").filter({hasText:/Where is total first assigned/}).waitFor();
  await page.getByLabel("total is initialized before the loop").check();
  await page.getByRole("button",{name:/Continue to Modify/}).click();
  await page.getByLabel("Predict the new printed total").fill("99");
  await page.getByRole("button",{name:/Continue to Make/}).click();
  await page.getByRole("status").filter({hasText:/Follow each pass/}).waitFor();
  await page.getByLabel("Predict the new printed total").fill("10");
  await page.getByRole("button",{name:/Continue to Make/}).click();
  await page.getByLabel("Choose the inclusive upper bound").selectOption("5");
  await page.getByLabel("What helped you reach that target?").fill("The loop adds each value from one through five, giving fifteen.");
  await page.getByRole("button",{name:"Complete this lab"}).click();
  await page.getByRole("heading",{name:"A small problem. A new insight."}).waitFor();
  await page.reload();
  await page.getByRole("link",{name:/View my progress/}).click();
  await page.getByRole("heading",{name:"Your progress, earned."}).waitFor();
  assert((await page.locator(".lab-card").count()) === 1);
  await page.getByText("The loop adds each value from one through five, giving fifteen.").waitFor();
  await page.goto(baseURL + "/curriculum");
  await page.getByRole("searchbox",{name:"Find a lab"}).fill("evens");
  assert.equal(await page.locator(".lab-card").count(),1);
  await page.getByRole("searchbox",{name:"Find a lab"}).fill("nothing");
  await page.getByText(/No labs match/).waitFor();
  await page.goto(baseURL + "/patterns");
  await page.getByRole("heading",{name:/Find the pattern/}).waitFor();
  assert.equal(await page.locator(".pattern-card").count(),17);
  await page.getByRole("button",{name:"Heaps",exact:true}).click();
  assert.equal(await page.locator(".pattern-card").count(),3);
  await page.getByRole("searchbox",{name:"Find a pattern"}).fill("median");
  assert.equal(await page.locator(".pattern-card").count(),1);
  const guidance=page.locator(".pattern-card summary");
  await guidance.focus(); await guidance.press("Enter");
  assert.equal(await page.locator(".pattern-card details").getAttribute("open"),"");
  await page.getByText(/Every lower-half value/).waitFor();
  assert((await page.locator(".pattern-practice a").first().getAttribute("href")).startsWith("https://leetcode.com/problems/"));
  await page.getByRole("searchbox",{name:"Find a pattern"}).fill("unmatched-keyword");
  await page.getByRole("button",{name:"Clear filters"}).click();
  assert.equal(await page.locator(".pattern-card").count(),17);
  for(const width of [320,390,768]) {
   await page.setViewportSize({width,height:844});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),"pattern overflow at "+width);
  }
  await page.screenshot({path:path.join(artifactDir,"socrates-pattern-library.png")});
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(baseURL);
  await page.screenshot({path:path.join(artifactDir,"socrates-app-dashboard.png")});
  await page.goto(baseURL + "/learn/a-running-total");
  await page.getByRole("heading",{name:"A running total",exact:true}).waitFor();
  // Resize the mounted workspace. Repeated hard navigations cancel Next.js
  // prefetches and can surface WebKit access-control errors during teardown.
  for(const width of [390,320,768]) {
   await page.setViewportSize({width,height:844});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),"overflow at "+width);
  }
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:path.join(artifactDir,"socrates-app-mobile.png")});
  const menu=page.getByRole("button",{name:"Open navigation"});
  assert(await page.locator('.sidebar').isHidden());
  await menu.focus(); await menu.press('Enter');
  assert.equal(await page.evaluate(()=>document.activeElement?.textContent?.includes('Overview')),true);
  await page.keyboard.press('Escape');
  assert(await page.locator('.sidebar').isHidden());
  assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('aria-label')),'Open navigation');
  await menu.click();
  await page.getByRole("link",{name:/Learning path/}).first().click();
  await page.getByRole("heading",{name:"Your learning path."}).waitFor();
  await page.evaluate(()=>localStorage.setItem("socratescode:lessons:v1","broken json"));
  await page.reload();
  await page.getByRole("heading",{name:"Your learning path."}).waitFor();
  const response=await page.goto(baseURL + "/learn/missing-lab");
  assert.equal(response.status(),404);
  await page.getByRole("heading",{name:"This lab is not here."}).waitFor();
  assert.equal(errors.length,0,errors.join("\n"));
  console.log("PASS: full PRIMM flow, wrong answers, saved progress, pattern filters and keyboard guidance, mobile navigation, corrupt storage, and unknown routes");
 } catch(error) {
  await page.screenshot({path:path.join(artifactDir,"failure.png"),fullPage:true}).catch(()=>{});
  if(!bypass)await context.tracing.stop({path:path.join(artifactDir,"trace.zip")});
  throw error;
 } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
