/**
 * Application entry point.
 *  • Boots the System kernel.
 *  • Registers every app from applications/index.js.
 *  • Mounts the desktop.
 *  • Starts the status-bar clock and GitHub-Pages path fix.
 */

import {
	System,
	Desktop,
	EventScope,
	startStatusBarClock,
	applyGithubPagesFix,
} from './core/index.js';
import { ALL_APPS } from './applications/index.js';

const shellScope = new EventScope();

function boot() {
	applyGithubPagesFix();

	const system = new System();
	ALL_APPS.forEach(app => system.registerApp(app));

	const desktop = new Desktop(system);
	desktop.init();

	startStatusBarClock(shellScope);

	// Expose for debugging in dev tools — harmless in production.
	window.system = system;
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
	boot();
}
