# Chord Map

Interactive guitar theory and practice app: keys and modes, a chord map, voicings, scale positions and neck training. It is a static PWA with no build step and no dependencies.

- **Live:** https://freechordmap.pages.dev/. Cloudflare Pages deploys automatically on every push to `main`. There is no build command, and the output dir is `/`.
- **Old host:** https://elillesaeter.github.io/chordmap/ (GitHub Pages) is still on and can be turned off in repo Settings → Pages.
- **Owner:** Elias, who plays a 7-string. He writes to Claude in Norwegian, but **all UI text is English**, so it matches the terms used in YouTube lessons.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole app: HTML, CSS and vanilla JS in one file (~950 lines) |
| `sw.js` | Service worker. Navigations are **network-first** (deploys show up on the next load). Other assets are cache + background refresh. Precache uses `cache: 'reload'`. |
| `_headers` | Cloudflare Pages: `no-cache` on `/`, `index.html` and `sw.js` |
| `manifest.webmanifest`, `icon*.png`, `icon.svg`, `apple-touch-icon.png` | PWA install |

### Bump on every shipped change
- `CACHE` in `sw.js` (`chordmap-vN`)
- `APP_VERSION` in `index.html` (`'vN · YYYY-MM-DD'`), which is shown under the title so the user can see which version is loaded

These two stay in step. They are currently at **v9**.

## index.html layout

CSS uses tokens on `:root` with light and dark themes. Fonts come from Google Fonts: Bricolage Grotesque (display), IBM Plex Sans/Mono, and Noto Music (subset to 𝄞 ♯ ♭) for the staff.

**Layout:**
- Desktop (≥1200px): a sticky sidebar `.side` (brand, key panel, progression) and a work area `.work` (map + chord card in `.duo`, voicings, neck).
- Below 1200px: both wrappers are `display:contents`, and panels are ordered with CSS `order`.
- The scale strip is a vertical list on desktop and phone (≤640px), and horizontal in between.

JS sections, in file order:
- **Data:**
  - `MODES` holds `maj` and `min`, which are hand-written. `lyd`, `mix`, `dor`, `phr` and `loc` are made by `genMode()` from `MODE_INFO` (signature chords, moves, progressions, signature note index `char`).
  - `TEMPL` and `OPEN` are six-string chord shapes, and `CAGED` holds the five open forms.
  - `TUNINGS` covers 6/7/8/9-string and drop tunings, applied with `applyTuning()`. It sets the globals `TUN`, `SNAME`, `EOFF` (= strings − 6) and `TSETS`.
  - `SIG_KEY.maj`, `sigKeyName(mode, n)` and `keySig()` handle key signatures. Enharmonic spelling is kept in `state.alias`.
- **state:** one object holding root, mode, selected chord, voicing, neck tab and options, positions (array, multi-select), tuning, quiz, progression and playback.
- **build():** builds `C` (chords keyed by roman numeral: diatonic outer ring plus secondary dominants `V7/x` in the inner ring) and `scaleNames` (spelled from the tonic letter).
- **Render functions:** `renderKey`, `renderGraph`, `renderCard`, `renderVoicings`, `renderNeck`, `renderProg`, `renderRoots`, and `renderAll`. They rebuild innerHTML, and events use delegated listeners at the bottom.
- **Neck:** `drawNeck(cells, regions, rings)` is shared by four modes: `neckScales`, `neckCaged`, `neckTriads` and `neckNotes` (explore + quiz). Each mode returns `{ctrl, cm, regions, rings?, note, quiz?}`.
  - Scale boxes come from `box()`, which deals scale pitches in order, n per string, so it works for any tuning.
  - `placeBoxes()` picks octaves so that selected positions sit together.
- **Six-string shapes on other tunings:** `mapShape()` puts them on the top six strings at the same pitches, so on Drop D the low string gets +2 frets. Extra low strings get `withLowString()` (root/5th added to the E-shape), `powerAt()` (power chords on any string) and ringed chord tones in CAGED.
- **Sound:** Karplus-Strong plucked string through an amp chain (WebAudio). `playMidis()` damps the previous notes.

## How to test

Tests use headless Chromium through Playwright (`NODE_PATH=$(npm root -g)`), with `file:///…/index.html`. Service worker registration fails on `file://`, which is expected. To test the service worker, serve over `python3 -m http.server`.

What has been checked programmatically:
- every voicing, CAGED shape and triad contains only chord tones, for all tunings, modes and keys
- every mode has 7 distinct letters, and the key signature is between −7 and +7
- every progression and move id exists
- multi-select positions are placed for every combination
- the phone layout (390px wide) has no horizontal scroll

Add the same kind of check when you add logic.

## Conventions
- Keep it one file with vanilla JS, no framework and no build. Elias prefers simple code and small, focused changes.
- Keep the UI tidy. New features go behind an existing control or a small select, not in new panels.
- Commit as Elias. Messages have a summary line plus bullets.

## Open threads
- Elias may later buy a cheap side-project domain (e.g. `chordmap.<something>.dev`) and add it as a custom domain on the Pages project. The `pages.dev` name `chordmap` was taken, which is why it is `freechordmap`.
- If he reports that the app looks old: the old (pre-v7) service worker could serve a stale copy. Fix it with *Clear site data* or a reinstall on iPhone. v7 and later fix this for good.
- The name "Chord Map" may be outgrown now that the app does more. He said it is fine for now.
- Possible next ideas, not started: a mode overlay on the map, saving progressions, a drum loop, and showing the key signature on the staff for the selected chord's notes.
