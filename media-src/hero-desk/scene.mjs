// The hero desk, rendered offline (build plan, "Hero pass"; manifest A45-A56, A62). three.js 0.160.0 under headless Chromium.
// Flat Lambert "paper" materials, an orthographic camera from above, a hemisphere light and one soft key from the upper left.
// Nothing here ships: render.mjs drives this page, then ffmpeg encodes the PNG masters.
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const PIXEL = 960;
const FRAMES = 72;
const S = 1.6; // metres across the 960 px frame at zoom 1
const PHONE = { w: 780, h: 360, S: 1.7 };

const C = {
  teal: new THREE.Color("#18b1bf"),
  tealDeep: new THREE.Color("#12949f"),
  pale: new THREE.Color("#e8f1f1"),
  cream: new THREE.Color("#fbfaf6"),
  ground: new THREE.Color("#f6f6f3"),
  shadow: new THREE.Color("#0b5159"),
};
const lambert = (color, extra = {}) => new THREE.MeshLambertMaterial({ color, ...extra });
const M = {
  teal: lambert(C.teal),
  tealDeep: lambert(C.tealDeep),
  pale: lambert(C.pale),
  cream: lambert(C.cream),
};

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: false, powerPreference: "high-performance" });
renderer.setPixelRatio(1);
renderer.setSize(PIXEL, PIXEL);
renderer.setClearColor(C.ground, 1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
document.body.append(renderer.domElement);
const canvas = renderer.domElement;
window.__lost = false;
canvas.addEventListener("webglcontextlost", (e) => {
  e.preventDefault();
  window.__lost = true;
});

const scene = new THREE.Scene();

// --- lights: top-facing surfaces total pi (so albedo shows true), the key adds the form ---
scene.add(new THREE.HemisphereLight(0xffffff, new THREE.Color("#9fb4b6"), 0.58 * Math.PI));
const key = new THREE.DirectionalLight(0xffffff, 0.45 * Math.PI);
key.position.set(-0.55, 1.7, -0.45).normalize().multiplyScalar(4);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.radius = 9;
key.shadow.blurSamples = 20;
key.shadow.bias = -0.0004;
Object.assign(key.shadow.camera, { left: -1.4, right: 1.4, top: 1.4, bottom: -1.4, near: 0.5, far: 9 });
scene.add(key);

// --- ground: a shadow catcher over the clear colour, so the ground is exactly #f6f6f3 wherever no shadow falls ---
const catcher = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), new THREE.ShadowMaterial({ color: C.shadow, opacity: 0.17 }));
catcher.rotation.x = -Math.PI / 2;
catcher.receiveShadow = true;
scene.add(catcher);

// --- helpers ---
const tex = new THREE.TextureLoader();
const loadTexture = (name) =>
  new Promise((resolve, reject) => {
    tex.load(`/textures/${name}.jpg`, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      resolve(t);
    }, undefined, reject);
  });
const ONE = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
const manager = new THREE.LoadingManager();
manager.setURLModifier((url) => (/\.(jpe?g|png)$/i.test(url) ? ONE : url)); // every source texture is dropped
const gltf = new GLTFLoader(manager);
const load = (url) => new Promise((resolve, reject) => gltf.load(url, resolve, undefined, reject));

function shade(object, pick) {
  object.traverse((n) => {
    if (!n.isMesh) return;
    n.castShadow = true;
    n.receiveShadow = true;
    const list = Array.isArray(n.material) ? n.material : [n.material];
    const next = list.map((m, i) => pick(n, m, i) ?? M.teal);
    n.material = Array.isArray(n.material) ? next : next[0];
  });
}

/** A group whose footprint (after its own rotation) is fitted into a box of the frame, in u/v fractions. */
const reg = {}; // name -> group, for screen-space bounds
function place(name, content, frame, box, { rot = 0, fit = "contain", scaleBy = 1, level = 0 } = {}) {
  const pivot = new THREE.Group();
  pivot.add(content);
  const turn = new THREE.Group();
  turn.add(pivot);
  turn.rotation.y = -THREE.MathUtils.degToRad(rot);
  const raw = new THREE.Box3().setFromObject(turn);
  const w = raw.max.x - raw.min.x;
  const d = raw.max.z - raw.min.z;
  const bw = (box[1] - box[0]) * frame.S;
  const bh = (box[3] - box[2]) * frame.S * (frame.h / frame.w) * (frame.w / frame.h); // v is a fraction of the frame's height
  const boxH = (box[3] - box[2]) * frame.S * (frame.h / frame.w);
  const k = (fit === "width" ? bw / w : Math.min(bw / w, boxH / d)) * scaleBy;
  turn.scale.setScalar(k);
  const fitted = new THREE.Box3().setFromObject(turn);
  const cx = ((box[0] + box[1]) / 2 - 0.5) * frame.S;
  const cz = ((box[2] + box[3]) / 2 - 0.5) * frame.S * (frame.h / frame.w);
  turn.position.set(cx - (fitted.min.x + fitted.max.x) / 2, level - fitted.min.y, cz - (fitted.min.z + fitted.max.z) / 2);
  void bh;
  turn.name = name;
  reg[name] = turn;
  group.add(turn);
  return turn;
}

