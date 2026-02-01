export class AudioManager {
    constructor() {
        // this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // this.gainNode = this.audioContext.createGain();
        // this.gainNode.connect(this.audioContext.destination);

        /** @type {Map<String, HTMLAudioElement>} */
        this.sounds = new Map();
        /** @type {Map<String, HTMLAudioElement>} */
        this.loading = new Map();
    }

    async importMusic(id, url) {
        if (this.sounds.has(id)) {
            return this.sounds.get(id);
        }

        if (this.loading.has(id)) {
            return this.loading.get(id);
        }

        const promise = new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.crossOrigin = "anonymous";

            audio.addEventListener("canplaythrough", () => {
                this.sounds.set(id, audio);
                this.loading.delete(id);
                resolve(audio);
            }, { once: true });

            audio.addEventListener("error", () => {
                this.loading.delete(id);
                reject(new Error(`Échec de l'import de la musique : ${id}`));
            }, { once: true });

            audio.src = url;
            audio.load();
        });

        this.loading.set(id, promise);
        return promise;
    }

    hasMusic(id) {
        return this.sounds.has(id);
    }

    getMusic(id) {
        return this.sounds.get(id);
    }

    async playMusic(id) {
        if (!this.sounds.has(id)) {
            console.error(`Musique "${id}" non importée`);
            return false;
        }

        try {
            await this.sounds.get(id).play();
            return true;
        } catch (e) {
            console.error(`Lecture impossible : "${id}"`, e);
            return false;
        }
    }

    stopMusic(id) {
        if (!this.sounds.has(id)) {
            console.error(`Musique "${id}" non importée`);
            return false;
        }
        try {
            const s = this.sounds.get(id);
            s.pause();
            s.currentTime = 0;
            return true;
        } catch (e) {
            return false;
        }
    }
}
