GOAL: the viewer remembers "five markets hold 77.7% of the world's EV fleet — China alone 57.2%" and opens the story.
OUTPUT: HyperFrames, 1920x1080 master + 1080x1350 (feed45) + 1080x1080 (square) + 1080x1920 (vertical) in variants/, 30 fps, H.264 + AAC
TIME: 40 s x 30 = 1200 frames. Music bed ~72 BPM (25 frames per beat); rearrangements land on a downbeat.
CONTENT: ../content.json v1 only. Every word and number is read from it at build time (assets/content.js); nothing typed by hand.
LOOK: Poppy design language (../../design/poppy-design-language.md), tokens copied unchanged from site/shared/poppy.css
into assets/poppy-tokens.css:
ground --pp-paper flat, no texture, no gradient; ink --pp-ink; body --pp-ink-2; captions --pp-muted;
ONE crimson (--pp-crimson) focus per shot: the number of that beat; poppy heads use the site's petal
gradient (#f6907c → --pp-poppy → --pp-crimson) exactly as in the data story; stems --pp-rose 2.6 px at 1080;
context marks --pp-rose-light / --pp-sand; gridlines dotted 1 6, --pp-muted at 55%.
Serif "Source Serif 4" 500, tracking -2.5%: title 7.4% of frame height landscape / 5.2% of width portrait.
Sans "Helvetica Neue"/Arial 800, tracking -5%, tabular: hero number 17% of frame height landscape,
22% of width portrait. Labels 700 caps 0.18em, crimson, >= 28 px at 1080. Body >= 30 px at 1080.
No shadows, no grain, no vignette (flat print).
OBJECTS: five poppies (France, UK, Germany, US, China) drawn with the site's poppy head (back petals, front petals,
veins, dark centre, 7 stamens) — the same object in every shot; 100 seeds (5 px dots at 1080);
a ground line (--pp-rule 1.5 px); dotted value gridlines; the min/median/max line with 14 px crimson dots.
MOTION: enter: power3.out 18-24 frames; morph: power2.inOut 30-42 frames, staggered 3 frames per object;
exit: power1.in 9 frames; petal fall: power1.in 36 frames with 6-14 deg rotation per petal.
A count never runs at frame 0 (the cover is already final). Only one hero move per shot; secondary moves
travel 50-70% as far and start 4-6 frames later; text never moves while being read.
LAYOUT: landscape: copy column x 6-42%, field x 48-94%. Portrait/square/feed: copy block top (y 15-42%), field below
(y 46-85%), both centred on one axis. All text inside x/y 15-85% on feed45/square (3:4 grid crop on feed45),
inside 90% action-safe on 16:9 and 9:16.
SHOTS: (frames @30fps)
S1 0-119 COVER/HOOK. Frame 0 = final composition: kicker "Global EV transition / 2026 snapshot", title
"The shape of the global EV fleet", "90.6M" + "vehicles in the supplied World total" + "59 country rows",
five poppies standing on the ground line. 9-45: one sway (+-2 deg, stagger 4 f). Read window 0-119.
Sound: bed starts on frame 0. Hand-off: China's head starts to swell at 120.
S2 120-299 CHINA'S SHARE. Hero: China poppy scales to 2.2x and moves to the field centre (36 f); the other four
fold into seeds (24 f, start +5). Copy swaps (exit 9 f / enter 18 f): label "China's share",
"57.2%" crimson, "of the supplied World fleet", note "57.9% using the sum of country rows."
Under the field 100 seeds lay out 20x5; 57 turn crimson left to right (30 f). Read 150-299. Chime at 140.
S3 300-509 FIVE FLEETS. Seeds sprout back into four poppies; all five slide into rank order smallest→largest on an
axis 0-50M with dotted gridlines (42 f). Value labels 2.8M 3.2M 3.7M 8.8M 51.8M type on above heads
(stagger 6 f), China's crimson. Copy: "Five largest country fleets", "77.7%", line, note "Flower centre
height and area show fleet size." Read 345-509. Rustle at 300.
S4 510-734 SALES MOMENTUM. Stems rotate down to horizontal (power2.inOut 36 f) and become rolling-12-month bars;
heads shrink to 10 px end dots; two more bars draw in (Brazil, India) for 7 rows; labels swap to
Norway 98.5 · China 58.3 · UK 40.2 · Germany 37.5 · Brazil 10.7 · US 7.1 · India 6.1 (%),
China's bar crimson, the rest rose on sand tracks. Copy: "Sales momentum", "58.3%", "China's rolling
12-month EV sales share", note "China's share rose strongly from 2019 to September 2026." Read 560-734.
S5 735-929 OIL SPREAD. Bars slide together into one rose line (30 f); three crimson dots drop onto it at min,
median, max (stagger 8 f) with 2.277 / 5.315 / 9.561 above and MIN / MEDIAN / MAX below. Copy:
"Reported oil displacement", "4.2×", "spread in reported oil displaced per EV", note "Barrels of oil
equivalent per EV per year". Read 780-929.
S6 930-1079 EVIDENCE. The line lifts back into one standing poppy; its petals fall (36 f) and settle on the
ground line. Copy (serif): "Fleet counts show where EVs are concentrated." + note "The source does not
document the oil impact method. The estimates cannot establish causal effects or rank countries by
effectiveness." Read 960-1079.
S7 1080-1199 END CARD. The fallen petals gather into the poppy mark (24 f); "The shape of the global EV fleet",
"preetisoreng-ai.github.io/EV-data", source line "Source / supplied monthly EV fleet-impact and sales
files · pressure-tested calculations". Holds 1110-1199 (3 s). Bed resolves on 1170.
BANNED: dark ground; glow, particles, gradients other than the petal gradient; glass cards; KPI grids; three cards in
a row; numbered "01 / 02" labels; pill chips; everything fading up; text moving while read; the logo docked
in a corner; any number not in content.json; counts at frame 0.
QA: frames 0, 60, 200, 420, 650, 850, 1000, 1150 in all four formats: frame 0 equals the cover (all content
visible, signalstats YMAX-YMIN >= 40); numbers match content.json; text inside the safe boxes; one crimson
focus per frame.

CHANGE (user request, 2026-11-05): the film opens by sprouting. Frame 0 = kicker, title, 90.6M and its lines on
         the bare ground line; stems grow from the ground smallest→largest (0.15–2.0 s) and heads bloom to size
         (fully open by 2.5 s), then one sway (2.65–3.9 s). Cover = the fully bloomed frame: cover_at 2.6 s for
         every format (uploaded as the cover on Instagram and LinkedIn). X has no cover control and shows frame 0,
         which still carries the title and 90.6M (not blank). Total length 41.5 s (evidence beat lengthened for reading).

CHANGE (user request, 2026-11-05): blooms are a slow, soft unfolding, not a pop — head scales 12%→100% over 1.5 s
         (power2.inOut, no overshoot) with a gentle turn; back petals fade in, then the four front petals one by one,
         then the slits and centre. Bloom starts while the stem is finishing. All five fully open by ~3.1 s; one short
         sway 3.1–3.9 s. Cover now cover_at 3.3 s. Evidence poppy unfolds the same way (31.5–32.8 s); its petals fall
         from 33.2 s.