let group = new THREE.Group();
scene.add(group);

/** A print: a thin cream card with the prepared photo on top. */
function card(texture, width, thickness = 0.0025) {
  const aspect = texture.image.width / texture.image.height;
  const height = width / aspect;
  const edge = lambert(C.cream);
  const top = lambert(0xffffff, { map: texture });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, thickness, height), [edge, edge, top, edge, edge, edge]);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/** The notebook, opened like a page spread: two cream pages on a teal board, a hairline spine, an elastic band on the left. */
function notebook(a46) {
  const g = new THREE.Group();
  const page = (x) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.336, 0.006, 0.236), M.cream);
    m.position.set(x, 0.009, 0);
    m.castShadow = m.receiveShadow = true;
    return m;
  };
  const board = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.008, 0.256), M.teal);
  board.position.y = 0.004;
  board.castShadow = board.receiveShadow = true;
  g.add(board, page(-0.172), page(0.172));
  // a stack edge under each page, so the spread reads as a thick block of paper
  for (const x of [-0.172, 0.172]) {
    const under = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.004, 0.24), M.pale);
    under.position.set(x, 0.0075, 0);
    under.receiveShadow = true;
    g.add(under);
  }
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.0065, 0.236), M.pale);
  spine.position.set(0, 0.0095, 0);
  g.add(spine);
  void a46;
  return g;
}

let models = null;
async function loadModels() {
  if (models) return models;
  const [laptop, notebookModel, books, lamp, pack] = await Promise.all([
    load("/models/A45-classic-laptop/classic_laptop_1k.gltf"),
    load("/models/A46-binder-notebook/binder_notebook_1k.gltf"),
    load("/models/A47-book-encyclopedia-set-01/book_encyclopedia_set_01_1k.gltf"),
    load("/models/A48-desk-lamp-arm-01/desk_lamp_arm_01_1k.gltf"),
    load("/models/A49-backpack/backpack.glb"),
  ]);
  const textures = {};
  for (const name of ["A57-postcard", "A58-campus-print", "A59-laptop-screen", "A60-lindwurm-print", "A61-map"]) textures[name] = await loadTexture(name);
  models = { laptop, notebookModel, books, lamp, pack, textures };
  return models;
}

const clone = (o) => o.clone(true);

function buildLaptop(src, screenTexture) {
  const root = clone(src.scene);
  let lid = null;
  let screenPrim = null;
  root.traverse((n) => {
    if (n.name === "classic_laptop_screen") lid = n;
    if (n.isMesh && /lid_floaters/.test(n.name)) screenPrim = n;
  });
  shade(root, (n, m) => (/screen/.test(m.name) ? M.tealDeep : M.teal));
  // The lid leans back; the screen faces the camera. LID_DEG is the angle of the lid past vertical.
  const past = THREE.MathUtils.degToRad(LID_PAST_VERTICAL);
  if (lid) {
    lid.rotation.x = -past;
    // our own screen plane over the original screen primitive (its UVs are unknown): 0.449 x 0.367 at z 0.006 in the lid's frame
    const mat = lambert(0xffffff, { map: screenTexture });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(0.449, 0.367), mat);
    plane.position.set(0.0005, 0.2415, 0.0075);
    plane.castShadow = false;
    plane.receiveShadow = true;
    lid.add(plane);
    // cover-fit the photo to the plane
    const ta = screenTexture.image.width / screenTexture.image.height;
    const pa = 0.449 / 0.367;
    screenTexture.wrapS = screenTexture.wrapT = THREE.ClampToEdgeWrapping;
    if (ta > pa) {
      screenTexture.repeat.set(pa / ta, 1);
      screenTexture.offset.set((1 - pa / ta) / 2, 0);
    } else {
      screenTexture.repeat.set(1, ta / pa);
      screenTexture.offset.set(0, (1 - ta / pa) / 2);
    }
    // hide the original screen primitive (index 1 of the lid mesh)
    screenPrim?.material && Array.isArray(screenPrim.material) && (screenPrim.material[1] = new THREE.MeshBasicMaterial({ visible: false }));
  }
  return root;
}

