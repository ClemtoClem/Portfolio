const STRINGS = {
	'en-US': {
		title: 'Weather Forecast',
		searchPlaceholder: 'Enter a city (e.g. New York)',
		searchTitle: 'Search',
		locateTitle: 'Locate me',
		prompt: 'Search for a city or use geolocation.',
		searching: 'Searching...',
		notFound: 'City not found.',
		network: 'Network error.',
		locating: 'Locating...',
		loading: 'Loading weather...',
		geoFailed: 'Geolocation failed.',
		apiError: 'API error.',
		forecast: '7-day forecast',
		myLocation: 'My location',
		addFav: 'Add to favorites',
		removeFav: 'Remove',
		weather: {
			clear: 'Clear sky',
			mostlyClear: 'Mostly clear',
			partlyCloudy: 'Partly cloudy',
			cloudy: 'Cloudy',
			fog: 'Fog',
			rain: 'Rain',
			snow: 'Snow',
			thunder: 'Thunderstorm',
			variable: 'Variable',
		},
	},
	'fr-FR': {
		title: 'Prévisions Météo',
		searchPlaceholder: 'Entrez une ville (ex: Paris)',
		searchTitle: 'Rechercher',
		locateTitle: 'Me localiser',
		prompt: 'Recherchez une ville ou utilisez la géolocalisation.',
		searching: 'Recherche en cours...',
		notFound: 'Ville non trouvée.',
		network: 'Erreur réseau.',
		locating: 'Localisation...',
		loading: 'Chargement météo...',
		geoFailed: 'Échec de la géolocalisation.',
		apiError: 'Erreur API.',
		forecast: 'Prévisions sur 7 jours',
		myLocation: 'Ma position',
		addFav: 'Ajouter aux favoris',
		removeFav: 'Retirer',
		weather: {
			clear: 'Ciel dégagé',
			mostlyClear: 'Plutôt ensoleillé',
			partlyCloudy: 'Partiellement nuageux',
			cloudy: 'Nuageux',
			fog: 'Brouillard',
			rain: 'Pluie',
			snow: 'Neige',
			thunder: 'Orages',
			variable: 'Variable',
		},
	},
};

const ICONS = {
	sun:        `<svg viewBox="0 0 16 16" fill="#f59e0b"><circle cx="8" cy="8" r="3.2"/><g stroke="#f59e0b" stroke-width="1.4" stroke-linecap="round"><line x1="8" y1="1" x2="8" y2="3"/><line x1="8" y1="13" x2="8" y2="15"/><line x1="1" y1="8" x2="3" y2="8"/><line x1="13" y1="8" x2="15" y2="8"/><line x1="3" y1="3" x2="4.5" y2="4.5"/><line x1="11.5" y1="11.5" x2="13" y2="13"/><line x1="3" y1="13" x2="4.5" y2="11.5"/><line x1="11.5" y1="4.5" x2="13" y2="3"/></g></svg>`,
	cloud:      `<svg viewBox="0 0 16 16" fill="#94a3b8"><path d="M11 6a3 3 0 0 0-5.6-1.3A2.5 2.5 0 0 0 3 9h8a2.5 2.5 0 0 0 0-5z"/></svg>`,
	cloudSun:   `<svg viewBox="0 0 16 16"><circle cx="5" cy="5" r="2" fill="#f59e0b"/><path d="M13 9a3 3 0 0 0-5.6-1.3A2.5 2.5 0 0 0 5 12h8a2.5 2.5 0 0 0 0-3z" fill="#94a3b8"/></svg>`,
	rain:       `<svg viewBox="0 0 16 16"><path d="M11 5a3 3 0 0 0-5.6-1.3A2.5 2.5 0 0 0 3 8h8a2.5 2.5 0 0 0 0-3z" fill="#94a3b8"/><g stroke="#3b82f6" stroke-width="1.2" stroke-linecap="round"><line x1="5" y1="10" x2="4" y2="13"/><line x1="8" y1="10" x2="7" y2="13"/><line x1="11" y1="10" x2="10" y2="13"/></g></svg>`,
	snow:       `<svg viewBox="0 0 16 16" fill="#60a5fa"><path d="M11 5a3 3 0 0 0-5.6-1.3A2.5 2.5 0 0 0 3 8h8a2.5 2.5 0 0 0 0-3z"/><text x="8" y="14" font-size="6" text-anchor="middle" fill="#60a5fa">❄</text></svg>`,
	thunder:    `<svg viewBox="0 0 16 16"><path d="M11 5a3 3 0 0 0-5.6-1.3A2.5 2.5 0 0 0 3 8h8a2.5 2.5 0 0 0 0-3z" fill="#94a3b8"/><polygon points="7,10 6,13 8,13 7,15.5 10,11.5 8,11.5 9,9" fill="#f59e0b"/></svg>`,
};

