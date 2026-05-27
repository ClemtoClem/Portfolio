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

/**
 * Tiny self-contained 3D viewport used inside the character editor.
 * Owns its own renderer/scene; rotates the avatar with pointer drag.
 */
class CharacterPreview {
	constructor(canvas) {
		this.canvas = canvas;
		this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
		this.renderer.setPixelRatio(window.devicePixelRatio || 1);
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(35, 1, 0.05, 20);
		this.camera.position.set(0, 1.6, 3.6);
		this.camera.lookAt(0, 1.1, 0);
		// Floor disc so the character has a ground reference.
		const floor = new THREE.Mesh(
			new THREE.CircleGeometry(1.2, 24),
			new THREE.MeshBasicMaterial({ color: 0x303030 }),
		);
		floor.rotation.x = -Math.PI / 2;
		floor.position.y = 0;
		this.scene.add(floor);

		this.group = new THREE.Group();
		this.scene.add(this.group);
		this.character = null;
		this.yaw = Math.PI / 6;
		this._raf = null;
		this._resize();
		this._resizeObs = new ResizeObserver(() => this._resize());
		this._resizeObs.observe(canvas);
		this._bindDrag();
		const loop = () => {
			this._raf = requestAnimationFrame(loop);
			this.group.rotation.y = this.yaw;
			this.renderer.render(this.scene, this.camera);
		};
		loop();
	}

	setCharacter(cfg) {
		if (this.character) {
			this.group.remove(this.character);
			this.character.traverse(o => {
				if (o.isMesh) { o.geometry?.dispose(); o.material?.dispose?.(); }
			});
		}
		this.character = buildCharacterMesh(cfg);
		this.group.add(this.character);
	}

	_resize() {
		const r = this.canvas.getBoundingClientRect();
		const w = Math.max(1, Math.floor(r.width));
		const h = Math.max(1, Math.floor(r.height));
		this.renderer.setSize(w, h, false);
		this.camera.aspect = w / h;
		this.camera.updateProjectionMatrix();
	}

	_bindDrag() {
		let dragging = false, lastX = 0, pid = null;
		const el = this.canvas;
		const down = (e) => {
			e.stopPropagation();
			dragging = true; lastX = e.clientX; pid = e.pointerId;
			try { el.setPointerCapture(e.pointerId); } catch (_) {}
		};
		const move = (e) => {
			if (!dragging || e.pointerId !== pid) return;
			this.yaw += (e.clientX - lastX) * 0.012;
			lastX = e.clientX;
		};
		const up = (e) => {
			if (dragging && e.pointerId === pid) {
				dragging = false; pid = null;
				try { el.releasePointerCapture(e.pointerId); } catch (_) {}
			}
		};
		el.addEventListener('pointerdown', down);
		el.addEventListener('pointermove', move);
		el.addEventListener('pointerup',   up);
		el.addEventListener('pointercancel', up);
		this._unbindDrag = () => {
			el.removeEventListener('pointerdown', down);
			el.removeEventListener('pointermove', move);
			el.removeEventListener('pointerup',   up);
			el.removeEventListener('pointercancel', up);
		};
	}

