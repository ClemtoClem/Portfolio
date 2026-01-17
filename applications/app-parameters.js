const LANGUAGE_SELECT = 
`<select name="languages" id="language-select">
	<option value='en-US'>English</option>
	<option value='fr-FR'>Français</option>
</select>`;

export const parametersApp = {
	id: 'app-parameters',
	title: {'en-US':'Parameters', 'fr-FR':'Paramètres'},
	version: '1.0.0',
	icon: `<svg viewBox="0 0 8.4666669 8.4666669"><g transform="translate(0,-288.53332)"><path d="m 3.7041666,288.7979 a 0.26460976,0.26460976 0 0 0 -0.2511475,0.18087 l -0.2687174,0.80615 c -0.1084927,0.0382 -0.2146168,0.082 -0.3183269,0.13178 l -0.7601602,-0.37982 a 0.26460976,0.26460976 0 0 0 -0.3054077,0.0496 l -0.7482748,0.74827 a 0.26460976,0.26460976 0 0 0 -0.049609,0.30541 l 0.379305,0.75861 c -0.049895,0.10423 -0.094048,0.21083 -0.1322917,0.31988 l -0.80511879,0.26871 a 0.26460976,0.26460976 0 0 0 -0.18086751,0.25115 v 1.05833 a 0.26460976,0.26460976 0 0 0 0.18086751,0.25115 l 0.80770259,0.26924 c 0.038069,0.10784 0.081782,0.21314 0.1312582,0.31625 l -0.3808553,0.76172 a 0.26460976,0.26460976 0 0 0 0.049609,0.3054 l 0.7482748,0.74879 a 0.26460976,0.26460976 0 0 0 0.3054077,0.0496 l 0.7601602,-0.38033 c 0.1036035,0.0495 0.209454,0.0932 0.3178101,0.13125 l 0.2692342,0.80719 a 0.26460976,0.26460976 0 0 0 0.2511475,0.18087 h 1.0583333 a 0.26460976,0.26460976 0 0 0 0.2511476,-0.18087 l 0.2692341,-0.80874 c 0.1075521,-0.0379 0.2128936,-0.0815 0.3157429,-0.13074 l 0.7622276,0.38137 a 0.26460976,0.26460976 0 0 0 0.3054074,-0.0496 l 0.748275,-0.74879 a 0.26460976,0.26460976 0 0 0 0.049609,-0.3054 l -0.3798218,-0.75965 c 0.049789,-0.10387 0.093561,-0.21018 0.1317749,-0.31884 L 8.0222491,293.548 a 0.26460976,0.26460976 0 0 0 0.1808676,-0.25115 v -1.05833 a 0.26460976,0.26460976 0 0 0 -0.1808676,-0.25115 l -0.806669,-0.26871 c -0.038193,-0.10832 -0.082077,-0.21427 -0.1317747,-0.31781 l 0.3803385,-0.76068 a 0.26460976,0.26460976 0 0 0 -0.049609,-0.30541 l -0.748275,-0.74827 a 0.26460976,0.26460976 0 0 0 -0.3054074,-0.0496 l -0.7580934,0.37878 c -0.1045763,-0.05 -0.2115013,-0.094 -0.3209105,-0.13229 l -0.2682007,-0.8046 a 0.26460976,0.26460976 0 0 0 -0.251148,-0.18088 z m 0.190686,0.52917 h 0.6769613 l 0.245463,0.73691 a 0.26460976,0.26460976 0 0 0 0.1757,0.17001 c 0.1722022,0.0512 0.3388331,0.11967 0.4971272,0.20464 a 0.26460976,0.26460976 0 0 0 0.243396,0.004 l 0.6934978,-0.34675 0.4785236,0.47852 -0.3482991,0.6966 a 0.26460976,0.26460976 0 0 0 0.00362,0.24391 c 0.084769,0.15725 0.1537229,0.32244 0.2051555,0.49351 a 0.26460976,0.26460976 0 0 0 0.1694987,0.17519 l 0.738456,0.24598 v 0.67696 l -0.7379393,0.24598 a 0.26460976,0.26460976 0 0 0 -0.1694987,0.17518 c -0.051373,0.1714 -0.1203285,0.337 -0.2051555,0.49454 a 0.26460976,0.26460976 0 0 0 -0.00362,0.24392 l 0.3477824,0.69556 -0.4785236,0.47904 -0.6981486,-0.34933 a 0.26460976,0.26460976 0 0 0 -0.2439128,0.004 c -0.1566825,0.0843 -0.3210488,0.15287 -0.4914429,0.20412 a 0.26460976,0.26460976 0 0 0 -0.175183,0.1695 l -0.2464967,0.74052 H 3.8948526 l -0.2464967,-0.73949 a 0.26460976,0.26460976 0 0 0 -0.175183,-0.17001 c -0.1710385,-0.0511 -0.3367447,-0.11916 -0.4940265,-0.20361 a 0.26460976,0.26460976 0 0 0 -0.243396,-0.004 l -0.6960816,0.3483 -0.4785238,-0.47904 0.3488159,-0.69763 a 0.26460976,0.26460976 0 0 0 -0.00362,-0.24391 c -0.08452,-0.15682 -0.1532676,-0.32191 -0.2046387,-0.49248 a 0.26460976,0.26460976 0 0 0 -0.1694987,-0.17467 l -0.73948973,-0.24649 v -0.67696 l 0.73742263,-0.24598 a 0.26460976,0.26460976 0 0 0 0.1700155,-0.17519 c 0.051313,-0.17172 0.1197532,-0.33773 0.2046387,-0.49557 a 0.26460976,0.26460976 0 0 0 0.00362,-0.24392 l -0.3472656,-0.69453 0.4785238,-0.47852 0.6960816,0.34778 a 0.26460976,0.26460976 0 0 0 0.2439127,-0.004 c 0.1573948,-0.0848 0.3227911,-0.15375 0.4940266,-0.20515 a 0.26460976,0.26460976 0 0 0 0.1751832,-0.1695 z" /><path d="m 4.2324219,290.91406 c -1.0197435,0 -1.8515625,0.83377 -1.8515625,1.85352 0,1.01974 0.831819,1.85156 1.8515625,1.85156 1.0197434,0 1.8535156,-0.83182 1.8535156,-1.85156 0,-1.01975 -0.8337722,-1.85352 -1.8535156,-1.85352 z m 0,0.5293 c 0.7337606,0 1.3242187,0.59046 1.3242187,1.32422 0,0.73376 -0.5904581,1.32226 -1.3242187,1.32226 -0.7337606,0 -1.3222657,-0.5885 -1.3222657,-1.32226 0,-0.73376 0.5885051,-1.32422 1.3222657,-1.32422 z" /></g></svg>`,
	iconColor: '#616161',
	type: 'app',
	style: `
		.app-content { padding: 0px; }
		.content {
			padding: 0 18px; margin: 6px 0; max-height: 0; overflow: hidden;
			transition: max-height 0.2s ease-out; background-color: #f9f9f9;
		}
		.storage-list { max-height: 200px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; margin-top: 10px; margin-bottom: 10px; background: #fafafa; }
		.storage-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; border-bottom: 1px solid #ddd; font-size: 0.9em; }
		.storage-item:last-child { border-bottom: none; }
		.storage-info { display: flex; flex-direction: column; overflow: hidden; }
		.storage-key { font-weight: bold; color: #444; font-family: monospace; }
		.storage-val-preview { font-size: 0.8em; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px; }
		.btn-delete { background-color: #ff5252; color: white; border: none; border-radius: 4px; width: 24px; height: 24px; cursor: pointer; flex-shrink: 0; margin-left: 10px; }
		.btn-clear-all { width: 100%; padding: 8px; border: none; border-radius: 4px; background-color: #d32f2f; color: white; font-weight: bold; cursor: pointer; margin-bottom: 10px; }
		.empty-msg { padding: 10px; text-align: center; color: #999; font-style: italic; }
	`,
	content: {
		'en-US':`
			<button class="collapsible">Display Mode</button>
			<div class="content">
				<label><input type="radio" name="screen-mode" value="phone" checked> Phone</label><br>
				<label><input type="radio" name="screen-mode" value="tablet"> Tablet</label>
				<p>Actual size</p><p id="screen-size">-- × -- px</p>
			</div>
			<button class="collapsible">Language</button>
			<div class="content">${LANGUAGE_SELECT}</div>
			<button class="collapsible">Local Storage</button>
			<div class="content">
				<div class="storage-list" id="storage-list-container"></div>
				<button class="btn-clear-all" id="btn-clear-storage">Clear All Data</button>
			</div>
		`,
		'fr-FR':`
			<button class="collapsible">Mode d’affichage</button>
			<div class="content">
				<label><input type="radio" name="screen-mode" value="phone" checked> Téléphone</label><br>
				<label><input type="radio" name="screen-mode" value="tablet"> Tablette</label>
				<p>Taille actuelle</p><p id="screen-size">-- × -- px</p>
			</div>
			<button class="collapsible">Langue</button>
			<div class="content">${LANGUAGE_SELECT}</div>
			<button class="collapsible">Stockage Local</button>
			<div class="content">
				<div class="storage-list" id="storage-list-container"></div>
				<button class="btn-clear-all" id="btn-clear-storage">Tout effacer</button>
			</div>
		`,
	},
	/**
	 * Init function
	 * @param {System} sys - System class instance
	 * @param {String} windowId - Window html ID in which the application will be drawn
	 */
	init: function (sys, windowId) {
		/** @type {System} */
		const system = sys;
		/** @type {JQuery<HTMLElement>} */
		const $window = $(`#${windowId}`);

		var self = this;

		// Elements UI
		const $androidScreen	= $("#android-screen");
		const $screenSize		= $window.find("#screen-size");
		const $languageSelect	= $window.find("#language-select");
		const $storageList		= $window.find("#storage-list-container");
		const $clearStorageBtn	= $window.find("#btn-clear-storage");

		// --- Fonctions d'écran ---

		function updateScreenSize() {
			const w = $androidScreen.outerWidth();
			const h = $androidScreen.outerHeight();
			$screenSize.text(`${w} × ${h} px`);
		}

		// Gérer le changement de mode
		$window.on("change", "input[name='screen-mode']", function () {
			const mode = $(this).val();
			$androidScreen.removeClass("phone-mode tablet-mode");
			if (mode === "phone") {
				$androidScreen.addClass("phone-mode");
			} else if (mode === "tablet") {
				$androidScreen.addClass("tablet-mode");
			}
			updateScreenSize();
			system.setSettings('screenMode', mode);
		});

		// Appliquer le mode actuel
		const currentMode = $androidScreen.hasClass('tablet-mode') ? 'tablet' : 'phone';
		$window.find(`input[name='screen-mode'][value='${currentMode}']`).prop('checked', true);
		$languageSelect.val(system.settings.language);
		updateScreenSize();
		
		// Cacher sur mobile réel
		const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 500;
		if (isMobile) {
			$window.find("#dimension-settings").hide();
		}

		$languageSelect.on("change", function() {
			system.setSettings('language', this.value);
			system.reopenApp(self.id, windowId);
		});

		// --- Gestion du Stockage Local ---

		function renderStorageList() {
			$storageList.empty();
			
			if (localStorage.length === 0) {
				const emptyMsg = (system.settings.language === 'en-US')
					? 'Are you sure you want to delete all local data?' 
					: 'Êtes-vous sûr de vouloir supprimer toutes les données locales ?';
				$storageList.append(`<div class="empty-msg">${emptyMsg}</div>`);
				return;
			}

			// On récupère toutes les clés d'abord pour éviter les problèmes d'index lors de la boucle
			const keys = [];
			for (let i = 0; i < localStorage.length; i++) {
				keys.push(localStorage.key(i));
			}

			keys.forEach(key => {
				const val = localStorage.getItem(key);
				const valPreview = val.length > 30 ? val.substring(0, 30) + '...' : val;
				
				const $item = $(`
					<div class="storage-item">
						<div class="storage-info">
							<span class="storage-key">${key}</span>
							<span class="storage-val-preview" title="${val.replace(/"/g, '&quot;')}">${valPreview}</span>
						</div>
						<button class="btn-delete" title="Delete">×</button>
					</div>
				`);

				// Clic sur supprimer
				$item.find('.btn-delete').on('click', () => {
					localStorage.removeItem(key);
					renderStorageList();
				});

				$storageList.append($item);
			});
		}

		$clearStorageBtn.on('click', () => {
			const confirmMsg = system.settings.language === 'en-US' 
				? 'Are you sure you want to delete all local data?' 
				: 'Êtes-vous sûr de vouloir supprimer toutes les données locales ?';
			
			if (confirm(confirmMsg)) {
				localStorage.clear();
				renderStorageList();
			}
		});

		// ---- collapsible ----

		// Utilisation de la délégation d'événement JQuery sur la fenêtre de l'app
		$window.on("click", ".collapsible", function() {
			$(this).toggleClass("active");
			const content = this.nextElementSibling;
			
			if (content.style.maxHeight) {
				content.style.maxHeight = null;
			} else {
				// Calculer la hauteur réelle du contenu pour l'animation
				content.style.maxHeight = content.scrollHeight + "px";
			} 
		});

		updateScreenSize();
		renderStorageList();

		// expose API
		return { 
			pause:   () => { },
			resume:  () => { renderStorageList(); }, // Rafraichir si on revient sur l'app
			restart: () => { updateScreenSize(); renderStorageList(); } 
		};
	}
};
