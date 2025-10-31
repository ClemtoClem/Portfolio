export const game2048App = {
	id: 'game-2048',
	title: '2048',
	icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,3H5C3.89,3,3,3.89,3,5V19C3,20.11,3.89,21,5,21H19C20.11,21,21,20.11,21,19V5C21,3.89,20.11,3,19,3Z M11,11H7V7H11V11Z M17,11H13V7H17V11Z M11,17H7V13H11V17Z M17,17H13V13H17V17Z"/></svg>`,
	iconColor: '#ffc107',
	headerColor: '#ffc107',
	type: 'game',
	content: `
		<div class="game-container">
			<div class="game-score">Score: <span id="2048-score">0</span></div>
			<div class="game-extra-controls">
				<button id="2048-restart-btn">Restart</button>
			</div>
			<div id="game-2048-board">
				<!-- Les tuiles seront générées ici -->
			</div>
			<div id="2048-controls" class="game-controls">
				<button class="up" data-dir="up">▲</button>
				<button class="left" data-dir="left">◄</button>
				<button class="down" data-dir="down">▼</button>
				<button class="right" data-dir="right">►</button>
			</div>
		</div>
	`,
	init: function(windowId) {
		const $window = $(`#${windowId}`);
		const boardEl = $window.find('#game-2048-board')[0];
		const scoreEl = $window.find('#2048-score')[0];
		const restartBtn = $window.find('#2048-restart-btn')[0];
		
		let board = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
		let score = 0;
		let isGameOver = false;

		function restartGame() {
			board = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
			score = 0;
			isGameOver = false;
			addRandomTile();
			addRandomTile();
			drawBoard();
		}

		function drawBoard() {
			boardEl.innerHTML = ''; // Efface le plateau (y compris le message de game over)
			scoreEl.textContent = score;
			for (let r = 0; r < 4; r++) {
				for (let c = 0; c < 4; c++) {
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
			for (let r = 0; r < 4; r++) {
				for (let c = 0; c < 4; c++) {
					if (board[r][c] === 0) emptyTiles.push({r, c});
				}
			}
			if (emptyTiles.length > 0) {
				const {r, c} = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
				board[r][c] = Math.random() < 0.9 ? 2 : 4;
			}
		}

		function slide(row) {
			let arr = row.filter(val => val);
			let missing = 4 - arr.length;
			let zeros = Array(missing).fill(0);
			return arr.concat(zeros);
		}

		function combine(row) {
			for (let i = 0; i < 3; i++) {
				if (row[i] !== 0 && row[i] === row[i+1]) {
					row[i] *= 2;
					row[i+1] = 0;
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

			for (let i = 0; i < 4; i++) {
				if (dir === 'left' || dir === 'right') {
					let row = board[i];
					if (dir === 'right') row.reverse();
					row = operate(row);
					if (dir === 'right') row.reverse();
					board[i] = row;
				}
				if (dir === 'up' || dir === 'down') {
					let col = [board[0][i], board[1][i], board[2][i], board[3][i]];
					if (dir === 'down') col.reverse();
					col = operate(col);
					if (dir === 'down') col.reverse();
					for (let r = 0; r < 4; r++) board[r][i] = col[r];
				}
			}
			
			if(JSON.stringify(board) !== oldBoard) {
				addRandomTile();
			}
			drawBoard();
			checkGameOver();
		}

		function checkGameOver() {
			for (let r = 0; r < 4; r++) {
				for (let c = 0; c < 4; c++) {
					if (board[r][c] === 0) return; // Peut toujours jouer
					if (r < 3 && board[r][c] === board[r+1][c]) return; // Peut fusionner
					if (c < 3 && board[r][c] === board[r][c+1]) return; // Peut fusionner
				}
			}
			isGameOver = true;
			// Afficher le message de Game Over dans l'interface
			const gameOverMsg = document.createElement('div');
			gameOverMsg.textContent = 'Game Over! Score: ' + score;
			gameOverMsg.style = "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(255,255,255,0.9);padding:20px;border-radius:8px;z-index:1000;text-align:center;color:#776e65;font-weight:bold;";
			boardEl.appendChild(gameOverMsg);
		}

		// Contrôles
		$window.find('#2048-controls button').on('click', function() {
			move($(this).data('dir'));
		});
		restartBtn.addEventListener('click', restartGame);

		// Support Clavier
		const keyHandler = (e) => {
			if (e.key === 'ArrowUp') move('up');
			if (e.key === 'ArrowDown') move('down');
			if (e.key === 'ArrowLeft') move('left');
			if (e.key === 'ArrowRight') move('right');
		};
		document.addEventListener('keydown', keyHandler);

		// Nettoyage
		const observer = new MutationObserver(() => {
			if (!document.body.contains(boardEl)) {
				document.removeEventListener('keydown', keyHandler);
				observer.disconnect();
			}
		});
		observer.observe(document.body, { childList: true, subtree: true });

		// Démarrer le jeu
		restartGame();
	}
};