function getWeatherIcon(code, strings) {
	if (code === 0) return { icon: ICONS.sun, description: strings.weather.clear };
	if (code === 1) return { icon: ICONS.cloudSun, description: strings.weather.mostlyClear };
	if (code === 2) return { icon: ICONS.cloudSun, description: strings.weather.partlyCloudy };
	if (code === 3) return { icon: ICONS.cloud, description: strings.weather.cloudy };
	if (code >= 45 && code <= 48) return { icon: ICONS.cloud, description: strings.weather.fog };
	if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return { icon: ICONS.rain, description: strings.weather.rain };
	if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return { icon: ICONS.snow, description: strings.weather.snow };
	if (code >= 95 && code <= 99) return { icon: ICONS.thunder, description: strings.weather.thunder };
	return { icon: ICONS.cloud, description: strings.weather.variable };
}

function html(s) {
	return `
		<div class="weather-app">
			<h1>${s.title}</h1>
			<div class="weather-search-bar">
				<input type="text" id="weather-input" placeholder="${s.searchPlaceholder}" autocomplete="off">
				<div id="weather-suggestions"></div>
				<button id="weather-geoloc-btn" title="${s.locateTitle}">
					<svg viewBox="0 0 24 24"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
				</button>
				<button id="weather-search-btn" title="${s.searchTitle}">
					<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
				</button>
			</div>
			<div id="weather-favorites"></div>
			<div id="weather-message"><p>${s.prompt}</p></div>
			<div id="weather-results" hidden>
				<div id="weather-current">
					<div class="weather-header-group">
						<h4 id="weather-city-name"></h4>
						<button id="weather-fav-btn" title="${s.addFav}">
							<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
						</button>
					</div>
					<div class="current-details">
						<div id="weather-current-icon"></div>
						<div id="weather-current-temp"></div>
						<div id="weather-current-desc"></div>
					</div>
				</div>
				<h5>${s.forecast}</h5>
				<div id="weather-forecast"></div>
			</div>
		</div>
	`;
}

