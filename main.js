import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { createLessons } from './lessons.js?v=2';

/* =====================================================================
   1. SCENE, CAMERA, RENDERER, LIGHTS
   ===================================================================== */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfdcc9);

// Make VIEW_SIZE bigger to zoom out, smaller to zoom in.
const VIEW_SIZE = 25;
const CAMERA_TARGET = new THREE.Vector3(0, -1.5, 0);
const CAMERA_OFFSET = new THREE.Vector3(20, 22, 20);

const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
camera.position.copy(CAMERA_TARGET).add(CAMERA_OFFSET);
camera.lookAt(CAMERA_TARGET);

function fitCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    const size = Math.max(VIEW_SIZE, 46 / aspect);
    camera.left = (-size * aspect) / 2;
    camera.right = (size * aspect) / 2;
    camera.top = size / 2;
    camera.bottom = -size / 2;
    camera.updateProjectionMatrix();
}
fitCamera();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
document.body.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff, 0xcfe3cf, 1.5));

const sun = new THREE.DirectionalLight(0xfff1d6, 2.6);
sun.position.set(-8, 22, -3);
sun.target.position.set(0, -2, 0);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -30;
sun.shadow.camera.right = 30;
sun.shadow.camera.top = 30;
sun.shadow.camera.bottom = -30;
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 80;
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.03;
scene.add(sun, sun.target);

/* =====================================================================
   2. SMALL HELPERS
   ===================================================================== */
const std = (color, opts = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.85, ...opts });

const flat = (color, opts = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.9, flatShading: true, ...opts });

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);

function addMesh(parent, geometry, material, x = 0, y = 0, z = 0, opts = {}) {
    const { cast = true, receive = false } = opts;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = cast;
    mesh.receiveShadow = receive;
    parent.add(mesh);
    return mesh;
}

function mulberry32(seed) {
    return function () {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
const rand = mulberry32(7);

const maxAniso = renderer.capabilities.getMaxAnisotropy();

/* =====================================================================
   3. THE ISLAND (ground)
   ===================================================================== */
const GROUND_Y = -4;

const island = new THREE.Group();
addMesh(island, new THREE.CylinderGeometry(22, 22.6, 0.6, 12), flat(0xa9cb92),
    0, GROUND_Y - 0.3, 0, { cast: false, receive: true });
addMesh(island, new THREE.CylinderGeometry(22.6, 15, 4.5, 12), flat(0x8c7c68),
    0, GROUND_Y - 0.6 - 2.25, 0, { cast: false, receive: true });
island.rotation.y = 0.26;
scene.add(island);

/* =====================================================================
   4. THE HOUSE  (bigger square, shorter L)
      Main block:  x -10 to 4,  z -7 to 7     (14 x 14)
      Extension:   x   4 to 10, z -7 to -1    (6 x 6)
      Roof surface is at y = 0
   ===================================================================== */
const MAIN = { x0: -10, x1: 4, z0: -7, z1: 7 };
const EXT = { x0: 4, x1: 10, z0: -7, z1: -1 };
const TILE = 2;

function makeTileTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    g.fillStyle = '#80a891';
    g.fillRect(0, 0, 128, 128);
    g.strokeStyle = 'rgba(255,255,255,0.14)';
    g.lineWidth = 3;
    g.strokeRect(5, 5, 118, 118);
    g.strokeStyle = '#69907b';
    g.lineWidth = 6;
    g.strokeRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = maxAniso;
    return tex;
}
const tileTexture = makeTileTexture();

const slabMat = std(0x4a7a6a);
const wallMat = std(0xe8d6b5);
const stoneMat = std(0xb7b3a0);

function buildHouseBlock(r) {
    const w = r.x1 - r.x0;
    const d = r.z1 - r.z0;
    const cx = (r.x0 + r.x1) / 2;
    const cz = (r.z0 + r.z1) / 2;

    addMesh(scene, box(w, 0.45, d), slabMat, cx, -0.225, cz, { receive: true });
    addMesh(scene, box(w - 0.4, 3.6, d - 0.4), wallMat, cx, -2.2, cz, { receive: true });
    addMesh(scene, box(w - 0.3, 0.7, d - 0.3), stoneMat, cx, -3.65, cz, { receive: true });

    const tex = tileTexture.clone();
    tex.repeat.set(w / TILE, d / TILE);
    tex.needsUpdate = true;
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(w, d),
        new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(cx, 0.005, cz);
    floor.receiveShadow = true;
    scene.add(floor);
}
buildHouseBlock(MAIN);
buildHouseBlock(EXT);

// Fills the small gap between the two blocks' walls
addMesh(scene, box(0.8, 3.6, 5.6), wallMat, 4, -2.2, -4, { receive: true });
addMesh(scene, box(0.8, 0.7, 5.7), stoneMat, 4, -3.65, -4, { receive: true });

/* ---- Parapet ---- */
const parapetMat = std(0x41705f);
const capMat = std(0x5b8b79);

function addParapet(x1, z1, x2, z2) {
    const alongX = z1 === z2;
    const len = alongX ? Math.abs(x2 - x1) : Math.abs(z2 - z1);
    const cx = (x1 + x2) / 2;
    const cz = (z1 + z2) / 2;

    if (alongX) {
        addMesh(scene, box(len + 0.5, 0.5, 0.5), parapetMat, cx, 0.25, cz);
        addMesh(scene, box(len + 0.58, 0.08, 0.58), capMat, cx, 0.54, cz);
    } else {
        addMesh(scene, box(0.5, 0.5, len + 0.5), parapetMat, cx, 0.25, cz);
        addMesh(scene, box(0.58, 0.08, len + 0.58), capMat, cx, 0.54, cz);
    }
}

const RING = [
    [-9.75, -6.75], [9.75, -6.75], [9.75, -1.25],
    [3.75, -1.25], [3.75, 6.75], [-9.75, 6.75]
];
for (let i = 0; i < RING.length; i++) {
    const a = RING[i];
    const b = RING[(i + 1) % RING.length];
    addParapet(a[0], a[1], b[0], b[1]);
}

/* ---- Rainwater pipes ---- */
const pipeMat = std(0xaab5b9, { metalness: 0.5, roughness: 0.4 });
const PIPE_Y = 0.69;

function addPipe(x1, y1, z1, x2, y2, z2, radius = 0.11) {
    const a = new THREE.Vector3(x1, y1, z1);
    const b = new THREE.Vector3(x2, y2, z2);
    const dir = new THREE.Vector3().subVectors(b, a);
    const len = dir.length();
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, len, 12), pipeMat);
    pipe.position.copy(a).add(b).multiplyScalar(0.5);
    pipe.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    pipe.castShadow = true;
    scene.add(pipe);
    return pipe;
}

