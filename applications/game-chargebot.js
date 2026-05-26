import { shadeColor } from '../core/canvas.js';

const VERSION = '1.0.0';

const STRINGS = {
	'en-US': {
		play: 'PLAY', return: 'Return', menu: 'Menu', levelTitle: 'CHOICE OF LEVEL',
		tryAgain: 'Restart ↺', next: 'Next ➜', mainMenu: 'Main Menu',
		levelComplete: 'Level Complete!', fall: 'Fall!', emptyBattery: 'Battery empty',
		fallMsg: 'The robot fell into the void.',
		batteryMsg: 'Out of energy.',
		batteryLeft: 'Battery remaining: ',
		congrats: 'Congratulations!',
		congratsMsg: 'You completed every level and saved the little robot!',
	},
	'fr-FR': {
		play: 'JOUER', return: 'Retour', menu: 'Menu', levelTitle: 'CHOIX DU NIVEAU',
		tryAgain: 'Réessayer ↺', next: 'Suivant ➜', mainMenu: 'Menu Principal',
		levelComplete: 'Niveau Terminé !', fall: 'Chute !', emptyBattery: 'Batterie Vide',
		fallMsg: "Le robot est tombé dans le vide.",
		batteryMsg: "Plus d'énergie pour avancer.",
		batteryLeft: 'Batterie restante : ',
		congrats: 'Félicitations !',
		congratsMsg: 'Vous avez terminé tous les niveaux et sauvé le petit robot !',
	},
};

// ── Levels ──────────────────────────────────────────────────────────
// Tile types: 0 void · 1 ground · 2 cracked · 3 finish · 4 charging · 5 conveyor · 6 button · 7 door
class Bot { constructor(x, y, charge) { this.x = x; this.y = y; this.charge = charge; } }

class Level {
	constructor(map, botX, botY, botCharge, help = '') {
		this.initMap = map;
		this.initBot = new Bot(botX, botY, botCharge);
		this.helpMessage = help;
	}
	start() {
		this.map = this.initMap.map(row => row.map(t => ({ ...t })));
		for (const row of this.map) for (const t of row) {
			t.type = t.type || 0;
			if (t.type === 4 && typeof t.charge !== 'number') t.charge = 0;
			if (t.type === 5 && ![1, 2, 3, 4].includes(t.direction)) t.direction = 1;
			if (t.type === 6) { t._pressed = false; if (typeof t.id === 'undefined') t.id = null; }
			if (t.type === 7) { if (typeof t.state === 'undefined') t.state = 'closed'; if (typeof t.id === 'undefined') t.id = null; }
		}
		this.bot = new Bot(this.initBot.x, this.initBot.y, this.initBot.charge);
	}
}

const ALL_LEVELS = [
	new Level([
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 3 }, { type: 1 }],
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
	], 2, 2, 6, 'Get to the finish without running out of power.'),
	new Level([
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 3 }, { type: 1 }, { type: 1 }, { type: 1 }],
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 4, charge: 5 }, { type: 1 }],
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
	], 2, 5, 6, 'Charging plates will help you go farther.'),
	new Level([
		[{ type: 1 }, { type: 1 }, { type: 2 }, { type: 2 }, { type: 2 }, { type: 1 }, { type: 1 }],
		[{ type: 1 }, { type: 4, charge: 4 }, { type: 2 }, { type: 2, charge: 4 }, { type: 2 }, { type: 3 }, { type: 1 }],
		[{ type: 1 }, { type: 1 }, { type: 2 }, { type: 2 }, { type: 2 }, { type: 1 }, { type: 1 }],
		[{ type: 1 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }],
	], 0, 3, 3, 'Cracked plates can only be used once.'),
	new Level([
		[{ type: 1 }, { type: 1 }, { type: 0 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
		[{ type: 3 }, { type: 1 }, { type: 0 }, { type: 1 }, { type: 1 }, { type: 3 }, { type: 1 }, { type: 1 }, { type: 1 }],
		[{ type: 1 }, { type: 1 }, { type: 0 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 4, charge: 5 }],
		[{ type: 1 }, { type: 1 }, { type: 0 }, { type: 0 }, { type: 1 }, { type: 0 }, { type: 0 }, { type: 1 }, { type: 1 }],
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
		[{ type: 1 }, { type: 1 }, { type: 4, charge: 6 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
	], 2, 2, 5, 'Plan your route carefully.'),
	new Level([
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 1 }, { type: 1 }, { type: 1 }],
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 3 }, { type: 1 }],
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 1 }, { type: 1 }, { type: 1 }],
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }],
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 5, direction: 1 }, { type: 5, direction: 1 }, { type: 5, direction: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
		[{ type: 1 }, { type: 4, charge: 6 }, { type: 1 }, { type: 5, direction: 2 }, { type: 5, direction: 2 }, { type: 5, direction: 2 }, { type: 1 }, { type: 1 }, { type: 1 }],
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 1 }, { type: 1 }, { type: 1 }],
	], 2, 2, 5, 'Conveyor belts move you without using power.'),
	new Level([
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 5, direction: 1 }, { type: 4, charge: 9 }, { type: 5, direction: 2 }, { type: 1 }, { type: 1 }, { type: 1 }],
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 1 }, { type: 6, id: 1 }, { type: 1 }],
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 5, direction: 2 }, { type: 5, direction: 2 }, { type: 5, direction: 2 }, { type: 1 }, { type: 1 }, { type: 1 }],
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }],
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 5, direction: 4 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 5, direction: 4 }],
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 7, id: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 0 }],
		[{ type: 1 }, { type: 4, charge: 9 }, { type: 1 }, { type: 1 }, { type: 7, id: 1 }, { type: 1 }, { type: 1 }, { type: 3 }, { type: 1 }],
		[{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 7, id: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
	], 2, 6, 7, 'Press buttons to open doors with the same ID.'),
];

