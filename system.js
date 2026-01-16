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
		this.exitButtonsvg       = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 9 2 A 1.0001 1.0001 0 0 0 8 3 L 8 8 A 1 1 0 0 0 9 9 A 1 1 0 0 0 10 8 L 10 4 L 18 4 L 18 20 L 10 20 L 10 16 A 1 1 0 0 0 9 15 A 1 1 0 0 0 8 16 L 8 21 A 1.0001 1.0001 0 0 0 9 22 L 19 22 A 1.0001 1.0001 0 0 0 20 21 L 20 3 A 1.0001 1.0001 0 0 0 19 2 L 9 2 z M 7.0292969 9 A 1 1 0 0 0 6.2929688 9.2929688 L 4.3125 11.273438 L 4.2929688 11.292969 A 1.0001 1.0001 0 0 0 4.2832031 11.302734 A 1 1 0 0 0 4.2363281 11.355469 A 1 1 0 0 0 4.1855469 11.421875 A 1 1 0 0 0 4.1464844 11.482422 A 1.0001 1.0001 0 0 0 4.1289062 11.509766 A 1 1 0 0 0 4.0996094 11.566406 A 1 1 0 0 0 4.0683594 11.638672 A 1.0001 1.0001 0 0 0 4.0644531 11.650391 A 1 1 0 0 0 4.0410156 11.714844 A 1.0001 1.0001 0 0 0 4.0332031 11.75 A 1 1 0 0 0 4.0234375 11.791016 A 1.0001 1.0001 0 0 0 4.015625 11.828125 A 1 1 0 0 0 4.0078125 11.871094 A 1.0001 1.0001 0 0 0 4.0019531 11.943359 A 1.0001 1.0001 0 0 0 4 11.988281 A 1 1 0 0 0 4 12 A 1 1 0 0 0 4.0019531 12.029297 A 1.0001 1.0001 0 0 0 4.0039062 12.066406 A 1 1 0 0 0 4.0078125 12.117188 A 1.0001 1.0001 0 0 0 4.0117188 12.146484 A 1 1 0 0 0 4.0253906 12.222656 A 1 1 0 0 0 4.0410156 12.28125 A 1.0001 1.0001 0 0 0 4.0546875 12.324219 A 1 1 0 0 0 4.0585938 12.337891 A 1.0001 1.0001 0 0 0 4.0878906 12.408203 A 1.0001 1.0001 0 0 0 4.1210938 12.474609 A 1 1 0 0 0 4.1347656 12.501953 A 1.0001 1.0001 0 0 0 4.1640625 12.546875 A 1 1 0 0 0 4.1777344 12.568359 A 1.0001 1.0001 0 0 0 4.2011719 12.601562 A 1 1 0 0 0 4.21875 12.623047 A 1.0001 1.0001 0 0 0 4.265625 12.677734 A 1 1 0 0 0 4.2851562 12.699219 A 1.0001 1.0001 0 0 0 4.2929688 12.707031 A 1 1 0 0 0 4.3339844 12.746094 L 6.2929688 14.707031 A 1 1 0 0 0 7.7070312 14.707031 A 1 1 0 0 0 7.7070312 13.292969 L 7.4140625 13 L 14 13 A 1 1 0 0 0 15 12 A 1 1 0 0 0 14 11 L 7.4140625 11 L 7.7070312 10.707031 A 1 1 0 0 0 7.7070312 9.2929688 A 1 1 0 0 0 7.0292969 9 z " </path></svg>`;
		this.backButtonsvg       = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20,11H7.83l5.59-5.59L12,4l-8,8l8,8l1.41-1.41L7.83,13H20V11z" /></svg>`;
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
				<button class="back-btn" data-window-id="${windowId}">
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
