import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const raw = path.join(project, "data", "raw");
const processed = path.join(project, "data", "processed");

function parseCsv(text) {
  const rows=[]; let row=[],field="",quoted=false;
  for(let i=0;i<text.length;i++){const c=text[i];if(quoted){if(c==='"'&&text[i+1]==='"'){field+='"';i++}else if(c==='"')quoted=false;else field+=c}else if(c==='"')quoted=true;else if(c===','){row.push(field);field=""}else if(c==='\n'){row.push(field.replace(/\r$/, ""));rows.push(row);row=[];field=""}else field+=c}
  if(field.length||row.length){row.push(field.replace(/\r$/, ""));rows.push(row)}
  const headers=rows.shift();
  return rows.filter(r=>r.some(Boolean)).map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]??""])));
}
const load=name=>parseCsv(fs.readFileSync(path.join(raw,name),"utf8"));
const n=v=>v===""?null:Number(v);
const round=(v,d=1)=>Number(v.toFixed(d));
const fleet=load("monthly_ev_fleet_impact.csv");
const sales=load("monthly_ev_sales.csv");

const world=fleet.find(r=>r.Area==="World");
const countries=fleet.filter(r=>r["Area type"]==="Country or economy").map(r=>({
  area:r.Area,iso:r["ISO 3 code"],date:r["Latest available date"],fleet:n(r["EV fleet (vehicles)"]),
  electricityGWh:n(r["EV fleet electricity demand (GWh per year)"]),oilKboe:n(r["Oil displaced (thousand barrels of oil equivalent per year)"]),oilUsdM:n(r["Value of oil displaced (USD million per year)"])
})).sort((a,b)=>b.fleet-a.fleet);

const evRows=sales.filter(r=>r["Area type"]==="Country or economy"&&r.Drivetrain==="Electric vehicle (BEV+PHEV)");
const latestMap=new Map();
for(const r of evRows)if(!latestMap.has(r.Area)||r.Date>latestMap.get(r.Area).Date)latestMap.set(r.Area,r);
const latestSales=[...latestMap.values()].map(r=>({area:r.Area,iso:r["ISO 3 code"],date:r.Date,registrations:n(r.Registrations),share:n(r["Share of registrations (%)"]),rolling12:n(r["Rolling 12-month share of registrations (%)"])}));
const latestByIso=new Map(latestSales.map(r=>[r.iso,r]));
const joined=countries.map(r=>({...r,latestSales:latestByIso.get(r.iso)||null}));

const selected=["China","United States","Germany","United Kingdom","Norway","India","Brazil"];
const series=Object.fromEntries(selected.map(area=>[area,evRows.filter(r=>r.Area===area&&r.Date>="2019-01-01").map(r=>({date:r.Date,share:n(r["Share of registrations (%)"]),registrations:n(r.Registrations)}))]));

const worldFleet=n(world["EV fleet (vehicles)"]);
const worldOil=n(world["Oil displaced (thousand barrels of oil equivalent per year)"]);
const top5=countries.slice(0,5);
const sum=(rows,key)=>rows.reduce((a,r)=>a+r[key],0);
const output={
  generatedAt:new Date().toISOString(),
  coverage:{salesStart:"2005-01-01",salesEnd:"2026-10-01",fleetSnapshotDates:[...new Set(fleet.map(r=>r["Latest available date"]))].sort(),countries:countries.length},
  world:{date:world["Latest available date"],fleet:worldFleet,electricityGWh:n(world["EV fleet electricity demand (GWh per year)"]),oilKboe:worldOil,oilUsdM:n(world["Value of oil displaced (USD million per year)"]),brent:n(world["Brent price 6-month average (USD/bbl)"])},
  concentration:{chinaFleetShare:round(countries[0].fleet/worldFleet*100),chinaOilShare:round(countries[0].oilKboe/worldOil*100),top5FleetShare:round(sum(top5,"fleet")/worldFleet*100),top5OilShare:round(sum(top5,"oilKboe")/worldOil*100)},
  topFleet:joined.slice(0,12),
  topLatestSales:[...latestSales].filter(r=>r.share!==null).sort((a,b)=>b.share-a.share).slice(0,15),
  series
};

fs.mkdirSync(processed,{recursive:true});
fs.writeFileSync(path.join(processed,"original_data.json"),JSON.stringify(output,null,2));
fs.writeFileSync(path.join(processed,"original_data.js"),`window.EV_DATA=${JSON.stringify(output)};\n`);
console.log(JSON.stringify({world:output.world,concentration:output.concentration,topFleet:output.topFleet.slice(0,5).map(r=>({area:r.area,fleet:r.fleet,oilKboe:r.oilKboe,salesShare:r.latestSales?.share,date:r.latestSales?.date}))},null,2));
