const VERSION = '1.1.0';

const STRINGS = {
	'en-US': { play: 'PLAY', menu: 'Menu', score: 'Score', ready: 'Ready?', flapToStart: 'Flap to Start', paused: 'Paused', gameOver: 'Game Over', restart: 'Restart', pause: 'Pause', resume: 'Resume', hint: 'Press SPACE or click/tap to flap' },
	'fr-FR': { play: 'JOUER', menu: 'Menu', score: 'Score', ready: 'Prêt ?', flapToStart: 'Bats des ailes pour démarrer', paused: 'Pause', gameOver: 'Game Over', restart: 'Recommencer', pause: 'Pause', resume: 'Reprendre', hint: 'Appuie sur ESPACE ou clique pour battre des ailes' },
};

const MENU_SVG = `<svg viewBox="0 0 24 24"><path d="M4 5C3.45 5 3 5.45 3 6s.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4zm0 6c-.55 0-1 .45-1 1s.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4zm0 6c-.55 0-1 .45-1 1s.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4z"/></svg>`;
const REFRESH_SVG = `<svg viewBox="0 0 100 100"><path d="M76.5,58.3c-2.8,7.8-10.2,13.3-18.9,13.3-11.1,0-20.1-9-20.1-20.1s9-20.1,20.1-20.1c6.6,0,12.6,3.3,16.2,8.3-.3.5-.9.7-1.7.7H53.6c-1.1,0-2,.9-2,2v4.2c0,1.1.8,1.9,1.9,1.9h17.9c1,0,1.8-.9,1.8-1.8V22c0-1.1-1.1-2-2.2-2h-4c-1.1,0-2,.9-2,2v3c0,1.2-.7,1.7-1.6.9-.4-.5-.7-.8-1.2-1.2-1.6-1.7-3.5-3.2-5.6-4.4-4.3-2.5-9.3-4-14.6-4C32.8,16.3,20,29,20,44.9c0,15.8,12.8,28.5,28.6,28.5,2.6,0,5.2-.4,7.7-1.1,2.5-.7,4.8-1.7,7-3,2.2-1.3,4.2-2.9,5.9-4.7,1.8-1.8,3.3-3.8,4.5-6,.6-1.1,1.1-2.2,1.6-3.4z"/></svg>`;

function html(s) {
	return `
		<div class="game-container">
			<div id="flappy-menu" class="game-menu-screen">
				<h1 class="game-title">Flappy Bird</h1>
				<div class="game-version">Version ${VERSION}</div>
				<button id="flappy-play" class="game-btn">${s.play}</button>
			</div>
			<div id="flappy-game" class="game-content" style="display:none;">
				<div class="game-header">
					<div class="game-top-row">
						<button class="game-action-btn" id="flappy-exit">${MENU_SVG} ${s.menu}</button>
						<div class="game-score">${s.score}: <span id="flappy-score">0</span></div>
						<button class="game-action-btn" id="flappy-pause">${s.pause}</button>
						<button class="game-action-btn" id="flappy-restart">${REFRESH_SVG}</button>
					</div>
				</div>
				<div class="game-main">
					<div class="game-canvas-wrapper">
						<canvas id="flappy-canvas" class="game-canvas"></canvas>
					</div>
					<div id="flappy-controls" class="game-controls">
						<button class="up" id="flappy-flap">Flap</button>
					</div>
				</div>
				<div class="game-footer">
					<small>${s.hint}</small>
				</div>
			</div>
		</div>
	`;
}

