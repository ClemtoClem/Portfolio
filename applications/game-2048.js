const VERSION = '1.1.0';

const STRINGS = {
	'en-US': {
		play: 'PLAY', menu: 'Menu', score: 'Score', size: 'Grid size :',
		gameOver: 'Game Over', restart: 'Restart ↺',
	},
	'fr-FR': {
		play: 'JOUER', menu: 'Menu', score: 'Score', size: 'Taille :',
		gameOver: 'Game Over', restart: 'Recommencer ↺',
	},
};

const MENU_SVG = `<svg viewBox="0 0 24 24"><path d="M4 5C3.45 5 3 5.45 3 6s.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4zm0 6c-.55 0-1 .45-1 1s.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4zm0 6c-.55 0-1 .45-1 1s.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4z"/></svg>`;
const REFRESH_SVG = `<svg viewBox="0 0 100 100"><path d="M76.5,58.3c-2.8,7.8-10.2,13.3-18.9,13.3-11.1,0-20.1-9-20.1-20.1s9-20.1,20.1-20.1c6.6,0,12.6,3.3,16.2,8.3-.3.5-.9.7-1.7.7H53.6c-1.1,0-2,.9-2,2v4.2c0,1.1.8,1.9,1.9,1.9h17.9c1,0,1.8-.9,1.8-1.8V22c0-1.1-1.1-2-2.2-2h-4c-1.1,0-2,.9-2,2v3c0,1.2-.7,1.7-1.6.9-.4-.5-.7-.8-1.2-1.2-1.6-1.7-3.5-3.2-5.6-4.4-4.3-2.5-9.3-4-14.6-4C32.8,16.3,20,29,20,44.9c0,15.8,12.8,28.5,28.6,28.5,2.6,0,5.2-.4,7.7-1.1,2.5-.7,4.8-1.7,7-3,2.2-1.3,4.2-2.9,5.9-4.7,1.8-1.8,3.3-3.8,4.5-6,.6-1.1,1.1-2.2,1.6-3.4z"/></svg>`;

function html(s) {
	return `
		<div class="game-container">
			<div id="g2048-menu" class="game-menu-screen">
				<h1 class="game-title">2048</h1>
				<div class="game-version">Version ${VERSION}</div>
				<button id="g2048-play" class="game-btn">${s.play}</button>
			</div>
			<div id="g2048-game" class="game-content" style="display:none;">
				<div class="game-header">
					<div class="game-top-row">
						<button class="game-action-btn" id="g2048-exit">${MENU_SVG} ${s.menu}</button>
						<div class="game-score-board">
							<div class="game-score">${s.score}: <span id="g2048-score">0</span></div>
						</div>
						<button class="game-action-btn" id="g2048-restart" title="${s.restart}">${REFRESH_SVG}</button>
					</div>
					<div class="game-top-row">
						<label for="g2048-grid-size">${s.size}</label>
						<input type="range" id="g2048-grid-size" min="3" max="8" value="4" step="1">
						<span id="g2048-grid-label">4×4</span>
					</div>
				</div>
				<div class="game-canvas-wrapper">
					<div id="g2048-board"></div>
				</div>
				<div id="g2048-controls" class="game-controls">
					<button class="up-left"  data-dir="counterclockwise">↺</button>
					<button class="up"       data-dir="up">▲</button>
					<button class="up-right" data-dir="clockwise">↻</button>
					<button class="left"   data-dir="left">◄</button>
					<button class="center" data-dir="down">▼</button>
					<button class="right"  data-dir="right">►</button>
				</div>
				<div class="game-message-overlay" id="g2048-overlay" style="display:none;">
					<h2 id="g2048-overlay-title">${s.gameOver}</h2>
					<p id="g2048-overlay-msg"></p>
					<div class="overlay-buttons">
						<button id="g2048-overlay-restart">${s.restart}</button>
					</div>
				</div>
			</div>
		</div>
	`;
}

