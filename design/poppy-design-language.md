# Poppy design language — EV transition

Reference: `reference-poppy-infographic.png` ("The shape of the global EV fleet").
Implementation: `site/shared/poppy.css`, loaded last on every page with `class="poppy"` on `<html>`.

This is a project-level exception to the workspace Data/Bento look, requested by the owner.
The Data theme stays in place (`theme-data` on `<html>`, `data.css` unedited); `poppy.css`
re-points the Data semantic tokens (`--color-background-primary`, `--color-text-neutral`, …)
to the palette below and restyles page components on top.

## Character

An editorial print infographic: warm cream paper, a serif headline, crimson labels, flat
sections divided by rules, and one red flower motif. Quiet everywhere except the number
or mark that carries the point.

## Colour

| Token                    | Hex       | Use                                                                        |
| ------------------------ | --------- | -------------------------------------------------------------------------- |
| `--pp-paper`             | `#fbf1de` | Page background (every page, light only)                                   |
| `--pp-paper-2`           | `#f5e6cb` | Sunken surfaces: notices, inputs, story rings                              |
| `--pp-sand`              | `#ecd8bc` | Bar tracks, context marks, "rest of world"                                 |
| `--pp-line`              | `#dcc6a8` | Hairline dividers, column rules                                            |
| `--pp-rule` / `--pp-ink` | `#2b1d1a` | Heavy section rules; headings and big numbers                              |
| `--pp-ink-2`             | `#5e4a42` | Body copy                                                                  |
| `--pp-muted`             | `#7a655b` | Captions, axis labels (4.9:1 on paper)                                     |
| `--pp-crimson`           | `#a3222b` | Accent: kickers, highlighted values, focus series, active controls (6.6:1) |
| `--pp-poppy`             | `#e0463a` | Flower red: highlight fills                                                |
| `--pp-rose`              | `#b8645a` | Secondary series, non-highlighted bars (3.7:1, graphics only)              |
| `--pp-rose-light`        | `#d4a090` | Context series (e.g. monthly line behind the rolling line)                 |

Rules: one crimson highlight per chart (the largest or the subject); everything else rose
on a sand track. Never use rose or poppy for body-size text.

## Type

- **Headlines** — serif (`Source Serif 4`, fallback Georgia), weight 500, tracking −0.025em,
  sentence case. Page titles 48–92px; section titles 34–58px.
- **Kickers** — sans, 13px, bold, uppercase, tracking 0.18em, crimson. Not numbered (no
  `01 /` prefixes). Used for panel labels on Data art and KPI labels on the Dashboard; section
  titles on Original and Pressure tested stand alone without a kicker.
- **Big numbers** — sans (Helvetica Neue/Arial), weight 800, tracking −0.05em. Ink by
  default; crimson for the headline figure.
- **Body** — sans, 16–18px, `--pp-ink-2`. Inline key figures in crimson bold.
- **Footnotes / source** — 13px muted; the source line in crimson ("Source / …").

## Layout and surfaces

- Flat: no cards, no shadows, no rounded panels. A panel is a 1px ink rule on top.
- Sections are separated by full-width rules; columns by 1px `--pp-line` vertical rules.
- Generous whitespace; content width 1160–1280px with 16px phone gutters.

## Charts

- **Ranked bars:** thin 6px rounded bars on a sand track; the leader crimson, the rest rose;
  values right-aligned, bold.
- **Lines:** crimson 2.5–3px for the focus series, rose-light 1.5px for context; a crimson
  dot on the latest value; a faint crimson area (8%).
- **Gridlines:** dotted (`1 5`), muted at ~55%; axis labels muted 11px.
- **Range / spread:** min–median–max dot plot — a 2px rose line with 12px crimson dots and
  bold values above, uppercase unit below.
- **Part of whole:** crimson for the subject, sand for the rest.
- **Signature motif:** the poppy (red petals, dark centre) — used for the wordmark and
  available for magnitude charts (flower size/height = value).

## Controls

- Pills: 1px line border, transparent; selected = crimson fill, white text.
- Tabs: crimson underline and text on the selected tab.
- Selects/inputs: `--pp-paper-2` fill, square corners, 1px ink bottom border.
- Focus: 2px crimson outline, 3px offset.

## Accessibility

- All text pairs meet 4.5:1 on paper (ink, ink-2, muted, crimson); rose/poppy are for
  marks only (≥3:1).
- Light mode only; the data story no longer uses dark mode.
- Reduced-motion behaviour from the original pages is unchanged.
