import { Panel } from '../core/panel.js';

const VERSION = '1.0.0';

const STRINGS = {
	'en-US': {
		title: 'Paint', tools: 'Tools', layers: 'Layers', filters: 'Filters',
		size: 'Size', opacity: 'Opacity', color: 'Color', blendMode: 'Blend',
		newLayer: 'New layer', deleteLayer: 'Delete', moveUp: '↑', moveDown: '↓',
		undo: 'Undo', redo: 'Redo', clear: 'Clear', save: 'Save PNG',
		newDoc: 'New document', confirmNew: 'Discard the current canvas and start over?',
		confirmDelete: 'Delete this layer?', renameLayer: 'Rename layer',
		brightness: 'Brightness', contrast: 'Contrast', filterBlur: 'Blur',
		invert: 'Invert', grayscale: 'Grayscale', sepia: 'Sepia',
		sharpen: 'Sharpen', reset: 'Reset',
		emptyText: 'Type some text:',
	},
	'fr-FR': {
		title: 'Paint', tools: 'Outils', layers: 'Calques', filters: 'Filtres',
		size: 'Taille', opacity: 'Opacité', color: 'Couleur', blendMode: 'Fusion',
		newLayer: 'Nouveau calque', deleteLayer: 'Supprimer', moveUp: '↑', moveDown: '↓',
		undo: 'Annuler', redo: 'Rétablir', clear: 'Effacer', save: 'Exporter PNG',
		newDoc: 'Nouveau document', confirmNew: 'Réinitialiser le document ?',
		confirmDelete: 'Supprimer ce calque ?', renameLayer: 'Renommer',
		brightness: 'Luminosité', contrast: 'Contraste', filterBlur: 'Flou',
		invert: 'Inverser', grayscale: 'Niveaux de gris', sepia: 'Sépia',
		sharpen: 'Accentuer', reset: 'Réinitialiser',
		emptyText: 'Texte :',
	},
};

const BLEND_MODES = [
	'source-over','multiply','screen','overlay','darken','lighten',
	'color-dodge','color-burn','hard-light','soft-light','difference',
	'exclusion','hue','saturation','color','luminosity',
];

const PALETTE = [
	'#000000','#ffffff','#7f7f7f','#bfbfbf',
	'#e53935','#fb8c00','#fdd835','#43a047',
	'#1e88e5','#3949ab','#8e24aa','#d81b60',
	'#6d4c41','#00897b','#f06292','#26c6da',
];

const TOOLS = [
	{ id: 'pencil',  label: 'Pencil',  svg: '<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>' },
	{ id: 'brush',   label: 'Brush',   svg: '<path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34a1 1 0 0 0-1.41 0L9 12.25l2.75 2.75L20.71 6a1 1 0 0 0 0-1.37z"/>' },
	{ id: 'eraser',  label: 'Eraser',  svg: '<path d="M16.24 3.56l4.95 4.94c.78.79.78 2.05 0 2.84l-9.9 9.9c-.79.78-2.05.78-2.83 0l-4.95-4.94a2 2 0 0 1 0-2.83l9.9-9.91a2 2 0 0 1 2.83 0z"/>' },
	{ id: 'line',    label: 'Line',    svg: '<path d="M4 18l14-14 2 2L6 20z"/>' },
	{ id: 'rect',    label: 'Rect',    svg: '<rect x="4" y="6" width="16" height="12" fill="none" stroke="currentColor" stroke-width="2"/>' },
	{ id: 'ellipse', label: 'Ellipse', svg: '<ellipse cx="12" cy="12" rx="8" ry="6" fill="none" stroke="currentColor" stroke-width="2"/>' },
	{ id: 'fill',    label: 'Fill',    svg: '<path d="M19 11l-7-7-1.4 1.4 1.6 1.6L4.7 14.5a2 2 0 0 0 0 2.8l3.5 3.5a2 2 0 0 0 2.8 0L19 13zM6 16l6.8-6.8 3 3L9 19l-3-3z"/><circle cx="19" cy="18" r="2"/>' },
	{ id: 'picker',  label: 'Picker',  svg: '<path d="M20.71 5.63l-2.34-2.34a1 1 0 0 0-1.42 0l-3.5 3.5 3.76 3.76 3.5-3.5a1 1 0 0 0 0-1.42zM3 17.25V21h3.75l11-11-3.75-3.75-11 11z"/>' },
	{ id: 'text',    label: 'Text',    svg: '<path d="M5 4v3h5.5v12h3V7H19V4z"/>' },
	{ id: 'spray',   label: 'Spray',   svg: '<path d="M9 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm8-4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm-3 7c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm5-1c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm-4-4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zM5 9c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm14-4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>' },
];