function addJoint(x, y, z, radius = 0.14) {
    addMesh(scene, new THREE.SphereGeometry(radius, 12, 12), pipeMat, x, y, z);
}

for (let i = 0; i < RING.length; i++) {
    const a = RING[i];
    const b = RING[(i + 1) % RING.length];
    addPipe(a[0], PIPE_Y, a[1], b[0], PIPE_Y, b[1]);
    addJoint(a[0], PIPE_Y, a[1]);
}

/* ---- Windows, front door and awning ---- */
const woodMat = std(0xb87a4f);
const glassMat = std(0xa6d6e0, { roughness: 0.25, metalness: 0.1 });

function createWindow(x, y, z, rotY = 0) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.rotation.y = rotY;
    addMesh(g, box(1.5, 1.3, 0.14), woodMat, 0, 0, 0);
    addMesh(g, box(1.2, 1.0, 0.06), glassMat, 0, 0, 0.06, { cast: false });
    addMesh(g, box(0.06, 1.0, 0.08), woodMat, 0, 0, 0.1, { cast: false });
    addMesh(g, box(1.2, 0.06, 0.08), woodMat, 0, 0, 0.1, { cast: false });
    addMesh(g, box(1.7, 0.1, 0.3), stoneMat, 0, -0.7, 0.1);
    scene.add(g);
}
createWindow(-7, -2.0, 6.84);              // front wall
createWindow(1, -2.0, 6.84);
createWindow(7, -2.0, -1.16);              // extension front wall
createWindow(3.84, -2.0, 3, Math.PI / 2);  // wall facing the notch

addMesh(scene, box(1.5, 2.6, 0.16), std(0x8a5a3c), -3, -2.7, 6.86);
addMesh(scene, box(0.5, 0.5, 0.04), std(0xe9efe6), -3, -2.0, 6.95, { cast: false });
addMesh(scene, new THREE.SphereGeometry(0.07, 10, 10),
    std(0xf2c14e, { metalness: 0.6, roughness: 0.3 }), -2.5, -2.8, 6.96);
const awning = addMesh(scene, box(2.8, 0.12, 1.5), slabMat, -3, -1.1, 7.4);
awning.rotation.x = 0.3;

/* =====================================================================
   5. SOLAR PANELS (top-left of the roof)
   ===================================================================== */
