(() => {
  "use strict";
  const O = window.EV_DATA,
    T = window.EV_TESTED;
  if (!O || !T) return;
  const root = document.documentElement;
  const motion = root.classList.contains("motion");
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const SVG = "http://www.w3.org/2000/svg";
  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(SVG, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    parent && parent.append(n);
    return n;
  };
  const fmt1 = (v) => v.toFixed(1);

  /* ---------- Numbers from the data ---------- */
  const iv = T.impactVariation;
  const values = {
    worldFleet: O.world.fleet / 1e6,
    chinaShare: T.headline.chinaWorld,
  };
  const binds = {
    top5: fmt1(T.headline.top5World),
    chinaCountrySum: fmt1(T.headline.chinaCountrySum),
    countryRows: "59",
    spread: fmt1(iv.boePerEvMax / iv.boePerEvMin),
  };
  $$("[data-bind]").forEach((n) => {
    if (binds[n.dataset.bind] != null) n.textContent = binds[n.dataset.bind];
  });
  $$("[data-count]").forEach((n) => {
    n.textContent = fmt1(values[n.dataset.count]);
  });

  /* ---------- 02: 100 dots, China share ---------- */
  const dots = $("#shareDots");
  const on = Math.round(T.headline.chinaWorld);
  for (let i = 0; i < 100; i++) {
    const d = document.createElement("i");
    if (i < on) {
      d.className = "on";
      d.style.transitionDelay = i * 8 + "ms";
    }
    dots.append(d);
  }

  /* ---------- 04: rolling 12-month sales bars ---------- */
  const sales = [...T.sales].sort((a, b) => b.rolling12 - a.rolling12);
  $("#salesBars").innerHTML = sales
    .map(
      (r) =>
        `<div class="sb-row${r.area === "China" ? " hl" : ""}"><span>${r.area}</span><span class="sb-track" aria-hidden="true"><span class="sb-fill" style="--w:${r.rolling12}%"></span></span><b>${fmt1(r.rolling12)}%</b></div>`
    )
    .join("");

  /* ---------- 05: min / median / max dot plot ---------- */
  const pos = { min: iv.boePerEvMin, median: iv.boePerEvMedian, max: iv.boePerEvMax };
  const xPct = (v) => ((v - iv.boePerEvMin) / (iv.boePerEvMax - iv.boePerEvMin)) * 100;
  $$("#dotplot [data-pos]").forEach((n) => {
    const v = pos[n.dataset.pos];
    n.style.setProperty("--x", xPct(v) + "%");
    if (n.tagName === "B") n.textContent = v.toFixed(3);
  });

  /* ---------- 03: poppy chart ---------- */
  const svg = $("#poppyChart");
  const top5 = [...T.top5].sort((a, b) => a.fleet - b.fleet); // smallest → largest
  const MAXV = 55e6,
    BASE = 500,
    TOP = 40,
    X0 = 30,
    X1 = 900;
  const y = (v) => BASE - (v / MAXV) * (BASE - TOP);
  const defs = el("defs", {}, svg);
  const grad = el("radialGradient", { id: "petal", cx: "35%", cy: "30%", r: "75%" }, defs);
  [
    ["0%", "#f6907c"],
    ["55%", "#e0463a"],
    ["100%", "#a3222b"],
  ].forEach(([o, c]) => el("stop", { offset: o, "stop-color": c }, grad));
  const grad2 = el("radialGradient", { id: "petalBack", cx: "50%", cy: "50%", r: "70%" }, defs);
  [
    ["0%", "#c8343a"],
    ["100%", "#8f1c24"],
  ].forEach(([o, c]) => el("stop", { offset: o, "stop-color": c }, grad2));

  /* One poppy head of radius R, centred on the parent group: back petals, front petals, veins, centre, stamens */
  function paintBloom(parent, R, rot = 0) {
    [0, 90, 180, 270].forEach((a) =>
      el(
        "ellipse",
        {
          cx: 0,
          cy: -R * 0.48,
          rx: R * 0.6,
          ry: R * 0.56,
          fill: "url(#petalBack)",
          transform: `rotate(${a + 45 + rot})`,
        },
        parent
      )
    );
    [0, 90, 180, 270].forEach((a) =>
      el(
        "ellipse",
        {
          cx: 0,
          cy: -R * 0.44,
          rx: R * 0.56,
          ry: R * 0.54,
          fill: "url(#petal)",
          transform: `rotate(${a + 8 + rot})`,
        },
        parent
      )
    );
    [20, 100, 190, 280].forEach((a) =>
      el(
        "path",
        {
          d: `M0,${-R * 0.25} Q${R * 0.12},${-R * 0.55} ${R * 0.05},${-R * 0.88}`,
          fill: "none",
          stroke: "#f9c0b0",
          "stroke-width": Math.max(0.6, R / 50),
          "stroke-opacity": 0.75,
          transform: `rotate(${a + rot})`,
        },
        parent
      )
    );
    el("circle", { r: R * 0.2, fill: "#2b1d1a" }, parent);
    for (let k = 0; k < 7; k++) {
      const a = (k / 7) * Math.PI * 2;
      el(
        "circle",
        {
          cx: Math.cos(a) * R * 0.1,
          cy: Math.sin(a) * R * 0.1,
          r: Math.max(0.6, R * 0.025),
          fill: "#f2c38f",
        },
        parent
      );
    }
  }

  /* ---------- Hero illustration: five poppies, smallest to largest (decorative echo of chart 03) ---------- */
  const hero = $("#heroArt");
  if (hero) {
    const HB = 560; // ground line
    el("line", { class: "ha-ground", x1: 0, x2: 600, y1: HB, y2: HB }, hero);
    // x, head height, radius, lean — the last (tallest) poppy stands for China
    const plants = [
      [70, 470, 26, -8],
      [165, 440, 30, 6],
      [255, 400, 34, -5],
      [355, 320, 44, 7],
      [490, 120, 92, -4],
    ];
    plants.forEach(([x, hy, R, lean], i) => {
      const g = el(
        "g",
        { class: "ha-plant", style: `--i:${i};transform-origin:${x}px ${HB}px` },
        hero
      );
      const tx = x + lean * 2;
      const P = [
        [x, HB],
        [x - 6, (HB + hy) / 2 + 30],
        [tx - lean * 3, hy + (HB - hy) * 0.25],
        [tx, hy + R * 0.6],
      ];
      el("path", { class: "ha-stem", pathLength: 1, d: `M${P[0]} C${P[1]} ${P[2]} ${P[3]}` }, g);
      // a leaf on the taller stems, anchored to a point on the stem curve
      if (i >= 2) {
        const t = 0.32,
          u = 1 - t,
          bez = (k) =>
            u * u * u * P[0][k] +
            3 * u * u * t * P[1][k] +
            3 * u * t * t * P[2][k] +
            t * t * t * P[3][k];
        const lx = bez(0),
          ly = bez(1),
          L = 30 + i * 6,
          side = i % 2 ? 1 : -1; // alternate left / right
        el(
          "path",
          {
            class: "ha-leaf",
            d: `M${lx},${ly} q${side * L * 0.55},${-L * 0.42} ${side * L},${-L * 0.18} q${-side * L * 0.45},${L * 0.34} ${-side * L},${L * 0.18}z`,
          },
          g
        );
      }
      const head = el("g", { transform: `translate(${tx} ${hy})` }, g);
      const bloom = el("g", { class: "ha-bloom" }, head);
      paintBloom(bloom, R, i * 17);
    });
    // a closed bud for rhythm
    el(
      "path",
      { class: "ha-stem ha-bud-stem", pathLength: 1, d: `M420,${HB} C418,500 410,470 404,452` },
      hero
    );
    el(
      "ellipse",
      { class: "ha-bud", cx: 403, cy: 444, rx: 8, ry: 12, transform: "rotate(-14 403 444)" },
      hero
    );
  }

  for (let v = 0; v <= 50e6; v += 10e6) {
    if (v) el("line", { class: "pc-grid", x1: X0, x2: X1 + 20, y1: y(v), y2: y(v) }, svg);
    el("text", { class: "pc-axis", x: 985, y: y(v) + 5, "text-anchor": "end" }, svg).textContent = v
      ? v / 1e6 + (v === 50e6 ? "M" : "")
      : "0";
  }
  el("line", { class: "pc-base", x1: X0, x2: X1 + 20, y1: BASE, y2: BASE }, svg);

  const xs = [110, 270, 430, 590, 800];
  const maxFleet = top5.at(-1).fleet;
  const flowers = top5.map((r, i) => {
    const cx = xs[i],
      cy = y(r.fleet),
      R = 7 + 60 * Math.sqrt(r.fleet / maxFleet);
    const g = el("g", {}, svg);
    // stem: starts left of the flower on the baseline and curves up into it
    const sx = cx - Math.max(10, R * 0.55),
      stemTop = cy + R * 0.55;
    const stem = el(
      "path",
      {
        class: "pc-stem",
        d: `M${sx},${BASE} C${sx - 4},${(BASE + stemTop) / 2} ${cx - R * 0.5},${stemTop + (BASE - stemTop) * 0.25} ${cx - R * 0.15},${stemTop}`,
      },
      g
    );
    const head = el("g", { transform: `translate(${cx} ${cy})` }, g);
    const bloom = el("g", {}, head);
    paintBloom(bloom, R);
    const value = el("text", { class: "pc-value", x: cx, y: cy - R - 18 }, g);
    value.textContent = (r.fleet / 1e6).toFixed(1) + "M";
    el("text", { class: "pc-name", x: cx, y: BASE + 42 }, g).textContent = r.area;
    const len = stem.getTotalLength();
    stem.style.strokeDasharray = len;
    return { stem, bloom, value, len };
  });
  function drawPoppies(p) {
    flowers.forEach((f, i) => {
      const t = clamp((p - i * 0.13) / 0.35);
      const s = ease(clamp((t - 0.45) / 0.55));
      f.stem.style.strokeDashoffset = f.len * (1 - ease(clamp(t / 0.6)));
      f.bloom.setAttribute(
        "transform",
        `scale(${s.toFixed(3)}) rotate(${((1 - s) * -40).toFixed(1)})`
      );
      f.value.style.opacity = clamp((t - 0.75) / 0.25);
    });
  }

  /* ---------- Count-up for big numbers ---------- */
  function countUp(panel) {
    $$("[data-count]", panel).forEach((n) => {
      const target = values[n.dataset.count];
      if (!motion) {
        n.textContent = fmt1(target);
        return;
      }
      const t0 = performance.now(),
        d = 1200;
      const tick = (now) => {
        const t = clamp((now - t0) / d);
        n.textContent = fmt1(target * ease(t));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  /* ---------- Horizontal scroll driven by vertical scroll ---------- */
  const art = $("#art"),
    track = $("#track"),
    bar = $("#artProgress");
  const panels = $$(".panel", track);
  const poppyPanel = $("#poppyPanel");
  root.classList.add("h-scroll");
  let maxX = 0,
    vw = 0,
    ticking = false;

  function layout() {
    vw = window.innerWidth;
    maxX = Math.max(0, track.scrollWidth - vw);
    const stageH = window.innerHeight - 72;
    art.style.height = maxX + stageH + 72 + "px";
    update();
  }
  function update() {
    ticking = false;
    const start = art.offsetTop;
    const p = maxX ? clamp((window.scrollY - start) / maxX) : 0;
    const x = p * maxX;
    track.style.transform = `translate3d(${-x.toFixed(1)}px,0,0)`;
    bar.style.transform = `scaleX(${p.toFixed(4)})`;
    // Reveal on entry from either side; reset once fully off-screen so it replays next time.
    panels.forEach((panel) => {
      const left = panel.offsetLeft - x,
        right = left + panel.offsetWidth;
      const isIn = panel.classList.contains("is-in");
      const entering = left < vw * 0.72 && right > vw * 0.28;
      const gone = left >= vw || right <= 0;
      if (!isIn && entering) {
        panel.classList.add("is-in");
        countUp(panel);
      } else if (isIn && gone) {
        panel.classList.remove("is-in");
        // Off to the left → it will come back from the left when scrolling back
        panel.classList.toggle("from-left", right <= 0);
      }
    });
    // poppy scrub: 0 when the panel enters from the right, 1 when it is centred
    const pl = poppyPanel.offsetLeft - x,
      pw = poppyPanel.offsetWidth;
    drawPoppies(motion ? clamp((vw - pl) / (vw * 0.5 + pw * 0.45)) : 1);
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", layout);
  // Left / right arrow keys move one panel-ish
  window.addEventListener("keydown", (e) => {
    if (e.target.closest("input,select,textarea,summary")) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      window.scrollBy({ top: vw * 0.6, behavior: motion ? "smooth" : "auto" });
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      window.scrollBy({ top: -vw * 0.6, behavior: motion ? "smooth" : "auto" });
    }
  });
  /* ---------- Sideways input moves the story too ---------- */
  // Page scroll position is the single source of truth; every input below just moves it.
  const moveBy = (dx) => window.scrollTo(0, window.scrollY + dx);

  // Trackpad side-swipe and Shift + mouse wheel
  window.addEventListener(
    "wheel",
    (e) => {
      if (e.ctrlKey) return; // pinch-zoom
      const sideways = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (sideways) {
        e.preventDefault();
        moveBy(e.deltaX);
      } else if (e.shiftKey && e.deltaY) {
        e.preventDefault();
        moveBy(e.deltaY);
      }
    },
    { passive: false }
  );

  // Touch: a left/right finger swipe moves the story; vertical swipes scroll as normal
  let touch = null;
  window.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length !== 1) return (touch = null);
      const t = e.touches[0];
      touch = { x: t.clientX, y: t.clientY, s: window.scrollY, axis: null };
    },
    { passive: true }
  );
  window.addEventListener(
    "touchmove",
    (e) => {
      if (!touch) return;
      const t = e.touches[0],
        dx = t.clientX - touch.x,
        dy = t.clientY - touch.y;
      if (!touch.axis && Math.hypot(dx, dy) > 8)
        touch.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (touch.axis === "x") {
        e.preventDefault();
        window.scrollTo(0, touch.s - dx * 1.2);
      }
    },
    { passive: false }
  );
  window.addEventListener("touchend", () => (touch = null), { passive: true });

  // Mouse: click and drag the stage left or right
  const stage = $(".stage");
  let drag = null;
  stage.addEventListener("pointerdown", (e) => {
    if (
      e.pointerType !== "mouse" ||
      e.button !== 0 ||
      e.target.closest("a,button,summary,input,select")
    )
      return;
    drag = { x: e.clientX, s: window.scrollY, moved: false };
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 4) {
      drag.moved = true;
      root.classList.add("is-dragging");
    }
    if (drag.moved) window.scrollTo(0, drag.s - dx);
  });
  const endDrag = () => {
    drag = null;
    root.classList.remove("is-dragging");
  };
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  layout();
})();
