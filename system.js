/**
 * Classe Système pour gérer l'état global, les applications et les fenêtres.
 */
export class System {
	constructor() {
		this.appRegistry         = new Map();
		this.openApps            = []; // Pile pour gérer les fenêtres ouvertes
		this.settings            = { screenMode: 'phone', language: 'fr-FR' };
		this.has_settings_change = true;
		this.appWindowContainer  = document.getElementById('app-window-container');
		this.exitButtonsvg       = `<svg viewBox="0 0 24 24"> <path d="M12.1,11.9c-0.4-0.4-1-0.4-1.4,0L10,12.6l-0.7-0.7c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4L8.6,14l-0.7,0.7 c-0.4,0.4-0.4,1,0,1.4c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l0.7-0.7l0.7,0.7c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3 c0.4-0.4,0.4-1,0-1.4L11.4,14l0.7-0.7C12.5,12.9,12.5,12.3,12.1,11.9z"></path> <path d="M17,3h-6C8.8,3,7,4.8,7,7c-2.2,0-4,1.8-4,4v6c0,2.2,1.8,4,4,4h6c2.2,0,4-1.8,4-4c2.2,0,4-1.8,4-4V7C21,4.8,19.2,3,17,3z M15,16v1c0,1.1-0.9,2-2,2H7c-1.1,0-2-0.9-2-2v-6c0-1.1,0.9-2,2-2h1h5c1.1,0,2,0.9,2,2V16z M19,13c0,1.1-0.9,2-2,2v-4 c0-2.2-1.8-4-4-4H9c0-1.1,0.9-2,2-2h6c1.1,0,2,0.9,2,2V13z" /></svg>`;
		this.backButtonsvg       = `<svg viewBox="0 0 24 24"><path d="M20,11H7.83l5.59-5.59L12,4l-8,8l8,8l1.41-1.41L7.83,13H20V11z" /></svg>`;
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
		if (!app) return;

		const appWindow     = document.createElement('section');
		const windowId      = `${app.id}-${Date.now()}`;
		appWindow.id        = windowId;
		appWindow.className = 'app-window';

		var title = '';
		if (typeof app.title === 'object')
			title = app.title[this.settings.language] ?? app.title['en-US'];
		else
			title = app.title;

		var style = app.style ? `<style>${app.style}</style>` : '';
		var content = '';

		if (typeof app.content === 'object')
			content = app.content[this.settings.language] ?? app.content['en-US'];
		else
			content = app.content;

		appWindow.innerHTML = `
			<div class="app-header" ${app.headerColor ? `style="background-color: ${app.headerColor}"` : ``}>
				<button class="back-btn" data-window-id="${windowId}" title="Exit">
					${this.exitButtonsvg}
				</button>
				<h2>${title}</h2>
			</div>
			<div class="app-content">
				${style}
				${content}
			</div>
		`;

		this.appWindowContainer.appendChild(appWindow);
		this.openApps.push(appWindow);

		appWindow.style.zIndex = 100 + this.openApps.length;

		setTimeout(() => appWindow.classList.add('open'), 10);

		if (app.init) app.init(this, windowId);

		appWindow.querySelector('.back-btn')
			.addEventListener('click', () => this.closeApp(windowId));
	}

	/**
	 * Ferme une fenêtre d'application.
	 * @param {string} windowId - L'ID unique de la fenêtre à fermer.
	 */
	closeApp(windowId) {
		const appWindow = document.getElementById(windowId);
		if (!appWindow) return;

		appWindow.classList.remove('open');

		this.openApps = this.openApps.filter(win => win.id !== windowId);

		setTimeout(() => {
			appWindow.remove();
		}, 300);
	}

	/**
	 * Réouvrir l'application.
	 * @param {string} appId - L'ID de l'application à ouvrir.
	 * @param {string} windowId - L'ID unique de la fenêtre à fermer.
	 */
	reopenApp(appId, windowId) {
		this.closeApp(windowId);
		this.openApp(appId);
	}

	hasSettingsChange() {
		return this.has_settings_change;
	}

	setSettings(key, value) {
		if (key in this.settings) {
			this.settings[key] = value;
			this.has_settings_change = true;
		}
	}
}