function makeCellTexture(top, bottom) {
    const W = 512;
    const H = 342;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const g = c.getContext('2d');

    const grad = g.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, top);
    grad.addColorStop(1, bottom);
    g.fillStyle = grad;
    g.fillRect(0, 0, W, H);

    const cols = 6;
    const rows = 4;
    g.strokeStyle = 'rgba(190,215,240,0.75)';
    g.lineWidth = 3;
    for (let i = 1; i < cols; i++) {
        g.beginPath(); g.moveTo((i * W) / cols, 0); g.lineTo((i * W) / cols, H); g.stroke();
    }
    for (let j = 1; j < rows; j++) {
        g.beginPath(); g.moveTo(0, (j * H) / rows); g.lineTo(W, (j * H) / rows); g.stroke();
    }
    g.strokeStyle = 'rgba(140,175,225,0.45)';
    g.lineWidth = 1.5;
    for (let i = 0; i < cols; i++) {
        const x = ((i + 0.5) * W) / cols;
        g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke();
    }

    const glint = g.createLinearGradient(0, H, W, 0);
    glint.addColorStop(0.35, 'rgba(255,255,255,0)');
    glint.addColorStop(0.5, 'rgba(255,255,255,0.2)');
    glint.addColorStop(0.65, 'rgba(255,255,255,0)');
    g.fillStyle = glint;
    g.fillRect(0, 0, W, H);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = maxAniso;
    return tex;
}
const blueCells = makeCellTexture('#3d5c9f', '#2b4482');
const tealCells = makeCellTexture('#318195', '#226576');

function createSolarPanel(x, z, cellTexture) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);

    const tilt = new THREE.Group();
    tilt.position.y = 0.85;
    tilt.rotation.x = 0.3;
    g.add(tilt);

    addMesh(tilt, box(3.2, 0.12, 2.2), std(0xb9c4c8, { metalness: 0.5, roughness: 0.4 }), 0, 0, 0);

    const surface = new THREE.Mesh(
        new THREE.PlaneGeometry(3.0, 2.0),
        new THREE.MeshStandardMaterial({ map: cellTexture, roughness: 0.25, metalness: 0.2 })
    );
    surface.rotation.x = -Math.PI / 2;
    surface.position.y = 0.065;
    tilt.add(surface);

    const legMat = std(0x8f9ca1, { metalness: 0.6, roughness: 0.4 });
    [-1.2, 1.2].forEach((px) => {
        addMesh(g, box(0.1, 1.08, 0.1), legMat, px, 0.54, -0.96);
        addMesh(g, box(0.1, 0.5, 0.1), legMat, px, 0.25, 0.96);
    });

    scene.add(g);
    return g;
}

createSolarPanel(-7.2, -4.4, blueCells);
createSolarPanel(-3.6, -4.4, blueCells);
createSolarPanel(-7.2, -1.2, tealCells);
createSolarPanel(-3.6, -1.2, tealCells);

const cableMat = std(0x2b3338, { roughness: 0.6 });
function addCable(x1, z1, x2, z2) {
    const alongX = z1 === z2;
    const w = alongX ? Math.abs(x2 - x1) : 0.1;
    const d = alongX ? 0.1 : Math.abs(z2 - z1);
    addMesh(scene, box(w, 0.06, d), cableMat, (x1 + x2) / 2, 0.04, (z1 + z2) / 2, { cast: false });
}
addCable(-5.6, -4.4, -5.2, -4.4);
addCable(-5.6, -1.2, -5.2, -1.2);
addCable(-2.0, -4.4, -1.35, -4.4);
addCable(-2.0, -1.2, -1.35, -1.2);
addCable(-1.35, -4.4, -1.35, -1.2);
addCable(-1.35, -2.8, -1.25, -2.8);

const inverter = new THREE.Group();
inverter.position.set(-0.9, 0, -2.8);
addMesh(inverter, box(0.7, 1.0, 0.5), std(0x5d6870), 0, 0.5, 0);
addMesh(inverter, box(0.4, 0.22, 0.04), std(0x2f5a45), 0, 0.72, 0.26, { cast: false });
addMesh(inverter, new THREE.SphereGeometry(0.04, 8, 8),
    std(0x78e08f, { emissive: 0x78e08f, emissiveIntensity: 0.6 }), 0.2, 0.4, 0.27, { cast: false });
scene.add(inverter);

/* =====================================================================
   6. RAINWATER TANK (extension)
   ===================================================================== */
const TANK_X = 8.0;
const TANK_Z = -4.0;
const TANK_R = 1.05;

const tank = new THREE.Group();
tank.position.set(TANK_X, 0, TANK_Z);