export const gameFlappyBirdApp = {
	id: 'game-flappy-bird',
	title: 'Flappy Bird',
	version: VERSION,
	icon: `<svg viewBox="0 -4 91 91" fill="#000000"><g id="bgCarrier" stroke-width="0"></g><g id="tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="iconCarrier"> <g id="Group_8" data-name="Group 8" transform="translate(-286 -709)"> <path id="Path_55" data-name="Path 55" d="M344,768l23.669-23.669L344,720.663" fill="#ff7800" stroke="#2d4168" stroke-linejoin="round" stroke-width="4"></path> <path id="Path_56" data-name="Path 56" d="M321,711c-.755,0-1.5.034-2.243.084a23.007,23.007,0,0,1-30.673,30.673c-.05.742-.084,1.488-.084,2.243a33,33,0,1,0,33-33Z" fill="#f6d32d" stroke="#2d4168" stroke-linejoin="round" stroke-width="4"></path> <g id="Group_4" data-name="Group 4"> <path id="Path_57" data-name="Path 57" d="M354,721a22.939,22.939,0,0,0-8.026,1.442,32.966,32.966,0,0,1,0,43.116A23,23,0,1,0,354,721Z" fill="none"></path> </g> <line id="Line_17" data-name="Line 17" y2="13" transform="translate(321 777)" fill="none" stroke="#2d4168" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"></line> <line id="Line_18" data-name="Line 18" x2="13" transform="translate(321 790)" fill="none" stroke="#2d4168" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"></line> <path id="Path_60" data-name="Path 60" d="M345.974,722.442a23.005,23.005,0,0,0,0,43.116,32.966,32.966,0,0,0,0-43.116Z" fill="#ffffff" stroke="#2d4168" stroke-miterlimit="10" stroke-width="4"></path> </g> </g></svg>`,
	iconColor: '#ff6b6b',
	headerColor: '#ff6b6b',
	type: 'game',
	style: `
		:root {
			--primary-color: #ff6b6b;
			--primary-dark-color: #c21212;
			--primary-background-color: #fdb7b7;
		}
		.app-content { padding: 0; }
		.paused { opacity: 0.7; }
	`,
	content: { 'en-US': html(STRINGS['en-US']), 'fr-FR': html(STRINGS['fr-FR']) },

	onMount(ctx) {
		const strings = STRINGS[ctx.lang] || STRINGS['fr-FR'];

		const ui = {
			menu:    ctx.$('#flappy-menu'),
			game:    ctx.$('#flappy-game'),
			canvas:  ctx.$('#flappy-canvas'),
			score:   ctx.$('#flappy-score'),
			btnPlay: ctx.$('#flappy-play'),
			btnExit: ctx.$('#flappy-exit'),
			btnPause:ctx.$('#flappy-pause'),
			btnRestart: ctx.$('#flappy-restart'),
			btnFlap: ctx.$('#flappy-flap'),
		};

		const canvas = ui.canvas;
		const cctx = canvas.getContext('2d');
		let dpr = Math.max(1, window.devicePixelRatio || 1);

		let running = false, isGameOver = false, score = 0, gameDirection = 1;
		const POWER_UP_CHANCE = 0.05;

		const bird = { x: 80, y: 200, radius: 14, vel: 0, gravity: 0.9, flapStrength: -12, maxDrop: 14, rotation: 0 };
		const pipes = [];
		const pipeWidth = 60, pipeGap = 150, pipeSpawnInterval = 1500, pipeSpeed = 140;
		const ground = { height: 60 };
		let lastPipeTime = 0;
		let lastTime = performance.now();
		let rafId = null;

		function resize() {
			const r = canvas.getBoundingClientRect();
			canvas.width = Math.max(1, Math.round(r.width * dpr));
			canvas.height = Math.max(1, Math.round(r.height * dpr));
			cctx.setTransform(1, 0, 0, 1, 0, 0); // reset
			cctx.scale(dpr, dpr);
		}
		const obs = new ResizeObserver(() => { resize(); if (!running) { draw(); if (isGameOver) overlay(strings.gameOver, `${strings.score}: ${score}`); else overlay(strings.ready, strings.flapToStart); } });
		obs.observe(canvas);
		ctx.scope.observe(obs);

		const W = () => canvas.width  / dpr;
		const H = () => canvas.height / dpr;

		function overlay(title, sub = '') {
			cctx.save();
			cctx.fillStyle = 'rgba(0,0,0,0.45)';
			cctx.fillRect(0, 0, W(), H());
			cctx.fillStyle = '#fff';
			cctx.textAlign = 'center';
			cctx.font = `bold ${Math.floor(W() / 12)}px sans-serif`;
			cctx.fillText(title, W() / 2, H() / 2 - 10);
			if (sub) {
				cctx.font = `${Math.floor(W() / 22)}px sans-serif`;
				cctx.fillText(sub, W() / 2, H() / 2 + 24);
			}
			cctx.restore();
		}

		function reset() {
			score = 0;
			isGameOver = false;
			running = false;
			gameDirection = 1;
			bird.x = 80; bird.y = H() / 2; bird.vel = 0; bird.rotation = 0;
			pipes.length = 0;
			lastPipeTime = 0;
			lastTime = performance.now();
			ui.score.textContent = '0';
			ui.btnPause.textContent = strings.resume;
			ui.btnPause.classList.add('paused');
			spawnPipe(true);
			draw();
			overlay(strings.ready, strings.flapToStart);
		}

		function spawnPipe(forceNormal = false) {
			const margin = 40;
			const h = H();
			const gapCenter = margin + Math.random() * (h - ground.height - margin * 2 - pipeGap) + pipeGap / 2;
			const top = gapCenter - pipeGap / 2;
			const bottom = gapCenter + pipeGap / 2;
			const isReverser = !forceNormal && Math.random() < POWER_UP_CHANCE;
			pipes.push({
				x: gameDirection === 1 ? W() + 20 : -pipeWidth - 20,
				top, bottom,
				passed: false,
				isReverser,
			});
		}

		function flap() {
			if (isGameOver) { reset(); return; }
			if (!running) resumeGame();
			if (running) bird.vel = bird.flapStrength;
		}

		function resumeGame() {
			if (running || isGameOver) return;
			running = true;
			ui.btnPause.textContent = strings.pause;
			ui.btnPause.classList.remove('paused');
			lastTime = performance.now();
			lastPipeTime = lastTime;
			rafId = requestAnimationFrame(loop);
		}

		function pauseGame() {
			if (!running || isGameOver) return;
			running = false;
			ui.btnPause.textContent = strings.resume;
			ui.btnPause.classList.add('paused');
			overlay(strings.paused);
		}

		const togglePause = () => running ? pauseGame() : resumeGame();

		function circleRect(cx, cy, r, rx, ry, rw, rh) {
			const x = Math.max(rx, Math.min(cx, rx + rw));
			const y = Math.max(ry, Math.min(cy, ry + rh));
			const dx = cx - x, dy = cy - y;
			return (dx * dx + dy * dy) < (r * r);
		}

		function update(dt) {
			if (isGameOver) return;
			bird.vel = Math.min(bird.vel + bird.gravity * (dt / 16.6667), bird.maxDrop);
			bird.y += bird.vel * (dt / 16.6667);
			bird.rotation = Math.max(-0.6, Math.min(1.2, bird.vel / 20));

			const now = performance.now();
			if (now - lastPipeTime > pipeSpawnInterval) { spawnPipe(); lastPipeTime = now; }

			const movePx = pipeSpeed * (dt / 1000);
			for (let i = pipes.length - 1; i >= 0; i--) {
				const p = pipes[i];
				p.x -= movePx * gameDirection;
				if (!p.passed) {
					if (gameDirection === 1 ? p.x + pipeWidth < bird.x - bird.radius : p.x > bird.x + bird.radius) {
						p.passed = true;
						score++;
						ui.score.textContent = String(score);
					}
				}
				if ((gameDirection === 1 && p.x + pipeWidth < -50) ||
					(gameDirection === -1 && p.x > W() + 50)) pipes.splice(i, 1);
			}

			for (const p of pipes) {
				const hitTop = circleRect(bird.x, bird.y, bird.radius, p.x, 0, pipeWidth, p.top);
				const hitBot = circleRect(bird.x, bird.y, bird.radius, p.x, p.bottom, pipeWidth, H() - p.bottom - ground.height);
				if (hitTop || hitBot) return gameOver();
				if (p.isReverser && !p.activated &&
					bird.x > p.x && bird.x < p.x + pipeWidth &&
					bird.y > p.top && bird.y < p.bottom) {
					p.activated = true;
					gameDirection *= -1;
				}
			}

			if (bird.y - bird.radius < 0) { bird.y = bird.radius; bird.vel = 0; }
			if (bird.y + bird.radius > H() - ground.height) {
				bird.y = H() - ground.height - bird.radius;
				gameOver();
			}
		}

		function gameOver() {
			isGameOver = true;
			running = false;
			ui.btnPause.textContent = strings.resume;
			ui.btnPause.classList.add('paused');
			overlay(strings.gameOver, `${strings.score}: ${score}`);
		}

		function draw() {
			const w = W(), h = H();
			cctx.clearRect(0, 0, w, h);
			const grad = cctx.createLinearGradient(0, 0, 0, h);
			grad.addColorStop(0, '#70c5ce');
			grad.addColorStop(1, '#9be7ff');
			cctx.fillStyle = grad;
			cctx.fillRect(0, 0, w, h);

			for (const p of pipes) {
				cctx.fillStyle = p.isReverser ? '#3498db' : '#2ecc71';
				cctx.fillRect(p.x, 0, pipeWidth, p.top);
				cctx.fillRect(p.x, p.bottom, pipeWidth, h - ground.height - p.bottom);
				cctx.fillStyle = p.isReverser ? '#2980b9' : '#27ae60';
				cctx.fillRect(p.x - 6, p.top - 12, pipeWidth + 12, 12);
				cctx.fillRect(p.x - 6, p.bottom, pipeWidth + 12, 12);
			}

			cctx.fillStyle = '#DEB887';
			cctx.fillRect(0, h - ground.height, w, ground.height);

			cctx.save();
			cctx.translate(bird.x, bird.y);
			cctx.rotate(bird.rotation);
			if (gameDirection === -1) cctx.scale(-1, 1);
			cctx.fillStyle = '#ffdf4a';
			cctx.beginPath(); cctx.arc(0, 0, bird.radius, 0, Math.PI * 2); cctx.fill();
			cctx.fillStyle = '#f6c85f';
			cctx.beginPath(); cctx.ellipse(-4, 4, 6, 3.5, -0.6, 0, Math.PI * 2); cctx.fill();
			cctx.fillStyle = '#000';
			cctx.beginPath(); cctx.arc(6, -4, 3.2, 0, Math.PI * 2); cctx.fill();
			cctx.restore();
		}

		function loop(now) {
			if (!running) return;
			const dt = now - lastTime;
			lastTime = now;
			update(dt);
			draw();
			rafId = requestAnimationFrame(loop);
		}

		// Events
		ctx.scope.on(ui.btnPlay,    'click', () => { ui.menu.style.display = 'none'; ui.game.style.display = ''; resize(); reset(); });
		ctx.scope.on(ui.btnExit,    'click', () => { ui.menu.style.display = ''; ui.game.style.display = 'none'; running = false; if (rafId) cancelAnimationFrame(rafId); });
		ctx.scope.on(ui.btnPause,   'click', togglePause);
		ctx.scope.on(ui.btnRestart, 'click', reset);
		ctx.scope.on(ui.btnFlap,    'click', flap);
		ctx.scope.on(canvas, 'pointerdown', flap);
		ctx.scope.on(document, 'keydown', (e) => {
			if (!ctx.root.isConnected) return;
			if (e.code === 'Space') { e.preventDefault(); flap(); }
			else if (e.key === 'p' || e.key === 'P') togglePause();
			else if (e.key === 'r' || e.key === 'R') reset();
		});

		resize();
		reset();
		return {
			pause: pauseGame,
			resume: resumeGame,
			restart: reset,
			quit: () => { if (rafId) cancelAnimationFrame(rafId); },
		};
	}
};
