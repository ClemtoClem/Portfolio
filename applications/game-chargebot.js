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
	], 2, 5, 6, "Charging plates will help you go farther."),
	// Niveau 3: Plaque Craquelée
	new Level([
		[{ type: 1 }, { type: 1 }, { type: 2 }, { type: 2 }, { type: 2 }, { type: 1 }, { type: 1 }],
		[{ type: 1 }, { type: 4, charge: 4 }, { type: 2 }, { type: 2, charge: 4 }, { type: 2 }, { type: 3 }, { type: 1 }], // Recharge +3 et Fin
		[{ type: 1 }, { type: 1 }, { type: 2 }, { type: 2 }, { type: 12 }, { type: 1 }, { type: 1 }],
		[{ type: 1 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }]
	], 0, 3, 3, "Cracked plates can only be used once before they break."),
	// Niveau 4
	new Level([
		[{ type: 1 }, { type: 1 }, { type: 0 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
		[{ type: 3 }, { type: 1 }, { type: 0 }, { type: 1 }, { type: 1 }, { type: 3 }, { type: 1 }, { type: 1 }, { type: 1 }],
		[{ type: 1 }, { type: 1 }, { type: 0 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 4, charge: 5 }],
		[{ type: 1 }, { type: 1 }, { type: 0 }, { type: 0 }, { type: 1 }, { type: 0 }, { type: 0 }, { type: 1 }, { type: 1 }],
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
		[{ type: 1 }, { type: 1 }, { type: 4, charge: 6 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }]
	], 2, 2, 5, "Plan your route carefully."),
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
	icon: `<svg fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.928 11.607c-.202-.488-.635-.605-.928-.633V8c0-1.103-.897-2-2-2h-6V4.61c.305-.274.5-.668.5-1.11a1.5 1.5 0 0 0-3 0c0 .442.195.836.5 1.11V6H5c-1.103 0-2 .897-2 2v2.997l-.082.006A1 1 0 0 0 1.99 12v2a1 1 0 0 0 1 1H3v5c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5a1 1 0 0 0 1-1v-1.938a1.006 1.006 0 0 0-.072-.455zM5 20V8h14l.001 3.996L19 12v2l.001.005.001 5.995H5z"></path><ellipse cx="8.5" cy="12" rx="1.5" ry="2"></ellipse><ellipse cx="15.5" cy="12" rx="1.5" ry="2"></ellipse><path d="M8 16h8v2H8z"></path></svg>`,
	iconColor: '#8BC34A',
	headerColor: '#8BC34A',
	type: 'game',
	style: `
		.game-container { margin: 0px; position: relative; width: 100%; height: 100%; background: #222; color: white; display: flex; flex-direction: column; align-items: center; overflow: hidden; font-family: 'Segoe UI', sans-serif; }
		
		/* --- MENUS --- */
		.cb-screen { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; position: absolute; top:0; left:0; z-index: 10; background: #222; }
		.cb-title { font-size: 3rem; color: #8BC34A; text-transform: uppercase; letter-spacing: 4px; margin-bottom: 40px; text-shadow: 0 0 10px rgba(139, 195, 74, 0.4); }
		.cb-btn { padding: 15px 40px; font-size: 1.2rem; background: #444; border: none; color: white; margin: 10px; cursor: pointer; border-radius: 5px; transition: all 0.2s; min-width: 200px; text-transform: uppercase; font-weight: bold; }
		.cb-btn:hover { background: #8BC34A; color: #111; transform: scale(1.05); }
		
		/* --- LEVEL SELECT --- */
		.cb-level-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; max-width: 600px; margin-bottom: 30px; }
		.cb-level-btn { width: 70px; height: 70px; background: #333; border: 2px solid #555; color: #888; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 8px; transition: all 0.2s; }
		.cb-level-btn.unlocked { background: #444; color: white; border-color: #8BC34A; }
		.cb-level-btn.unlocked:hover { background: #8BC34A; color: black; }
		.cb-level-btn.locked { opacity: 0.5; cursor: not-allowed; }
		.cb-level-btn.completed { background: #2e4a23; border-color: #8BC34A; }

		/* --- GAME UI --- */
		.game-ui { width: 100%; height: 100%; display: flex; flex-direction: column; }
		.game-header { width: 100%; padding: 10px; text-align: center; background: rgba(0,0,0,0.4); box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 5; display: flex; flex-direction: column; align-items: center; }
		.game-top-row { display: flex; width: 100%; justify-content: space-between; align-items: center; padding: 0 10px; }
		.game-score-board { display: flex; gap: 40px; }
		.game-score { font-weight: bold; font-size: 1.1rem; color: #8BC34A; text-shadow: 1px 1px 2px black; }
		.game-score span { color: white; }
		.game-message { font-size: 0.95rem; color: #ddd; min-height: 1.2em; font-style: italic; margin-top: 5px; }
		
		.game-canvas-wrapper { flex-grow: 1; display: flex; align-items: center; justify-content: center; width: 100%; overflow: hidden; position: relative; }
		.game-canvas { display: block; }
		
		.game-controls { display: grid; grid-template-areas: ". up ." "left down right"; gap: 8px; margin-bottom: 20px; z-index: 5; align-self: center; }
		.game-controls button { width: 55px; height: 55px; font-size: 24px; cursor: pointer; border: none; border-radius: 12px; background: #444; color: #eee; box-shadow: 0 4px 0 #222; transition: transform 0.1s, background 0.2s; }
		.game-controls button:active { transform: translateY(4px); box-shadow: 0 0 0 #222; background: #8BC34A; color: #000; }
		.game-controls .up { grid-area: up; }
		.game-controls .down { grid-area: down; }
		.game-controls .left { grid-area: left; }
		.game-controls .right { grid-area: right; }
		
		.game-message-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 20; text-align: center; padding: 20px; backdrop-filter: blur(2px); }
		.game-message-overlay h2 { color: #8BC34A; margin-bottom: 15px; font-size: 2rem; text-transform: uppercase; letter-spacing: 2px; }
		.game-message-overlay p { font-size: 1.1rem; margin-bottom: 25px; max-width: 400px; line-height: 1.5; }
		.overlay-buttons { display: flex; gap: 15px; }
		.game-message-overlay button { padding: 12px 30px; font-size: 1.1rem; cursor: pointer; background: #8BC34A; border: none; border-radius: 50px; color: #1a1a1a; font-weight: bold; transition: transform 0.2s, box-shadow 0.2s; }
		.game-message-overlay button:hover { transform: scale(1.05); box-shadow: 0 0 15px rgba(139, 195, 74, 0.5); }
		.btn-secondary { background: #555 !important; color: white !important; }

		.action-btn { padding: 5px 10px; background: #444; border: 1px solid #666; color: white; border-radius: 4px; cursor: pointer; font-size: 0.8rem; transition: opacity 0.2s; }
		.action-btn:hover { background: #666; }
	`,
	content: {
		'fr-FR':`
			<div class="game-container">
				
				<div id="cb-main-menu" class="cb-screen">
					<h1 class="cb-title">⚡ Chargebot</h1>
					<button id="cb-play-btn" class="cb-btn">Jouer</button>
					<div style="margin-top:20px; color:#666; font-size:0.8em">V 1.2</div>
				</div>

				<div id="cb-level-select" class="cb-screen" style="display:none;">
					<h2 style="color:white; margin-bottom:20px;">CHOIX DU NIVEAU</h2>
					<div id="cb-level-grid" class="cb-level-grid">
						</div>
					<button id="cb-back-menu-btn" class="cb-btn" style="min-width:150px; font-size:1rem;">Retour</button>
				</div>

				<div id="cb-game-ui" class="game-ui" style="display:none;">
					<div class="game-header">
						<div class="game-top-row">
							<button class="action-btn" id="cb-exit-btn">☰ Menu</button>
							<div class="game-score-board">
								<div class="game-score">⚡ <span id="chargebot-charge">0</span></div>
								<div class="game-score">⛳ <span id="chargebot-level">1</span></div>
							</div>
							<button class="action-btn" id="chargebot-restart-btn" title="Redémarrer (R)">↺</button>
						</div>
						<div class="game-message" id="chargebot-help-message"></div>
					</div>

					<div class="game-canvas-wrapper">
						<canvas id="chargebot-canvas"></canvas>
					</div>

					<div id="chargebot-controls" class="game-controls">
						<button class="up" data-dir="3">▲</button>
						<button class="left" data-dir="1">◀</button>
						<button class="down" data-dir="4">▼</button>
						<button class="right" data-dir="2">▶</button>
					</div>
					
					<div class="game-message-overlay" id="chargebot-overlay" style="display: none;">
						<h2 id="chargebot-overlay-title"></h2>
						<p id="chargebot-overlay-message"></p>
						<div class="overlay-buttons">
							<button id="chargebot-menu-btn" class="btn-secondary">Menu</button>
							<button id="chargebot-try-again-btn">Réessayer ↺</button>
							<button id="chargebot-next-level-btn">Suivant ➜</button>
						</div>
					</div>
					
					<div class="game-message-overlay" id="chargebot-congratulation" style="display: none;">
						<h2>Félicitations !</h2> 
						<p>Vous avez terminé tous les niveaux et sauvé le petit robot !</p>
						<button id="chargebot-reset-all-btn">Menu Principal</button>
					</div>
				</div>
			</div>
		`,
	},
	init: function (sys, windowId) {
		const system = sys;
		const $window = $(`#${windowId}`);
		const canvas = $window.find('#chargebot-canvas')[0];
		const ctx = canvas.getContext('2d');

		// UI Elements Dictionary
		const ui = {
			screens: {
				menu: $window.find('#cb-main-menu'),
				levels: $window.find('#cb-level-select'),
				game: $window.find('#cb-game-ui')
			},
			game: {
				charge: $window.find('#chargebot-charge'),
				level: $window.find('#chargebot-level'),
				help: $window.find('#chargebot-help-message'),
				overlay: $window.find('#chargebot-overlay'),
				congrats: $window.find('#chargebot-congratulation'),
				overlayTitle: $window.find('#chargebot-overlay-title'),
				overlayMsg: $window.find('#chargebot-overlay-message'),
				controls: $window.find('#chargebot-controls button')
			},
			buttons: {
				play: $window.find('#cb-play-btn'),
				backToMenu: $window.find('#cb-back-menu-btn'),
				levelGrid: $window.find('#cb-level-grid'),
				exitGame: $window.find('#cb-exit-btn'),
				restart: $window.find('#chargebot-restart-btn'),
				ovMenu: $window.find('#chargebot-menu-btn'),
				ovRetry: $window.find('#chargebot-try-again-btn'),
				ovNext: $window.find('#chargebot-next-level-btn'),
				ovReset: $window.find('#chargebot-reset-all-btn')
			}
		};

		// --- STATE MANAGEMENT ---
		let appState = "menu"; // 'menu', 'levels', 'game'
		let gameState = "running"; // 'running', 'gameover', 'finished'
		let currentLevelIndex = 0;
		let maxUnlockedLevel = 0; // Saved Progress
		let currentLevel, bot, map, gameLoopId, isMoving = false;
		let viewOffsetX = 0, viewOffsetY = 0;

		// --- SAVE SYSTEM ---
		const STORAGE_KEY = 'chargebot_save_v1';
		
		function loadProgress() {
			try {
				const data = localStorage.getItem(STORAGE_KEY);
				if(data) {
					const parsed = JSON.parse(data);
					maxUnlockedLevel = parsed.unlocked || 0;
				}
			} catch(e) { console.error("Save load error", e); }
		}

		function saveProgress() {
			// On débloque le niveau suivant si on vient de finir le dernier débloqué
			if (currentLevelIndex >= maxUnlockedLevel) {
				maxUnlockedLevel = currentLevelIndex + 1;
				// Cap max
				if(maxUnlockedLevel >= ALL_LEVELS.length) maxUnlockedLevel = ALL_LEVELS.length; // Permet de rejouer tout mais indique tout fini
				
				localStorage.setItem(STORAGE_KEY, JSON.stringify({ unlocked: maxUnlockedLevel }));
			}
		}

		// --- NAVIGATION ---
		
		function showScreen(screenName) {
			appState = screenName;
			Object.values(ui.screens).forEach(s => s.hide());
			
			if (screenName === 'menu') {
				ui.screens.menu.fadeIn(200);
				cancelAnimationFrame(gameLoopId);
			} else if (screenName === 'levels') {
				renderLevelGrid();
				ui.screens.levels.fadeIn(200);
				cancelAnimationFrame(gameLoopId);
			} else if (screenName === 'game') {
				ui.screens.game.show();
				resizeCanvas(); // Ensure size is correct
			}
		}

		function renderLevelGrid() {
			ui.buttons.levelGrid.empty();
			ALL_LEVELS.forEach((lvl, idx) => {
				const isLocked = idx > maxUnlockedLevel;
				const btn = $(`<div class="cb-level-btn ${isLocked ? 'locked' : 'unlocked'}">${isLocked ? '🔒' : (idx + 1)}</div>`);
				
				if (!isLocked) {
					btn.on('click', () => {
						startLevel(idx);
					});
				}
				ui.buttons.levelGrid.append(btn);
			});
		}

		// --- GAME LOGIC ---

		// --- Paramètres Isométriques ---
		const TILE_WIDTH = 64; 
		const TILE_HEIGHT = 32;
		const TILE_DEPTH = 20;
		const HALF_W = TILE_WIDTH / 2;
		const HALF_H = TILE_HEIGHT / 2;

		const DIRECTION = {
			1: { dx: -1, dy: 0 }, // Ouest
			2: { dx: 1, dy: 0 },  // Est
			3: { dx: 0, dy: -1 }, // Nord
			4: { dx: 0, dy: 1 },  // Sud
		};

		function gridToScreen(x, y) {
			const isoX = (x - y) * HALF_W;
			const isoY = (x + y) * HALF_H;
			return { x: isoX + viewOffsetX, y: isoY + viewOffsetY };
		}

		function shadeColor(color, percent) {
			const num = parseInt(color.replace("#",""),16),
				amt = Math.round(2.55 * percent),
				R = (num >> 16) + amt,
				G = (num >> 8 & 0x00FF) + amt,
				B = (num & 0x0000FF) + amt;
			return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
		}

		function drawTileBase(x, y, topColor, sideColor = null) {
			const { x: sx, y: sy } = gridToScreen(x, y);
			if (!sideColor) sideColor = shadeColor(topColor, -30);
			ctx.save(); ctx.translate(sx, sy);
			ctx.fillStyle = sideColor; 
			ctx.beginPath(); ctx.moveTo(0, HALF_H); ctx.lineTo(-HALF_W, 0); ctx.lineTo(-HALF_W, TILE_DEPTH); ctx.lineTo(0, HALF_H + TILE_DEPTH); ctx.closePath(); ctx.fill();
			ctx.fillStyle = shadeColor(sideColor, -20);
			ctx.beginPath(); ctx.moveTo(0, HALF_H); ctx.lineTo(HALF_W, 0); ctx.lineTo(HALF_W, TILE_DEPTH); ctx.lineTo(0, HALF_H + TILE_DEPTH); ctx.closePath(); ctx.fill();
			ctx.fillStyle = topColor;
			ctx.beginPath(); ctx.moveTo(0, -HALF_H); ctx.lineTo(HALF_W, 0); ctx.lineTo(0, HALF_H); ctx.lineTo(-HALF_W, 0); ctx.closePath(); ctx.fill();
			ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth = 1; ctx.stroke();
			ctx.restore();
		}

		const TILES_DRAW_FUNCTION = {
			0: (x, y) => { }, 
			1: (x, y) => drawTileBase(x, y, '#bdc3c7'),
			2: (x, y) => { drawTileBase(x, y, '#95a5a6'); const { x: sx, y: sy } = gridToScreen(x, y); ctx.save(); ctx.translate(sx, sy); ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-10, -5); ctx.lineTo(5, 5); ctx.moveTo(5, -5); ctx.lineTo(-5, 8); ctx.stroke(); ctx.restore(); },
			3: (x, y) => { drawTileBase(x, y, '#ecf0f1'); const { x: sx, y: sy } = gridToScreen(x, y); ctx.save(); ctx.translate(sx, sy); ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.beginPath(); ctx.moveTo(0, -HALF_H); ctx.lineTo(0, HALF_H); ctx.lineTo(-HALF_W, 0); ctx.fill(); ctx.fillStyle = '#27ae60'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('FIN', 0, 5); ctx.restore(); },
			4: (x, y, charge) => { const isActive = charge > 0; drawTileBase(x, y, isActive ? '#f1c40f' : '#7f8c8d'); if(isActive) { const { x: sx, y: sy } = gridToScreen(x, y); ctx.fillStyle = '#d35400'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('+' + charge, sx, sy + 5); } },
			5: (x, y, direction) => { drawTileBase(x, y, '#3498db'); const { x: sx, y: sy } = gridToScreen(x, y); ctx.save(); ctx.translate(sx, sy); ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '20px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; let char = ''; switch(direction) { case 1: char = '↙'; break; case 2: char = '↗'; break; case 3: char = '↖'; break; case 4: char = '↘'; break; } ctx.fillText(char, 0, 0); ctx.restore(); },
			6: (x, y, id, isBotOn) => { drawTileBase(x, y, isBotOn ? '#d35400' : '#e67e22'); const { x: sx, y: sy } = gridToScreen(x, y); ctx.fillStyle = isBotOn ? '#a04000' : '#c0392b'; ctx.beginPath(); ctx.ellipse(sx, sy, 8, 4, 0, 0, Math.PI*2); ctx.fill(); },
			7: (x, y, id, state) => { const isClosed = state === 'closed'; if(isClosed) { drawTileBase(x, y, '#c0392b'); const { x: sx, y: sy } = gridToScreen(x, y); ctx.fillStyle = '#922b21'; ctx.fillRect(sx - 10, sy - 20, 20, 20); ctx.strokeStyle = 'white'; ctx.strokeRect(sx - 10, sy - 20, 20, 20); ctx.beginPath(); ctx.moveTo(sx-10, sy-20); ctx.lineTo(sx+10, sy); ctx.stroke(); } else { drawTileBase(x, y, '#95a5a6'); const { x: sx, y: sy } = gridToScreen(x, y); ctx.strokeStyle = '#27ae60'; ctx.lineWidth = 2; ctx.strokeRect(sx - 12, sy - 12, 24, 24); } },
		};

		function drawBot(x, y, charge) {
			const { x: sx, y: sy } = gridToScreen(x, y);
			const botY = sy - 5; 
			ctx.save(); ctx.translate(sx, botY);
			ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(0, 5, 12, 6, 0, 0, Math.PI * 2); ctx.fill();
			ctx.fillStyle = (charge > 3) ? '#2ecc71' : (charge > 1 ? '#f1c40f' : '#e74c3c');
			const w = 24; const h = 28;
			ctx.fillRect(-w/2, -h, w, h); ctx.beginPath(); ctx.arc(0, -h, w/2, Math.PI, 0); ctx.fill();
			ctx.fillStyle = 'white'; ctx.fillRect(-6, -h - 5, 4, 4); ctx.fillRect(2, -h - 5, 4, 4);
			ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.moveTo(0, -h + 8); ctx.lineTo(4, -h + 14); ctx.lineTo(-1, -h + 14); ctx.lineTo(2, -h + 20); ctx.lineTo(-4, -h + 12); ctx.lineTo(0, -h + 12); ctx.fill();
			ctx.restore();
		}

		function resizeCanvas() {
			const container = $window.find('.game-canvas-wrapper');
			if(container.width() > 0) {
				canvas.width = container.width();
				canvas.height = container.height();
			}
			if(!map) return;
			const mapRows = map.length;
			const mapCols = map[0].length;
			viewOffsetX = canvas.width / 2;
			viewOffsetY = (canvas.height / 2) - ((mapRows + mapCols) * TILE_HEIGHT / 4);
		}

		function startLevel(index) {
			if (index >= ALL_LEVELS.length) {
				// Fin du jeu complet
				ui.game.overlay.hide();
				ui.game.congrats.show();
				return;
			}
			
			currentLevelIndex = index;
			showScreen('game');
			
			ALL_LEVELS[index].start();
			currentLevel = ALL_LEVELS[index];
			bot = currentLevel.bot;
			map = currentLevel.map;
			
			gameState = "running";
			isMoving = false;
			
			ui.game.overlay.hide();
			ui.game.congrats.hide();
			
			resizeCanvas();
			updateGameUI();
			
			// Start loop
			if(gameLoopId) cancelAnimationFrame(gameLoopId);
			draw();
		}

		function updateGameUI() {
			if (!bot) return;
			ui.game.charge.text(bot.charge);
			ui.game.level.text(currentLevelIndex + 1);
			ui.game.help.html(currentLevel.helpMessage || "&nbsp;");
			if(bot.charge <= 1) ui.game.charge.css('color', '#e74c3c');
			else ui.game.charge.css('color', '#8BC34A');
		}

		function moveBot(dx, dy, isConveyorMove = false) {
			if (isMoving || gameState !== "running") return;

			const newX = bot.x + dx;
			const newY = bot.y + dy;
			const oldTile = map[bot.y][bot.x];

			if (newY < 0 || newY >= map.length || newX < 0 || newX >= map[0].length) return;

			const targetTile = map[newY][newX];
			if (targetTile.type === 7 && targetTile.state === 'closed') return;

			if (!isConveyorMove) {
				if (bot.charge <= 0) return;
				bot.charge--;
			}

			isMoving = true;
			if (oldTile.type === 6) { oldTile._pressed = false; toggleDoors(oldTile.id, 'closed'); }

			bot.x = newX; bot.y = newY;
			updateGameUI();

			setTimeout(() => { checkTileEffect(targetTile); }, 150);
		}

		function toggleDoors(id, state) {
			if(id === null) return;
			map.forEach(row => row.forEach(t => { if (t.type === 7 && t.id === id) t.state = state; }));
		}

		function checkTileEffect(tile) {
			if (tile.type === 3) { gameOver("win"); return; }
			if (tile.type === 0) { gameOver("fall"); return; }
			if (tile.type === 2) { tile.type = 0; }
			if (tile.type === 4 && tile.charge > 0) { bot.charge += tile.charge; tile.charge = 0; updateGameUI(); }
			if (tile.type === 6) { tile._pressed = true; toggleDoors(tile.id, 'open'); }
			if (tile.type === 5) { 
				isMoving = false; 
				const d = DIRECTION[tile.direction]; 
				setTimeout(() => moveBot(d.dx, d.dy, true), 50); 
				return; 
			}
			if (bot.charge <= 0) { gameOver("battery"); return; }
			isMoving = false;
		}

		function gameOver(reason) {
			gameState = "gameover";
			ui.buttons.ovNext.hide();
			ui.buttons.ovRetry.show();
			
			if (reason === "win") {
				gameState = "finished";
				saveProgress(); // Sauvegarde ici
				ui.game.overlayTitle.text("Niveau Terminé !").css("color", "#8BC34A");
				ui.game.overlayMsg.text("Batterie restante : " + bot.charge);
				ui.buttons.ovNext.show();
				ui.buttons.ovRetry.hide();
			} else if (reason === "fall") {
				ui.game.overlayTitle.text("Chute !").css("color", "#e74c3c");
				ui.game.overlayMsg.text("Le robot est tombé dans le vide.");
			} else if (reason === "battery") {
				ui.game.overlayTitle.text("Batterie Vide").css("color", "#f39c12");
				ui.game.overlayMsg.text("Plus d'énergie pour avancer.");
			}
			ui.game.overlay.fadeIn(200);
		}

		function draw() {
			if (appState !== 'game') return; // Stop drawing if not in game

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			if (!map) return;

			for (let y = 0; y < map.length; y++) {
				for (let x = 0; x < map[y].length; x++) {
					const tile = map[y][x];
					const drawFn = TILES_DRAW_FUNCTION[tile.type];
					if (drawFn) {
						if (tile.type === 6) drawFn(x, y, tile.id, tile._pressed);
						else if (tile.type === 7) drawFn(x, y, tile.id, tile.state);
						else if (tile.type === 4) drawFn(x, y, tile.charge);
						else if (tile.type === 5) drawFn(x, y, tile.direction);
						else drawFn(x, y);
					}
					if (bot.x === x && bot.y === y && gameState !== "gameover_fall") {
						drawBot(x, y, bot.charge);
					}
				}
			}
			gameLoopId = requestAnimationFrame(draw);
		}

		// --- INPUTS ---
		const handleInput = (key) => {
			if (['ArrowUp', 'z', 'Z'].includes(key)) moveBot(0, -1);
			if (['ArrowDown', 's', 'S'].includes(key)) moveBot(0, 1);
			if (['ArrowLeft', 'q', 'Q'].includes(key)) moveBot(-1, 0);
			if (['ArrowRight', 'd', 'D'].includes(key)) moveBot(1, 0);
			if (['r', 'R'].includes(key)) startLevel(currentLevelIndex);
		};

		const keyHandler = (e) => {
			if (appState !== 'game') return;
			
			// Shortcut Enter pour recommencer ou passer au niveau suivant
			if (ui.game.overlay.is(':visible')) {
				if(e.key === "Enter") {
					if(gameState === "finished") startLevel(currentLevelIndex + 1);
					else startLevel(currentLevelIndex);
					return;
				}
			}

			if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
			handleInput(e.key);
		};

		// --- EVENTS BINDING ---
		$(document).on('keydown', keyHandler);
		
		ui.game.controls.on('click', function(e) {
			e.preventDefault();
			const dir = DIRECTION[$(this).data('dir')];
			if (dir) moveBot(dir.dx, dir.dy);
		});

		// Menu Buttons
		ui.buttons.play.on('click', () => showScreen('levels'));
		ui.buttons.backToMenu.on('click', () => showScreen('menu'));
		
		// Game Buttons
		ui.buttons.exitGame.on('click', () => showScreen('levels'));
		ui.buttons.restart.on('click', () => startLevel(currentLevelIndex));
		
		// Overlay Buttons
		ui.buttons.ovMenu.on('click', () => showScreen('levels'));
		ui.buttons.ovRetry.on('click', () => startLevel(currentLevelIndex));
		ui.buttons.ovNext.on('click', () => startLevel(currentLevelIndex + 1));
		ui.buttons.ovReset.on('click', () => showScreen('menu'));

		// Resize
		const resizeObserver = new ResizeObserver(() => {
			resizeCanvas();
			if(appState === 'game' && gameState !== 'running') draw(); 
		});
		resizeObserver.observe(canvas);

		// INIT SEQUENCE
		loadProgress();
		showScreen('menu');

		// CLEANUP
		const observer = new MutationObserver(() => {
			if (!document.body.contains(canvas)) {
				cancelAnimationFrame(gameLoopId);
				document.removeEventListener('keydown', keyHandler);
				$(document).off('keydown', keyHandler);
				resizeObserver.disconnect();
				observer.disconnect();
			}
		});
		observer.observe(document.body, { childList: true, subtree: true });

		return {
			restart: () => showScreen('menu')
		};
	}
};