import { createApp } from "./app.js";
import { readConfig } from "./config.js";
const config = readConfig(process.env);
const gateway = await createApp(config);
await gateway.app.listen(config.PORT, config.HOST);
console.log(`socratescode gateway listening on port ${config.PORT}`);
for (const signal of ["SIGINT", "SIGTERM"] as const) process.once(signal, () => { void gateway.close(); });