addMesh(tank, new THREE.CylinderGeometry(TANK_R, TANK_R, 2.0, 32),
    std(0x4a86a3, { roughness: 0.45, metalness: 0.1 }), 0, 1.0, 0, { receive: true });

const bandMat = std(0xaab5b9, { metalness: 0.6, roughness: 0.35 });
[0.5, 1.5].forEach((y) =>
    addMesh(tank, new THREE.CylinderGeometry(TANK_R + 0.02, TANK_R + 0.02, 0.08, 32), bandMat, 0, y, 0));

addMesh(tank, new THREE.CylinderGeometry(TANK_R + 0.05, TANK_R + 0.05, 0.1, 32),
    std(0x8fa3ad, { roughness: 0.5 }), 0, 2.05, 0);

addMesh(tank, box(0.16, 1.4, 0.05), std(0xe6f2f6), 0, 1.05, TANK_R + 0.02, { cast: false });
addMesh(tank, box(0.1, 0.8, 0.06), std(0x58a6d2, { emissive: 0x2b6f9a, emissiveIntensity: 0.3 }),
    0, 0.75, TANK_R + 0.03, { cast: false });
scene.add(tank);

const RISER_X = 9.75;
addPipe(RISER_X, PIPE_Y, TANK_Z, RISER_X, 0.95, TANK_Z);
const filter = new THREE.Group();
filter.position.set(RISER_X, 1.3, TANK_Z);
addMesh(filter, new THREE.CylinderGeometry(0.3, 0.3, 0.7, 20), std(0x8fbf9a, { roughness: 0.5 }), 0, 0, 0);
addMesh(filter, new THREE.CylinderGeometry(0.33, 0.33, 0.08, 20), bandMat, 0, 0.2, 0);
addMesh(filter, new THREE.CylinderGeometry(0.33, 0.33, 0.08, 20), bandMat, 0, -0.2, 0);
scene.add(filter);
addPipe(RISER_X, 1.65, TANK_Z, RISER_X, 2.4, TANK_Z);
addPipe(RISER_X, 2.4, TANK_Z, TANK_X + 0.45, 2.4, TANK_Z);
addPipe(TANK_X + 0.45, 2.4, TANK_Z, TANK_X + 0.45, 2.1, TANK_Z);
addJoint(RISER_X, 2.4, TANK_Z);
addJoint(TANK_X + 0.45, 2.4, TANK_Z);
addMesh(scene, box(0.2, 0.26, 0.2), std(0xe0713f), RISER_X - 0.9, 2.4 + 0.2, TANK_Z, { cast: true });

/* =====================================================================
   7. ROOF DECORATION + IoT PLANTS
   ===================================================================== */
function createGateway(x, z) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    const stone = std(0xb9b3a0);
    [-0.75, 0.75].forEach((px) => {
        addMesh(g, box(0.3, 2.4, 0.3), woodMat, px, 1.5, 0);
        addMesh(g, box(0.5, 0.55, 0.5), stone, px, 0.275, 0);
    });
    addMesh(g, box(2.1, 0.4, 0.55), stone, 0, 2.9, 0);
    addMesh(g, box(1.2, 2.2, 0.12), std(0x8a5a3c), 0, 1.2, 0);
    addMesh(g, box(0.45, 0.45, 0.04), std(0xe9efe6), 0, 1.85, 0.07, { cast: false });
    addMesh(g, new THREE.SphereGeometry(0.06, 10, 10),
        std(0xf2c14e, { metalness: 0.6, roughness: 0.3 }), 0.4, 1.1, 0.1);
    scene.add(g);
}
createGateway(1, -5.8);

function createCrate(x, z, size = 1, sprout = false) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    g.rotation.y = rand() * 0.6 - 0.3;
    addMesh(g, box(size, size, size), std(0xc68c58), 0, size / 2, 0);
    const band = std(0x9a6a40);
    addMesh(g, box(size + 0.04, 0.12, size + 0.04), band, 0, 0.1, 0);
    addMesh(g, box(size + 0.04, 0.12, size + 0.04), band, 0, size - 0.1, 0);
    if (sprout) {
        addMesh(g, box(size * 0.6, 0.06, size * 0.6), std(0x4e3424), 0, size + 0.02, 0, { cast: false });
        addMesh(g, new THREE.IcosahedronGeometry(0.2, 0), flat(0x6bbf5a), 0, size + 0.2, 0);
    }
    scene.add(g);
}
createCrate(-8.5, 5.4, 1.1);
createCrate(-7.4, 5.7, 0.9, true);

// IoT: blinking sensor LEDs + hub with Wi-Fi rings (animated in the draw loop)
const iotLeds = [];
const wifiRings = [];

