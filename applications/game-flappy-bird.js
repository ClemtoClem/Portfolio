export const gameFlappyBirdApp = {
	id: 'game-flappy-bird',
	title: 'Flappy Bird',
	icon: `<svg viewBox="0 -4 91 91" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Group_8" data-name="Group 8" transform="translate(-286 -709)"> <path id="Path_55" data-name="Path 55" d="M344,768l23.669-23.669L344,720.663" fill="#ff7800" stroke="#2d4168" stroke-linejoin="round" stroke-width="4"></path> <path id="Path_56" data-name="Path 56" d="M321,711c-.755,0-1.5.034-2.243.084a23.007,23.007,0,0,1-30.673,30.673c-.05.742-.084,1.488-.084,2.243a33,33,0,1,0,33-33Z" fill="#f6d32d" stroke="#2d4168" stroke-linejoin="round" stroke-width="4"></path> <g id="Group_4" data-name="Group 4"> <path id="Path_57" data-name="Path 57" d="M354,721a22.939,22.939,0,0,0-8.026,1.442,32.966,32.966,0,0,1,0,43.116A23,23,0,1,0,354,721Z" fill="none"></path> </g> <line id="Line_17" data-name="Line 17" y2="13" transform="translate(321 777)" fill="none" stroke="#2d4168" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"></line> <line id="Line_18" data-name="Line 18" x2="13" transform="translate(321 790)" fill="none" stroke="#2d4168" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"></line> <path id="Path_60" data-name="Path 60" d="M345.974,722.442a23.005,23.005,0,0,0,0,43.116,32.966,32.966,0,0,0,0-43.116Z" fill="#ffffff" stroke="#2d4168" stroke-miterlimit="10" stroke-width="4"></path> </g> </g></svg>`,
	iconColor: '#ff6b6b',
	headerColor: '#ff6b6b',
	type: 'game',
	content: `
		<div class="game-container">
			<div class="game-score">Score: <span id="flappy-bird-score">0</span></div>
			<div class="game-extra-controls">
				<button id="flappy-bird-pause-btn" class="pause-btn">Pause</button>
				<button id="flappy-bird-restart-btn">Restart</button>
			</div>

			<canvas id="flappy-canvas" class="game-canvas"></canvas>

			<div id="flappy-controls" class="game-controls">
				<button class="up" id="flappy-flap-btn">Flap</button>
			</div>
			<small>Appuie sur <strong>ESPACE</strong> ou clique / tape pour battre des ailes</small>
		</div>
	`,
	init: function (windowId) {
		const $window = $(`#${windowId}`);
		/** @type {HTMLCanvasElement} */
		const canvas = $window.find('#flappy-canvas')[0];
		const scoreEl = $window.find('#flappy-bird-score')[0];
		const pauseBtn = $window.find('#flappy-bird-pause-btn')[0];
		const restartBtn = $window.find('#flappy-bird-restart-btn')[0];
		const flapBtn = $window.find('#flappy-flap-btn')[0];

		// Canvas setup & scaling for high-DPI
        /** @type {CanvasRenderingContext2D} */
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
		let gameDirection = 1;
		const powerUpChance = 0.05; // 5% de chance qu'un tuyau soit un inverseur

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
			ctx.save();
			ctx.fillStyle = 'rgba(0,0,0,0.25)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = '#fff';
			ctx.font = 'bold 30px sans-serif';
			ctx.textAlign = 'center';
			ctx.fillText('Ready?', canvas.width / 2, canvas.height / 2 - 10);
			ctx.font = '16px sans-serif';
			ctx.fillText('Flap to Start', canvas.width / 2, canvas.height / 2 + 24);
			ctx.restore();
		}

		function drawGameOverMessage() {
			ctx.save();
			ctx.fillStyle = 'rgba(0,0,0,0.65)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = 'white';
			ctx.font = `${Math.floor(canvas.width / 12)}px Roboto`;
			ctx.textAlign = 'center';
			ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 10);
			ctx.font = `${Math.floor(canvas.width / 20)}px Roboto`;
			ctx.fillText(`Score: ${score} — Press Restart or flap to play`, canvas.width / 2, canvas.height / 2 + 30);
			ctx.restore();
		}

		function drawPausedMessage() {
			ctx.save();
			ctx.fillStyle = 'rgba(0,0,0,0.45)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = 'white';
			ctx.font = `${Math.floor(canvas.width / 15)}px Roboto`;
			ctx.textAlign = 'center';
			ctx.fillText('Paused', canvas.width / 2, canvas.height / 2);
			ctx.restore();
		}

		// Helpers
		function resetGame() {
			score = 0;
			isGameOver = false;
			running = false;
			gameDirection = 1;
			bird.x = 80;
			bird.y = (canvas.height / dpr) / 2;
			bird.vel = 0;
			bird.rotation = 0;
			pipes.length = 0;
			lastPipeTime = 0;
			lastTime = performance.now();
			updateScoreEl();

			// Mettre à jour le bouton pause pour refléter l'état "prêt"
			pauseBtn.textContent = 'Resume';
			pauseBtn.classList.add('paused');

			spawnPipe(true); // Spawner le premier tuyau pour l'écran "Ready", non-inverseur
			draw(); // Dessiner la frame initiale
			drawReadyMessage(); // Afficher "Ready"
		}

		function updateScoreEl() {
			if (scoreEl) scoreEl.textContent = `${score}`;
		}

		function spawnPipe(forceNormal = false) {
			const canvasW = canvas.width / dpr;
			const canvasH = canvas.height / dpr;
			const margin = 40;
			const gapCenter = margin + Math.random() * (canvasH - ground.height - margin * 2 - pipeGap) + pipeGap / 2;
			const top = gapCenter - pipeGap / 2;
			const bottom = gapCenter + pipeGap / 2;

			// Déterminer si ce tuyau est un inverseur
			const isReverser = !forceNormal && Math.random() < powerUpChance;

			pipes.push({
				x: gameDirection === 1 ? canvasW + 20 : -pipeWidth - 20, // Position de départ selon la direction
				top: top,
				bottom: bottom,
				passed: false,
				isReverser: isReverser
			});
		}

		// Logique de démarrage/reprise simplifiée dans `flap()`
		function flap() {
			if (isGameOver) {
				resetGame();
				return;
			}

			if (!running) {
				resumeGame();
			}

			if (running) {
				bird.vel = bird.flapStrength;
			}
		}

		// --- Pause / restart buttons ---
		function pauseGame() {
			// Ne pas pauser si le jeu n'a pas démarré ou est terminé
			if (isGameOver || !running) {
				return;
			}

			// Le jeu est en cours, on le met en pause
			running = false;
			pauseBtn.textContent = 'Resume';
			pauseBtn.classList.add('paused');
			drawPausedMessage(); // Afficher le message de pause
		}

		function resumeGame() {
			// On ne peut reprendre que si le jeu est en pause (running=false) ET non game-over
			if (!running && !isGameOver) {
				running = true;

				pauseBtn.textContent = 'Pause';
				pauseBtn.classList.remove('paused');

				lastTime = performance.now(); // Réinitialiser le timer
				lastPipeTime = lastTime; // Assurer que le spawn de tuyaux commence maintenant
				requestAnimationFrame(loop); // Relancer la boucle
			}
		}

		function togglePause() {
			if (isGameOver) return;
			if (!running) {
				resumeGame();
			} else {
				pauseGame();
			}
		}

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
				p.x -= movePx * gameDirection; // Mouvement selon la direction du jeu

				// Vérifier le passage pour le score
				// La logique de score doit aussi s'adapter à la direction
				const birdFront = bird.x + bird.radius;
				const birdBack = bird.x - bird.radius;

				if (!p.passed) {
					if (gameDirection === 1) { // Direction normale (gauche)
						if (p.x + pipeWidth < birdBack) { // Tuyau passé à gauche de l'oiseau
							p.passed = true;
							score += 1;
							updateScoreEl();
						}
					} else { // Direction inversée (droite)
						if (p.x > birdFront) { // Tuyau passé à droite de l'oiseau
							p.passed = true;
							score += 1;
							updateScoreEl();
						}
					}
				}

				// Supprimer les tuyaux hors écran
				const canvasW = canvas.width / dpr;
				if (gameDirection === 1 && p.x + pipeWidth < -50) pipes.splice(i, 1);
				if (gameDirection === -1 && p.x > canvasW + 50) pipes.splice(i, 1);
			}

			// Collisions with pipes
			const birdX = bird.x;
			const birdY = bird.y;
			for (const p of pipes) {
				const canvasH = canvas.height / dpr;
				// Collision avec la partie supérieure du tuyau
				const hitTop = circleRectCollision(birdX, birdY, bird.radius, p.x, 0, pipeWidth, p.top);
				// Collision avec la partie inférieure du tuyau
				const hitBottom = circleRectCollision(birdX, birdY, bird.radius, p.x, p.bottom, pipeWidth, canvasH - p.bottom - ground.height);

				if (hitTop || hitBottom) {
					gameOver();
					return;
				}

				// Détection de passage à travers le tube inverseur
				// L'oiseau doit être DANS la zone X du tuyau ET entre le top et le bottom
				if (p.isReverser && !p.activated &&
					birdX > p.x && birdX < p.x + pipeWidth &&
					birdY > p.top && birdY < p.bottom) {

					p.activated = true; // Empêcher l'activation multiple par le même tuyau
					gameDirection *= -1; // Inverse la direction
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
			// Mettre à jour le bouton pause pour refléter l'état "Game Over"
			pauseBtn.textContent = 'Resume';
			pauseBtn.classList.add('paused');

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
				// Utiliser une couleur différente pour le tuyau inverseur
				ctx.fillStyle = p.isReverser ? '#3498db' : '#2ecc71'; // Bleu pour inverseur, vert pour normal
				ctx.fillRect(p.x, 0, pipeWidth, p.top);
				ctx.fillRect(p.x, p.bottom, pipeWidth, h - ground.height - p.bottom);

				ctx.fillStyle = p.isReverser ? '#2980b9' : '#27ae60'; // Couleur plus foncée pour le chapeau
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

			if (gameDirection === 1) {
				// === sens normal ===
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
			} else {
				// === sens inversé ===
				ctx.scale(-1, 1); // symétrie horizontale

				ctx.fillStyle = '#ffdf4a'; // body
				ctx.beginPath();
				ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
				ctx.fill();

				ctx.fillStyle = '#f6c85f'; // wing
				ctx.beginPath();
				ctx.ellipse(-4, 4, 6, 3.5, -0.6, 0, Math.PI * 2);
				ctx.fill();

				ctx.fillStyle = '#000'; // eye (placé à gauche maintenant)
				ctx.beginPath();
				ctx.arc(6, -4, 3.2, 0, Math.PI * 2);
				ctx.fill();
			}

			ctx.restore();

			// HUD / niveau
			ctx.fillStyle = 'rgba(255,255,255,0.06)';
			ctx.fillRect(0, canvas.height, canvas.width, 12);
			ctx.fillStyle = '#fff';
			ctx.font = `16px Roboto`;
			ctx.textAlign = 'right';
			ctx.fillText(`Score: ${score}`, canvas.width - 8, canvas.height - 12);

		}

		// --- Main loop ---
		function loop(now) {
			if (!running) {
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

		// --- Écouteurs d'événements ---

		// Mise à jour des IDs des boutons
		pauseBtn.addEventListener('click', togglePause);
		restartBtn.addEventListener('click', resetGame);

		canvas.addEventListener('mousedown', () => flap());
		canvas.addEventListener('touchstart', (e) => { e.preventDefault(); flap(); }, { passive: false });
		flapBtn.addEventListener('click', () => flap());

		const keyHandler = (e) => {
			// S'assurer que l'app est active
			if (!document.body.contains(canvas)) return;

			if (e.key === 'p' || e.key === 'P') {
				e.preventDefault();
				togglePause();
				return;
			}
			if (e.key === ' ') { // space
				e.preventDefault();
				flap();
			}
			if (e.key === 'r' || e.key === 'R') {
				e.preventDefault();
				resetGame();
			}
		};
		document.addEventListener('keydown', keyHandler);

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
			pause: () => { pauseGame(); },
			resume: () => { resumeGame(); },
			restart: () => { resetGame(); }
		};
	}
};