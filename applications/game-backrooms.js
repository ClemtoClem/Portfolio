import * as THREE from 'https://esm.sh/three@0.160.0';
import { Ecs } from './game-backrooms/ecs.js';
import { World, CHUNK_SIZE } from './game-backrooms/world.js';
import { BackroomsGenerator, defaultSpawn, biomeAt } from './game-backrooms/generator.js';
import { FirstPersonController } from './game-backrooms/controls.js';
import { ElevatorSystem } from './game-backrooms/elevator.js';
import { AudioBus } from './game-backrooms/audio.js';
import { buildAtlas } from './game-backrooms/textures.js';
import { meshChunk } from './game-backrooms/mesher.js';
import { footstepGroup } from './game-backrooms/blocks.js';
import { buildCharacterMesh, loadCharacter, saveCharacter, CHARACTER_SCHEMA } from './game-backrooms/character.js';

const VERSION = '1.0.0';
const VIEW_RADIUS_XZ = 3; // chunks horizontally (3 → 96-block radius)
const VIEW_RADIUS_Y  = 2; // chunks vertically

const STRINGS = {
	'en-US': {
		title: 'Backrooms', play: 'PLAY', back: 'Return', pause: 'Paused',
		resume: 'Resume', mainMenu: 'Main menu', loading: 'Generating the world…',
		controls: 'WASD/ZQSD = move · Mouse/Touch = look · Space = jump · C = view mode · E or click = elevator · Esc = pause',
		editor: 'Character editor', apply: 'Save', cancel: 'Cancel',
	},
	'fr-FR': {
		title: 'Backrooms', play: 'JOUER', back: 'Retour', pause: 'Pause',
		resume: 'Reprendre', mainMenu: 'Menu principal', loading: 'Génération du monde…',
		controls: 'ZQSD = bouger · Souris/Tactile = regarder · Espace = sauter · C = vue · E ou clic = ascenseur · Échap = pause',
		editor: 'Éditeur de personnage', apply: 'Enregistrer', cancel: 'Annuler',
	},
};

function html(s) {
	return `
		<div class="game-container">
			<div id="br-menu" class="game-menu-screen">
				<h1 class="game-title">${s.title}</h1>
				<div class="game-version">Version ${VERSION}</div>
				<button id="br-play" class="game-btn">${s.play}</button>
				<button id="br-open-editor" class="game-btn">${s.editor}</button>
				<p style="max-width:340px;text-align:center;font-size:0.78rem;opacity:0.7;">${s.controls}</p>
			</div>
			<div id="br-editor" class="game-menu-screen" style="display:none;">
				<h2 class="game-title">${s.editor}</h2>
				<div id="br-editor-fields" class="br-editor-fields"></div>
				<div class="br-editor-actions">
					<button id="br-editor-apply"  class="game-btn">${s.apply}</button>
					<button id="br-editor-cancel" class="game-btn">${s.cancel}</button>
				</div>
			</div>
			<div class="game-content br-stage" style="display:none;">
				<canvas id="br-canvas"></canvas>
				<div class="br-hud">
					<div id="br-biome"></div>
					<div id="br-coords"></div>
					<div id="br-view"></div>
				</div>
				<div id="br-loading" class="br-loading">${s.loading}</div>
				<div class="fps-pause-overlay" id="br-pause" style="display:none;">
					<h2>${s.pause}</h2>
					<button class="game-btn" id="br-resume">${s.resume}</button>
					<button class="game-btn" id="br-quit">${s.mainMenu}</button>
				</div>
			</div>
		</div>
	`;
}