function buildBooks(src) {
  const root = new THREE.Group();
  const books = clone(src.scene).children;
  // Six books lie flat in two small piles, a little out of square. Cover teal, deep teal or pale; paper cream.
  const piles = [
    { x: -0.15, z: 0.0, turn: -2, picks: [0, 3, 6, 9, 12] },
    { x: 0.13, z: 0.01, turn: 3, picks: [1, 4, 7, 10] },
  ];
  piles.forEach((pile) => {
    let height = 0;
    pile.picks.forEach((index, k) => {
      const node = books[index];
      node.position.set(0, 0, 0);
      node.rotation.set(0, 0, -Math.PI / 2); // tall axis (y) onto x: the book lies on its side
      const wrap = new THREE.Group();
      wrap.add(node);
      wrap.updateMatrixWorld(true);
      const b = new THREE.Box3().setFromObject(wrap);
      const t = b.max.y - b.min.y;
      wrap.position.set(pile.x - (b.min.x + b.max.x) / 2 + (k % 2 ? 0.012 : -0.008), height - b.min.y, pile.z - (b.min.z + b.max.z) / 2 + (k % 2 ? 0.007 : -0.005));
      wrap.rotation.y = THREE.MathUtils.degToRad(pile.turn + (k % 2 ? 1.6 : -1.2));
      height += t;
      const tone = [M.teal, M.pale, M.tealDeep, M.teal, M.pale][k % 5];
      shade(node, (n, m) => (/paper/.test(m.name) ? M.cream : tone));
      root.add(wrap);
    });
  });
  return root;
}

function buildLamp(src) {
  const root = clone(src.scene);
  shade(root, (n, m) => (/light/.test(m.name) ? M.pale : M.teal));
  root.rotation.z = Math.PI / 2; // lying on its side, so the arm and the head read from above
  const g = new THREE.Group();
  g.add(root);
  return g;
}

function buildPack(src) {
  const root = clone(src.scene);
  let k = 0;
  shade(root, (n, m) => {
    const name = `${n.name} ${m.name}`.toLowerCase();
    if (/strap|buckle|handle|zip/.test(name)) return M.pale;
    return k++ % 2 === 0 ? M.teal : M.tealDeep;
  });
  root.rotation.x = -Math.PI / 2;
  const g = new THREE.Group();
  g.add(root);
  return g;
}

let LID_PAST_VERTICAL = 45;

/** Builds the whole desk for one layout: "main" (960 square, frame 000 and the clip) or "phone" (780 x 360, A54). */
async function buildDesk(layout) {
  scene.remove(group);
  group = new THREE.Group();
  scene.add(group);
  for (const k of Object.keys(reg)) delete reg[k];
  const m = await loadModels();
  const T = m.textures;
  const isPhone = layout === "phone";
  const frame = isPhone ? { w: PHONE.w, h: PHONE.h, S: PHONE.S } : { w: PIXEL, h: PIXEL, S };

  // boxes are [u0, u1, v0, v1] of the frame
  const L = isPhone
    ? {
        books: [0.05, 0.3, 0.07, 0.34],
        postcard: [0.38, 0.5, 0.07, 0.36],
        notebook: [0.08, 0.52, 0.42, 0.88],
        print: [0.11, 0.21, 0.5, 0.74],
        laptop: [0.62, 0.95, 0.08, 0.92],
        lindwurm: null,
        lamp: null,
        map: null,
        pack: null,
      }
    : {
        books: [0.075, 0.4, 0.15, 0.27],
        postcard: [0.47, 0.63, 0.16, 0.27],
        lamp: [0.74, 0.9, 0.15, 0.31],
        notebook: [0.24, 0.68, 0.31, 0.47],
        print: [0.27, 0.39, 0.33, 0.41],
        lindwurm: [0.74, 0.86, 0.36, 0.48],
        laptop: [0.52, 0.92, 0.5, 0.84],
        map: [0.07, 0.34, 0.6, 0.8],
        pack: [0.14, 0.4, 0.64, 0.85],
      };

  place("books", buildBooks(m.books), frame, L.books, { rot: 0, fit: "width" });
  const nb = place("notebook", notebook(m.notebookModel), frame, L.notebook, { rot: 0, fit: "width" });
  const nbTop = new THREE.Box3().setFromObject(nb).max.y;
  place("print", card(T["A58-campus-print"], 0.19), frame, L.print, { rot: 3, fit: "width", level: nbTop });
  place("postcard", card(T["A57-postcard"], 0.25), frame, L.postcard, { rot: -5, fit: "width" });
  const lap = place("laptop", buildLaptop(m.laptop, T["A59-laptop-screen"]), frame, L.laptop, { rot: -4 });
  if (!isPhone) {
    place("lamp", buildLamp(m.lamp), frame, L.lamp, { rot: 0 });
    place("lindwurm", card(T["A60-lindwurm-print"], 0.19), frame, L.lindwurm, { rot: 8, fit: "width" });
    // the map folded in two: the right half sits a hair higher and a little turned, so the fold throws a soft shadow
    const halves = new THREE.Group();
    [0, 1].forEach((side) => {
      const t = T["A61-map"].clone();
      t.needsUpdate = true;
      t.repeat.set(0.5, 1);
      t.offset.set(side * 0.5, 0);
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.215, 0.0022 + side * 0.0018, 0.32), [M.cream, M.cream, lambert(0xffffff, { map: t }), M.cream, M.cream, M.cream]);
      mesh.position.set(side ? 0.1085 : -0.1085, (0.0022 + side * 0.0018) / 2, 0);
      mesh.rotation.y = THREE.MathUtils.degToRad(side ? -1.4 : 0);
      mesh.castShadow = mesh.receiveShadow = true;
      halves.add(mesh);
    });
    place("map", halves, frame, L.map, { rot: -3, fit: "width" });
    place("pack", buildPack(m.pack), frame, L.pack, { rot: 20, level: 0.004 });
  }
  void lap;
  tapeStrip(frame, L.postcard);
  return { frame, L };
}