const TILE_WIDTH = 64, TILE_HEIGHT = 32, TILE_DEPTH = 20;
const HALF_W = TILE_WIDTH / 2, HALF_H = TILE_HEIGHT / 2;
const DIRECTION = {
	1: { dx: -1, dy: 0 }, 2: { dx: 1, dy: 0 },
	3: { dx: 0, dy: -1 }, 4: { dx: 0, dy: 1 },
};

const MENU_SVG = `<svg viewBox="0 0 24 24"><path d="M4 5C3.45 5 3 5.45 3 6s.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4zm0 6c-.55 0-1 .45-1 1s.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4zm0 6c-.55 0-1 .45-1 1s.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4z"/></svg>`;
const REFRESH_SVG = `<svg viewBox="0 0 100 100"><path d="M76.5,58.3c-2.8,7.8-10.2,13.3-18.9,13.3-11.1,0-20.1-9-20.1-20.1s9-20.1,20.1-20.1c6.6,0,12.6,3.3,16.2,8.3-.3.5-.9.7-1.7.7H53.6c-1.1,0-2,.9-2,2v4.2c0,1.1.8,1.9,1.9,1.9h17.9c1,0,1.8-.9,1.8-1.8V22c0-1.1-1.1-2-2.2-2h-4c-1.1,0-2,.9-2,2v3c0,1.2-.7,1.7-1.6.9-.4-.5-.7-.8-1.2-1.2-1.6-1.7-3.5-3.2-5.6-4.4-4.3-2.5-9.3-4-14.6-4C32.8,16.3,20,29,20,44.9c0,15.8,12.8,28.5,28.6,28.5,2.6,0,5.2-.4,7.7-1.1,2.5-.7,4.8-1.7,7-3,2.2-1.3,4.2-2.9,5.9-4.7,1.8-1.8,3.3-3.8,4.5-6,.6-1.1,1.1-2.2,1.6-3.4z"/></svg>`;

