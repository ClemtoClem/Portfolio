/**
 * Shell-level concerns: the status-bar clock and the GitHub Pages
 * path-prefix fix. Kept separate so main.js stays small.
 */

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
