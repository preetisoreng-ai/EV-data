import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
function parseCsv(text){const rows=[];let row=[],field="",q=false;for(let i=0;i<text.length;i++){const c=text[i];if(q){if(c==='"'&&text[i+1]==='"'){field+='"';i++}else if(c==='"')q=false;else field+=c}else if(c==='"')q=true;else if(c===','){row.push(field);field=""}else if(c==='\n'){row.push(field.replace(/\r$/,""));rows.push(row);row=[];field=""}else field+=c}if(field.length||row.length){row.push(field.replace(/\r$/,""));rows.push(row)}const h=rows.shift();return rows.filter(r=>r.some(Boolean)).map(r=>Object.fromEntries(h.map((x,i)=>[x,r[i]??""])))}
const load=n=>parseCsv(fs.readFileSync(path.join(project,"data","raw",n),"utf8"));
const num=v=>v===""?null:Number(v),sum=(a,k)=>a.reduce((s,r)=>s+r[k],0),round=(v,d=1)=>Number(v.toFixed(d));
const fleetRaw=load("monthly_ev_fleet_impact.csv"),sales=load("monthly_ev_sales.csv");
const world=fleetRaw.find(r=>r.Area==="World");
const countries=fleetRaw.filter(r=>r["Area type"]==="Country or economy").map(r=>({area:r.Area,iso:r["ISO 3 code"],date:r["Latest available date"],fleet:num(r["EV fleet (vehicles)"]),electricity:num(r["EV fleet electricity demand (GWh per year)"]),oil:num(r["Oil displaced (thousand barrels of oil equivalent per year)"]),usd:num(r["Value of oil displaced (USD million per year)"])}));
const ranked=[...countries].sort((a,b)=>b.fleet-a.fleet),worldFleet=num(world["EV fleet (vehicles)"]),worldOil=num(world["Oil displaced (thousand barrels of oil equivalent per year)"]);
const countryFleet=sum(countries,"fleet"),countryOil=sum(countries,"oil"),top5=ranked.slice(0,5);
const perVehicle=countries.map(r=>({...r,kwhPerEv:r.electricity*1e6/r.fleet,boePerEv:r.oil*1000/r.fleet})).sort((a,b)=>b.boePerEv-a.boePerEv);
const q=(arr,p)=>{const x=[...arr].sort((a,b)=>a-b),i=(x.length-1)*p,l=Math.floor(i),f=i-l;return x[l]+(x[l+1]===undefined?0:f*(x[l+1]-x[l]))};
const ev=sales.filter(r=>r["Area type"]==="Country or economy"&&r.Drivetrain==="Electric vehicle (BEV+PHEV)");
const latest=new Map();for(const r of ev)if(!latest.has(r.Area)||r.Date>latest.get(r.Area).Date)latest.set(r.Area,r);
const selected=["China","United States","Germany","United Kingdom","Norway","India","Brazil"].map(area=>{const r=latest.get(area);return{area,date:r.Date,monthly:num(r["Share of registrations (%)"]),rolling12:num(r["Rolling 12-month share of registrations (%)"]),registrations:num(r.Registrations)}});
const dateCounts=Object.fromEntries([...countries.reduce((m,r)=>m.set(r.date,(m.get(r.date)||0)+1),new Map())].sort());
const missingSales=sales.filter(r=>r.Registrations==="").length;
const duplicates=sales.length-new Set(sales.map(r=>`${r.Area}|${r.Date}|${r.Drivetrain}`)).size;
const result={
  headline:{chinaWorld:round(ranked[0].fleet/worldFleet*100),chinaCountrySum:round(ranked[0].fleet/countryFleet*100),top5World:round(sum(top5,"fleet")/worldFleet*100),top5CountrySum:round(sum(top5,"fleet")/countryFleet*100)},
  reconciliation:{worldFleet,countryFleet,fleetGap:worldFleet-countryFleet,fleetGapPct:round((worldFleet-countryFleet)/worldFleet*100,2),worldOil,countryOil,oilGap:worldOil-countryOil,oilGapPct:round((worldOil-countryOil)/worldOil*100,2)},
  dates:dateCounts,
  impactVariation:{boePerEvMin:round(Math.min(...perVehicle.map(r=>r.boePerEv)),3),boePerEvMedian:round(q(perVehicle.map(r=>r.boePerEv),.5),3),boePerEvMax:round(Math.max(...perVehicle.map(r=>r.boePerEv)),3),kwhPerEvMin:round(Math.min(...perVehicle.map(r=>r.kwhPerEv)),0),kwhPerEvMedian:round(q(perVehicle.map(r=>r.kwhPerEv),.5),0),kwhPerEvMax:round(Math.max(...perVehicle.map(r=>r.kwhPerEv)),0),high:perVehicle.slice(0,5).map(r=>({area:r.area,boePerEv:round(r.boePerEv,3)})),low:perVehicle.slice(-5).reverse().map(r=>({area:r.area,boePerEv:round(r.boePerEv,3)}))},
  sales:selected,
  quality:{fleetRows:fleetRaw.length,countries:countries.length,salesRows:sales.length,duplicates,missingSales,worldAndEuExcludedFromRanking:true},
  top5:top5.map(r=>({area:r.area,fleet:r.fleet,date:r.date}))
};
const processed=path.join(project,"data","processed");fs.writeFileSync(path.join(processed,"tested_data.json"),JSON.stringify(result,null,2));fs.writeFileSync(path.join(processed,"tested_data.js"),`window.EV_TESTED=${JSON.stringify(result)};\n`);
console.log(JSON.stringify(result,null,2));
