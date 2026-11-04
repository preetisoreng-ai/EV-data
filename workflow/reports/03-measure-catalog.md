# Dashboard measure catalog

Audience: transport, energy, and strategy analysts monitoring market scale, current adoption, and reported fleet impact. Refresh cadence follows monthly source updates.

| Measure | Formula/source | Unit | Grain | Valid aggregation | Comparison | Caveat |
|---|---|---|---|---|---|---|
| EV fleet | supplied field | vehicles | latest market snapshot | sum countries only; never add World/EU to countries | rank, share of World | market dates vary June–October 2026 |
| Monthly EV registrations | supplied BEV+PHEV aggregate | vehicles/month | market-month | sum only within same month and non-overlapping markets | prior month/year | blanks are unavailable, not zero |
| Monthly EV registration share | supplied BEV+PHEV share | percent | market-month | do not sum or average across markets | prior month, rolling share | denominator is all registrations in that market-month |
| Rolling 12-month EV share | supplied rolling field | percent | market-month | do not aggregate across markets | monthly share | unavailable in early history |
| Fleet electricity demand | supplied field | GWh/year | latest market snapshot | sum non-overlapping markets | rank; per vehicle | method absent from source files |
| Oil displaced | supplied field | thousand boe/year | latest market snapshot | sum non-overlapping markets | rank; per vehicle | reported/modelled; method absent |
| Oil value displaced | supplied field | USD million/year | latest market snapshot | sum non-overlapping markets | rank | uses USD 99.8/bbl Brent basis |
| Oil displaced per EV | oil displaced × 1,000 / EV fleet | boe/EV/year | latest market snapshot | weighted ratio only | country distribution | wide variation; not an effectiveness score |

Primary KPI: EV fleet for scale. Diagnostic KPI: latest and rolling-12-month EV share for momentum. Impact measures remain visibly qualified.

