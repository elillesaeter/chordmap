# Chord Map

Interactive chord map for guitar: keys, chords, voicings and scale positions.

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
