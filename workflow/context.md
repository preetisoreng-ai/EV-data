# Dataset context

## Identity
- Project name: Monthly EV impact
- Source files: `monthly_ev_fleet_impact.csv`; `monthly_ev_sales.csv`
- Source/publisher: unknown from the files themselves
- Retrieval or upload date: 2026-11-03
- Dataset description: Monthly drivetrain registrations by market plus a latest-available EV fleet and annual impact snapshot.
- Intended audience: policy, energy, transport, and strategy readers comparing the scale and momentum of EV adoption
- User's stated question or decision: discover and communicate the strongest data-supported story

## Shape and grain
- Dataset type: mixed time-series and cross-sectional snapshot
- Unit of observation: sales file = area × month × drivetrain; fleet file = one latest-available record per area
- Row count / column count: sales 46,673 × 24; fleet 61 × 9
- Entity keys: sales `Area + Date + Drivetrain`; fleet `Area`
- Time fields and frequency: monthly sales; one latest-available fleet date per area
- Geographic fields and level: 59 countries/economies plus World and EU regional rows
- Coverage start/end: sales 2005-01 to 2026-10; fleet latest dates span 2026-06 to 2026-10
- Latest-period completeness: not uniform across markets; 49 of 61 fleet rows are dated 2026-09

## Field semantics
| Field | Meaning | Type | Unit | Range | Missingness | Notes |
|---|---|---|---|---|---|---|
| Area | Market or region | text | n.a. | 61 areas | none | World and EU are regional aggregates |
| Date | Registration month | date | month | 2005-01 to 2026-10 | none | Coverage varies by market/drivetrain |
| Drivetrain | Vehicle powertrain grouping | category | n.a. | 10 categories | none | Aggregate EV = BEV + PHEV |
| Registrations | Vehicles registered in month | number | vehicles | non-negative | 388 sales rows | Missing is not zero |
| Share of registrations | Drivetrain registrations divided by all registrations | number | percent | 0–100 | 394 sales rows | Monthly and market-specific |
| EV fleet | Latest reported EV stock | number | vehicles | 9,229–90,579,665 | none | World and EU overlap country rows |
| EV fleet electricity demand | Annual electricity demand associated with fleet | number | GWh/year | 25.5–235,608.4 | none | Method is not supplied in these files |
| Oil displaced | Annual oil-equivalent displacement associated with fleet | number | thousand boe/year | 50.3–525,132.7 | none | Treat as reported/modelled impact, not directly observed causality |
| Value of oil displaced | Oil displacement valued at supplied Brent price | number | USD million/year | 5.0–52,410.9 | none | Sensitive to the stated USD 99.8/bbl price basis |

## Measures and denominators
| Measure | Formula | Numerator | Denominator | Unit | Additive? | Caveat |
|---|---|---|---|---|---|---|
| Country share of world EV fleet | country EV fleet / World EV fleet | country fleet | 90,579,665 | percent | no | Snapshot dates vary slightly |
| Country share of world oil displacement | country oil displaced / World oil displaced | country oil displaced | 525,132.7 thousand boe/year | percent | no | Depends on supplied impact method |
| Monthly EV registration share | supplied aggregate BEV+PHEV share | BEV+PHEV registrations | all registrations | percent | no | Monthly volatility; missing registrations remain missing |
| Top-five concentration | sum of five largest country fleets / World fleet | top five fleets | World fleet | percent | no | Country rows only; no EU double count |

## Quality and comparability
- Duplicates: no duplicate `Area + Date + Drivetrain` keys in sales; no duplicate areas in fleet
- Missing periods/entities: history length varies; latest date differs across markets
- Invalid or impossible values: none identified in headline fields; some supplied sales measures are blank
- Definition/schema changes: unknown
- Outliers and treatment: large market-size differences are real scale features; no trimming
- Sampling/weights: appears to be administrative/compiled market data; methodology unknown
- Inflation/currency basis: oil value is nominal USD using a common 6-month Brent average of USD 99.8/bbl
- Known biases: country availability and reporting lags vary; impact methodology/source metadata are absent

## Analytical frame
- Candidate questions: Where is fleet impact concentrated? Which markets combine scale and current momentum? How quickly has EV sales share changed since 2019? How much electricity demand and oil displacement are associated with the fleet?
- Primary question selected: Where is the global EV transition already large enough to affect energy demand, and how concentrated is that impact?
- Why it matters: fleet scale determines current energy impact while monthly sales share indicates the direction of future fleet growth
- Comparison baseline: supplied World snapshot; country-only ranking; monthly BEV+PHEV share
- Important segments: China, United States, leading European markets, Norway, India, Brazil
- Required uncertainty/statistical treatment: descriptive only; disclose asynchronous latest dates and unknown impact methodology
- Causal claims allowed: no; the files support association and supplied impact estimates, not causal attribution

## Visual and interaction frame
- Natural chart forms for this data type: ranked bars, proportional concentration bars, time-series lines, compact comparison table
- Unsafe/misleading chart forms: country-summed world totals that double-count EU; equal-date claims across asynchronous snapshots; dual axes implying causality
- Required filters: market selector for sales-share history
- Accessibility considerations: direct labels, non-color encodings, keyboard-operable market controls, SVG titles/descriptions, reduced motion
- Data brand/radius/dark classes: `theme-data radius-round-2`

## Evidence ledger
| Claim ID | Claim | Status | Calculation/script | Supporting fields | Limitations |
|---|---|---|---|---|---|
| O1 | The supplied World row reports 90.6 million EVs | verified | `analysis/build_original.mjs`; `analysis/pressure_test.mjs` | World EV fleet | Snapshot dated 2026-09 |
| O2 | China represents 57.2% of the World EV fleet | verified | China fleet / World fleet; alternate country-sum denominator = 57.9% | EV fleet | Country sum is 1.25% below World row |
| O3 | China represents 58.1% of reported World oil displacement | qualified | China oil / World oil | Oil displaced | Per-EV displacement varies 2.277–9.561 boe/year; impact method unknown |
| O4 | Five largest country fleets represent 77.7% of the World fleet | verified | top-five country sum / World; alternate denominator = 78.7% | EV fleet | All top-five rows share the 2026-09 date |
| O5 | Latest monthly EV sales share ranges widely among large fleet markets | qualified | monthly and rolling-12-month BEV+PHEV shares | sales share | Latest month varies; rolling shares are more stable |
| T1 | Country fleet rows sum to 98.75% of the supplied World fleet | verified | `analysis/pressure_test.mjs` | country and World EV fleet | Difference may reflect uncovered markets or timing |
| T2 | Oil displacement per EV varies more than fourfold across countries | verified | country oil displacement / country fleet | oil displaced; EV fleet | Variation may reflect vehicle mix/use or model assumptions; files do not explain it |

## Decisions and unresolved questions
- Approved decisions: Original approved; headline concentration retained with explicit denominator and impact-model caveat
- Unresolved questions: publisher/methodology; whether latest 2026 periods are final; definitions behind modeled impact fields
- Assumptions requiring reviewer confirmation: intended audience is a general policy/strategy reader

