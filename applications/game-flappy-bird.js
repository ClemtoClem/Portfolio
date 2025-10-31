export const gameFlappyBirdApp = {
	id: 'game-flappy-bird',
	title: 'Flappy Bird',
	icon: `<svg width="64px" height="64px" viewBox="0 -4 91 91" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Group_8" data-name="Group 8" transform="translate(-286 -709)"> <path id="Path_55" data-name="Path 55" d="M344,768l23.669-23.669L344,720.663" fill="#ff7800" stroke="#2d4168" stroke-linejoin="round" stroke-width="4"></path> <path id="Path_56" data-name="Path 56" d="M321,711c-.755,0-1.5.034-2.243.084a23.007,23.007,0,0,1-30.673,30.673c-.05.742-.084,1.488-.084,2.243a33,33,0,1,0,33-33Z" fill="#f6d32d" stroke="#2d4168" stroke-linejoin="round" stroke-width="4"></path> <g id="Group_4" data-name="Group 4"> <path id="Path_57" data-name="Path 57" d="M354,721a22.939,22.939,0,0,0-8.026,1.442,32.966,32.966,0,0,1,0,43.116A23,23,0,1,0,354,721Z" fill="none"></path> </g> <line id="Line_17" data-name="Line 17" y2="13" transform="translate(321 777)" fill="none" stroke="#2d4168" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"></line> <line id="Line_18" data-name="Line 18" x2="13" transform="translate(321 790)" fill="none" stroke="#2d4168" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"></line> <path id="Path_60" data-name="Path 60" d="M345.974,722.442a23.005,23.005,0,0,0,0,43.116,32.966,32.966,0,0,0,0-43.116Z" fill="#ffffff" stroke="#2d4168" stroke-miterlimit="10" stroke-width="4"></path> </g> </g></svg>`,
	iconColor: '#ff6b6b',
	headerColor: '#ff6b6b',
	type: 'game',
	content: `
	  <div class="game-container" style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:8px;">
		<div style="display:flex;align-items:center;gap:12px;width:100%;justify-content:space-between;">
		  <div>
			<strong>Flappy Bird</strong>
		  </div>
		  <div style="display:flex;align-items:center;gap:8px;">
			<span id="flappy-bird-score" style="font-weight:bold">Score: 0</span>
		  </div>
		</div>

		<div style="position:relative;width:100%;max-width:600px;">
		  <!-- Hauteur fixe retirée, remplacée par une hauteur adaptative et max -->
		  <canvas id="flappy-canvas" class="game-canvas" style="width:100%; height: 70vh; max-height: 450px; background:#70c5ce;border-radius:8px;display:block;"></canvas>

		  <div style="position:absolute;left:8px;top:8px;display:flex;flex-direction:column;gap:6px;">
			<button id="flappy-bird-pause-btn" class="pause-btn" style="padding:6px 10px;border-radius:6px;">Pause</button>
			<button id="flappy-bird-restart-btn" style="padding:6px 10px;border-radius:6px;">Restart</button>
		  </div>
		</div>

		<div id="flappy-controls" class="game-controls" style="display:flex;flex-direction:column;gap:8px;align-items:center;">
		  <button id="flappy-flap-btn" style="padding:8px 12px;border-radius:6px;">Flap (Space / Click)</button>
		  <small>Appuie sur <strong>ESPACE</strong> ou clique / tape pour battre des ailes</small>
		</div>
	  </div>
	`,
	init: function (windowId) {
		const $window = $(`#${windowId}`);
		const canvas = $window.find('#flappy-canvas')[0];
		const scoreEl = $window.find('#flappy-bird-score')[0];
		const pauseBtn = $window.find('#flappy-bird-pause-btn')[0];
		const restartBtn = $window.find('#flappy-bird-restart-btn')[0];
		const flapBtn = $window.find('#flappy-flap-btn')[0];

		// Canvas setup & scaling for high-DPI
		const ctx = canvas.getContext('2d');
		let dpr = window.devicePixelRatio || 1;

		function resizeCanvas() {
			const rect = canvas.getBoundingClientRect();
			dpr = window.devicePixelRatio || 1;
			canvas.width = Math.max(300, Math.floor(rect.width * dpr));
			canvas.height = Math.max(200, Math.floor(rect.height * dpr));
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		}
		resizeCanvas();
		// Recalculer la taille si la fenêtre du navigateur change
		const resizeObserver = new ResizeObserver(() => {
			resizeCanvas();
			// Redessiner l'état actuel (ready, paused, gameover) après redimensionnement
			if (!running) {
				draw();
				if (isGameOver) {
					drawGameOverMessage();
				} else if (!running) {
					// Redessiner le message "Ready"
					drawReadyMessage();
				}
			}
		});
		resizeObserver.observe(canvas);


		// Game state
		let running = false; // <-- NE PAS DÉMARRER AUTOMATIQUEMENT
		let isGameOver = false;
		let score = 0;

		// Bird physics
		const bird = {
			x: 80,
			y: 200,
			radius: 14,
			vel: 0,
			gravity: 0.9,
			flapStrength: -12,
			maxDrop: 14,
			rotation: 0
		};

		// Pipes
		const pipes = [];
		const pipeWidth = 60;
		const pipeGap = 150;
		const pipeSpawnInterval = 1500; // ms
		let lastPipeTime = 0;
		const pipeSpeed = 140; // px/sec

		// Ground
		const ground = {
			height: 60
		};

		// Timing
		let lastTime = performance.now();

		// --- MESSAGES OVERLAY ---
		function drawReadyMessage() {
			const w = canvas.width / dpr;
			const h = canvas.height / dpr;
			ctx.save();
			ctx.fillStyle = 'rgba(0,0,0,0.25)';
			ctx.fillRect(0, 0, w, h);
			ctx.fillStyle = '#fff';
			ctx.font = 'bold 30px sans-serif';
			ctx.textAlign = 'center';
			ctx.fillText('Ready?', w / 2, h / 2 - 10);
			ctx.font = '16px sans-serif';
			ctx.fillText('Flap to Start', w / 2, h / 2 + 24);
			ctx.restore();
		}

		function drawGameOverMessage() {
			const w = canvas.width / dpr;
			const h = canvas.height / dpr;
			ctx.save();
			ctx.fillStyle = 'rgba(0,0,0,0.45)';
			ctx.fillRect(0, 0, w, h);
			ctx.fillStyle = '#fff';
			ctx.font = 'bold 30px sans-serif';
			ctx.textAlign = 'center';
			ctx.fillText('Game Over', w / 2, h / 2 - 10);
			ctx.font = '16px sans-serif';
			ctx.fillText(`Score: ${score} — Press Restart or flap to play`, w / 2, h / 2 + 24);
			ctx.restore();
		}

		function drawPausedMessage() {
			const w = canvas.width / dpr;
			const h = canvas.height / dpr;
			ctx.save();
			ctx.fillStyle = 'rgba(0,0,0,0.25)';
			ctx.fillRect(0, 0, w, h);
			ctx.fillStyle = '#fff';
			ctx.font = 'bold 40px sans-serif';
			ctx.textAlign = 'center';
			ctx.fillText('Paused', w / 2, h / 2);
			ctx.restore();
		}

		// Helpers
		function resetGame() {
			score = 0;
			isGameOver = false;
			running = false; // <-- NE PAS DÉMARRER
			bird.x = 80;
			bird.y = (canvas.height / dpr) / 2;
			bird.vel = 0;
			bird.rotation = 0;
			pipes.length = 0;
			lastPipeTime = 0;
			lastTime = performance.now();
			updateScoreEl();
			pauseBtn.textContent = 'Pause';

			spawnPipe(); // Spawner le premier tuyau pour l'écran "Ready"
			draw(); // Dessiner la frame initiale
			drawReadyMessage(); // Afficher "Ready"
		}

		function updateScoreEl() {
			if (scoreEl) scoreEl.textContent = `Score: ${score}`;
		}

		function spawnPipe() {
			const canvasH = canvas.height / dpr;
			const margin = 40;
			const gapCenter = margin + Math.random() * (canvasH - ground.height - margin * 2 - pipeGap) + pipeGap / 2;
			const top = gapCenter - pipeGap / 2;
			const bottom = gapCenter + pipeGap / 2;
			pipes.push({
				x: (canvas.width / dpr) + 20,
				top: top,
				bottom: bottom,
				passed: false
			});
		}

		function flap() {
			if (isGameOver) {
				resetGame(); // Revenir à l'écran "Ready"
				return;
			}
			if (!running) {
				// C'est le premier flap, démarrer le jeu
				running = true;
				lastTime = performance.now();
				lastPipeTime = lastTime; // Commencer à spawner les tuyaux maintenant
				requestAnimationFrame(loop); // DÉMARRER LA BOUCLE
			}
			bird.vel = bird.flapStrength;
		}

		// --- Input handlers ---
		const keyHandler = (e) => {
			if (!document.body.contains(canvas)) return; // Ne pas écouter si l'app est fermée
			if (e.code === 'Space') {
				e.preventDefault();
				flap();
			} else if (e.code === 'KeyP') {
				togglePause();
			}
		};
		document.addEventListener('keydown', keyHandler);

		canvas.addEventListener('mousedown', () => flap());
		canvas.addEventListener('touchstart', (e) => { e.preventDefault(); flap(); }, { passive: false });
		if (flapBtn) flapBtn.addEventListener('click', () => flap());

		// --- Pause / restart buttons ---
		function togglePause() {
			// Ne pas pauser si le jeu n'a pas démarré ou est terminé
			if (isGameOver || !running) {
				return;
			}

			// Le jeu est en cours, on le met en pause
			running = false;
			pauseBtn.textContent = 'Resume';
			drawPausedMessage(); // Afficher le message de pause
		}

		function resumeGame() {
			// On ne peut reprendre que si le jeu est en pause (running=false) ET non game-over
			if (!running && !isGameOver) {
				running = true;
				pauseBtn.textContent = 'Pause';
				lastTime = performance.now(); // Réinitialiser le timer
				requestAnimationFrame(loop); // Relancer la boucle
			}
		}

		if (pauseBtn) pauseBtn.addEventListener('click', () => {
			if (running) {
				togglePause(); // Met en pause
			} else {
				resumeGame(); // Tente de reprendre
			}
		});
		if (restartBtn) restartBtn.addEventListener('click', () => resetGame());

		// Collision detection (circle vs rect)
		function circleRectCollision(cx, cy, r, rx, ry, rw, rh) {
			const closestX = Math.max(rx, Math.min(cx, rx + rw));
			const closestY = Math.max(ry, Math.min(cy, ry + rh));
			const dx = cx - closestX;
			const dy = cy - closestY;
			return (dx * dx + dy * dy) < (r * r);
		}

		function update(dt) {
			if (isGameOver) return; // Ne devrait pas arriver si running=false

			// Bird physics
			bird.vel += bird.gravity * (dt / 16.6667); // normalize to ~60fps frame
			bird.vel = Math.min(bird.vel, bird.maxDrop);
			bird.y += bird.vel * (dt / 16.6667);
			bird.rotation = Math.max(-0.6, Math.min(1.2, bird.vel / 20));

			// Spawn pipes
			const now = performance.now();
			if (now - lastPipeTime > pipeSpawnInterval) {
				spawnPipe();
				lastPipeTime = now;
			}

			// Move pipes
			const movePx = pipeSpeed * (dt / 1000);
			for (let i = pipes.length - 1; i >= 0; i--) {
				const p = pipes[i];
				p.x -= movePx;

				// Check pass for scoring
				if (!p.passed && p.x + pipeWidth < bird.x - bird.radius) {
					p.passed = true;
					score += 1;
					updateScoreEl();
				}

				// Remove off-screen
				if (p.x + pipeWidth < -50) pipes.splice(i, 1);
			}

			// Collisions with pipes
			const birdX = bird.x;
			const birdY = bird.y;
			for (const p of pipes) {
				const canvasH = canvas.height / dpr;
				if (circleRectCollision(birdX, birdY, bird.radius, p.x, 0, pipeWidth, p.top) ||
					circleRectCollision(birdX, birdY, bird.radius, p.x, p.bottom, pipeWidth, canvasH - p.bottom - ground.height)) {
					gameOver();
					return;
				}
			}

			// Collisions with ground or ceiling
			const canvasH = canvas.height / dpr;
			if (birdY - bird.radius < 0) {
				bird.y = bird.radius;
				bird.vel = 0;
			}
			if (birdY + bird.radius > canvasH - ground.height) {
				bird.y = canvasH - ground.height - bird.radius;
				gameOver();
			}
		}

		function gameOver() {
			isGameOver = true;
			running = false;
			pauseBtn.textContent = 'Pause';
			drawGameOverMessage(); // Dessiner le message Game Over une fois
		}

		function draw() {
			const w = canvas.width / dpr;
			const h = canvas.height / dpr;

			// sky
			ctx.clearRect(0, 0, w, h);
			const g = ctx.createLinearGradient(0, 0, 0, h);
			g.addColorStop(0, '#70c5ce');
			g.addColorStop(1, '#9be7ff');
			ctx.fillStyle = g;
			ctx.fillRect(0, 0, w, h);

			// Pipes
			for (const p of pipes) {
				ctx.fillStyle = '#2ecc71'; // pipe body
				ctx.fillRect(p.x, 0, pipeWidth, p.top);
				ctx.fillRect(p.x, p.bottom, pipeWidth, h - ground.height - p.bottom);
				ctx.fillStyle = '#27ae60'; // pipe cap
				ctx.fillRect(p.x - 6, p.top - 12, pipeWidth + 12, 12);
				ctx.fillRect(p.x - 6, p.bottom, pipeWidth + 12, 12);
			}

			// Ground
			ctx.fillStyle = '#DEB887';
			ctx.fillRect(0, h - ground.height, w, ground.height);

			// Bird (circle + eye)
			ctx.save();
			ctx.translate(bird.x, bird.y);
			ctx.rotate(bird.rotation);
			ctx.fillStyle = '#ffdf4a'; // body
			ctx.beginPath();
			ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = '#f6c85f'; // wing
			ctx.beginPath();
			ctx.ellipse(-4, 4, 6, 3.5, -0.6, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = '#000'; // eye
			ctx.beginPath();
			ctx.arc(6, -4, 3.2, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();

			// Les messages (Pause, Game Over) sont dessinés par-dessus
			// par les fonctions qui changent l'état (togglePause, gameOver)
			// ou par resetGame (pour "Ready")
		}

		// --- Main loop ---
		function loop(now) {
			if (!running) {
				// Si on n'est pas "running", on ne fait rien.
				// Les états 'paused', 'gameover', 'ready' sont dessinés une fois
				// par la fonction qui les active.
				return;
			}

			const dt = now - lastTime;
			lastTime = now;

			update(dt);
			draw();

			// Continuer la boucle si on est toujours en cours
			if (running) {
				requestAnimationFrame(loop);
			}
		}

		// --- Start ---
		resetGame(); // Prépare le jeu et affiche l'écran "Ready"

		// Nettoyage lors de la fermeture
		const observer = new MutationObserver((mutations) => {
			if (!document.body.contains(canvas)) {
				running = false; // Arrêter la boucle
				document.removeEventListener('keydown', keyHandler);
				resizeObserver.disconnect();
				observer.disconnect();
			}
		});
		observer.observe(document.body, { childList: true, subtree: true });

		// Exposer l'API
		return {
			pause: () => { if (running) togglePause(); },
			resume: () => { resumeGame(); },
			restart: resetGame
		};
	}
};
