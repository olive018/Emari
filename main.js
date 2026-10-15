
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// 1. Create the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc8e6f5);

// 2. Set up the camera
const camera = new THREE.PerspectiveCamera(
    38,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);


camera.position.set(21.6, 18, 27);
camera.lookAt(0, -2.2, 0);


// 3. Create the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
document.body.appendChild(renderer.domElement);

// 4. Add lighting
const sunlight = new THREE.DirectionalLight(0xffffff, 3);
sunlight.position.set(9, 18, 12.6);
sunlight.castShadow = true;
sunlight.shadow.mapSize.set(2048, 2048);
sunlight.shadow.camera.left = -16;
sunlight.shadow.camera.right = 16;
sunlight.shadow.camera.top = 16;
sunlight.shadow.camera.bottom = -16;
sunlight.shadow.bias = -0.0005;
scene.add(sunlight);

scene.add(new THREE.AmbientLight(0xffffff, 1.5));

// 5. Create the ground
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.MeshStandardMaterial({ color: 0xa8c995 })
);

ground.rotation.x = -Math.PI / 2;
ground.position.y = -6.48;
ground.receiveShadow = true;
scene.add(ground);

// 6. Create a simple rooftop

const roofMaterial = new THREE.MeshStandardMaterial({
    color: 0xd8c2a0,
    roughness: 0.9
});

// Main section of the L-shaped roof
const roofMain = new THREE.Mesh(
    new THREE.BoxGeometry(5.5, 0.5, 6),
    roofMaterial
);
roofMain.position.set(-1.25, 0, 0);
roofMain.castShadow = true;
roofMain.receiveShadow = true;
scene.add(roofMain);

// Side extension of the L-shaped roof
const roofExtension = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.5, 3),
    roofMaterial
);
roofExtension.position.set(2.75, 0, -1.5);
roofExtension.castShadow = true;
roofExtension.receiveShadow = true;
scene.add(roofExtension);


const pipeMaterial = new THREE.MeshStandardMaterial({
    color: 0x555b60,
    roughness: 0.65,
    metalness: 0.25
});

// Helper to create a horizontal pipe

function addHorizontalPipe(x1, z1, x2, z2) {
    const start = new THREE.Vector3(x1, 0.39, z1);
    const end = new THREE.Vector3(x2, 0.39, z2);

    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();

    const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.07, length, 12),
        pipeMaterial
    );

    pipe.position.copy(start).add(end).multiplyScalar(0.5);
    pipe.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.normalize()
    );

    pipe.castShadow = true;
    scene.add(pipe);
}


// Pipes along the outer edges of the L-shaped roof


/* HORIZONTAL RAINWATER PIPES */

// Front edge of the main roof
addHorizontalPipe(-4, 3, 1.5, 3);

// Left outer edge of the main roof
addHorizontalPipe(-4, -3, -4, 3);

// Back edge of the main roof
addHorizontalPipe(-4, -3, 1.5, -3);

// Inner edge of the L-shaped roof
addHorizontalPipe(1.5, 3, 1.5, 0);

// Front edge of the extension
addHorizontalPipe(1.5, 0, 4, 0);

// Outer right edge of the extension
addHorizontalPipe(4, -3, 4, 0);

// Back edge of the extension
addHorizontalPipe(1.5, -3, 4, -3);


/* Vertical rainwater downpipe on the side of the house
const downpipe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 2.8, 12),
    pipeMaterial
);
downpipe.position.set(4.05, -1, -1.5);
downpipe.castShadow = true;
scene.add(downpipe);
*/

/* BUILDING WALLS */


const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xe7c9a5,
    roughness: 0.9
});

// Main section of the L-shaped building
const buildingMain = new THREE.Mesh(
    new THREE.BoxGeometry(5.5, 3.2, 5.7),
    wallMaterial
);
buildingMain.position.set(-1.25, -1.85, 0);
buildingMain.castShadow = true;
buildingMain.receiveShadow = true;
scene.add(buildingMain);

// Side section that creates the L shape
const buildingExtension = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 3.2, 2.7),
    wallMaterial
);
buildingExtension.position.set(2.75, -1.85, -1.5);
buildingExtension.castShadow = true;
buildingExtension.receiveShadow = true;
scene.add(buildingExtension);



const windowFrameMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5f0e6,
    roughness: 0.7
});

