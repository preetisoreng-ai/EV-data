// Writes one copy scene per beat (compositions/c-<id>.html) from a single template.
// Every word comes from window.EV_CONTENT (assets/content.js ← ../content.json) at runtime; nothing is typed here.
// Run after editing the template:  node tools/make-copy-scenes.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// beat id → slot length (s) must match the hosts in index.html
const beats = [
  { id: "fleet", dur: 4.0, first: true },
  { id: "china", dur: 6.0 },
  { id: "top5", dur: 7.0 },
  { id: "sales", dur: 7.5 },
  { id: "oil", dur: 6.5 },
  { id: "evidence", dur: 6.5, statement: true },
];

const scene = ({ id, dur, first, statement }) => `<template>
  <style>
    @font-face { font-family: "Source Serif 4"; src: url("assets/fonts/source-serif-4-latin.woff2") format("woff2"); font-weight: 400 600; }
    #root { position: absolute; inset: 0; container-type: size; color: var(--pp-ink); font-family: Inter, sans-serif; }
    #root .copy { position: absolute; left: 6cqw; width: 38cqw; top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: center; gap: 2.2cqh; }
    #root p, #root h1 { margin: 0; }
    #root .kicker, #root .label { font-weight: 700; font-size: 2.6cqh; letter-spacing: 0.18em; text-transform: uppercase; color: var(--pp-crimson); line-height: 1.25; }
    #root .title { font-family: "Source Serif 4", Georgia, serif; font-weight: 500; font-size: 7.4cqh; line-height: 1; letter-spacing: -0.025em; color: var(--pp-ink); }
    #root .big { font-weight: 900; font-size: 17cqh; line-height: 0.88; letter-spacing: -0.05em; font-variant-numeric: tabular-nums; color: var(--pp-crimson); }
    #root .first .big { color: var(--pp-ink); }
    #root .line { font-size: 3.4cqh; line-height: 1.25; color: var(--pp-ink); }
    #root .statement { font-family: "Source Serif 4", Georgia, serif; font-weight: 500; font-size: 6.2cqh; line-height: 1.06; letter-spacing: -0.025em; color: var(--pp-ink); }
    #root .note { font-size: 2.7cqh; line-height: 1.4; color: var(--pp-muted); }
    /* 9:16 */
    @container (aspect-ratio < 0.7) {
      #root .copy { left: 10cqw; width: 80cqw; top: 11cqh; bottom: auto; height: 35cqh; justify-content: flex-end; gap: 1.2cqh; }
      #root .kicker, #root .label { font-size: 2.7cqw; }
      #root .title { font-size: 6.6cqw; }
      #root .big { font-size: 19cqw; }
      #root .line { font-size: 3.7cqw; }
      #root .statement { font-size: 6.4cqw; }
      #root .note { font-size: 2.9cqw; }
    }
    /* 4:5 feed */
    @container (0.7 <= aspect-ratio < 0.9) {
      #root .copy { left: 15cqw; width: 70cqw; top: 15cqh; bottom: auto; height: 32cqh; justify-content: flex-end; gap: 1.1cqh; }
      #root .kicker, #root .label { font-size: 2.6cqw; }
      #root .title { font-size: 4.6cqw; }
      #root .big { font-size: 12cqw; }
      #root .line { font-size: 3.1cqw; }
      #root .statement { font-size: 5.2cqw; }
      #root .note { font-size: 2.6cqw; }
    }
    /* 1:1 */
    @container (0.9 <= aspect-ratio < 1.3) {
      #root .copy { left: 15cqw; width: 70cqw; top: 14cqh; bottom: auto; height: 29cqh; justify-content: flex-end; gap: 0.9cqh; }
      #root .kicker, #root .label { font-size: 2.6cqw; }
      #root .title { font-size: 4.0cqw; }
      #root .big { font-size: 10cqw; }
      #root .line { font-size: 2.8cqw; }
      #root .statement { font-size: 4.4cqw; }
      #root .note { font-size: 2.6cqw; }
    }
  </style>
  <div id="root" data-composition-id="c-${id}" data-width="1920" data-height="1080">
    <div class="copy${first ? " first" : ""}" id="c-${id}-copy" data-hold>
${
  first
    ? `      <p class="kicker" id="c-${id}-kicker"></p>
      <h1 class="title" id="c-${id}-title"></h1>
`
    : `      <p class="label" id="c-${id}-label"></p>
`
}${
  statement
    ? `      <p class="statement" id="c-${id}-line"></p>
`
    : `      <p class="big" id="c-${id}-big"></p>
      <p class="line" id="c-${id}-line"></p>
`
}      <p class="note" id="c-${id}-note"></p>
    </div>
  </div>
  <script>
    (function () {
      const C = window.EV_CONTENT;
      const ins = C.insights.find((x) => x.id === "${id}");
      const set = (sel, txt) => { const n = document.querySelector(sel); if (n) n.textContent = txt; };
      set("#c-${id}-kicker", C.kicker);
      set("#c-${id}-title", C.title);
      set("#c-${id}-label", ins.label);
      set("#c-${id}-big", ins.value);
      set("#c-${id}-line", ins.line);
      set("#c-${id}-note", ins.note);
      const parts = Array.from(document.querySelectorAll("#c-${id}-copy > *"));
      const tl = gsap.timeline({ paused: true });
${
  first
    ? `      // Cover: fully composed at frame 0 — no entrance.
      tl.set(parts, { opacity: 1, y: 0 }, 0);
`
    : `      tl.fromTo(parts, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.1 }, 0.25);
`
}      tl.to(parts, { opacity: 0, duration: 0.3, ease: "power1.in" }, ${(dur - 0.35).toFixed(2)});
      window.__timelines["c-${id}"] = tl;
    })();
  </script>
</template>
`;

for (const b of beats)
  fs.writeFileSync(path.join(root, "compositions", `c-${b.id}.html`), scene(b));
console.log("wrote", beats.map((b) => `c-${b.id}`).join(", "));