export const weatherApp = {
	id: 'app-weather',
	title: { 'en-US': 'Weather', 'fr-FR': 'Météo' },
	version: '2.0.0',
	icon: `<svg viewBox="0 0 24 24"><path d="M19 18a4 4 0 1 0 0-8 6 6 0 0 0-11.6-2 4 4 0 0 0-.4 7.96Z" fill="#FFC107" stroke="#0d47a1" stroke-width="1.5"/></svg>`,
	iconColor: '#2196F3',
	headerColor: '#2196F3',
	type: 'app',
	style: `
		.weather-app { display: flex; flex-direction: column; gap: 15px; }
		.weather-search-bar { display: flex; width: 100%; gap: 8px; position: relative; }
		.weather-search-bar input { flex-grow: 1; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 1em; }
		.weather-search-bar button {
			flex-shrink: 0; width: 50px; border: none;
			background-color: var(--accent-color); color: white; border-radius: 8px;
			cursor: pointer; display: flex; justify-content: center; align-items: center;
		}
		.weather-search-bar button:hover { filter: brightness(0.9); }
		.weather-search-bar button#weather-geoloc-btn { background-color: #616161; }
		.weather-search-bar button svg { width: 24px; height: 24px; fill: white; }
		#weather-suggestions {
			position: absolute; top: 100%; left: 0; right: 58px;
			background: white; border: 1px solid #ddd; border-top: none;
			border-radius: 0 0 8px 8px; z-index: 1000;
			box-shadow: 0 4px 6px rgba(0,0,0,0.1);
			max-height: 200px; overflow-y: auto; display: none;
		}
		.weather-suggestion {
			padding: 10px 12px; cursor: pointer; border-bottom: 1px solid #eee;
			font-size: 0.95em; text-align: left;
		}
		.weather-suggestion:hover { background-color: #f5f5f5; }
		.weather-suggestion .sub-info { font-size: 0.8em; color: #777; margin-left: 5px; }
		#weather-favorites { display: flex; flex-wrap: wrap; gap: 8px; }
		.weather-fav-chip {
			background: #f1f1f1; padding: 5px 10px; border-radius: 16px;
			font-size: 0.85em; cursor: pointer; display: flex; align-items: center; gap: 6px;
			border: 1px solid #e0e0e0;
		}
		.weather-fav-chip:hover { background: #e0e0e0; }
		.weather-fav-chip .remove-fav { color: #999; font-weight: bold; }
		.weather-fav-chip .remove-fav:hover { color: #d32f2f; }
		#weather-message { text-align: center; color: #616161; padding: 20px 0; }
		#weather-current {
			background: #fff; border-radius: 12px; padding: 20px;
			box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: center;
		}
		.weather-header-group { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 15px; }
		#weather-fav-btn {
			background: none; border: none; cursor: pointer; padding: 4px;
			color: #ccc; transition: color 0.2s;
		}
		#weather-fav-btn.is-active { color: #FFC107; }
		#weather-fav-btn svg { width: 24px; height: 24px; fill: currentColor; }
		.current-details { display: flex; flex-direction: column; align-items: center; gap: 5px; }
		#weather-current-icon svg { width: 80px; height: 80px; }
		#weather-current-temp { font-size: 3.5em; font-weight: 300; line-height: 1.1; }
		#weather-current-desc { font-size: 1.1em; color: #616161; }
		#weather-results h5 { font-size: 1em; font-weight: 500; color: #616161; margin: 15px 0 10px; }
		#weather-forecast {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
			gap: 10px;
		}
		@media (max-width: 400px) { #weather-forecast { grid-template-columns: repeat(3, 1fr); } }
		.weather-day {
			background: #fff; border-radius: 12px; padding: 10px 5px;
			box-shadow: 0 2px 8px rgba(0,0,0,0.05);
			display: flex; flex-direction: column; align-items: center; gap: 8px;
		}
		.weather-day .day-name { font-weight: 500; font-size: 0.9em; text-transform: capitalize; }
		.weather-day .day-icon svg { width: 40px; height: 40px; }
		.weather-day .day-temp { display: flex; gap: 8px; font-size: 0.95em; }
		.weather-day .day-temp-max { font-weight: 500; }
		.weather-day .day-temp-min { color: #757575; }
	`,
	content: { 'en-US': html(STRINGS['en-US']), 'fr-FR': html(STRINGS['fr-FR']) },

	onMount(ctx) {
		const strings = STRINGS[ctx.lang] || STRINGS['fr-FR'];
		const FAVS_KEY = 'favorites';

		const input        = ctx.$('#weather-input');
		const suggestions  = ctx.$('#weather-suggestions');
		const searchBtn    = ctx.$('#weather-search-btn');
		const geolocBtn    = ctx.$('#weather-geoloc-btn');
		const messageEl    = ctx.$('#weather-message');
		const resultsEl    = ctx.$('#weather-results');
		const favoritesEl  = ctx.$('#weather-favorites');
		const cityNameEl   = ctx.$('#weather-city-name');
		const favBtn       = ctx.$('#weather-fav-btn');
		const iconEl       = ctx.$('#weather-current-icon');
		const tempEl       = ctx.$('#weather-current-temp');
		const descEl       = ctx.$('#weather-current-desc');
		const forecastEl   = ctx.$('#weather-forecast');

		let currentCity = null; // { name, lat, lon }
		let debounce;

		const langCode = ctx.lang === 'en-US' ? 'en' : 'fr';

		const getFavs    = () => ctx.storage.get(FAVS_KEY, []);
		const isFav      = (name) => getFavs().some(f => f.name === name);
		const saveFav    = (city) => {
			const favs = getFavs();
			if (favs.some(f => f.name === city.name)) return;
			favs.push(city);
			ctx.storage.set(FAVS_KEY, favs);
			renderFavorites();
		};
		const removeFav  = (name) => {
			ctx.storage.set(FAVS_KEY, getFavs().filter(f => f.name !== name));
			renderFavorites();
			if (currentCity?.name === name) updateFavIcon(false);
		};

		function renderFavorites() {
			favoritesEl.innerHTML = '';
			for (const city of getFavs()) {
				const chip = document.createElement('div');
				chip.className = 'weather-fav-chip';
				chip.innerHTML = `<span class="city-label">${city.name}</span><span class="remove-fav" title="${strings.removeFav}">×</span>`;
				ctx.scope.on(chip.querySelector('.city-label'), 'click', () => fetchWeather(city.lat, city.lon, city.name));
				ctx.scope.on(chip.querySelector('.remove-fav'), 'click', (e) => { e.stopPropagation(); removeFav(city.name); });
				favoritesEl.appendChild(chip);
			}
		}

		function updateFavIcon(isSaved) {
			favBtn.classList.toggle('is-active', isSaved);
		}

		function setLoading(msg) {
			messageEl.innerHTML = `<p>${msg}</p>`;
			messageEl.hidden = false;
			resultsEl.hidden = true;
		}

		function setError(msg) {
			messageEl.innerHTML = `<p style="color:#d32f2f;">${msg}</p>`;
			messageEl.hidden = false;
			resultsEl.hidden = true;
		}

		async function geocode(query) {
			const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=${langCode}`;
			const r = await fetch(url);
			return r.json();
		}

		async function reverseGeocode(lat, lon) {
			try {
				const r = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=${langCode}`);
				const data = await r.json();
				if (data.name) return data.country ? `${data.name}, ${data.country}` : data.name;
			} catch (_) {}
			return strings.myLocation;
		}

		async function handleInputSuggestions(q) {
			q = q.trim();
			if (q.length < 2) { suggestions.style.display = 'none'; return; }
			try {
				const data = await geocode(q);
				if (!data.results?.length) { suggestions.style.display = 'none'; return; }
				renderSuggestions(data.results);
			} catch (_) { /* ignore */ }
		}

		function renderSuggestions(locations) {
			suggestions.innerHTML = '';
			for (const loc of locations) {
				const item = document.createElement('div');
				item.className = 'weather-suggestion';
				const country = loc.country ? `, ${loc.country}` : '';
				const admin = loc.admin1 ? ` <span class="sub-info">(${loc.admin1})</span>` : '';
				item.innerHTML = `<strong>${loc.name}</strong>${country}${admin}`;
				ctx.scope.on(item, 'click', () => {
					const displayName = loc.country ? `${loc.name}, ${loc.country}` : loc.name;
					input.value = displayName;
					suggestions.style.display = 'none';
					fetchWeather(loc.latitude, loc.longitude, displayName);
				});
				suggestions.appendChild(item);
			}
			suggestions.style.display = 'block';
		}

		async function handleSearch() {
			const city = input.value.trim();
			if (!city) return;
			setLoading(strings.searching);
			try {
				const data = await geocode(city);
				if (!data.results?.length) { setError(strings.notFound); return; }
				const loc = data.results[0];
				const displayName = loc.country ? `${loc.name}, ${loc.country}` : loc.name;
				await fetchWeather(loc.latitude, loc.longitude, displayName);
			} catch (e) {
				console.error(e);
				setError(strings.network);
			}
		}

		function handleGeolocation() {
			if (!navigator.geolocation) return;
			setLoading(strings.locating);
			navigator.geolocation.getCurrentPosition(
				async (pos) => {
					const { latitude, longitude } = pos.coords;
					const name = await reverseGeocode(latitude, longitude);
					await fetchWeather(latitude, longitude, name);
				},
				() => setError(strings.geoFailed),
			);
		}

		async function fetchWeather(lat, lon, displayName) {
			setLoading(strings.loading);
			currentCity = { name: displayName, lat, lon };
			try {
				const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&current_weather=true`);
				const data = await r.json();
				if (!data.daily) throw new Error('No data');
				displayCurrent(displayName, data.current_weather);
				displayForecast(data.daily);
				updateFavIcon(isFav(displayName));
				messageEl.hidden = true;
				resultsEl.hidden = false;
			} catch (_) {
				setError(strings.apiError);
			}
		}

		function displayCurrent(name, current) {
			cityNameEl.textContent = name;
			tempEl.textContent = `${Math.round(current.temperature)}°C`;
			const { icon, description } = getWeatherIcon(current.weathercode, strings);
			iconEl.innerHTML = icon;
			descEl.textContent = description;
		}

		function displayForecast(daily) {
			forecastEl.innerHTML = '';
			for (let i = 0; i < daily.time.length; i++) {
				const dayName = new Date(daily.time[i]).toLocaleDateString(ctx.lang, { weekday: 'short' });
				const max = Math.round(daily.temperature_2m_max[i]);
				const min = Math.round(daily.temperature_2m_min[i]);
				const { icon, description } = getWeatherIcon(daily.weathercode[i], strings);
				const card = document.createElement('div');
				card.className = 'weather-day';
				card.innerHTML = `
					<div class="day-name">${dayName}</div>
					<div class="day-icon" title="${description}">${icon}</div>
					<div class="day-temp">
						<span class="day-temp-max">${max}°</span>
						<span class="day-temp-min">${min}°</span>
					</div>`;
				forecastEl.appendChild(card);
			}
		}

		// Wire events
		ctx.scope.on(searchBtn, 'click', handleSearch);
		ctx.scope.on(geolocBtn, 'click', handleGeolocation);
		ctx.scope.on(favBtn, 'click', () => {
			if (!currentCity) return;
			if (isFav(currentCity.name)) { removeFav(currentCity.name); updateFavIcon(false); }
			else { saveFav(currentCity); updateFavIcon(true); }
		});
		ctx.scope.on(input, 'input', (e) => {
			clearTimeout(debounce);
			debounce = ctx.scope.setTimeout(() => handleInputSuggestions(e.target.value), 300);
		});
		ctx.scope.on(input, 'keypress', (e) => {
			if (e.key === 'Enter') {
				clearTimeout(debounce);
				suggestions.style.display = 'none';
				handleSearch();
			}
		});
		ctx.scope.on(document, 'click', (e) => {
			if (!input.contains(e.target) && !suggestions.contains(e.target)) suggestions.style.display = 'none';
		});

		renderFavorites();
	}
};
