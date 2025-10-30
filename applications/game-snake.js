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
      <div class="status-panel">
        <h4>Effets actifs</h4>
        <ul id="snake-effects"></ul>
      </div>
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
    const effectsList = $window.find('#snake-effects')[0];
    const ctx = canvas.getContext('2d');

    // Ajuster la taille du canvas : prend la largeur de l'élément .game-canvas
    const canvasSize = Math.max(200, $window.find('.game-canvas').width() || 400); // fallback
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const gridSize = 20;
    let snake, food, direction, score, gameLoopId, isGameOver, isPaused;
    let cellSize, growBy = 0;
    let baseSpeed = 100;
    let speed = baseSpeed;
    let walls = [];
    let level = 1;
    const pointsPerLevel = 5;

    // ⚡ effets actifs
    const activeEffects = [];

    // Types de pommes
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

    // ===================== EFFETS =====================

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

    // =====================================================

    function setGameInterval() {
      if (gameLoopId) clearInterval(gameLoopId);
      gameLoopId = setInterval(() => {
        update();
        updateEffects();
      }, speed);
    }

    function restartGame() {
      if (gameLoopId) clearInterval(gameLoopId);
      snake = [{ x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }];
      direction = { x: 1, y: 0 };
      food = null;
      score = 0;
      growBy = 0;
      isGameOver = false;
      isPaused = false;
      speed = baseSpeed;
      level = 1;
      walls = [];
      activeEffects.length = 0;
      scoreEl.textContent = String(score);
      $(effectsList).empty();
      pauseBtn.textContent = 'Pause';
      pauseBtn.classList.remove('paused');
      cellSize = canvas.width / gridSize;
      placeFood();
      setGameInterval();
      draw();
    }

    function placeFood() {
      // Génère un emplacement valide (ni sur le serpent, ni sur un mur)
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
      // Ajoute quelques murs selon le niveau (mais on évite d'en ajouter trop)
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

    function togglePause() {
      if (isGameOver) return;
      isPaused = !isPaused;
      if (isPaused) {
        pauseBtn.textContent = 'Resume';
        pauseBtn.classList.add('paused');
        draw();
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = `${Math.floor(canvas.width / 15)}px Roboto`;
        ctx.textAlign = 'center';
        ctx.fillText('Paused', canvas.width / 2, canvas.height / 2);
      } else {
        pauseBtn.textContent = 'Pause';
        pauseBtn.classList.remove('paused');
      }
    }

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
        setGameInterval();
      }
    }

    function update() {
      if (isGameOver || isPaused) return;

      const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

      // conditions de collision: murs, bordures, sépam etc.
      const hitSelf = snake.some(s => s.x === head.x && s.y === head.y);
      const hitWall = walls.some(w => w.x === head.x && w.y === head.y);
      if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize || hitSelf || hitWall) {
        gameOver();
        return;
      }

      snake.unshift(head);

      // manger la nourriture ?
      if (food && head.x === food.x && head.y === food.y) {
        // appliquer effets selon le type
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

      // dessiner serpent : tête plus claire
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
      ctx.fillRect(0, canvas.height - Math.floor(cellSize * 1.2), canvas.width, Math.floor(cellSize * 1.2));
      ctx.fillStyle = '#fff';
      ctx.font = `${Math.floor(cellSize * 0.8)}px Roboto`;
      ctx.textAlign = 'left';
      ctx.fillText(`Level: ${level}`, 8, canvas.height - Math.floor(cellSize * 0.2));
      ctx.textAlign = 'right';
      ctx.fillText(`Score: ${score}`, canvas.width - 8, canvas.height - Math.floor(cellSize * 0.2));
    }

    function changeDirection(newDir) {
      if (isGameOver) return;
      // empêcher 180°
      if (newDir === 'up' && direction.y === 1) return;
      if (newDir === 'down' && direction.y === -1) return;
      if (newDir === 'left' && direction.x === 1) return;
      if (newDir === 'right' && direction.x === -1) return;

      if (newDir === 'up' && direction.y === 0) direction = { x: 0, y: -1 };
      if (newDir === 'down' && direction.y === 0) direction = { x: 0, y: 1 };
      if (newDir === 'left' && direction.x === 0) direction = { x: -1, y: 0 };
      if (newDir === 'right' && direction.x === 0) direction = { x: 1, y: 0 };

      if (isPaused) togglePause();
    }

    // contrôles tactiles / boutons
    $window.find('#snake-controls button').on('click', function() {
      changeDirection($(this).data('dir'));
    });

    pauseBtn.addEventListener('click', togglePause);
    restartBtn.addEventListener('click', restartGame);

    // clavier
    const keyHandler = (e) => {
      if (e.key === 'p' || e.key === 'P') { togglePause(); return; }
      if (e.key === 'ArrowUp' || e.key === 'w') changeDirection('up');
      if (e.key === 'ArrowDown' || e.key === 's') changeDirection('down');
      if (e.key === 'ArrowLeft' || e.key === 'a') changeDirection('left');
      if (e.key === 'ArrowRight' || e.key === 'd') changeDirection('right');
      if (e.key === 'r') restartGame();
      if (e.key === 'p') togglePause();
    };
    document.addEventListener('keydown', keyHandler);

    // nettoyage si canvas retiré du DOM
    const observer = new MutationObserver(() => {
      if (!document.body.contains(canvas)) {
        clearInterval(gameLoopId);
        document.removeEventListener('keydown', keyHandler);
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // commencer
    restartGame();
  }
};