export const game2048App = {
	id: 'game-2048',
	title: '2048',
	version: VERSION,
	icon: `<svg viewBox="0 0 48 48" fill="none" stroke="#c64600" stroke-width="1.5"><rect x="24" y="5.5" width="18.5" height="18.5" rx="4"/><rect x="5.5" y="24" width="18.5" height="18.5" rx="4"/><rect x="24" y="24" width="18.5" height="18.5" rx="4"/><rect x="5.5" y="5.5" width="18.5" height="18.5" rx="4"/><text x="14.75" y="20" text-anchor="middle" font-size="11" fill="#c64600" stroke="none">2</text><text x="33.25" y="20" text-anchor="middle" font-size="11" fill="#c64600" stroke="none">0</text><text x="14.75" y="38" text-anchor="middle" font-size="11" fill="#c64600" stroke="none">4</text><text x="33.25" y="38" text-anchor="middle" font-size="11" fill="#c64600" stroke="none">8</text></svg>`,
	iconColor: '#ffc107',
	headerColor: '#ffc107',
	type: 'game',
	style: `
		:root {
			--primary-color: #ffc107;
			--primary-dark-color: #866503;
			--primary-background-color: #fdeaaf;
		}
		.app-content { padding: 0; }
		#g2048-board {
			display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(4, 1fr);
			gap: 10px; background: #bbada0; padding: 10px; border-radius: 8px;
			width: 100%; max-width: 400px; aspect-ratio: 1 / 1; box-sizing: border-box;
			position: relative; font-size: 2em; font-weight: bold; margin: 0 auto;
		}
		.tile {
			display: flex; justify-content: center; align-items: center;
			border-radius: 4px; color: #776e65; background: #cdc1b4;
			transition: background 0.15s, transform 0.1s;
		}
		.tile[data-value="2"]    { background: #eee4da; }
		.tile[data-value="4"]    { background: #ede0c8; }
		.tile[data-value="8"]    { background: #f2b179; color: #f9f6f2; }
		.tile[data-value="16"]   { background: #f59563; color: #f9f6f2; }
		.tile[data-value="32"]   { background: #f67c5f; color: #f9f6f2; }
		.tile[data-value="64"]   { background: #f65e3b; color: #f9f6f2; }
		.tile[data-value="128"]  { background: #edcf72; color: #f9f6f2; }
		.tile[data-value="256"]  { background: #edcc61; color: #f9f6f2; }
		.tile[data-value="512"]  { background: #edc850; color: #f9f6f2; }
		.tile[data-value="1024"] { background: #edc53f; color: #f9f6f2; }
		.tile[data-value="2048"] { background: #edc22e; color: #f9f6f2; }
		.tile[data-value="4096"], .tile[data-value="8192"], .tile[data-value="16384"] { background: #9e70c9; color: #f9f6f2; }
		.tile[data-value="32768"], .tile[data-value="65536"] { background: #781fca; color: #f9f6f2; }
	`,
	content: { 'en-US': html(STRINGS['en-US']), 'fr-FR': html(STRINGS['fr-FR']) },

	onMount(ctx) {
		const strings = STRINGS[ctx.lang] || STRINGS['fr-FR'];

		const ui = {
			menu:    ctx.$('#g2048-menu'),
			game:    ctx.$('#g2048-game'),
			board:   ctx.$('#g2048-board'),
			score:   ctx.$('#g2048-score'),
			slider:  ctx.$('#g2048-grid-size'),
			label:   ctx.$('#g2048-grid-label'),
			controls:ctx.$$('#g2048-controls button'),
			overlay: ctx.$('#g2048-overlay'),
			overlayMsg: ctx.$('#g2048-overlay-msg'),
			overlayTitle: ctx.$('#g2048-overlay-title'),
			overlayRestart: ctx.$('#g2048-overlay-restart'),
			btnPlay: ctx.$('#g2048-play'),
			btnExit: ctx.$('#g2048-exit'),
			btnRestart: ctx.$('#g2048-restart'),
		};

		let gridSize = 4;
		let board = [];
		let score = 0;
		let isGameOver = false;

		const empty = () => Array.from({ length: gridSize }, () => Array(gridSize).fill(0));

		function updateGridCSS() {
			ui.board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
			ui.board.style.gridTemplateRows    = `repeat(${gridSize}, 1fr)`;
			ui.board.style.fontSize = `${Math.max(0.5, 2.5 - gridSize * 0.2)}em`;
			ui.label.textContent = `${gridSize}×${gridSize}`;
		}

		function restart() {
			updateGridCSS();
			board = empty();
			score = 0;
			isGameOver = false;
			addRandomTile(); addRandomTile();
			draw();
			ui.overlay.style.display = 'none';
		}

		function draw() {
			ui.board.innerHTML = '';
			ui.score.textContent = String(score);
			for (let r = 0; r < gridSize; r++) {
				for (let c = 0; c < gridSize; c++) {
					const tile = document.createElement('div');
					tile.className = 'tile';
					if (board[r][c] > 0) {
						tile.textContent = String(board[r][c]);
						tile.setAttribute('data-value', String(board[r][c]));
					}
					ui.board.appendChild(tile);
				}
			}
		}

		function addRandomTile() {
			const empties = [];
			for (let r = 0; r < gridSize; r++)
				for (let c = 0; c < gridSize; c++)
					if (board[r][c] === 0) empties.push({ r, c });
			if (!empties.length) return;
			const { r, c } = empties[Math.floor(Math.random() * empties.length)];
			board[r][c] = Math.random() < 0.9 ? 2 : 4;
		}

		const slide   = (row) => { const arr = row.filter(Boolean); return arr.concat(Array(gridSize - arr.length).fill(0)); };
		const combine = (row) => {
			for (let i = 0; i < gridSize - 1; i++) {
				if (row[i] !== 0 && row[i] === row[i + 1]) {
					row[i] *= 2;
					row[i + 1] = 0;
					score += row[i];
				}
			}
			return row;
		};
		const operate = (row) => slide(combine(slide(row)));

		function move(dir) {
			if (isGameOver) return;
			const before = JSON.stringify(board);
			if (dir === 'left' || dir === 'right') {
				for (let r = 0; r < gridSize; r++) {
					let row = board[r].slice();
					if (dir === 'right') row.reverse();
					row = operate(row);
					if (dir === 'right') row.reverse();
					board[r] = row;
				}
			} else if (dir === 'up' || dir === 'down') {
				for (let c = 0; c < gridSize; c++) {
					let col = board.map(r => r[c]);
					if (dir === 'down') col.reverse();
					col = operate(col);
					if (dir === 'down') col.reverse();
					for (let r = 0; r < gridSize; r++) board[r][c] = col[r];
				}
			} else if (dir === 'counterclockwise') {
				['left', 'down', 'right', 'up'].forEach(d => move(d));
				return;
			} else if (dir === 'clockwise') {
				['right', 'down', 'left', 'up'].forEach(d => move(d));
				return;
			}
			if (JSON.stringify(board) !== before) addRandomTile();
			draw();
			checkGameOver();
		}

		function checkGameOver() {
			for (let r = 0; r < gridSize; r++) {
				for (let c = 0; c < gridSize; c++) {
					if (board[r][c] === 0) return;
					if (r < gridSize - 1 && board[r][c] === board[r + 1][c]) return;
					if (c < gridSize - 1 && board[r][c] === board[r][c + 1]) return;
				}
			}
			isGameOver = true;
			ui.overlayTitle.textContent = strings.gameOver;
			ui.overlayMsg.textContent = `${strings.score}: ${score}`;
			ui.overlay.style.display = 'flex';
		}

		// Events
		ctx.scope.on(ui.btnPlay,    'click', () => { ui.menu.style.display = 'none'; ui.game.style.display = ''; });
		ctx.scope.on(ui.btnExit,    'click', () => { ui.menu.style.display = ''; ui.game.style.display = 'none'; });
		ctx.scope.on(ui.btnRestart, 'click', restart);
		ctx.scope.on(ui.overlayRestart, 'click', restart);
		ctx.scope.on(ui.slider,     'input', () => { gridSize = parseInt(ui.slider.value, 10); restart(); });
		ui.controls.forEach(btn => {
			ctx.scope.on(btn, 'click', () => move(btn.dataset.dir));
		});

		ctx.scope.on(document, 'keydown', (e) => {
			if (!ctx.root.isConnected) return;
			const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
			if (map[e.key]) { e.preventDefault(); move(map[e.key]); }
			if (e.key === 'r' || e.key === 'R') restart();
		});

		restart();
		return { restart };
	}
};