const windowGlassMaterial = new THREE.MeshStandardMaterial({
    color: 0x82c9e8,
    roughness: 0.25,
    metalness: 0.1
});

// Create one window on the front wall
function createWindow(x, y, z) {
    // Outer window frame
    const frame = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.1, 0.12),
        windowFrameMaterial
    );
    frame.position.set(x, y, z);
    scene.add(frame);

    // Blue glass, placed slightly in front of the frame
    const glass = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 0.9, 0.04),
        windowGlassMaterial
    );
    glass.position.set(x, y, z + 0.08);
    scene.add(glass);

    // Vertical divider
    const divider = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.9, 0.05),
        windowFrameMaterial
    );
    divider.position.set(x, y, z + 0.11);
    scene.add(divider);
}

// Add two windows to the front wall
createWindow(-2, -1.5, 2.87);
//createWindow(2, -1.5, 2.87);

const doorMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b5a3c,
    roughness: 0.8
});

const door = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 2.0, 0.15),
    doorMaterial
);

// Position the door on the front wall
door.position.set(0, -2.45, 2.9);
scene.add(door);

function createSideWindow(x, y, z) {
    // Outer frame
    const frame = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 1.1, 1.2),
        windowFrameMaterial
    );
    frame.position.set(x, y, z);
    scene.add(frame);

    // Blue glass
    const glass = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.9, 1.0),
        windowGlassMaterial
    );
    glass.position.set(x + 0.08, y, z);
    scene.add(glass);

    // Divider
    const divider = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.9, 0.05),
        windowFrameMaterial
    );
    divider.position.set(x + 0.11, y, z);
    scene.add(divider);
}

// Windows on the right-hand side wall



// Door handle
const handleMaterial = new THREE.MeshStandardMaterial({
    color: 0xf2c14e,
    metalness: 0.6,
    roughness: 0.3
});

const handle = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 12, 12),
    handleMaterial
);

handle.position.set(0.35, -2.4, 3.0);
scene.add(handle);


const pathMaterial = new THREE.MeshStandardMaterial({
    color: 0xc9c2b5,
    roughness: 1
});

// Main pathway leading away from the front door
const pathway = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.12, 4),
    pathMaterial
);

pathway.position.set(0, -3.48, 5.0);
scene.add(pathway);


const chimneyMaterial = new THREE.MeshStandardMaterial({
    color: 0xb96f52,
    roughness: 0.9
});

const chimney = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 1.4, 0.7),
    chimneyMaterial
);

// Place the chimney toward the back of the roof
chimney.position.set(-3, 0.9, -1.8);
chimney.castShadow = true;
chimney.receiveShadow = true;
scene.add(chimney);






/* ROOFTOP EDGE TRIM */


/* ROOFTOP EDGE TRIM - L SHAPE */

const trimMaterial = new THREE.MeshStandardMaterial({
    color: 0xb89570,
    roughness: 0.8
});

function addRoofTrim(width, depth, x, z) {
    const trim = new THREE.Mesh(
        new THREE.BoxGeometry(width, 0.12, depth),
        trimMaterial
    );

    trim.position.set(x, 0.31, z);
    trim.castShadow = true;
    scene.add(trim);
}

// Outer edges of the main roof
addRoofTrim(5.6, 0.12, -1.25, 3);
addRoofTrim(5.6, 0.12, -1.25, -3);
addRoofTrim(0.12, 6, -4, 0);

// Outer edges of the roof extension
addRoofTrim(2.6, 0.12, 2.75, 0);
addRoofTrim(2.6, 0.12, 2.75, -3);
addRoofTrim(0.12, 3, 4, -1.5);




/* 7. Create the solar panel base */
const panelGroup = new THREE.Group();
panelGroup.name = 'solarPanel';

const panelBase = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.12, 2.2),
    new THREE.MeshStandardMaterial({ color: 0x303942 })
);
panelBase.castShadow = true;
panelGroup.add(panelBase);

/* 8. Add the blue photovoltaic surface */
const panelSurface = new THREE.Mesh(
    new THREE.BoxGeometry(3.05, 0.025, 2.05),
    new THREE.MeshStandardMaterial({
        color: 0x164b83,
        metalness: 0.25,
        roughness: 0.3
    })
);