function addSensorProbe(g) {
    addMesh(g, new THREE.CylinderGeometry(0.025, 0.025, 0.5, 6), std(0x2b3338), 0.2, 0.8, 0, { cast: false });
    const led = addMesh(g, new THREE.SphereGeometry(0.05, 8, 8),
        std(0x4dd0ff, { emissive: 0x4dd0ff, emissiveIntensity: 1 }), 0.2, 1.07, 0, { cast: false });
    iotLeds.push(led);
}

// Smiling IoT planters (each one has a soil sensor)
function createPlanter(x, z, kind, style) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    g.rotation.y = Math.PI / 4;

    const colors = { clay: 0xc9744a, sand: 0xd99a6c, teal: 0x4f9a98 };
    const mat = std(colors[style], { roughness: 0.7 });
    if (style === 'teal') addMesh(g, box(0.62, 0.55, 0.62), mat, 0, 0.275, 0);
    else addMesh(g, new THREE.CylinderGeometry(0.34, 0.26, 0.55, 12), mat, 0, 0.275, 0);

    addMesh(g, new THREE.CylinderGeometry(0.27, 0.27, 0.04, 12), std(0x5a3b2a), 0, 0.56, 0, { cast: false });

    const dark = std(0x2b2b33);
    const fz = style === 'teal' ? 0.32 : 0.31;
    addMesh(g, new THREE.SphereGeometry(0.045, 8, 8), dark, -0.1, 0.33, fz, { cast: false });
    addMesh(g, new THREE.SphereGeometry(0.045, 8, 8), dark, 0.1, 0.33, fz, { cast: false });
    addMesh(g, box(0.1, 0.025, 0.02), dark, 0, 0.24, fz, { cast: false });

    const greens = [0x4f9a45, 0x62b055, 0x7cc468];
    if (kind === 'leafy') {
        for (let i = 0; i < 5; i++) {
            const a = (i / 5) * Math.PI * 2;
            const leaf = addMesh(g, new THREE.IcosahedronGeometry(0.22, 0), flat(greens[i % 3]),
                Math.cos(a) * 0.17, 0.78, Math.sin(a) * 0.17);
            leaf.scale.set(1, 0.6, 1);
        }
        addMesh(g, new THREE.IcosahedronGeometry(0.22, 0), flat(0x8fd57a), 0, 0.9, 0);
    } else if (kind === 'flower') {
        addMesh(g, new THREE.IcosahedronGeometry(0.28, 0), flat(0x5aa24b), 0, 0.8, 0);
        [[-0.16, 0.98, 0.05, 0xf4b6c2], [0.14, 1.02, -0.06, 0xf9e9a8],
         [0.05, 0.98, 0.17, 0x8fc3f2], [-0.05, 1.05, -0.15, 0xf59f7a]].forEach(([fx, fy, fz2, col]) =>
            addMesh(g, new THREE.SphereGeometry(0.08, 8, 8), std(col), fx, fy, fz2, { cast: false }));
    } else {
        for (let i = 0; i < 4; i++) {
            const a = (i / 4) * Math.PI * 2 + 0.4;
            const leaf = addMesh(g, new THREE.IcosahedronGeometry(0.17, 0), flat(greens[i % 3]),
                Math.cos(a) * 0.1, 0.8 + (i % 2) * 0.1, Math.sin(a) * 0.1);
            leaf.scale.set(0.7, 1.2, 0.7);
        }
    }
    addSensorProbe(g);
    scene.add(g);
}
const kinds = ['leafy', 'flower', 'sprout'];
const styles = ['clay', 'teal', 'sand'];

// Row A: 7 planters along the right edge of the main roof
for (let i = 0; i < 7; i++) createPlanter(3.0, 0.4 + i * 0.9, kinds[i % 3], styles[(i + 1) % 3]);
// Row B: 4 planters along the front edge
for (let i = 0; i < 4; i++) createPlanter(-3.0 + i * 0.9, 6.1, kinds[(i + 1) % 3], styles[(i + 2) % 3]);

