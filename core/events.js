/**
 * Scoped event manager.
 * Each app receives a private EventScope that tracks listeners,
 * intervals, animation frames, observers and timers. Calling
 * dispose() removes them all — no leaks when an app window closes.
 */
export class EventScope {
	constructor() {
		this._listeners = []; // {target, type, handler, opts}
		this._intervals = new Set();
		this._timeouts  = new Set();
		this._rafs      = new Set();
		this._observers = new Set();
		this._disposed  = false;
	}

	/** Add an event listener; returns an `off` function. */
	on(target, type, handler, opts) {
		if (!target) return () => {};
		const types = Array.isArray(type) ? type : [type];
		const offs = types.map(t => {
			target.addEventListener(t, handler, opts);
			const rec = { target, type: t, handler, opts };
			this._listeners.push(rec);
			return () => {
				target.removeEventListener(t, handler, opts);
				this._listeners = this._listeners.filter(r => r !== rec);
			};
		});
		return () => offs.forEach(f => f());
	}

	/**
	 * Event delegation. Calls `handler(evt, matchedEl)` when a descendant
	 * of `root` matching `selector` fires `type`.
	 */
	delegate(root, type, selector, handler, opts) {
		return this.on(root, type, (e) => {
			const match = e.target.closest(selector);
			if (match && root.contains(match)) handler(e, match);
		}, opts);
	}

	setInterval(fn, ms) {
		const id = window.setInterval(fn, ms);
		this._intervals.add(id);
		return id;
	}

	clearInterval(id) {
		window.clearInterval(id);
		this._intervals.delete(id);
	}

	setTimeout(fn, ms) {
		const id = window.setTimeout(() => {
			this._timeouts.delete(id);
			fn();
		}, ms);
		this._timeouts.add(id);
		return id;
	}

	clearTimeout(id) {
		window.clearTimeout(id);
		this._timeouts.delete(id);
	}

	requestAnimationFrame(fn) {
		const id = window.requestAnimationFrame((t) => {
			this._rafs.delete(id);
			fn(t);
		});
		this._rafs.add(id);
		return id;
	}

	cancelAnimationFrame(id) {
		window.cancelAnimationFrame(id);
		this._rafs.delete(id);
	}

	observe(observer) {
		this._observers.add(observer);
		return observer;
	}

	dispose() {
		if (this._disposed) return;
		this._disposed = true;
		this._listeners.forEach(({ target, type, handler, opts }) => {
			try { target.removeEventListener(type, handler, opts); } catch (_) {}
		});
		this._listeners = [];
		this._intervals.forEach(id => clearInterval(id)); this._intervals.clear();
		this._timeouts.forEach(id => clearTimeout(id));   this._timeouts.clear();
		this._rafs.forEach(id => cancelAnimationFrame(id)); this._rafs.clear();
		this._observers.forEach(o => { try { o.disconnect(); } catch(_) {} }); this._observers.clear();
	}
}
