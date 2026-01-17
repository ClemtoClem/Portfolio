import * as THREE from 'https://esm.sh/three@0.160.0';
import { createTown } from './game-town-fps/town.js';
import { FirstPersonController } from './game-town-fps/controls.js';

const VERSION = 'beta';
export const gameTownFPSApp = {
    id: 'game-town-fps',
    title: 'Town FPS',
	version: VERSION,
    icon: `<svg viewBox="0 0 32 32"><g id="bgCarrier" stroke-width="0"></g><g id="tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="iconCarrier"> <title>crosshair</title> <path d="M30 14.75h-2.824c-0.608-5.219-4.707-9.318-9.874-9.921l-0.053-0.005v-2.824c0-0.69-0.56-1.25-1.25-1.25s-1.25 0.56-1.25 1.25v0 2.824c-5.219 0.608-9.318 4.707-9.921 9.874l-0.005 0.053h-2.824c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h2.824c0.608 5.219 4.707 9.318 9.874 9.921l0.053 0.005v2.824c0 0.69 0.56 1.25 1.25 1.25s1.25-0.56 1.25-1.25v0-2.824c5.219-0.608 9.318-4.707 9.921-9.874l0.005-0.053h2.824c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0zM17.25 24.624v-2.624c0-0.69-0.56-1.25-1.25-1.25s-1.25 0.56-1.25 1.25v0 2.624c-3.821-0.57-6.803-3.553-7.368-7.326l-0.006-0.048h2.624c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0h-2.624c0.57-3.821 3.553-6.804 7.326-7.368l0.048-0.006v2.624c0 0.69 0.56 1.25 1.25 1.25s1.25-0.56 1.25-1.25v0-2.624c3.821 0.57 6.803 3.553 7.368 7.326l0.006 0.048h-2.624c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h2.624c-0.571 3.821-3.553 6.803-7.326 7.368l-0.048 0.006z"></path> </g></svg>`,
    iconColor: '#7ed0ec',
    headerColor: '#7ed0ec',
    type: 'game',
    style: ``,
    content: {
        'en-US':`
            <div class="game-container">
                <link rel="stylesheet" href="./applications/game-town-fps/styles.css" />
                <script type="importmap">
                {
                    "imports": {
                        "three": "https://esm.sh/three@0.160.0",
                        "nipplejs": "https://esm.sh/nipplejs@0.9.1"
                    }
                }
                </script>

                <div id="game-main-menu" class="game-menu-screen">
                    <h1 class="game-title">📚 TOWN FPS</h1>
                    <div class="game-menu-buttons">
                        <button class="game-btn" id="btn-new-game">NEW PART</button>
                        <button class="game-btn" id="btn-open-saves">LOAD PART</button>
                        <button class="game-btn" id="btn-open-settings">SETTINGS</button>
                    </div>
                    <div class="game-version">V ${VERSION}</div>
                </div>

                <div id="game-new-part-menu" class="game-menu-screen" style="display:none;">
                    <h2>Part name</h2>
                    <input type="text" id="input-save-name" class="game-input" placeholder="My town">
                    <button class="game-btn" id="btn-start-new">Start</button>
                    <button id="game-back-menu-btn" class="game-btn" style="min-width:150px; font-size:1rem;">Return</button>
                </div>

                <div id="game-saves-menu" class="game-menu-screen" style="display:none;">
                    <h2>Saved parts</h2>
                    <div id="save-list-container" class="save-list"></div>
                    <button id="game-back-menu-btn" class="game-btn" style="min-width:150px; font-size:1rem;">Return</button>
                </div>

                <div id="game-settings-menu" class="game-menu-screen" style="display:none;">
                    <h2>Configurations</h2>
                    <div class="game-input-group">
                        <label>Pseudonym</label>
                        <input type="text" id="setting-nickname" class="game-input" value="Player">
                    </div>
                    <div class="game-input-group">
                        <label>Character color</label>
                        <input type="color" id="setting-color" class="game-input" value="#8BC34A">
                    </div>
                    <button id="game-back-menu-btn" class="game-btn" style="min-width:150px; font-size:1rem;">Return</button>
                </div>

                <div class="game-content" style="display:none;">
                    <canvas id="gl-canvas"></canvas>
                    <div id="joystick-container"></div>
                    <div id="look-joystick-container"></div>
                    <div id="crosshair"></div>
                </div>
            </div>
        `,
        'fr-FR':`
            <link rel="stylesheet" href="./applications/game-town-fps/styles.css" />
            <script type="importmap">
            {
                "imports": {
                    "three": "https://esm.sh/three@0.160.0",
                    "nipplejs": "https://esm.sh/nipplejs@0.9.1"
                }
            }
            </script>
            <div class="game-container">
                <div id="game-main-menu" class="game-menu-screen">
                    <h1 class="game-title">📚 TOWN FPS</h1>
                    <div class="game-menu-buttons">
                        <button class="game-btn" id="btn-new-game">NOUVELLE PARTIE</button>
                        <button class="game-btn" id="btn-open-saves">CHARGER UNE PARTIE</button>
                        <button class="game-btn" id="btn-open-settings">CONFIGURATIONS</button>
                    </div>
                    <div class="game-version">V ${VERSION}</div>
                </div>

                <div id="game-new-part-menu" class="game-menu-screen" style="display:none;">
                    <h2>Nom de la partie</h2>
                    <input type="text" id="input-save-name" class="game-input" placeholder="Ma Super Ville...">
                    <button class="game-btn" id="btn-start-new">Commencer</button>
                    <button id="game-back-menu-btn" class="game-btn" style="min-width:150px; font-size:1rem;">Retour</button>
                </div>

                <div id="game-saves-menu" class="game-menu-screen" style="display:none;">
                    <h2>Parties sauvegardées</h2>
                    <div id="save-list-container" class="save-list"></div>
                    <button id="game-back-menu-btn" class="game-btn" style="min-width:150px; font-size:1rem;">Retour</button>
                </div>

                <div id="game-settings-menu" class="game-menu-screen" style="display:none;">
                    <h2>Configurations</h2>
                    <div class="game-input-group">
                        <label>Pseudonyme</label>
                        <input type="text" id="setting-nickname" class="game-input" value="Player">
                    </div>
                    <div class="game-input-group">
                        <label>Couleur du personnage</label>
                        <input type="color" id="setting-color" class="game-input" value="#8BC34A">
                    </div>
                    <button id="game-back-menu-btn" class="game-btn" style="min-width:150px; font-size:1rem;">Retour</button>
                </div>

                <div class="game-content" style="display:none;">
                    <canvas id="gl-canvas"></canvas>
                    <div id="joystick-container"></div>
                    <div id="look-joystick-container"></div>
                    <div id="crosshair"></div>
                </div>
            </div>
        `
    },
	/**
	 * Init function
	 * @param {System} sys - System class instance
	 * @param {String} windowId - Window html ID in which the application will be drawn
	 */
	init: function (sys, windowId) {
        /** @type {System} */
		const system = sys;
        /** @type {JQuery<HTMLElement>} */
        const $window = $(`#${windowId}`);
        
        /** @type {HTMLCanvasElement} */
        const canvas = $window.find('#gl-canvas')[0];
        /** @type {JQuery<HTMLElement>} */
        const joystickContainer = $window.find('#joystick-container')[0];
        /** @type {JQuery<HTMLElement>} */
        const lookJoystickContainer = $window.find('#look-joystick-container')[0];
        /** @type {JQuery<HTMLElement>} */
        const crosshair = $window.find('#crosshair')[0];

        // --- Gestion du Stockage ---
        const STORAGE_KEYS = {
            CONFIG: this.id+'-config',
            SAVES: this.id+'-saves'
        };

        function getConfig() {
            const defaults = { nickname: "Player", color: "#8BC34A" };
            const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
            return stored ? JSON.parse(stored) : defaults;
        }

        function getSaves() {
            const stored = localStorage.getItem(STORAGE_KEYS.SAVES);
            return stored ? JSON.parse(stored) : [];
        }

        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87ceeb); // soft blue sky

        const camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.1,
            500
        );

        // Lights
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x404040, 0.9);
        scene.add(hemiLight);

        const sunLight = new THREE.DirectionalLight(0xfff3cd, 0.9);
        sunLight.position.set(30, 40, 10);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.set(1024, 1024);
        sunLight.shadow.camera.near = 1;
        sunLight.shadow.camera.far = 150;
        scene.add(sunLight);

        // Ground & town layout
        const { ground, buildings, streetWalls } = createTown(scene);

        // Slightly denser mist so the town fades out more
        scene.fog = new THREE.FogExp2(0x87ceeb, 0.006);

        // Controller
        const controller = new FirstPersonController(
            camera,
            renderer.domElement,
            ground,
            // treat only buildings as solid for collision; invisible street walls no longer block movement
            [...buildings]
        );

        // Add the player root to the scene and set a higher starting position
        const playerRoot = controller.getObject();
        scene.add(playerRoot);
        playerRoot.position.set(0, 3, 12);

        // ---------- Simple player body (local + remote) ----------
        function createPlayerBody(parent, color = 0x3498db) {
            const bodyGroup = new THREE.Group();

            // Torso
            const torsoGeo = new THREE.BoxGeometry(0.7, 1.0, 0.35);
            const torsoMat = new THREE.MeshStandardMaterial({ color, roughness: 0.6 });
            const torso = new THREE.Mesh(torsoGeo, torsoMat);
            torso.position.set(0, 1.2, 0);
            torso.castShadow = true;
            torso.receiveShadow = true;
            bodyGroup.add(torso);

            // Left leg
            const legGeo = new THREE.BoxGeometry(0.25, 0.9, 0.3);
            const legMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.7 });
            const leftLeg = new THREE.Mesh(legGeo, legMat);
            leftLeg.position.set(-0.18, 0.45, 0);
            leftLeg.castShadow = true;
            leftLeg.receiveShadow = true;
            bodyGroup.add(leftLeg);

            // Right leg
            const rightLeg = leftLeg.clone();
            rightLeg.position.x = 0.18;
            bodyGroup.add(rightLeg);

            // Left arm
            const armGeo = new THREE.BoxGeometry(0.2, 0.8, 0.25);
            const armMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.7 });
            const leftArm = new THREE.Mesh(armGeo, armMat);
            leftArm.position.set(-0.55, 1.4, 0);
            leftArm.castShadow = true;
            leftArm.receiveShadow = true;
            bodyGroup.add(leftArm);

            // Right arm
            const rightArm = leftArm.clone();
            rightArm.position.x = 0.55;
            bodyGroup.add(rightArm);

            // We intentionally do NOT add a head so nothing blocks the first-person camera

            // Position body so the top of the torso is just below the camera
            bodyGroup.position.set(0, -1.8, 0);

            if (parent) {
                parent.add(bodyGroup);
            } else {
                scene.add(bodyGroup);
            }

            return bodyGroup;
        }

        // Create local player's visible body attached to their root
        const localBody = createPlayerBody(playerRoot, 0x2ecc71);

        // ---------- Multiplayer: simple shared room via WebSocket ----------
        const localPlayerId =
            (crypto && crypto.randomUUID && crypto.randomUUID()) ||
            Math.random().toString(36).slice(2);

        const remotePlayers = new Map();

        // Single global room ID so all players share the same session
        const ROOM_ID = "town-fps-global-room-1";

        // Create a remote player body for a given id if it doesn't exist yet
        function ensureRemotePlayer(id) {
            if (id === localPlayerId) return null;
            if (remotePlayers.has(id)) return remotePlayers.get(id);

            const color = 0x3498db;
            const group = createPlayerBody(null, color);
            group.position.set(0, 3, 12);
            remotePlayers.set(id, { group });
            return remotePlayers.get(id);
        }

        // Replace with relay endpoint that broadcasts between all connected clients
        const socketUrl = null;
        let socket = null;

        function connectSocket() {
            if (!socketUrl) return;
            try {
                socket = new WebSocket(socketUrl);
            } catch (e) {
                console.warn("WebSocket connection failed:", e);
                return;
            }

            socket.addEventListener("open", () => {
                const joinMsg = {
                    type: "join",
                    id: localPlayerId,
                    room: ROOM_ID
                };
                socket.send(JSON.stringify(joinMsg));
            });

            socket.addEventListener("message", (event) => {
                let data;
                try {
                    data = JSON.parse(event.data);
                } catch {
                    return;
                }
                if (!data || !data.type || !data.id) return;

                // Ignore messages not in our room
                if (data.room && data.room !== ROOM_ID) return;

                // Ignore our own messages
                if (data.id === localPlayerId) return;

                if (data.type === "join") {
                    ensureRemotePlayer(data.id);
                } else if (data.type === "state") {
                    const entry = ensureRemotePlayer(data.id);
                    if (!entry) return;
                    const { group } = entry;
                    if (data.position) {
                        group.position.set(
                            data.position.x,
                            data.position.y,
                            data.position.z
                        );
                    }
                    if (typeof data.yaw === "number") {
                        group.rotation.y = data.yaw;
                    }
                }
            });

            socket.addEventListener("close", () => {
                // Try to reconnect after a short delay
                setTimeout(connectSocket, 3000);
            });

            socket.addEventListener("error", () => {
                // Let close handler handle reconnection
            });
        }

        connectSocket();

        // Periodically broadcast local player state
        setInterval(() => {
            if (!socket || socket.readyState !== WebSocket.OPEN) return;
            const pos = playerRoot.position;
            const stateMsg = {
                type: "state",
                id: localPlayerId,
                room: ROOM_ID,
                position: { x: pos.x, y: pos.y, z: pos.z },
                yaw: playerRoot.rotation.y
            };
            socket.send(JSON.stringify(stateMsg));
        }, 50);

        // Hard-set tuning values (no sliders)
        const ROT_INTENSITY = 1.4; // 30% lower sensitivity
        const MOVE_INTENSITY = 0.61;
        const WALK_SPEED = 12;
        const SPRINT_SPEED = 24;
        const JUMP_SPEED = 10;

        controller.setLookIntensity(ROT_INTENSITY);
        controller.setMovementIntensity(MOVE_INTENSITY);
        controller.setWalkSpeed(WALK_SPEED);
        controller.setSprintSpeed(SPRINT_SPEED);
        controller.setJumpSpeed(JUMP_SPEED);

        // Resize handling
        window.addEventListener("resize", () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        });

        // Render loop
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            controller.update(delta);
            renderer.render(scene, camera);
        }

        animate();

        function pauseGame() {

        }

        function resumeGame() {

        }

        function resetGame() {

        }

        // API exposée
        return {
            pause: () => { pauseGame(); }, // Appelle directement pauseGame
            resume: () => { resumeGame(); }, // Appelle directement resumeGame
            restart: () => { resetGame(); }
        };
    }


}