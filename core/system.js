/**
 * System — the OS kernel.
 *
 * Responsibilities:
 *   • Registers app manifests.
 *   • Manages settings (with persistence).
 *   • Opens / closes app windows, calling lifecycle hooks.
 *   • Owns the audio manager and exposes it to apps.
 *
 * The system is intentionally framework-agnostic: it manipulates plain
 * DOM nodes and dispatches events on itself so other components (the
 * desktop, parameters app, etc.) can react to changes without tight
 * coupling.
 */

import { AudioManager } from './audio.js';
import { Storage } from './storage.js';
import { pick } from './i18n.js';
import { createAppContext } from './app.js';

const EXIT_BUTTON_SVG = `<svg viewBox="0 0 24 24"><path d="M12.1,11.9c-0.4-0.4-1-0.4-1.4,0L10,12.6l-0.7-0.7c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4L8.6,14l-0.7,0.7 c-0.4,0.4-0.4,1,0,1.4c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l0.7-0.7l0.7,0.7c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3 c0.4-0.4,0.4-1,0-1.4L11.4,14l0.7-0.7C12.5,12.9,12.5,12.3,12.1,11.9z"></path><path d="M17,3h-6C8.8,3,7,4.8,7,7c-2.2,0-4,1.8-4,4v6c0,2.2,1.8,4,4,4h6c2.2,0,4-1.8,4-4c2.2,0,4-1.8,4-4V7C21,4.8,19.2,3,17,3z M15,16v1c0,1.1-0.9,2-2,2H7c-1.1,0-2-0.9-2-2v-6c0-1.1,0.9-2,2-2h1h5c1.1,0,2,0.9,2,2V16z M19,13c0,1.1-0.9,2-2,2v-4 c0-2.2-1.8-4-4-4H9c0-1.1,0.9-2,2-2h6c1.1,0,2,0.9,2,2V13z" /></svg>`;

const SETTINGS_STORAGE_KEY = 'settings';
const DEFAULT_SETTINGS = {
	screenMode: 'phone',
	language:   'fr-FR',
};

export class System extends EventTarget {
	constructor() {
		super();

		this.audio = new AudioManager();
		this.appRegistry = new Map();
		/** Open windows, keyed by windowId. */
		this.windows = new Map();
		/** Per-window lifecycle handles returned by onMount. */
		this.windowHandles = new Map();

		this.appWindowContainer = document.getElementById('app-window-container');

		const settingsStorage = new Storage();
		this.settings = { ...DEFAULT_SETTINGS, ...(settingsStorage.get(SETTINGS_STORAGE_KEY) || {}) };
		settingsStorage.set(SETTINGS_STORAGE_KEY, this.settings);
		this._settingsStorage = settingsStorage;
		this._settingsDirty = true;
	}

	registerApp(app) {
		if (!app || !app.id) {
			console.error('System.registerApp: missing id', app);
			return;
		}
		this.appRegistry.set(app.id, app);
	}

	/** Has any setting changed since the last consumeSettingsChange call? */
	consumeSettingsChange() {
		const d = this._settingsDirty;
		this._settingsDirty = false;
		return d;
	}

	setSetting(key, value) {
		if (!(key in this.settings)) return;
		if (this.settings[key] === value) return;
		this.settings[key] = value;
		this._settingsDirty = true;
		this._settingsStorage.set(SETTINGS_STORAGE_KEY, this.settings);
		this.dispatchEvent(new CustomEvent('settings-change', { detail: { key, value, settings: this.settings } }));
	}

	openApp(appId) {
		const app = this.appRegistry.get(appId);
		if (!app) {
			console.warn('System.openApp: unknown app', appId);
			return null;
		}

		const root = document.createElement('section');
		const windowId = `${app.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
		root.id = windowId;
		root.className = 'app-window';

		const title = pick(app.title, this.settings.language);
		const styleBlock = app.style ? `<style>${app.style}</style>` : '';
		const contentHTML = pick(app.content, this.settings.language);

		root.innerHTML = `
			<div class="app-header"${app.headerColor ? ` style="background-color:${app.headerColor}"` : ''}>
				<button class="back-btn" data-window-id="${windowId}" title="Exit">${EXIT_BUTTON_SVG}</button>
				<h2>${title}</h2>
			</div>
			<div class="app-content">${styleBlock}${contentHTML}</div>
		`;

		this.appWindowContainer.appendChild(root);
		this.windows.set(windowId, { app, root });
		root.style.zIndex = String(100 + this.windows.size);

		// Trigger the open animation
		requestAnimationFrame(() => root.classList.add('open'));

		// Wire back/exit button
		root.querySelector('.back-btn')
			.addEventListener('click', () => this.closeApp(windowId));

		// Build context and call lifecycle
		const ctx = createAppContext({ system: this, app, windowId, root });
		let handle = {};
		try {
			handle = app.onMount ? (app.onMount(ctx) || {}) : {};
		} catch (e) {
			console.error(`onMount failed for ${app.id}:`, e);
		}
		this.windowHandles.set(windowId, { ctx, handle });

		this.dispatchEvent(new CustomEvent('app-open', { detail: { appId: app.id, windowId } }));
		return windowId;
	}

	closeApp(windowId) {
		const win = this.windows.get(windowId);
		if (!win) return;
		const { root } = win;

		const handle = this.windowHandles.get(windowId);
		if (handle?.handle?.quit) {
			try { handle.handle.quit(); } catch (e) { console.error(e); }
		}
		if (handle?.ctx) {
			handle.ctx.scope.dispose();
		}

		root.classList.remove('open');
		this.windows.delete(windowId);
		this.windowHandles.delete(windowId);

		setTimeout(() => root.remove(), 300);
		this.dispatchEvent(new CustomEvent('app-close', { detail: { windowId } }));
	}

	pauseApp(windowId) {
		const h = this.windowHandles.get(windowId);
		if (h?.handle?.pause) try { h.handle.pause(); } catch (e) { console.error(e); }
	}

	resumeApp(windowId) {
		const h = this.windowHandles.get(windowId);
		if (h?.handle?.resume) try { h.handle.resume(); } catch (e) { console.error(e); }
	}

	restartApp(windowId) {
		const h = this.windowHandles.get(windowId);
		if (h?.handle?.restart) try { h.handle.restart(); } catch (e) { console.error(e); }
	}

	/** Close, then reopen — used by the parameters app when language switches. */
	reopenApp(appId, windowId) {
		this.closeApp(windowId);
		setTimeout(() => this.openApp(appId), 310);
	}
}
