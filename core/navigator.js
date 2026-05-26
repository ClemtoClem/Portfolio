/**
 * Navigator — Flutter-style route stack scoped to a single app window.
 *
 * Each route is a plain object `{ name?, showHeader?, title?, onPop?, onBack? }`.
 * Calling `push(route)` applies it (toggling header + title). `pop()` runs
 * the route's `onPop` and re-applies the previous one.
 *
 * The app-header back button delegates to `navigator.back()`:
 *   • if `onBack` is set on the top route, it runs first; if it returns
 *     literal `false`, the navigation is cancelled (useful for "confirm
 *     before leaving" prompts).
 *   • else if there is a route on the stack, the top route is popped.
 *   • otherwise the app window is closed.
 *
 * Methods like `setHeaderVisible(false)` give apps direct control without
 * pushing a full route — handy for transient overlays (pause menus,
 * fullscreen views).
 */
export class Navigator {
	constructor({ header, titleEl, defaultTitle, closeApp }) {
		this.header = header;
		this.titleEl = titleEl;
		this.defaultTitle = defaultTitle;
		this.defaultHeaderVisible = true;
		this._closeApp = closeApp;
		/** @type {Array<object>} */
		this.routes = [];
	}

	/** Invoked by the header back button. */
	back() {
		const top = this.routes[this.routes.length - 1];
		if (top?.onBack) {
			let result;
			try { result = top.onBack(); } catch (e) { console.error(e); }
			if (result === false) return;
		}
		if (this.routes.length > 0) this.pop();
		else this._closeApp();
	}

	push(route = {}) {
		this.routes.push(route);
		this._apply(route);
		return route;
	}

	pop() {
		const route = this.routes.pop();
		if (route?.onPop) {
			try { route.onPop(); } catch (e) { console.error(e); }
		}
		const next = this.routes[this.routes.length - 1];
		if (next) this._apply(next);
		else this._restoreDefaults();
		return route;
	}

	/** Clear every pushed route and restore the default header state. */
	reset() {
		while (this.routes.length) this.pop();
	}

	/** Mutate (or apply) the top route — handy without push/pop ceremony. */
	configure(opts) {
		if (this.routes.length === 0) {
			if (opts.showHeader !== undefined) this.setHeaderVisible(opts.showHeader);
			if (opts.title !== undefined) this.setHeaderTitle(opts.title);
			return;
		}
		Object.assign(this.routes[this.routes.length - 1], opts);
		this._apply(this.routes[this.routes.length - 1]);
	}

	setHeaderVisible(visible) {
		if (!this.header) return;
		this.header.classList.toggle('hidden', !visible);
		// Layout changes when the header toggles; let observers re-measure.
		window.dispatchEvent(new Event('resize'));
	}

	setHeaderTitle(title) {
		if (this.titleEl) this.titleEl.textContent = title;
	}

	_apply(route) {
		if (route.showHeader !== undefined) this.setHeaderVisible(route.showHeader);
		if (route.title !== undefined) this.setHeaderTitle(route.title);
	}

	_restoreDefaults() {
		this.setHeaderVisible(this.defaultHeaderVisible);
		this.setHeaderTitle(this.defaultTitle);
	}
}
