export const game2048App = {
	id: 'game-2048',
	title: '2048',
	icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,3H5C3.89,3,3,3.89,3,5V19C3,20.11,3.89,21,5,21H19C20.11,21,21,20.11,21,19V5C21,3.89,20.11,3,19,3Z M11,11H7V7H11V11Z M17,11H13V7H17V11Z M11,17H7V13H11V17Z M17,17H13V13H17V17Z"/></svg>`,
	iconColor: '#ffc107',
	headerColor: '#ffc107',
	type: 'game',
	content: `
		<style>
			/* Styles 2048 */
			#game-2048-board {
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
			.tile[data-value="2"] {
				background: #eee4da;
			}

			.tile[data-value="4"] {
				background: #ede0c8;
			}

			.tile[data-value="8"] {
				background: #f2b179;
				color: #f9f6f2;
			}

			.tile[data-value="16"] {
				background: #f59563;
				color: #f9f6f2;
			}

			.tile[data-value="32"] {
				background: #f67c5f;
				color: #f9f6f2;
			}

			.tile[data-value="64"] {
				background: #f65e3b;
				color: #f9f6f2;
			}

			.tile[data-value="128"] {
				background: #edcf72;
				color: #f9f6f2;
			}

			.tile[data-value="256"] {
				background: #edcc61;
				color: #f9f6f2;
			}

			.tile[data-value="512"] {
				background: #edc850;
				color: #f9f6f2;
			}

			.tile[data-value="1024"] {
				background: #edc53f;
				color: #f9f6f2;
			}

			.tile[data-value="2048"] {
				background: #edc22e;
				color: #f9f6f2;
			}

			.tile[data-value="4096"] {
				background: #9e70c9ff;
				color: #f9f6f2;
			}

			.tile[data-value="8192"] {
				background: #9e70c9ff;
				color: #f9f6f2;
			}

			.tile[data-value="16384"] {
				background: #9e70c9ff;
				color: #f9f6f2;
			}

			.tile[data-value="32768"] {
				background: #781fcaff;
				color: #f9f6f2;
			}

			.tile[data-value="65536"] {
				background: #781fcaff;
				color: #f9f6f2;
			}

			.tile[data-value="32768"] {
				background: #781fcaff;
				color: #f9f6f2;
			}

			.slider-container {
				margin: 10px 0;
				display: flex;
				align-items: center;
				gap: 8px;
				color: #000;
			}
			.slider-container input[type="range"] {
				width: 100%;
			}
		</style>
		<div class="game-container">
			<div class="game-score">Score: <span id="2048-score">0</span></div>
			<div class="game-extra-controls">
				<button id="2048-restart-btn">Restart</button>
			</div>

			<div class="slider-container">
				<label for="grid-size-slider">Grid size :</label>
				<input type="range" id="grid-size-slider" min="3" max="8" value="4" step="1">
				<span id="grid-size-value">4×4</span>
			</div>

			<div id="game-2048-board"></div>

			<div id="2048-controls" class="game-controls">
				<button class="left" data-dir="counterclockwise" title="rotate counterclockwise"><svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.5 20.5C17.1944 20.5 21 16.6944 21 12C21 7.30558 17.1944 3.5 12.5 3.5C7.80558 3.5 4 7.30558 4 12C4 13.5433 4.41128 14.9905 5.13022 16.238M1.5 15L5.13022 16.238M6.82531 12.3832L5.47107 16.3542L5.13022 16.238" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></button>
				<button class="up" data-dir="up", title="up">▲</button>
				<button class="right" data-dir="clockwise" title="rotate clockwise"><svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.5 20.5C6.80558 20.5 3 16.6944 3 12C3 7.30558 6.80558 3.5 11.5 3.5C16.1944 3.5 20 7.30558 20 12C20 13.5433 19.5887 14.9905 18.8698 16.238M22.5 15L18.8698 16.238M17.1747 12.3832L18.5289 16.3542L18.8698 16.238" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></button>
				<button class="left" data-dir="left" title="left">◄</button>
				<button class="down" data-dir="down" title="down">▼</button>
				<button class="right" data-dir="right" title="right">►</button>
			</div>
		</div>
	`,
	init: function(windowId) {
		const $window = $(`#${windowId}`);
		const boardEl = $window.find('#game-2048-board')[0];
		const scoreEl = $window.find('#2048-score')[0];
		const restartBtn = $window.find('#2048-restart-btn')[0];
		const gridSlider = $window.find('#grid-size-slider');
		const gridLabel = $window.find('#grid-size-value');
		
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
			boardEl.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
			boardEl.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
			gridLabel.text(`${gridSize}×${gridSize}`);

			// Ajuste la taille du texte des tuiles (plus petite pour grandes grilles)
			const fontSize = `${Math.max(0.5, Math.max(2.5 - gridSize * 0.2, 0.5))}em`;
			$window.find('#game-2048-board').css('font-size', fontSize);
		}

		function drawBoard() {
			boardEl.innerHTML = '';
			scoreEl.textContent = score;
			for (let r = 0; r < gridSize; r++) {
				for (let c = 0; c < gridSize; c++) {
					const value = board[r][c];
					const tile = document.createElement('div');
					tile.className = 'tile';
					if (value > 0) {
						tile.textContent = value;
						tile.dataset.value = value;
					}
					boardEl.appendChild(tile);
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
			const msg = document.createElement('div');
			msg.textContent = `Game Over! Score: ${score}`;
			msg.style = "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(255,255,255,0.9);padding:20px;border-radius:8px;z-index:1000;text-align:center;color:#776e65;font-weight:bold;";
			boardEl.appendChild(msg);
		}

		// Événements
		$window.find('#2048-controls button').on('click', function () {
			move($(this).data('dir'));
		});

		restartBtn.addEventListener('click', restartGame);

		gridSlider.on('input', function () {
			gridSize = parseInt(this.value);
			restartGame();
		});

		// Clavier
		const keyHandler = (e) => {
			if (e.key === 'ArrowUp') move('up');
			if (e.key === 'ArrowDown') move('down');
			if (e.key === 'ArrowLeft') move('left');
			if (e.key === 'ArrowRight') move('right');
		};
		document.addEventListener('keydown', keyHandler);

		const observer = new MutationObserver(() => {
			if (!document.body.contains(boardEl)) {
				document.removeEventListener('keydown', keyHandler);
				observer.disconnect();
			}
		});
		observer.observe(document.body, { childList: true, subtree: true });

		restartGame();

		// API exposée
		return {
			pause: () => {  },
			resume: () => {  },
			restart: () => { resetGame(); }
		};
	}
};

