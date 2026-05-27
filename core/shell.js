/**
 * Shell-level concerns: device detection, fullscreen-on-Android,
 * status-bar clock and the GitHub Pages path-prefix fix.
 * Kept separate so main.js stays small.
 */

/** True when the page is being viewed on Android. */
export function isAndroid() {
	const ua = navigator.userAgent || '';
	if (/Android/i.test(ua)) return true;
	// User-Agent Client Hints (Chromium): more reliable when present.
	return navigator.userAgentData?.platform === 'Android';
}

/**
 * On Android, force the screen to fill the device's viewport (no phone
 * frame), and try to enter fullscreen on the first user gesture.
 *
 * Browsers reject `requestFullscreen()` without a user gesture, so we
 * arm a one-shot listener for pointerdown/click that fires the request
 * inside that gesture's call stack.
 */
export function setupAndroidFullscreen(scope) {
	if (!isAndroid()) return false;

	const screen = document.getElementById('android-screen');
	if (screen) {
		screen.classList.remove('phone-mode', 'tablet-mode');
		screen.classList.add('native-mode');
	}

	let armed = true;
	const tryFullscreen = () => {
		if (!armed) return;
		armed = false;
		const root = document.documentElement;
		if (root.requestFullscreen && !document.fullscreenElement) {
			root.requestFullscreen({ navigationUI: 'hide' }).catch(() => {});
		}
	};
	// Listen once on the very first user gesture; the scope handles cleanup.
	scope.on(window, ['pointerdown', 'touchstart', 'click'], tryFullscreen, { once: true, passive: true });
	return true;
}

export function startStatusBarClock(scope) {
	const timeEl = document.getElementById('time');
	if (!timeEl) return;
	const tick = () => {
		const now = new Date();
		timeEl.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
	};
	tick();
	scope.setInterval(tick, 10000);
}

/**
 * When the site is served from `https://user.github.io/Portfolio/`,
 * relative URLs need the `/Portfolio/` prefix. This patches img/script
 * etc. attributes plus fetch/XHR transparently.
 */
export function applyGithubPagesFix(repoName = 'Portfolio') {
	const isGithubPages = window.location.hostname.includes('github.io');
	if (!isGithubPages) return;

	const prefix = `/${repoName}/`;
	const targets = [
		['img', 'src'], ['script', 'src'], ['link', 'href'],
		['video', 'src'], ['audio', 'src'], ['source', 'src'],
	];
	for (const [tag, attr] of targets) {
		document.querySelectorAll(`${tag}[${attr}]`).forEach(el => {
			const val = el.getAttribute(attr);
			if (val && !val.startsWith('http') && !val.startsWith(prefix)) {
				el.setAttribute(attr, prefix + val.replace(/^\.?\//, ''));
			}
		});
	}

	const origFetch = window.fetch;
	window.fetch = function (resource, ...args) {
		if (typeof resource === 'string' && !resource.startsWith('http') && !resource.startsWith(prefix)) {
			resource = prefix + resource.replace(/^\.?\//, '');
		}
		return origFetch(resource, ...args);
	};

	const origOpen = XMLHttpRequest.prototype.open;
	XMLHttpRequest.prototype.open = function (method, url, ...args) {
		if (typeof url === 'string' && !url.startsWith('http') && !url.startsWith(prefix)) {
			url = prefix + url.replace(/^\.?\//, '');
		}
		return origOpen.call(this, method, url, ...args);
	};
}
