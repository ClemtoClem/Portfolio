/**
 * Tiny typed wrapper around localStorage.
 * Each app gets a Storage instance keyed by its id, so collisions
 * between apps are impossible.
 */
export class Storage {
	constructor(namespace) {
		this.ns = namespace;
	}

	_key(name) { return this.ns ? `${this.ns}:${name}` : name; }

	get(name, fallback = null) {
		try {
			const raw = localStorage.getItem(this._key(name));
			return raw === null ? fallback : JSON.parse(raw);
		} catch {
			return fallback;
		}
	}

	set(name, value) {
		try {
			localStorage.setItem(this._key(name), JSON.stringify(value));
			return true;
		} catch {
			return false;
		}
	}

	remove(name) {
		localStorage.removeItem(this._key(name));
	}

	/** Iterate every key owned by this namespace. */
	keys() {
		const prefix = this.ns ? `${this.ns}:` : '';
		const out = [];
		for (let i = 0; i < localStorage.length; i++) {
			const k = localStorage.key(i);
			if (!prefix || k.startsWith(prefix)) {
				out.push(prefix ? k.slice(prefix.length) : k);
			}
		}
		return out;
	}
}
