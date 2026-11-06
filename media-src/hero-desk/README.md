# hero-desk: the offline render behind the home hero

Build plan: `.olympus/06-build-plan.md`, *Hero pass* and its addendum. Manifest rows A45-A56 and A62: `.olympus/05-asset-manifest.md`.
This folder is never imported by the site and has its own `package.json` (`three@0.160.0`, `sharp`). Playwright resolves from the site's devDependency.

```
npm install
node prep-photos.mjs      # A62: crops, grades and resizes the public-domain photos into ./textures/ (gitignored)
node render.mjs           # 72 frames + the phone still -> ../out/hero/*.png (gitignored), camera.json
node encode.mjs           # ffmpeg + sharp: public/media/hero/desk.{webm,mp4,poster.webp,poster-phone.webp}, public/media/dragonfly/s384/
node write-data.mjs       # src/data/heroDesk.ts (landing points) and ./camera.json (the committed camera and bounds log)
```

- **Scene** (`scene.html`, `scene.mjs`): flat `MeshLambertMaterial` "paper" on the CC0 models from `src/assets/hero-pass/models/`, an orthographic
  camera from above, a hemisphere light and one soft key from the upper left, a shadow-catcher ground over the clear colour `#f6f6f3`. No text, no logo.
- **Camera path:** zoom 1 to 1.08, a tilt that peaks mid-clip (8 deg in x, -4 deg in z) and returns to flat, and a pan that moves the right notebook page
  from `landing.first` to `landing.last` along a smoothstep. Frame 0 and the last frame are both flat top-down.
- **Render:** one page and one WebGL context, `setPixelRatio(1)`, 960 x 960, `preserveDrawingBuffer`. Frames go out in batches of at most 12, each read back with
  `toDataURL` and written as a PNG. On `webglcontextlost` the page is reloaded and the run continues from the frames already written. SwiftShader, so slow
  but deterministic (about 50 s for the whole clip).
- **Encodes** are ceilings, not targets: `encode.mjs` raises the CRF (never drops frames) until each file fits. WebM is limited-range (`tv`) BT.709 VP9, all-intra.
- `camera.json` holds each frame's page-centre projection and every object's screen-space bounds, for the safe-area check in `.olympus/relay/hero-build.report.md`.