function tapeStrip(frame, box) {
  const post = reg.postcard;
  if (!post) return;
  const b = new THREE.Box3().setFromObject(post);
  const tape = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.0008, 0.022), M.pale);
  tape.position.set((b.min.x + b.max.x) / 2 + 0.01, b.max.y + 0.0004, b.min.z + 0.008);
  tape.rotation.y = THREE.MathUtils.degToRad(-5 + 6);
  tape.receiveShadow = true;
  tape.castShadow = true;
  group.add(tape);
}

// --- camera ---
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 20);
const smooth = (t) => t * t * (3 - 2 * t);
const page = new THREE.Vector3(); // centre of the right page, in the world

// Main clip: a real camera move over the desk (hero-fix, review D1). Four knots, a monotone-ish cubic Hermite through them:
//   frame 0   the whole desk, flat, zoom 1 (identical to the poster A53)
//   frame 18  over the backpack   (arrival)
//   frame 38  over the laptop     (applications, housing search)
//   frame 61  down to the notebook's right page, which then holds still to frame 71 (the settle rule: frames 61-71 move nothing)
// Each knot is "this desk point at this screen position at this zoom"; the camera centre follows from that.
const LAST = { u: 0.6, v: 0.37 }; // landing.last: where the right page sits in the last frame
const TOUR = [
  { f: 0, z: 1 },
  { f: 18, of: "pack", s: [0.45, 0.42], z: 1.45 },
  { f: 38, of: "laptop", s: [0.56, 0.4], z: 1.25 },
  { f: 61, of: "page", s: [LAST.u, LAST.v], z: 1.1 },
];
let knots = null;
const centre = (obj) => {
  const box = new THREE.Box3().setFromObject(obj);
  return new THREE.Vector3((box.min.x + box.max.x) / 2, 0, (box.min.z + box.max.z) / 2);
};
function buildKnots(frameSpec) {
  knots = TOUR.map((k) => {
    if (!k.of) return { f: k.f, x: 0, y: 0, lz: Math.log(k.z) };
    const F = k.of === "page" ? page : centre(reg[k.of]);
    const half = frameSpec.S / k.z;
    return { f: k.f, x: F.x - (k.s[0] - 0.5) * half, y: F.z - (k.s[1] - 0.5) * half, lz: Math.log(k.z) };
  });
}
function tour(frameIndex) {
  const last = knots.length - 1;
  const f = Math.min(frameIndex, knots[last].f);
  let i = 0;
  while (i < last - 1 && f > knots[i + 1].f) i++;
  const a = knots[i];
  const b = knots[i + 1];
  const h = b.f - a.f;
  const t = (f - a.f) / h;
  const slope = (j, key) => {
    if (j === 0 || j === last) return 0; // rest at both ends
    const p = knots[j - 1];
    const n = knots[j + 1];
    return (0.8 * (n[key] - p[key])) / (n.f - p.f);
  };
  const out = {};
  for (const key of ["x", "y", "lz"]) {
    const m0 = slope(i, key) * h;
    const m1 = slope(i + 1, key) * h;
    const t2 = t * t;
    const t3 = t2 * t;
    out[key] = (2 * t3 - 3 * t2 + 1) * a[key] + (t3 - 2 * t2 + t) * m0 + (-2 * t3 + 3 * t2) * b[key] + (t3 - t2) * m1;
  }
  return { x: out.x, y: out.y, z: Math.exp(out.lz) };
}

