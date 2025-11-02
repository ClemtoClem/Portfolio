export const gameSnakeApp = {
	id: 'game-snake',
	title: 'Snake',
	icon: `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style="fill:#82C35F;" d="M503,169.56c0-31.597-9.838-58.418-24.559-71.841c-20.789-40.934-98.446-34.167-167.06-28.179 c-20.615,1.798-40.092,3.496-55.381,3.533c-15.289-0.037-34.766-1.734-55.381-3.533c-68.615-5.987-146.271-12.754-167.06,28.179 C18.838,111.141,9,137.963,9,169.56c0,17.684,3.09,33.862,8.384,47.047c-0.424,0.956-0.665,2.012-0.665,3.125 c0,44.715,10.612,76.196,32.441,96.239c22.748,20.887,54.68,26.391,89.427,26.391c19.601,0,40.101-1.752,60.349-3.483 c19.18-1.64,39-3.329,57.064-3.36c18.063,0.032,37.884,1.721,57.064,3.36c20.251,1.731,40.745,3.483,60.349,3.483 c34.744,0,66.681-5.506,89.427-26.391c21.83-20.043,32.441-51.524,32.441-96.239c0-1.113-0.24-2.169-0.665-3.125 C499.91,203.421,503,187.243,503,169.56z"></path> <g> <path style="fill:#73AF55;" d="M38,281.111c30.928,0,56-46.563,56-104c0-47.056-16.839-86.754-39.929-99.583 c-9.007,4.865-16.064,11.433-20.512,20.19C18.838,111.141,9,137.963,9,169.56c0,17.684,3.091,33.862,8.384,47.047 c-0.425,0.956-0.665,2.012-0.665,3.125c0,16.463,1.444,31.126,4.351,44.091c4.675,6.566,9.441,12.248,13.861,17.001 C35.953,280.926,36.964,281.111,38,281.111z"></path> <path style="fill:#73AF55;" d="M418.003,177.111c0,57.438,25.072,104,56,104c1.036,0,2.047-0.185,3.069-0.288 c3.681-3.958,8.467-9.61,13.757-16.536c2.977-13.078,4.452-27.897,4.452-44.556c0-1.113-0.24-2.169-0.665-3.125 C499.91,203.421,503,187.243,503,169.56c0-31.597-9.838-58.418-24.559-71.841c-4.447-8.756-11.503-15.324-20.51-20.189 C434.842,90.359,418.003,130.057,418.003,177.111z"></path> </g> <path style="fill:#C1C95A;" d="M443.148,306.024c-25.027,0-56.844-8.333-80.934-61.633C337.26,189.18,283.303,171.709,257,171.709 s-80.26,17.471-105.214,72.683c-24.09,53.299-55.907,61.633-80.934,61.633c-12.908,0-30.715-13.061-42.67-36.751 C51.517,376.772,167.85,337.563,256,337.411c85.329,0.148,197.07,36.898,225.3-58.254 C469.171,296.567,454.13,306.024,443.148,306.024z"></path> <path style="fill:#82C35F;" d="M70.852,306.024c25.027,0,56.844-8.333,80.934-61.633C176.74,189.18,230.697,171.709,257,171.709 s80.26,17.471,105.214,72.683c24.09,53.299,55.907,61.633,80.934,61.633c10.982,0,26.023-9.457,38.152-26.868 c23.624-33.912,35.034-156.798-5.3-188.132c-49.671-38.588-154.797-14.126-219-14.126S63.587,40.519,34,96.024 c-40.333,75.667-23.847,137.52-5.818,173.249C40.137,292.964,57.944,306.024,70.852,306.024z"></path> <g> <ellipse style="fill:#FFCE56;" cx="48" cy="169.02" rx="40" ry="76"></ellipse> <ellipse style="fill:#FFCE56;" cx="464" cy="169.02" rx="40" ry="76"></ellipse> </g> <path d="M512,168.316c0-32.748-10.197-60.547-25.454-74.459C465,51.432,384.513,58.445,313.399,64.651 c-21.366,1.864-41.553,3.623-57.399,3.662c-15.846-0.039-36.033-1.798-57.399-3.662C127.486,58.446,47,51.432,25.454,93.857 C10.197,107.769,0,135.568,0,168.316c0,18.328,3.203,35.096,8.689,48.761C8.249,218.068,8,219.162,8,220.316 c0,46.345,10.999,78.972,33.624,99.746c23.577,21.648,56.672,27.353,92.686,27.353c20.315,0,41.562-1.816,62.548-3.61 c17.084-1.46,34.654-2.953,51.143-3.367v68.273l-29.657,29.657c-3.125,3.124-3.125,8.189,0,11.313 c1.562,1.562,3.609,2.343,5.657,2.343s4.095-0.781,5.657-2.343L256,423.338l26.343,26.343c1.562,1.562,3.609,2.343,5.657,2.343 s4.095-0.781,5.657-2.343c3.125-3.124,3.125-8.189,0-11.313L264,408.711v-68.273c16.489,0.414,34.059,1.906,51.143,3.367 c20.989,1.794,42.229,3.61,62.548,3.61c36.01,0,69.11-5.707,92.686-27.353C493.001,299.288,504,266.661,504,220.316 c0-1.154-0.249-2.248-0.689-3.239C508.797,203.412,512,186.644,512,168.316z M496,168.316c0,40.073-16.864,68-32,68 s-32-27.927-32-68s16.864-68,32-68S496,128.243,496,168.316z M48,100.316c15.136,0,32,27.927,32,68s-16.864,68-32,68 s-32-27.927-32-68S32.864,100.316,48,100.316z M459.555,308.276c-31.698,29.105-88.305,24.267-143.049,19.587 c-17.464-1.493-35.431-3.02-52.506-3.431V180.548c27.346,1.593,68.581,12.278,88.651,58.929 c11.637,27.048,25.999,46.695,42.686,58.394c10.979,7.697,22.906,11.68,34.545,11.68c4.072,0,8.11-0.488,12.058-1.475 c4.286-1.072,6.892-5.415,5.821-9.702c-1.072-4.287-5.416-6.893-9.702-5.821c-10.816,2.705-22.415,0.013-33.538-7.784 c-14.02-9.829-26.874-27.678-37.173-51.616c-25.167-58.498-78.267-68.392-109.169-68.821c-0.693-0.196-1.423-0.309-2.18-0.309 s-1.486,0.112-2.18,0.309c-30.902,0.43-84.001,10.324-109.169,68.821c-10.299,23.938-23.154,41.787-37.173,51.616 c-11.122,7.797-22.72,10.49-33.538,7.784c-4.288-1.071-8.63,1.535-9.702,5.821c-1.071,4.287,1.535,8.63,5.821,9.702 c15.232,3.808,31.783,0.184,46.604-10.206c16.687-11.699,31.048-31.346,42.686-58.394c20.071-46.651,61.306-57.336,88.651-58.929 V324.43c-17.075,0.411-35.042,1.938-52.506,3.431c-54.744,4.68-111.351,9.518-143.049-19.587 c-15.555-14.282-24.614-35.961-27.462-65.917c6.797,6.367,14.623,9.958,23.017,9.958c26.916,0,48-36.897,48-84 c0-41.76-16.577-75.475-39.094-82.592c9.792-4.638,23.178-7.581,40.32-8.9c30.187-2.324,67.268,0.911,99.984,3.766 c21.425,1.869,41.681,3.632,58.09,3.717c0.054,0.001,0.107,0.008,0.161,0.008c0.177,0,0.36-0.003,0.538-0.003 s0.361,0.003,0.538,0.003c0.055,0,0.107-0.007,0.161-0.008c16.409-0.085,36.665-1.848,58.09-3.717 c32.715-2.854,69.794-6.089,99.984-3.766c17.142,1.319,30.528,4.262,40.32,8.9C432.578,92.841,416,126.556,416,168.316 c0,47.103,21.084,84,48,84c8.394,0,16.22-3.59,23.017-9.958C484.169,272.315,475.11,293.994,459.555,308.276z"></path> <path d="M464,124.316c-9.731,0-12.542,12.651-13.466,16.809C448.9,148.477,448,158.134,448,168.316s0.9,19.839,2.534,27.191 c0.924,4.157,3.735,16.809,13.466,16.809s12.542-12.651,13.466-16.809c1.634-7.353,2.534-17.009,2.534-27.191 s-0.9-19.839-2.534-27.191C476.542,136.967,473.731,124.316,464,124.316z"></path> <path d="M48,212.316c9.731,0,12.542-12.651,13.466-16.809C63.1,188.155,64,178.498,64,168.316s-0.9-19.839-2.534-27.191 c-0.924-4.158-3.735-16.809-13.466-16.809s-12.542,12.651-13.466,16.809C32.9,148.477,32,158.134,32,168.316 s0.9,19.839,2.534,27.191C35.458,199.665,38.269,212.316,48,212.316z"></path> </g></svg>`,
	iconColor: '#8BC34A',
	headerColor: '#8BC34A',
	type: 'game',
	content: `
		<div class="game-container">
			<div class="game-score">Score: <span id="snake-score">0</span></div>
			<div class="game-extra-controls">
				<button id="snake-pause-btn" class="pause-btn">Pause</button>
				<button id="snake-restart-btn">Restart</button>
			</div>
			<!-- Le canvas doit avoir la classe 'square-canvas' comme les autres jeux -->
			<canvas id="snake-canvas" class="game-canvas square-canvas"></canvas>

			<div id="snake-controls" class="game-controls">
				<button class="up" data-dir="up", title="up">▲</button>
				<button class="left" data-dir="left" title="left">◄</button>
				<button class="down" data-dir="down" title="down">▼</button>
				<button class="right" data-dir="right" title="right">►</button>
			</div>

			<div class="status-panel">
				<h4>Effets actifs</h4>
				<ul id="snake-effects"></ul>
			</div>
		</div>
	`,
	init: function (windowId) {
		const $window = $(`#${windowId}`);
		const canvas = $window.find('#snake-canvas')[0];
		const scoreEl = $window.find('#snake-score')[0];
		const pauseBtn = $window.find('#snake-pause-btn')[0];
		const restartBtn = $window.find('#snake-restart-btn')[0];
		const effectsList = $window.find('#snake-effects')[0];
		const ctx = canvas.getContext('2d');

		// Ajuster la taille du canvas
		const canvasSize = Math.max(200, $window.find('.game-canvas').width() || 400);
		canvas.width = canvasSize;

		const gridSize = 20;
		let snake, food, direction, score, gameLoopId, isGameOver, running;
		let cellSize, growBy = 0;
		let baseSpeed = 120;
		let speed = baseSpeed;
		let walls = [];
		let level = 1;
		const pointsPerLevel = 5;

		const activeEffects = [];

		const foodTypes = [
			{ type: 'red', prob: 0.6, color: '#f44336', grow: 1 },
			{ type: 'gold', prob: 0.15, color: '#FFC107', grow: 5 },
			{ type: 'purple', prob: 0.15, color: '#9C27B0', grow: 0, speedBoost: true },
			{ type: 'blue', prob: 0.10, color: '#2196F3', grow: 0, doubleRed: true }
		];

		function getRandomFoodType() {
			const r = Math.random();
			let acc = 0;
			for (const f of foodTypes) {
				acc += f.prob;
				if (r <= acc) return f;
			}
			return foodTypes[0];
		}

		// --- Fonctions d'effets ---

		function addEffect(name, durationMs, onEnd) {
			const expiresAt = Date.now() + durationMs;
			activeEffects.push({ name, expiresAt, onEnd });
			updateEffectsUI();
		}

		function updateEffectsUI() {
			const now = Date.now();
			activeEffects.forEach(e => e.remaining = Math.max(0, Math.ceil((e.expiresAt - now) / 1000)));
			$(effectsList).empty();
			activeEffects.forEach(e => {
				const li = document.createElement('li');
				li.textContent = `${e.name} (${e.remaining}s)`;
				effectsList.appendChild(li);
			});
		}

		function updateEffects() {
			const now = Date.now();
			for (let i = activeEffects.length - 1; i >= 0; i--) {
				if (now >= activeEffects[i].expiresAt) {
					if (activeEffects[i].onEnd) activeEffects[i].onEnd();
					activeEffects.splice(i, 1);
				}
			}
			updateEffectsUI();
		}

		function hasEffect(name) {
			return activeEffects.some(e => e.name === name);
		}

		// --- Logique du jeu ---

		function setGameInterval() {
			if (gameLoopId) clearInterval(gameLoopId);
			gameLoopId = setInterval(() => {
				update();
				updateEffects();
			}, speed);
		}

		function resetGame() {
			if (gameLoopId) clearInterval(gameLoopId);

			snake = [{ x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }];
			direction = { x: 0, y: 0 }; // Ne pas bouger au début
			food = null;
			score = 0;
			growBy = 0;
			isGameOver = false;
			running = false; // Commencer en pause (état "Ready")
			speed = baseSpeed;
			level = 1;
			walls = [];
			activeEffects.length = 0;
			scoreEl.textContent = String(score);
			$(effectsList).empty();

			// Mettre à jour le bouton pause pour refléter l'état "prêt"
			pauseBtn.textContent = 'Resume';
			pauseBtn.classList.add('paused');

			cellSize = canvas.width / gridSize;
			canvas.height = canvasSize + Math.floor(cellSize * 1.2);
			
			placeFood();

			draw(); // Dessiner la frame initiale

			// Afficher le message "Ready"
			ctx.fillStyle = 'rgba(0,0,0,0.45)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = 'white';
			ctx.font = `${Math.floor(canvas.width / 15)}px Roboto`;
			ctx.textAlign = 'center';
			ctx.fillText('Ready?', canvas.width / 2, canvas.height / 2 - 10);
			ctx.font = `${Math.floor(canvas.width / 20)}px Roboto`;
			ctx.fillText('Use arrows to start', canvas.width / 2, canvas.height / 2 + 30);
		}

		function placeFood() {
			let tries = 0;
			let candidate;
			do {
				candidate = {
					x: Math.floor(Math.random() * gridSize),
					y: Math.floor(Math.random() * gridSize)
				};
				tries++;
				if (tries > 1000) break;
			} while (
				snake.some(s => s.x === candidate.x && s.y === candidate.y) ||
				walls.some(w => w.x === candidate.x && w.y === candidate.y)
			);
			food = { ...getRandomFoodType(), ...candidate };
		}

		function addWallsForLevel(newLevel) {
			const targetWalls = Math.min(30, newLevel * 2 + 2);
			while (walls.length < targetWalls) {
				let p = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
				if (
					!snake.some(s => s.x === p.x && s.y === p.y) &&
					!(food && food.x === p.x && food.y === p.y) &&
					!walls.some(w => w.x === p.x && w.y === p.y)
				) {
					walls.push(p);
				}
			}
		}

		// --- FONCTIONS PAUSE / RESUME ---

		function resumeGame() {
			if (isGameOver || running) return; // Ne reprendre que si en pause
			running = true;
			pauseBtn.textContent = 'Pause';
			pauseBtn.classList.remove('paused');
			setGameInterval(); // Démarrer la boucle de jeu
		}

		function pauseGame() {
			if (isGameOver || !running) return; // Ne pauser que si en cours
			running = false;
			pauseBtn.textContent = 'Resume';
			pauseBtn.classList.add('paused');
			clearInterval(gameLoopId); // Arrêter la boucle de jeu

			// Dessiner le message de pause
			draw(); // Redessiner l'état actuel du jeu
			ctx.fillStyle = 'rgba(0,0,0,0.45)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = 'white';
			ctx.font = `${Math.floor(canvas.width / 15)}px Roboto`;
			ctx.textAlign = 'center';
			ctx.fillText('Paused', canvas.width / 2, canvas.height / 2);
		}

		function togglePause() {
			if (isGameOver) return;
			if (!running) {
				resumeGame();
			} else {
				pauseGame();
			}
		}

		// --- Fonctions principales de jeu ---
		function gameOver() {
			isGameOver = true;
			clearInterval(gameLoopId);
			draw();
			ctx.fillStyle = 'rgba(0,0,0,0.65)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = 'white';
			ctx.font = `${Math.floor(canvas.width / 12)}px Roboto`;
			ctx.textAlign = 'center';
			ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 10);
			ctx.font = `${Math.floor(canvas.width / 20)}px Roboto`;
			ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
		}

		function handleLevelUpIfNeeded() {
			const newLevel = Math.floor(score / pointsPerLevel) + 1;
			if (newLevel > level) {
				level = newLevel;
				addWallsForLevel(level);
				baseSpeed = Math.max(40, baseSpeed - 5);
				speed = Math.max(30, Math.floor(baseSpeed));
				// Pas besoin de setGameInterval ici si togglePause/resume s'en chargent
				// Mais si on change la vitesse, il faut redémarrer l'intervalle
				if (running) {
					setGameInterval();
				}
			}
		}

		function update() {
			if (isGameOver || !running) return; // La boucle ne fait rien si en pause

			const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

			// conditions de collision
			const hitSelf = snake.some(s => s.x === head.x && s.y === head.y);
			const hitWall = walls.some(w => w.x === head.x && w.y === head.y);
			if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize || hitSelf || hitWall) {
				gameOver();
				return;
			}

			snake.unshift(head);

			// manger la nourriture ?
			if (food && head.x === food.x && head.y === food.y) {
				if (food.type === 'red') {
					let growth = food.grow || 1;
					if (hasEffect('Double Red')) growth *= 2;
					growBy += growth;
					score += 1;
				} else if (food.type === 'gold') {
					growBy += (food.grow || 5);
					score += 5;
				} else if (food.type === 'purple') {
					speed = Math.max(30, Math.floor(speed / 1.5));
					setGameInterval();
					addEffect('Speed x1.5', 20000, () => {
						speed = Math.max(30, Math.floor(baseSpeed));
						setGameInterval();
					});
					score += 1;
				} else if (food.type === 'blue') {
					addEffect('Double Red', 60000, null);
					score += 2;
				}
				scoreEl.textContent = String(score);
				placeFood();
				handleLevelUpIfNeeded();
			} else {
				if (growBy > 0) growBy--;
				else snake.pop();
			}

			draw();
		}

		function draw() {
			// background
			ctx.fillStyle = '#111';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			cellSize = canvas.width / gridSize;

			// dessiner murs
			ctx.fillStyle = '#555';
			walls.forEach(w => ctx.fillRect(w.x * cellSize, w.y * cellSize, cellSize - 1, cellSize - 1));

			// dessiner serpent
			snake.forEach((seg, i) => {
				ctx.fillStyle = i === 0 ? '#AEEA00' : '#8BC34A';
				ctx.fillRect(seg.x * cellSize, seg.y * cellSize, cellSize - 1, cellSize - 1);
			});

			// dessiner nourriture
			if (food) {
				ctx.fillStyle = food.color || '#f44336';
				const pad = Math.max(2, Math.floor(cellSize * 0.15));
				ctx.fillRect(food.x * cellSize + pad / 2, food.y * cellSize + pad / 2, cellSize - pad, cellSize - pad);
				ctx.fillStyle = 'rgba(255,255,255,0.25)';
				ctx.fillRect(food.x * cellSize + pad, food.y * cellSize + pad, (cellSize - pad) / 3, (cellSize - pad) / 3);
			}

			// HUD / niveau
			ctx.fillStyle = 'rgba(255,255,255,0.06)';
			ctx.fillRect(0, canvas.height, canvas.width, Math.floor(cellSize * 1.2));
			ctx.fillStyle = '#fff';
			ctx.font = `${Math.floor(cellSize * 0.8)}px Roboto`;
			ctx.textAlign = 'left';
			ctx.fillText(`Level: ${level}`, 8, canvas.height - Math.floor(cellSize * 0.2));
			ctx.textAlign = 'right';
			ctx.fillText(`Score: ${score}`, canvas.width - 8, canvas.height - Math.floor(cellSize * 0.2));
		}

		function changeDirection(newDir) {
			if (isGameOver) {
				resetGame();
				return;
			}

			if (!running) {
				resumeGame();
			}

			// Si le jeu est en pause (au début) et qu'on n'a pas encore de direction,
			// on peut accepter n'importe quelle direction
			if (direction.x === 0 && direction.y === 0) {
				// (La logique 180° ci-dessous gèrera cela)
			} else {
				// empêcher 180°
				if (newDir === 'up' && direction.y === 1) return;
				if (newDir === 'down' && direction.y === -1) return;
				if (newDir === 'left' && direction.x === 1) return;
				if (newDir === 'right' && direction.x === -1) return;
			}

			if (newDir === 'up') direction = { x: 0, y: -1 };
			if (newDir === 'down') direction = { x: 0, y: 1 };
			if (newDir === 'left') direction = { x: -1, y: 0 };
			if (newDir === 'right') direction = { x: 1, y: 0 };
		}

		// --- Écouteurs d'événements ---

		// contrôles tactiles / boutons
		$window.find('#snake-controls button').on('click', function () {
			changeDirection($(this).data('dir'));
		});

		pauseBtn.addEventListener('click', togglePause);
		restartBtn.addEventListener('click', resetGame);

		// clavier
		const keyHandler = (e) => {
			// S'assurer que l'app est active
			if (!document.body.contains(canvas)) return;

			if (e.key === 'p' || e.key === 'P') {
				e.preventDefault();
				togglePause();
				return;
			}
			if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
				e.preventDefault();
				changeDirection('up');
			}
			if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
				e.preventDefault();
				changeDirection('down');
			}
			if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
				e.preventDefault();
				changeDirection('left');
			}
			if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
				e.preventDefault();
				changeDirection('right');
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
		const observer = new MutationObserver(() => {
			if (!document.body.contains(canvas)) {
				running = false; // Arrêter la boucle
				clearInterval(gameLoopId);
				document.removeEventListener('keydown', keyHandler);
				observer.disconnect();
			}
		});
		observer.observe(document.body, { childList: true, subtree: true });

		// API exposée
		return {
			pause: () => { pauseGame(); }, // Appelle directement pauseGame
			resume: () => { resumeGame(); }, // Appelle directement resumeGame
			restart: () => { resetGame(); }
		};
	}
};