// IoT hub: small box with an antenna and pulsing Wi-Fi rings
function createIotHub(x, z) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    g.rotation.y = Math.PI / 4;
    addMesh(g, box(0.5, 0.8, 0.4), std(0x39434a), 0, 0.4, 0);
    addMesh(g, box(0.34, 0.2, 0.03), std(0x2f5a45, { emissive: 0x2f5a45, emissiveIntensity: 0.5 }), 0, 0.55, 0.21, { cast: false });
    addMesh(g, new THREE.CylinderGeometry(0.025, 0.025, 0.45, 6), std(0x2b3338), 0.15, 1.02, 0);
    const led = addMesh(g, new THREE.SphereGeometry(0.045, 8, 8),
        std(0x78e08f, { emissive: 0x78e08f, emissiveIntensity: 1 }), -0.12, 0.2, 0.21, { cast: false });
    iotLeds.push(led);
    for (let i = 0; i < 2; i++) {
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.3, 0.02, 6, 28),
            new THREE.MeshBasicMaterial({ color: 0x4dd0ff, transparent: true, opacity: 0.8 })
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.set(0.15, 1.3, 0);
        ring.userData.offset = i * 0.5;
        g.add(ring);
        wifiRings.push(ring);
    }
    scene.add(g);
}
createIotHub(3.0, -0.8);

function updateIot(t) {
    iotLeds.forEach((led, i) => {
        led.material.emissiveIntensity = 0.7 + 0.7 * Math.sin(t * 3 + i * 0.9);
    });
    wifiRings.forEach((ring) => {
        const p = (t * 0.6 + ring.userData.offset) % 1;
        ring.scale.setScalar(0.4 + p * 1.2);
        ring.material.opacity = 0.8 * (1 - p);
    });
}

/* =====================================================================
   8. GARDEN: trees, rocks, flowers, lanterns, path
   ===================================================================== */
const blossom = [0xf1b5b5, 0xf6d3c0, 0xefc9a3, 0xf7e4d0, 0xea9fa0];

function createTree(x, z, s = 1) {
    const g = new THREE.Group();
    g.position.set(x, GROUND_Y, z);
    g.scale.setScalar(s);
    g.rotation.y = rand() * Math.PI * 2;

    addMesh(g, new THREE.CylinderGeometry(0.35, 0.6, 3.2, 7), flat(0x7a5238), 0, 1.6, 0);
    [[0.6, 0.15, 0.2], [-0.5, 0.15, 0.35], [0.1, 0.15, -0.65]].forEach(([rx, ry, rz]) => {
        const root = addMesh(g, new THREE.ConeGeometry(0.28, 0.9, 5), flat(0x7a5238), rx, ry, rz);
        root.rotation.z = rx > 0 ? -0.9 : 0.9;
    });

    [[0, 4.3, 0, 1.9], [-1.3, 3.7, 0.4, 1.35], [1.4, 3.8, -0.3, 1.4],
     [0.3, 5.4, 0.5, 1.3], [-0.6, 3.6, -1.3, 1.2], [0.9, 3.5, 1.2, 1.2]].forEach(([bx, by, bz, br], i) =>
        addMesh(g, new THREE.IcosahedronGeometry(br, 1), flat(blossom[i % blossom.length]), bx, by, bz));
    scene.add(g);
}
[[-15.5, -8, 1.3], [-16.5, 5, 1.1], [-12, 13.5, 1.0], [15.5, 9, 1.2],
 [16.5, -7.5, 1.2], [3, -14.5, 1.0], [-6, -14, 0.8]].forEach(([x, z, s]) => createTree(x, z, s));

function createRock(x, z, s = 1) {
    const rock = addMesh(scene, new THREE.DodecahedronGeometry(0.9 * s, 0), flat(0x9db3a2),
        x, GROUND_Y + 0.35 * s, z);
    rock.scale.set(1, 0.7, 0.9);
    rock.rotation.set(rand(), rand() * 3, rand());
}
[[-13.5, 2, 1.2], [13, 4, 1], [5, 11, 0.9], [-5, -11.5, 1.1], [15, -1, 0.8], [-14, -3.5, 0.7]]
    .forEach(([x, z, s]) => createRock(x, z, s));

function createBush(x, z, s = 1) {
    const g = new THREE.Group();
    g.position.set(x, GROUND_Y, z);
    addMesh(g, new THREE.IcosahedronGeometry(0.9 * s, 1), flat(0x5f9a58), 0, 0.6 * s, 0);
    addMesh(g, new THREE.IcosahedronGeometry(0.6 * s, 1), flat(0x74b066), 0.7 * s, 0.4 * s, 0.3 * s);
    scene.add(g);
}
[[-11.5, 8.5, 1], [5.5, 8.5, 0.9], [-11.5, -8.6, 1.1], [11.5, -8.5, 0.9]]
    .forEach(([x, z, s]) => createBush(x, z, s));

