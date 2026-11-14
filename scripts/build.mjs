import { cp, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");
const publicScripts = ["app.js", "auth-guard.js", "i18n.js", "login.js", "page-loader.js", "waste.js"];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const entry of await readdir(root, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith(".html")) {
    await cp(path.join(root, entry.name), path.join(output, entry.name));
  }
}

for (const file of publicScripts) {
  await cp(path.join(root, file), path.join(output, file));
}

for (const directory of ["assets", "data"]) {
  await cp(path.join(root, directory), path.join(output, directory), { recursive: true });
}

console.log("Static site built in dist/.");
