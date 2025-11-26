class Bot {
    constructor(x, y, charge) {
        this.x = x;
        this.y = y;
        this.charge = charge;
    }
}

class Level {
    constructor(map, botX, botY, botCharge, helpMessage = "") {
        this.initMap = map;
        this.initBot = new Bot(botX, botY, botCharge);
        this.helpMessage = helpMessage;
        this.isFinished = false;
        this.finishedTime = 0;
    }

    start() {
        // Deep copy the map and normalize tiles (ensure default properties exist)
        this.map = this.initMap.map(row => row.map(tile => ({ ...tile }))).map(row => row.map(tile => {
            // Ensure type exists
            tile.type = tile.type || 0;


            // Defaults for specific tile types
            if (tile.type === 4) { // charging plate
                if (typeof tile.charge !== 'number') tile.charge = 0;
            }
            if (tile.type === 5) { // conveyor
                // direction must be 1..4
                if (![1, 2, 3, 4].includes(tile.direction)) tile.direction = 1;
            }
            if (tile.type === 6) { // button
                // buttons have an id which matches doors' id
                if (typeof tile.id === 'undefined') tile.id = null;
                tile._pressed = false; // runtime state: pressed while bot stands on it
            }
            if (tile.type === 7) { // door
                if (typeof tile.id === 'undefined') tile.id = null;
                if (typeof tile.state === 'undefined') tile.state = 'closed';
                // closed doors are impassable, open ones behave like ground (type 1)
            }
            return tile;
        }));


        // Create a fresh bot instance
        this.bot = new Bot(this.initBot.x, this.initBot.y, this.initBot.charge);
    }
}