panelSurface.position.y = 0.07;
panelGroup.add(panelSurface);

/* 9. Add thin lines to represent solar cells */
const gridMaterial = new THREE.MeshStandardMaterial({
    color: 0x9bc9e8,
    roughness: 0.4
});

// Lines running along the length of the panel
for (let i = 1; i < 6; i++) {
    const line = new THREE.Mesh(
        new THREE.BoxGeometry(0.018, 0.012, 2.02),
        gridMaterial
    );

    line.position.set(-1.525 + i * (3.05 / 6), 0.09, 0);
    panelGroup.add(line);
}

// Lines running across the panel
for (let i = 1; i < 4; i++) {
    const line = new THREE.Mesh(
        new THREE.BoxGeometry(3.02, 0.012, 0.018),
        gridMaterial
    );

    line.position.set(0, 0.09, -1.025 + i * (2.05 / 4));
    panelGroup.add(line);
}

/* 10. Position the complete panel */

panelGroup.position.set(-1.2, 0.55, 0);
panelGroup.rotation.x = 0.35;
scene.add(panelGroup);


/* 11. Add the solar panel mounting supports */

const supportMaterial = new THREE.MeshStandardMaterial({
    color: 0x737d87,
    metalness: 0.7,
    roughness: 0.35
});

// Approximate support locations in the panel's local coordinates
const supportPositions = [
    [-1.25, -0.25, -0.85],
    [ 1.25, -0.25, -0.85],
    [-1.25, -0.25,  0.85],
    [ 1.25, -0.25,  0.85]
];

supportPositions.forEach(([x, y, z]) => {
    const support = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.6, 0.09),
        supportMaterial
    );

    // Convert the support position from panel space to world space
    support.position.set(x, y, z);
    support.position.applyEuler(panelGroup.rotation);
    support.position.add(panelGroup.position);

    support.castShadow = true;
    scene.add(support);
});



/* ---------- 8. Enlarge the house ---------- */
const ROOF_SCALE = 1.8;
const ROOF_Y = 0.25 * ROOF_SCALE;   // height of the roof surface

// Put every house part into one group, then scale the group
const house = new THREE.Group();
[...scene.children].forEach((obj) => {
    if ((obj.isMesh || obj.isGroup) && obj !== ground) house.add(obj);
});
house.scale.setScalar(ROOF_SCALE);
scene.add(house);

/* ---------- 9. Placeholder character ---------- */
const character = new THREE.Group();
const model = new THREE.Group();   // the part that bobs while walking

const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.28, 0.45, 6, 12),
    new THREE.MeshStandardMaterial({ color: 0x3f8f6b, roughness: 0.7 })
);
body.position.y = 0.5;
body.castShadow = true;

const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xf2c9a0, roughness: 0.8 })
);
head.position.y = 1.12;
head.castShadow = true;

// A small nose so we can see which way the character faces
const nose = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.1, 0.14),
    new THREE.MeshStandardMaterial({ color: 0xe07a5f })
);
nose.position.set(0, 1.1, 0.26);

model.add(body, head, nose);
character.add(model);
character.position.set(-2, ROOF_Y, 3.5);
scene.add(character);

/* ---------- 10. Where the character can walk ---------- */
const CHAR_RADIUS = 0.35;

// Two rectangles that make up the L-shaped roof (already pulled in from the edges)
const walkable = [
    { minX: -6.65, maxX: 2.15, minZ: -4.85, maxZ: 4.85 },  // main roof
    { minX: 1.2,   maxX: 6.65, minZ: -4.85, maxZ: -0.55 }  // extension
];

// Things the character cannot walk through
const blockers = [
    { minX: -5.04, maxX: 0.72,  minZ: -1.9,  maxZ: 1.9 },   // solar panel
    { minX: -6.03, maxX: -4.77, minZ: -3.87, maxZ: -2.61 }  // chimney
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

/* ---------- Rainwater tank ---------- */
const TANK_X = 5.2;
const TANK_Z = -2.7;   // lines up with your downpipe

const tank = new THREE.Group();

const tankBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.8, 1.4, 32),
    new THREE.MeshStandardMaterial({ color: 0x4a86a3, roughness: 0.45, metalness: 0.1 })
);
tankBody.position.y = 0.7;
tankBody.castShadow = true;
tankBody.receiveShadow = true;
tank.add(tankBody);

