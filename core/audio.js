/**
 * AudioManager — preloads, caches and plays HTMLAudioElement instances.
 * Used by apps that need shared/background audio. Heavy apps with
 * specific Web Audio needs (visualisers, etc.) still bring their own
 * AudioContext.
 */
export class AudioManager {
	constructor() {
		/** @type {Map<string, HTMLAudioElement>} */
		this.sounds = new Map();
		/** @type {Map<string, Promise<HTMLAudioElement>>} */
		this.loading = new Map();
	}

	async load(id, url) {
		if (this.sounds.has(id)) return this.sounds.get(id);
		if (this.loading.has(id)) return this.loading.get(id);

		const promise = new Promise((resolve, reject) => {
			const audio = new Audio();
			audio.crossOrigin = 'anonymous';
			audio.preload = 'auto';
			audio.addEventListener('canplaythrough', () => {
				this.sounds.set(id, audio);
				this.loading.delete(id);
				resolve(audio);
			}, { once: true });
			audio.addEventListener('error', () => {
				this.loading.delete(id);
				reject(new Error(`Audio failed to load: ${id}`));
			}, { once: true });
			audio.src = url;
		});

		this.loading.set(id, promise);
		return promise;
	}

	has(id) { return this.sounds.has(id); }
	get(id) { return this.sounds.get(id); }

	async play(id) {
		const a = this.sounds.get(id);
		if (!a) return false;
		try { await a.play(); return true; } catch { return false; }
	}

	stop(id) {
		const a = this.sounds.get(id);
		if (!a) return false;
		a.pause();
		a.currentTime = 0;
		return true;
	}
}
