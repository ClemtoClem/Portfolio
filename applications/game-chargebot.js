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

const VERSION = 'beta';
export const gameChargebotApp = {
	id: 'game-chargebot',
	title: 'Chargebot',
	version: VERSION,
	icon: `<svg fill="#000000" viewBox="0 0 24 24"><path d="M21.928 11.607c-.202-.488-.635-.605-.928-.633V8c0-1.103-.897-2-2-2h-6V4.61c.305-.274.5-.668.5-1.11a1.5 1.5 0 0 0-3 0c0 .442.195.836.5 1.11V6H5c-1.103 0-2 .897-2 2v2.997l-.082.006A1 1 0 0 0 1.99 12v2a1 1 0 0 0 1 1H3v5c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5a1 1 0 0 0 1-1v-1.938a1.006 1.006 0 0 0-.072-.455zM5 20V8h14l.001 3.996L19 12v2l.001.005.001 5.995H5z"></path><ellipse cx="8.5" cy="12" rx="1.5" ry="2"></ellipse><ellipse cx="15.5" cy="12" rx="1.5" ry="2"></ellipse><path d="M8 16h8v2H8z"></path></svg>`,
	iconColor: '#8BC34A',
	headerColor: '#8BC34A',
	type: 'game',
	style: `
		:root {
			--primary-color: #8BC34A;
			--primary-dark-color: #487217;
			--primary-background-color: #555;
		}
		.app-content { padding: 0px; }
	`,
	content: {
		'en-US':`
			<div class="game-container">
				
				<div id="game-main-menu" class="game-menu-screen">
					<h1 class="game-title">⚡ Chargebot</h1>
					<div class="game-version">Version ${VERSION}</div>
					<button id="game-play-btn" class="game-btn">PLAY</button>
				</div>

				<div id="game-level-select" class="game-menu-screen" style="display:none;">
					<h1 class="game-title">⚡ Chargebot</h1>
					<h2 style="color:white; margin-bottom:20px;">CHOICE OF LEVEL</h2>
					<div id="game-level-grid" class="game-level-grid"></div>
					<button id="game-back-menu-btn" class="game-btn" style="min-width:150px; font-size:1rem;">Return</button>
				</div>

				<div id="chargebot-game-content" class="game-content" style="display:none;">
					<div class="game-header">
						<div class="game-top-row">
							<button class="game-action-btn" id="game-exit-btn">
								<svg viewBox="0 0 24 24"><path d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12ZM3 18C3 17.4477 3.44772 17 4 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18Z"></path></svg>
								Menu
							</button>
							<div class="game-score-board">
								<div class="game-score">⚡ <span id="chargebot-charge">0</span></div>
								<div class="game-score">⛳ <span id="chargebot-level">1</span></div>
							</div>
							<button class="game-action-btn" id="chargebot-restart-btn" title="Restart (R)">
								<svg viewBox="0 0 100 100"><path d="M76.5,58.3c0,0.1,0,0.2-0.1,0.2c-0.3,1.1-0.7,2.2-1.1,3.3c-0.5,1.2-1,2.3-1.6,3.4c-1.2,2.2-2.7,4.2-4.5,6 c-1.7,1.8-3.7,3.4-5.9,4.7c-2.2,1.3-4.5,2.3-7,3c-2.5,0.7-5.1,1.1-7.7,1.1C32.8,80,20,67.2,20,51.3s12.8-28.6,28.6-28.6 c5.3,0,10.3,1.5,14.6,4c0,0,0,0,0.1,0c2.1,1.2,4,2.7,5.6,4.4c0.5,0.4,0.8,0.7,1.2,1.2c0.9,0.8,1.6,0.3,1.6-0.9V22c0-1.1,0.9-2,2-2h4 c1.1,0,2,0.9,2.2,2v24.5c0,0.9-0.8,1.8-1.8,1.8H53.6c-1.1,0-1.9-0.8-1.9-1.9v-4.2c0-1.1,0.9-2,2-2h9.4c0.8,0,1.4-0.2,1.7-0.7 c-3.6-5-9.6-8.3-16.2-8.3c-11.1,0-20.1,9-20.1,20.1s9,20.1,20.1,20.1c8.7,0,16.1-5.5,18.9-13.3c0,0,0.3-1.8,1.7-1.8 c1.4,0,4.8,0,5.7,0c0.8,0,1.6,0.6,1.6,1.5C76.5,58,76.5,58.1,76.5,58.3z"></path></svg>
							</button>
						</div>
						<div class="game-message" id="chargebot-help-message"></div>
					</div>

					<div class="game-main>
						<div class="game-canvas-wrapper">
							<canvas id="chargebot-canvas"></canvas>
						</div>

						<div id="chargebot-controls" class="game-controls">
							<button class="up" data-dir="3">▲</button>
							<button class="left" data-dir="1">◀</button>
							<button class="center" data-dir="4">▼</button>
							<button class="right" data-dir="2">▶</button>
						</div>
					
						<div class="game-message-overlay" id="chargebot-overlay" style="display: none;">
							<h2 id="chargebot-overlay-title"></h2>
							<p id="chargebot-overlay-message"></p>
							<div class="overlay-buttons">
								<button id="chargebot-menu-btn" class="btn-secondary">Menu</button>
								<button id="chargebot-try-again-btn">Restart ↺</button>
								<button id="chargebot-next-level-btn">Next ➜</button>
							</div>
						</div>
						
						<div class="game-message-overlay" id="chargebot-congratulation" style="display: none;">
							<h2>Congratulations !</h2> 
							<p>You have completed all levels and saved the little robot !</p>
							<button id="chargebot-reset-all-btn">Main Menu</button>
						</div>
					</div>
				</div>
			</div>
		`,
		'fr-FR':`
			<div class="game-container">
				
				<div id="game-main-menu" class="game-menu-screen">
					<h1 class="game-title">⚡ Chargebot</h1>
					<div class="game-version">Version ${VERSION}</div>
					<button id="game-play-btn" class="game-btn">Jouer</button>
				</div>

				<div id="game-level-select" class="game-menu-screen" style="display:none;">
					<h1 class="game-title">⚡ Chargebot</h1>
					<h2 style="color:white; margin-bottom:20px;">CHOIX DU NIVEAU</h2>
					<div id="game-level-grid" class="game-level-grid"></div>
					<button id="game-back-menu-btn" class="game-btn" style="min-width:150px; font-size:1rem;">Retour</button>
				</div>

				<div id="chargebot-game-content" class="game-content" style="display:none;">
					<div class="game-header">
						<div class="game-top-row">
							<button class="game-action-btn" id="game-exit-btn">
								<svg viewBox="0 0 24 24"><path d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12ZM3 18C3 17.4477 3.44772 17 4 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18Z"></path></svg>
								Menu
							</button>
							<div class="game-score-board">
								<div class="game-score">⚡ <span id="chargebot-charge">0</span></div>
								<div class="game-score">⛳ <span id="chargebot-level">1</span></div>
							</div>
							<button class="game-action-btn" id="chargebot-restart-btn" title="Redémarrer (R)">
								<svg viewBox="0 0 100 100"><path d="M76.5,58.3c0,0.1,0,0.2-0.1,0.2c-0.3,1.1-0.7,2.2-1.1,3.3c-0.5,1.2-1,2.3-1.6,3.4c-1.2,2.2-2.7,4.2-4.5,6 c-1.7,1.8-3.7,3.4-5.9,4.7c-2.2,1.3-4.5,2.3-7,3c-2.5,0.7-5.1,1.1-7.7,1.1C32.8,80,20,67.2,20,51.3s12.8-28.6,28.6-28.6 c5.3,0,10.3,1.5,14.6,4c0,0,0,0,0.1,0c2.1,1.2,4,2.7,5.6,4.4c0.5,0.4,0.8,0.7,1.2,1.2c0.9,0.8,1.6,0.3,1.6-0.9V22c0-1.1,0.9-2,2-2h4 c1.1,0,2,0.9,2.2,2v24.5c0,0.9-0.8,1.8-1.8,1.8H53.6c-1.1,0-1.9-0.8-1.9-1.9v-4.2c0-1.1,0.9-2,2-2h9.4c0.8,0,1.4-0.2,1.7-0.7 c-3.6-5-9.6-8.3-16.2-8.3c-11.1,0-20.1,9-20.1,20.1s9,20.1,20.1,20.1c8.7,0,16.1-5.5,18.9-13.3c0,0,0.3-1.8,1.7-1.8 c1.4,0,4.8,0,5.7,0c0.8,0,1.6,0.6,1.6,1.5C76.5,58,76.5,58.1,76.5,58.3z"></path></svg>
							</button>
						</div>
						<div class="game-message" id="chargebot-help-message"></div>
					</div>

					<div class="game-canvas-wrapper">
						<canvas id="chargebot-canvas"></canvas>
					</div>

					<div id="chargebot-controls" class="game-controls">
						<button class="up" data-dir="3">▲</button>
						<button class="left" data-dir="1">◀</button>
						<button class="center" data-dir="4">▼</button>
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
        /** @type {System} */
		const system = sys;
        /** @type {JQuery<HTMLElement>} */
		const $window = $(`#${windowId}`);

		const canvas = $window.find('#chargebot-canvas')[0];
		const ctx = canvas.getContext('2d');

		// UI Elements Dictionary
		const ui = {
			screens: {
        		/** @type {JQuery<HTMLElement>} */
				menu: $window.find('#game-main-menu'),
        		/** @type {JQuery<HTMLElement>} */
				levels: $window.find('#game-level-select'),
        		/** @type {JQuery<HTMLElement>} */
				game: $window.find('#chargebot-game-content')
			},
			game: {
        		/** @type {JQuery<HTMLElement>} */
				charge: $window.find('#chargebot-charge'),
        		/** @type {JQuery<HTMLElement>} */
				level: $window.find('#chargebot-level'),
        		/** @type {JQuery<HTMLElement>} */
				help: $window.find('#chargebot-help-message'),
        		/** @type {JQuery<HTMLElement>} */
				overlay: $window.find('#chargebot-overlay'),
        		/** @type {JQuery<HTMLElement>} */
				congrats: $window.find('#chargebot-congratulation'),
        		/** @type {JQuery<HTMLElement>} */
				overlayTitle: $window.find('#chargebot-overlay-title'),
        		/** @type {JQuery<HTMLElement>} */
				overlayMsg: $window.find('#chargebot-overlay-message'),
        		/** @type {JQuery<HTMLElement>} */
				controls: $window.find('#chargebot-controls button')
			},
			buttons: {
        		/** @type {JQuery<HTMLElement>} */
				play: $window.find('#game-play-btn'),
        		/** @type {JQuery<HTMLElement>} */
				backToMenu: $window.find('#game-back-menu-btn'),
        		/** @type {JQuery<HTMLElement>} */
				levelGrid: $window.find('#game-level-grid'),
        		/** @type {JQuery<HTMLElement>} */
				exitGame: $window.find('#game-exit-btn'),
        		/** @type {JQuery<HTMLElement>} */
				restart: $window.find('#chargebot-restart-btn'),
        		/** @type {JQuery<HTMLElement>} */
				ovMenu: $window.find('#chargebot-menu-btn'),
        		/** @type {JQuery<HTMLElement>} */
				ovRetry: $window.find('#chargebot-try-again-btn'),
        		/** @type {JQuery<HTMLElement>} */
				ovNext: $window.find('#chargebot-next-level-btn'),
        		/** @type {JQuery<HTMLElement>} */
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
		const STORAGE_KEY = this.id;
		
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
				const btn = $(`<div class="game-level-btn ${isLocked ? 'locked' : 'unlocked'}">${isLocked ? '🔒' : (idx + 1)}</div>`);
				
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