# Chord Map

Interactive chord map for guitar: keys, chords, voicings and scale positions, plus neck training.

- **Key:** major, minor and the five other modes (Lydian, Mixolydian, Dorian, Phrygian, Locrian), with key signature, scale degrees, triads and 7th chords, and the relative or parent key.
- **Map:** where each chord likes to go, including borrowed dominant 7ths.
- **Voicings:** open, E/A-shape barre, 7th, power chords and triads, with interval labels.
- **The neck:** Scales (pentatonic, blues, full, arpeggio, positions), CAGED (five shapes with their pentatonic box), Triads (every inversion per string set) and Notes (explore + quiz).

**Live:** https://elillesaeter.github.io/chordmap/

## Install as an app

Chord Map is a PWA, so it can be installed and works offline.

- **Chrome / Edge / Brave (desktop):** click the install icon in the address bar.
- **iPhone / iPad:** in Safari, Share → Add to Home Screen.
- **Android:** in Chrome, menu → Install app.

Firefox-based browsers (Firefox, Zen) on macOS and Linux can't install PWAs; the site still works normally in them.

## Run locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000. When you deploy a change, bump `CACHE` in `sw.js` so installed copies pick it up on the next load.
