import { Panel } from '../core/panel.js';

const VERSION = '1.0.0';

const STRINGS = {
	'en-US': {
		title: 'Camera', capture: 'Capture', switch: 'Switch', gallery: 'Gallery', filters: 'Filters',
		empty: 'No photos yet — tap capture.',
		permErr: 'Camera access denied.',
		noCam:   'No camera available.',
		faceOn:  'Face detection',
		brightness: 'Brightness', contrast: 'Contrast', saturate: 'Saturation', hue: 'Hue', blur: 'Blur',
		reset: 'Reset adjustments', download: 'Download', remove: 'Remove',
		closeView: 'Close', faceUnavail: 'Face detection unsupported',
	},
	'fr-FR': {
		title: 'Caméra', capture: 'Capturer', switch: 'Switch', gallery: 'Galerie', filters: 'Filtres',
		empty: 'Aucune photo — appuyez sur Capturer.',
		permErr: 'Accès caméra refusé.',
		noCam:   'Aucune caméra disponible.',
		faceOn:  'Détection de visage',
		brightness: 'Luminosité', contrast: 'Contraste', saturate: 'Saturation', hue: 'Teinte', blur: 'Flou',
		reset: 'Réinitialiser', download: 'Télécharger', remove: 'Supprimer',
		closeView: 'Fermer', faceUnavail: 'Détection de visage non supportée',
	},
};

// Filter presets — each entry is a partial set of adjustment values that
// overrides the defaults. The Normal preset is implicit.
const DEFAULT_ADJ = {
	brightness: 100, contrast: 100, saturate: 100, hue: 0, blur: 0,
	sepia: 0, grayscale: 0, invert: 0,
};
const PRESETS = {
	normal:   {},
	bw:       { grayscale: 100 },
	sepia:    { sepia: 100, contrast: 105 },
	vintage:  { sepia: 50, contrast: 110, saturate: 80, brightness: 95 },
	cool:     { hue: 180, saturate: 120 },
	warm:     { hue: -10, saturate: 130, brightness: 110 },
	dramatic: { contrast: 150, brightness: 90, saturate: 110 },
	invert:   { invert: 100 },
};

function adjToCssFilter(a) {
	return [
		`brightness(${a.brightness}%)`,
		`contrast(${a.contrast}%)`,
		`saturate(${a.saturate}%)`,
		`hue-rotate(${a.hue}deg)`,
		`blur(${a.blur}px)`,
		`sepia(${a.sepia}%)`,
		`grayscale(${a.grayscale}%)`,
		`invert(${a.invert}%)`,
	].join(' ');
}

const CONTENT = `
	<div class="cam-app">
		<div class="cam-stage">
			<video id="cam-video" autoplay playsinline muted></video>
			<canvas id="cam-overlay"></canvas>
			<div class="cam-banner" id="cam-banner" hidden></div>
		</div>
		<div class="cam-presets" id="cam-presets"></div>
		<div class="cam-actions">
			<button class="cam-btn cam-icon" id="cam-open-filters" title="Filters">
				<svg viewBox="0 0 24 24"><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/></svg>
			</button>
			<button class="cam-btn cam-shutter" id="cam-shutter" title="Capture">
				<span class="cam-shutter-ring"></span>
			</button>
			<button class="cam-btn cam-icon" id="cam-switch" title="Switch camera">
				<svg viewBox="0 0 24 24"><path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 11.5V13H9v2.5L5.5 12 9 8.5V11h6V8.5L18.5 12 15 15.5z"/></svg>
			</button>
			<button class="cam-btn cam-icon" id="cam-open-gallery" title="Gallery">
				<svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z"/></svg>
			</button>
		</div>
	</div>
`;

