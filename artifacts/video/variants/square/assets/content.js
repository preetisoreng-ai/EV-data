// GENERATED from artifacts/content.json v1 by tools/build-assets.mjs — do not edit
window.EV_CONTENT = {
  "version": 1,
  "title": "The shape of the global EV fleet",
  "kicker": "Global EV transition / 2026 snapshot",
  "tags": "Fleet · Sales · Reported impact",
  "dek": "Five markets account for 77.7% of the supplied world fleet.",
  "insights": [
    {
      "id": "fleet",
      "label": "Global snapshot",
      "value": "90.6M",
      "line": "vehicles in the supplied World total",
      "note": "59 country rows",
      "source": [
        "data/processed/original_data.js#world.fleet",
        "data/processed/original_data.js#coverage.countries"
      ]
    },
    {
      "id": "china",
      "label": "China’s share",
      "value": "57.2%",
      "line": "of the supplied World fleet",
      "note": "57.9% using the sum of country rows.",
      "source": [
        "data/processed/tested_data.js#headline.chinaWorld",
        "data/processed/tested_data.js#headline.chinaCountrySum"
      ]
    },
    {
      "id": "top5",
      "label": "Five largest country fleets",
      "value": "77.7%",
      "line": "of the supplied World fleet in five markets",
      "note": "Flower centre height and area show fleet size. Ordered by rank, smallest to largest.",
      "chart": "top5",
      "source": [
        "data/processed/tested_data.js#headline.top5World",
        "data/processed/tested_data.js#top5"
      ]
    },
    {
      "id": "sales",
      "label": "Sales momentum",
      "value": "58.3%",
      "line": "China’s rolling 12-month EV sales share",
      "note": "China’s share rose strongly from 2019 to September 2026.",
      "chart": "sales",
      "source": [
        "data/processed/tested_data.js#sales[area=China].rolling12"
      ]
    },
    {
      "id": "oil",
      "label": "Reported oil displacement",
      "value": "4.2×",
      "line": "spread in reported oil displaced per EV",
      "note": "Barrels of oil equivalent per EV per year",
      "chart": "oil",
      "source": [
        "data/processed/tested_data.js#impactVariation"
      ]
    },
    {
      "id": "evidence",
      "label": "What the evidence supports",
      "value": null,
      "line": "Fleet counts show where EVs are concentrated.",
      "note": "The source does not document the oil impact method. The estimates cannot establish causal effects or rank countries by effectiveness.",
      "source": [
        "workflow/reports/02-pressure-test.md",
        "site/tested/index.html#method"
      ]
    }
  ],
  "charts": [
    {
      "id": "top5",
      "type": "poppy",
      "unit": "vehicles",
      "order": "smallest to largest",
      "rows": [
        [
          "France",
          2816305,
          "2.8M"
        ],
        [
          "United Kingdom",
          3203336,
          "3.2M"
        ],
        [
          "Germany",
          3716289,
          "3.7M"
        ],
        [
          "United States",
          8845497,
          "8.8M"
        ],
        [
          "China",
          51783437,
          "51.8M"
        ]
      ],
      "source": "data/processed/tested_data.js#top5"
    },
    {
      "id": "sales",
      "type": "ranked bars",
      "unit": "% rolling 12-month EV sales share",
      "highlight": "China",
      "rows": [
        [
          "Norway",
          98.51,
          "98.5%"
        ],
        [
          "China",
          58.26,
          "58.3%"
        ],
        [
          "United Kingdom",
          40.16,
          "40.2%"
        ],
        [
          "Germany",
          37.54,
          "37.5%"
        ],
        [
          "Brazil",
          10.68,
          "10.7%"
        ],
        [
          "United States",
          7.1,
          "7.1%"
        ],
        [
          "India",
          6.06,
          "6.1%"
        ]
      ],
      "source": "data/processed/tested_data.js#sales[].rolling12"
    },
    {
      "id": "oil",
      "type": "min-median-max dot plot",
      "unit": "boe per EV per year",
      "rows": [
        [
          "Min",
          2.277,
          "2.277"
        ],
        [
          "Median",
          5.315,
          "5.315"
        ],
        [
          "Max",
          9.561,
          "9.561"
        ]
      ],
      "source": "data/processed/tested_data.js#impactVariation"
    }
  ],
  "notes": [
    "Fleet snapshots span June–October 2026. All five largest fleets are September 2026 snapshots.",
    "Country rankings exclude World and EU aggregates. Individual fleet labels are rounded."
  ],
  "source_line": "Source / supplied monthly EV fleet-impact and sales files · pressure-tested calculations",
  "cover_insight": "fleet",
  "cover_composition": "title + kicker + 90.6M + the five-poppy chart, fully drawn at frame 0",
  "approved": {
    "by": "User",
    "at": "2026-11-04T13:53:56.620Z",
    "note": "Approved in chat (\"approve\") on the draft shown"
  }
};
