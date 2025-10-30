export const gameFlappyBirdApp = {
    id: 'game-flappy-bird',
    title: 'Flappy Bird',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 6.5c-.7.3-1.4.6-2 .6-.6 0-1.2-.2-1.7-.6-.5-.4-1.2-.7-2-.7-1 0-1.8.4-2.4 1.1-.6.7-1 1.6-1 2.8 0 .2 0 .4.1.6C6.9 12 5 13.8 5 16v1h12v-1c0-1 .6-1.8 1.4-2.4.7-.5 1.6-.8 2.6-.8V9c0-.8-.2-1.4-.8-2.1-.4-.4-1.1-.9-1.8-.4z"/></svg>`,
    iconColor: '#ff6b6b',
    headerColor: '#ff6b6b',
    type: 'game',
    content: `
      <div class="game-container" style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:8px;">
        <div style="display:flex;align-items:center;gap:12px;width:100%;justify-content:space-between;">
          <div>
            <strong>Flappy Bird</strong>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span id="flappy-bird-score" style="font-weight:bold">Score: 0</span>
          </div>
        </div>

        <div style="position:relative;width:100%;max-width:600px;">
          <canvas id="flappy-canvas" class="game-canvas" style="width:100%;height:420px;background:#70c5ce;border-radius:8px;display:block;"></canvas>

          <div style="position:absolute;left:8px;top:8px;display:flex;flex-direction:column;gap:6px;">
            <button id="flappy-bird-pause-btn" class="pause-btn" style="padding:6px 10px;border-radius:6px;">Pause</button>
            <button id="flappy-bird-restart-btn" style="padding:6px 10px;border-radius:6px;">Restart</button>
          </div>
        </div>

        <div id="flappy-controls" class="game-controls" style="display:flex;gap:8px;align-items:center;">
          <button id="flappy-flap-btn" style="padding:8px 12px;border-radius:6px;">Flap (Space / Click)</button>
          <small>Appuie sur <strong>ESPACE</strong> ou clique / tape pour battre des ailes</small>
        </div>
      </div>
    `,
    init: function(windowId) {
        const $window = $(`#${windowId}`);
        const canvas = $window.find('#flappy-canvas')[0];
        const scoreEl = $window.find('#flappy-bird-score')[0];
        const pauseBtn = $window.find('#flappy-bird-pause-btn')[0];
        const restartBtn = $window.find('#flappy-bird-restart-btn')[0];
        const flapBtn = $window.find('#flappy-flap-btn')[0];

        // Canvas setup & scaling for high-DPI
        const ctx = canvas.getContext('2d');
        function resizeCanvas() {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.max(300, Math.floor(rect.width * dpr));
            canvas.height = Math.max(200, Math.floor(rect.height * dpr));
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Game state
        let running = true;
        let isGameOver = false;
        let score = 0;

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

        // Helpers
        function resetGame() {
            score = 0;
            isGameOver = false;
            running = true;
            bird.x = 80;
            bird.y = canvas.height / (window.devicePixelRatio || 1) / 2;
            bird.vel = 0;
            pipes.length = 0;
            lastPipeTime = performance.now();
            lastTime = performance.now();
            updateScoreEl();
        }

        function updateScoreEl() {
            if (scoreEl) scoreEl.textContent = `Score: ${score}`;
        }

        function spawnPipe() {
            const canvasH = canvas.height / (window.devicePixelRatio || 1);
            // gap's center random but within limits
            const margin = 40;
            const gapCenter = margin + Math.random() * (canvasH - ground.height - margin * 2 - pipeGap) + pipeGap/2;
            const top = gapCenter - pipeGap / 2;
            const bottom = gapCenter + pipeGap / 2;
            pipes.push({
                x: canvas.width / (window.devicePixelRatio || 1) + 20,
                top: top,
                bottom: bottom,
                passed: false
            });
        }

        function flap() {
            if (isGameOver) {
                // restart on flap if game over
                resetGame();
                return;
            }
            bird.vel = bird.flapStrength;
        }

        // Input handlers
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (!running) return;
                flap();
            } else if (e.code === 'KeyP') {
                togglePause();
            }
        });
        canvas.addEventListener('mousedown', () => { if (running) flap(); });
        canvas.addEventListener('touchstart', (e) => { e.preventDefault(); if (running) flap(); }, {passive:false});
        flapBtn && flapBtn.addEventListener('click', () => flap());

        // Pause / restart buttons
        function togglePause() {
            running = !running;
            pauseBtn.textContent = running ? 'Pause' : 'Resume';
            if (running) {
                lastTime = performance.now();
                loop();
            }
        }
        pauseBtn && pauseBtn.addEventListener('click', () => togglePause());
        restartBtn && restartBtn.addEventListener('click', () => resetGame());

        // Collision detection (circle vs rect)
        function circleRectCollision(cx, cy, r, rx, ry, rw, rh) {
            const closestX = Math.max(rx, Math.min(cx, rx + rw));
            const closestY = Math.max(ry, Math.min(cy, ry + rh));
            const dx = cx - closestX;
            const dy = cy - closestY;
            return (dx * dx + dy * dy) < (r * r);
        }

        function update(dt) {
            if (isGameOver) return;

            // Bird physics
            bird.vel += bird.gravity * (dt / 16.6667); // normalize to ~60fps frame
            bird.vel = Math.min(bird.vel, bird.maxDrop);
            bird.y += bird.vel * (dt / 16.6667);
            bird.rotation = Math.max(-0.6, Math.min(1.2, bird.vel / 20));

            // Spawn pipes
            if (performance.now() - lastPipeTime > pipeSpawnInterval) {
                spawnPipe();
                lastPipeTime = performance.now();
            }

            // Move pipes
            const movePx = pipeSpeed * (dt / 1000);
            for (let i = pipes.length - 1; i >= 0; i--) {
                const p = pipes[i];
                p.x -= movePx;

                // Check pass for scoring
                if (!p.passed && p.x + pipeWidth < bird.x - bird.radius) {
                    p.passed = true;
                    score += 1;
                    updateScoreEl();
                }

                // Remove off-screen
                if (p.x + pipeWidth < -50) pipes.splice(i, 1);
            }

            // Collisions with pipes
            const birdX = bird.x;
            const birdY = bird.y;
            for (const p of pipes) {
                // top pipe rect: x, 0, pipeWidth, p.top
                // bottom pipe rect: x, p.bottom, pipeWidth, canvasH - p.bottom - ground.height
                const canvasH = canvas.height / (window.devicePixelRatio || 1);
                if (circleRectCollision(birdX, birdY, bird.radius, p.x, 0, pipeWidth, p.top) ||
                    circleRectCollision(birdX, birdY, bird.radius, p.x, p.bottom, pipeWidth, canvasH - p.bottom - ground.height)) {
                    gameOver();
                    return;
                }
            }

            // Collisions with ground or ceiling
            const canvasH = canvas.height / (window.devicePixelRatio || 1);
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
            pauseBtn.textContent = 'Pause';
            // show simple flash
            flashGameOver();
        }

        function flashGameOver() {
            const prevFill = ctx.fillStyle;
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
            ctx.fillStyle = prevFill;
            // draw game over text
            ctx.save();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 28px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over — Click Restart or flap to play', (canvas.width / (window.devicePixelRatio || 1)) / 2, (canvas.height / (window.devicePixelRatio || 1)) / 2);
            ctx.restore();
        }

        function draw() {
            // Clear
            const w = canvas.width / (window.devicePixelRatio || 1);
            const h = canvas.height / (window.devicePixelRatio || 1);
            // sky
            ctx.clearRect(0, 0, w, h);
            // background gradient
            const g = ctx.createLinearGradient(0, 0, 0, h);
            g.addColorStop(0, '#70c5ce');
            g.addColorStop(1, '#9be7ff');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, h);

            // Pipes
            for (const p of pipes) {
                // top pipe
                ctx.fillStyle = '#2ecc71';
                ctx.fillRect(p.x, 0, pipeWidth, p.top);
                // bottom pipe
                ctx.fillRect(p.x, p.bottom, pipeWidth, h - ground.height - p.bottom);

                // pipe caps (simple)
                ctx.fillStyle = '#27ae60';
                ctx.fillRect(p.x - 6, p.top - 12, pipeWidth + 12, 12); // top cap
                ctx.fillRect(p.x - 6, p.bottom, pipeWidth + 12, 12); // bottom cap
            }

            // Ground
            ctx.fillStyle = '#DEB887';
            ctx.fillRect(0, h - ground.height, w, ground.height);

            // Bird (circle + eye)
            ctx.save();
            ctx.translate(bird.x, bird.y);
            ctx.rotate(bird.rotation);
            // body
            ctx.beginPath();
            ctx.fillStyle = '#ffdf4a';
            ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
            ctx.fill();
            // wing (simple)
            ctx.beginPath();
            ctx.fillStyle = '#f6c85f';
            ctx.ellipse(-4, 4, 6, 3.5, -0.6, 0, Math.PI * 2);
            ctx.fill();
            // eye
            ctx.beginPath();
            ctx.fillStyle = '#000';
            ctx.arc(6, -4, 3.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // If paused overlay
            if (!running && !isGameOver) {
                ctx.save();
                ctx.fillStyle = 'rgba(0,0,0,0.25)';
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 40px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('Paused', w / 2, h / 2);
                ctx.restore();
            }

            // If game over message
            if (isGameOver) {
                ctx.save();
                ctx.fillStyle = 'rgba(0,0,0,0.45)';
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 30px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('Game Over', w / 2, h / 2 - 10);
                ctx.font = '16px sans-serif';
                ctx.fillText(`Score: ${score} — Press Restart or flap to play`, w / 2, h / 2 + 24);
                ctx.restore();
            }
        }

        // Main loop
        function loop(now) {
            if (!now) now = performance.now();
            const dt = now - lastTime;
            lastTime = now;

            if (running) {
                update(dt);
                draw();
            } else {
                // draw once to show paused/gameover overlay
                draw();
            }

            if (running) {
                requestAnimationFrame(loop);
            }
        }

        // Start
        resetGame();
        // initial pipe to avoid instant gap
        spawnPipe();
        lastPipeTime = performance.now();

        // begin animation
        requestAnimationFrame(loop);

        // expose a small API on the window for debugging if needed
        return {
            pause: () => { if (running) togglePause(); },
            resume: () => { if (!running && !isGameOver) togglePause(); },
            restart: resetGame
        };
    }
};
