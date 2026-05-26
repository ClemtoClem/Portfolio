const DEFAULT_MUSICS = [
	'./assets/musics/faceraiders.mp3',
	'./assets/musics/menumusic.mp3',
	'./assets/musics/The Complex.mp3',
	'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3',
	'./assets/musics/SoundHelix-Song-1.mp3',
	'./assets/musics/SoundHelix-Song-2.mp3',
	'./assets/musics/SoundHelix-Song-3.mp3',
	'./assets/musics/SoundHelix-Song-4.mp3',
	'./assets/musics/SoundHelix-Song-5.mp3',
	'./assets/musics/SoundHelix-Song-6.mp3',
	'./assets/musics/SoundHelix-Song-7.mp3',
	'./assets/musics/SoundHelix-Song-8.mp3',
	'./assets/musics/SoundHelix-Song-9.mp3',
	'./assets/musics/SoundHelix-Song-10.mp3',
	'./assets/musics/SoundHelix-Song-11.mp3',
	'./assets/musics/SoundHelix-Song-12.mp3',
	'./assets/musics/SoundHelix-Song-13.mp3',
	'./assets/musics/SoundHelix-Song-14.mp3',
	'./assets/musics/SoundHelix-Song-15.mp3',
	'./assets/musics/SoundHelix-Song-16.mp3',
	'./assets/musics/SoundHelix-Song-17.mp3',
];

const TRACK_PALETTES = [
	['#1DB954', '#0d6e30'], ['#e63946', '#c1121f'], ['#457b9d', '#1d3557'],
	['#f4a261', '#e76f51'], ['#9b5de5', '#5a189a'], ['#f72585', '#7209b7'],
	['#4cc9f0', '#4361ee'], ['#2ec4b6', '#011627'], ['#ff9f1c', '#e71d36'],
	['#06d6a0', '#073b4c'],
];

const STRINGS = {
	'en-US': { noTrack: 'No track', addUrl: 'Audio URL…', save: 'Save', files: 'Files', remove: 'Remove' },
	'fr-FR': { noTrack: 'Aucune piste', addUrl: 'URL audio…', save: 'Sauvegarder', files: 'Fichiers', remove: 'Retirer' },
};

const CONTENT_FR = `
	<div class="music-app">
		<div class="music-player">
			<div class="player-bg"></div>
			<div class="disc-wrapper">
				<div class="disc" id="music-disc">
					<div class="disc-label" id="disc-label">♪</div>
				</div>
			</div>
			<div class="track-info">
				<div class="track-title-wrapper">
					<span class="track-title-text" id="track-title">Aucune piste</span>
				</div>
			</div>
			<div class="progress-section">
				<span id="time-current">0:00</span>
				<div class="progress-track">
					<div class="progress-fill" id="progress-fill"></div>
					<input type="range" class="progress-bar-input" id="progress-bar" min="0" value="0" step="1">
				</div>
				<span id="time-duration">0:00</span>
			</div>
			<div class="controls-main">
				<button class="ctrl-btn" id="prev-btn" title="Précédent">
					<svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
				</button>
				<button class="ctrl-btn big" id="play-btn" title="Lecture/Pause">
					<svg id="play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
				</button>
				<button class="ctrl-btn" id="next-btn" title="Suivant">
					<svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6h2v12h-2z"/></svg>
				</button>
			</div>
			<div class="controls-secondary">
				<button class="ctrl-btn sm" id="shuffle-btn" title="Aléatoire">
					<svg viewBox="0 0 24 24"><path d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>
				</button>
				<button class="ctrl-btn sm" id="repeat-btn" title="Répéter">
					<svg id="repeat-icon" viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>
				</button>
				<div class="volume-group">
					<button class="ctrl-btn sm" id="mute-btn" title="Volume">
						<svg id="volume-icon" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
					</button>
					<input type="range" class="volume-slider" id="volume-slider" min="0" max="1" step="0.02" value="1">
				</div>
				<select class="speed-select" id="speed-select" title="Vitesse">
					<option value="0.5">0.5×</option>
					<option value="0.75">0.75×</option>
					<option value="1" selected>1×</option>
					<option value="1.25">1.25×</option>
					<option value="1.5">1.5×</option>
					<option value="2">2×</option>
				</select>
			</div>
		</div>
		<div class="music-playlist">
			<div class="playlist-toolbar">
				<input type="text" id="pl-url-input" placeholder="URL audio…">
				<button class="pl-btn" id="pl-add-url">+URL</button>
				<label class="pl-btn secondary" for="pl-file-input">📂</label>
				<input type="file" id="pl-file-input" accept="audio/*" multiple>
				<button class="pl-btn secondary" id="pl-save" title="Sauvegarder">💾</button>
			</div>
			<canvas class="visualizer" id="visualizer"></canvas>
			<div class="track-list" id="track-list"></div>
		</div>
		<audio id="music-audio" crossorigin="anonymous" preload="metadata"></audio>
	</div>
`;

