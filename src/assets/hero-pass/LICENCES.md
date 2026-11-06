# Hero pass: licences and provenance

Originals for the hero pass (concept B, Desk Ledger). Written by `hero-assets`, 2026-11-04.

- **Nothing in this folder is imported by `src/`.** The render script reads the originals in place (AC-H17).
- Every licence was read again on the day of the fetch (2026-11-04); none had changed since the plan.
- Poly Haven models: only the `.gltf` and its `.bin`. The textures the `.gltf` names (`textures/*.jpg`) are **not downloaded**, because every material is replaced in the render. A loader will log 404s for them; handle it with a `LoadingManager` URL modifier or ignore the texture errors.
- Photos: each original is byte for byte as served (the Commons 1280 px thumbnail, or the 1600 px original for C1).
- Not legal advice.

## Models (render inputs, never served)

CC0 1.0 licence URL, all rows: https://creativecommons.org/publicdomain/zero/1.0/

| ID | File(s) | Source URL (page) | Downloaded from | Author | Licence | Licence page | Fetch date | SHA-256 | Attribution |
|---|---|---|---|---|---|---|---|---|---|
| A45 | `models/A45-classic-laptop/classic_laptop_1k.gltf` (7,496 B) | https://polyhaven.com/a/classic_laptop | https://dl.polyhaven.org/file/ph-assets/Models/gltf/1k/classic_laptop/classic_laptop_1k.gltf | Arrangemonk | CC0 | https://polyhaven.com/license | 2026-11-04 | `c78867ed92356fe03fd90b56438f3b141b5f8654672da52c6df7868eb820cf78` | none required |
| A45 | `models/A45-classic-laptop/classic_laptop.bin` (508,524 B) | as above | https://dl.polyhaven.org/file/ph-assets/Models/gltf/8k/classic_laptop/classic_laptop.bin | Arrangemonk | CC0 | https://polyhaven.com/license | 2026-11-04 | `0f1602f2fe856fd330e95df44af0fd9986aeac873343307c70e036041e789fb9` | none required |
| A46 | `models/A46-binder-notebook/binder_notebook_1k.gltf` (4,309 B) | https://polyhaven.com/a/binder_notebook | https://dl.polyhaven.org/file/ph-assets/Models/gltf/1k/binder_notebook/binder_notebook_1k.gltf | DaDrood | CC0 | https://polyhaven.com/license | 2026-11-04 | `714596552fad383ae3ca76d42038b03a20b6864d6ef5bc6d12620ac21fef1b1e` | none required |
| A46 | `models/A46-binder-notebook/binder_notebook.bin` (525,488 B) | as above | https://dl.polyhaven.org/file/ph-assets/Models/gltf/8k/binder_notebook/binder_notebook.bin | DaDrood | CC0 | https://polyhaven.com/license | 2026-11-04 | `68e28e6fac708a6e172230c42debd990e48819566fa07f222415467b1034b9c0` | none required |
| A47 | `models/A47-book-encyclopedia-set-01/book_encyclopedia_set_01_1k.gltf` (55,011 B) | https://polyhaven.com/a/book_encyclopedia_set_01 | https://dl.polyhaven.org/file/ph-assets/Models/gltf/1k/book_encyclopedia_set_01/book_encyclopedia_set_01_1k.gltf | John Malcolm | CC0 | https://polyhaven.com/license | 2026-11-04 | `89eb80fffd619ebbe5043d632bd8cf25b2d68a3614aee2f356e850c69ae498ba` | none required |
| A47 | `models/A47-book-encyclopedia-set-01/book_encyclopedia_set_01.bin` (2,547,932 B) | as above | https://dl.polyhaven.org/file/ph-assets/Models/gltf/8k/book_encyclopedia_set_01/book_encyclopedia_set_01.bin | John Malcolm | CC0 | https://polyhaven.com/license | 2026-11-04 | `bbc726698b6e40ab5537b73e082f7bb4db97b9e6f978f52cdaf763dddc85d9ba` | none required |
| A48 | `models/A48-desk-lamp-arm-01/desk_lamp_arm_01_1k.gltf` (4,453 B) | https://polyhaven.com/a/desk_lamp_arm_01 | https://dl.polyhaven.org/file/ph-assets/Models/gltf/1k/desk_lamp_arm_01/desk_lamp_arm_01_1k.gltf | Kuutti Siitonen (modelling, texturing), Yann Kervran (rigging) | CC0 | https://polyhaven.com/license | 2026-11-04 | `2ac8389afc1519449a9cfdf7efd9fa36780a2177bb47ab58f7a7dda7d247dc8c` | none required |
| A48 | `models/A48-desk-lamp-arm-01/desk_lamp_arm_01.bin` (736,804 B) | as above | https://dl.polyhaven.org/file/ph-assets/Models/gltf/8k/desk_lamp_arm_01/desk_lamp_arm_01.bin | Kuutti Siitonen, Yann Kervran | CC0 | https://polyhaven.com/license | 2026-11-04 | `07f34e32abecbaa63d28b9d12d6a0eb82b775a0f50c92327655909d72ff8489b` | none required |
| A49 | `models/A49-backpack/backpack.glb` (217,084 B) | https://poly.pizza/m/vF7TuXCPDH | https://static.poly.pizza/2eb5178b-0c98-4a0d-b0ea-ad8925525d1e.glb | Quaternius (Low Poly Objects) | "Public Domain (CC0)", shown on the model page (page data: `"Licence":"CC0 1.0"`) | https://creativecommons.org/publicdomain/zero/1.0/ | 2026-11-04 | `404af15a4bc0a955d9d8133d16de7a4b900663f3a11f5364624ab8e7e9b6f68a` | none required |

