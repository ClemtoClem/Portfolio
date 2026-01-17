const VERSION = '1.0.0';
export const game2048App = {
	id: 'game-2048',
	title: '2048',
	version: VERSION,
	icon: `<svg viewBox="0 0 24 24"><path d="M19,3H5C3.89,3,3,3.89,3,5V19C3,20.11,3.89,21,5,21H19C20.11,21,21,20.11,21,19V5C21,3.89,20.11,3,19,3Z M11,11H7V7H11V11Z M17,11H13V7H17V11Z M11,17H7V13H11V17Z M17,17H13V13H17V17Z"/></svg>`,
	iconColor: '#ffc107',
	headerColor: '#ffc107',
	type: 'game',
	style: `
		:root {
			--primary-color: #ffc107;
			--primary-dark-color: #866503;
			--primary-background-color: #fdeaaf;
		}
		.app-content { padding: 0px; }
		
		#board-2048 {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			grid-template-rows: repeat(4, 1fr);
			gap: 10px;
			background: #bbada0;
			padding: 10px;
			border-radius: 8px;
			width: 100%;
			max-width: 400px;
			aspect-ratio: 1 / 1;
			box-sizing: border-box;
			position: relative;
			
			font-size: 2em;
			font-weight: bold;
		}

		.tile {
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 4px;
			color: #776e65;
			background: #cdc1b4;
		}

		/* Tuiles 2048 avec couleurs */
		.tile[data-value="2"] { background: #eee4da; }
		.tile[data-value="4"] { background: #ede0c8; }
		.tile[data-value="8"] { background: #f2b179; color: #f9f6f2; }
		.tile[data-value="16"] { background: #f59563; color: #f9f6f2; }
		.tile[data-value="32"] { background: #f67c5f; color: #f9f6f2; }
		.tile[data-value="64"] { background: #f65e3b; color: #f9f6f2; }
		.tile[data-value="128"] { background: #edcf72; color: #f9f6f2; }
		.tile[data-value="256"] { background: #edcc61; color: #f9f6f2; }
		.tile[data-value="512"] { background: #edc850; color: #f9f6f2; }
		.tile[data-value="1024"] { background: #edc53f; color: #f9f6f2; }
		.tile[data-value="2048"] { background: #edc22e; color: #f9f6f2; }
		.tile[data-value="4096"], .tile[data-value="8192"], .tile[data-value="16384"] { background: #9e70c9ff; color: #f9f6f2; }
		.tile[data-value="32768"], .tile[data-value="65536"] { background: #781fcaff; color: #f9f6f2; }
		`,
	content: {
		'en-US': `
			<div class="game-container">
				<div id="game-main-menu" class="game-menu-screen">
					<h1 class="game-title">2048</h1>
					<div class="game-version">Version ${VERSION}</div>
					<button id="game-play-btn" class="game-btn">PLAY</button>
				</div>
				<div id="game-content-2048" class="game-content" style="display:none;">
					<div class="game-header">
						<div class="game-top-row">
							<button class="game-action-btn" id="game-exit-btn">
								<svg viewBox="0 0 24 24"><path d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12ZM3 18C3 17.4477 3.44772 17 4 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18Z"></path></svg>
								Menu
							</button>
							<div class="game-score-board">
								<div class="game-score">Score: <span id="score-2048">0</span></div>
							</div>
							<button class="game-action-btn" id="restart-btn-2048" title="Restart (R)">
								<svg viewBox="0 0 100 100"><path d="M76.5,58.3c0,0.1,0,0.2-0.1,0.2c-0.3,1.1-0.7,2.2-1.1,3.3c-0.5,1.2-1,2.3-1.6,3.4c-1.2,2.2-2.7,4.2-4.5,6 c-1.7,1.8-3.7,3.4-5.9,4.7c-2.2,1.3-4.5,2.3-7,3c-2.5,0.7-5.1,1.1-7.7,1.1C32.8,80,20,67.2,20,51.3s12.8-28.6,28.6-28.6 c5.3,0,10.3,1.5,14.6,4c0,0,0,0,0.1,0c2.1,1.2,4,2.7,5.6,4.4c0.5,0.4,0.8,0.7,1.2,1.2c0.9,0.8,1.6,0.3,1.6-0.9V22c0-1.1,0.9-2,2-2h4 c1.1,0,2,0.9,2.2,2v24.5c0,0.9-0.8,1.8-1.8,1.8H53.6c-1.1,0-1.9-0.8-1.9-1.9v-4.2c0-1.1,0.9-2,2-2h9.4c0.8,0,1.4-0.2,1.7-0.7 c-3.6-5-9.6-8.3-16.2-8.3c-11.1,0-20.1,9-20.1,20.1s9,20.1,20.1,20.1c8.7,0,16.1-5.5,18.9-13.3c0,0,0.3-1.8,1.7-1.8 c1.4,0,4.8,0,5.7,0c0.8,0,1.6,0.6,1.6,1.5C76.5,58,76.5,58.1,76.5,58.3z"></path></svg>
							</button>
						</div>
						<div class="game-top-row">
							<label for="grid-size-slider">Grid size :</label>
							<input type="range" id="grid-size-slider" min="3" max="8" value="4" step="1">
							<span id="grid-size-value">4×4</span>
						</div>
					</div>

					<div class="game-canvas-wrapper">
						<div id="board-2048"></div>
					</div>
					<div id="controls-2048" class="game-controls">
						<button class="up-left" data-dir="counterclockwise">↺</button>
						<button class="up" data-dir="up">▲</button>
						<button class="up-right" data-dir="clockwise">↻</button>

						<button class="left" data-dir="left">◄</button>
						<button class="center" data-dir="down">▼</button>
						<button class="right" data-dir="right">►</button>
					</div>
				</div>
			</div>
		`,
		'fr-FR': `
			<div class="game-container">
				<div id="game-main-menu" class="game-menu-screen">
					<h1 class="game-title">2048</h1>
					<div class="game-version">Version ${VERSION}</div>
					<button id="game-play-btn" class="game-btn">JOUER</button>
				</div>
				<div id="game-content-2048" class="game-content" style="display:none;">
					<div class="game-header">
						<div class="game-top-row">
							<button class="game-action-btn" id="game-exit-btn">
								<svg viewBox="0 0 24 24"><path d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12ZM3 18C3 17.4477 3.44772 17 4 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18Z"></path></svg>
								Menu
							</button>
							<div class="game-score-board">
								<div class="game-score">Score: <span id="score-2048">0</span></div>
							</div>
							<button class="game-action-btn" id="restart-btn-2048" title="Redémarrer (R)">
								<svg viewBox="0 0 100 100"><path d="M76.5,58.3c0,0.1,0,0.2-0.1,0.2c-0.3,1.1-0.7,2.2-1.1,3.3c-0.5,1.2-1,2.3-1.6,3.4c-1.2,2.2-2.7,4.2-4.5,6 c-1.7,1.8-3.7,3.4-5.9,4.7c-2.2,1.3-4.5,2.3-7,3c-2.5,0.7-5.1,1.1-7.7,1.1C32.8,80,20,67.2,20,51.3s12.8-28.6,28.6-28.6 c5.3,0,10.3,1.5,14.6,4c0,0,0,0,0.1,0c2.1,1.2,4,2.7,5.6,4.4c0.5,0.4,0.8,0.7,1.2,1.2c0.9,0.8,1.6,0.3,1.6-0.9V22c0-1.1,0.9-2,2-2h4 c1.1,0,2,0.9,2.2,2v24.5c0,0.9-0.8,1.8-1.8,1.8H53.6c-1.1,0-1.9-0.8-1.9-1.9v-4.2c0-1.1,0.9-2,2-2h9.4c0.8,0,1.4-0.2,1.7-0.7 c-3.6-5-9.6-8.3-16.2-8.3c-11.1,0-20.1,9-20.1,20.1s9,20.1,20.1,20.1c8.7,0,16.1-5.5,18.9-13.3c0,0,0.3-1.8,1.7-1.8 c1.4,0,4.8,0,5.7,0c0.8,0,1.6,0.6,1.6,1.5C76.5,58,76.5,58.1,76.5,58.3z"></path></svg>
							</button>
						</div>
						<div class="game-top-row">
							<label for="grid-size-slider">Taille :</label>
							<input type="range" id="grid-size-slider" min="3" max="8" value="4" step="1">
							<span id="grid-size-value">4×4</span>
						</div>
					</div>

					<div class="game-canvas-wrapper">
						<div id="board-2048"></div>
					</div>
					<div id="controls-2048" class="game-controls">
						<button class="up-left" data-dir="counterclockwise">↺</button>
						<button class="up" data-dir="up">▲</button>
						<button class="up-right" data-dir="clockwise">↻</button>

						<button class="left" data-dir="left">◄</button>
						<button class="center" data-dir="down">▼</button>
						<button class="right" data-dir="right">►</button>
					</div>
				</div>
			</div>
		`
	},
	init: function (sys, windowId) {
		const $window = $(`#${windowId}`);
		
		const ui = {
			screens: {
				menu: $window.find('#game-main-menu'),
				game: $window.find('#game-content-2048')
			},
			game: {
				board: $window.find('#board-2048'),
				score: $window.find('#score-2048'),
				gridSlider: $window.find('#grid-size-slider'),
				gridLabel: $window.find('#grid-size-value'),
				controls: $window.find('#controls-2048 button')
			},
			buttons: {
				play: $window.find('#game-play-btn'),
				exit: $window.find('#game-exit-btn'),
				restart: $window.find('#restart-btn-2048')
			}
		};
		
		let gridSize = 4;
		let board = [];
		let score = 0;
		let isGameOver = false;

		function createEmptyBoard() {
			return Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
		}

		function restartGame() {
			updateGridCSS();
			board = createEmptyBoard();
			score = 0;
			isGameOver = false;
			addRandomTile();
			addRandomTile();
			drawBoard();
		}

		function updateGridCSS() {
			ui.game.board.css({
				'display': 'grid', // S'assure que le mode grid est actif
				'grid-template-columns': `repeat(${gridSize}, 1fr)`,
				'grid-template-rows': `repeat(${gridSize}, 1fr)`
			});
			ui.game.gridLabel.text(`${gridSize}×${gridSize}`);
			const fontSize = `${Math.max(0.5, Math.max(2.5 - gridSize * 0.2, 0.5))}em`;
			ui.game.board.css('font-size', fontSize);
		}

		function drawBoard() {
			ui.game.board.empty();
			ui.game.score.text(score);
			for (let r = 0; r < gridSize; r++) {
				for (let c = 0; c < gridSize; c++) {
					const value = board[r][c];
					const $tile = $('<div>').addClass('tile');
					if (value > 0) {
						$tile.text(value).attr('data-value', value);
					}
					ui.game.board.append($tile);
				}
			}
		}

		function addRandomTile() {
			let emptyTiles = [];
			for (let r = 0; r < gridSize; r++) {
				for (let c = 0; c < gridSize; c++) {
					if (board[r][c] === 0) emptyTiles.push({ r, c });
				}
			}
			if (emptyTiles.length > 0) {
				const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
				board[r][c] = Math.random() < 0.9 ? 2 : 4;
			}
		}

		function slide(row) {
			let arr = row.filter(v => v);
			let zeros = Array(gridSize - arr.length).fill(0);
			return arr.concat(zeros);
		}

		function combine(row) {
			for (let i = 0; i < gridSize - 1; i++) {
				if (row[i] !== 0 && row[i] === row[i + 1]) {
					row[i] *= 2;
					row[i + 1] = 0;
					score += row[i];
				}
			}
			return row;
		}

		function operate(row) {
			row = slide(row);
			row = combine(row);
			row = slide(row);
			return row;
		}

		function move(dir) {
			if (isGameOver) return;
			const oldBoard = JSON.stringify(board);

			if (dir === 'left' || dir === 'right') {
				for (let r = 0; r < gridSize; r++) {
					let row = board[r].slice();
					if (dir === 'right') row.reverse();
					row = operate(row);
					if (dir === 'right') row.reverse();
					board[r] = row;
				}
			} else if (dir === 'down' || dir === 'up') {
				for (let c = 0; c < gridSize; c++) {
					let col = board.map(row => row[c]);
					if (dir === 'down') col.reverse();
					col = operate(col);
					if (dir === 'down') col.reverse();
					for (let r = 0; r < gridSize; r++) board[r][c] = col[r];
				}
			} else if (dir === 'counterclockwise') {
				move('left');
				move('down');
				move('right');
				move('up');
			} else if (dir === 'clockwise') {
				move('right');
				move('down');
				move('left');
				move('up');
			}

			if (JSON.stringify(board) !== oldBoard) {
				addRandomTile();
			}
			drawBoard();
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
			alert("Game Over! Score: " + score);
		}

		ui.buttons.play.on('click', () => { ui.screens.menu.hide(); ui.screens.game.show(); });
		ui.buttons.exit.on('click', () => { ui.screens.menu.show(); ui.screens.game.hide(); });
		ui.buttons.restart.on('click', () => restartGame());
		ui.game.controls.on('click', function () { move($(this).data('dir')); });
		ui.game.gridSlider.on('input', function () { gridSize = parseInt(this.value); restartGame(); });

		$(document).on('keydown.game2048', (e) => {
			if (e.key === 'ArrowUp') move('up');
			if (e.key === 'ArrowDown') move('down');
			if (e.key === 'ArrowLeft') move('left');
			if (e.key === 'ArrowRight') move('right');
		});

		restartGame();
		return { restart: () => restartGame() };
	}
};