function html(s) {
	return `
		<div class="game-container">
			<div id="cb-menu" class="game-menu-screen">
				<h1 class="game-title">⚡ Chargebot</h1>
				<div class="game-version">Version ${VERSION}</div>
				<button id="cb-play" class="game-btn">${s.play}</button>
			</div>
			<div id="cb-levels" class="game-menu-screen" style="display:none;">
				<h1 class="game-title">⚡ Chargebot</h1>
				<h2 style="color:white;margin-bottom:20px;">${s.levelTitle}</h2>
				<div id="cb-level-grid" class="game-level-grid"></div>
				<button id="cb-back" class="game-btn" style="min-width:150px;font-size:1rem;">${s.return}</button>
			</div>
			<div id="cb-game" class="game-content" style="display:none;">
				<div class="game-header">
					<div class="game-top-row">
						<button class="game-action-btn" id="cb-exit">${MENU_SVG} ${s.menu}</button>
						<div class="game-score-board">
							<div class="game-score">⚡ <span id="cb-charge">0</span></div>
							<div class="game-score">⛳ <span id="cb-level">1</span></div>
						</div>
						<button class="game-action-btn" id="cb-restart">${REFRESH_SVG}</button>
					</div>
					<div class="game-message" id="cb-help"></div>
				</div>
				<div class="game-main">
					<div class="game-canvas-wrapper">
						<canvas id="cb-canvas"></canvas>
					</div>
					<div id="cb-controls" class="game-controls">
						<button class="up" data-dir="3">▲</button>
						<button class="left" data-dir="1">◀</button>
						<button class="center" data-dir="4">▼</button>
						<button class="right" data-dir="2">▶</button>
					</div>
					<div class="game-message-overlay" id="cb-overlay" style="display:none;">
						<h2 id="cb-overlay-title"></h2>
						<p id="cb-overlay-msg"></p>
						<div class="overlay-buttons">
							<button id="cb-ov-menu" class="btn-secondary">${s.menu}</button>
							<button id="cb-ov-retry">${s.tryAgain}</button>
							<button id="cb-ov-next">${s.next}</button>
						</div>
					</div>
					<div class="game-message-overlay" id="cb-congrats" style="display:none;">
						<h2>${s.congrats}</h2>
						<p>${s.congratsMsg}</p>
						<button id="cb-reset-all">${s.mainMenu}</button>
					</div>
				</div>
			</div>
		</div>
	`;
}