export const gameBackroomsApp = {
	id: 'game-backrooms',
	title: 'Backrooms',
	version: VERSION,
	icon: `<svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="18" rx="1" fill="#eaec7e" stroke="#7a8a3e" stroke-width="1.2"/><path d="M2 9h20M2 15h20M8 3v18M16 3v18" stroke="#7a8a3e" stroke-width="0.8"/></svg>`,
	iconColor: '#7ed0ec',
	headerColor: '#7ed0ec',
	type: 'game',
	style: `
		:root {
			--primary-color: #7ed0ec;
			--primary-dark-color: #31697c;
			--primary-background-color: #c8f1ff;
		}
		.app-content { padding: 0; background: #000; }
		.game-container { width: 100%; height: 100%; position: relative; }
		.br-stage { position: relative; width: 100%; height: 100%; overflow: hidden; background: #000; }
		#br-canvas { display: block; width: 100%; height: 100%; cursor: crosshair; }
		.br-hud {
			position: absolute; top: 8px; left: 8px;
			padding: 6px 10px; background: rgba(0,0,0,0.5);
			color: #fff; font-family: monospace; font-size: 0.8rem;
			border-radius: 4px; pointer-events: none;
		}
		.br-loading {
			position: absolute; inset: 0;
			display: flex; align-items: center; justify-content: center;
			background: #000; color: #fff;
			font-family: 'Roboto', sans-serif;
		}
		.fps-pause-overlay {
			position: absolute; inset: 0; background: rgba(0,0,0,0.65);
			display: flex; flex-direction: column; align-items: center;
			justify-content: center; gap: 14px; color: #fff; z-index: 20;
		}
		.fps-pause-overlay h2 { margin: 0; font-size: 1.6em; }
		.fps-pause-overlay .game-btn { min-width: 180px; }

		.br-editor-fields {
			display: grid; grid-template-columns: 1fr 1fr; gap: 6px 12px;
			max-width: 360px; width: 100%;
			max-height: 60vh; overflow-y: auto;
			padding: 8px;
			background: rgba(0,0,0,0.25); border-radius: 6px;
		}
		.br-editor-fields label {
			grid-column: 1; display: flex; align-items: center;
			font-size: 0.85rem; color: #ddd;
		}
		.br-editor-fields input, .br-editor-fields select {
			grid-column: 2;
			padding: 4px 6px; border-radius: 4px; border: 1px solid #444;
			background: #222; color: #fff; font-size: 0.85rem;
		}
		.br-editor-fields input[type=color] {
			width: 50px; height: 28px; padding: 0; cursor: pointer;
		}
		.br-editor-fields input[type=range] { padding: 0; }
		.br-editor-actions { display: flex; gap: 10px; margin-top: 14px; }
	`,
	content: { 'en-US': html(STRINGS['en-US']), 'fr-FR': html(STRINGS['fr-FR']) },

	onMount(ctx) {
		const strings = STRINGS[ctx.lang] || STRINGS['fr-FR'];
		const stage   = ctx.$('.br-stage');
		const canvas  = ctx.$('#br-canvas');
		const menu    = ctx.$('#br-menu');
		const editor  = ctx.$('#br-editor');
		const loading = ctx.$('#br-loading');
		const pauseEl = ctx.$('#br-pause');
		const hudBiome= ctx.$('#br-biome');
		const hudCoords = ctx.$('#br-coords');
		const hudView   = ctx.$('#br-view');

		let renderer = null, scene = null, camera = null;
		let controller = null, world = null, generator = null, ecs = null, audio = null, elevator = null;
		let chunkMeshes = new Map(); // key → THREE.Mesh
		let atlasMat = null;
		let atlas_uv = () => [0, 0, 1, 1]; // wired once the atlas is built
		let raf = null;
		let paused = false;
		let resizeObs = null;

		// Menu wiring ──────────────────────────────────────────
		const showMenu = () => {
			menu.style.display = '';
			editor.style.display = 'none';
			stage.style.display = 'none';
		};
		const showEditor = () => {
			menu.style.display = 'none';
			editor.style.display = '';
			renderEditor();
		};
		const showStage = () => {
			menu.style.display = 'none';
			editor.style.display = 'none';
			stage.style.display = '';
		};
		ctx.scope.on(ctx.$('#br-play'),         'click', startGame);
		ctx.scope.on(ctx.$('#br-open-editor'),  'click', showEditor);
		ctx.scope.on(ctx.$('#br-editor-cancel'),'click', showMenu);
		ctx.scope.on(ctx.$('#br-editor-apply'), 'click', applyEditor);
		ctx.scope.on(ctx.$('#br-resume'),       'click', resumeGame);
		ctx.scope.on(ctx.$('#br-quit'),         'click', quitToMenu);
		showMenu();

		// Persisted character config (used both for the editor and at startGame).
		let character = loadCharacter(ctx.storage);
		let characterMesh = null;

		function renderEditor() {
			const host = ctx.$('#br-editor-fields');
			host.innerHTML = '';
			for (const field of CHARACTER_SCHEMA) {
				const label = document.createElement('label');
				label.textContent = ctx.lang === 'en-US' ? field.en : field.fr;
				label.setAttribute('for', `br-edit-${field.key}`);
				host.appendChild(label);

				let input;
				if (field.type === 'select') {
					input = document.createElement('select');
					for (const opt of field.options) {
						const o = document.createElement('option');
						o.value = opt; o.textContent = opt;
						if (character[field.key] === opt) o.selected = true;
						input.appendChild(o);
					}
				} else {
					input = document.createElement('input');
					input.type = field.type === 'color' ? 'color'
						: field.type === 'range' ? 'range' : 'text';
					if (field.type === 'range') {
						input.min = field.min; input.max = field.max; input.step = field.step;
					}
					input.value = character[field.key] ?? '';
				}
				input.id = `br-edit-${field.key}`;
				input.dataset.key = field.key;
				input.dataset.kind = field.type;
				host.appendChild(input);
			}
		}

		function applyEditor() {
			const next = { ...character };
			for (const field of CHARACTER_SCHEMA) {
				const el = ctx.$(`#br-edit-${field.key}`);
				if (!el) continue;
				next[field.key] = field.type === 'range' ? parseFloat(el.value) : el.value;
			}
			character = next;
			saveCharacter(ctx.storage, character);
			rebuildCharacterMesh();
			showMenu();
		}

		function rebuildCharacterMesh() {
			if (!controller) return;
			if (characterMesh) {
				controller.bodyMount.remove(characterMesh);
				characterMesh.traverse(o => { if (o.isMesh) { o.geometry?.dispose(); o.material?.dispose?.(); } });
			}
			characterMesh = buildCharacterMesh(character);
			controller.bodyMount.add(characterMesh);
		}

		// Boot ──────────────────────────────────────────────────
		async function startGame() {
			showStage();
			loading.style.display = '';
			await new Promise(r => requestAnimationFrame(r));

			// Build three.js scene
			renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
			renderer.setPixelRatio(window.devicePixelRatio);
			scene = new THREE.Scene();
			scene.background = new THREE.Color(0x111111);
			scene.fog = new THREE.Fog(0x111111, 12, 70);
			camera = new THREE.PerspectiveCamera(75, 1, 0.05, 200);

			fitCanvas();
			resizeObs = new ResizeObserver(fitCanvas);
			resizeObs.observe(canvas);
			ctx.scope.observe(resizeObs);
			ctx.scope.on(window, 'resize', fitCanvas);

			// World
			world = new World();
			generator = new BackroomsGenerator(ctx.storage.get('seed', 1337));
			ecs = new Ecs();

			// Texture atlas (async). Bind the UV lookup used by the mesher.
			const atlas = await buildAtlas();
			atlas_uv = atlas.uv;
			atlasMat = new THREE.MeshBasicMaterial({
				map: atlas.texture,
				vertexColors: true,
				side: THREE.DoubleSide,
				alphaTest: 0.3,
			});

			// Player
			controller = new FirstPersonController(camera, canvas, world);
			scene.add(controller.object);
			// The camera lives on the scene root so view modes can place it
			// independently of the player rig.
			scene.add(camera);
			const spawn = defaultSpawn();
			controller.setPosition(spawn.x, spawn.y, spawn.z);

			// Attach the persisted character avatar to the player.
			rebuildCharacterMesh();

			// Audio + elevator
			audio = new AudioBus();
			elevator = new ElevatorSystem(scene, controller, atlas.uv, audio);
			elevator.bindSeed(generator.seed);
			audio.start();

			// Navigator route — header hidden during play, back button → main menu.
			ctx.navigator.push({
				name: 'br-game',
				showHeader: false,
				onBack: () => { quitToMenu(); return false; },
			});

			// Game-specific keys (E to ride elevator)
			ctx.scope.on(document, 'keydown', onKey);

			loading.style.display = 'none';

			// First chunk gen + start loop
			ensureChunksAround(controller.position);
			lastTime = performance.now();
			loop();
		}

		function onKey(e) {
			if (!ctx.root.isConnected || stage.style.display === 'none') return;
			if (e.key === 'Escape') {
				e.preventDefault();
				paused ? resumeGame() : pauseGame();
			} else if (e.key === 'e' || e.key === 'E') {
				elevator?.trigger();
			}
		}

		function fitCanvas() {
			if (!renderer) return;
			const r = canvas.getBoundingClientRect();
			const w = Math.max(1, Math.floor(r.width));
			const h = Math.max(1, Math.floor(r.height));
			renderer.setSize(w, h, false);
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
		}

		// Pause / resume / quit ────────────────────────────────
		function pauseGame() {
			if (paused) return;
			paused = true;
			pauseEl.style.display = '';
			controller?.pause();
			ctx.navigator.configure({ showHeader: true, title: strings.pause });
		}
		function resumeGame() {
			if (!paused) return;
			paused = false;
			pauseEl.style.display = 'none';
			controller?.resume();
			ctx.navigator.configure({ showHeader: false });
			lastTime = performance.now();
		}
		function quitToMenu() {
			paused = false;
			pauseEl.style.display = 'none';
			if (raf) cancelAnimationFrame(raf);
			raf = null;
			audio?.stop();
			elevator?.dispose();
			controller?.dispose();
			renderer?.dispose();
			for (const m of chunkMeshes.values()) {
				scene.remove(m);
				m.geometry?.dispose();
			}
			chunkMeshes.clear();
			ctx.navigator.reset();
			showMenu();
			renderer = null;
		}

		// Chunk streaming ──────────────────────────────────────
		function ensureChunksAround(pos) {
			const [pcx, pcy, pcz] = world.worldToChunk(pos.x, pos.y, pos.z);
			// Generate
			for (let dy = -VIEW_RADIUS_Y; dy <= VIEW_RADIUS_Y; dy++) {
				for (let dz = -VIEW_RADIUS_XZ; dz <= VIEW_RADIUS_XZ; dz++) {
					for (let dx = -VIEW_RADIUS_XZ; dx <= VIEW_RADIUS_XZ; dx++) {
						const cx = pcx + dx, cy = pcy + dy, cz = pcz + dz;
						const c = world.chunkAt(cx, cy, cz, true);
						if (!c.generated) generator.generate(c);
					}
				}
			}
			// (Re)mesh dirty chunks within view
			for (let dy = -VIEW_RADIUS_Y; dy <= VIEW_RADIUS_Y; dy++) {
				for (let dz = -VIEW_RADIUS_XZ; dz <= VIEW_RADIUS_XZ; dz++) {
					for (let dx = -VIEW_RADIUS_XZ; dx <= VIEW_RADIUS_XZ; dx++) {
						const cx = pcx + dx, cy = pcy + dy, cz = pcz + dz;
						const c = world.chunkAt(cx, cy, cz);
						if (c?.dirty) rebuildChunkMesh(c);
					}
				}
			}
			// Unload far meshes
			for (const [key, mesh] of chunkMeshes) {
				const [kx, ky, kz] = key.split('|').map(Number);
				if (Math.abs(kx - pcx) > VIEW_RADIUS_XZ + 1 ||
					Math.abs(ky - pcy) > VIEW_RADIUS_Y + 1 ||
					Math.abs(kz - pcz) > VIEW_RADIUS_XZ + 1) {
					scene.remove(mesh);
					mesh.geometry?.dispose();
					chunkMeshes.delete(key);
					world.dropChunk(kx, ky, kz);
				}
			}
		}

		function rebuildChunkMesh(chunk) {
			const key = World.key(chunk.cx, chunk.cy, chunk.cz);
			const old = chunkMeshes.get(key);
			if (old) {
				scene.remove(old);
				old.geometry?.dispose();
				chunkMeshes.delete(key);
			}
			const geo = meshChunk(chunk, (x, y, z) => world.getBlock(x, y, z), atlas_uv);
			chunk.dirty = false;
			if (!geo) return;
			const mesh = new THREE.Mesh(geo, atlasMat);
			mesh.position.set(chunk.cx * CHUNK_SIZE, chunk.cy * CHUNK_SIZE, chunk.cz * CHUNK_SIZE);
			scene.add(mesh);
			chunkMeshes.set(key, mesh);
		}

		// ── Main loop ─────────────────────────────────────────
		let lastTime = performance.now();
		function loop() {
			raf = requestAnimationFrame(loop);
			const now = performance.now();
			const dt = Math.min(0.05, (now - lastTime) / 1000);
			lastTime = now;
			if (paused) return;

			controller.update(dt);
			elevator.update(dt);
			ensureChunksAround(controller.position);

			// HUD
			const p = controller.position;
			hudBiome.textContent  = biomeAt(Math.floor(p.y));
			hudCoords.textContent = `${p.x.toFixed(1)} ${p.y.toFixed(1)} ${p.z.toFixed(1)}`;
			hudView.textContent   = `view: ${controller.viewMode}`;

			// Audio
			audio.setCameraPos(p);
			audio.setBiome(biomeAt(Math.floor(p.y)));
			const moving = (Math.abs(controller.velocity.x) + Math.abs(controller.velocity.z)) > 0.1 && controller.onGround;
			const blockUnder = world.getBlock(Math.floor(p.x), Math.floor(p.y - 0.1), Math.floor(p.z));
			audio.footstep(footstepGroup(blockUnder), dt, moving);

			renderer.render(scene, camera);
		}

		return {
			pause:   pauseGame,
			resume:  resumeGame,
			restart: quitToMenu,
			quit:    () => {
				if (raf) cancelAnimationFrame(raf);
				audio?.stop();
				controller?.dispose();
				renderer?.dispose();
			},
		};
	},
};
