const VERSION = '1.0.0';

const STRINGS = {
	'en-US': { play: 'PLAY', menu: 'Menu', score: 'Score', ready: 'Ready?', hint: 'Use arrows to start', paused: 'Paused', gameOver: 'Game Over', pause: 'Pause', resume: 'Resume', effects: 'Active effects' },
	'fr-FR': { play: 'JOUER', menu: 'Menu', score: 'Score', ready: 'Prêt ?', hint: 'Utilise les flèches pour démarrer', paused: 'Pause', gameOver: 'Game Over', pause: 'Pause', resume: 'Reprendre', effects: 'Effets actifs' },
};

const MENU_SVG = `<svg viewBox="0 0 24 24"><path d="M4 5C3.45 5 3 5.45 3 6s.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4zm0 6c-.55 0-1 .45-1 1s.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4zm0 6c-.55 0-1 .45-1 1s.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4z"/></svg>`;
const REFRESH_SVG = `<svg viewBox="0 0 100 100"><path d="M76.5,58.3c-2.8,7.8-10.2,13.3-18.9,13.3-11.1,0-20.1-9-20.1-20.1s9-20.1,20.1-20.1c6.6,0,12.6,3.3,16.2,8.3-.3.5-.9.7-1.7.7H53.6c-1.1,0-2,.9-2,2v4.2c0,1.1.8,1.9,1.9,1.9h17.9c1,0,1.8-.9,1.8-1.8V22c0-1.1-1.1-2-2.2-2h-4c-1.1,0-2,.9-2,2v3c0,1.2-.7,1.7-1.6.9-.4-.5-.7-.8-1.2-1.2-1.6-1.7-3.5-3.2-5.6-4.4-4.3-2.5-9.3-4-14.6-4C32.8,16.3,20,29,20,44.9c0,15.8,12.8,28.5,28.6,28.5,2.6,0,5.2-.4,7.7-1.1,2.5-.7,4.8-1.7,7-3,2.2-1.3,4.2-2.9,5.9-4.7,1.8-1.8,3.3-3.8,4.5-6,.6-1.1,1.1-2.2,1.6-3.4z"/></svg>`;

function html(s) {
	return `
		<div class="game-container">
			<div id="snake-menu" class="game-menu-screen">
				<h1 class="game-title">Snake</h1>
				<div class="game-version">Version ${VERSION}</div>
				<button id="snake-play" class="game-btn">${s.play}</button>
			</div>
			<div id="snake-game" class="game-content" style="display:none;">
				<div class="game-header">
					<div class="game-top-row">
						<button id="snake-exit" class="game-action-btn">${MENU_SVG} ${s.menu}</button>
						<div class="game-score-board">
							<div class="game-score">${s.score}: <span id="snake-score">0</span></div>
						</div>
						<button id="snake-pause" class="game-action-btn">${s.pause}</button>
						<button id="snake-restart" class="game-action-btn">${REFRESH_SVG}</button>
					</div>
				</div>
				<div class="game-main">
					<div class="game-canvas-wrapper">
						<canvas id="snake-canvas"></canvas>
					</div>
					<div id="snake-controls" class="game-controls">
						<button class="up"    data-dir="up">▲</button>
						<button class="left"  data-dir="left">◄</button>
						<button class="center" data-dir="down">▼</button>
						<button class="right" data-dir="right">►</button>
					</div>
				</div>
				<div class="game-footer">
					<h4>${s.effects}</h4>
					<ul id="snake-effects"></ul>
				</div>
			</div>
		</div>
	`;
}

const FOOD_TYPES = [
	{ type: 'red',    prob: 0.60, color: '#f44336', grow: 1, score: 1 },
	{ type: 'gold',   prob: 0.15, color: '#FFC107', grow: 5, score: 5 },
	{ type: 'purple', prob: 0.15, color: '#9C27B0', grow: 0, score: 1, effect: 'speed' },
	{ type: 'blue',   prob: 0.10, color: '#2196F3', grow: 0, score: 2, effect: 'doubleRed' },
];