export const cameraApp = {
	id: 'app-camera',
	title: { 'en-US': 'Camera', 'fr-FR': 'Caméra' },
	version: VERSION,
	icon: `<svg viewBox="0 0 24 24"><path d="M9.4 5l-1.83 2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2h-3.57L14.6 5H9.4zM12 18a5 5 0 1 1 .001-10.001A5 5 0 0 1 12 18z" fill="#fff"/><circle cx="12" cy="13" r="3" fill="#fff"/></svg>`,
	iconColor: '#37474f',
	headerColor: '#263238',
	type: 'app',
	style: `
		.app-content { padding: 0; background: #000; }
		.cam-app {
			display: flex; flex-direction: column; height: 100%;
			background: #000; color: #fff; user-select: none; overflow: hidden;
		}
		.cam-stage {
			position: relative; flex: 1 1 auto; min-height: 0;
			display: flex; align-items: center; justify-content: center;
			background: #000; overflow: hidden;
		}
		#cam-video {
			width: 100%; height: 100%; object-fit: cover;
			background: #111;
		}
		#cam-overlay {
			position: absolute; inset: 0;
			width: 100%; height: 100%;
			pointer-events: none;
		}
		.cam-banner {
			position: absolute; top: 50%; left: 0; right: 0;
			transform: translateY(-50%);
			text-align: center; color: #fff;
			background: rgba(0,0,0,0.65);
			padding: 16px;
			font-size: 0.95rem;
		}
		.cam-presets {
			flex: 0 0 auto;
			display: flex; gap: 6px; padding: 8px;
			overflow-x: auto; background: #111;
			scrollbar-width: thin;
		}
		.cam-preset {
			flex: 0 0 auto;
			padding: 6px 12px; border-radius: 16px;
			background: #222; color: #ddd;
			font-size: 0.78rem; cursor: pointer;
			border: 1px solid transparent;
			white-space: nowrap;
		}
		.cam-preset.active { background: #1976d2; color: #fff; border-color: #64b5f6; }
		.cam-actions {
			flex: 0 0 auto;
			display: flex; align-items: center; justify-content: space-around;
			padding: 12px 16px 16px; background: #111;
		}
		.cam-btn {
			background: none; border: none; cursor: pointer;
			color: #fff; display: flex; align-items: center; justify-content: center;
		}
		.cam-btn:disabled { opacity: 0.4; cursor: not-allowed; }
		.cam-icon svg { width: 28px; height: 28px; fill: #fff; }
		.cam-icon { background: #2a2a2a; border-radius: 50%; width: 48px; height: 48px; }
		.cam-icon:hover { background: #3a3a3a; }
		.cam-shutter {
			width: 64px; height: 64px; border-radius: 50%;
			background: #fff; padding: 4px;
		}
		.cam-shutter:active { transform: scale(0.96); }
		.cam-shutter-ring {
			display: block; width: 100%; height: 100%;
			border-radius: 50%; background: #fff;
			border: 3px solid #111;
		}

		/* ── Filter / gallery panels ───────────────────────── */
		.panel-content {
			padding: 14px; height: 100%;
			display: flex; flex-direction: column; gap: 12px;
			overflow-y: auto;
		}
		.panel-content h3 {
			margin: 0; padding-bottom: 8px;
			border-bottom: 1px solid #333;
			font-size: 1rem; font-weight: 500;
		}
		.cam-slider {
			display: flex; flex-direction: column; gap: 4px; font-size: 0.85rem;
		}
		.cam-slider input {
			width: 100%; accent-color: #1976d2;
		}
		.cam-slider .slider-row {
			display: flex; justify-content: space-between; color: #bbb;
		}
		.cam-reset {
			padding: 8px; border-radius: 6px; border: none;
			background: #444; color: #fff; cursor: pointer;
		}
		.cam-toggle {
			display: flex; align-items: center; justify-content: space-between;
			padding: 8px 0;
		}
		.cam-toggle input { transform: scale(1.2); }

		/* Face boxes drawn on the overlay canvas — but we also use CSS
		   for the toggle indicator inside the filter panel. */
		.cam-face-status {
			font-size: 0.75em; color: #999;
		}

		/* ── Gallery ──────────────────────────────────────── */
		.cam-gallery {
			display: grid; grid-template-columns: repeat(2, 1fr);
			gap: 6px;
		}
		.cam-thumb {
			position: relative;
			width: 100%; aspect-ratio: 1;
			background: #222; border-radius: 6px; overflow: hidden;
			cursor: pointer;
		}
		.cam-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
		.cam-thumb .cam-thumb-del {
			position: absolute; top: 4px; right: 4px;
			width: 22px; height: 22px; border-radius: 50%;
			background: rgba(0,0,0,0.6); color: #fff;
			border: none; cursor: pointer;
			display: flex; align-items: center; justify-content: center;
			font-size: 14px; line-height: 1;
		}
		.cam-empty { color: #999; font-size: 0.85rem; text-align: center; padding: 20px; }
		.cam-viewer {
			position: absolute; inset: 0; z-index: 200;
			background: rgba(0,0,0,0.92);
			display: flex; flex-direction: column;
			align-items: center; justify-content: center;
			gap: 12px;
		}
		.cam-viewer img { max-width: 100%; max-height: 70%; }
		.cam-viewer-actions { display: flex; gap: 10px; }
		.cam-viewer-actions button {
			padding: 8px 16px; border-radius: 6px;
			background: #1976d2; color: #fff; border: none; cursor: pointer;
		}
		.cam-viewer-actions button.danger { background: #c62828; }
	`,
	content: CONTENT,

	onMount(ctx) {
		const strings = STRINGS[ctx.lang] || STRINGS['fr-FR'];

		const video    = ctx.$('#cam-video');
		const overlay  = ctx.$('#cam-overlay');
		const overlayCtx = overlay.getContext('2d');
		const banner   = ctx.$('#cam-banner');
		const presetsEl= ctx.$('#cam-presets');
		const shutter  = ctx.$('#cam-shutter');
		const switchBtn= ctx.$('#cam-switch');
		const galleryBtn = ctx.$('#cam-open-gallery');
		const filtersBtn = ctx.$('#cam-open-filters');

		let stream = null;
		let facingMode = 'user'; // 'user' | 'environment'
		const adj = { ...DEFAULT_ADJ };
		let activePreset = 'normal';
		let faceDetector = null;
		let faceDetectionOn = false;
		let faceTimer = null;
		let gallery = ctx.storage.get('gallery', []);

		try {
			if ('FaceDetector' in window) {
				faceDetector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 6 });
			}
		} catch (_) { faceDetector = null; }

		// ── Camera lifecycle ─────────────────────────────────
		async function startStream() {
			stopStream();
			banner.hidden = true;
			try {
				stream = await navigator.mediaDevices.getUserMedia({
					video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
					audio: false,
				});
				video.srcObject = stream;
				await video.play().catch(() => {});
			} catch (err) {
				showBanner(err.name === 'NotAllowedError' ? strings.permErr : strings.noCam);
			}
		}

		function stopStream() {
			if (stream) {
				stream.getTracks().forEach(t => t.stop());
				stream = null;
				video.srcObject = null;
			}
		}

		function showBanner(msg) {
			banner.textContent = msg;
			banner.hidden = false;
		}

		// ── Filters ──────────────────────────────────────────
		function applyFilter() {
			video.style.filter = adjToCssFilter(adj);
		}

		function setPreset(name) {
			activePreset = name;
			Object.assign(adj, DEFAULT_ADJ, PRESETS[name] || {});
			renderPresets();
			renderFilterSliders();
			applyFilter();
		}

		function renderPresets() {
			presetsEl.innerHTML = '';
			for (const name of Object.keys(PRESETS)) {
				const chip = document.createElement('button');
				chip.className = 'cam-preset' + (name === activePreset ? ' active' : '');
				chip.textContent = name;
				ctx.scope.on(chip, 'click', () => setPreset(name));
				presetsEl.appendChild(chip);
			}
		}

		// ── Face detection ───────────────────────────────────
		function resizeOverlay() {
			const r = overlay.getBoundingClientRect();
			overlay.width = Math.max(1, Math.round(r.width));
			overlay.height = Math.max(1, Math.round(r.height));
		}
		const overlayObs = new ResizeObserver(resizeOverlay);
		overlayObs.observe(overlay);
		ctx.scope.observe(overlayObs);
		resizeOverlay();

		async function detectFaces() {
			overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
			if (!faceDetector || !faceDetectionOn) return;
			if (!video.videoWidth || !video.videoHeight) return;
			try {
				const faces = await faceDetector.detect(video);
				// video is rendered with object-fit: cover, so the visible area
				// crops to the overlay box; we approximate by scaling from
				// video intrinsic size to overlay box.
				const sx = overlay.width  / video.videoWidth;
				const sy = overlay.height / video.videoHeight;
				const scale = Math.max(sx, sy); // cover ⇒ max
				const dx = (overlay.width  - video.videoWidth  * scale) / 2;
				const dy = (overlay.height - video.videoHeight * scale) / 2;
				overlayCtx.strokeStyle = '#4caf50';
				overlayCtx.lineWidth = 2;
				for (const f of faces) {
					const b = f.boundingBox;
					overlayCtx.strokeRect(b.x * scale + dx, b.y * scale + dy, b.width * scale, b.height * scale);
				}
			} catch (_) {}
		}

		function setFaceDetection(on) {
			faceDetectionOn = on && !!faceDetector;
			if (faceTimer) { clearInterval(faceTimer); faceTimer = null; }
			if (faceDetectionOn) {
				faceTimer = ctx.scope.setInterval(detectFaces, 300);
			} else {
				overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
			}
		}

		// ── Capture ──────────────────────────────────────────
		function capture() {
			if (!video.videoWidth || !video.videoHeight) return;
			const c = document.createElement('canvas');
			c.width = video.videoWidth;
			c.height = video.videoHeight;
			const cctx = c.getContext('2d');
			cctx.filter = adjToCssFilter(adj);
			// Mirror the user-facing camera so the photo matches the preview.
			if (facingMode === 'user') {
				cctx.translate(c.width, 0);
				cctx.scale(-1, 1);
			}
			cctx.drawImage(video, 0, 0, c.width, c.height);
			const dataUrl = c.toDataURL('image/jpeg', 0.85);
			gallery = [{ id: Date.now(), dataUrl }, ...gallery].slice(0, 30);
			ctx.storage.set('gallery', gallery);
			renderGallery();
			// Brief shutter flash on the stage
			flashShutter();
		}

		function flashShutter() {
			const flash = document.createElement('div');
			Object.assign(flash.style, {
				position: 'absolute', inset: 0, background: '#fff',
				opacity: '0.85', transition: 'opacity 0.3s',
				pointerEvents: 'none', zIndex: '50',
			});
			ctx.$('.cam-stage').appendChild(flash);
			requestAnimationFrame(() => { flash.style.opacity = '0'; });
			setTimeout(() => flash.remove(), 320);
		}

		// ── Side panels (filters & gallery) ──────────────────
		const filtersPanel = new Panel({
			parent: ctx.content, scope: ctx.scope, side: 'left', width: '82%',
		});
		const galleryPanel = new Panel({
			parent: ctx.content, scope: ctx.scope, side: 'right', width: '82%',
		});

		// Filters panel content
		const filtersUi = document.createElement('div');
		filtersUi.className = 'panel-content';
		filtersUi.innerHTML = `
			<h3>${strings.filters}</h3>
			<div class="cam-toggle">
				<label for="cam-face-toggle">${strings.faceOn}</label>
				<input type="checkbox" id="cam-face-toggle">
			</div>
			<div class="cam-face-status" id="cam-face-status"></div>
			<div id="cam-sliders"></div>
			<button class="cam-reset" id="cam-reset">${strings.reset}</button>
		`;
		filtersPanel.contentEl.appendChild(filtersUi);

		const slidersHost = filtersUi.querySelector('#cam-sliders');
		const faceToggle  = filtersUi.querySelector('#cam-face-toggle');
		const faceStatus  = filtersUi.querySelector('#cam-face-status');
		const resetBtn    = filtersUi.querySelector('#cam-reset');

		if (!faceDetector) {
			faceToggle.disabled = true;
			faceStatus.textContent = strings.faceUnavail;
		}

		function renderFilterSliders() {
			const SLIDERS = [
				{ key: 'brightness', min: 0,    max: 200, label: strings.brightness, suffix: '%' },
				{ key: 'contrast',   min: 0,    max: 200, label: strings.contrast,   suffix: '%' },
				{ key: 'saturate',   min: 0,    max: 200, label: strings.saturate,   suffix: '%' },
				{ key: 'hue',        min: -180, max: 180, label: strings.hue,        suffix: '°' },
				{ key: 'blur',       min: 0,    max: 20,  label: strings.blur,       suffix: 'px' },
			];
			slidersHost.innerHTML = '';
			for (const s of SLIDERS) {
				const wrap = document.createElement('div');
				wrap.className = 'cam-slider';
				wrap.innerHTML = `
					<div class="slider-row"><span>${s.label}</span><span data-val="${s.key}">${adj[s.key]}${s.suffix}</span></div>
					<input type="range" min="${s.min}" max="${s.max}" step="1" value="${adj[s.key]}" data-key="${s.key}">
				`;
				const input = wrap.querySelector('input');
				const valLabel = wrap.querySelector(`[data-val="${s.key}"]`);
				ctx.scope.on(input, 'input', () => {
					adj[s.key] = parseFloat(input.value);
					valLabel.textContent = `${adj[s.key]}${s.suffix}`;
					applyFilter();
				});
				slidersHost.appendChild(wrap);
			}
		}

		ctx.scope.on(faceToggle, 'change', () => setFaceDetection(faceToggle.checked));
		ctx.scope.on(resetBtn,   'click',  () => setPreset('normal'));

		// Gallery panel content
		const galleryUi = document.createElement('div');
		galleryUi.className = 'panel-content';
		galleryUi.innerHTML = `<h3>${strings.gallery}</h3><div class="cam-gallery" id="cam-gallery-list"></div>`;
		galleryPanel.contentEl.appendChild(galleryUi);
		const galleryList = galleryUi.querySelector('#cam-gallery-list');

		function renderGallery() {
			galleryList.innerHTML = '';
			if (gallery.length === 0) {
				const m = document.createElement('div');
				m.className = 'cam-empty';
				m.textContent = strings.empty;
				galleryList.appendChild(m);
				return;
			}
			for (const photo of gallery) {
				const thumb = document.createElement('div');
				thumb.className = 'cam-thumb';
				thumb.innerHTML = `<img src="${photo.dataUrl}" alt=""><button class="cam-thumb-del" title="${strings.remove}">×</button>`;
				ctx.scope.on(thumb.querySelector('img'), 'click', () => openViewer(photo));
				ctx.scope.on(thumb.querySelector('.cam-thumb-del'), 'click', (e) => {
					e.stopPropagation();
					removePhoto(photo.id);
				});
				galleryList.appendChild(thumb);
			}
		}

		function removePhoto(id) {
			gallery = gallery.filter(p => p.id !== id);
			ctx.storage.set('gallery', gallery);
			renderGallery();
		}

		function openViewer(photo) {
			const viewer = document.createElement('div');
			viewer.className = 'cam-viewer';
			viewer.innerHTML = `
				<img src="${photo.dataUrl}" alt="">
				<div class="cam-viewer-actions">
					<button data-act="download">${strings.download}</button>
					<button data-act="remove" class="danger">${strings.remove}</button>
					<button data-act="close">${strings.closeView}</button>
				</div>`;
			ctx.content.appendChild(viewer);
			// Block pointer events from reaching the side-panel drag detector.
			viewer.addEventListener('pointerdown', (e) => e.stopPropagation());
			viewer.addEventListener('click', (e) => {
				const a = e.target.closest('[data-act]')?.dataset.act;
				if (a === 'download') {
					const link = document.createElement('a');
					link.href = photo.dataUrl;
					link.download = `photo-${photo.id}.jpg`;
					link.click();
				} else if (a === 'remove') {
					removePhoto(photo.id);
					viewer.remove();
				} else if (a === 'close' || e.target === viewer) {
					viewer.remove();
				}
			});
		}

		// ── Wiring ───────────────────────────────────────────
		ctx.scope.on(shutter,    'click', capture);
		ctx.scope.on(switchBtn,  'click', () => {
			facingMode = facingMode === 'user' ? 'environment' : 'user';
			startStream();
		});
		ctx.scope.on(filtersBtn, 'click', () => filtersPanel.open());
		ctx.scope.on(galleryBtn, 'click', () => galleryPanel.open());

		// Mirror the front camera preview so it feels like a mirror.
		ctx.scope.on(video, 'playing', () => {
			video.style.transform = facingMode === 'user' ? 'scaleX(-1)' : '';
			overlay.style.transform = video.style.transform;
		});

		// Initial render
		setPreset('normal');
		renderGallery();
		startStream();

		return {
			pause:  () => stopStream(),
			resume: () => startStream(),
			quit:   () => {
				stopStream();
				filtersPanel.dispose();
				galleryPanel.dispose();
			},
		};
	},
};