Poly Haven licence text read at https://polyhaven.com/license: "Our assets are all licensed as CC0". Each model page also names CC0.

A50 (Kenney Furniture Kit, contingency): **not fetched.** A45–A49 all opened and read as the intended objects, so the contingency was not triggered.

## Photos

Public-domain rows have no licence-page URL of their own: the licence is the template on the file page (column "Licence page"). Commons API fields read 2026-11-04 (`prop=imageinfo`, `iiprop=extmetadata`): `LicenseShortName`, `Artist`, `DateTimeOriginal`.

**Render inputs, public domain only (A57–A61).** Nothing under a ShareAlike licence goes into the render.

| ID / ref | File | File page | Downloaded from | Author | Licence | Licence page | Fetch date | SHA-256 | Attribution |
|---|---|---|---|---|---|---|---|---|---|
| A57 / W1 | `photos/W1-Woerthersee_carinthia.jpg` (1280×850, 180,663 B) | https://commons.wikimedia.org/wiki/File:Woerthersee_carinthia.jpg | https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Woerthersee_carinthia.jpg/1280px-Woerthersee_carinthia.jpg | Dane (photo 2005-08-09) | Public domain | https://commons.wikimedia.org/wiki/File:Woerthersee_carinthia.jpg | 2026-11-04 | `1ede4be18cb86ae4ae24f6f4b6175734922474b32f32280d22a9d1b6ab7ab20a` | none required |
| A58 / C7 | `photos/C7-Klagenfurt_-_University.JPG` (1280×853, 264,066 B) | https://commons.wikimedia.org/wiki/File:Klagenfurt_-_University.JPG | https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Klagenfurt_-_University.JPG/1280px-Klagenfurt_-_University.JPG | JJ55 (photo 2008-08-10) | Public domain | https://commons.wikimedia.org/wiki/File:Klagenfurt_-_University.JPG | 2026-11-04 | `7a96265cae49062a40d878bd47f008b6b9faa4157717d6951b39156f8b142376` | none required |
| A59 / C8 | `photos/C8-Klagenfurt_-_Lakeside_Park.JPG` (1280×853, 375,794 B) | https://commons.wikimedia.org/wiki/File:Klagenfurt_-_Lakeside_Park.JPG | https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Klagenfurt_-_Lakeside_Park.JPG/1280px-Klagenfurt_-_Lakeside_Park.JPG | JJ55 (photo 2008-08-10) | Public domain | https://commons.wikimedia.org/wiki/File:Klagenfurt_-_Lakeside_Park.JPG | 2026-11-04 | `c90361fbed65e72005515f8b4e03f32ee4f9a929a8febdbb93ab1d641ab55dc5` | none required |
| A60 / C15 | `photos/C15-Klagenfurt_-_Lindwurm_-Detail.JPG` (1280×853, 157,867 B) | https://commons.wikimedia.org/wiki/File:Klagenfurt_-_Lindwurm_-Detail.JPG | https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Klagenfurt_-_Lindwurm_-Detail.JPG/1280px-Klagenfurt_-_Lindwurm_-Detail.JPG | JJ55 (photo 2008-08-10) | Public domain | https://commons.wikimedia.org/wiki/File:Klagenfurt_-_Lindwurm_-Detail.JPG | 2026-11-04 | `6146ed3c2e9527a758311101ab37bdaa5df4727862fc49520ca79b07fd92a691` | none required |
| A61 / M1 | `photos/M1-Klagenfurt_-_btv1b8459825t.jpg` (1280×1063, 455,304 B) | https://commons.wikimedia.org/wiki/File:Klagenfurt_-_btv1b8459825t.jpg | https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Klagenfurt_-_btv1b8459825t.jpg/1280px-Klagenfurt_-_btv1b8459825t.jpg | Lith. Gutenberghaus (Klagenfurt), 1912; source Bibliothèque nationale de France | Public domain | https://commons.wikimedia.org/wiki/File:Klagenfurt_-_btv1b8459825t.jpg | 2026-11-04 | `f03016856af9bd06d3b91116e0ba44aff57cd3f44cbda8686ce737ffb1294036` | none required |

