import * as THREE from 'https://esm.sh/three@0.160.0';
import { createTown } from './game-town-fps/town.js';
import { FirstPersonController } from './game-town-fps/controls.js';

const VERSION = '1.0.0';

const STRINGS = {
	'en-US': { new: 'NEW PART', load: 'LOAD PART', settings: 'SETTINGS', partName: 'Part name', placeholder: 'My town', start: 'Start', back: 'Return', savedTitle: 'Saved parts', config: 'Configurations', nickname: 'Nickname', color: 'Character color', paused: 'Paused', resume: 'Resume', mainMenu: 'Main menu', pauseHint: 'Press Esc to pause' },
	'fr-FR': { new: 'NOUVELLE PARTIE', load: 'CHARGER UNE PARTIE', settings: 'CONFIGURATIONS', partName: 'Nom de la partie', placeholder: 'Ma Super Ville…', start: 'Commencer', back: 'Retour', savedTitle: 'Parties sauvegardées', config: 'Configurations', nickname: 'Pseudonyme', color: 'Couleur du personnage', paused: 'Pause', resume: 'Reprendre', mainMenu: 'Menu principal', pauseHint: 'Échap pour mettre en pause' },
};

function html(s) {
	return `
		<div class="game-container">
			<link rel="stylesheet" href="./applications/game-town-fps/styles.css" />
			<div id="fps-main-menu" class="game-menu-screen">
				<h1 class="game-title">📚 TOWN FPS</h1>
				<div class="game-version">Version ${VERSION}</div>
				<div class="game-menu-buttons">
					<button class="game-btn" id="fps-btn-new">${s.new}</button>
					<button class="game-btn" id="fps-btn-load">${s.load}</button>
					<button class="game-btn" id="fps-btn-settings">${s.settings}</button>
				</div>
			</div>
			<div id="fps-new-menu" class="game-menu-screen" style="display:none;">
				<h2>${s.partName}</h2>
				<input type="text" id="fps-save-name" class="game-input" placeholder="${s.placeholder}">
				<button class="game-btn" id="fps-btn-start">${s.start}</button>
				<button class="game-btn fps-back" style="min-width:150px;">${s.back}</button>
			</div>
			<div id="fps-load-menu" class="game-menu-screen" style="display:none;">
				<h2>${s.savedTitle}</h2>
				<div id="fps-save-list" class="save-list"></div>
				<button class="game-btn fps-back" style="min-width:150px;">${s.back}</button>
			</div>
			<div id="fps-settings-menu" class="game-menu-screen" style="display:none;">
				<h2>${s.config}</h2>
				<div class="game-input-group">
					<label>${s.nickname}</label>
					<input type="text" id="fps-nickname" class="game-input" value="Player">
				</div>
				<div class="game-input-group">
					<label>${s.color}</label>
					<input type="color" id="fps-color" class="game-input" value="#8BC34A">
				</div>
				<button class="game-btn fps-back" style="min-width:150px;">${s.back}</button>
			</div>
			<div class="game-content fps-stage" style="display:none;">
				<canvas id="fps-canvas"></canvas>
				<div id="joystick-container"></div>
				<div id="look-joystick-container"></div>
				<div id="crosshair"></div>
				<div class="fps-pause-overlay" id="fps-pause-overlay" style="display:none;">
					<h2>${s.paused}</h2>
					<button class="game-btn" id="fps-btn-resume">${s.resume}</button>
					<button class="game-btn" id="fps-btn-quit">${s.mainMenu}</button>
				</div>
			</div>
		</div>
	`;
}

