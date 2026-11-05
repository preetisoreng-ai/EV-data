(() => {
  const d = window.EV_DATA;
  if (!d) return;
  const fmt = new Intl.NumberFormat("en", { maximumFractionDigits: 1 });
  const compact = v => new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(v);
  const bind = (name, value) => document.querySelectorAll(`[data-bind="${name}"]`).forEach(el => el.textContent = value);
  bind("chinaFleetShare", fmt.format(d.concentration.chinaFleetShare));
  bind("worldFleet", compact(d.world.fleet));
  bind("worldOil", `${fmt.format(d.world.oilKboe / 1000)}m`);
  bind("worldPower", fmt.format(d.world.electricityGWh / 1000));
  bind("top5FleetShare", `${fmt.format(d.concentration.top5FleetShare)}%`);

  const fleetEl = document.querySelector("#fleetChart");
  const fleetRows = d.topFleet.slice(0, 8);
  if (!fleetRows.length) fleetEl.textContent = "No fleet data available.";
  else {
    const max = fleetRows[0].fleet;
    fleetEl.innerHTML = fleetRows.map((r, i) => `<div class="bar-row"><span class="bar-label">${r.area}</span><span class="bar-track" aria-hidden="true"><span class="bar-fill" style="width:${r.fleet/max*100}%;animation-delay:${i*.05}s"></span></span><span class="bar-value">${compact(r.fleet)}</span></div>`).join("");
  }

  const compareNames = ["China", "United States", "Norway", "Germany"];
  document.querySelector("#comparisonList").innerHTML = compareNames.map(name => {
    const r = d.topFleet.find(x => x.area === name);
    const share = r?.latestSales?.share;
    return `<div class="comparison-row"><strong>${name}</strong><span class="comparison-metric"><b>${compact(r.fleet)}</b>EV fleet</span><span class="comparison-metric"><b>${share == null ? "n.a." : fmt.format(share) + "%"}</b>latest EV sales share</span></div>`;
  }).join("");

  const markets = Object.keys(d.series).filter(k => d.series[k].length);
  const controls = document.querySelector("#marketControls");
  controls.innerHTML = markets.map((m, i) => `<button type="button" aria-pressed="${i===0}" data-market="${m}">${m}</button>`).join("");

  function renderLine(market) {
    const rows = d.series[market].filter(r => r.share != null);
    const el = document.querySelector("#shareChart");
    if (!rows.length) { el.textContent = "No sales-share data available."; return; }
    const W=760,H=330,p={l:44,r:18,t:18,b:38},min=new Date(rows[0].date).getTime(),max=new Date(rows.at(-1).date).getTime();
    const x=t=>p.l+(new Date(t).getTime()-min)/(max-min)*(W-p.l-p.r), y=v=>p.t+(100-v)/100*(H-p.t-p.b);
    const line=rows.map((r,i)=>`${i?"L":"M"}${x(r.date).toFixed(1)},${y(r.share).toFixed(1)}`).join(" ");
    const area=`${line} L${x(rows.at(-1).date)},${H-p.b} L${x(rows[0].date)},${H-p.b} Z`;
    const grids=[0,25,50,75,100].map(v=>`<line class="grid-line" x1="${p.l}" x2="${W-p.r}" y1="${y(v)}" y2="${y(v)}"/><text class="axis-text" x="${p.l-8}" y="${y(v)+4}" text-anchor="end">${v}%</text>`).join("");
    const years=[2020,2022,2024,2026].filter(v=>new Date(`${v}-01-01`).getTime()>=min&&new Date(`${v}-01-01`).getTime()<=max).map(v=>`<text class="axis-text" x="${x(`${v}-01-01`)}" y="${H-12}" text-anchor="middle">${v}</text>`).join("");
    el.innerHTML=`<svg viewBox="0 0 ${W} ${H}" aria-labelledby="lineTitle lineDesc"><title id="lineTitle">${market} monthly EV registration share</title><desc id="lineDesc">The share changes from ${fmt.format(rows[0].share)} percent in ${rows[0].date.slice(0,7)} to ${fmt.format(rows.at(-1).share)} percent in ${rows.at(-1).date.slice(0,7)}.</desc>${grids}<path class="series-area" d="${area}"/><path class="series-line" d="${line}"/>${years}<circle cx="${x(rows.at(-1).date)}" cy="${y(rows.at(-1).share)}" r="5" fill="#a3222b"/></svg>`;
    document.querySelector("#chartSummary").innerHTML=`<span class="summary-big">${fmt.format(rows.at(-1).share)}%</span><span class="summary-label">${market}<br>${rows.at(-1).date.slice(0,7)} · ${compact(rows.at(-1).registrations)} EV registrations</span>`;
  }
  controls.addEventListener("click", e => { const b=e.target.closest("button[data-market]"); if(!b)return; controls.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",String(x===b))); renderLine(b.dataset.market); });
  renderLine(markets[0]);
})();