function createFlower(x, z) {
    const g = new THREE.Group();
    g.position.set(x, GROUND_Y, z);
    addMesh(g, new THREE.CylinderGeometry(0.02, 0.02, 0.3, 5), std(0x6fa85c), 0, 0.15, 0, { cast: false });
    const petals = [0xffffff, 0xf4b6c2, 0xf9e9a8][Math.floor(rand() * 3)];
    addMesh(g, new THREE.CylinderGeometry(0.17, 0.17, 0.04, 7), std(petals), 0, 0.32, 0, { cast: false });
    addMesh(g, new THREE.SphereGeometry(0.06, 8, 8), std(0xf2c14e), 0, 0.36, 0, { cast: false });
    scene.add(g);
}
for (let i = 0; i < 80; i++) {
    const angle = rand() * Math.PI * 2;
    const dist = 8 + rand() * 12;
    const fx = Math.cos(angle) * dist;
    const fz = Math.sin(angle) * dist;
    const nearHouse = fx > -12 && fx < 12 && fz > -9 && fz < 9;
    const onPath = Math.abs(fx + 3) < 1.4 && fz > 8;
    if (!nearHouse && !onPath) createFlower(fx, fz);
}

function createLantern(x, z) {
    const g = new THREE.Group();
    g.position.set(x, GROUND_Y, z);
    const stone = flat(0x8fb0a0);
    addMesh(g, new THREE.CylinderGeometry(0.3, 0.36, 0.2, 6), stone, 0, 0.1, 0);
    addMesh(g, new THREE.CylinderGeometry(0.12, 0.14, 0.6, 6), stone, 0, 0.5, 0);
    addMesh(g, box(0.5, 0.4, 0.5), std(0xfff0c8, { emissive: 0xffd98a, emissiveIntensity: 0.5 }), 0, 0.98, 0);
    const cap = addMesh(g, new THREE.ConeGeometry(0.46, 0.32, 4), stone, 0, 1.34, 0);
    cap.rotation.y = Math.PI / 4;
    addMesh(g, new THREE.SphereGeometry(0.07, 8, 8), stone, 0, 1.55, 0);
    scene.add(g);
}
createLantern(-5.2, 8.5);
createLantern(-0.8, 8.5);

for (let i = 0; i < 5; i++) {
    addMesh(scene, new THREE.CylinderGeometry(0.7, 0.75, 0.1, 7), flat(0xc9c2b5),
        -3 + (rand() - 0.5) * 0.4, GROUND_Y + 0.05, 8.4 + i * 1.5, { cast: false, receive: true });
}

/* =====================================================================
   9. THE CHARACTER (placeholder - swap in the Blender model later)
   ===================================================================== */
const character = new THREE.Group();
const model = new THREE.Group();   // the part that bobs while walking

addMesh(model, new THREE.CapsuleGeometry(0.28, 0.45, 6, 12), std(0x3f8f6b, { roughness: 0.7 }), 0, 0.5, 0);
addMesh(model, new THREE.SphereGeometry(0.24, 16, 16), std(0xf2c9a0, { roughness: 0.8 }), 0, 1.12, 0);
addMesh(model, box(0.1, 0.1, 0.14), std(0xe07a5f), 0, 1.1, 0.26);

character.add(model);
character.position.set(-1.0, 0, 3.5);
scene.add(character);

/* =====================================================================
   10. WHERE THE CHARACTER CAN WALK
   ===================================================================== */
const CHAR_RADIUS = 0.35;

const walkable = [
    { minX: -9.15, maxX: 3.15, minZ: -6.15, maxZ: 6.15 },   // main roof
    { minX: 2.0, maxX: 9.15, minZ: -6.15, maxZ: -1.85 }     // extension
];

const blockers = [
    { minX: -8.9, maxX: -1.9, minZ: -5.6, maxZ: -0.05 },                         // solar panels
    { minX: -1.25, maxX: -0.55, minZ: -3.15, maxZ: -2.45 },                      // inverter
    { minX: 0.05, maxX: 1.95, minZ: -6.15, maxZ: -5.45 },                        // gateway
    { minX: -9.05, maxX: -7.95, minZ: 4.85, maxZ: 5.95 },                        // crate
    { minX: -7.85, maxX: -6.95, minZ: 5.25, maxZ: 6.15 },                        // crate
    { minX: 2.6, maxX: 3.4, minZ: -1.1, maxZ: 6.25 },                            // IoT row A + hub
    { minX: -3.4, maxX: 0.1, minZ: 5.7, maxZ: 6.5 },                             // IoT row B
    { minX: TANK_X - TANK_R, maxX: TANK_X + TANK_R, minZ: TANK_Z - TANK_R, maxZ: TANK_Z + TANK_R }
];

function inside(x, z, r) {
    return x >= r.minX && x <= r.maxX && z >= r.minZ && z <= r.maxZ;
}

