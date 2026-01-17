const VERSION = '1.0.0';
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
		.app-content { padding: 0px; }

		.paused { opacity: 0.7; }
	`,
	content: {
		'en-US':`
			<div class="game-container">
				<div id="game-main-menu" class="game-menu-screen">
					<h1 class="game-title">Flappy Bird</h1>
					<div class="game-version">Version ${VERSION}</div>
					<button id="game-play-btn" class="game-btn">PLAY</button>
				</div>
				<div id="game-content-flappy" class="game-content" style="display:none;">
					<div class="game-header">
						<div class="game-top-row">
							<button class="game-action-btn" id="game-exit-btn">
								<svg viewBox="0 0 24 24"><path d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12ZM3 18C3 17.4477 3.44772 17 4 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18Z"></path></svg>
								Menu
							</button>
							<div class="game-score">Score: <span id="flappy-bird-score">0</span></div>
							<button class="game-action-btn" id="pause-btn-flappy" title="Pause (P)">Pause</button>
							<button class="game-action-btn" id="restart-btn-flappy" title="Restart (R)">
								<svg viewBox="0 0 100 100"><path d="M76.5,58.3c0,0.1,0,0.2-0.1,0.2c-0.3,1.1-0.7,2.2-1.1,3.3c-0.5,1.2-1,2.3-1.6,3.4c-1.2,2.2-2.7,4.2-4.5,6 c-1.7,1.8-3.7,3.4-5.9,4.7c-2.2,1.3-4.5,2.3-7,3c-2.5,0.7-5.1,1.1-7.7,1.1C32.8,80,20,67.2,20,51.3s12.8-28.6,28.6-28.6 c5.3,0,10.3,1.5,14.6,4c0,0,0,0,0.1,0c2.1,1.2,4,2.7,5.6,4.4c0.5,0.4,0.8,0.7,1.2,1.2c0.9,0.8,1.6,0.3,1.6-0.9V22c0-1.1,0.9-2,2-2h4 c1.1,0,2,0.9,2.2,2v24.5c0,0.9-0.8,1.8-1.8,1.8H53.6c-1.1,0-1.9-0.8-1.9-1.9v-4.2c0-1.1,0.9-2,2-2h9.4c0.8,0,1.4-0.2,1.7-0.7 c-3.6-5-9.6-8.3-16.2-8.3c-11.1,0-20.1,9-20.1,20.1s9,20.1,20.1,20.1c8.7,0,16.1-5.5,18.9-13.3c0,0,0.3-1.8,1.7-1.8 c1.4,0,4.8,0,5.7,0c0.8,0,1.6,0.6,1.6,1.5C76.5,58,76.5,58.1,76.5,58.3z"></path></svg>
							</button>
						</div>
					</div>
					<div class="game-main">
						<div class="game-canvas-wrapper">
							<canvas id="canvas-flappy" class="game-canvas"></canvas>
						</div>
						<div id="controls-flappy" class="game-controls">
							<button class="up" id="flap-btn">Flap</button>
						</div>
					</div>
					<div class="game-footer">
						<small>Press <strong>SPACE</strong> or click/tap to flap your wings</small>
					<div>
				</div>
			</div>
		`,
		'fr-FR':`
			<div class="game-container">
				<div id="game-main-menu" class="game-menu-screen">
					<h1 class="game-title">Flappy Bird</h1>
					<div class="game-version">Version ${VERSION}</div>
					<button id="game-play-btn" class="game-btn">JOUER</button>
				</div>
				<div id="game-content-flappy" class="game-content" style="display:none;">
					<div class="game-header">
						<div class="game-top-row">
							<button class="game-action-btn" id="game-exit-btn">
								<svg viewBox="0 0 24 24"><path d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12ZM3 18C3 17.4477 3.44772 17 4 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18Z"></path></svg>
								Menu
							</button>
							<div class="game-score">Score: <span id="flappy-bird-score">0</span></div>
							<button class="game-action-btn" id="pause-btn-flappy" title="Pause (P)">Pause</button>
							<button class="game-action-btn" id="restart-btn-flappy" title="Redémarrer (R)">
								<svg viewBox="0 0 100 100"><path d="M76.5,58.3c0,0.1,0,0.2-0.1,0.2c-0.3,1.1-0.7,2.2-1.1,3.3c-0.5,1.2-1,2.3-1.6,3.4c-1.2,2.2-2.7,4.2-4.5,6 c-1.7,1.8-3.7,3.4-5.9,4.7c-2.2,1.3-4.5,2.3-7,3c-2.5,0.7-5.1,1.1-7.7,1.1C32.8,80,20,67.2,20,51.3s12.8-28.6,28.6-28.6 c5.3,0,10.3,1.5,14.6,4c0,0,0,0,0.1,0c2.1,1.2,4,2.7,5.6,4.4c0.5,0.4,0.8,0.7,1.2,1.2c0.9,0.8,1.6,0.3,1.6-0.9V22c0-1.1,0.9-2,2-2h4 c1.1,0,2,0.9,2.2,2v24.5c0,0.9-0.8,1.8-1.8,1.8H53.6c-1.1,0-1.9-0.8-1.9-1.9v-4.2c0-1.1,0.9-2,2-2h9.4c0.8,0,1.4-0.2,1.7-0.7 c-3.6-5-9.6-8.3-16.2-8.3c-11.1,0-20.1,9-20.1,20.1s9,20.1,20.1,20.1c8.7,0,16.1-5.5,18.9-13.3c0,0,0.3-1.8,1.7-1.8 c1.4,0,4.8,0,5.7,0c0.8,0,1.6,0.6,1.6,1.5C76.5,58,76.5,58.1,76.5,58.3z"></path></svg>
							</button>
						</div>
					</div>
					<div class="game-main">
						<div class="game-canvas-wrapper">
							<canvas id="canvas-flappy" class="game-canvas"></canvas>
						</div>
							
						<div id="controls-flappy" class="game-controls">
							<button class="up" id="flap-btn">Flap</button>
						</div>
					</div>
					<div class="game-footer">
						<small>Appuie sur <strong>ESPACE</strong> ou clique / tape pour battre des ailes</small>
					</div>
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

		// --- DICTIONNAIRE D'ÉLÉMENTS UI ---
        const ui = {
            screens: {
                menu: $window.find('#game-main-menu'),
                game: $window.find('#game-content-flappy')
            },
            game: {
                canvas: $window.find('#canvas-flappy')[0],
                $canvas: $window.find('#canvas-flappy'),
                score: $window.find('#flappy-bird-score'),
                flapBtn: $window.find('#flap-btn')
            },
            buttons: {
                play: $window.find('#game-play-btn'),
                exit: $window.find('#game-exit-btn'),
                pause: $window.find('#pause-btn-flappy'),
                restart: $window.find('#restart-btn-flappy')
            }
        };

		const canvas = ui.game.canvas;
        /** @type {CanvasRenderingContext2D} */
		const ctx = canvas.getContext('2d');
		let dpr = window.devicePixelRatio || 1;
		
		// Game state
        let running = false;
        let isGameOver = false;
        let score = 0;
        let gameDirection = 1;
        const powerUpChance = 0.05;

        // Bird physics
        const bird = {
            x: 80, y: 200, radius: 14, vel: 0,
            gravity: 0.9, flapStrength: -12, maxDrop: 14, rotation: 0
        };

        const pipes = [];
        const pipeWidth = 60;
        const pipeGap = 150;
        const pipeSpawnInterval = 1500;
        let lastPipeTime = 0;
        const pipeSpeed = 140;
        const ground = { height: 60 };
        let lastTime = performance.now();

        // --- SYSTÈME ---
		function resizeCanvas() {
			const rect = ui.game.canvas.getBoundingClientRect();
			ui.game.canvas.width = rect.width * dpr;
			ui.game.canvas.height = rect.height * dpr;
			ctx.scale(dpr, dpr);
		}

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
			ui.buttons.pause.text('Resume');
			ui.buttons.pause.addClass('paused');

			spawnPipe(true); // Spawner le premier tuyau pour l'écran "Ready", non-inverseur
			draw(); // Dessiner la frame initiale
			drawReadyMessage(); // Afficher "Ready"
		}

		function updateScoreEl() {
			if (ui.game.score) ui.game.score.text(`${score}`);
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
			ui.buttons.pause.text('Resume');
			ui.buttons.pause.addClass('paused');
			drawPausedMessage(); // Afficher le message de pause
		}

		function resumeGame() {
			// On ne peut reprendre que si le jeu est en pause (running=false) ET non game-over
			if (!running && !isGameOver) {
				running = true;

				ui.buttons.pause.text('Pause');
				ui.buttons.pause.removeClass('paused');

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
			ui.buttons.pause.text('Resume');
			ui.buttons.pause.addClass('paused');

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

		// --- EVENTS ---
		ui.buttons.play.on('click', () => { ui.screens.menu.hide(); ui.screens.game.show(); resizeCanvas(); resetGame(); });
		ui.buttons.exit.on('click', () => { ui.screens.menu.show(); ui.screens.game.hide(); running = false; });
		ui.buttons.pause.on('click', () => running ? pauseGame() : resumeGame());
		ui.buttons.restart.on('click', resetGame);
		ui.game.flapBtn.on('click', flap);
		ui.game.$canvas.on('mousedown', flap);

		const keyHandler = (e) => {
			// S'assurer que l'app est active
			if (!document.body.contains(ui.game.canvas)) return;
			if (e.code === 'Space') { e.preventDefault(); flap(); }
			if (e.key === 'p') running ? pauseGame() : resumeGame();
			if (e.key === 'r') resetGame();
		};
		$(document).on('keydown', keyHandler);

		// --- Start ---
		resetGame(); // Prépare le jeu et affiche l'écran "Ready"

		// Nettoyage lors de la fermeture
		const observer = new MutationObserver(() => {
			if (!document.body.contains(ui.game.canvas)) {
				running = false;
				$(document).off('keydown', keyHandler);
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