export const gameSnakeApp = {
	id: 'game-snake',
	title: 'Snake',
	version: VERSION,
	icon: `<svg viewBox="0 0 512 512" fill="#000000"><g id="bgCarrier" stroke-width="0"></g><g id="tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="iconCarrier"> <path style="fill:#82C35F;" d="M503,169.56c0-31.597-9.838-58.418-24.559-71.841c-20.789-40.934-98.446-34.167-167.06-28.179 c-20.615,1.798-40.092,3.496-55.381,3.533c-15.289-0.037-34.766-1.734-55.381-3.533c-68.615-5.987-146.271-12.754-167.06,28.179 C18.838,111.141,9,137.963,9,169.56c0,17.684,3.09,33.862,8.384,47.047c-0.424,0.956-0.665,2.012-0.665,3.125 c0,44.715,10.612,76.196,32.441,96.239c22.748,20.887,54.68,26.391,89.427,26.391c19.601,0,40.101-1.752,60.349-3.483 c19.18-1.64,39-3.329,57.064-3.36c18.063,0.032,37.884,1.721,57.064,3.36c20.251,1.731,40.745,3.483,60.349,3.483 c34.744,0,66.681-5.506,89.427-26.391c21.83-20.043,32.441-51.524,32.441-96.239c0-1.113-0.24-2.169-0.665-3.125 C499.91,203.421,503,187.243,503,169.56z"></path> <g> <path style="fill:#73AF55;" d="M38,281.111c30.928,0,56-46.563,56-104c0-47.056-16.839-86.754-39.929-99.583 c-9.007,4.865-16.064,11.433-20.512,20.19C18.838,111.141,9,137.963,9,169.56c0,17.684,3.091,33.862,8.384,47.047 c-0.425,0.956-0.665,2.012-0.665,3.125c0,16.463,1.444,31.126,4.351,44.091c4.675,6.566,9.441,12.248,13.861,17.001 C35.953,280.926,36.964,281.111,38,281.111z"></path> <path style="fill:#73AF55;" d="M418.003,177.111c0,57.438,25.072,104,56,104c1.036,0,2.047-0.185,3.069-0.288 c3.681-3.958,8.467-9.61,13.757-16.536c2.977-13.078,4.452-27.897,4.452-44.556c0-1.113-0.24-2.169-0.665-3.125 C499.91,203.421,503,187.243,503,169.56c0-31.597-9.838-58.418-24.559-71.841c-4.447-8.756-11.503-15.324-20.51-20.189 C434.842,90.359,418.003,130.057,418.003,177.111z"></path> </g> <path style="fill:#C1C95A;" d="M443.148,306.024c-25.027,0-56.844-8.333-80.934-61.633C337.26,189.18,283.303,171.709,257,171.709 s-80.26,17.471-105.214,72.683c-24.09,53.299-55.907,61.633-80.934,61.633c-12.908,0-30.715-13.061-42.67-36.751 C51.517,376.772,167.85,337.563,256,337.411c85.329,0.148,197.07,36.898,225.3-58.254 C469.171,296.567,454.13,306.024,443.148,306.024z"></path> <path style="fill:#82C35F;" d="M70.852,306.024c25.027,0,56.844-8.333,80.934-61.633C176.74,189.18,230.697,171.709,257,171.709 s80.26,17.471,105.214,72.683c24.09,53.299,55.907,61.633,80.934,61.633c10.982,0,26.023-9.457,38.152-26.868 c23.624-33.912,35.034-156.798-5.3-188.132c-49.671-38.588-154.797-14.126-219-14.126S63.587,40.519,34,96.024 c-40.333,75.667-23.847,137.52-5.818,173.249C40.137,292.964,57.944,306.024,70.852,306.024z"></path> <g> <ellipse style="fill:#FFCE56;" cx="48" cy="169.02" rx="40" ry="76"></ellipse> <ellipse style="fill:#FFCE56;" cx="464" cy="169.02" rx="40" ry="76"></ellipse> </g> <path d="M512,168.316c0-32.748-10.197-60.547-25.454-74.459C465,51.432,384.513,58.445,313.399,64.651 c-21.366,1.864-41.553,3.623-57.399,3.662c-15.846-0.039-36.033-1.798-57.399-3.662C127.486,58.446,47,51.432,25.454,93.857 C10.197,107.769,0,135.568,0,168.316c0,18.328,3.203,35.096,8.689,48.761C8.249,218.068,8,219.162,8,220.316 c0,46.345,10.999,78.972,33.624,99.746c23.577,21.648,56.672,27.353,92.686,27.353c20.315,0,41.562-1.816,62.548-3.61 c17.084-1.46,34.654-2.953,51.143-3.367v68.273l-29.657,29.657c-3.125,3.124-3.125,8.189,0,11.313 c1.562,1.562,3.609,2.343,5.657,2.343s4.095-0.781,5.657-2.343L256,423.338l26.343,26.343c1.562,1.562,3.609,2.343,5.657,2.343 s4.095-0.781,5.657-2.343c3.125-3.124,3.125-8.189,0-11.313L264,408.711v-68.273c16.489,0.414,34.059,1.906,51.143,3.367 c20.989,1.794,42.229,3.61,62.548,3.61c36.01,0,69.11-5.707,92.686-27.353C493.001,299.288,504,266.661,504,220.316 c0-1.154-0.249-2.248-0.689-3.239C508.797,203.412,512,186.644,512,168.316z M496,168.316c0,40.073-16.864,68-32,68 s-32-27.927-32-68s16.864-68,32-68S496,128.243,496,168.316z M48,100.316c15.136,0,32,27.927,32,68s-16.864,68-32,68 s-32-27.927-32-68S32.864,100.316,48,100.316z M459.555,308.276c-31.698,29.105-88.305,24.267-143.049,19.587 c-17.464-1.493-35.431-3.02-52.506-3.431V180.548c27.346,1.593,68.581,12.278,88.651,58.929 c11.637,27.048,25.999,46.695,42.686,58.394c10.979,7.697,22.906,11.68,34.545,11.68c4.072,0,8.11-0.488,12.058-1.475 c4.286-1.072,6.892-5.415,5.821-9.702c-1.072-4.287-5.416-6.893-9.702-5.821c-10.816,2.705-22.415,0.013-33.538-7.784 c-14.02-9.829-26.874-27.678-37.173-51.616c-25.167-58.498-78.267-68.392-109.169-68.821c-0.693-0.196-1.423-0.309-2.18-0.309 s-1.486,0.112-2.18,0.309c-30.902,0.43-84.001,10.324-109.169,68.821c-10.299,23.938-23.154,41.787-37.173,51.616 c-11.122,7.797-22.72,10.49-33.538,7.784c-4.288-1.071-8.63,1.535-9.702,5.821c-1.071,4.287,1.535,8.63,5.821,9.702 c15.232,3.808,31.783,0.184,46.604-10.206c16.687-11.699,31.048-31.346,42.686-58.394c20.071-46.651,61.306-57.336,88.651-58.929 V324.43c-17.075,0.411-35.042,1.938-52.506,3.431c-54.744,4.68-111.351,9.518-143.049-19.587 c-15.555-14.282-24.614-35.961-27.462-65.917c6.797,6.367,14.623,9.958,23.017,9.958c26.916,0,48-36.897,48-84 c0-41.76-16.577-75.475-39.094-82.592c9.792-4.638,23.178-7.581,40.32-8.9c30.187-2.324,67.268,0.911,99.984,3.766 c21.425,1.869,41.681,3.632,58.09,3.717c0.054,0.001,0.107,0.008,0.161,0.008c0.177,0,0.36-0.003,0.538-0.003 s0.361,0.003,0.538,0.003c0.055,0,0.107-0.007,0.161-0.008c16.409-0.085,36.665-1.848,58.09-3.717 c32.715-2.854,69.794-6.089,99.984-3.766c17.142,1.319,30.528,4.262,40.32,8.9C432.578,92.841,416,126.556,416,168.316 c0,47.103,21.084,84,48,84c8.394,0,16.22-3.59,23.017-9.958C484.169,272.315,475.11,293.994,459.555,308.276z"></path> <path d="M464,124.316c-9.731,0-12.542,12.651-13.466,16.809C448.9,148.477,448,158.134,448,168.316s0.9,19.839,2.534,27.191 c0.924,4.157,3.735,16.809,13.466,16.809s12.542-12.651,13.466-16.809c1.634-7.353,2.534-17.009,2.534-27.191 s-0.9-19.839-2.534-27.191C476.542,136.967,473.731,124.316,464,124.316z"></path> <path d="M48,212.316c9.731,0,12.542-12.651,13.466-16.809C63.1,188.155,64,178.498,64,168.316s-0.9-19.839-2.534-27.191 c-0.924-4.158-3.735-16.809-13.466-16.809s-12.542,12.651-13.466,16.809C32.9,148.477,32,158.134,32,168.316 s0.9,19.839,2.534,27.191C35.458,199.665,38.269,212.316,48,212.316z"></path> </g></svg>`,
	iconColor: '#8BC34A',
	headerColor: '#8BC34A',
	type: 'game',
	style: `
		:root {
			--primary-color: #8BC34A;
			--primary-dark-color: #487217;
			--primary-background-color: #c4f091;
		}
		.app-content { padding: 0; }
		.paused { opacity: 0.7; }
	`,
	content: { 'en-US': html(STRINGS['en-US']), 'fr-FR': html(STRINGS['fr-FR']) },

	onMount(ctx) {
		const strings = STRINGS[ctx.lang] || STRINGS['fr-FR'];

		const ui = {
			menu:   ctx.$('#snake-menu'),
			game:   ctx.$('#snake-game'),
			canvas: ctx.$('#snake-canvas'),
			score:  ctx.$('#snake-score'),
			controls: ctx.$$('#snake-controls button'),
			effectsList: ctx.$('#snake-effects'),
			btnPlay:    ctx.$('#snake-play'),
			btnPause:   ctx.$('#snake-pause'),
			btnExit:    ctx.$('#snake-exit'),
			btnRestart: ctx.$('#snake-restart'),
		};

		const canvas = ui.canvas;
		const cctx = canvas.getContext('2d');
		const canvasSize = Math.max(200, 400);
		canvas.width = canvasSize;

		const gridSize = 20;
		let snake, food, direction, score, gameLoopId, isGameOver, running;
		let cellSize, growBy = 0;
		let baseSpeed = 120, speed = baseSpeed;
		let walls = [], level = 1;
		const pointsPerLevel = 5;
		const effects = [];

		const pickFood = () => {
			const r = Math.random();
			let acc = 0;
			for (const f of FOOD_TYPES) { acc += f.prob; if (r <= acc) return f; }
			return FOOD_TYPES[0];
		};

		function addEffect(name, ms, onEnd) {
			effects.push({ name, expiresAt: Date.now() + ms, onEnd });
			renderEffects();
		}
		function hasEffect(name) { return effects.some(e => e.name === name); }
		function renderEffects() {
			const now = Date.now();
			ui.effectsList.innerHTML = '';
			for (const e of effects) {
				const left = Math.max(0, Math.ceil((e.expiresAt - now) / 1000));
				const li = document.createElement('li');
				li.textContent = `${e.name} (${left}s)`;
				ui.effectsList.appendChild(li);
			}
		}
		function tickEffects() {
			const now = Date.now();
			for (let i = effects.length - 1; i >= 0; i--) {
				if (now >= effects[i].expiresAt) {
					if (effects[i].onEnd) effects[i].onEnd();
					effects.splice(i, 1);
				}
			}
			renderEffects();
		}

		function setLoop() {
			if (gameLoopId) clearInterval(gameLoopId);
			gameLoopId = ctx.scope.setInterval(() => { update(); tickEffects(); }, speed);
		}

		function reset() {
			if (gameLoopId) clearInterval(gameLoopId);
			snake = [{ x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }];
			direction = { x: 0, y: 0 };
			food = null;
			score = 0;
			growBy = 0;
			isGameOver = false;
			running = false;
			speed = baseSpeed;
			level = 1;
			walls = [];
			effects.length = 0;
			ui.score.textContent = '0';
			ui.effectsList.innerHTML = '';
			ui.btnPause.textContent = strings.resume;
			ui.btnPause.classList.add('paused');
			cellSize = canvas.width / gridSize;
			canvas.height = canvasSize + Math.floor(cellSize * 1.2);
			placeFood();
			draw();
			overlay(strings.ready, strings.hint);
		}

		function placeFood() {
			let candidate, tries = 0;
			do {
				candidate = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
				tries++;
				if (tries > 1000) break;
			} while (
				snake.some(s => s.x === candidate.x && s.y === candidate.y) ||
				walls.some(w => w.x === candidate.x && w.y === candidate.y)
			);
			food = { ...pickFood(), ...candidate };
		}

		function addWallsForLevel(n) {
			const target = Math.min(30, n * 2 + 2);
			while (walls.length < target) {
				const p = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
				if (
					!snake.some(s => s.x === p.x && s.y === p.y) &&
					!(food && food.x === p.x && food.y === p.y) &&
					!walls.some(w => w.x === p.x && w.y === p.y)
				) walls.push(p);
			}
		}

		function resumeGame() {
			if (isGameOver || running) return;
			running = true;
			ui.btnPause.textContent = strings.pause;
			ui.btnPause.classList.remove('paused');
			setLoop();
		}

		function pauseGame() {
			if (isGameOver || !running) return;
			running = false;
			ui.btnPause.textContent = strings.resume;
			ui.btnPause.classList.add('paused');
			clearInterval(gameLoopId);
			draw();
			overlay(strings.paused);
		}

		function togglePause() {
			if (isGameOver) return;
			running ? pauseGame() : resumeGame();
		}

		function update() {
			if (isGameOver || !running) return;
			const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
			const hitSelf = snake.some(s => s.x === head.x && s.y === head.y);
			const hitWall = walls.some(w => w.x === head.x && w.y === head.y);
			if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize || hitSelf || hitWall) {
				return gameOver();
			}
			snake.unshift(head);
			if (food && head.x === food.x && head.y === food.y) {
				let grow = food.grow;
				if (food.type === 'red' && hasEffect('Double Red')) grow *= 2;
				growBy += grow;
				score += food.score;
				if (food.effect === 'speed') {
					speed = Math.max(30, Math.floor(speed / 1.5));
					setLoop();
					addEffect('Speed x1.5', 20000, () => { speed = Math.max(30, baseSpeed); setLoop(); });
				}
				if (food.effect === 'doubleRed') addEffect('Double Red', 60000, null);
				ui.score.textContent = String(score);
				placeFood();
				const newLevel = Math.floor(score / pointsPerLevel) + 1;
				if (newLevel > level) {
					level = newLevel;
					addWallsForLevel(level);
					baseSpeed = Math.max(40, baseSpeed - 5);
					speed = Math.max(30, baseSpeed);
					if (running) setLoop();
				}
			} else {
				if (growBy > 0) growBy--;
				else snake.pop();
			}
			draw();
		}

		function draw() {
			cctx.fillStyle = '#111';
			cctx.fillRect(0, 0, canvas.width, canvas.height);
			cellSize = canvas.width / gridSize;

			cctx.fillStyle = '#555';
			walls.forEach(w => cctx.fillRect(w.x * cellSize, w.y * cellSize, cellSize - 1, cellSize - 1));

			snake.forEach((seg, i) => {
				cctx.fillStyle = i === 0 ? '#AEEA00' : '#8BC34A';
				cctx.fillRect(seg.x * cellSize, seg.y * cellSize, cellSize - 1, cellSize - 1);
			});

			if (food) {
				const pad = Math.max(2, Math.floor(cellSize * 0.15));
				cctx.fillStyle = food.color;
				cctx.fillRect(food.x * cellSize + pad / 2, food.y * cellSize + pad / 2, cellSize - pad, cellSize - pad);
				cctx.fillStyle = 'rgba(255,255,255,0.25)';
				cctx.fillRect(food.x * cellSize + pad, food.y * cellSize + pad, (cellSize - pad) / 3, (cellSize - pad) / 3);
			}

			cctx.fillStyle = 'rgba(255,255,255,0.06)';
			cctx.fillRect(0, canvas.height - Math.floor(cellSize * 1.2), canvas.width, Math.floor(cellSize * 1.2));
			cctx.fillStyle = '#fff';
			cctx.font = `${Math.floor(cellSize * 0.8)}px Roboto`;
			cctx.textAlign = 'left';
			cctx.fillText(`Level: ${level}`, 8, canvas.height - Math.floor(cellSize * 0.2));
			cctx.textAlign = 'right';
			cctx.fillText(`${strings.score}: ${score}`, canvas.width - 8, canvas.height - Math.floor(cellSize * 0.2));
		}

		function overlay(title, subtitle = '') {
			cctx.fillStyle = 'rgba(0,0,0,0.45)';
			cctx.fillRect(0, 0, canvas.width, canvas.height);
			cctx.fillStyle = 'white';
			cctx.font = `${Math.floor(canvas.width / 12)}px Roboto`;
			cctx.textAlign = 'center';
			cctx.fillText(title, canvas.width / 2, canvas.height / 2 - 10);
			if (subtitle) {
				cctx.font = `${Math.floor(canvas.width / 20)}px Roboto`;
				cctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 30);
			}
		}

		function gameOver() {
			isGameOver = true;
			clearInterval(gameLoopId);
			draw();
			overlay(strings.gameOver, `${strings.score}: ${score}`);
		}

		function changeDirection(d) {
			if (isGameOver) { reset(); return; }
			if (!running) resumeGame();
			if (direction.x !== 0 || direction.y !== 0) {
				if (d === 'up' && direction.y === 1) return;
				if (d === 'down' && direction.y === -1) return;
				if (d === 'left' && direction.x === 1) return;
				if (d === 'right' && direction.x === -1) return;
			}
			direction = ({
				up:    { x: 0, y: -1 },
				down:  { x: 0, y: 1 },
				left:  { x: -1, y: 0 },
				right: { x: 1, y: 0 },
			})[d];
		}

		// Events
		ctx.scope.on(ui.btnPlay,    'click', () => { ui.menu.style.display = 'none'; ui.game.style.display = ''; });
		ctx.scope.on(ui.btnExit,    'click', () => { ui.menu.style.display = ''; ui.game.style.display = 'none'; });
		ctx.scope.on(ui.btnPause,   'click', togglePause);
		ctx.scope.on(ui.btnRestart, 'click', reset);
		ui.controls.forEach(btn => {
			ctx.scope.on(btn, 'click', () => changeDirection(btn.dataset.dir));
		});
		ctx.scope.on(document, 'keydown', (e) => {
			if (!ctx.root.isConnected) return;
			const k = e.key.toLowerCase();
			if (k === 'p') { e.preventDefault(); togglePause(); return; }
			if (k === 'r') { reset(); return; }
			const map = { arrowup: 'up', w: 'up', arrowdown: 'down', s: 'down', arrowleft: 'left', a: 'left', arrowright: 'right', d: 'right' };
			if (map[k]) { e.preventDefault(); changeDirection(map[k]); }
		});

		reset();
		return {
			pause:   pauseGame,
			resume:  resumeGame,
			restart: reset,
		};
	}
};
