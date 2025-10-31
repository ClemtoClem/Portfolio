/**
 * Classe Système pour gérer l'état global, les applications et les fenêtres.
 */
export class System {
	constructor() {
		this.appRegistry = new Map();
		this.openApps = []; // Pile pour gérer les fenêtres ouvertes
		this.settings = { screenMode: 'phone' };
		this.appWindowContainer = document.getElementById('app-window-container');
		this.backButtonSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20,11H7.83l5.59-5.59L12,4l-8,8l8,8l1.41-1.41L7.83,13H20V11z" /></svg>`;
	}

	/**
	 * Enregistre un module d'application dans le système.
	 * @param {object} appModule - L'objet module de l'application.
	 */
	registerApp(appModule) {
		if (!appModule || !appModule.id) {
			console.error("Tentative d'enregistrement d'un module d'application invalide.");
			return;
		}
		this.appRegistry.set(appModule.id, appModule);
	}

	/**
	 * Ouvre une application et crée sa fenêtre.
	 * @param {string} appId - L'ID de l'application à ouvrir.
	 */
	openApp(appId) {
		const app = this.appRegistry.get(appId);
		if (!app) {
			console.error(`Application non trouvée : ${appId}`);
			return;
		}

		// Créer l'élément de la fenêtre
		const appWindow = document.createElement('section');
		const windowId = `${app.id}-${Date.now()}`; // ID unique pour la fenêtre
		appWindow.id = windowId;
		appWindow.className = 'app-window';
		
		// Appliquer une couleur d'en-tête personnalisée si définie
		const headerStyle = app.headerColor ? `style="background-color: ${app.headerColor}"` : '';

		// Générer le HTML de la fenêtre
		appWindow.innerHTML = `
			<div class="app-header" ${headerStyle}>
				<button class="back-btn" data-window-id="${windowId}">${this.backButtonSvg}</button>
				<h2>${app.title}</h2>
			</div>
			<div class="app-content">${app.content}</div>
		`;

		// Ajouter au DOM et à la pile
		this.appWindowContainer.appendChild(appWindow);
		this.openApps.push(appWindow);
		
		// Mettre à jour le z-index pour que la nouvelle fenêtre soit au-dessus
		appWindow.style.zIndex = 100 + this.openApps.length;

		// Animer l'ouverture
		setTimeout(() => appWindow.classList.add('open'), 10);

		// Lancer le script d'initialisation de l'application (s'il existe)
		if (app.init) {
			app.init(windowId); // Passe l'ID unique de la fenêtre à l'init
		}

		// Ajouter l'écouteur pour le bouton retour
		const backBtn = appWindow.querySelector('.back-btn')
		if (backBtn) {
			backBtn.addEventListener('click', () => {
				this.closeApp(windowId);
			});
		}
	}

	/**
	 * Ferme une fenêtre d'application.
	 * @param {string} windowId - L'ID unique de la fenêtre à fermer.
	 */
	closeApp(windowId) {
		const appWindow = document.getElementById(windowId);
		if (!appWindow) return;

		// Animer la fermeture
		appWindow.classList.remove('open');

		// Retirer de la pile
		this.openApps = this.openApps.filter(win => win.id !== windowId);

		// Supprimer du DOM après l'animation
		setTimeout(() => {
			appWindow.remove();
		}, 300); // 300ms correspond à la durée de la transition CSS
	}
}