	dispose() {
		if (this._raf) cancelAnimationFrame(this._raf);
		this._resizeObs?.disconnect();
		this._unbindDrag?.();
		if (this.character) {
			this.character.traverse(o => {
				if (o.isMesh) { o.geometry?.dispose(); o.material?.dispose?.(); }
			});
		}
		this.renderer.dispose();
	}
}

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
				<div class="br-editor-body">
					<canvas id="br-preview" class="br-preview" data-panel-noswipe></canvas>
					<div id="br-editor-fields" class="br-editor-fields"></div>
				</div>
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
	icon: `<svg height="64px" width="64px" viewBox="0 0 512 512" fill="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#ffffff;} </style> <g> <path class="st0" d="M474.01,89.302L273.877,3.673C268.196,1.235,262.191,0,256,0c-6.19,0-12.195,1.235-17.876,3.673L37.991,89.302 c-16.74,7.161-27.564,23.558-27.564,41.777v249.853c0,18.21,10.824,34.606,27.564,41.777l200.144,85.628 C243.815,510.766,249.819,512,256,512c6.182,0,12.186-1.234,17.877-3.663l200.133-85.628c16.739-7.171,27.563-23.577,27.563-41.777 V131.078C501.573,112.869,490.749,96.462,474.01,89.302z M41.027,380.932V131.078c0-1.372,0.196-2.733,0.578-4.065l205.746,88.029 V479.01L50.039,394.587C44.564,392.246,41.027,386.878,41.027,380.932z M461.962,394.587L264.659,479.01V215.042l205.736-88.029 c0.382,1.332,0.579,2.693,0.579,4.065v249.853C470.974,386.878,467.437,392.246,461.962,394.587z M256,30.6 c2.018,0,3.987,0.401,5.828,1.195l193.56,82.818L256,199.918L56.611,114.613l193.552-82.818C252.014,31.001,253.983,30.6,256,30.6z "></path> <path class="st0" d="M94.822,214.052c2.086-3.585,1.146-8.532-2.096-11.048c-3.242-2.518-7.572-1.656-9.667,1.929 c-2.087,3.595-1.146,8.542,2.095,11.049C88.397,218.5,92.725,217.637,94.822,214.052z"></path> <path class="st0" d="M89.924,336.57c2.086-3.586,1.156-8.532-2.086-11.049c-3.242-2.518-7.572-1.646-9.667,1.94 c-2.087,3.585-1.146,8.541,2.096,11.048C83.499,341.026,87.838,340.155,89.924,336.57z"></path> <path class="st0" d="M127.488,294.186c2.087-3.595,1.157-8.542-2.086-11.059c-3.252-2.517-7.581-1.645-9.667,1.94 c-2.086,3.585-1.157,8.532,2.086,11.05C121.073,298.633,125.402,297.761,127.488,294.186z"></path> <path class="st0" d="M158.509,398.308c2.086-3.585,1.147-8.531-2.096-11.048c-3.242-2.518-7.572-1.656-9.658,1.93 c-2.096,3.595-1.156,8.541,2.086,11.048C152.084,402.755,156.413,401.894,158.509,398.308z"></path> <path class="st0" d="M194.252,346.208c-2.096,3.595-1.156,8.542,2.086,11.058c3.242,2.518,7.582,1.656,9.668-1.929 c2.086-3.595,1.145-8.542-2.086-11.049C200.667,341.761,196.339,342.633,194.252,346.208z"></path> <path class="st0" d="M225.841,429.496c2.076-3.595,1.146-8.541-2.096-11.048c-3.242-2.518-7.572-1.656-9.667,1.929 c-2.087,3.586-1.146,8.532,2.095,11.049C219.416,433.953,223.745,433.08,225.841,429.496z"></path> <path class="st0" d="M202.921,263.459c2.076-3.585,1.145-8.532-2.096-11.049c-3.243-2.516-7.572-1.645-9.668,1.94 c-2.086,3.585-1.146,8.542,2.096,11.049C196.495,267.915,200.825,267.044,202.921,263.459z"></path> <path class="st0" d="M439.287,349.617c-2.086,3.585-1.146,8.531,2.086,11.048c3.252,2.518,7.581,1.646,9.668-1.939 c2.095-3.586,1.156-8.542-2.087-11.049C445.712,345.16,441.373,346.032,439.287,349.617z"></path> <path class="st0" d="M377.254,316.382c-2.086,3.585-1.145,8.54,2.086,11.048c3.252,2.518,7.582,1.656,9.668-1.939 c2.096-3.585,1.155-8.532-2.086-11.039C383.679,311.925,379.34,312.798,377.254,316.382z"></path> <path class="st0" d="M446.613,265.673c2.087-3.585,1.146-8.532-2.086-11.04c-3.242-2.517-7.581-1.655-9.667,1.93 s-1.146,8.542,2.086,11.049C440.187,270.129,444.527,269.268,446.613,265.673z"></path> <path class="st0" d="M351.346,265.673c2.096-3.585,1.156-8.532-2.086-11.04c-3.242-2.517-7.582-1.655-9.668,1.93 c-2.086,3.585-1.146,8.542,2.086,11.049C344.931,270.129,349.26,269.268,351.346,265.673z"></path> <path class="st0" d="M249.986,82.817c3.586,2.087,8.542,1.146,11.049-2.095c2.518-3.243,1.655-7.572-1.94-9.658 c-3.585-2.096-8.531-1.156-11.038,2.086C245.529,76.392,246.401,80.722,249.986,82.817z"></path> <path class="st0" d="M159.529,124.408c-2.518,3.242-1.656,7.582,1.93,9.668c3.595,2.086,8.541,1.146,11.048-2.086 c2.518-3.252,1.656-7.582-1.93-9.668C166.992,120.225,162.046,121.166,159.529,124.408z"></path> <path class="st0" d="M350.072,127.326c3.595,2.087,8.532,1.156,11.049-2.086c2.518-3.252,1.656-7.581-1.93-9.667 c-3.595-2.096-8.54-1.156-11.048,2.086C345.626,120.911,346.487,125.24,350.072,127.326z"></path> <path class="st0" d="M252.738,169.358c-2.527,3.242-1.655,7.572,1.93,9.667c3.586,2.086,8.542,1.146,11.049-2.095 c2.518-3.243,1.655-7.572-1.94-9.658C260.193,165.175,255.246,166.115,252.738,169.358z"></path> <path class="st0" d="M228.055,130.412c3.585,2.086,8.532,1.146,11.049-2.096c2.516-3.243,1.645-7.572-1.94-9.668 c-3.585-2.086-8.54-1.145-11.048,2.096C223.599,123.986,224.47,128.316,228.055,130.412z"></path> <path class="st0" d="M157.031,100.84c3.585,2.096,8.541,1.146,11.048-2.086c2.518-3.242,1.656-7.581-1.93-9.668 c-3.595-2.095-8.54-1.155-11.048,2.088C152.584,94.415,153.445,98.754,157.031,100.84z"></path> <path class="st0" d="M399.312,189.8c-2.086,3.585-1.145,8.53,2.086,11.048c3.253,2.518,7.582,1.656,9.668-1.93 c2.096-3.595,1.156-8.531-2.086-11.048C405.739,185.353,401.399,186.214,399.312,189.8z"></path> <path class="st0" d="M313.007,307.518c-2.095,3.585-1.155,8.541,2.086,11.048c3.253,2.517,7.582,1.656,9.668-1.929 c2.086-3.595,1.156-8.542-2.086-11.05C319.434,303.07,315.094,303.933,313.007,307.518z"></path> <path class="st0" d="M294.642,376.358c-2.086,3.585-1.156,8.532,2.086,11.048c3.252,2.518,7.581,1.646,9.668-1.939 c2.096-3.586,1.156-8.542-2.087-11.049C301.068,371.9,296.729,372.772,294.642,376.358z"></path> <path class="st0" d="M348.457,398.357c-2.086,3.585-1.146,8.532,2.086,11.05c3.243,2.507,7.582,1.646,9.668-1.94 c2.086-3.585,1.146-8.541-2.086-11.048C354.882,393.9,350.543,394.762,348.457,398.357z"></path> </g> </g></svg>`,
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

		.br-editor-body {
			display: flex; flex-direction: row; gap: 12px;
			max-width: 640px; width: 100%; align-items: stretch;
		}
		@media (max-width: 480px) {
			.br-editor-body { flex-direction: column; align-items: center; }
		}
		.br-preview {
			flex: 0 0 auto;
			width: 220px; height: 280px;
			background: linear-gradient(180deg, #2a2a2a, #1a1a1a);
			border: 1px solid #444; border-radius: 8px;
			cursor: grab; touch-action: none;
			display: block;
		}
		.br-preview:active { cursor: grabbing; }
		.br-editor-fields {
			flex: 1 1 auto;
			display: grid; grid-template-columns: 1fr 1fr; gap: 6px 12px;
			max-height: 60vh; overflow-y: auto;
			padding: 8px;
			background: rgba(0,0,0,0.25); border-radius: 6px;
			align-content: start;
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
			// Push a navigator route so the app-header back button returns
			// to the main menu instead of closing the app. The route's
			// `onPop` handler runs whether the user clicks Cancel (which
			// calls navigator.pop) or the header back button.
			ctx.navigator.push({
				name: 'br-editor',
				title: strings.editor,
				onPop: () => {
					preview?.dispose();
					preview = null;
					showMenu();
				},
			});
		};
		const showStage = () => {
			menu.style.display = 'none';
			editor.style.display = 'none';
			stage.style.display = '';
		};
		ctx.scope.on(ctx.$('#br-play'),         'click', startGame);
		ctx.scope.on(ctx.$('#br-open-editor'),  'click', showEditor);
		ctx.scope.on(ctx.$('#br-editor-cancel'),'click', () => ctx.navigator.pop());
		ctx.scope.on(ctx.$('#br-editor-apply'), 'click', applyEditor);
		ctx.scope.on(ctx.$('#br-resume'),       'click', resumeGame);
		ctx.scope.on(ctx.$('#br-quit'),         'click', quitToMenu);
		showMenu();

		// Persisted character config (used both for the editor and at startGame).
		let character = loadCharacter(ctx.storage);
		let characterMesh = null;
		let preview = null; // CharacterPreview instance, alive while editor screen is open

		function readEditorConfig() {
			const next = { ...character };
			for (const field of CHARACTER_SCHEMA) {
				const el = ctx.$(`#br-edit-${field.key}`);
				if (!el) continue;
				next[field.key] = field.type === 'range' ? parseFloat(el.value) : el.value;
			}
			return next;
		}

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
				// Live-update the 3D preview on any change.
				const evt = (field.type === 'select' || field.type === 'text') ? 'change' : 'input';
				input.addEventListener(evt, () => preview?.setCharacter(readEditorConfig()));
			}

			// (Re)spin up the preview renderer.
			preview?.dispose();
			preview = new CharacterPreview(ctx.$('#br-preview'));
			preview.setCharacter(character);
		}

		function applyEditor() {
			character = readEditorConfig();
			saveCharacter(ctx.storage, character);
			rebuildCharacterMesh();
			// Pop the editor route — onPop disposes the preview and shows the menu.
			ctx.navigator.pop();
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

			// First chunk gen + lift out of any solid block + start loop.
			ensureChunksAround(controller.position);
			controller.ensureNotStuck();
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
				preview?.dispose();
			},
		};
	},
};
