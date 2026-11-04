import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ""; }
    else if (c === '\n') { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field.replace(/\r$/, "")); rows.push(row); }
  const headers = rows.shift();
  return rows.filter(r => r.some(Boolean)).map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""])));
}

const load = name => parseCsv(fs.readFileSync(path.join(project, "data", "raw", name), "utf8"));
const fleet = load("monthly_ev_fleet_impact.csv");
const sales = load("monthly_ev_sales.csv");
const unique = (rows, key) => [...new Set(rows.map(r => r[key]))].sort();
const countBy = (rows, key) => Object.fromEntries([...rows.reduce((m, r) => m.set(r[key], (m.get(r[key]) || 0) + 1), new Map())].sort((a,b)=>b[1]-a[1]));
const num = v => v === "" ? null : Number(v);

const isoDates = unique(sales, "Date");
const countrySales = sales.filter(r => r["Area type"] === "Country or economy");
const ev = countrySales.filter(r => r.Drivetrain === "Electric vehicle (BEV+PHEV)");
const all = countrySales.filter(r => r.Drivetrain === "All drivetrains");
const latestByArea = new Map();
for (const r of ev) if (!latestByArea.has(r.Area) || r.Date > latestByArea.get(r.Area).Date) latestByArea.set(r.Area, r);
const latestRows = [...latestByArea.values()];

const fleetTop = [...fleet].sort((a,b)=>num(b["EV fleet (vehicles)"])-num(a["EV fleet (vehicles)"])).slice(0,15).map(r=>({
  area:r.Area,date:r["Latest available date"],fleet:num(r["EV fleet (vehicles)"]),electricityGWh:num(r["EV fleet electricity demand (GWh per year)"]),oilKboe:num(r["Oil displaced (thousand barrels of oil equivalent per year)"]),oilUsdM:num(r["Value of oil displaced (USD million per year)"])
}));
const evLatestTop = [...latestRows].sort((a,b)=>num(b["Share of registrations (%)"])-num(a["Share of registrations (%)"])).slice(0,20).map(r=>({area:r.Area,date:r.Date,registrations:num(r.Registrations),share:num(r["Share of registrations (%)"])}));

const profile = {
  fleet:{rows:fleet.length,columns:Object.keys(fleet[0]).length,areaTypes:countBy(fleet,"Area type"),dates:countBy(fleet,"Latest available date"),missing:Object.fromEntries(Object.keys(fleet[0]).map(k=>[k,fleet.filter(r=>r[k]==="").length])),top:fleetTop},
  sales:{rows:sales.length,columns:Object.keys(sales[0]).length,dateRange:[isoDates[0],isoDates.at(-1)],areas:unique(sales,"Area").length,countryAreas:unique(countrySales,"Area").length,areaTypes:countBy(sales,"Area type"),drivetrains:countBy(sales,"Drivetrain"),missing:Object.fromEntries(Object.keys(sales[0]).map(k=>[k,sales.filter(r=>r[k]==="").length])),duplicates:sales.length-new Set(sales.map(r=>[r.Area,r.Date,r.Drivetrain].join("|"))).size,latestEvShareTop:evLatestTop,latestEvDates:countBy(latestRows,"Date"),allRows:all.length,evRows:ev.length},
  join:{fleetIsos:new Set(fleet.map(r=>r["ISO 3 code"])).size,salesCountryIsos:new Set(countrySales.map(r=>r["ISO 3 code"])).size,matched:fleet.filter(r=>countrySales.some(s=>s["ISO 3 code"]===r["ISO 3 code"])).length}
};

console.log(JSON.stringify(profile,null,2));
