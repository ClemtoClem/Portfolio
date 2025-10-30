export const snakeApp = {
    id: 'snake-game',
    title: 'Snake',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14,4C14,2.9,13.1,2,12,2S10,2.9,10,4C10,5.1,10.9,6,12,6S14,5.1,14,4Z M19.7,13.2C19.1,12.6,18.1,12.5,17.4,13C16.8,13.5,16.7,14.5,17.2,15.2C17.7,15.8,18.8,16,19.4,15.5C20,14.9,20.2,13.9,19.7,13.2Z M18,8L15,9L12,12L10,14L8,16L5,17L4,20H7L9,18L11,16L13,14L16,11L18,9.5L20,8H18Z"/></svg>`,
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
            <canvas id="snake-canvas" class="game-canvas"></canvas>
            <div id="snake-controls" class="game-controls">
                <button class="up" data-dir="up">▲</button>
                <button class="left" data-dir="left">◄</button>
                <button class="down" data-dir="down">▼</button>
                <button class="right" data-dir="right">►</button>
            </div>
        </div>
    `,
    init: function(windowId) {
        const $window = $(`#${windowId}`);
        const canvas = $window.find('#snake-canvas')[0];
        const scoreEl = $window.find('#snake-score')[0];
        const pauseBtn = $window.find('#snake-pause-btn')[0];
        const restartBtn = $window.find('#snake-restart-btn')[0];
        const ctx = canvas.getContext('2d');
        
        // Ajuster la taille du canvas
        const canvasSize = $window.find('.game-canvas').width();
        canvas.width = canvasSize;
        canvas.height = canvasSize;

        const gridSize = 20;
        let snake, food, direction, score, gameLoop, isGameOver, isPaused;

        function restartGame() {
            clearInterval(gameLoop);
            snake = [{ x: 10, y: 10 }];
            food = {};
            direction = { x: 0, y: 0 };
            score = 0;
            isGameOver = false;
            isPaused = false;
            scoreEl.textContent = '0';
            pauseBtn.textContent = 'Pause';
            pauseBtn.classList.remove('paused');

            placeFood();
            gameLoop = setInterval(update, 100);
        }

        function placeFood() {
            food = {
                x: Math.floor(Math.random() * gridSize),
                y: Math.floor(Math.random() * gridSize)
            };
        }

        function togglePause() {
            if (isGameOver) return;
            isPaused = !isPaused;
            if (isPaused) {
                pauseBtn.textContent = 'Resume';
                pauseBtn.classList.add('paused');
                // Afficher l'écran de pause
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'white';
                ctx.font = '30px Roboto';
                ctx.textAlign = 'center';
                ctx.fillText('Paused', canvas.width / 2, canvas.height / 2);
            } else {
                pauseBtn.textContent = 'Pause';
                pauseBtn.classList.remove('paused');
            }
        }

        function update() {
            if (isGameOver || isPaused) return;

            const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
            
            // Conditions de Game Over
            if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                isGameOver = true;
                clearInterval(gameLoop);
                ctx.fillStyle = 'white';
                ctx.font = '30px Roboto';
                ctx.textAlign = 'center';
                ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
                return;
            }

            snake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
                score++;
                scoreEl.textContent = score;
                placeFood();
            } else {
                snake.pop();
            }

            draw();
        }

        function draw() {
            ctx.fillStyle = '#111';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cellSize = canvas.width / gridSize;
            
            // Dessiner le serpent
            ctx.fillStyle = '#8BC34A';
            snake.forEach(segment => {
                ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize - 1, cellSize - 1);
            });

            // Dessiner la nourriture
            ctx.fillStyle = '#f44336';
            ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize - 1, cellSize - 1);
        }

        function changeDirection(newDir) {
            if (isGameOver || isPaused) return;
            if (direction.x === 0 && direction.y === 0 && isPaused) isPaused = false; // Démarrer le jeu au premier mouvement si en pause
            
            if (newDir === 'up' && direction.y === 0) direction = { x: 0, y: -1 };
            if (newDir === 'down' && direction.y === 0) direction = { x: 0, y: 1 };
            if (newDir === 'left' && direction.x === 0) direction = { x: -1, y: 0 };
            if (newDir === 'right' && direction.x === 0) direction = { x: 1, y: 0 };
        }

        // Contrôles
        $window.find('#snake-controls button').on('click', function() {
            changeDirection($(this).data('dir'));
        });
        pauseBtn.addEventListener('click', togglePause);
        restartBtn.addEventListener('click', restartGame);

        // Support Clavier
        const keyHandler = (e) => {
            if (e.key === 'p' || e.key === 'P') togglePause(); // Pause avec 'p'
            if (e.key === 'ArrowUp') changeDirection('up');
            if (e.key === 'ArrowDown') changeDirection('down');
            if (e.key === 'ArrowLeft') changeDirection('left');
            if (e.key === 'ArrowRight') changeDirection('right');
        };
        document.addEventListener('keydown', keyHandler);

        // Nettoyage lors de la fermeture de la fenêtre
        const observer = new MutationObserver((mutations) => {
            if (!document.body.contains(canvas)) {
                clearInterval(gameLoop);
                document.removeEventListener('keydown', keyHandler);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Démarrer le jeu
        restartGame();
    }
};