// ── Helpers ──────────────────────────────────────────────────
function hexToRgba(hex, alpha = 255) {
	const m = hex.replace('#', '');
	const n = parseInt(m.length === 3
		? m.split('').map(c => c + c).join('')
		: m, 16);
	return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff, alpha];
}

function colorsEqual(a, b) {
	return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

/**
 * Iterative scanline flood fill operating on a single layer's ImageData.
 * Returns the modified ImageData (in place).
 */
function floodFill(imageData, x, y, fillColor, tolerance = 4) {
	const { data, width, height } = imageData;
	const idx = (px, py) => (py * width + px) * 4;
	const startIdx = idx(x, y);
	const target = [
		data[startIdx], data[startIdx + 1],
		data[startIdx + 2], data[startIdx + 3],
	];
	if (colorsEqual(target, fillColor)) return imageData;

	const matches = (i) =>
		Math.abs(data[i]   - target[0]) <= tolerance &&
		Math.abs(data[i+1] - target[1]) <= tolerance &&
		Math.abs(data[i+2] - target[2]) <= tolerance &&
		Math.abs(data[i+3] - target[3]) <= tolerance;

	const stack = [[x, y]];
	while (stack.length) {
		const [px, py] = stack.pop();
		let cx = px;
		while (cx >= 0 && matches(idx(cx, py))) cx--;
		cx++;
		let spanAbove = false, spanBelow = false;
		while (cx < width && matches(idx(cx, py))) {
			const i = idx(cx, py);
			data[i] = fillColor[0]; data[i+1] = fillColor[1];
			data[i+2] = fillColor[2]; data[i+3] = fillColor[3];
			if (py > 0) {
				const above = matches(idx(cx, py - 1));
				if (!spanAbove && above) { stack.push([cx, py - 1]); spanAbove = true; }
				else if (spanAbove && !above) spanAbove = false;
			}
			if (py < height - 1) {
				const below = matches(idx(cx, py + 1));
				if (!spanBelow && below) { stack.push([cx, py + 1]); spanBelow = true; }
				else if (spanBelow && !below) spanBelow = false;
			}
			cx++;
		}
	}
	return imageData;
}

function applyConvolution(imageData, kernel, divisor = 1) {
	const { data, width, height } = imageData;
	const out = new Uint8ClampedArray(data);
	const k = kernel, kw = 3, half = 1;
	for (let y = 1; y < height - 1; y++) {
		for (let x = 1; x < width - 1; x++) {
			let r = 0, g = 0, b = 0;
			for (let ky = 0; ky < kw; ky++) {
				for (let kx = 0; kx < kw; kx++) {
					const px = x + kx - half, py = y + ky - half;
					const i = (py * width + px) * 4;
					const w = k[ky * kw + kx];
					r += data[i] * w; g += data[i + 1] * w; b += data[i + 2] * w;
				}
			}
			const oi = (y * width + x) * 4;
			out[oi]     = r / divisor;
			out[oi + 1] = g / divisor;
			out[oi + 2] = b / divisor;
			out[oi + 3] = data[oi + 3];
		}
	}
	imageData.data.set(out);
	return imageData;
}

// ── Layer ────────────────────────────────────────────────────
class PaintLayer {
	constructor(width, height, name) {
		this.canvas = document.createElement('canvas');
		this.canvas.width = width;
		this.canvas.height = height;
		this.ctx = this.canvas.getContext('2d');
		this.name = name;
		this.visible = true;
		this.opacity = 1;
		this.blendMode = 'source-over';
	}
	snapshot() { return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height); }
	restore(img) { this.ctx.putImageData(img, 0, 0); }
	clear() { this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); }
}

const CONTENT = `
	<div class="paint-app">
		<div class="paint-topbar">
			<button class="paint-btn" id="paint-open-tools" title="Tools">
				<svg viewBox="0 0 24 24"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1 .1-1.4z"/></svg>
			</button>
			<input type="color" id="paint-color" value="#000000" title="Color">
			<label class="paint-num">${'⌀'} <input type="number" id="paint-size" min="1" max="200" value="10"></label>
			<label class="paint-num">α <input type="number" id="paint-opacity" min="1" max="100" value="100"></label>
			<button class="paint-btn" id="paint-undo" title="Undo">
				<svg viewBox="0 0 24 24"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>
			</button>
			<button class="paint-btn" id="paint-redo" title="Redo">
				<svg viewBox="0 0 24 24" style="transform:scaleX(-1)"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>
			</button>
			<button class="paint-btn" id="paint-clear" title="Clear">
				<svg viewBox="0 0 24 24"><path d="M16.24 3.56l4.95 4.94c.78.79.78 2.05 0 2.84l-9.9 9.9c-.79.78-2.05.78-2.83 0l-4.95-4.94a2 2 0 0 1 0-2.83l9.9-9.91a2 2 0 0 1 2.83 0z"/></svg>
			</button>
			<button class="paint-btn" id="paint-save" title="Save">
				<svg viewBox="0 0 24 24"><path d="M19 12v7H5v-7H3v9h18v-9zM11 16h2V4h3l-4-4-4 4h3z" transform="rotate(180 12 12)"/></svg>
			</button>
			<button class="paint-btn" id="paint-open-layers" title="Layers">
				<svg viewBox="0 0 24 24"><path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27z"/></svg>
			</button>
		</div>
		<div class="paint-stage" id="paint-stage">
			<canvas id="paint-display"></canvas>
			<canvas id="paint-preview"></canvas>
		</div>
	</div>
`;

