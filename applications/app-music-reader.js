const VERSION = '1.2.0';
const DEFAULT_MUSICS = [
	"./musics/faceraiders.mp3",
	"./musics/menumusic.mp3",
	"./musics/The Complex.mp3",
	"https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3",
	"./musics/SoundHelix-Song-1.mp3",
	"./musics/SoundHelix-Song-2.mp3",
	"./musics/SoundHelix-Song-3.mp3",
	"./musics/SoundHelix-Song-4.mp3",
	"./musics/SoundHelix-Song-5.mp3",
	"./musics/SoundHelix-Song-6.mp3",
	"./musics/SoundHelix-Song-7.mp3",
	"./musics/SoundHelix-Song-8.mp3",
	"./musics/SoundHelix-Song-9.mp3",
	"./musics/SoundHelix-Song-10.mp3",
	"./musics/SoundHelix-Song-11.mp3",
	"./musics/SoundHelix-Song-12.mp3",
	"./musics/SoundHelix-Song-13.mp3",
	"./musics/SoundHelix-Song-14.mp3",
	"./musics/SoundHelix-Song-15.mp3",
	"./musics/SoundHelix-Song-16.mp3",
	"./musics/SoundHelix-Song-17.mp3"
];
const STORAGE_PLAYLIST_KEY = 'saved_playlist';
export const musicReaderApp = {
	id: 'app-music-reader',
	title: { 'en-US': 'Music Reader', 'fr-FR': 'Lecteur Musique' },
	version: VERSION,
	icon: '<svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 19.5C12 20.8807 10.8807 22 9.5 22C8.11929 22 7 20.8807 7 19.5C7 18.1193 8.11929 17 9.5 17C10.8807 17 12 18.1193 12 19.5Z" stroke="#1C274C" stroke-width="1.5"></path> <path d="M22 17.5C22 18.8807 20.8807 20 19.5 20C18.1193 20 17 18.8807 17 17.5C17 16.1193 18.1193 15 19.5 15C20.8807 15 22 16.1193 22 17.5Z" stroke="#1C274C" stroke-width="1.5"></path> <path d="M22 8L12 12" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M14.4556 5.15803L14.7452 5.84987L14.4556 5.15803ZM16.4556 4.32094L16.1661 3.62909L16.4556 4.32094ZM21.1081 3.34059L20.6925 3.96496L20.6925 3.96496L21.1081 3.34059ZM21.25 12.0004C21.25 12.4146 21.5858 12.7504 22 12.7504C22.4142 12.7504 22.75 12.4146 22.75 12.0004H21.25ZM12.75 19.0004V8.84787H11.25V19.0004H12.75ZM14.7452 5.84987L16.7452 5.01278L16.1661 3.62909L14.1661 4.46618L14.7452 5.84987ZM22.75 8.01078C22.75 6.67666 22.752 5.59091 22.6304 4.76937C22.5067 3.93328 22.2308 3.18689 21.5236 2.71622L20.6925 3.96496C20.8772 4.08787 21.0473 4.31771 21.1466 4.98889C21.248 5.67462 21.25 6.62717 21.25 8.01078H22.75ZM16.7452 5.01278C18.0215 4.47858 18.901 4.11263 19.5727 3.94145C20.2302 3.77391 20.5079 3.84204 20.6925 3.96496L21.5236 2.71622C20.8164 2.24554 20.0213 2.2792 19.2023 2.48791C18.3975 2.69298 17.3967 3.114 16.1661 3.62909L16.7452 5.01278ZM12.75 8.84787C12.75 8.18634 12.751 7.74991 12.7875 7.41416C12.822 7.09662 12.8823 6.94006 12.9594 6.8243L11.7106 5.99325C11.4527 6.38089 11.3455 6.79864 11.2963 7.25218C11.249 7.68752 11.25 8.21893 11.25 8.84787H12.75ZM14.1661 4.46618C13.5859 4.70901 13.0953 4.91324 12.712 5.12494C12.3126 5.34549 11.9686 5.60562 11.7106 5.99325L12.9594 6.8243C13.0364 6.70855 13.1575 6.59242 13.4371 6.438C13.7328 6.27473 14.135 6.10528 14.7452 5.84987L14.1661 4.46618ZM22.75 12.0004V8.01078H21.25V12.0004H22.75Z" fill="#1C274C"></path> <path d="M7 11V6.5V2" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <circle cx="4.5" cy="10.5" r="2.5" stroke="#1C274C" stroke-width="1.5"></circle> <path d="M10 5C8.75736 5 7 4.07107 7 2" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>',
	iconColor: '#1DB954',
	headerColor: '#121212',
	type: 'app',
	style: `
		:root {
			--primary-color: #1DB954;
			--secondary-black: #121212;
			--secondary-light-black: #181818;
			--secondary-grey: #b3b3b3;
			--secondary-white: #ffffff;
		}
		.app-content { padding: 0px; }
		.app-music-container {
			display: flex;
			flex-direction: column;
			height: 100%;
			background-color: var(--secondary-black);
			color: var(--secondary-white);
			font-family: 'Roboto', sans-serif;
			overflow: hidden;
		}

		/* --- Header / Inputs --- */
		.music-inputs {
			padding: 15px;
			background: var(--secondary-light-black);
			display: flex;
			gap: 10px;
			flex-wrap: wrap;
			border-bottom: 1px solid #282828;
		}
		.music-inputs input[type="text"] {
			flex: 1;
			padding: 8px;
			border-radius: 20px;
			border: none;
			background: #333;
			color: white;
		}
		.music-inputs button, .file-upload-label {
			padding: 8px 15px;
			border-radius: 20px;
			border: none;
			background: var(--primary-color);
			color: white;
			cursor: pointer;
			font-weight: bold;
			font-size: 0.8rem;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.music-inputs button:hover, .file-upload-label:hover {
			opacity: 0.9;
		}
		#file-input { display: none; }

		/* --- Visualizer --- */
		.visualizer-container {
			flex: 0 0 100px;
			width: 100%;
			background: #000;
			position: relative;
		}
		canvas#visualizer {
			width: 100%;
			height: 100%;
			display: block;
		}

		/* --- Playlist --- */
		.playlist-container {
			flex: 1;
			overflow-y: auto;
			padding: 10px;
		}
		.track-item {
			display: flex;
			align-items: center;
			padding: 10px;
			border-radius: 5px;
			cursor: pointer;
			transition: background 0.2s;
			color: var(--secondary-grey);
		}
		.track-item:hover {
			background: rgba(255,255,255,0.1);
			color: var(--secondary-white);
		}
		.track-item.active {
			color: var(--primary-color);
			background: rgba(29, 185, 84, 0.1);
		}
		.track-icon { margin-right: 10px; }
		
		/* --- Player Controls --- */
		.player-controls {
			background: var(--secondary-light-black);
			padding: 15px;
			border-top: 1px solid #282828;
			display: flex;
			flex-direction: column;
			gap: 10px;
		}
		
		/* Marquee Effect for Song Title */
		.current-track-info {
			width: 100%;
			overflow: hidden;
			white-space: nowrap;
			position: relative;
			margin-bottom: 5px;
		}
		.scrolling-text {
			display: inline-block;
			font-weight: bold;
			font-size: 1.1rem;
			/* Animation appliquée via JS si nécessaire ou classe CSS */
		}
		.scrolling-text.animate {
			padding-left: 100%;
			animation: marquee 10s linear infinite;
		}
		@keyframes marquee {
			0% { transform: translate(0, 0); }
			100% { transform: translate(-100%, 0); }
		}

		.controls-buttons {
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 20px;
		}
		.control-btn {
			background: none;
			border: none;
			color: var(--secondary-grey);
			font-size: 1.5rem;
			cursor: pointer;
			transition: color 0.2s;
		}
		.control-btn:hover { color: var(--secondary-white); }
		.play-btn {
			font-size: 2.5rem;
			color: var(--secondary-white);
		}
		.play-btn:hover { transform: scale(1.05); }

		.progress-container {
			display: flex;
			align-items: center;
			gap: 10px;
			font-size: 0.8rem;
			color: var(--secondary-grey);
		}
		input[type=range] {
			flex: 1;
			height: 4px;
			border-radius: 2px;
			background: #535353;
			outline: none;
			-webkit-appearance: none;
		}
		input[type=range]::-webkit-slider-thumb {
			-webkit-appearance: none;
			width: 12px;
			height: 12px;
			border-radius: 50%;
			background: var(--secondary-white);
			cursor: pointer;
		}
	`,
	content: `
		<div class="app-music-container">
			<div class="music-inputs">
				<input type="text" id="url-input" placeholder="https://exemple.com/musique.mp3">
				<button id="add-url-btn">+ URL</button>
				<label for="file-input" class="file-upload-label">📂 Local</label>
				<input type="file" id="file-input" accept="audio/*" multiple>
				<button id="save-playlist-btn" title="Sauvegarder la liste (URLs)">💾</button>
			</div>

			<div class="visualizer-container">
				<canvas id="visualizer"></canvas>
			</div>

			<div class="playlist-container" id="playlist"></div>

			<div class="player-controls">
				<div class="current-track-info">
					<span id="track-name" class="scrolling-text">Aucune lecture</span>
				</div>
				
				<div class="controls-buttons">
					<button class="control-btn" id="prev-btn">⏮</button>
					<button class="control-btn play-btn" id="play-btn">▶</button>
					<button class="control-btn" id="next-btn">⏭</button>
				</div>

				<div class="progress-container">
					<span id="current-time">0:00</span>
					<input type="range" id="progress-bar" value="0" min="0" step="1">
					<span id="duration">0:00</span>
				</div>
			</div>
			
			<audio id="audio-player" crossorigin="anonymous"></audio>
		</div>
	`,

	// Fonction d'initialisation appelée par system.js
	init: function (system, windowId) {
		const $window = $(`#${windowId}`);
		const $content = $window.find('.app-content');

		// --- Variables d'état ---
		let playlist = [...DEFAULT_MUSICS]; // Copie pour manipuler
		let currentIndex = -1;
		const audio = $content.find('#audio-player')[0];
		
		// --- Web Audio API Context (Visualiseur) ---
		const audioManager = system.audioManager;
		let currentAudio = null;
		let audioCtx, analyser, sourceNode;
		let isAudioContextSetup = false;

		const canvas = $content.find('#visualizer')[0];
		const canvasCtx = canvas.getContext('2d');

		// Configuration du Canvas
		function resizeCanvas() {
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
		}
		window.addEventListener('resize', resizeCanvas);
		resizeCanvas();

		function setupAudioContext() {
			if (isAudioContextSetup) return;
			
			try {
				const AudioContext = window.AudioContext || window.webkitAudioContext;
				audioCtx = new AudioContext();
				analyser = audioCtx.createAnalyser();
				
				// Connexion : AudioElement -> Analyser -> Speakers
				sourceNode = audioCtx.createMediaElementSource(audio);
				sourceNode.connect(analyser);
				analyser.connect(audioCtx.destination);
				
				// Configuration FFT pour le spectre
				// FFTSize 256 donne 128 bandes de fréquence.
				// À 44100Hz, chaque bande fait ~172Hz. Pour avoir des pas de ~500Hz, on regroupera visuellement.
				analyser.fftSize = 256; 
				
				isAudioContextSetup = true;
				drawVisualizer();
			} catch (e) {
				console.error("Erreur AudioContext (peut-être bloqué par le navigateur):", e);
			}
		}

		function drawVisualizer() {
			if (!isAudioContextSetup) return;

			requestAnimationFrame(drawVisualizer);

			const bufferLength = analyser.frequencyBinCount;
			const dataArray = new Uint8Array(bufferLength);
			analyser.getByteFrequencyData(dataArray);

			canvasCtx.fillStyle = 'rgb(0, 0, 0)';
			canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

			const barWidth = (canvas.width / bufferLength) * 2.5;
			let barHeight;
			let x = 0;

			for(let i = 0; i < bufferLength; i++) {
				barHeight = dataArray[i] / 2; // Échelle hauteur

				// Dégradé Vert Spotify vers Blanc
				canvasCtx.fillStyle = `rgb(${barHeight + 20}, ${255 - barHeight}, 84)`;
				canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

				x += barWidth + 1;
			}
		}

		// --- Track ---

		function getTrackName(url) {
			// Si c'est un objet File ou Blob avec propriété name
			if (url.name) return url.name;
			// Sinon on nettoie l'URL
			return decodeURIComponent(url.split('/').pop().split('.mp3')[0]);
		}

		function getTrackId(track) {
			if (typeof track === 'string') return track;
			return `local-${track.name}-${track.size}-${track.lastModified}`;
		}

		function getTrackSrc(track) {
			return typeof track === 'string'
				? track
				: URL.createObjectURL(track);
		}

		// --- Logique de lecture ---
		async function playTrack(index) {
			if (index < 0 || index >= playlist.length) return;

			// 1. ARRÊTER LA MUSIQUE PRÉCÉDENTE
			if (currentAudio) {
				currentAudio.pause();
				currentAudio.currentTime = 0;
			}

			currentIndex = index;
			const track = playlist[index];
			const id = getTrackId(track);
			const src = getTrackSrc(track);

			try {
				// 2. Importer et récupérer l'instance HTMLAudioElement
				currentAudio = await audioManager.importMusic(id, src);

				// 3. Setup AudioContext si premier lancement
				if (!isAudioContextSetup) {
					setupAudioContext(currentAudio);
				}

				// 4. Configurer les événements de la barre de progression sur le NOUVEL objet
				setupAudioEvents(currentAudio);

				// 5. Lecture
				await audioManager.playMusic(id);

				updateUIInfo();
				renderPlaylist();

			} catch (e) {
				console.error(`Erreur de lecture:`, e);
			}
		}

		function setupAudioEvents(audioElement) {
			// Mise à jour de la barre
			audioElement.ontimeupdate = () => {
				if (!isNaN(audioElement.duration)) {
					const $progress = $content.find('#progress-bar');
					$progress.attr('max', Math.floor(audioElement.duration));
					$progress.val(Math.floor(audioElement.currentTime));
					
					$content.find('#current-time').text(formatTime(audioElement.currentTime));
					$content.find('#duration').text(formatTime(audioElement.duration));
				}
			};

			// Fin de piste -> Suivant
			audioElement.onended = () => {
				let next = (currentIndex + 1) % playlist.length;
				playTrack(next);
			};
		}

		function updateUIInfo() {
			const name = getTrackName(playlist[currentIndex]);
			const $title = $content.find('#track-name');
			$title.text(name);
			$title.removeClass('animate');
			void $title[0].offsetWidth; 
			if ($title.width() > $content.find('.current-track-info').width()) {
				$title.addClass('animate');
			}
			$content.find('#play-btn').text('⏸');
		}

		function formatTime(seconds) {
			const m = Math.floor(seconds / 60);
			const s = Math.floor(seconds % 60);
			return `${m}:${s < 10 ? '0' : ''}${s}`;
		}

		function renderPlaylist() {
			const $pl = $content.find('#playlist');
			$pl.empty();
			playlist.forEach((track, index) => {
				const name = getTrackName(track);
				const isActive = index === currentIndex ? 'active' : '';
				const icon = index === currentIndex ? '🔊' : '🎵';
				const $el = $(`
					<div class="track-item ${isActive}" data-index="${index}">
						<span class="track-icon">${icon}</span>
						<span class="track-title">${name}</span>
					</div>
				`);
				$el.on('click', () => playTrack(index));
				$pl.append($el);
			});
		}

		function updateUIInfo() {
			const name = getTrackName(playlist[currentIndex]);
			const $title = $content.find('#track-name');
			$title.text(name);
			
			// Gestion Marquee : reset animation
			$title.removeClass('animate');
			// Force reflow
			void $title[0].offsetWidth; 
			
			// Vérifier si le texte dépasse le conteneur
			if ($title.width() > $content.find('.current-track-info').width()) {
				$title.addClass('animate');
			}

			$content.find('#play-btn').text('⏸');
		}



		// Charger playlist sauvegardée si existe
		const saved = localStorage.getItem(STORAGE_PLAYLIST_KEY);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				// On garde les musiques par défaut + celles sauvegardées
				// Filtrer les doublons simple
				const unique = new Set([...playlist, ...parsed]);
				playlist = Array.from(unique);
			} catch(e) { console.error("Erreur chargement playlist"); }
		}

		// --- Events Listeners ---

		// Play/Pause
		$content.find('#play-btn').on('click', async () => {
			if (!currentAudio) {
				if (playlist.length > 0) await playTrack(0);
				return;
			}

			if (currentAudio.paused) {
				await currentAudio.play();
				$content.find('#play-btn').text('⏸');
			} else {
				currentAudio.pause();
				$content.find('#play-btn').text('▶');
			}
		});

		// Next / Prev
		$content.find('#next-btn').on('click', () => {
			playTrack((currentIndex + 1) % playlist.length);
		});
		$content.find('#prev-btn').on('click', () => {
			let prev = currentIndex - 1;
			if (prev < 0) prev = playlist.length - 1;
			playTrack(prev);
		});

		// Seek Bar
		$content.find('#progress-bar').on('input', function() {
			if (currentAudio) {
				currentAudio.currentTime = this.value;
			}
		});

		// Ajout URL
		$content.find('#add-url-btn').on('click', () => {
			const url = $content.find('#url-input').val();
			if (url) {
				playlist.push(url);
				renderPlaylist();
				$content.find('#url-input').val('');
			}
		});

		// Ajout Fichier Local
		$content.find('#file-input').on('change', (e) => {
			const files = e.target.files;
			if (files.length > 0) {
				for (let i = 0; i < files.length; i++) {
					// On pousse l'objet File directement
					playlist.push(files[i]);
				}
				renderPlaylist();
			}
		});

		// Sauvegarde Playlist
		$content.find('#save-playlist-btn').on('click', () => {
			// On ne peut sauvegarder que les URLs (strings), pas les fichiers locaux (blobs)
			const toSave = playlist.filter(item => typeof item === 'string');
			localStorage.setItem(STORAGE_PLAYLIST_KEY, JSON.stringify(toSave));
			alert("Playlist sauvegardée ! (Les fichiers locaux ne sont pas persistants)");
		});

		// Audio Time Update
		audio.ontimeupdate = () => {
			if (!isNaN(audio.duration)) {
				const $progress = $content.find('#progress-bar');
				$progress.attr('max', Math.floor(audio.duration));
				$progress.val(Math.floor(audio.currentTime));
				
				$content.find('#current-time').text(formatTime(audio.currentTime));
				$content.find('#duration').text(formatTime(audio.duration));
			}
		};

		// Fin de piste
		audio.onended = () => {
			playTrack((currentIndex + 1) % playlist.length);
		};

		// Init initial
		renderPlaylist();

		// Helper Time
		function formatTime(seconds) {
			const m = Math.floor(seconds / 60);
			const s = Math.floor(seconds % 60);
			return `${m}:${s < 10 ? '0' : ''}${s}`;
		}

		// Exposer l'API
		return {
            pause: () => { if(currentAudio) currentAudio.pause(); },
            resume: () => { if(currentAudio) currentAudio.play(); },
            restart: () => { if(currentAudio) currentAudio.currentTime = 0; },
			quit: () => { if(currentAudio) { currentAudio.pause();  currentAudio.currentTime = 0; } },
        };
	}
};