function canStand(x, z) {
    if (!walkable.some((r) => inside(x, z, r))) return false;
    return !blockers.some((b) =>
        inside(x, z, {
            minX: b.minX - CHAR_RADIUS,
            maxX: b.maxX + CHAR_RADIUS,
            minZ: b.minZ - CHAR_RADIUS,
            maxZ: b.maxZ + CHAR_RADIUS
        })
    );
}

/* =====================================================================
   11. KEYBOARD, MOVEMENT
   ===================================================================== */
const keys = new Set();
const lessons = createLessons({ onOpen: () => keys.clear() });

window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (lessons.isOpen()) return;

    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
        event.preventDefault();
    }
    keys.add(key);
    if (key === 'e') interact();
});

window.addEventListener('keyup', (event) => keys.delete(event.key.toLowerCase()));
window.addEventListener('blur', () => keys.clear());

const SPEED = 4.5;
const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const move = new THREE.Vector3();
let walkTime = 0;

function updateCharacter(dt) {
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    right.set(-forward.z, 0, forward.x);

    move.set(0, 0, 0);
    if (keys.has('w') || keys.has('arrowup')) move.add(forward);
    if (keys.has('s') || keys.has('arrowdown')) move.sub(forward);
    if (keys.has('d') || keys.has('arrowright')) move.add(right);
    if (keys.has('a') || keys.has('arrowleft')) move.sub(right);

    if (move.lengthSq() === 0) {
        model.position.y = 0;
        return;
    }

    move.normalize().multiplyScalar(SPEED * dt);

    const nextX = character.position.x + move.x;
    if (canStand(nextX, character.position.z)) character.position.x = nextX;

    const nextZ = character.position.z + move.z;
    if (canStand(character.position.x, nextZ)) character.position.z = nextZ;

    const targetAngle = Math.atan2(move.x, move.z);
    let diff = targetAngle - character.rotation.y;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    character.rotation.y += diff * Math.min(1, dt * 12);

    walkTime += dt * 10;
    model.position.y = Math.abs(Math.sin(walkTime)) * 0.06;
}

/* =====================================================================
   12. STATIONS, MARKERS AND THE "PRESS E" PROMPT
   ===================================================================== */
const promptBox = document.getElementById('prompt');

const stations = [
    { id: 'solar', name: 'the solar panels', x: -5.4, z: -2.8, radius: 6.0 },
    { id: 'rain', name: 'the rainwater tank', x: TANK_X, z: TANK_Z, radius: 4.0 },
    { id: 'plants', name: 'the IoT smart plants', x: 1.2, z: 3.6, radius: 4.6 }
];

const markers = [];
function addMarker(x, y, z) {
    const holder = new THREE.Group();
    holder.position.set(x, y, z);
    holder.userData.baseY = y;
    const cone = addMesh(holder, new THREE.ConeGeometry(0.35, 0.8, 4),
        std(0xffc94d, { emissive: 0xffb300, emissiveIntensity: 0.35 }), 0, 0, 0);
    cone.rotation.x = Math.PI;
    scene.add(holder);
    markers.push(holder);
}
addMarker(-5.4, 3.2, -2.8);
addMarker(TANK_X, 4.2, TANK_Z);
addMarker(3.0, 3.0, 3.2);

function updateMarkers(t) {
    markers.forEach((m, i) => {
        m.position.y = m.userData.baseY + Math.sin(t * 2.2 + i) * 0.18;
        m.rotation.y = t * 1.5;
    });
}

let nearStation = null;

function updatePrompt() {
    nearStation = null;

    if (!lessons.isOpen()) {
        let best = Infinity;
        stations.forEach((s) => {
            const dist = Math.hypot(character.position.x - s.x, character.position.z - s.z);
            if (dist < s.radius && dist < best) {
                best = dist;
                nearStation = s;
            }
        });
    }

    if (nearStation) {
        promptBox.textContent = `Press E to explore ${nearStation.name}`;
        promptBox.classList.remove('hidden');
    } else {
        promptBox.classList.add('hidden');
    }
}

function interact() {
    if (nearStation && !lessons.isOpen()) lessons.open(nearStation.id);
}

/* =====================================================================
   13. DRAW LOOP
   ===================================================================== */
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const dt = Math.min(clock.getDelta(), 0.05);
    if (!lessons.isOpen()) updateCharacter(dt);
    updatePrompt();
    updateMarkers(clock.elapsedTime);
    updateIot(clock.elapsedTime);

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    fitCamera();
    renderer.setSize(window.innerWidth, window.innerHeight);
});