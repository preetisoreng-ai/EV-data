# Original QA

## Data and calculations

- [x] Raw inputs copied without modification and SHA-256 hashes recorded.
- [x] No duplicate sales `Area + Date + Drivetrain` keys.
- [x] World and EU regional rows excluded from country rankings.
- [x] Headline fleet and oil shares recomputed from source fields by `analysis/build_original.mjs`.
- [x] Missing registrations remain null rather than zero.
- [x] Latest-date mismatch disclosed inline and in methods.

## HTML and interaction

- [x] `theme-data` is applied to `<html>`.
- [x] Supplied Data token file is reused unchanged.
- [x] Page works from local file paths through `original_data.js`.
- [x] Market controls are native buttons with visible focus styles and `aria-pressed` state.
- [x] SVG charts include accessible names and direct labels.
- [x] Layout includes desktop, tablet, and mobile breakpoints.
- [x] Motion is disabled under `prefers-reduced-motion`.
- [x] Empty-data handling is present in chart renderers.
- [x] Headless Edge render reviewed at 1440px desktop width and 440px mobile width; mobile overflow guard added after review.
- [x] Full-page desktop render confirms all sections, chart labels, method copy, and footer are visible without overlap.

## Review still required

- [ ] Open `artifacts/original/index.html` in a browser.
- [ ] Review desktop and narrow/mobile layouts.
- [ ] Test all market buttons.
- [ ] Confirm editorial framing and intended audience.

