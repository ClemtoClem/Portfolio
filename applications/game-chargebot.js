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
                <div class="game-charge">Charge: <span id="chargebot-charge">0</span></div>
                <div class="game-level">Niveau: <span id="chargebot-level">1</span></div>
            </div>
            <div class="game-message" id="chargebot-help-message"></div>

            <canvas id="chargebot-canvas" class="game-canvas"></canvas>

            <div id="chargebot-controls" class="game-controls">
                <button class="up" data-dir="3">▲</button>
                <div class="middle-row">
                    <button class="left" data-dir="1">◀</button>
                    <button class="action-btn" id="chargebot-restart-btn">Restart</button>
                    <button class="right" data-dir="2">▶</button>
                </div>
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
            <small>Utilisez les flèches du clavier (ou Z/Q/S/D) ou les boutons pour vous déplacer.</small>
        </div>
    `,
    init: function (windowId) {
        const $window = $(`#${windowId}`);
        const canvas = $window.find('#chargebot-canvas')[0];
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
            1: (x, y) => { drawPlate(x, y, '#cccccc'); }, // Ground Plate
            2: (x, y) => { drawCrackedPlate(x, y); }, // Cracked Plate
            3: (x, y) => { drawFinishPlate(x, y); }, // Finish Plate
            4: (x, y, charge) => { drawChargingPlate(x, y, charge); }, // Charging Plate
            5: (x, y, direction) => { drawConveyorPlate(x, y, direction); }, // Conveyor Plate
            6: (x, y, id, isBotOn) => { drawButtonPlate(x, y, id, isBotOn); }, // Button Plate
            7: (x, y, id, state) => { drawDoorPlate(x, y, id, state); }, // Door Plate
        };

        // --- Utils pour l'isométrie ---
        function isoToCartesian(x, y) {
            // Convert grid (x, y) to canvas (screenX, screenY)
            const screenX = (x - y) * HALF_W;
            const screenY = (x + y) * HALF_H;
            return { x: screenX, y: screenY };
        }

        function resizeCanvas() {
            const container = $window.find('.game-container');
            const cw = container.width();
            const ch = container.height();

            if (!map) return;

            // Calculer la taille de la grille
            const mapWidth = map[0].length;
            const mapHeight = map.length;
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
            ctx.save();
            const { x: isoX, y: isoY } = isoToCartesian(x, y);

            // Décalage pour centrer la grille
            const centerOffsetX = canvas.width / 2;
            const centerOffsetY = TILE_DEPTH;
            ctx.translate(centerOffsetX + isoX, centerOffsetY + isoY);

            // Dessiner le côté 
            ctx.fillStyle = sideColor;
            ctx.beginPath();
            ctx.moveTo(0, HALF_H);
            ctx.lineTo(HALF_W, TILE_HEIGHT);
            ctx.lineTo(HALF_W, TILE_HEIGHT + TILE_DEPTH);
            ctx.lineTo(0, HALF_H + TILE_DEPTH);
            ctx.lineTo(-HALF_W, TILE_HEIGHT);
            ctx.lineTo(-HALF_W, TILE_HEIGHT + TILE_DEPTH);
            ctx.lineTo(0, HALF_H + TILE_DEPTH);
            ctx.closePath();
            ctx.fill();

            // Dessiner le dessus
            ctx.fillStyle = topColor;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(HALF_W, HALF_H);
            ctx.lineTo(0, TILE_HEIGHT);
            ctx.lineTo(-HALF_W, HALF_H);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }

        function drawVoid(x, y) {
            // Dessine juste le fond sombre pour les trous
            drawTile(x, y, '#333333', '#222222');
        }

        function drawPlate(x, y, color) {
            drawTile(x, y, color, '#999999');
        }

        function drawCrackedPlate(x, y) {
            drawPlate(x, y, '#d35400', '#a04000'); // Orange/Marron

            ctx.save();
            const { x: isoX, y: isoY } = isoToCartesian(x, y);
            const centerOffsetX = canvas.width / 2;
            const centerOffsetY = TILE_DEPTH;
            ctx.translate(centerOffsetX + isoX, centerOffsetY + isoY);

            ctx.strokeStyle = '#2c3e50'; // Gris foncé pour les fissures
            ctx.lineWidth = 2;
            ctx.beginPath();
            // Fissures simples en croix
            ctx.moveTo(-HALF_W * 0.5, HALF_H * 0.5);
            ctx.lineTo(HALF_W * 0.7, HALF_H * 1.5);
            ctx.moveTo(HALF_W * 0.3, HALF_H * 0.3);
            ctx.lineTo(-HALF_W * 0.7, HALF_H * 1.3);
            ctx.stroke();

            ctx.restore();
        }

        function drawFinishPlate(x, y) {
            drawPlate(x, y, '#2ecc71', '#27ae60'); // Vert

            ctx.save();
            const { x: isoX, y: isoY } = isoToCartesian(x, y);
            const centerOffsetX = canvas.width / 2;
            const centerOffsetY = TILE_DEPTH;
            ctx.translate(centerOffsetX + isoX, centerOffsetY + isoY);

            ctx.fillStyle = 'white';
            ctx.font = 'bold 15px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('FIN', 0, HALF_H + 5);

            ctx.restore();
        }

        function drawChargingPlate(x, y, charge) {
            const isCharged = charge > 0;
            drawPlate(x, y, isCharged ? '#f1c40f' : '#7f8c8d', isCharged ? '#f39c12' : '#7f8c8d'); // Jaune/Gris

            ctx.save();
            const { x: isoX, y: isoY } = isoToCartesian(x, y);
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
            drawPlate(x, y, '#3498db', '#2980b9'); // Bleu

            ctx.save();
            const { x: isoX, y: isoY } = isoToCartesian(x, y);
            const centerOffsetX = canvas.width / 2;
            const centerOffsetY = TILE_DEPTH;
            ctx.translate(centerOffsetX + isoX, centerOffsetY + isoY);

            // Dessiner une flèche pour la direction
            const dir = DIRECTION[direction];
            if (dir) {
                const angle = Math.atan2(dir.dy, -dir.dx) + Math.PI / 2;

                ctx.translate(0, HALF_H);
                ctx.rotate(angle);

                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.moveTo(0, -10); // Pointe de la flèche
                ctx.lineTo(-5, 0);
                ctx.lineTo(5, 0);
                ctx.closePath();
                ctx.fill();
            }

            ctx.restore();
        }

        // NOUVEAU: Dessin du bouton
        function drawButtonPlate(x, y, id, isBotOn) {
            drawPlate(x, y, isBotOn ? '#e67e22' : '#f39c12', '#d35400'); // Orange/Jaune

            ctx.save();
            const { x: isoX, y: isoY } = isoToCartesian(x, y);
            const centerOffsetX = canvas.width / 2;
            const centerOffsetY = TILE_DEPTH;
            ctx.translate(centerOffsetX + isoX, centerOffsetY + isoY);

            // Dessiner un petit cercle comme bouton
            ctx.fillStyle = isBotOn ? '#c0392b' : '#e74c3c'; // Rouge foncé quand pressé
            ctx.beginPath();
            ctx.arc(0, HALF_H, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        // NOUVEAU: Dessin de la porte
        function drawDoorPlate(x, y, id, state) {
            const isClosed = state === 'closed';
            // Rouge (Fermé) ou Gris-Bleu (Ouvert)
            const topColor = isClosed ? '#c0392b' : '#7f8c8d';
            const sideColor = isClosed ? '#a93226' : '#607d8b';

            drawTile(x, y, topColor, sideColor);

            ctx.save();
            const { x: isoX, y: isoY } = isoToCartesian(x, y);
            const centerOffsetX = canvas.width / 2;
            const centerOffsetY = TILE_DEPTH;
            ctx.translate(centerOffsetX + isoX, centerOffsetY + isoY);

            ctx.fillStyle = 'white';
            ctx.font = 'bold 15px sans-serif';
            ctx.textAlign = 'center';
            // Afficher X ou O selon l'état
            ctx.fillText(isClosed ? 'X' : 'O', 0, HALF_H + 5);

            ctx.restore();
        }

        function drawBot(x, y, charge) {
            ctx.save();
            const { x: isoX, y: isoY } = isoToCartesian(x, y);
            const centerOffsetX = canvas.width / 2;
            const centerOffsetY = TILE_DEPTH;

            // Positionnement au milieu de la tuile et au-dessus de la profondeur
            ctx.translate(centerOffsetX + isoX, centerOffsetY + isoY - TILE_DEPTH + 3);

            // Corps du bot
            const radius = 10;
            ctx.fillStyle = (charge > 0) ? '#e74c3c' : '#7f8c8d'; // Rouge ou Gris
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#c0392b';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Afficher la charge
            ctx.fillStyle = 'white';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(charge, 0, 3);

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

            // Check bounds
            if (newY < 0 || newY >= map.length || newX < 0 || newX >= map[0].length) {
                // Moving outside the map is like moving into a void
                isMoving = true;
                (() => {
                    isMoving = false;
                    running = "gameover";
                    overlayTitle.text("Échec !");
                    $window.find('#chargebot-overlay-message').text("Hors limites !");
                    nextLevelBtn.hide();
                    tryAgainBtn.show();
                    overlay.show();
                    draw();
                }, 150);
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
                    return; // Cannot move, no charge
                }
                bot.charge--; // Consume charge for player move
            }

            // Move the bot
            bot.x = newX;
            bot.y = newY;
            isMoving = true;
            updateDisplay();
            draw();

            // Délai pour l'animation/feedback avant l'interaction avec la tuile
            (() => {
                isMoving = false;
                const currentTile = map[bot.y][bot.x];

                // 1. Interaction: Charging Plate (type:4)
                if (currentTile.type === 4 && currentTile.charge > 0) {
                    bot.charge += currentTile.charge;
                    currentTile.charge = 0; // Plate becomes empty
                }

                // 2. Interaction: Cracked Plate (type:2)
                if (currentTile.type === 2) {
                    currentTile.type = 0; // Turn cracked plate into void
                }

                // 3. Interaction: Button (type:6)
                if (currentTile.type === 6) {
                    const buttonId = currentTile.id;
                    // Trouver toutes les portes liées à ce id et alterner leur état
                    map.forEach(row => 
                        row.forEach(tile => {
                            if (tile.type === 7 && tile.id === buttonId) { 
                                // Si la porte est fermée, on l'ouvre
                                if (tile.state === 'closed') { 
                                    tile.state = 'open'; 
                                }
                            }
                        })
                    );
                    currentTile._pressed = true;
                }

                // 4. Check de Victoire (type:3)
                if (currentTile.type === 3) {
                    currentLevel.isFinished = true;
                    currentLevel.finishedTime = Date.now();
                    running = "finished";
                    overlayTitle.text("Niveau Terminé !");
                    $window.find('#chargebot-overlay-message').text("Bravo ! Prêt pour le prochain défi ?");
                    tryAgainBtn.hide();
                    nextLevelBtn.show();
                    overlay.show();
                    draw();
                    return; // Victoire, on arrête tout
                }

                // 5. Check Tapis Roulant (type:5) - NOUVELLE LOGIQUE POUR LE CHAÎNAGE
                if (currentTile.type === 5) {
                    const dir = DIRECTION[currentTile.direction];
                    // Déclenche un mouvement automatique et sans consommation de charge
                    moveBot(dir.dx, dir.dy, true); 
                    return; // Le nouveau moveBot gérera l'affichage et les interactions
                }

                // 6. Check Fin de Partie (plus de charge) - S'applique uniquement si on n'est PAS sur une tuile de fin ou un tapis roulant
                if (bot.charge <= 0) {
                    running = "gameover";
                    overlayTitle.text("Échec !");
                    $window.find('#chargebot-overlay-message').text("Plus de charge !");
                    nextLevelBtn.hide();
                    tryAgainBtn.show();
                    overlay.show();
                    draw();
                    return; // Échec, on arrête
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

            id: 'game-flappy-bird', ctx.clearRect(0, 0, w, h);

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