**Served photo, CC BY-SA 3.0 (A63).** Shown whole, resized and re-encoded, with a visible credit (N15). It never enters A51–A54. **The web copies stay under CC BY-SA 3.0.**

| ID / ref | File | File page | Downloaded from | Author | Licence | Licence page | Fetch date | SHA-256 | Attribution line |
|---|---|---|---|---|---|---|---|---|---|
| A63 / C1 (original) | `photos/C1-Aau_luftbild.jpg` (1600×1066, 1,908,717 B) | https://commons.wikimedia.org/wiki/File:Aau_luftbild.jpg | https://upload.wikimedia.org/wikipedia/commons/d/d2/Aau_luftbild.jpg (the 1600 px original, via `iiurlwidth=1600`) | Uniklupresse (photo 2019-09-06, "Own work") | CC BY-SA 3.0 | https://creativecommons.org/licenses/by-sa/3.0/ | 2026-11-04 | `59c824ccfc620732437fbfad7979eb3bb8c7223c8d4468d5f1e9c25d4ca4d776` | Photo: "Aau luftbild" by Uniklupresse, CC BY-SA 3.0, via Wikimedia Commons |

Web copies of C1 (derivatives, CC BY-SA 3.0, made with `ffmpeg` 8.1.2 `libwebp`, resize only, no crop, no grade, no retouch):

| File | Dimensions | Bytes | Encode | SHA-256 |
|---|---|---|---|---|
| `public/media/photos/campus-aerial-720.webp` | 720×480 | 58,704 | `scale=720:-2:flags=bicubic`, `-quality 46 -preset photo -compression_level 6` | `09ff02eb1c19cc4acd8aa04a2537f4dcfa3264dbfb1694480070053caa28423d` |
| `public/media/photos/campus-aerial-1104.webp` | 1104×736 | 107,860 | `scale=1104:-2:flags=bicubic`, `-quality 38` | `b518bc5266a8e54bffbf60fa7e6a3aa078f16362b2bb1aeba6a102c142045d0f` |
| `public/media/photos/campus-aerial-1600.webp` | 1600×1066 | 187,452 | no scale, `-quality 32` | `6f45ca25f9b4625ff8b34b522c96ed5577c9670b15a01dada3f63d9a41ff3820` |

**Fallbacks C2, C3 (CC BY-SA 3.0):** not fetched. C1's licence read unchanged ("CC BY-SA 3.0", Uniklupresse), so no fallback was needed.

**Read and rejected, as the manifest says:** C4 (legible name sign), C12 (BY-SA, W1 covers the lake), M2 (33 MB, M1 is enough).

## Renders made from these originals (what the site ships), added by `hero-build`

Made locally with the hero-desk render folder (three.js 0.160.0, Playwright, `ffmpeg`, `sharp`); no AI, 0 credits. Inputs: the five CC0 models above and the five **public-domain** photos W1, C7, C8, C15 and M1 only. **The CC BY-SA aerial C1 never enters a render**, so the clip and the stills are ours and carry no ShareAlike condition. SHA-256 and sizes of every output are in `.olympus/relay/hero-build.report.md`.

| Output | Built from |
|---|---|
| `public/media/hero/desk.webm`, `desk.mp4`, `desk.poster.webp`, `desk.poster-phone.webp` | A45-A49 (CC0) and A57-A61 (public domain), by `render.mjs` and `encode.mjs` |
| `public/media/dragonfly/s384/frame-00..15.webp` | The existing A02 frames, resized |
| `public/media/photos/campus-aerial-720.webp`, `-1104.webp`, `-1600.webp` | C1, resized and re-encoded only. **Stay under CC BY-SA 3.0**; the credit is in the page (N15) |

## AAU press photos (A64)

**Not fetched: awaiting AAU press-office consent.** No file from A1–A9 on aau.at is in the repository, and `public/aau-press/` does not exist. The consent, once given, is filed in `.olympus/` and referenced here.

## References, never shipped

Pinterest pins: none supplied or recorded. Nothing ships from a Pinterest image.
