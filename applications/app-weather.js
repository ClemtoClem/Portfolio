export const weatherApp = {
	id: 'app-weather',
	title: {'en-US':'Weather', 'fr-FR':'Météo'},
	version: '1.0.0',
	icon: `<svg viewBox="0 0 1024 1024" fill="#000000"><path d="M621.7 451.6m-129.5 0a129.5 129.5 0 1 0 259 0 129.5 129.5 0 1 0-259 0Z" fill="#F4CE26"></path><path d="M621.7 607.4c-85.9 0-155.8-69.9-155.8-155.8s69.9-155.8 155.8-155.8 155.8 69.9 155.8 155.8S707.6 607.4 621.7 607.4z m0-258.9c-56.8 0-103.1 46.2-103.1 103.1s46.3 103.1 103.1 103.1 103-46.3 103-103.2-46.2-103-103-103z" fill="#000000"></path><path d="M502.1 198c11.8-6.8 26.9-2.8 33.7 9l24.7 42.7c6.8 11.8 2.8 26.9-9 33.7-11.8 6.8-26.9 2.8-33.7-9l-24.7-42.7c-6.9-11.9-2.8-26.9 9-33.7zM807.8 406.4c3.5 13.2 17 21 30.2 17.4l47.6-12.8c13.2-3.5 21-17 17.4-30.2-3.5-13.2-17-21-30.2-17.4l-47.6 12.8c-13.1 3.5-20.9 17-17.4 30.2zM794.6 517.3c-3.5 13.2 4.3 26.7 17.4 30.2l47.6 12.8c13.2 3.5 26.7-4.3 30.2-17.4 3.5-13.2-4.3-26.7-17.4-30.2l-47.6-12.8c-13.1-3.5-26.6 4.3-30.2 17.4zM665.7 161.8c13.6 0 24.7 11 24.7 24.7v49.3c0 13.6-11 24.7-24.7 24.7-13.6 0-24.7-11-24.7-24.7v-49.3c0-13.6 11-24.7 24.7-24.7zM832.8 231.3c-9.6-9.6-25.2-9.6-34.9 0L763 266.2c-9.6 9.6-9.6 25.2 0 34.9 9.6 9.6 25.2 9.6 34.9 0l34.9-34.9c9.7-9.7 9.7-25.3 0-34.9z" fill="#000000"></path><path d="M264.5 740.8c-2.2 0.2-4.3 0.4-6.5 0.5-60.5 3.4-111-49.7-111-111s49.7-111 111-111c4.2 0 8.4 0.2 12.5 0.7-0.1-2.3-0.1-4.6-0.1-6.9 0-85.1 69-154.1 154.1-154.1 75.2 0 137.8 53.8 151.4 125 6.9-1.1 14-1.7 21.2-1.7 71.5 0 129.5 58 129.5 129.5-0.2 45.7-23.8 85.9-59.6 108.9-20.2 13-44.2 21.3-70 20.5-3.5-0.1-6.9-0.3-10.3-0.7-1.1 0.1-2.3 0.1-3.4 0.1H264.5z" fill="#FFFFFF"></path><path d="M252.4 767.8c-32.4 0-63.3-12.5-87.9-35.8-27.9-26.4-43.9-63.5-43.9-101.7 0-71.3 54.7-130.2 124.3-136.7 9.8-90.3 86.5-160.9 179.4-160.9 78.4 0 147 50.6 171.2 123.3h1.4c86 0 155.9 69.9 155.9 155.8 0 53.3-26.7 102.3-71.5 131.1-26.5 17.1-56.1 25.6-85.1 24.7-3.4-0.1-6.7-0.3-10-0.6-1 0-2 0.1-3 0.1H265.8c-2.1 0.2-4.2 0.4-6.3 0.5-2.4 0.1-4.7 0.2-7.1 0.2z m5.5-222.1c-46.6 0-84.6 38-84.6 84.6 0 23.8 10 46.9 27.4 63.4 15.7 14.9 35.7 22.5 55.7 21.2 1.7-0.1 3.5-0.2 5.2-0.4l2.8-0.2h324.9c2.8 0.3 5.6 0.5 8.4 0.6 23.2 0.8 42.8-8.5 54.9-16.4 29.8-19 47.5-51.4 47.5-86.7 0-56.8-46.3-103.1-103.1-103.1-5.7 0-11.4 0.5-16.9 1.4l-25.4 4.2-4.8-25.3c-11.5-60-64.2-103.6-125.5-103.6-70.5 0-127.8 57.3-127.8 127.8 0 1.9 0 3.8 0.1 5.7l1.4 30.9-30.7-3.5c-3.1-0.4-6.2-0.6-9.5-0.6z" fill="#000000" /></svg>`,
	iconColor: '#2196F3',
	headerColor: '#2196F3',
	type: 'app',
	style: `
		.weather-app-container { display: flex; flex-direction: column; gap: 15px; }
		.weather-search-bar { display: flex; width: 100%; gap: 8px; position: relative; } /* Position relative pour ancrer les suggestions */
		.weather-search-bar input { flex-grow: 1; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 1em; font-family: 'Roboto', sans-serif; }
		.weather-search-bar button {
			flex-shrink: 0; width: 50px; border: none;
			background-color: var(--accent-color); color: white; border-radius: 8px;
			cursor: pointer; display: flex; justify-content: center; align-items: center;
			transition: background-color 0.2s;
		}
		.weather-search-bar button:hover { background-color: #1e88e5; }
		.weather-search-bar button#weather-geoloc-btn { background-color: #616161; }
		.weather-search-bar button#weather-geoloc-btn:hover { background-color: #424242; }
		.weather-search-bar button svg { width: 24px; height: 24px; fill: white; }
		
		/* Styles des suggestions */
		#weather-suggestions {
			position: absolute; top: 100%; left: 0; right: 58px; /* Laisse place aux boutons si besoin, ou right:0 */
			background: white; border: 1px solid #ddd; border-top: none;
			border-radius: 0 0 8px 8px; z-index: 1000;
			box-shadow: 0 4px 6px rgba(0,0,0,0.1);
			max-height: 200px; overflow-y: auto; display: none;
		}
		.weather-suggestion-item {
			padding: 10px 12px; cursor: pointer; border-bottom: 1px solid #eee;
			font-size: 0.95em; color: #333; text-align: left;
		}
		.weather-suggestion-item:last-child { border-bottom: none; }
		.weather-suggestion-item:hover { background-color: #f5f5f5; }
		.weather-suggestion-item .sub-info { font-size: 0.8em; color: #777; margin-left: 5px; }

		#weather-favorites-list { display: flex; flex-wrap: wrap; gap: 8px; padding-bottom: 5px; }
		.weather-fav-chip {
			background: #f1f1f1; color: #333; padding: 5px 10px; border-radius: 16px;
			font-size: 0.85em; cursor: pointer; display: flex; align-items: center; gap: 6px;
			transition: background 0.2s; border: 1px solid #e0e0e0;
		}
		.weather-fav-chip:hover { background: #e0e0e0; }
		.weather-fav-chip .remove-fav { color: #999; font-weight: bold; font-size: 1.1em; line-height: 0.8; }
		.weather-fav-chip .remove-fav:hover { color: #d32f2f; }

		#weather-message-display { text-align: center; color: #616161; font-size: 1.1em; padding: 20px 0; }
		#weather-current-conditions { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: center; position: relative; }
		
		.weather-header-group { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 15px; }
		#weather-current-conditions h4 { margin: 0; color: var(--text-color); font-size: 1.2em; }
		
		#weather-fav-toggle-btn { 
			background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center;
			color: #ccc; transition: color 0.2s;
		}
		#weather-fav-toggle-btn.is-active { color: #FFC107; }
		#weather-fav-toggle-btn svg { width: 24px; height: 24px; fill: currentColor; }

		.current-details { display: flex; flex-direction: column; align-items: center; gap: 5px; }
		#weather-current-icon svg { width: 80px; height: 80px; }
		#weather-current-temp { font-size: 3.5em; font-weight: 300; color: var(--text-color); line-height: 1.1; }
		#weather-current-desc { font-size: 1.1em; color: #616161; }
		#weather-results-container h5 { font-size: 1em; font-weight: 500; color: #616161; margin: 15px 0 10px; padding-left: 5px; }
		#weather-forecast-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 10px; }
		@media (max-width: 400px) { #weather-forecast-grid { grid-template-columns: repeat(3, 1fr); } }
		.weather-day-card { background: #fff; border-radius: 12px; padding: 10px 5px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; flex-direction: column; align-items: center; gap: 8px; }
		.weather-day-card .day-name { font-weight: 500; font-size: 0.9em; text-transform: capitalize; }
		.weather-day-card .day-icon svg { width: 40px; height: 40px; }
		.weather-day-card .day-temp { display: flex; gap: 8px; font-size: 0.95em; }
		.weather-day-card .day-temp-max { font-weight: 500; color: var(--text-color); }
		.weather-day-card .day-temp-min { color: #757575; }
		`,
	content: {
		'en-US': `
			<div class="app-content weather-app-container">
				<h1>Weather Forecast</h1>
				
				<div class="weather-search-bar">
					<input type="text" id="weather-city-input" placeholder="Enter a city (e.g. New York)" autocomplete="off">
					<div id="weather-suggestions"></div>
					<button id="weather-geoloc-btn" title="Locate me">
						<svg viewBox="0 0 24 24"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
					</button>
					<button id="weather-search-btn" title="Search">
						<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
					</button>
				</div>
				
				<div id="weather-favorites-list"></div>

				<div id="weather-message-display">
					<p>Search for a city or use geolocation.</p>
				</div>
				
				<div id="weather-results-container" style="display: none;">
					<div id="weather-current-conditions">
						<div class="weather-header-group">
							<h4 id="weather-city-name"></h4>
							<button id="weather-fav-toggle-btn" title="Add to favorites">
								<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
							</button>
						</div>
						<div class="current-details">
							<div id="weather-current-icon"></div>
							<div id="weather-current-temp"></div>
							<div id="weather-current-desc"></div>
						</div>
					</div>
					
					<h5>7-day forecast</h5>
					<div id="weather-forecast-grid"></div>
				</div>
			</div>
		`,
		'fr-FR': `
			<div class="app-content weather-app-container">
				<h1>Prévisions Météo</h1>
				
				<div class="weather-search-bar">
					<input type="text" id="weather-city-input" placeholder="Entrez une ville (ex: Paris)" autocomplete="off">
					<div id="weather-suggestions"></div> <button id="weather-geoloc-btn" title="Me localiser">
						<svg viewBox="0 0 24 24"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
					</button>
					<button id="weather-search-btn" title="Rechercher">
						<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
					</button>
				</div>

				<div id="weather-favorites-list"></div>
				
				<div id="weather-message-display">
					<p>Recherchez une ville ou utilisez la géolocalisation.</p>
				</div>
				
				<div id="weather-results-container" style="display: none;">
					<div id="weather-current-conditions">
						<div class="weather-header-group">
							<h4 id="weather-city-name"></h4>
							<button id="weather-fav-toggle-btn" title="Ajouter aux favoris">
								<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
							</button>
						</div>
						<div class="current-details">
							<div id="weather-current-icon"></div>
							<div id="weather-current-temp"></div>
							<div id="weather-current-desc"></div>
						</div>
					</div>
					
					<h5>Prévisions sur 7 jours</h5>
					<div id="weather-forecast-grid"></div>
				</div>
			</div>
		`
	},
	/**
	 * Init function
	 */
	init: function (sys, windowId) {
		const system = sys;
		const $window = $(`#${windowId}`);
		const STORAGE_KEY = this.id;

		// Elements DOM
		const searchInput = $window.find('#weather-city-input')[0];
		const suggestionsEl = $window.find('#weather-suggestions')[0]; // Nouveau container
		const searchBtn = $window.find('#weather-search-btn')[0];
		const geolocBtn = $window.find('#weather-geoloc-btn')[0];
		const messageDisplay = $window.find('#weather-message-display')[0];
		const resultsContainer = $window.find('#weather-results-container')[0];
		const favoritesListEl = $window.find('#weather-favorites-list')[0];
		
		const cityNameEl = $window.find('#weather-city-name')[0];
		const favToggleBtn = $window.find('#weather-fav-toggle-btn')[0];
		const currentIconEl = $window.find('#weather-current-icon')[0];
		const currentTempEl = $window.find('#weather-current-temp')[0];
		const currentDescEl = $window.find('#weather-current-desc')[0];
		const forecastGridEl = $window.find('#weather-forecast-grid')[0];

		// État actuel
		let currentCityData = null; // { name, lat, lon }
		let debounceTimer;

		// --- Écouteurs ---
		searchBtn.addEventListener('click', () => handleCitySearch());
		geolocBtn.addEventListener('click', handleGeolocation);
		favToggleBtn.addEventListener('click', toggleCurrentFavorite);
		
		// Input pour l'autocomplétion
		searchInput.addEventListener('input', (e) => {
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => handleInputSuggestions(e.target.value), 300);
		});
		
		searchInput.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') {
				clearTimeout(debounceTimer);
				suggestionsEl.style.display = 'none';
				handleCitySearch();
			}
		});

		// Fermer les suggestions si on clique ailleurs
		document.addEventListener('click', (e) => {
			if (!searchInput.contains(e.target) && !suggestionsEl.contains(e.target)) {
				suggestionsEl.style.display = 'none';
			}
		});

		// Initialisation
		renderFavorites();

		// --- Logique Autocomplétion ---

		async function handleInputSuggestions(query) {
			const q = query.trim();
			if (q.length < 2) {
				suggestionsEl.style.display = 'none';
				return;
			}

			try {
				// count=5 pour avoir plusieurs choix
				const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=fr`);
				const data = await response.json();

				if (!data.results || data.results.length === 0) {
					suggestionsEl.style.display = 'none';
					return;
				}

				renderSuggestions(data.results);
			} catch (err) {
				console.error("Erreur suggestion:", err);
			}
		}

		function renderSuggestions(locations) {
			suggestionsEl.innerHTML = '';
			locations.forEach(loc => {
				const div = document.createElement('div');
				div.className = 'weather-suggestion-item';
				const country = loc.country ? `, ${loc.country}` : '';
				const admin1 = loc.admin1 ? ` <span class="sub-info">(${loc.admin1})</span>` : '';
				div.innerHTML = `<strong>${loc.name}</strong>${country}${admin1}`;
				
				div.addEventListener('click', () => {
					// Sélection de la ville
					const displayName = loc.country ? `${loc.name}, ${loc.country}` : loc.name;
					searchInput.value = displayName; // Met à jour l'input
					suggestionsEl.style.display = 'none'; // Cache la liste
					fetchWeather(loc.latitude, loc.longitude, displayName); // Lance la météo
				});

				suggestionsEl.appendChild(div);
			});
			suggestionsEl.style.display = 'block';
		}

		// --- Logique de Stockage (Favoris) ---

		function getFavorites() {
			try {
				const stored = localStorage.getItem(STORAGE_KEY);
				return stored ? JSON.parse(stored) : [];
			} catch (e) { return []; }
		}

		function saveFavorite(cityObj) {
			const favs = getFavorites();
			if (!favs.some(f => f.name === cityObj.name)) {
				favs.push(cityObj);
				localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
				renderFavorites();
			}
		}

		function removeFavorite(cityName) {
			let favs = getFavorites();
			favs = favs.filter(f => f.name !== cityName);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
			renderFavorites();
			if (currentCityData && currentCityData.name === cityName) {
				updateFavoriteIcon(false);
			}
		}

		function isFavorite(cityName) {
			return getFavorites().some(f => f.name === cityName);
		}

		function toggleCurrentFavorite() {
			if (!currentCityData) return;
			
			if (isFavorite(currentCityData.name)) {
				removeFavorite(currentCityData.name);
				updateFavoriteIcon(false);
			} else {
				saveFavorite(currentCityData);
				updateFavoriteIcon(true);
			}
		}

		function updateFavoriteIcon(isSaved) {
			if (isSaved) {
				favToggleBtn.classList.add('is-active');
			} else {
				favToggleBtn.classList.remove('is-active');
			}
		}

		function renderFavorites() {
			favoritesListEl.innerHTML = '';
			const favs = getFavorites();
			
			if (favs.length === 0) return;

			favs.forEach(city => {
				const chip = document.createElement('div');
				chip.className = 'weather-fav-chip';
				chip.innerHTML = `
					<span class="city-label">${city.name}</span>
					<span class="remove-fav" title="Remove">&times;</span>
				`;
				chip.querySelector('.city-label').addEventListener('click', () => {
					fetchWeather(city.lat, city.lon, city.name);
				});
				chip.querySelector('.remove-fav').addEventListener('click', (e) => {
					e.stopPropagation();
					removeFavorite(city.name);
				});
				favoritesListEl.appendChild(chip);
			});
		}

		// --- Logique Météo ---

		async function handleCitySearch() {
			const cityName = searchInput.value.trim();
			if (!cityName) return;
			
			const msg = system.settings.language === 'en-US' ? 'Searching...' : 'Recherche en cours...';
			setLoadingState(msg);
			
			try {
				const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=fr`);
				const geoData = await geoResponse.json();
				
				if (!geoData.results || geoData.results.length === 0) {
					const errMsg = system.settings.language === 'en-US' ? "City not found." : "Ville non trouvée.";
					setErrorMessage(errMsg);
					return;
				}
				
				const location = geoData.results[0];
				const displayName = location.country ? `${location.name}, ${location.country}` : location.name;
				
				await fetchWeather(location.latitude, location.longitude, displayName);

			} catch (error) {
				console.error(error);
				setErrorMessage(system.settings.language === 'en-US' ? "Network error." : "Erreur réseau.");
			}
		}

		function handleGeolocation() {
			if (!navigator.geolocation) return;

			setLoadingState(system.settings.language === 'en-US' ? "Locating..." : "Localisation...");

			navigator.geolocation.getCurrentPosition(
				async (position) => {
					const { latitude, longitude } = position.coords;
					try {
						const displayName = await reverseGeocode(latitude, longitude);
						await fetchWeather(latitude, longitude, displayName);
					} catch (error) {
						await fetchWeather(latitude, longitude, "Ma Position");
					}
				},
				(error) => {
					setErrorMessage(system.settings.language === 'en-US' ? "Geolocation failed." : "Échec de la géolocalisation.");
				}
			);
		}
		
		async function fetchWeather(latitude, longitude, displayName) {
			setLoadingState(system.settings.language === 'en-US' ? "Loading weather..." : "Chargement météo...");
			
			currentCityData = { name: displayName, lat: latitude, lon: longitude };

			try {
				const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&current_weather=true`);
				const weatherData = await weatherResponse.json();

				if (!weatherData.daily) throw new Error("No data");

				displayCurrentWeather(displayName, weatherData.current_weather);
				displayForecast(weatherData.daily);
				updateFavoriteIcon(isFavorite(displayName));
				
				messageDisplay.style.display = 'none';
				resultsContainer.style.display = 'block';
			} catch(e) {
				setErrorMessage("API Error");
			}
		}
		
		async function reverseGeocode(lat, lon) {
			 const response = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&current_weather=false&language=fr`);
			 const data = await response.json();
			 if (data.name) {
				 return data.country ? `${data.name}, ${data.country}` : data.name;
			 }
			 return "Position inconnue";
		}

		// --- Affichage ---
		
		function setLoadingState(message) {
			messageDisplay.innerHTML = `<p>${message}</p>`;
			messageDisplay.style.display = 'block';
			resultsContainer.style.display = 'none';
		}

		function setErrorMessage(message) {
			messageDisplay.innerHTML = `<p style="color: #d32f2f;">${message}</p>`;
			messageDisplay.style.display = 'block';
			resultsContainer.style.display = 'none';
		}

		function displayCurrentWeather(name, current) {
			cityNameEl.textContent = name;
			currentTempEl.textContent = `${Math.round(current.temperature)}°C`;
			const { icon, description } = getWeatherIconAndDesc(current.weathercode);
			currentIconEl.innerHTML = icon;
			currentDescEl.textContent = description;
		}

		function displayForecast(daily) {
			forecastGridEl.innerHTML = '';
			for (let i = 0; i < daily.time.length; i++) {
				const dateStr = daily.time[i];
				const dayName = new Date(dateStr).toLocaleDateString(system.settings.language, { weekday: 'short' });
				const maxTemp = Math.round(daily.temperature_2m_max[i]);
				const minTemp = Math.round(daily.temperature_2m_min[i]);
				const code = daily.weathercode[i];
				const { icon, description } = getWeatherIconAndDesc(code);
				
				const card = document.createElement('div');
				card.className = 'weather-day-card';
				card.innerHTML = `
					<div class="day-name">${dayName}</div>
					<div class="day-icon" title="${description}">${icon}</div>
					<div class="day-temp">
						<span class="day-temp-max">${maxTemp}°</span>
						<span class="day-temp-min">${minTemp}°</span>
					</div>
				`;
				forecastGridEl.appendChild(card);
			}
		}

		function getWeatherIconAndDesc(code) {
			const ICONS = {
				sun: `<svg viewBox="0 0 16 16" fill="#f59e0b"><path d="m 7.5 0 c -0.277344 0 -0.5 0.222656 -0.5 0.5 v 2 c 0 0.277344 0.222656 0.5 0.5 0.5 h 1 c 0.277344 0 0.5 -0.222656 0.5 -0.5 v -2 c 0 -0.277344 -0.222656 -0.5 -0.5 -0.5 z m -4.449219 1.84375 c -0.128906 0 -0.253906 0.046875 -0.351562 0.144531 l -0.710938 0.710938 c -0.195312 0.195312 -0.195312 0.507812 0 0.707031 l 1.417969 1.414062 c 0.195312 0.195313 0.507812 0.195313 0.707031 0 l 0.707031 -0.707031 c 0.195313 -0.199219 0.195313 -0.511719 0 -0.707031 l -1.414062 -1.417969 c -0.101562 -0.097656 -0.226562 -0.144531 -0.355469 -0.144531 z m 9.898438 0 c -0.128907 0 -0.253907 0.046875 -0.355469 0.144531 l -1.414062 1.417969 c -0.195313 0.195312 -0.195313 0.507812 0 0.707031 l 0.707031 0.707031 c 0.199219 0.195313 0.511719 0.195313 0.707031 0 l 1.417969 -1.414062 c 0.195312 -0.199219 0.195312 -0.511719 0 -0.707031 l -0.710938 -0.710938 c -0.097656 -0.097656 -0.222656 -0.144531 -0.351562 -0.144531 z m -4.949219 2.164062 c -2.195312 0 -4 1.804688 -4 4 c 0 2.191407 1.804688 4 4 4 s 4 -1.808593 4 -4 c 0 -2.195312 -1.804688 -4 -4 -4 z m -7.5 2.992188 c -0.277344 0 -0.5 0.222656 -0.5 0.5 v 1 c 0 0.277344 0.222656 0.5 0.5 0.5 h 2 c 0.277344 0 0.5 -0.222656 0.5 -0.5 v -1 c 0 -0.277344 -0.222656 -0.5 -0.5 -0.5 z m 13 0 c -0.277344 0 -0.5 0.222656 -0.5 0.5 v 1 c 0 0.277344 0.222656 0.5 0.5 0.5 h 2 c 0.277344 0 0.5 -0.222656 0.5 -0.5 v -1 c 0 -0.277344 -0.222656 -0.5 -0.5 -0.5 z m -9.742188 4.035156 c -0.128906 0 -0.253906 0.046875 -0.351562 0.144532 l -1.417969 1.414062 c -0.195312 0.199219 -0.195312 0.511719 0 0.707031 l 0.710938 0.710938 c 0.195312 0.195312 0.507812 0.195312 0.707031 0 l 1.414062 -1.417969 c 0.195313 -0.195312 0.195313 -0.507812 0 -0.707031 l -0.707031 -0.707031 c -0.101562 -0.097657 -0.226562 -0.144532 -0.355469 -0.144532 z m 8.484376 0 c -0.128907 0 -0.253907 0.046875 -0.355469 0.144532 l -0.707031 0.707031 c -0.195313 0.199219 -0.195313 0.511719 0 0.707031 l 1.414062 1.417969 c 0.199219 0.195312 0.511719 0.195312 0.707031 0 l 0.710938 -0.710938 c 0.195312 -0.195312 0.195312 -0.507812 0 -0.707031 l -1.417969 -1.414062 c -0.097656 -0.097657 -0.222656 -0.144532 -0.351562 -0.144532 z m -4.742188 1.964844 c -0.277344 0 -0.5 0.222656 -0.5 0.5 v 2 c 0 0.277344 0.222656 0.5 0.5 0.5 h 1 c 0.277344 0 0.5 -0.222656 0.5 -0.5 v -2 c 0 -0.277344 -0.222656 -0.5 -0.5 -0.5 z m 0 0"></path></svg>`,
				cloud: `<svg viewBox="0 0 16 16" fill="#94a3b8"><path d="m 9 1 c -2.027344 0.003906 -3.855469 1.234375 -4.617188 3.113281 c -0.289062 -0.074219 -0.585937 -0.113281 -0.882812 -0.113281 c -1.933594 0 -3.5 1.566406 -3.5 3.5 s 1.566406 3.5 3.5 3.5 h 1.34375 c 0.628906 -1.742188 2.234375 -2.996094 4.15625 -3 c 1.476562 0 2.730469 0.832031 3.5625 2.011719 c 0.769531 0.015625 1.480469 0.28125 2.050781 0.71875 c 0.847657 -0.421875 1.386719 -1.285157 1.386719 -2.230469 c 0 -1.1875 -0.839844 -2.214844 -2.003906 -2.449219 c 0 -0.015625 0.003906 -0.035156 0.003906 -0.050781 c 0 -2.761719 -2.238281 -5 -5 -5 z m 0 8 c -1.765625 0.003906 -3.253906 1.320312 -3.46875 3.074219 c -0.175781 -0.050781 -0.351562 -0.074219 -0.53125 -0.074219 c -1.105469 0 -2 0.894531 -2 2 s 0.894531 2 2 2 h 7.5 c 1.378906 0 2.5 -1.121094 2.5 -2.5 s -1.121094 -2.5 -2.5 -2.5 c -0.109375 0 -0.21875 0.007812 -0.328125 0.023438 c -0.574219 -1.234376 -1.8125 -2.023438 -3.171875 -2.023438 z m 0 0"></path></svg>`,
				'cloud-sun': `<svg viewBox="0 0 16 16" fill="#94a3b8"><path d="m 6.5 1 c -0.277344 0 -0.5 0.222656 -0.5 0.5 v 1 c 0 0.277344 0.222656 0.5 0.5 0.5 h 1 c 0.277344 0 0.5 -0.222656 0.5 -0.5 v -1 c 0 -0.277344 -0.222656 -0.5 -0.5 -0.5 z m -3.742188 1.546875 c -0.128906 0 -0.253906 0.050781 -0.351562 0.152344 l -0.707031 0.707031 c -0.199219 0.195312 -0.199219 0.507812 0 0.703125 l 0.707031 0.707031 c 0.195312 0.199219 0.507812 0.199219 0.707031 0 l 0.707031 -0.707031 c 0.195313 -0.195313 0.195313 -0.507813 0 -0.703125 l -0.707031 -0.707031 c -0.101562 -0.101563 -0.226562 -0.152344 -0.351562 -0.152344 z m 8.484376 0 c -0.128907 0 -0.253907 0.050781 -0.355469 0.152344 l -0.707031 0.707031 c -0.195313 0.195312 -0.195313 0.507812 0 0.703125 l 0.707031 0.707031 c 0.199219 0.199219 0.511719 0.199219 0.707031 0 l 0.707031 -0.707031 c 0.199219 -0.195313 0.199219 -0.507813 0 -0.703125 l -0.707031 -0.707031 c -0.097656 -0.101563 -0.226562 -0.152344 -0.351562 -0.152344 z m -4.253907 1.457031 c -2.195312 0 -4 1.808594 -4 4 c 0 1.386719 0.71875 2.609375 1.804688 3.328125 c 0.316406 -0.136719 0.660156 -0.226562 1.019531 -0.253906 c 0.609375 -1.785156 2.238281 -3.074219 4.1875 -3.078125 c 0.339844 0 0.667969 0.046875 0.980469 0.128906 c 0.003906 -0.042968 0.007812 -0.082031 0.007812 -0.125 c 0 -2.191406 -1.804687 -4 -4 -4 z m -6.488281 2.996094 c -0.277344 0 -0.5 0.222656 -0.5 0.5 v 1 c 0 0.277344 0.222656 0.5 0.5 0.5 h 1 c 0.277344 0 0.5 -0.222656 0.5 -0.5 v -1 c 0 -0.277344 -0.222656 -0.5 -0.5 -0.5 z m 12 0 c -0.277344 0 -0.5 0.222656 -0.5 0.5 v 1 c 0 0.019531 0.003906 0.035156 0.007812 0.054688 c 0.21875 0.128906 0.429688 0.28125 0.628907 0.445312 h 0.863281 c 0.277344 0 0.5 -0.222656 0.5 -0.5 v -1 c 0 -0.277344 -0.222656 -0.5 -0.5 -0.5 z m -2.5 2 c -1.765625 0.003906 -3.253906 1.320312 -3.46875 3.074219 c -0.175781 -0.050781 -0.351562 -0.074219 -0.53125 -0.074219 c -1.105469 0 -2 0.894531 -2 2 s 0.894531 2 2 2 h 7.5 c 1.378906 0 2.5 -1.121094 2.5 -2.5 s -1.121094 -2.5 -2.5 -2.5 c -0.109375 0 -0.21875 0.007812 -0.328125 0.023438 c -0.574219 -1.234376 -1.8125 -2.023438 -3.171875 -2.023438 z m -7.242188 2.035156 c -0.128906 0 -0.253906 0.046875 -0.351562 0.148438 l -0.707031 0.707031 c -0.199219 0.195313 -0.199219 0.507813 0 0.703125 l 0.707031 0.707031 c 0.183594 0.1875 0.480469 0.195313 0.675781 0.023438 c 0.128907 -0.53125 0.40625 -1 0.785157 -1.371094 c -0.011719 -0.023437 -0.03125 -0.046875 -0.046876 -0.0625 l -0.707031 -0.707031 c -0.101562 -0.101563 -0.226562 -0.148438 -0.355469 -0.148438 z m 0 0"></path></svg>`,
				rain: `<svg viewBox="0 0 16 16" fill="#3b82f6"><path d="m 9 0 c -2.027344 0.00390625 -3.855469 1.234375 -4.621094 3.113281 c -0.285156 -0.074219 -0.582031 -0.113281 -0.878906 -0.113281 c -1.933594 0 -3.5 1.566406 -3.5 3.5 s 1.566406 3.5 3.5 3.5 h 10 c 1.378906 0 2.5 -1.121094 2.5 -2.5 c 0 -1.1875 -0.839844 -2.214844 -2.003906 -2.449219 c 0 -0.015625 0.003906 -0.035156 0.003906 -0.050781 c 0 -2.761719 -2.238281 -5 -5 -5 z m -4.429688 11 c -0.484374 -0.03125 -0.921874 0.285156 -1.042968 0.757812 l -0.5 2 c -0.132813 0.535157 0.195312 1.078126 0.730468 1.210938 c 0.535157 0.136719 1.078126 -0.191406 1.210938 -0.726562 l 0.5 -2 c 0.136719 -0.535157 -0.191406 -1.078126 -0.726562 -1.210938 c -0.054688 -0.015625 -0.113282 -0.023438 -0.171876 -0.03125 z m 3.5 0 c -0.484374 -0.03125 -0.921874 0.285156 -1.042968 0.757812 l -0.5 2 c -0.132813 0.535157 0.195312 1.078126 0.730468 1.210938 c 0.535157 0.136719 1.078126 -0.191406 1.210938 -0.726562 l 0.5 -2 c 0.136719 -0.535157 -0.191406 -1.078126 -0.726562 -1.210938 c -0.054688 -0.015625 -0.113282 -0.023438 -0.171876 -0.03125 z m 3.5 0 c -0.484374 -0.03125 -0.921874 0.285156 -1.042968 0.757812 l -0.5 2 c -0.132813 0.535157 0.195312 1.078126 0.730468 1.210938 c 0.535157 0.136719 1.078126 -0.191406 1.210938 -0.726562 l 0.5 -2 c 0.136719 -0.535157 -0.191406 -1.078126 -0.726562 -1.210938 c -0.054688 -0.015625 -0.113282 -0.023438 -0.171876 -0.03125 z m 0 0"></path></svg>`,
				snow: `<svg viewBox="0 0 16 16" fill="#60a5fa"><path d="m 7.5 0.5 c -0.277344 0 -0.5 0.222656 -0.5 0.5 v 1.53125 l -1.253906 -0.714844 c -0.238282 -0.136718 -0.542969 -0.054687 -0.679688 0.183594 c -0.136718 0.242188 -0.054687 0.546875 0.183594 0.683594 l 1.75 1 v 3.449218 l -2.988281 -1.726562 l 0.007812 -2.011719 c 0 -0.273437 -0.222656 -0.5 -0.496093 -0.5 c -0.277344 0 -0.5 0.222657 -0.5 0.496094 l -0.007813 1.441406 l -1.328125 -0.765625 c -0.113281 -0.066406 -0.25 -0.085937 -0.378906 -0.050781 s -0.238282 0.121094 -0.304688 0.234375 s -0.085937 0.25 -0.050781 0.378906 s 0.121094 0.238282 0.234375 0.304688 l 1.328125 0.765625 l -1.246094 0.726562 c -0.238281 0.136719 -0.320312 0.445313 -0.179687 0.683594 c 0.136718 0.238281 0.441406 0.320313 0.683594 0.179687 l 1.738281 -1.015624 l 2.988281 1.726562 l -2.988281 1.726562 l -1.738281 -1.015624 c -0.242188 -0.140626 -0.546876 -0.058594 -0.683594 0.183593 c -0.140625 0.238281 -0.058594 0.542969 0.179687 0.679688 l 1.246094 0.726562 l -1.328125 0.765625 c -0.113281 0.066406 -0.199219 0.175782 -0.234375 0.304688 s -0.015625 0.265625 0.050781 0.378906 h 0.003906 c 0.136719 0.238281 0.441407 0.320312 0.679688 0.183594 l 1.328125 -0.765625 l 0.007813 1.441406 c 0 0.273437 0.222656 0.5 0.5 0.496094 c 0.273437 0 0.496093 -0.222657 0.496093 -0.5 l -0.007812 -2.011719 l 2.988281 -1.726562 v 3.5 l -1.746094 0.988281 c -0.117187 0.0625 -0.199218 0.171875 -0.234375 0.300781 c -0.039062 0.125 -0.019531 0.261719 0.046875 0.378906 c 0.0625 0.117188 0.171875 0.199219 0.300782 0.234375 c 0.125 0.039063 0.261718 0.019531 0.378906 -0.042969 l 1.253906 -0.710937 v 1.484375 c 0 0.277344 0.222656 0.5 0.5 0.5 s 0.5 -0.222656 0.5 -0.5 v -1.484375 l 1.253906 0.710937 c 0.117188 0.0625 0.253906 0.082032 0.378906 0.042969 c 0.128907 -0.035156 0.238282 -0.117187 0.304688 -0.234375 c 0.0625 -0.117187 0.082031 -0.253906 0.042969 -0.378906 c -0.035157 -0.128906 -0.117188 -0.238281 -0.234375 -0.300781 l -1.746094 -0.988281 v -3.5 l 3.03125 1.75 l -0.015625 2.007812 c -0.003906 0.273438 0.21875 0.5 0.492187 0.5 c 0.132813 0.003906 0.261719 -0.046875 0.355469 -0.140625 s 0.148438 -0.21875 0.152344 -0.351563 l 0.011719 -1.441406 l 1.285156 0.742188 c 0.238281 0.136718 0.542969 0.054687 0.683594 -0.183594 c 0.136718 -0.238281 0.054687 -0.546875 -0.183594 -0.683594 l -1.285156 -0.742187 l 1.242187 -0.730469 c 0.113281 -0.066406 0.195313 -0.175781 0.226563 -0.304688 c 0.035156 -0.128906 0.015625 -0.265624 -0.050782 -0.382812 c -0.140624 -0.234375 -0.449218 -0.3125 -0.683593 -0.175781 l -1.730469 1.019531 l -3.03125 -1.75 l 3.03125 -1.75 l 1.730469 1.019531 c 0.234375 0.140625 0.542969 0.058594 0.683593 -0.175781 c 0.066407 -0.117188 0.085938 -0.253906 0.050782 -0.382812 c -0.03125 -0.128907 -0.113282 -0.238282 -0.226563 -0.304688 l -1.242187 -0.730469 l 1.285156 -0.742187 c 0.238281 -0.136719 0.320312 -0.445313 0.183594 -0.683594 c -0.140625 -0.238281 -0.445313 -0.320312 -0.683594 -0.183594 l -1.285156 0.742188 l -0.011719 -1.441406 c -0.003906 -0.132813 -0.058594 -0.257813 -0.152344 -0.351563 s -0.222656 -0.144531 -0.355469 -0.140625 c -0.277343 0 -0.496093 0.226562 -0.492187 0.503906 l 0.015625 2.003906 l -3.03125 1.75 v -3.449218 l 1.75 -1 c 0.238281 -0.136719 0.320312 -0.441406 0.183594 -0.683594 c -0.136719 -0.238281 -0.441406 -0.320312 -0.679688 -0.183594 l -1.253906 0.714844 v -1.53125 c 0 -0.277344 -0.222656 -0.5 -0.5 -0.5 z m 0 0"></path></svg>`,
				thunder: `<svg fill="#f59e0b" version="1.2" baseProfile="tiny" id="Layer_1" viewBox="-311 112.9 336.1 336.1"><path d="M-37.7,200c-0.5,0-1.1,0.1-1.6,0.1c0.2-2.3,0.3-4.7,0.3-7.2c0-41.5-33.6-75-75-75c-37.9,0-69.1,28.1-74.2,64.6 c-5.1-1.6-10.2-2.7-15.8-2.7c-28.5,0-51.6,23.1-51.6,51.6c0,0.2,0.1,0.4,0.1,0.7c-2.3-0.4-4.6-0.7-7.1-0.7 c-20.2,0-36.5,16.4-36.5,36.5s16.4,36.5,36.5,36.5c0,0,49.4-0.2,101.9-0.5l-28.9,60h62.6l-43.5,80.4l97.5-110h-62l17-30.5 c43.4-0.2,79.8-0.4,80.4-0.4c28.5,0,51.6-23.1,51.6-51.6C13.9,223.1-9.2,200-37.7,200z"></path></svg>`
			};
			
			if (code === 0) return { icon: ICONS.sun, description: "Ciel dégagé" };
			if (code === 1) return { icon: ICONS['cloud-sun'], description: "Plutôt ensoleillé" };
			if (code === 2) return { icon: ICONS['cloud-sun'], description: "Partiellement nuageux" };
			if (code === 3) return { icon: ICONS.cloud, description: "Nuageux" };
			if (code >= 45 && code <= 48) return { icon: ICONS.cloud, description: "Brouillard" };
			if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return { icon: ICONS.rain, description: "Pluie" };
			if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return { icon: ICONS.snow, description: "Neige" };
			if (code >= 95 && code <= 99) return { icon: ICONS.thunder, description: "Orages" };
			
			return { icon: ICONS.cloud, description: "Variable" };
		}

		// expose API
		return { pause: () => { }, resume: () => { }, restart: () => { } };
	}
};