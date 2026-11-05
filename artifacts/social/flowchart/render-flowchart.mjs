// EV project: renders the About package with the flowchart image in the poppy design language.
// 1. Runs the shared base renderer (unchanged) for about.txt and about-x.txt.
// 2. Replaces about-flowchart.png with this folder's poppy template.html (same post.json data).
// 3. Rebuilds story/story-2-flowchart-9x16.png on poppy paper, lower band free for the sticker.
// Usage (workspace root): node projects/monthly-ev-impact/artifacts/social/flowchart/render-flowchart.mjs
import fs from "fs";
import path from "path";
import os from "os";
import { execFileSync } from "child_process";
import { fileURLToPath, pathToFileURL } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const postDir = path.resolve(here, "..");
const root = path.resolve(here, "../../../../..");
const base = path.join(
  root,
  "run-framework/references/social-templates/framework-flowchart/render.mjs"
);

execFileSync(process.execPath, [base, postDir], { stdio: "inherit" });

const A = JSON.parse(fs.readFileSync(path.join(postDir, "post.json"), "utf8")).about;
const chrome =
  process.env.CHROME ||
  [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
  ].find((p) => fs.existsSync(p));
if (!chrome) throw new Error("Chrome not found; set CHROME to its path");

const tpl = fs.readFileSync(path.join(here, "template.html"), "utf8");
const tmp = path.join(here, `.render-${process.pid}.html`);
fs.writeFileSync(
  tmp,
  tpl.replace("</head>", `<script>window.ABOUT = ${JSON.stringify(A)};</script>\n  </head>`)
);
const png = path.join(postDir, "about-flowchart.png");
try {
  execFileSync(
    chrome,
    [
      "--headless=new",
      "--hide-scrollbars",
      "--window-size=1080,1350",
      "--allow-file-access-from-files",
      "--virtual-time-budget=3000",
      `--user-data-dir=${path.join(os.tmpdir(), "flowchart-chrome-poppy")}`,
      `--screenshot=${png}`,
      pathToFileURL(tmp).href,
    ],
    { stdio: "ignore" }
  );
} finally {
  fs.rmSync(tmp, { force: true });
}

// 9:16 story: the 4:5 image high on a 1080x1920 poppy-paper canvas (#fbf1de = --pp-paper)
execFileSync(
  "ffmpeg",
  [
    "-v",
    "error",
    "-y",
    "-i",
    png,
    "-vf",
    "pad=1080:1920:0:165:color=0xfbf1de",
    path.join(postDir, "story/story-2-flowchart-9x16.png"),
  ],
  { stdio: "inherit" }
);
console.log("poppy about-flowchart.png + story-2-flowchart-9x16.png written");
