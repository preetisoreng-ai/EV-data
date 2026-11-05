// Generates the film's data and style inputs from their sources of truth. Never edit the outputs by hand.
//   assets/content.js      ← ../content.json (locked content, v-numbered)
//   assets/poppy-tokens.css ← ../../site/shared/poppy.css (the --pp-* tokens, copied unchanged)
// Run before check/render:  node tools/build-assets.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const project = path.resolve(root, "..", "..");

const content = JSON.parse(fs.readFileSync(path.join(root, "..", "content.json"), "utf8"));
fs.writeFileSync(
  path.join(root, "assets", "content.js"),
  `// GENERATED from artifacts/content.json v${content.version} by tools/build-assets.mjs — do not edit\nwindow.EV_CONTENT = ${JSON.stringify(content, null, 2)};\n`
);

// The infographic reads the same generated module
fs.copyFileSync(path.join(root, "assets", "content.js"), path.join(root, "..", "infographic", "content.js"));
const css = fs.readFileSync(path.join(project, "site", "shared", "poppy.css"), "utf8");
const tokens = [...css.matchAll(/^\s*(--pp-[a-z0-9-]+)\s*:\s*([^;]+);/gm)].map(
  ([, k, v]) => `  ${k}: ${v.trim()};`
);
if (tokens.length < 15) throw new Error("poppy tokens not found in site/shared/poppy.css");
fs.writeFileSync(
  path.join(root, "assets", "poppy-tokens.css"),
  `/* GENERATED from site/shared/poppy.css by tools/build-assets.mjs — do not edit */\n:root {\n${tokens.join("\n")}\n}\n`
);
console.log(
  `content v${content.version} → assets/content.js; ${tokens.length} tokens → assets/poppy-tokens.css`
);