export const paintApp = {
	id: 'app-paint',
	title: 'Paint',
	version: VERSION,
	icon: `<svg viewBox="0 0 24 24"><path d="M18 4h-4V2h-4v2H6c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM6 18l3-4 2.25 3 3-4L18 18H6z" fill="#fff"/></svg>`,
	iconColor: '#e91e63',
	headerColor: '#ad1457',
	type: 'app',
	style: `
		.app-content { padding: 0; background: #2b2b2b; }
		.paint-app {
			display: flex; flex-direction: column; height: 100%;
			background: #2b2b2b; color: #eee; user-select: none;
		}
		.paint-topbar {
			flex: 0 0 auto;
			display: flex; align-items: center; gap: 6px;
			padding: 8px; background: #1f1f1f;
			overflow-x: auto; flex-wrap: nowrap;
			border-bottom: 1px solid #111;
		}
		.paint-btn {
			background: #333; border: none; color: #fff;
			width: 36px; height: 36px; border-radius: 6px;
			cursor: pointer; display: flex; align-items: center; justify-content: center;
			flex: 0 0 auto;
		}
		.paint-btn:hover { background: #444; }
		.paint-btn svg { width: 20px; height: 20px; fill: #fff; }
		.paint-num {
			display: inline-flex; align-items: center; gap: 4px;
			background: #1a1a1a; padding: 4px 6px; border-radius: 6px;
			font-size: 0.8rem;
		}
		.paint-num input {
			width: 50px; background: transparent; border: none; color: #fff;
			text-align: center;
		}
		#paint-color {
			width: 36px; height: 36px; padding: 0;
			border: 1px solid #555; border-radius: 6px;
			background: transparent; cursor: pointer;
		}
		.paint-stage {
			flex: 1 1 auto; min-height: 0;
			position: relative;
			background:
				repeating-conic-gradient(#3a3a3a 0 25%, #2e2e2e 25% 50%) 0 0 / 24px 24px;
			display: flex; align-items: center; justify-content: center;
			overflow: hidden;
			touch-action: none;
		}
		#paint-display, #paint-preview {
			position: absolute; left: 50%; top: 50%;
			transform: translate(-50%, -50%);
			background: #fff; cursor: crosshair;
			box-shadow: 0 0 0 1px #000, 0 8px 30px rgba(0,0,0,0.6);
		}
		#paint-preview { pointer-events: none; background: transparent; box-shadow: none; }

		/* ── Panels ────────────────────────────────────────── */
		.panel-content {
			padding: 12px; height: 100%; overflow-y: auto;
			display: flex; flex-direction: column; gap: 12px;
		}
		.panel-content h3 {
			margin: 0; padding-bottom: 8px;
			border-bottom: 1px solid #333; font-size: 1rem;
		}
		.tool-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
		.tool-cell {
			aspect-ratio: 1; background: #2a2a2a; border-radius: 6px;
			border: 1px solid transparent; cursor: pointer;
			display: flex; flex-direction: column; align-items: center; justify-content: center;
			gap: 2px; color: #ddd; font-size: 0.7rem;
		}
		.tool-cell:hover { background: #3a3a3a; }
		.tool-cell.active { background: #1976d2; border-color: #64b5f6; color: #fff; }
		.tool-cell svg { width: 22px; height: 22px; fill: currentColor; }
		.palette { display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px; }
		.swatch { aspect-ratio: 1; border-radius: 4px; cursor: pointer; border: 1px solid #444; }
		.swatch.active { outline: 2px solid #64b5f6; outline-offset: 2px; }

		/* Layers */
		.layer-list { display: flex; flex-direction: column; gap: 4px; }
		.layer-row {
			display: flex; align-items: center; gap: 4px;
			background: #2a2a2a; padding: 6px; border-radius: 4px;
			cursor: pointer; border: 1px solid transparent;
		}
		.layer-row.active { border-color: #64b5f6; background: #1f3a5b; }
		.layer-row .layer-name { flex: 1; overflow: hidden; text-overflow: ellipsis; font-size: 0.82rem; }
		.layer-row .layer-mini {
			width: 32px; height: 32px; border-radius: 4px;
			background:
				repeating-conic-gradient(#666 0 25%, #555 25% 50%) 0 0 / 8px 8px;
		}
		.layer-row button {
			background: transparent; border: none; color: #ddd; cursor: pointer;
			padding: 2px 4px;
		}
		.layer-row button:hover { color: #fff; }
		.layer-controls { display: flex; flex-direction: column; gap: 6px; }
		.layer-controls label { font-size: 0.78rem; color: #bbb; display: flex; justify-content: space-between; }
		.layer-controls select, .layer-controls input[type=range] {
			width: 100%; background: #2a2a2a; color: #fff; border: none;
		}
		.layer-add-row { display: flex; gap: 4px; }
		.layer-add-row button {
			flex: 1; padding: 6px; border-radius: 4px; border: none;
			background: #1976d2; color: #fff; cursor: pointer;
		}
		.layer-add-row button.danger { background: #c62828; flex: 0 0 36px; }

		/* Filters */
		.filter-list { display: flex; flex-direction: column; gap: 6px; }
		.filter-btn {
			padding: 8px; border-radius: 4px; border: none;
			background: #333; color: #fff; cursor: pointer; text-align: left;
		}
		.filter-btn:hover { background: #444; }
		.filter-slider {
			display: flex; flex-direction: column; gap: 4px; font-size: 0.78rem;
		}
		.filter-slider input { accent-color: #1976d2; }
	`,
	content: CONTENT,

	onMount(ctx) {
		const strings = STRINGS[ctx.lang] || STRINGS['fr-FR'];

		// ── State ────────────────────────────────────────────
		const W = 800, H = 600;
		const display = ctx.$('#paint-display');
		const preview = ctx.$('#paint-preview');
		const stage   = ctx.$('#paint-stage');
		display.width = preview.width = W;
		display.height = preview.height = H;
		const displayCtx = display.getContext('2d');
		const previewCtx = preview.getContext('2d');

		/** @type {PaintLayer[]} */
		const layers = [new PaintLayer(W, H, 'Background')];
		let activeIndex = 0;
		const activeLayer = () => layers[activeIndex];

		let toolId = 'brush';
		let color = '#000000';
		let brushSize = 10;
		let strokeOpacity = 1; // 0..1

		// Undo/redo stacks (per stroke): { layerIndex, before, after }
		const undoStack = [];
		const redoStack = [];
		const MAX_UNDO = 25;

		// Last pointer position for stroke continuation
		let lastX = 0, lastY = 0;
		let stroking = false;
		let strokeBefore = null;
		let strokeOrigin = null;

		// ── Composite ────────────────────────────────────────
		function composite() {
			displayCtx.save();
			displayCtx.clearRect(0, 0, W, H);
			for (const layer of layers) {
				if (!layer.visible) continue;
				displayCtx.globalAlpha = layer.opacity;
				displayCtx.globalCompositeOperation = layer.blendMode;
				displayCtx.drawImage(layer.canvas, 0, 0);
			}
			displayCtx.restore();
		}

		// Convert pointer event coords → canvas pixel coords.
		function eventCoords(e) {
			const r = display.getBoundingClientRect();
			return {
				x: ((e.clientX - r.left) / r.width)  * W,
				y: ((e.clientY - r.top)  / r.height) * H,
			};
		}

		// ── Drawing primitives ───────────────────────────────
		function startStroke() {
			strokeBefore = activeLayer().snapshot();
		}
		function commitStroke() {
			const after = activeLayer().snapshot();
			undoStack.push({ layerIndex: activeIndex, before: strokeBefore, after });
			if (undoStack.length > MAX_UNDO) undoStack.shift();
			redoStack.length = 0;
			strokeBefore = null;
		}

		function drawBrushPoint(x, y) {
			const lctx = activeLayer().ctx;
			lctx.save();
			lctx.globalAlpha = strokeOpacity;
			if (toolId === 'eraser') lctx.globalCompositeOperation = 'destination-out';
			lctx.fillStyle = color;
			lctx.beginPath();
			lctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
			lctx.fill();
			lctx.restore();
		}
		function drawBrushLine(x0, y0, x1, y1) {
			const lctx = activeLayer().ctx;
			lctx.save();
			lctx.globalAlpha = strokeOpacity;
			if (toolId === 'eraser') lctx.globalCompositeOperation = 'destination-out';
			lctx.strokeStyle = color;
			lctx.fillStyle = color;
			lctx.lineCap = 'round';
			lctx.lineJoin = 'round';
			lctx.lineWidth = toolId === 'pencil' ? 1 : brushSize;
			lctx.beginPath();
			lctx.moveTo(x0, y0);
			lctx.lineTo(x1, y1);
			lctx.stroke();
			lctx.restore();
		}
		function drawSpray(x, y) {
			const lctx = activeLayer().ctx;
			lctx.save();
			lctx.globalAlpha = strokeOpacity * 0.6;
			lctx.fillStyle = color;
			for (let i = 0; i < 12; i++) {
				const a = Math.random() * Math.PI * 2;
				const r = Math.random() * brushSize;
				lctx.beginPath();
				lctx.arc(x + Math.cos(a) * r, y + Math.sin(a) * r, 0.8, 0, Math.PI * 2);
				lctx.fill();
			}
			lctx.restore();
		}

		// Shape preview helpers (drawn into the preview canvas)
		function drawPreviewShape(kind, x0, y0, x1, y1) {
			previewCtx.clearRect(0, 0, W, H);
			previewCtx.save();
			previewCtx.globalAlpha = strokeOpacity;
			previewCtx.strokeStyle = color;
			previewCtx.lineWidth = brushSize;
			previewCtx.lineCap = 'round';
			if (kind === 'line') {
				previewCtx.beginPath(); previewCtx.moveTo(x0, y0); previewCtx.lineTo(x1, y1); previewCtx.stroke();
			} else if (kind === 'rect') {
				previewCtx.strokeRect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
			} else if (kind === 'ellipse') {
				const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
				const rx = Math.abs(x1 - x0) / 2, ry = Math.abs(y1 - y0) / 2;
				previewCtx.beginPath();
				previewCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
				previewCtx.stroke();
			}
			previewCtx.restore();
		}
		function commitShape(kind, x0, y0, x1, y1) {
			const lctx = activeLayer().ctx;
			lctx.save();
			lctx.globalAlpha = strokeOpacity;
			lctx.strokeStyle = color;
			lctx.fillStyle = color;
			lctx.lineWidth = brushSize;
			lctx.lineCap = 'round';
			if (kind === 'line') {
				lctx.beginPath(); lctx.moveTo(x0, y0); lctx.lineTo(x1, y1); lctx.stroke();
			} else if (kind === 'rect') {
				lctx.strokeRect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
			} else if (kind === 'ellipse') {
				const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
				const rx = Math.abs(x1 - x0) / 2, ry = Math.abs(y1 - y0) / 2;
				lctx.beginPath();
				lctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
				lctx.stroke();
			}
			lctx.restore();
			previewCtx.clearRect(0, 0, W, H);
		}

		// ── Pointer handlers ─────────────────────────────────
		ctx.scope.on(display, 'pointerdown', (e) => {
			if (e.button !== undefined && e.button !== 0) return;
			// Keep drawing isolated from the side-panel edge-swipe detector,
			// otherwise strokes starting near the edge could be hijacked.
			e.stopPropagation();
			const { x, y } = eventCoords(e);
			lastX = x; lastY = y;
			strokeOrigin = { x, y };

			try { display.setPointerCapture(e.pointerId); } catch (_) {}

			if (toolId === 'picker') {
				const data = displayCtx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
				if (data[3] > 0) {
					color = '#' + [data[0], data[1], data[2]].map(c => c.toString(16).padStart(2, '0')).join('');
					ctx.$('#paint-color').value = color;
					updatePaletteActive();
				}
				return;
			}
			if (toolId === 'fill') {
				startStroke();
				const lctx = activeLayer().ctx;
				const img = lctx.getImageData(0, 0, W, H);
				floodFill(img, Math.floor(x), Math.floor(y), hexToRgba(color, Math.round(strokeOpacity * 255)));
				lctx.putImageData(img, 0, 0);
				commitStroke();
				composite();
				return;
			}
			if (toolId === 'text') {
				const text = prompt(strings.emptyText, '');
				if (!text) return;
				startStroke();
				const lctx = activeLayer().ctx;
				lctx.save();
				lctx.globalAlpha = strokeOpacity;
				lctx.fillStyle = color;
				lctx.font = `${Math.max(12, brushSize * 2)}px sans-serif`;
				lctx.textBaseline = 'top';
				lctx.fillText(text, x, y);
				lctx.restore();
				commitStroke();
				composite();
				return;
			}

			stroking = true;
			startStroke();
			if (toolId === 'pencil' || toolId === 'brush' || toolId === 'eraser') {
				drawBrushPoint(x, y);
				composite();
			} else if (toolId === 'spray') {
				drawSpray(x, y);
				composite();
			}
		});

		ctx.scope.on(display, 'pointermove', (e) => {
			if (!stroking) return;
			const { x, y } = eventCoords(e);
			if (toolId === 'pencil' || toolId === 'brush' || toolId === 'eraser') {
				drawBrushLine(lastX, lastY, x, y);
				composite();
			} else if (toolId === 'spray') {
				drawSpray(x, y);
				composite();
			} else if (toolId === 'line' || toolId === 'rect' || toolId === 'ellipse') {
				drawPreviewShape(toolId, strokeOrigin.x, strokeOrigin.y, x, y);
			}
			lastX = x; lastY = y;
		});

		const endStroke = (e) => {
			if (!stroking) return;
			const { x, y } = eventCoords(e);
			stroking = false;
			try { display.releasePointerCapture(e.pointerId); } catch (_) {}
			if (toolId === 'line' || toolId === 'rect' || toolId === 'ellipse') {
				commitShape(toolId, strokeOrigin.x, strokeOrigin.y, x, y);
				composite();
			}
			commitStroke();
		};
		ctx.scope.on(display, 'pointerup',     endStroke);
		ctx.scope.on(display, 'pointercancel', endStroke);

		// ── Undo / redo ──────────────────────────────────────
		function undo() {
			const last = undoStack.pop();
			if (!last) return;
			redoStack.push(last);
			layers[last.layerIndex].restore(last.before);
			composite();
		}
		function redo() {
			const last = redoStack.pop();
			if (!last) return;
			undoStack.push(last);
			layers[last.layerIndex].restore(last.after);
			composite();
		}

		// ── Save (PNG) ───────────────────────────────────────
		function saveAsPng() {
			composite();
			display.toBlob((blob) => {
				if (!blob) return;
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `paint-${Date.now()}.png`;
				a.click();
				URL.revokeObjectURL(url);
			}, 'image/png');
		}

		// ── Clear active layer ───────────────────────────────
		function clearActive() {
			if (!confirm(strings.confirmNew)) return;
			startStroke();
			activeLayer().clear();
			commitStroke();
			composite();
		}

		// ── Layer panel ──────────────────────────────────────
		const layersPanel = new Panel({
			parent: ctx.content, scope: ctx.scope, side: 'right', width: '78%',
		});
		const layersUi = document.createElement('div');
		layersUi.className = 'panel-content';
		layersUi.innerHTML = `
			<h3>${strings.layers}</h3>
			<div class="layer-add-row">
				<button id="paint-layer-add">+ ${strings.newLayer}</button>
				<button id="paint-layer-del" class="danger" title="${strings.deleteLayer}">×</button>
			</div>
			<div class="layer-list" id="paint-layer-list"></div>
			<div class="layer-controls">
				<label>${strings.opacity}<span id="paint-layer-op-val">100%</span></label>
				<input type="range" id="paint-layer-op" min="0" max="100" value="100">
				<label>${strings.blendMode}</label>
				<select id="paint-layer-blend"></select>
			</div>`;
		layersPanel.contentEl.appendChild(layersUi);

		const layerList    = layersUi.querySelector('#paint-layer-list');
		const blendSelect  = layersUi.querySelector('#paint-layer-blend');
		const opSlider     = layersUi.querySelector('#paint-layer-op');
		const opLabel      = layersUi.querySelector('#paint-layer-op-val');
		BLEND_MODES.forEach(b => {
			const opt = document.createElement('option');
			opt.value = b; opt.textContent = b;
			blendSelect.appendChild(opt);
		});

		function renderLayers() {
			layerList.innerHTML = '';
			// Top of stack first, more natural in UI
			for (let i = layers.length - 1; i >= 0; i--) {
				const l = layers[i];
				const row = document.createElement('div');
				row.className = 'layer-row' + (i === activeIndex ? ' active' : '');
				row.innerHTML = `
					<div class="layer-mini" data-mini></div>
					<span class="layer-name">${l.name}</span>
					<button data-act="vis"  title="visibility">${l.visible ? '👁' : '⌀'}</button>
					<button data-act="up"   title="up">↑</button>
					<button data-act="down" title="down">↓</button>
				`;
				const mini = row.querySelector('[data-mini]');
				mini.style.backgroundImage = `url("${l.canvas.toDataURL()}")`;
				mini.style.backgroundSize = 'cover';
				ctx.scope.on(row, 'click', (e) => {
					if (e.target.closest('button')) return;
					activeIndex = i;
					renderLayers();
					syncLayerControls();
				});
				ctx.scope.on(row.querySelector('[data-act="vis"]'), 'click', (e) => {
					e.stopPropagation();
					l.visible = !l.visible;
					renderLayers(); composite();
				});
				ctx.scope.on(row.querySelector('[data-act="up"]'), 'click', (e) => {
					e.stopPropagation();
					if (i < layers.length - 1) {
						[layers[i], layers[i + 1]] = [layers[i + 1], layers[i]];
						if (activeIndex === i) activeIndex = i + 1;
						else if (activeIndex === i + 1) activeIndex = i;
						renderLayers(); composite();
					}
				});
				ctx.scope.on(row.querySelector('[data-act="down"]'), 'click', (e) => {
					e.stopPropagation();
					if (i > 0) {
						[layers[i], layers[i - 1]] = [layers[i - 1], layers[i]];
						if (activeIndex === i) activeIndex = i - 1;
						else if (activeIndex === i - 1) activeIndex = i;
						renderLayers(); composite();
					}
				});
				layerList.appendChild(row);
			}
		}

		function syncLayerControls() {
			const l = activeLayer();
			opSlider.value = String(Math.round(l.opacity * 100));
			opLabel.textContent = `${opSlider.value}%`;
			blendSelect.value = l.blendMode;
		}

		ctx.scope.on(opSlider, 'input', () => {
			activeLayer().opacity = parseInt(opSlider.value, 10) / 100;
			opLabel.textContent = `${opSlider.value}%`;
			composite();
		});
		ctx.scope.on(blendSelect, 'change', () => {
			activeLayer().blendMode = blendSelect.value;
			composite();
		});
		ctx.scope.on(layersUi.querySelector('#paint-layer-add'), 'click', () => {
			layers.push(new PaintLayer(W, H, `Layer ${layers.length + 1}`));
			activeIndex = layers.length - 1;
			renderLayers(); syncLayerControls(); composite();
		});
		ctx.scope.on(layersUi.querySelector('#paint-layer-del'), 'click', () => {
			if (layers.length <= 1) return;
			if (!confirm(strings.confirmDelete)) return;
			layers.splice(activeIndex, 1);
			activeIndex = Math.max(0, activeIndex - 1);
			renderLayers(); syncLayerControls(); composite();
		});

		// ── Tools panel ──────────────────────────────────────
		const toolsPanel = new Panel({
			parent: ctx.content, scope: ctx.scope, side: 'left', width: '78%',
		});
		const toolsUi = document.createElement('div');
		toolsUi.className = 'panel-content';
		toolsUi.innerHTML = `
			<h3>${strings.tools}</h3>
			<div class="tool-grid" id="paint-tools"></div>
			<h3>${strings.color}</h3>
			<div class="palette" id="paint-palette"></div>
			<h3>${strings.filters}</h3>
			<div class="filter-list">
				<button class="filter-btn" data-f="invert">${strings.invert}</button>
				<button class="filter-btn" data-f="grayscale">${strings.grayscale}</button>
				<button class="filter-btn" data-f="sepia">${strings.sepia}</button>
				<button class="filter-btn" data-f="blur">${strings.filterBlur}</button>
				<button class="filter-btn" data-f="sharpen">${strings.sharpen}</button>
				<div class="filter-slider">
					<label>${strings.brightness}<span id="paint-br-val">100%</span></label>
					<input type="range" id="paint-br" min="0" max="200" value="100">
				</div>
				<div class="filter-slider">
					<label>${strings.contrast}<span id="paint-co-val">100%</span></label>
					<input type="range" id="paint-co" min="0" max="200" value="100">
				</div>
				<button class="filter-btn" id="paint-apply-bc">${strings.title} brightness/contrast</button>
			</div>
		`;
		toolsPanel.contentEl.appendChild(toolsUi);

		// Tool buttons
		const toolHost = toolsUi.querySelector('#paint-tools');
		TOOLS.forEach(t => {
			const cell = document.createElement('button');
			cell.className = 'tool-cell' + (t.id === toolId ? ' active' : '');
			cell.dataset.tool = t.id;
			cell.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor">${t.svg}</svg><span>${t.label}</span>`;
			ctx.scope.on(cell, 'click', () => {
				toolId = t.id;
				toolsUi.querySelectorAll('.tool-cell').forEach(c => c.classList.toggle('active', c.dataset.tool === toolId));
			});
			toolHost.appendChild(cell);
		});

		// Palette
		const paletteHost = toolsUi.querySelector('#paint-palette');
		function updatePaletteActive() {
			paletteHost.querySelectorAll('.swatch').forEach(s =>
				s.classList.toggle('active', s.dataset.color.toLowerCase() === color.toLowerCase()));
		}
		PALETTE.forEach(c => {
			const s = document.createElement('div');
			s.className = 'swatch';
			s.dataset.color = c;
			s.style.background = c;
			ctx.scope.on(s, 'click', () => {
				color = c;
				ctx.$('#paint-color').value = c;
				updatePaletteActive();
			});
			paletteHost.appendChild(s);
		});

		// Filters
		function applyPixelFilter(fn) {
			startStroke();
			const lctx = activeLayer().ctx;
			const img = lctx.getImageData(0, 0, W, H);
			fn(img);
			lctx.putImageData(img, 0, 0);
			commitStroke();
			composite();
		}

		ctx.scope.on(toolsUi, 'click', (e) => {
			const f = e.target.closest('[data-f]')?.dataset.f;
			if (!f) return;
			if (f === 'invert') applyPixelFilter((img) => {
				for (let i = 0; i < img.data.length; i += 4) {
					img.data[i]   = 255 - img.data[i];
					img.data[i+1] = 255 - img.data[i+1];
					img.data[i+2] = 255 - img.data[i+2];
				}
			});
			if (f === 'grayscale') applyPixelFilter((img) => {
				for (let i = 0; i < img.data.length; i += 4) {
					const g = img.data[i] * 0.299 + img.data[i+1] * 0.587 + img.data[i+2] * 0.114;
					img.data[i] = img.data[i+1] = img.data[i+2] = g;
				}
			});
			if (f === 'sepia') applyPixelFilter((img) => {
				for (let i = 0; i < img.data.length; i += 4) {
					const r = img.data[i], g = img.data[i+1], b = img.data[i+2];
					img.data[i]   = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
					img.data[i+1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
					img.data[i+2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
				}
			});
			if (f === 'blur') applyPixelFilter((img) => {
				applyConvolution(img, [1,1,1, 1,1,1, 1,1,1], 9);
			});
			if (f === 'sharpen') applyPixelFilter((img) => {
				applyConvolution(img, [0,-1,0, -1,5,-1, 0,-1,0], 1);
			});
		});

		const brEl = toolsUi.querySelector('#paint-br');
		const coEl = toolsUi.querySelector('#paint-co');
		const brVal = toolsUi.querySelector('#paint-br-val');
		const coVal = toolsUi.querySelector('#paint-co-val');
		ctx.scope.on(brEl, 'input', () => brVal.textContent = `${brEl.value}%`);
		ctx.scope.on(coEl, 'input', () => coVal.textContent = `${coEl.value}%`);
		ctx.scope.on(toolsUi.querySelector('#paint-apply-bc'), 'click', () => {
			const br = parseInt(brEl.value, 10) / 100;
			const co = parseInt(coEl.value, 10) / 100;
			applyPixelFilter((img) => {
				for (let i = 0; i < img.data.length; i += 4) {
					for (let k = 0; k < 3; k++) {
						let v = img.data[i + k] * br;          // brightness
						v = ((v - 128) * co) + 128;            // contrast
						img.data[i + k] = Math.max(0, Math.min(255, v));
					}
				}
			});
			brEl.value = coEl.value = '100';
			brVal.textContent = coVal.textContent = '100%';
		});

		// ── Topbar wiring ────────────────────────────────────
		ctx.scope.on(ctx.$('#paint-open-tools'),  'click', () => toolsPanel.open());
		ctx.scope.on(ctx.$('#paint-open-layers'), 'click', () => layersPanel.open());
		ctx.scope.on(ctx.$('#paint-color'), 'input', (e) => {
			color = e.target.value;
			updatePaletteActive();
		});
		ctx.scope.on(ctx.$('#paint-size'), 'input', (e) => {
			brushSize = Math.max(1, Math.min(200, parseInt(e.target.value, 10) || 1));
		});
		ctx.scope.on(ctx.$('#paint-opacity'), 'input', (e) => {
			strokeOpacity = Math.max(0.01, Math.min(1, parseInt(e.target.value, 10) / 100));
		});
		ctx.scope.on(ctx.$('#paint-undo'),  'click', undo);
		ctx.scope.on(ctx.$('#paint-redo'),  'click', redo);
		ctx.scope.on(ctx.$('#paint-clear'), 'click', clearActive);
		ctx.scope.on(ctx.$('#paint-save'),  'click', saveAsPng);

		// Keyboard shortcuts (scoped)
		ctx.scope.on(document, 'keydown', (e) => {
			if (!ctx.root.isConnected) return;
			if (['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)) return;
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
			else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); }
		});

		// Fit display canvas to stage
		function fitDisplayToStage() {
			const r = stage.getBoundingClientRect();
			const scale = Math.min(r.width / W, r.height / H, 1);
			const w = Math.floor(W * scale), h = Math.floor(H * scale);
			for (const el of [display, preview]) {
				el.style.width = `${w}px`;
				el.style.height = `${h}px`;
			}
		}
		const stageObs = new ResizeObserver(fitDisplayToStage);
		stageObs.observe(stage);
		ctx.scope.observe(stageObs);
		fitDisplayToStage();

		// Initial render
		updatePaletteActive();
		renderLayers();
		syncLayerControls();
		composite();

		return {
			quit: () => {
				toolsPanel.dispose();
				layersPanel.dispose();
			},
		};
	},
};