export const gameTownFPSApp = {
	id: 'game-town-fps',
	title: 'Town FPS',
	version: VERSION,
	icon: `<svg viewBox="0 0 32 32"><path d="M30 14.75h-2.824c-0.608-5.219-4.707-9.318-9.874-9.921l-0.053-0.005v-2.824c0-0.69-0.56-1.25-1.25-1.25s-1.25 0.56-1.25 1.25v0 2.824c-5.219 0.608-9.318 4.707-9.921 9.874l-0.005 0.053h-2.824c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h2.824c0.608 5.219 4.707 9.318 9.874 9.921l0.053 0.005v2.824c0 0.69 0.56 1.25 1.25 1.25s1.25-0.56 1.25-1.25v0-2.824c5.219-0.608 9.318-4.707 9.921-9.874l0.005-0.053h2.824c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0zM17.25 24.624v-2.624c0-0.69-0.56-1.25-1.25-1.25s-1.25 0.56-1.25 1.25v0 2.624c-3.821-0.57-6.803-3.553-7.368-7.326l-0.006-0.048h2.624c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0h-2.624c0.57-3.821 3.553-6.804 7.326-7.368l0.048-0.006v2.624c0 0.69 0.56 1.25 1.25 1.25s1.25-0.56 1.25-1.25v0-2.624c3.821 0.57 6.803 3.553 7.368 7.326l0.006 0.048h-2.624c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h2.624c-0.571 3.821-3.553 6.803-7.326 7.368l-0.048 0.006z"/></svg>`,
	iconColor: '#7ed0ec',
	headerColor: '#7ed0ec',
	type: 'game',
	style: ``,
	content: { 'en-US': html(STRINGS['en-US']), 'fr-FR': html(STRINGS['fr-FR']) },

	onMount(ctx) {
		const strings = STRINGS[ctx.lang] || STRINGS['fr-FR'];
		const canvas      = ctx.$('#fps-canvas');
		const stage       = ctx.$('.fps-stage');
		const pauseOverlay= ctx.$('#fps-pause-overlay');
		const menus = {
			main:     ctx.$('#fps-main-menu'),
			newPart:  ctx.$('#fps-new-menu'),
			load:     ctx.$('#fps-load-menu'),
			settings: ctx.$('#fps-settings-menu'),
		};

		const showMenu = (name) => {
			Object.values(menus).forEach(m => m.style.display = 'none');
			stage.style.display = 'none';
			if (name) menus[name].style.display = '';
		};

		ctx.scope.delegate(ctx.root, 'click', '.fps-back', () => showMenu('main'));
		ctx.scope.on(ctx.$('#fps-btn-new'),      'click', () => showMenu('newPart'));
		ctx.scope.on(ctx.$('#fps-btn-load'),     'click', () => showMenu('load'));
		ctx.scope.on(ctx.$('#fps-btn-settings'), 'click', () => showMenu('settings'));
		ctx.scope.on(ctx.$('#fps-btn-start'),    'click', () => launchGame());
		ctx.scope.on(ctx.$('#fps-btn-resume'),   'click', () => resumeGame());
		ctx.scope.on(ctx.$('#fps-btn-quit'),     'click', () => returnToMenu());

		showMenu('main');

		// ── Game state (created lazily on first launch) ───────
		let renderer, scene, camera, controller;
		let raf = null;
		let resizeObs;
		let paused = false;
		const clock = new THREE.Clock();

		function launchGame() {
			Object.values(menus).forEach(m => m.style.display = 'none');
			stage.style.display = '';
			pauseOverlay.style.display = 'none';
			paused = false;

			// In-game route: header hidden, header-back returns to main menu.
			ctx.navigator.push({
				name: 'fps-game',
				showHeader: false,
				onBack: () => { returnToMenu(); return false; }, // we handle nav ourselves
			});

			if (!renderer) buildScene();
			fitToCanvas();
			animate();
		}

		function pauseGame() {
			if (!raf || paused) return;
			paused = true;
			cancelAnimationFrame(raf);
			raf = null;
			pauseOverlay.style.display = '';
			// Reveal the header so the user can use the back button.
			ctx.navigator.configure({ showHeader: true, title: strings.paused });
		}

		function resumeGame() {
			if (!paused) return;
			paused = false;
			pauseOverlay.style.display = 'none';
			ctx.navigator.configure({ showHeader: false });
			// Reset the delta clock to avoid a giant step on the next frame.
			clock.getDelta();
			animate();
		}

		function returnToMenu() {
			if (raf) { cancelAnimationFrame(raf); raf = null; }
			paused = false;
			pauseOverlay.style.display = 'none';
			// Drop the in-game route; the navigator restores header/title.
			ctx.navigator.reset();
			showMenu('main');
		}

		function buildScene() {
			renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.outputColorSpace = THREE.SRGBColorSpace;

			scene = new THREE.Scene();
			scene.background = new THREE.Color(0x87ceeb);
			scene.fog = new THREE.FogExp2(0x87ceeb, 0.006);

			camera = new THREE.PerspectiveCamera(70, 1, 0.1, 500);

			scene.add(new THREE.HemisphereLight(0xffffff, 0x404040, 0.9));
			const sun = new THREE.DirectionalLight(0xfff3cd, 0.9);
			sun.position.set(30, 40, 10);
			sun.castShadow = true;
			sun.shadow.mapSize.set(1024, 1024);
			sun.shadow.camera.near = 1;
			sun.shadow.camera.far = 150;
			scene.add(sun);

			const { ground, buildings } = createTown(scene);

			controller = new FirstPersonController(camera, renderer.domElement, ground, [...buildings]);
			controller.setLookIntensity(1.4);
			controller.setMovementIntensity(0.61);
			controller.setWalkSpeed(12);
			controller.setSprintSpeed(24);
			controller.setJumpSpeed(10);

			const playerRoot = controller.getObject();
			scene.add(playerRoot);
			playerRoot.position.set(0, 3, 12);

			// Sized to canvas, not window — keeps the canvas inside the app window.
			resizeObs = new ResizeObserver(fitToCanvas);
			resizeObs.observe(canvas);
			ctx.scope.observe(resizeObs);
		}

		function fitToCanvas() {
			if (!renderer || !canvas) return;
			const r = canvas.getBoundingClientRect();
			const w = Math.max(1, Math.floor(r.width));
			const h = Math.max(1, Math.floor(r.height));
			renderer.setSize(w, h, false);
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
		}

		function animate() {
			raf = requestAnimationFrame(animate);
			const delta = clock.getDelta();
			if (controller) controller.update(delta);
			if (renderer && scene && camera) renderer.render(scene, camera);
		}

		// Escape toggles pause when the game is running.
		ctx.scope.on(document, 'keydown', (e) => {
			if (!ctx.root.isConnected) return;
			if (e.key !== 'Escape') return;
			if (stage.style.display === 'none') return; // not in-game
			e.preventDefault();
			paused ? resumeGame() : pauseGame();
		});

		// Resize when window-level layout shifts (header toggle dispatches it).
		ctx.scope.on(window, 'resize', () => fitToCanvas());

		return {
			pause:   () => pauseGame(),
			resume:  () => resumeGame(),
			restart: () => returnToMenu(),
			quit:    () => {
				if (raf) cancelAnimationFrame(raf);
				if (renderer) renderer.dispose();
			},
		};
	},
};