export const musicReaderApp = {
	id: 'app-music-reader',
	title: { 'en-US': 'Music', 'fr-FR': 'Musique' },
	version: '2.1.0',
	icon: `<svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 19.5C12 20.8807 10.8807 22 9.5 22C8.11929 22 7 20.8807 7 19.5C7 18.1193 8.11929 17 9.5 17C10.8807 17 12 18.1193 12 19.5Z" stroke="#1C274C" stroke-width="1.5"></path> <path d="M22 17.5C22 18.8807 20.8807 20 19.5 20C18.1193 20 17 18.8807 17 17.5C17 16.1193 18.1193 15 19.5 15C20.8807 15 22 16.1193 22 17.5Z" stroke="#1C274C" stroke-width="1.5"></path> <path d="M22 8L12 12" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M14.4556 5.15803L14.7452 5.84987L14.4556 5.15803ZM16.4556 4.32094L16.1661 3.62909L16.4556 4.32094ZM21.1081 3.34059L20.6925 3.96496L20.6925 3.96496L21.1081 3.34059ZM21.25 12.0004C21.25 12.4146 21.5858 12.7504 22 12.7504C22.4142 12.7504 22.75 12.4146 22.75 12.0004H21.25ZM12.75 19.0004V8.84787H11.25V19.0004H12.75ZM14.7452 5.84987L16.7452 5.01278L16.1661 3.62909L14.1661 4.46618L14.7452 5.84987ZM22.75 8.01078C22.75 6.67666 22.752 5.59091 22.6304 4.76937C22.5067 3.93328 22.2308 3.18689 21.5236 2.71622L20.6925 3.96496C20.8772 4.08787 21.0473 4.31771 21.1466 4.98889C21.248 5.67462 21.25 6.62717 21.25 8.01078H22.75ZM16.7452 5.01278C18.0215 4.47858 18.901 4.11263 19.5727 3.94145C20.2302 3.77391 20.5079 3.84204 20.6925 3.96496L21.5236 2.71622C20.8164 2.24554 20.0213 2.2792 19.2023 2.48791C18.3975 2.69298 17.3967 3.114 16.1661 3.62909L16.7452 5.01278ZM12.75 8.84787C12.75 8.18634 12.751 7.74991 12.7875 7.41416C12.822 7.09662 12.8823 6.94006 12.9594 6.8243L11.7106 5.99325C11.4527 6.38089 11.3455 6.79864 11.2963 7.25218C11.249 7.68752 11.25 8.21893 11.25 8.84787H12.75ZM14.1661 4.46618C13.5859 4.70901 13.0953 4.91324 12.712 5.12494C12.3126 5.34549 11.9686 5.60562 11.7106 5.99325L12.9594 6.8243C13.0364 6.70855 13.1575 6.59242 13.4371 6.438C13.7328 6.27473 14.135 6.10528 14.7452 5.84987L14.1661 4.46618ZM22.75 12.0004V8.01078H21.25V12.0004H22.75Z" fill="#1C274C"></path> <path d="M7 11V6.5V2" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <circle cx="4.5" cy="10.5" r="2.5" stroke="#1C274C" stroke-width="1.5"></circle> <path d="M10 5C8.75736 5 7 4.07107 7 2" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>`,
	iconColor: '#1DB954',
	headerColor: '#121212',
	type: 'app',
	style: `
		:root {
			--music-accent: #1DB954; --music-bg: #121212; --music-surface: #181818;
			--music-border: #282828; --music-grey: #b3b3b3; --music-white: #ffffff;
			--track-c1: #1DB954; --track-c2: #0d6e30;
		}
		.app-content { padding: 0; background: var(--music-bg); }
		.music-app {
			display: flex; flex-direction: column; height: 100%;
			background: var(--music-bg); color: var(--music-white);
			font-family: 'Roboto', sans-serif; overflow: hidden; user-select: none;
		}
		.music-player { flex: 0 0 auto; position: relative; display: flex; flex-direction: column; align-items: center; padding: 20px 16px 14px; overflow: hidden; gap: 12px; }
		.player-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 0%, var(--track-c1) 0%, var(--music-bg) 70%); opacity: 0.55; transition: background 0.8s ease; pointer-events: none; z-index: 0; }
		.music-player > * { position: relative; z-index: 1; }
		.disc-wrapper { width: 150px; height: 150px; position: relative; filter: drop-shadow(0 8px 24px rgba(0,0,0,0.7)); }
		.disc { width: 100%; height: 100%; border-radius: 50%;
			background: radial-gradient(circle at 50% 50%, transparent 18%, rgba(255,255,255,0.03) 19%, rgba(255,255,255,0.03) 25%, transparent 26%, transparent 33%, rgba(255,255,255,0.025) 34%, rgba(255,255,255,0.025) 40%, transparent 41%), conic-gradient(from 0deg, #2a2a2a, #1a1a1a, #2e2e2e, #1a1a1a, #2a2a2a);
			display: flex; align-items: center; justify-content: center;
			animation: disc-spin 5s linear infinite; animation-play-state: paused;
			border: 3px solid #333;
		}
		.disc.playing { animation-play-state: running; }
		@keyframes disc-spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
		.disc-label {
			width: 58px; height: 58px; border-radius: 50%;
			background: linear-gradient(135deg, var(--track-c1), var(--track-c2));
			display: flex; align-items: center; justify-content: center;
			font-size: 1.4rem; font-weight: bold; color: #fff;
			border: 3px solid #222; box-shadow: inset 0 2px 4px rgba(0,0,0,0.4);
			transition: background 0.8s ease;
		}
		.track-info { width: 100%; text-align: center; }
		.track-title-wrapper { overflow: hidden; white-space: nowrap; }
		.track-title-text { display: inline-block; font-size: 1rem; font-weight: 600; }
		.track-title-text.marquee { animation: marquee-text 12s linear infinite; }
		@keyframes marquee-text {
			0%, 10% { transform: translateX(0); }
			80%, 90% { transform: translateX(-80%); }
			100% { transform: translateX(0); }
		}
		.progress-section { width: 100%; display: flex; align-items: center; gap: 8px; font-size: 0.72rem; color: var(--music-grey); }
		.progress-track { flex: 1; height: 4px; border-radius: 2px; background: #535353; position: relative; cursor: pointer; }
		.progress-fill { position: absolute; left: 0; top: 0; bottom: 0; width: 0%; border-radius: 2px; background: linear-gradient(to right, var(--track-c1), var(--music-white)); pointer-events: none; transition: width 0.1s linear; }
		.progress-bar-input { position: absolute; inset: -6px 0; width: 100%; height: calc(100% + 12px); opacity: 0; cursor: pointer; margin: 0; }
		.controls-main { display: flex; align-items: center; justify-content: center; gap: 18px; }
		.ctrl-btn { background: none; border: none; color: var(--music-grey); cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px; border-radius: 50%; transition: color 0.2s, transform 0.15s; }
		.ctrl-btn:hover { color: var(--music-white); }
		.ctrl-btn svg { width: 22px; height: 22px; fill: currentColor; }
		.ctrl-btn.big { color: var(--music-white); }
		.ctrl-btn.big svg { width: 44px; height: 44px; }
		.ctrl-btn.big:active { transform: scale(0.93); }
		.ctrl-btn.active { color: var(--track-c1); }
		.controls-secondary { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 6px; }
		.ctrl-btn.sm svg { width: 18px; height: 18px; }
		.volume-group { display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0; }
		.volume-slider { flex: 1; height: 3px; border-radius: 2px; background: #535353; outline: none; -webkit-appearance: none; cursor: pointer; min-width: 0; }
		.volume-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 10px; height: 10px; border-radius: 50%; background: var(--music-white); cursor: pointer; }
		.speed-select { background: #2a2a2a; color: var(--music-grey); border: none; border-radius: 12px; padding: 3px 6px; font-size: 0.72rem; cursor: pointer; outline: none; }
		.music-playlist { flex: 1; display: flex; flex-direction: column; background: var(--music-surface); border-top: 1px solid var(--music-border); overflow: hidden; min-height: 0; }
		.playlist-toolbar { display: flex; gap: 6px; padding: 8px 10px; border-bottom: 1px solid var(--music-border); align-items: center; }
		.playlist-toolbar input[type="text"] { flex: 1; padding: 6px 10px; border-radius: 16px; border: none; background: #333; color: var(--music-white); font-size: 0.8rem; min-width: 0; }
		.pl-btn { padding: 6px 10px; border-radius: 16px; border: none; background: var(--track-c1); color: var(--music-white); font-size: 0.75rem; font-weight: 600; cursor: pointer; white-space: nowrap; }
		.pl-btn.secondary { background: #333; color: var(--music-grey); }
		#pl-file-input { display: none; }
		canvas.visualizer { width: 100%; height: 48px; display: block; background: #000; flex-shrink: 0; }
		.track-list { flex: 1; overflow-y: auto; padding: 4px 0; }
		.track-list::-webkit-scrollbar { width: 4px; }
		.track-list::-webkit-scrollbar-thumb { background: #444; border-radius: 2px; }
		.track-item { display: flex; align-items: center; padding: 7px 10px; cursor: pointer; border-radius: 4px; margin: 0 4px; gap: 8px; color: var(--music-grey); font-size: 0.82rem; }
		.track-item:hover { background: rgba(255,255,255,0.07); color: var(--music-white); }
		.track-item:hover .track-delete { opacity: 1; }
		.track-item.active { color: var(--track-c1); background: rgba(29,185,84,0.08); }
		.track-idx { width: 20px; text-align: center; flex-shrink: 0; font-size: 0.75rem; }
		.track-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
		.track-dur { font-size: 0.72rem; color: #666; flex-shrink: 0; }
		.track-delete { background: none; border: none; color: #666; cursor: pointer; opacity: 0; padding: 2px 4px; border-radius: 3px; font-size: 0.9rem; transition: opacity 0.15s, color 0.15s; flex-shrink: 0; }
		.track-delete:hover { color: #e74c3c; }
	`,
	content: CONTENT_FR,

	onMount(ctx) {
		const strings = STRINGS[ctx.lang] || STRINGS['fr-FR'];
		const ui = {
			disc:         ctx.$('#music-disc'),
			discLabel:    ctx.$('#disc-label'),
			trackTitle:   ctx.$('#track-title'),
			timeCurrent:  ctx.$('#time-current'),
			timeDur:      ctx.$('#time-duration'),
			progressBar:  ctx.$('#progress-bar'),
			progressFill: ctx.$('#progress-fill'),
			trackList:    ctx.$('#track-list'),
			playIcon:     ctx.$('#play-icon'),
			repeatIcon:   ctx.$('#repeat-icon'),
			volumeIcon:   ctx.$('#volume-icon'),
			canvas:       ctx.$('#visualizer'),
			urlInput:     ctx.$('#pl-url-input'),
			volume:       ctx.$('#volume-slider'),
			speed:        ctx.$('#speed-select'),
			btnPlay:      ctx.$('#play-btn'),
			btnPrev:      ctx.$('#prev-btn'),
			btnNext:      ctx.$('#next-btn'),
			btnShuffle:   ctx.$('#shuffle-btn'),
			btnRepeat:    ctx.$('#repeat-btn'),
			btnMute:      ctx.$('#mute-btn'),
			btnAddUrl:    ctx.$('#pl-add-url'),
			btnSave:      ctx.$('#pl-save'),
			fileInput:    ctx.$('#pl-file-input'),
		};
		const audio = ctx.$('#music-audio');

		// State
		let playlist = [];
		let currentIndex = -1;
		let shuffleOn = false;
		let repeatMode = 'none';
		let prevVolume = 1;
		const trackDurations = new Map();

		// Web Audio for visualiser — lazy-initialised on first play (autoplay rules)
		const canvasCtx = ui.canvas.getContext('2d');
		let audioCtx, analyser, sourceNode, vizRafId;
		let audioCtxReady = false;

		function resizeCanvas() {
			const dpr = Math.max(1, window.devicePixelRatio || 1);
			ui.canvas.width = ui.canvas.offsetWidth * dpr;
			ui.canvas.height = ui.canvas.offsetHeight * dpr;
		}
		const obs = new ResizeObserver(resizeCanvas);
		obs.observe(ui.canvas);
		ctx.scope.observe(obs);
		resizeCanvas();

		function setupAudioContext() {
			if (audioCtxReady) { audioCtx.resume(); return; }
			try {
				const AC = window.AudioContext || window.webkitAudioContext;
				audioCtx = new AC();
				analyser = audioCtx.createAnalyser();
				analyser.fftSize = 512;
				sourceNode = audioCtx.createMediaElementSource(audio);
				sourceNode.connect(analyser);
				analyser.connect(audioCtx.destination);
				audioCtxReady = true;
				drawVisualizer();
			} catch (_) {}
		}

		function drawVisualizer() {
			vizRafId = requestAnimationFrame(drawVisualizer);
			if (!audioCtxReady) return;
			const W = ui.canvas.width, H = ui.canvas.height;
			const buf = new Uint8Array(analyser.frequencyBinCount);
			analyser.getByteFrequencyData(buf);
			canvasCtx.fillStyle = '#000';
			canvasCtx.fillRect(0, 0, W, H);
			const barCount = 64;
			const step = Math.floor(buf.length / barCount);
			const barW = (W / barCount) * 0.7;
			const gap  = (W / barCount) * 0.3;
			const [c1, c2] = palette();
			for (let i = 0; i < barCount; i++) {
				let sum = 0;
				for (let j = 0; j < step; j++) sum += buf[i * step + j];
				const avg = sum / step;
				const bH  = (avg / 255) * H;
				const x   = i * (barW + gap);
				const grad = canvasCtx.createLinearGradient(0, H, 0, H - bH);
				grad.addColorStop(0, c1 + 'cc');
				grad.addColorStop(1, c2 + '88');
				canvasCtx.fillStyle = grad;
				canvasCtx.beginPath();
				canvasCtx.roundRect ? canvasCtx.roundRect(x, H - bH, barW, bH, 2) : canvasCtx.rect(x, H - bH, barW, bH);
				canvasCtx.fill();
			}
		}

		function palette(idx = currentIndex) {
			return TRACK_PALETTES[(Math.max(0, idx)) % TRACK_PALETTES.length];
		}

		function applyPalette(idx) {
			const [c1, c2] = palette(idx);
			const root = ui.disc.closest('.music-app');
			if (root) {
				root.style.setProperty('--track-c1', c1);
				root.style.setProperty('--track-c2', c2);
			}
		}

		// Track helpers
		const trackName = (t) => {
			if (t && typeof t === 'object' && t.name) return t.name.replace(/\.[^.]+$/, '');
			const raw = (typeof t === 'string' ? t : '').split('/').pop() || '';
			return decodeURIComponent(raw.replace(/\.[^.]+$/, '')) || 'Inconnu';
		};
		const trackId = (t) => typeof t === 'string' ? t : `local-${t.name}-${t.size}`;
		const trackSrc = (t) => typeof t === 'string' ? t : URL.createObjectURL(t);
		const trackInitial = (t) => (trackName(t).trim().charAt(0).toUpperCase() || '♪');

		function fmtTime(s) {
			if (!s || isNaN(s)) return '0:00';
			const m = Math.floor(s / 60), sec = Math.floor(s % 60);
			return `${m}:${sec < 10 ? '0' : ''}${sec}`;
		}

		// Playback
		function playTrack(idx) {
			if (idx < 0 || idx >= playlist.length) return;
			currentIndex = idx;
			const t = playlist[idx];
			audio.src = trackSrc(t);
			audio.volume = parseFloat(ui.volume.value);
			audio.playbackRate = parseFloat(ui.speed.value);
			audio.load();
			setupAudioContext();
			audio.play().catch(() => {});
			applyPalette(idx);
			updatePlayerUI(true);
			renderPlaylist();
		}

		function togglePlay() {
			if (!playlist.length) return;
			if (currentIndex < 0) { playTrack(0); return; }
			if (audio.paused) audio.play().catch(() => {});
			else audio.pause();
		}

		function playNext() {
			if (!playlist.length) return;
			if (shuffleOn) playTrack(Math.floor(Math.random() * playlist.length));
			else playTrack((currentIndex + 1) % playlist.length);
		}

		function playPrev() {
			if (!playlist.length) return;
			if (audio.currentTime > 3) { audio.currentTime = 0; return; }
			playTrack(currentIndex <= 0 ? playlist.length - 1 : currentIndex - 1);
		}

		function setPlaying(state) {
			ui.playIcon.innerHTML = state
				? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'
				: '<path d="M8 5v14l11-7z"/>';
			ui.disc.classList.toggle('playing', state);
		}

		function updatePlayerUI(playing = false) {
			if (currentIndex < 0) {
				ui.trackTitle.textContent = strings.noTrack;
				ui.discLabel.textContent = '♪';
				setPlaying(false);
				return;
			}
			const name = trackName(playlist[currentIndex]);
			ui.trackTitle.textContent = name;
			ui.trackTitle.classList.remove('marquee');
			void ui.trackTitle.offsetWidth;
			if (ui.trackTitle.scrollWidth > ui.trackTitle.clientWidth) {
				ui.trackTitle.classList.add('marquee');
			}
			ui.discLabel.textContent = trackInitial(playlist[currentIndex]);
			setPlaying(playing);
		}

		function updateProgress() {
			if (!audio.duration || isNaN(audio.duration)) return;
			const pct = (audio.currentTime / audio.duration) * 100;
			ui.progressFill.style.width = pct + '%';
			ui.progressBar.max = Math.floor(audio.duration);
			ui.progressBar.value = Math.floor(audio.currentTime);
			ui.timeCurrent.textContent = fmtTime(audio.currentTime);
			ui.timeDur.textContent = fmtTime(audio.duration);
		}

		function renderPlaylist() {
			ui.trackList.innerHTML = '';
			const [c1] = palette(currentIndex);
			playlist.forEach((track, idx) => {
				const name = trackName(track);
				const isActive = idx === currentIndex;
				const dur = trackDurations.get(trackId(track)) || '';
				const numHTML = isActive
					? `<svg style="width:14px;height:14px;fill:${c1}" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3z"/></svg>`
					: `<span>${idx + 1}</span>`;
				const item = document.createElement('div');
				item.className = `track-item${isActive ? ' active' : ''}`;
				item.dataset.idx = String(idx);
				item.innerHTML = `
					<div class="track-idx">${numHTML}</div>
					<span class="track-name" title="${name}">${name}</span>
					<span class="track-dur">${dur}</span>
					<button class="track-delete" title="${strings.remove}">✕</button>`;
				ctx.scope.on(item, 'click', (e) => {
					if (e.target.classList.contains('track-delete')) removeTrack(idx);
					else playTrack(idx);
				});
				ui.trackList.appendChild(item);
			});
		}

		function removeTrack(idx) {
			if (idx === currentIndex) {
				audio.pause();
				audio.src = '';
				currentIndex = -1;
				updatePlayerUI(false);
			} else if (idx < currentIndex) {
				currentIndex--;
			}
			playlist.splice(idx, 1);
			renderPlaylist();
		}

		function cycleRepeat() {
			const modes = ['none', 'all', 'one'];
			repeatMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
			const isActive = repeatMode !== 'none';
			ui.btnRepeat.classList.toggle('active', isActive);
			ui.repeatIcon.innerHTML = repeatMode === 'one'
				? '<path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/><text x="12" y="13" text-anchor="middle" font-size="7" fill="currentColor">1</text>'
				: '<path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>';
		}

		function updateVolumeIcon(vol) {
			let path;
			if (vol === 0)        path = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
			else if (vol < 0.4)   path = '<path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>';
			else                  path = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
			ui.volumeIcon.innerHTML = path;
		}

		function preloadDuration(track) {
			const id = trackId(track);
			if (trackDurations.has(id)) return;
			const tmp = new Audio();
			tmp.preload = 'metadata';
			tmp.src = trackSrc(track);
			tmp.addEventListener('loadedmetadata', () => {
				trackDurations.set(id, fmtTime(tmp.duration));
				renderPlaylist();
			}, { once: true });
		}

		// Initial playlist
		const saved = ctx.storage.get('playlist', []);
		playlist = [...DEFAULT_MUSICS, ...saved.filter(u => !DEFAULT_MUSICS.includes(u))];
		playlist.forEach(preloadDuration);

		// Audio events
		ctx.scope.on(audio, 'timeupdate', updateProgress);
		ctx.scope.on(audio, 'play',  () => updatePlayerUI(true));
		ctx.scope.on(audio, 'pause', () => setPlaying(false));
		ctx.scope.on(audio, 'loadedmetadata', updateProgress);
		ctx.scope.on(audio, 'ended', () => {
			if (repeatMode === 'one') { audio.currentTime = 0; audio.play(); return; }
			if (repeatMode === 'all' || currentIndex < playlist.length - 1) playNext();
			else setPlaying(false);
		});

		// UI events
		ctx.scope.on(ui.btnPlay,    'click', togglePlay);
		ctx.scope.on(ui.btnPrev,    'click', playPrev);
		ctx.scope.on(ui.btnNext,    'click', playNext);
		ctx.scope.on(ui.btnShuffle, 'click', () => {
			shuffleOn = !shuffleOn;
			ui.btnShuffle.classList.toggle('active', shuffleOn);
		});
		ctx.scope.on(ui.btnRepeat,  'click', cycleRepeat);
		ctx.scope.on(ui.volume,     'input', () => {
			const v = parseFloat(ui.volume.value);
			audio.volume = v;
			if (v > 0) prevVolume = v;
			updateVolumeIcon(v);
		});
		ctx.scope.on(ui.btnMute, 'click', () => {
			if (audio.volume > 0) {
				prevVolume = audio.volume;
				audio.volume = 0;
				ui.volume.value = '0';
			} else {
				audio.volume = prevVolume;
				ui.volume.value = String(prevVolume);
			}
			updateVolumeIcon(audio.volume);
		});
		ctx.scope.on(ui.speed, 'change', () => { audio.playbackRate = parseFloat(ui.speed.value); });
		ctx.scope.on(ui.progressBar, 'input', () => { audio.currentTime = parseFloat(ui.progressBar.value); });

		ctx.scope.on(ui.btnAddUrl, 'click', () => {
			const url = ui.urlInput.value.trim();
			if (!url) return;
			playlist.push(url);
			preloadDuration(url);
			renderPlaylist();
			ui.urlInput.value = '';
		});
		ctx.scope.on(ui.fileInput, 'change', () => {
			for (const f of ui.fileInput.files) {
				playlist.push(f);
				preloadDuration(f);
			}
			renderPlaylist();
		});
		ctx.scope.on(ui.btnSave, 'click', () => {
			const toSave = playlist.filter(t => typeof t === 'string' && !DEFAULT_MUSICS.includes(t));
			ctx.storage.set('playlist', toSave);
		});

		// Keyboard shortcuts (scoped to document but disposed when window closes)
		ctx.scope.on(document, 'keydown', (e) => {
			if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
			if (!ctx.root.isConnected) return;
			switch (e.code) {
				case 'Space':       e.preventDefault(); togglePlay(); break;
				case 'ArrowRight':  e.preventDefault(); audio.currentTime += 5; break;
				case 'ArrowLeft':   e.preventDefault(); audio.currentTime -= 5; break;
				case 'ArrowUp':     e.preventDefault(); audio.volume = Math.min(1, audio.volume + 0.1); ui.volume.value = String(audio.volume); updateVolumeIcon(audio.volume); break;
				case 'ArrowDown':   e.preventDefault(); audio.volume = Math.max(0, audio.volume - 0.1); ui.volume.value = String(audio.volume); updateVolumeIcon(audio.volume); break;
				case 'KeyN':        playNext(); break;
				case 'KeyP':        playPrev(); break;
			}
		});

		applyPalette(0);
		updatePlayerUI(false);
		renderPlaylist();
		drawVisualizer();

		return {
			pause:  () => audio.pause(),
			resume: () => audio.play().catch(() => {}),
			quit:   () => {
				audio.pause();
				audio.src = '';
				cancelAnimationFrame(vizRafId);
			},
		};
	}
};