const bandMaterial = new THREE.MeshStandardMaterial({ color: 0xaab5b9, metalness: 0.6, roughness: 0.35 });
[0.35, 1.05].forEach((y) => {
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 0.07, 32), bandMaterial);
    band.position.y = y;
    band.castShadow = true;
    tank.add(band);
});

const lid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.85, 0.08, 32),
    new THREE.MeshStandardMaterial({ color: 0x8fa3ad, roughness: 0.5 })
);
lid.position.y = 1.44;
lid.castShadow = true;
tank.add(lid);

// Inlet pipe on top of the tank
const inlet = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5, 12), pipeMaterial);
inlet.position.set(0.35, 1.75, 0);
inlet.castShadow = true;
tank.add(inlet);

tank.position.set(TANK_X, ROOF_Y, TANK_Z);
scene.add(tank);

// Feed pipe from the tank to the rooftop pipe network
const feedPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.126, 0.126, 1.2, 12), pipeMaterial);
feedPipe.rotation.z = Math.PI / 2;
feedPipe.position.set(6.6, 0.7, TANK_Z);
feedPipe.castShadow = true;
scene.add(feedPipe);

// Orange valve on the feed pipe
const valve = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.24, 0.16),
    new THREE.MeshStandardMaterial({ color: 0xe0713f, roughness: 0.5 })
);
valve.position.set(6.3, 0.95, TANK_Z);
scene.add(valve);

// The character can't walk through the tank or the feed pipe
blockers.push(
    { minX: TANK_X - 0.8, maxX: TANK_X + 0.8, minZ: TANK_Z - 0.8, maxZ: TANK_Z + 0.8 },
    { minX: 6.0, maxX: 7.2, minZ: TANK_Z - 0.15, maxZ: TANK_Z + 0.15 }
);


/* ---------- 11. Keyboard input ---------- */
const keys = new Set();

window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        event.preventDefault();
    }
    keys.add(key);

    if (key === 'e') interact();
    if (key === 'escape') closeCards();
});

window.addEventListener('keyup', (event) => keys.delete(event.key.toLowerCase()));
window.addEventListener('blur', () => keys.clear());

/* ---------- 12. Moving the character ---------- */
const SPEED = 4;
const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const move = new THREE.Vector3();
let walkTime = 0;

function updateCharacter(dt) {
    // "Up" on the keyboard means "away from the camera"
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

    // Try each direction separately so the character slides along walls
    const nextX = character.position.x + move.x;
    if (canStand(nextX, character.position.z)) character.position.x = nextX;

    const nextZ = character.position.z + move.z;
    if (canStand(character.position.x, nextZ)) character.position.z = nextZ;

    // Turn smoothly to face the walking direction
    const targetAngle = Math.atan2(move.x, move.z);
    let diff = targetAngle - character.rotation.y;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    character.rotation.y += diff * Math.min(1, dt * 12);

    // Simple walking bounce
    walkTime += dt * 10;
    model.position.y = Math.abs(Math.sin(walkTime)) * 0.06;
}

/* ---------- 13. Stations, prompt and info cards ---------- */
const solarCard = document.getElementById('solar-card');
const rainCard = document.getElementById('rain-card');
const promptBox = document.getElementById('prompt');

let cardOpen = false;

function openCard(card) {
    card.classList.remove('hidden');
    cardOpen = true;
    keys.clear();
    promptBox.classList.add('hidden');
}

function closeCards() {
    solarCard.classList.add('hidden');
    rainCard.classList.add('hidden');
    cardOpen = false;
}

document.querySelectorAll('.close-card').forEach((button) => {
    button.addEventListener('click', closeCards);
});

const stations = [
    { name: 'the solar panels', x: -2.16, z: 0, radius: 4.5, open: () => openCard(solarCard) },
    { name: 'the rainwater tank', x: TANK_X, z: TANK_Z, radius: 3.2, open: () => openCard(rainCard) }
];

let nearStation = null;

function updatePrompt() {
    nearStation = null;

    if (!cardOpen) {
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
    if (nearStation && !cardOpen) nearStation.open();
}


/* ---------- 14. Draw the scene ---------- */
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const dt = Math.min(clock.getDelta(), 0.05);
    if (!cardOpen) updateCharacter(dt);
    updatePrompt();

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});