const ALL_LEVELS = [
    // Niveau 1: Mouvement de base
    new Level([
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 3 }, { type: 1 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }]
    ], 2, 2, 6, "Get to the finish without running out of power."),
    // Niveau 2: Chargement
    new Level([
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 3 }, { type: 1 }, { type: 1 }, { type: 1 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 4, charge: 5 }, { type: 1 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }]
    ], 2, 5, 7, "Charging plates will help you go farther."),
    // Niveau 3: Plaque Craquelée
    new Level([
        [{ type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }],
        [{ type: 0 }, { type: 1 }, { type: 2 }, { type: 1 }, { type: 2 }, { type: 1 }, { type: 0 }], // Plaques craquelées
        [{ type: 0 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 0 }],
        [{ type: 0 }, { type: 4, charge: 3 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 3 }, { type: 0 }], // Recharge +3 et Fin
        [{ type: 0 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 0 }],
        [{ type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }]
    ], 2, 5, 3, "Cracked plates can only be used once before they break."),
    // Niveau 4
    new Level([
        [{ type: 1 }, { type: 1 }, { type: 0 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
        [{ type: 3 }, { type: 1 }, { type: 0 }, { type: 1 }, { type: 1 }, { type: 3 }, { type: 1 }, { type: 1 }, { type: 1 }],
        [{ type: 1 }, { type: 1 }, { type: 0 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 4, charge: 5 }],
        [{ type: 1 }, { type: 1 }, { type: 0 }, { type: 0 }, { type: 1 }, { type: 0 }, { type: 0 }, { type: 1 }, { type: 1 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
        [{ type: 1 }, { type: 1 }, { type: 4, charge: 6 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }]
    ], 2, 2, 5),
    // Niveau 5
    new Level([
        [{ type: 0 }, { type: 0 }, { type: 0 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 0 }, { type: 0 }, { type: 0 }],
        [{ type: 0 }, { type: 0 }, { type: 0 }, { type: 1 }, { type: 2, charge: 3 }, { type: 1 }, { type: 0 }, { type: 0 }, { type: 0 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
        [{ type: 1 }, { type: 4, charge: 4 }, { type: 1 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 1 }, { type: 3 }, { type: 1 }],
        [{ type: 3 }, { type: 1 }, { type: 0 }, { type: 1 }, { type: 1 }, { type: 0 }, { type: 1 }, { type: 1 }, { type: 1 }],
        [{ type: 1 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 1 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 1 }],
        [{ type: 1 }, { type: 0 }, { type: 0 }, { type: 1 }, { type: 1 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 1 }],
        [{ type: 1 }, { type: 4, charge: 7 }, { type: 0 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 0 }, { type: 0 }, { type: 0 }]
    ], 5, 9, 7),
    // Niveau 6: Tapis Roulant
    new Level([
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 1 }, { type: 1 }, { type: 1 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 3 }, { type: 1 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 1 }, { type: 1 }, { type: 1 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 5, direction: 1 }, { type: 5, direction: 1 }, { type: 5, direction: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
        [{ type: 1 }, { type: 4, charge: 6 }, { type: 1 }, { type: 5, direction: 2 }, { type: 5, direction: 2 }, { type: 5, direction: 2 }, { type: 1 }, { type: 1 }, { type: 1 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 1 }, { type: 1 }, { type: 1 }]
    ], 2, 2, 5, "Conveyor belts let you direction without using power."),
    // Niveau 7
    new Level([
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 0 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 0 }, { type: 0 }],
        [{ type: 1 }, { type: 3 }, { type: 1 }, { type: 0 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 5, direction: 2 }, { type: 1 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 0 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 0 }, { type: 5, direction: 4 }],
        [{ type: 0 }, { type: 5, direction: 3 }, { type: 0 }, { type: 0 }, { type: 5, direction: 4 }, { type: 0 }, { type: 1 }, { type: 0 }, { type: 5, direction: 4 }],
        [{ type: 0 }, { type: 5, direction: 3 }, { type: 0 }, { type: 0 }, { type: 5, direction: 4 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 5, direction: 4 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 0 }, { type: 1 }, { type: 1 }, { type: 0 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 5, direction: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
        [{ type: 1 }, { type: 4, charge: 2 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 5, direction: 1 }, { type: 1 }, { type: 4, charge: 7 }, { type: 1 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 0 }, { type: 1 }, { type: 1 }, { type: 1 }]
    ], 2, 6, 6),
    // Niveau 8: Boutons et Portes
    new Level([
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 5, direction: 1 }, { type: 4, charge: 9 }, { type: 5, direction: 5 }, { type: 1 }, { type: 1 }, { type: 1 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 1 }, { type: 6, id: 1 }, { type: 1 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 5, direction: 2 }, { type: 5, direction: 2 }, { type: 5, direction: 2 }, { type: 1 }, { type: 1 }, { type: 1 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 5, direction: 4 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 5, direction: 4 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 7, id: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 0 }],
        [{ type: 1 }, { type: 4, charge: 9 }, { type: 1 }, { type: 1 }, { type: 7, id: 1 }, { type: 1 }, { type: 1 }, { type: 3 }, { type: 1 }],
        [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 7, id: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }]
    ], 2, 6, 7, "Press the buttons to open the doors corresponding to the same key number."),
];

export const gameChargebotApp = {
    id: 'game-chargebot',
    title: 'Chargebot',
    icon: `<svg fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M21.928 11.607c-.202-.488-.635-.605-.928-.633V8c0-1.103-.897-2-2-2h-6V4.61c.305-.274.5-.668.5-1.11a1.5 1.5 0 0 0-3 0c0 .442.195.836.5 1.11V6H5c-1.103 0-2 .897-2 2v2.997l-.082.006A1 1 0 0 0 1.99 12v2a1 1 0 0 0 1 1H3v5c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5a1 1 0 0 0 1-1v-1.938a1.006 1.006 0 0 0-.072-.455zM5 20V8h14l.001 3.996L19 12v2l.001.005.001 5.995H5z"></path><ellipse cx="8.5" cy="12" rx="1.5" ry="2"></ellipse><ellipse cx="15.5" cy="12" rx="1.5" ry="2"></ellipse><path d="M8 16h8v2H8z"></path></g></svg>`,
    iconColor: '#8BC34A',
    headerColor: '#8BC34A',
    type: 'game',
    content: `
        <div class="game-container">
            <div class="game-header">
                <div class="game-extra-controls">
                    <button class="action-btn" id="chargebot-restart-btn">Restart</button>
                </div>
                <div style="display: flex; gap: 20px; width: 100%; justify-content: center; margin-top: 10px; margin-bottom: 15px;">
                    <div class="game-score" class="game-charge">Charge: <span id="chargebot-charge">0</span></div>
                    <div class="game-score" class="game-level">Niveau: <span id="chargebot-level">1</span></div>
                </div>
                <div class="game-message" id="chargebot-help-message"></div>
            </div>

            <div style="padding-bottom: 30px;">
                <canvas id="chargebot-canvas" class="game-canvas"></canvas>
            </div>

            <div id="chargebot-controls" class="game-controls">
                <button class="left" data-dir="1">◀</button>
                <button class="up" data-dir="3">▲</button>
                <button class="right" data-dir="2">▶</button>
                <button class="down" data-dir="4">▼</button>
            </div>
            
            <div class="game-message-overlay" id="chargebot-overlay" style="display: none;">
                <h2 id="chargebot-overlay-title"></h2>
                <p id="chargebot-overlay-message"></p>
                <button id="chargebot-next-level-btn" style="display: none;">Niveau Suivant</button>
                <button id="chargebot-try-again-btn" style="display: none;">Réessayer</button>
            </div>
            <div class="game-message-overlay" id="chargebot-congratulation" style="display: none;">
                <h1>Félicitations !</h1> 
                <h2>Vous avez terminé tous les niveaux !</h2>
            </div>
        </div>
    `,
    init: function (windowId) {
        const $window = $(`#${windowId}`);
        /** @type {HTMLCanvasElement} */
        const canvas = $window.find('#chargebot-canvas')[0];
        
        /** @type {CanvasRenderingContext2D} */
        const ctx = canvas.getContext('2d');


        // Elements d'affichage
        const chargeEl = $window.find('#chargebot-charge')[0];
        const levelEl = $window.find('#chargebot-level')[0];
        const helpMessageEl = $window.find('#chargebot-help-message')[0];
        const overlay = $window.find('#chargebot-overlay');
        const congratulationScreen = $window.find('#chargebot-congratulation');
        const overlayTitle = $window.find('#chargebot-overlay-title');
        const nextLevelBtn = $window.find('#chargebot-next-level-btn');
        const tryAgainBtn = $window.find('#chargebot-try-again-btn');
        const restartBtn = $window.find('#chargebot-restart-btn');
        const controls = $window.find('#chargebot-controls button:not(#chargebot-restart-btn)');


        // Game state
        let running = "game"; // game/gameover/finished/main-menu
        let currentLevelIndex = 0; // start from first level (index 0)
        let currentLevel;
        let bot;
        let map;
        let gameLoopId;
        let isMoving = false; // Empêcher le spam de mouvement


        // Constants for Isometric Rendering
        const TILE_WIDTH = 60;
        const TILE_HEIGHT = 30; // 2:1 isometric ratio
        const HALF_W = TILE_WIDTH / 2;
        const HALF_H = TILE_HEIGHT / 2;
        const TILE_DEPTH = 15; // Profondeur pour l'effet 3D

        const DIRECTION = {
            1: { x: -1, y: 0, dx: -1, dy: 0 }, // West (Left)
            2: { x: 1, y: 0, dx: 1, dy: 0 }, // East (Right)
            3: { x: 0, y: -1, dx: 0, dy: -1 }, // North (Up)
            4: { x: 0, y: 1, dx: 0, dy: 1 }, // South (Down)
        };

        const TILES_DRAW_FUNCTION = {
            0: (x, y) => { drawVoid(x, y); }, // Void
            1: (x, y) => { drawNormalPlate(x, y); }, // Ground Plate
            2: (x, y) => { drawCrackedPlate(x, y); }, // Cracked Plate
            3: (x, y) => { drawFinishPlate(x, y); }, // Finish Plate
            4: (x, y, charge) => { drawChargingPlate(x, y, charge); }, // Charging Plate
            5: (x, y, direction) => { drawConveyorPlate(x, y, direction); }, // Conveyor Plate
            6: (x, y, id, isBotOn) => { drawButtonPlate(x, y, id, isBotOn); }, // Button Plate
            7: (x, y, id, state) => { drawDoorPlate(x, y, id, state); }, // Door Plate
        };

        // --- Utils pour l'affichage ---
        function gridToScreen(x, y) {
            const screenX = x * TILE_WIDTH;
            const screenY = y * (TILE_HEIGHT + TILE_DEPTH);
            return { x: screenX, y: screenY };
        }

        function shadeColor(color, percent) {
            const num = parseInt(color.replace("#",""),16),
                amt = Math.round(2.55 * percent),
                R = (num >> 16) + amt,
                G = (num >> 8 & 0x00FF) + amt,
                B = (num & 0x0000FF) + amt;
            return "#" + (
                0x1000000 + 
                (R<255?R<1?0:R:255)*0x10000 + 
                (G<255?G<1?0:G:255)*0x100 + 
                (B<255?B<1?0:B:255)
            ).toString(16).slice(1);
        }

        function resizeCanvas() {
            const container = $window.find('.game-container');
            const cw = container.width();
            const ch = container.height();

            if (!map) return;

            // Calculer la taille de la grille
            const mapWidth = map[0].length * TILE_WIDTH;
            const mapHeight = map.length * (TILE_HEIGHT + TILE_DEPTH);
            const maxBoardWidth = (mapWidth + mapHeight) * HALF_W;
            const maxBoardHeight = (mapWidth + mapHeight) * HALF_H + TILE_DEPTH;

            // Définir la taille du canvas à la taille non-scalée du plateau
            canvas.width = maxBoardWidth;
            canvas.height = maxBoardHeight;

            // Calculer le ratio d'échelle pour que tout tienne
            // 150px de marge pour le header/controls
            const scaleX = cw / maxBoardWidth;
            const scaleY = (ch - 150) / maxBoardHeight;
            const scale = Math.min(scaleX, scaleY) * 0.95;

            // Appliquer l'échelle au style du canvas et centrer
            canvas.style.transform = `scale(${scale})`;
            canvas.style.transformOrigin = 'center top';
        }

        // --- Fonctions de Dessin ---
        function drawTile(x, y, topColor, sideColor) {
            const { x: sx, y: sy } = gridToScreen(x, y);
            ctx.save();
            ctx.translate(sx, sy);

            // Dessiner le dessus
            ctx.fillStyle = topColor;
            ctx.fillRect(0, 0, TILE_WIDTH, TILE_HEIGHT);

            // Dessiner la face avant (effet 3D)
            ctx.fillStyle = sideColor;
            ctx.beginPath();
            ctx.moveTo(0, TILE_HEIGHT);
            ctx.lineTo(0, TILE_HEIGHT + TILE_DEPTH);
            ctx.lineTo(TILE_WIDTH, TILE_HEIGHT + TILE_DEPTH);
            ctx.lineTo(TILE_WIDTH, TILE_HEIGHT);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }

        function drawVoid(x, y) {
            // Dessine juste le fond sombre pour les trous
            drawTile(x, y, '#333333', '#222222');
        }

        function drawPlate(x, y, color) {
            drawTile(x, y, color, shadeColor(color, -30)); // petit assombrissement
        }

        function drawNormalPlate(x, y) {
            drawPlate(x, y, '#cccccc');
        }

        function drawChargingPlate(x, y, charge) {
            drawPlate(x, y, charge > 0 ? '#16a32dff' : '#017214ff');
            const { x: sx, y: sy } = gridToScreen(x, y);
            ctx.save();
            ctx.fillStyle = 'black';
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('+' + charge, sx + TILE_WIDTH / 2, sy + TILE_HEIGHT / 1.5);
            ctx.restore();
        }

        function drawCrackedPlate(x, y) {
            drawPlate(x, y, '#cccccc');

            const { x: sx, y: sy } = gridToScreen(x, y);
            ctx.save();
            ctx.translate(sx, sy);

            ctx.strokeStyle = '#2c3e50';
            ctx.lineWidth = 2;
            ctx.beginPath();

            // Fissures en croix dans la surface
            ctx.moveTo(TILE_WIDTH * 0.2, TILE_HEIGHT * 0.2);
            ctx.lineTo(TILE_WIDTH * 0.8, TILE_HEIGHT * 0.8);
            ctx.moveTo(TILE_WIDTH * 0.8, TILE_HEIGHT * 0.3);
            ctx.lineTo(TILE_WIDTH * 0.3, TILE_HEIGHT * 0.9);
            ctx.stroke();

            ctx.restore();
        }

        function drawFinishPlate(x, y) {
            drawPlate(x, y, '#cccccc');

            const { x: sx, y: sy } = gridToScreen(x, y);
            ctx.save();
            ctx.translate(sx, sy);

            // --- Dessin du damier 4x4 ---
            const cells = 4;
            const cellW = TILE_WIDTH / cells;
            const cellH = TILE_HEIGHT / cells;

            for (let row = 0; row < cells; row++) {
                for (let col = 0; col < cells; col++) {
                    // alternance noir/blanc
                    if ((row + col) % 2 === 0) ctx.fillStyle = '#ffffff';
                    else ctx.fillStyle = '#000000';
                    ctx.fillRect(col * cellW, row * cellH, cellW, cellH);
                }
            }

            // --- Texte "FIN" au centre ---
            ctx.fillStyle = 'red';
            ctx.font = 'bold 18px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('FIN', TILE_WIDTH / 2, TILE_HEIGHT / 2);

            ctx.restore();
        }

        function drawChargingPlate(x, y, charge) {
            const isCharged = charge > 0;
            drawPlate(x, y, isCharged ? '#f1c40f' : '#7f8c8d', isCharged ? '#f39c12' : '#7f8c8d'); // Jaune/Gris

            ctx.save();
            const { x: isoX, y: isoY } = gridToScreen(x, y);
            const centerOffsetX = canvas.width / 2;
            const centerOffsetY = TILE_DEPTH;
            ctx.translate(centerOffsetX + isoX, centerOffsetY + isoY);

            ctx.fillStyle = isCharged ? 'black' : 'white';
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(isCharged ? '+' + charge : '0', 0, HALF_H + 5);

            ctx.restore();
        }

        function drawConveyorPlate(x, y, direction) {
            drawPlate(x, y, '#3498db');

            const { x: sx, y: sy } = gridToScreen(x, y);
            ctx.save();
            ctx.translate(sx + TILE_WIDTH / 2, sy + TILE_HEIGHT / 2);

            const dir = DIRECTION[direction];
            if (dir) {
                const angle = Math.atan2(dir.dy, dir.dx);
                ctx.rotate(angle);
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.moveTo(0, -10);
                ctx.lineTo(-5, 5);
                ctx.lineTo(5, 5);
                ctx.closePath();
                ctx.fill();
            }

            ctx.restore();
        }

        function drawButtonPlate(x, y, id, isBotOn) {
            drawPlate(x, y, isBotOn ? '#e67e22' : '#f39c12'); // Orange/Jaune

            const { x: sx, y: sy } = gridToScreen(x, y);
            ctx.save();
            ctx.translate(sx, sy);

            ctx.fillStyle = isBotOn ? '#c0392b' : '#e74c3c'; // Rouge foncé si pressé
            ctx.beginPath();
            ctx.arc(TILE_WIDTH / 2, TILE_HEIGHT / 1.5, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        function drawDoorPlate(x, y, id, state) {
            const isClosed = state === 'closed';
            drawTile(x, y, isClosed ? '#c0392b' : '#7f8c8d');

            const { x: sx, y: sy } = gridToScreen(x, y);
            ctx.save();
            ctx.translate(sx, sy);

            ctx.fillStyle = 'white';
            ctx.font = 'bold 15px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(isClosed ? 'X' : 'O', TILE_WIDTH / 2, TILE_HEIGHT / 1.5);

            ctx.restore();
        }

        function drawBot(x, y, charge) {
            // Correction : Utiliser gridToScreen pour la base, puis centrer le bot.
            const { x: sx, y: sy } = gridToScreen(x, y);
            ctx.save();
            // Translate à la position de la grille (sx, sy) + centrage (TILE_WIDTH/2)
            // Et un petit décalage en Y pour que les pieds soient sur la tuile (TILE_HEIGHT/2)
            ctx.translate(sx + TILE_WIDTH / 2, sy + TILE_HEIGHT / 2); // Modification ici

            // Ombre (ajustement de la position car le point 0,0 est maintenant centré en haut de la tuile)
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.beginPath();
            ctx.ellipse(0, TILE_HEIGHT / 2, 10, 4, 0, 0, Math.PI * 2); // Position ajustée
            ctx.fill();

            // Corps (décalé vers le haut par rapport au centre)
            const botHeight = 25;
            ctx.fillStyle = (charge > 0) ? '#e74c3c' : '#7f8c8d';
            ctx.fillRect(-10, -botHeight, 20, botHeight); // Reste centré en X, décalé vers le haut

            // Tête
            ctx.fillStyle = '#fefefe';
            ctx.beginPath();
            ctx.arc(0, -botHeight, 8, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        // --- Logique du jeu ---

        function setupLevel(levelIndex) {
            if (levelIndex >= ALL_LEVELS.length) {
                running = "finished";
                overlay.hide();
                congratulationScreen.show();
                return;
            }

            currentLevelIndex = levelIndex;
            ALL_LEVELS[levelIndex].start();

            currentLevel = ALL_LEVELS[levelIndex];
            bot = currentLevel.bot;
            map = currentLevel.map;

            currentLevel.isFinished = false;
            running = "game";

            updateDisplay();
            resizeCanvas();
            draw();

            overlay.hide();
            congratulationScreen.hide();
        }

        function updateDisplay() {
            if (chargeEl) chargeEl.textContent = bot.charge;
            if (levelEl) levelEl.textContent = currentLevelIndex + 1;
            if (helpMessageEl) helpMessageEl.textContent = currentLevel.helpMessage;
        }

        function checkGameStatus() {
            const currentTile = map[bot.y][bot.x];

            // Win condition: On the finish plate (type:3)
            if (currentTile.type === 3) {
                currentLevel.isFinished = true;
                running = "finished";

                overlayTitle.text("Niveau Terminé !");
                $window.find('#chargebot-overlay-message').text("Prêt pour le niveau suivant ?");
                nextLevelBtn.show();
                tryAgainBtn.hide();
                overlay.show();
                return true;
            }

            // Loss condition: No charge left and not on the finish plate
            if (bot.charge <= 0 && currentTile.type !== 3) {
                running = "gameover";

                overlayTitle.text("Échec !");
                $window.find('#chargebot-overlay-message').text("Plus de charge ! Recharge ou redémarre.");
                nextLevelBtn.hide();
                tryAgainBtn.show();
                overlay.show();
                return true;
            }

            // Loss condition: Moved into Void (type:0)
            if (currentTile.type === 0 && currentTile.type !== 3) {
                running = "gameover";
                overlayTitle.text("Échec !");
                $window.find('#chargebot-overlay-message').text("Tombé dans le vide !");
                nextLevelBtn.hide();
                tryAgainBtn.show();
                overlay.show();
                return true;
            }


            return false;
        }


        function moveBot(dx, dy, isConveyorMove = false) {
            if (isMoving || running !== "game") return;

            const newX = bot.x + dx;
            const newY = bot.y + dy;

            // L'ancienne tuile (avant le move) est nécessaire pour relâcher les boutons.
            const oldX = bot.x;
            const oldY = bot.y;
            const currentTileBeforeMove = map[oldY][oldX]; 


            // 1. --- Gestion de la tuile quittée (ex: relâcher le bouton) ---
            // Uniquement si le robot bouge ET quitte un bouton
            if (currentTileBeforeMove.type === 6) {
                // Le bot quitte un bouton : refermer la porte associée
                currentTileBeforeMove._pressed = false;
                const buttonId = currentTileBeforeMove.id;
                map.forEach(row =>
                    row.forEach(tile => {
                        if (tile.type === 7 && tile.id === buttonId) {
                            tile.state = 'closed'; // La porte se referme
                        }
                    })
                );
            }

            // Check bounds
            if (newY < 0 || newY >= map.length || newX < 0 || newX >= map[0].length) {
                // Hors limites = Game Over
                running = "gameover";
                overlayTitle.text("Échec !");
                $window.find('#chargebot-overlay-message').text("Hors limites !");
                nextLevelBtn.hide();
                tryAgainBtn.show();
                overlay.show();
                draw();
                return;
            }

            const targetTile = map[newY][newX];

            // Bloquer le mouvement si la cible est une porte fermée
            if (targetTile.type === 7 && targetTile.state === 'closed') {
                updateDisplay();
                draw();
                return; // Mouvement bloqué, pas de consommation de charge
            }

            // Check move feasibility: Only player moves cost charge
            if (!isConveyorMove) {
                if (bot.charge <= 0) {
                    // Si on est sur une tuile de fin (type 3), on ne bloque pas le move et on ne déclenche pas le GO
                    if (currentTileBeforeMove.type === 3) return;
                    
                    // Si on n'est pas sur la fin et sans charge, on bloque le move et GO
                    running = "gameover";
                    overlayTitle.text("Échec !");
                    $window.find('#chargebot-overlay-message').text("Plus de charge !");
                    nextLevelBtn.hide();
                    tryAgainBtn.show();
                    overlay.show();
                    draw();
                    return;
                }
                bot.charge--; // Consume charge for player move
            }

            // Move the bot
            bot.x = newX;
            bot.y = newY;
            isMoving = true; // Empêche les nouvelles entrées
            updateDisplay();
            draw();

            // Délai pour l'animation/feedback (150ms) avant l'interaction avec la tuile
            // **CORRECTION CRITIQUE** : Utilisation correcte de setTimeout pour le délai.
            setTimeout(() => { 
                isMoving = false; // Débloque l'input après l'animation
                const currentTileAfterMove = map[bot.y][bot.x];

                // 2. Interaction: Charging Plate (type:4)
                if (currentTileAfterMove.type === 4 && currentTileAfterMove.charge > 0) {
                    bot.charge += currentTileAfterMove.charge;
                    currentTileAfterMove.charge = 0; // Plate becomes empty
                }

                // 3. Interaction: Cracked Plate (type:2)
                if (currentTileAfterMove.type === 2) {
                    currentTileAfterMove.type = 0; // Turn cracked plate into void
                }

                // 4. Interaction: Button (type:6) - Presser le bouton
                if (currentTileAfterMove.type === 6) {
                    currentTileAfterMove._pressed = true;
                    const buttonId = currentTileAfterMove.id;
                    // Trouver toutes les portes liées à ce id et les ouvrir
                    map.forEach(row => 
                        row.forEach(tile => {
                            if (tile.type === 7 && tile.id === buttonId) { 
                                tile.state = 'open';
                            }
                        })
                    );
                }

                // 5. Check de Victoire (type:3)
                if (currentTileAfterMove.type === 3) {
                    currentLevel.isFinished = true;
                    currentLevel.finishedTime = Date.now();
                    running = "finished";
                    overlayTitle.text("Niveau Terminé !");
                    $window.find('#chargebot-overlay-message').text("Bravo ! Prêt pour le prochain défi ?");
                    tryAgainBtn.hide();
                    nextLevelBtn.show();
                    overlay.show();
                    draw();
                    return; 
                }

                // 6. Check Tapis Roulant (type:5) - Chaînage
                if (currentTileAfterMove.type === 5) {
                    const dir = DIRECTION[currentTileAfterMove.direction];
                    
                    isMoving = true; // Verrouiller à nouveau l'input utilisateur pour l'enchaînement
                    // Relance du mouvement du tapis roulant sans consommation de charge
                    moveBot(dir.dx, dir.dy, true);
                    return; // Le moveBot récursif gère son propre timeout et son isMoving=false final
                }

                // 7. Check fin de partie (tombé dans le vide - type:0)
                if (currentTileAfterMove.type === 0) {
                    running = "gameover";
                    overlayTitle.text("Échec !");
                    $window.find('#chargebot-overlay-message').text("Tombé dans le vide !");
                    nextLevelBtn.hide();
                    tryAgainBtn.show();
                    overlay.show();
                    draw();
                    return;
                }

                // 8. Check Fin de Partie (plus de charge)
                // Seul le mouvement du joueur consomme la charge. Si la charge est à 0 après l'interaction (et non victoire/tapis), c'est la fin.
                if (bot.charge <= 0) {
                    running = "gameover";
                    overlayTitle.text("Échec !");
                    $window.find('#chargebot-overlay-message').text("Plus de charge !");
                    nextLevelBtn.hide();
                    tryAgainBtn.show();
                    overlay.show();
                    draw();
                    return;
                }

                // Final update/draw pour un mouvement normal
                updateDisplay(); 
                draw();
            }, 150);
        }

        // Maps key/button input to moveBot (dx, dy)
        function inputKey(key) {
            if (running !== "game" || isMoving) return;

            let dir = null;
            switch (key) {
                case 'up': dir = DIRECTION[3]; break; // North (Z / ArrowUp)
                case 'down': dir = DIRECTION[4]; break; // South (S / ArrowDown)
                case 'left': dir = DIRECTION[1]; break; // West (Q / ArrowLeft)
                case 'right': dir = DIRECTION[2]; break; // East (D / ArrowRight)
            }

            if (dir) {
                moveBot(dir.dx, dir.dy);
            }
        }

        function resetGame() {
            setupLevel(currentLevelIndex);
        }

        function nextLevel() {
            setupLevel(currentLevelIndex + 1);
        }

        // --- Fonctions principales de jeu ---
        function draw() {
            const w = canvas.width;
            const h = canvas.height;

            ctx.clearRect(0, 0, w, h);

            // Draw all tiles (looping from top-left to bottom-right for correct isometric layering)
            if (map) {
                for (let y = 0; y < map.length; y++) {
                    for (let x = 0; x < map[y].length; x++) {
                        const tile = map[y][x];
                        const isBotOn = (bot && bot.x === x && bot.y === y); // Vérifier si le bot est sur la tuile

                        // Draw the tile based on its type
                        const drawFunc = TILES_DRAW_FUNCTION[tile.type];
                        if (drawFunc) {
                            switch (tile.type) {
                                case 4: drawFunc(x, y, tile.charge); break;
                                case 5: drawFunc(x, y, tile.direction); break;
                                case 6: drawFunc(x, y, isBotOn); break; // Bouton : passer l'état isBotOn
                                case 7: drawFunc(x, y, tile.state); break; // Porte : passer l'état 'closed'/'open'
                                default: drawFunc(x, y); break;
                            }
                        }
                    }
                }

                // Draw the bot after all tiles for correct layering
                if (bot) {
                    drawBot(bot.x, bot.y, bot.charge);
                }
            }
        }

        // --- Main loop (simple draw loop to keep display updated) ---
        function loop() {
            if (running !== "main-menu" && running !== "gameover" && running !== "finished") {
                draw();
                gameLoopId = requestAnimationFrame(loop);
            }
        }

        // --- Écouteurs d'événements ---

        // Clavier
        const keyHandler = (e) => {
            if (!document.body.contains(canvas) || isMoving) return;

            // Z/ArrowUp for North (3)
            if (e.key === 'ArrowUp' || e.key === 'z' || e.key === 'Z') {
                e.preventDefault();
                inputKey('up');
            }
            // S/ArrowDown for South (4)
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                e.preventDefault();
                inputKey('down');
            }
            // Q/ArrowLeft for West (1)
            if (e.key === 'ArrowLeft' || e.key === 'q' || e.key === 'Q') {
                e.preventDefault();
                inputKey('left');
            }
            // D/ArrowRight for East (2)
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                e.preventDefault();
                inputKey('right');
            }
            if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                resetGame();
            }
        };
        document.addEventListener('keydown', keyHandler);

        // Boutons de contrôle
        controls.on('click', function () {
            const dir = $(this).data('dir');
            switch (parseInt(dir)) {
                case 1: inputKey('left'); break;
                case 2: inputKey('right'); break;
                case 3: inputKey('up'); break;
                case 4: inputKey('down'); break;
            }
        });

        // Boutons de l'overlay
        restartBtn.on('click', resetGame);
        tryAgainBtn.on('click', resetGame);
        nextLevelBtn.on('click', nextLevel);

        // Observer pour le redimensionnement du canvas
        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
            draw();
        });
        resizeObserver.observe(canvas);

        // --- Start ---
        setupLevel(currentLevelIndex);
        gameLoopId = requestAnimationFrame(loop);

        // Nettoyage lors de la fermeture
        const observer = new MutationObserver(() => {
            if (!document.body.contains(canvas)) {
                cancelAnimationFrame(gameLoopId);
                document.removeEventListener('keydown', keyHandler);
                resizeObserver.disconnect();
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        resetGame();

        // API exposée
        return {
            pause: () => { },
            resume: () => { },
            restart: () => { resetGame(); }
        };
    }
};