function setCamera(frameSpec, b, frameIndex = 0) {
  const aspect = frameSpec.w / frameSpec.h;
  const isMain = frameSpec.w === frameSpec.h;
  const tr = isMain ? tour(frameIndex) : { x: 0, y: 0, z: 1 };
  const halfW = frameSpec.S / (2 * tr.z);
  camera.left = -halfW;
  camera.right = halfW;
  camera.top = halfW / aspect;
  camera.bottom = -halfW / aspect;
  camera.updateProjectionMatrix();
  // a slight bank while the camera travels, flat again before the settle (b 0.85)
  const swing = Math.sin(Math.PI * Math.min(b / 0.85, 1));
  const ax = isMain ? THREE.MathUtils.degToRad(4) * swing : 0;
  const az = isMain ? THREE.MathUtils.degToRad(-2.5) * swing : 0;
  const T = new THREE.Vector3(tr.x, 0, tr.y);
  camera.up.set(0, 0, -1);
  camera.position.set(T.x + Math.tan(ax) * 6, 6, T.z + Math.tan(az) * 6);
  camera.lookAt(T);
  camera.updateMatrixWorld();
}

function project(vec3) {
  const p = vec3.clone().project(camera);
  return { u: (p.x + 1) / 2, v: (1 - p.y) / 2 };
}

function objectBounds() {
  const out = {};
  for (const [name, obj] of Object.entries(reg)) {
    const box = new THREE.Box3().setFromObject(obj);
    let u0 = 9, u1 = -9, v0 = 9, v1 = -9;
    for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) {
      const p = project(new THREE.Vector3(x, y, z));
      u0 = Math.min(u0, p.u); u1 = Math.max(u1, p.u); v0 = Math.min(v0, p.v); v1 = Math.max(v1, p.v);
    }
    out[name] = [u0, u1, v0, v1].map((n) => +n.toFixed(4));
  }
  return out;
}

const state = { layout: null, frame: null, first: null, last: null };

window.setup = async (layout, opts = {}) => {
  if (opts.lid != null) LID_PAST_VERTICAL = opts.lid;
  const built = await buildDesk(layout);
  state.layout = layout;
  state.frame = built.frame;
  const [nu0, nu1, nv0, nv1] = built.L.notebook;
  // centre of the right page, on the paper surface
  const nbBox = new THREE.Box3().setFromObject(reg.notebook);
  page.set(nbBox.min.x + (nbBox.max.x - nbBox.min.x) * 0.75, nbBox.max.y, (nbBox.min.z + nbBox.max.z) / 2);
  void nu0; void nu1; void nv0; void nv1;
  // landing.first is where the page centre falls in the whole-desk frame (frame 0); landing.last is LAST, where the tour ends
  renderer.setSize(built.frame.w, built.frame.h);
  const base = centredPage(built.frame);
  state.first = base;
  state.last = state.layout === "main" ? { ...LAST } : base;
  if (state.layout === "main") buildKnots(built.frame);
  return { first: state.first, last: state.last, S: built.frame.S };
};

/** The page centre's position with the camera over the frame's middle and no zoom, i.e. frame 000. */
function centredPage(frameSpec) {
  const aspect = frameSpec.w / frameSpec.h;
  camera.left = -frameSpec.S / 2;
  camera.right = frameSpec.S / 2;
  camera.top = frameSpec.S / 2 / aspect;
  camera.bottom = -frameSpec.S / 2 / aspect;
  camera.updateProjectionMatrix();
  camera.up.set(0, 0, -1);
  camera.position.set(0, 6, 0);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  const p = project(page);
  return { u: +p.u.toFixed(4), v: +p.v.toFixed(4) };
}

window.renderFrame = (i) => {
  const b = state.layout === "main" ? i / (FRAMES - 1) : 0;
  setCamera(state.frame, b, i);
  renderer.render(scene, camera);
  const landing = project(page);
  return { png: canvas.toDataURL("image/png"), landing: { u: +landing.u.toFixed(4), v: +landing.v.toFixed(4) }, bounds: objectBounds(), b };
};

window.__ready = true;