export const gameChargebotApp = {
	id: 'game-chargebot',
	title: 'Chargebot',
	version: VERSION,
	icon: `<svg viewBox="0 0 24 24" fill="#000"><path d="M21 11h-1V8a2 2 0 0 0-2-2h-5V4.6c.3-.3.5-.7.5-1.1a1.5 1.5 0 1 0-3 0c0 .4.2.8.5 1.1V6H6a2 2 0 0 0-2 2v3H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1zM5 20V8h14v12H5z"/><ellipse cx="9" cy="12" rx="1.5" ry="2"/><ellipse cx="15" cy="12" rx="1.5" ry="2"/><path d="M8 16h8v2H8z"/></svg>`,
	iconColor: '#8BC34A',
	headerColor: '#8BC34A',
	type: 'game',
	style: `
		:root {
			--primary-color: #8BC34A;
			--primary-dark-color: #487217;
			--primary-background-color: #555;
		}
		.app-content { padding: 0; }
	`,
	content: { 'en-US': html(STRINGS['en-US']), 'fr-FR': html(STRINGS['fr-FR']) },

	onMount(ctx) {
		const strings = STRINGS[ctx.lang] || STRINGS['fr-FR'];
		const canvas = ctx.$('#cb-canvas');
		const cctx = canvas.getContext('2d');

		const ui = {
			menu:    ctx.$('#cb-menu'),
			levels:  ctx.$('#cb-levels'),
			game:    ctx.$('#cb-game'),
			charge:  ctx.$('#cb-charge'),
			level:   ctx.$('#cb-level'),
			help:    ctx.$('#cb-help'),
			overlay: ctx.$('#cb-overlay'),
			overlayTitle: ctx.$('#cb-overlay-title'),
			overlayMsg:   ctx.$('#cb-overlay-msg'),
			ovMenu:  ctx.$('#cb-ov-menu'),
			ovRetry: ctx.$('#cb-ov-retry'),
			ovNext:  ctx.$('#cb-ov-next'),
			congrats: ctx.$('#cb-congrats'),
			levelGrid: ctx.$('#cb-level-grid'),
		};

		let appState = 'menu';     // 'menu' | 'levels' | 'game'
		let gameState = 'running'; // 'running' | 'gameover' | 'finished'
		let currentLevelIndex = 0;
		let maxUnlockedLevel = ctx.storage.get('progress', { unlocked: 0 }).unlocked || 0;
		let currentLevel, bot, map, gameLoopId;
		let viewOffsetX = 0, viewOffsetY = 0, isMoving = false;

		function saveProgress() {
			if (currentLevelIndex >= maxUnlockedLevel) {
				maxUnlockedLevel = Math.min(ALL_LEVELS.length, currentLevelIndex + 1);
				ctx.storage.set('progress', { unlocked: maxUnlockedLevel });
			}
		}

		function showScreen(name) {
			appState = name;
			[ui.menu, ui.levels, ui.game].forEach(s => s.style.display = 'none');
			if (name === 'menu')   { ui.menu.style.display = ''; cancelAnimationFrame(gameLoopId); }
			if (name === 'levels') { renderLevelGrid(); ui.levels.style.display = ''; cancelAnimationFrame(gameLoopId); }
			if (name === 'game')   { ui.game.style.display = ''; resize(); }
		}

		function renderLevelGrid() {
			ui.levelGrid.innerHTML = '';
			ALL_LEVELS.forEach((_l, idx) => {
				const locked = idx > maxUnlockedLevel;
				const btn = document.createElement('div');
				btn.className = `game-level-btn ${locked ? 'locked' : 'unlocked'}`;
				btn.textContent = locked ? '🔒' : (idx + 1);
				if (!locked) ctx.scope.on(btn, 'click', () => startLevel(idx));
				ui.levelGrid.appendChild(btn);
			});
		}

		function gridToScreen(x, y) {
			return { x: (x - y) * HALF_W + viewOffsetX, y: (x + y) * HALF_H + viewOffsetY };
		}

		function drawTileBase(x, y, top, side) {
			const { x: sx, y: sy } = gridToScreen(x, y);
			if (!side) side = shadeColor(top, -30);
			cctx.save(); cctx.translate(sx, sy);
			cctx.fillStyle = side;
			cctx.beginPath(); cctx.moveTo(0, HALF_H); cctx.lineTo(-HALF_W, 0); cctx.lineTo(-HALF_W, TILE_DEPTH); cctx.lineTo(0, HALF_H + TILE_DEPTH); cctx.closePath(); cctx.fill();
			cctx.fillStyle = shadeColor(side, -20);
			cctx.beginPath(); cctx.moveTo(0, HALF_H); cctx.lineTo(HALF_W, 0); cctx.lineTo(HALF_W, TILE_DEPTH); cctx.lineTo(0, HALF_H + TILE_DEPTH); cctx.closePath(); cctx.fill();
			cctx.fillStyle = top;
			cctx.beginPath(); cctx.moveTo(0, -HALF_H); cctx.lineTo(HALF_W, 0); cctx.lineTo(0, HALF_H); cctx.lineTo(-HALF_W, 0); cctx.closePath(); cctx.fill();
			cctx.strokeStyle = 'rgba(255,255,255,0.1)'; cctx.lineWidth = 1; cctx.stroke();
			cctx.restore();
		}

		const TILE_DRAWERS = {
			0: () => {},
			1: (x, y) => drawTileBase(x, y, '#bdc3c7'),
			2: (x, y) => {
				drawTileBase(x, y, '#95a5a6');
				const { x: sx, y: sy } = gridToScreen(x, y);
				cctx.save(); cctx.translate(sx, sy);
				cctx.strokeStyle = '#2c3e50'; cctx.lineWidth = 1.5;
				cctx.beginPath(); cctx.moveTo(-10, -5); cctx.lineTo(5, 5);
				cctx.moveTo(5, -5); cctx.lineTo(-5, 8); cctx.stroke();
				cctx.restore();
			},
			3: (x, y) => {
				drawTileBase(x, y, '#ecf0f1');
				const { x: sx, y: sy } = gridToScreen(x, y);
				cctx.fillStyle = '#27ae60';
				cctx.font = 'bold 14px sans-serif'; cctx.textAlign = 'center';
				cctx.fillText('FIN', sx, sy + 5);
			},
			4: (x, y, charge) => {
				const active = charge > 0;
				drawTileBase(x, y, active ? '#f1c40f' : '#7f8c8d');
				if (active) {
					const { x: sx, y: sy } = gridToScreen(x, y);
					cctx.fillStyle = '#d35400'; cctx.font = 'bold 16px sans-serif'; cctx.textAlign = 'center';
					cctx.fillText('+' + charge, sx, sy + 5);
				}
			},
			5: (x, y, direction) => {
				drawTileBase(x, y, '#3498db');
				const { x: sx, y: sy } = gridToScreen(x, y);
				const chars = { 1: '↙', 2: '↗', 3: '↖', 4: '↘' };
				cctx.fillStyle = 'rgba(255,255,255,0.6)'; cctx.font = '20px sans-serif';
				cctx.textAlign = 'center'; cctx.textBaseline = 'middle';
				cctx.fillText(chars[direction] || '?', sx, sy);
			},
			6: (x, y, _id, pressed) => {
				drawTileBase(x, y, pressed ? '#d35400' : '#e67e22');
				const { x: sx, y: sy } = gridToScreen(x, y);
				cctx.fillStyle = pressed ? '#a04000' : '#c0392b';
				cctx.beginPath(); cctx.ellipse(sx, sy, 8, 4, 0, 0, Math.PI * 2); cctx.fill();
			},
			7: (x, y, _id, state) => {
				const closed = state === 'closed';
				if (closed) {
					drawTileBase(x, y, '#c0392b');
					const { x: sx, y: sy } = gridToScreen(x, y);
					cctx.fillStyle = '#922b21';
					cctx.fillRect(sx - 10, sy - 20, 20, 20);
					cctx.strokeStyle = 'white'; cctx.strokeRect(sx - 10, sy - 20, 20, 20);
					cctx.beginPath(); cctx.moveTo(sx - 10, sy - 20); cctx.lineTo(sx + 10, sy); cctx.stroke();
				} else {
					drawTileBase(x, y, '#95a5a6');
					const { x: sx, y: sy } = gridToScreen(x, y);
					cctx.strokeStyle = '#27ae60'; cctx.lineWidth = 2;
					cctx.strokeRect(sx - 12, sy - 12, 24, 24);
				}
			},
		};

		function drawBot(x, y, charge) {
			const { x: sx, y: sy } = gridToScreen(x, y);
			cctx.save(); cctx.translate(sx, sy - 5);
			cctx.fillStyle = 'rgba(0,0,0,0.3)';
			cctx.beginPath(); cctx.ellipse(0, 5, 12, 6, 0, 0, Math.PI * 2); cctx.fill();
			cctx.fillStyle = charge > 3 ? '#2ecc71' : charge > 1 ? '#f1c40f' : '#e74c3c';
			const w = 24, h = 28;
			cctx.fillRect(-w / 2, -h, w, h);
			cctx.beginPath(); cctx.arc(0, -h, w / 2, Math.PI, 0); cctx.fill();
			cctx.fillStyle = 'white';
			cctx.fillRect(-6, -h - 5, 4, 4); cctx.fillRect(2, -h - 5, 4, 4);
			cctx.restore();
		}

		function resize() {
			const wrap = ctx.$('.game-canvas-wrapper');
			if (wrap && wrap.clientWidth > 0) {
				canvas.width = wrap.clientWidth;
				canvas.height = wrap.clientHeight;
			}
			if (!map) return;
			viewOffsetX = canvas.width / 2;
			viewOffsetY = canvas.height / 2 - ((map.length + map[0].length) * TILE_HEIGHT / 4);
		}

		function startLevel(idx) {
			if (idx >= ALL_LEVELS.length) {
				ui.overlay.style.display = 'none';
				ui.congrats.style.display = 'flex';
				return;
			}
			currentLevelIndex = idx;
			showScreen('game');
			ALL_LEVELS[idx].start();
			currentLevel = ALL_LEVELS[idx];
			bot = currentLevel.bot;
			map = currentLevel.map;
			gameState = 'running';
			isMoving = false;
			ui.overlay.style.display = 'none';
			ui.congrats.style.display = 'none';
			resize();
			updateUI();
			if (gameLoopId) cancelAnimationFrame(gameLoopId);
			draw();
		}

		function updateUI() {
			if (!bot) return;
			ui.charge.textContent = String(bot.charge);
			ui.level.textContent = String(currentLevelIndex + 1);
			ui.help.innerHTML = currentLevel.helpMessage || '&nbsp;';
			ui.charge.style.color = bot.charge <= 1 ? '#e74c3c' : '#8BC34A';
		}

		function toggleDoors(id, state) {
			if (id === null) return;
			for (const row of map) for (const t of row) if (t.type === 7 && t.id === id) t.state = state;
		}

		function moveBot(dx, dy, viaConveyor = false) {
			if (isMoving || gameState !== 'running') return;
			const nx = bot.x + dx, ny = bot.y + dy;
			if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[0].length) return;
			const target = map[ny][nx];
			if (target.type === 7 && target.state === 'closed') return;

			const oldTile = map[bot.y][bot.x];
			if (!viaConveyor) {
				if (bot.charge <= 0) return;
				bot.charge--;
			}
			isMoving = true;
			if (oldTile.type === 6) { oldTile._pressed = false; toggleDoors(oldTile.id, 'closed'); }
			bot.x = nx; bot.y = ny;
			updateUI();
			ctx.scope.setTimeout(() => checkTileEffect(target), 150);
		}

		function checkTileEffect(t) {
			if (t.type === 3) { gameOver('win'); return; }
			if (t.type === 0) { gameOver('fall'); return; }
			if (t.type === 2) t.type = 0;
			if (t.type === 4 && t.charge > 0) { bot.charge += t.charge; t.charge = 0; updateUI(); }
			if (t.type === 6) { t._pressed = true; toggleDoors(t.id, 'open'); }
			if (t.type === 5) {
				isMoving = false;
				const d = DIRECTION[t.direction];
				ctx.scope.setTimeout(() => moveBot(d.dx, d.dy, true), 50);
				return;
			}
			if (bot.charge <= 0) { gameOver('battery'); return; }
			isMoving = false;
		}

		function gameOver(reason) {
			gameState = 'gameover';
			ui.ovNext.style.display = 'none';
			ui.ovRetry.style.display = '';
			if (reason === 'win') {
				gameState = 'finished';
				saveProgress();
				ui.overlayTitle.textContent = strings.levelComplete;
				ui.overlayTitle.style.color = '#8BC34A';
				ui.overlayMsg.textContent = strings.batteryLeft + bot.charge;
				ui.ovNext.style.display = '';
				ui.ovRetry.style.display = 'none';
			} else if (reason === 'fall') {
				ui.overlayTitle.textContent = strings.fall;
				ui.overlayTitle.style.color = '#e74c3c';
				ui.overlayMsg.textContent = strings.fallMsg;
			} else if (reason === 'battery') {
				ui.overlayTitle.textContent = strings.emptyBattery;
				ui.overlayTitle.style.color = '#f39c12';
				ui.overlayMsg.textContent = strings.batteryMsg;
			}
			ui.overlay.style.display = 'flex';
		}

		function draw() {
			if (appState !== 'game') return;
			cctx.clearRect(0, 0, canvas.width, canvas.height);
			if (!map) return;
			for (let y = 0; y < map.length; y++) {
				for (let x = 0; x < map[y].length; x++) {
					const t = map[y][x];
					const drawer = TILE_DRAWERS[t.type];
					if (drawer) {
						if (t.type === 4) drawer(x, y, t.charge);
						else if (t.type === 5) drawer(x, y, t.direction);
						else if (t.type === 6) drawer(x, y, t.id, t._pressed);
						else if (t.type === 7) drawer(x, y, t.id, t.state);
						else drawer(x, y);
					}
					if (bot.x === x && bot.y === y) drawBot(x, y, bot.charge);
				}
			}
			gameLoopId = requestAnimationFrame(draw);
		}

		// Events
		ctx.scope.delegate(ctx.root, 'click', '#cb-controls button', (_e, btn) => {
			const d = DIRECTION[parseInt(btn.dataset.dir, 10)];
			if (d) moveBot(d.dx, d.dy);
		});
		ctx.scope.on(ctx.$('#cb-play'),    'click', () => showScreen('levels'));
		ctx.scope.on(ctx.$('#cb-back'),    'click', () => showScreen('menu'));
		ctx.scope.on(ctx.$('#cb-exit'),    'click', () => showScreen('levels'));
		ctx.scope.on(ctx.$('#cb-restart'), 'click', () => startLevel(currentLevelIndex));
		ctx.scope.on(ui.ovMenu,  'click', () => showScreen('levels'));
		ctx.scope.on(ui.ovRetry, 'click', () => startLevel(currentLevelIndex));
		ctx.scope.on(ui.ovNext,  'click', () => startLevel(currentLevelIndex + 1));
		ctx.scope.on(ctx.$('#cb-reset-all'), 'click', () => showScreen('menu'));

		ctx.scope.on(document, 'keydown', (e) => {
			if (!ctx.root.isConnected || appState !== 'game') return;
			if (ui.overlay.style.display !== 'none' && e.key === 'Enter') {
				if (gameState === 'finished') startLevel(currentLevelIndex + 1);
				else startLevel(currentLevelIndex);
				return;
			}
			const map = {
				ArrowUp: [0, -1], z: [0, -1], Z: [0, -1],
				ArrowDown: [0, 1], s: [0, 1], S: [0, 1],
				ArrowLeft: [-1, 0], q: [-1, 0], Q: [-1, 0],
				ArrowRight: [1, 0], d: [1, 0], D: [1, 0],
			};
			if (map[e.key]) { e.preventDefault(); moveBot(map[e.key][0], map[e.key][1]); }
			if (e.key === 'r' || e.key === 'R') startLevel(currentLevelIndex);
		});

		const obs = new ResizeObserver(() => { resize(); if (appState === 'game' && gameState !== 'running') draw(); });
		obs.observe(canvas);
		ctx.scope.observe(obs);

		showScreen('menu');
		return { restart: () => showScreen('menu'), quit: () => cancelAnimationFrame(gameLoopId) };
	}
};
