/**
 * Audio bus.
 *
 *   • Six ambient loops (one per biome) cross-fade based on the player's Y.
 *   • Footstep variations are picked from the surface category.
 *   • One-shot positional plays: `play(name, position)` (no panning, just
 *     attenuated by distance to camera).
 *   • Looped positional sources: `startLoop(name, position) / stopLoop`.
 *
 * The implementation uses plain HTMLAudio for simplicity (no Web Audio
 * graph). This keeps the cost low and matches what the music-reader app
 * already does.
 */
const BASE = './applications/game-backrooms/sounds';

const AMBIENT = {
	house:    'backrooms_amb_house.1',
	hotel:    'backrooms_amb_hotel',
	site:     'backrooms_amb_city',
	hospital: 'backrooms_amb_hospital',
	parking:  'backrooms_amb_parking',
	pool:     'backrooms_amb_pool',
};

const FOOTSTEPS = {
	stone:  ['backrooms_step_stone.1', 'backrooms_step_stone.2', 'backrooms_step_stone.3', 'backrooms_step_stone.4', 'backrooms_step_stone.5'],
	wood:   ['backrooms_step_wood.1', 'backrooms_step_wood.2', 'backrooms_step_wood.3', 'backrooms_step_wood.4', 'backrooms_step_wood.5', 'backrooms_step_wood.6'],
	carpet: ['backrooms_step_carpet.1', 'backrooms_step_carpet.2', 'backrooms_step_carpet.3', 'backrooms_step_carpet.4', 'backrooms_step_carpet.5'],
	metal:  ['backrooms_metal_footstep.1', 'backrooms_metal_footstep.2', 'backrooms_metal_footstep.3'],
	glass:  ['backrooms_step_glass.1', 'backrooms_step_glass.2', 'backrooms_step_glass.3', 'backrooms_step_glass.4'],
	water:  ['backrooms_step_water.1', 'backrooms_step_water.2', 'backrooms_step_water.3'],
};

const ONESHOTS = {
	ding:        'backrooms_elevator_ding',
	creak:       'backrooms_creak',
	drip:        'backrooms_drip',
	buzz:        'backrooms_ligh_buzz',
	vent:        'backrooms_ventilation',
};
const LOOPS = {
	elevator_hum:   'backrooms_elevator_ding', // hum sample missing — use ding as placeholder
	vent_motor:     'backrooms_ventilation_motor',
};

function audio(name) {
	const a = new Audio(`${BASE}/${name}.ogg`);
	a.preload = 'auto';
	return a;
}

export class AudioBus {
	constructor() {
		/** biome → HTMLAudio */
		this.ambient = {};
		for (const [k, file] of Object.entries(AMBIENT)) {
			this.ambient[k] = audio(file);
			this.ambient[k].loop = true;
			this.ambient[k].volume = 0;
		}
		this._currentBiome = null;
		this._footstepTime = 0;
		this._loops = new Map();
		this._cameraPos = { x: 0, y: 0, z: 0 };
	}

	setCameraPos(p) {
		this._cameraPos.x = p.x; this._cameraPos.y = p.y; this._cameraPos.z = p.z;
	}

	/** Start any required loops (user-gesture-gated). */
	start() {
		for (const a of Object.values(this.ambient)) {
			a.play().catch(() => {});
		}
	}

	stop() {
		for (const a of Object.values(this.ambient)) {
			a.pause(); a.currentTime = 0;
		}
		for (const [name, a] of this._loops) {
			a.pause(); a.currentTime = 0;
		}
		this._loops.clear();
	}

	/** Cross-fade the ambience track to match the player's current biome. */
	setBiome(biome) {
		if (biome === this._currentBiome) return;
		for (const [k, a] of Object.entries(this.ambient)) {
			const target = (k === biome) ? 0.6 : 0;
			fadeTo(a, target, 1.2);
		}
		this._currentBiome = biome;
	}

	footstep(surface, dt, walking) {
		if (!walking) { this._footstepTime = 0; return; }
		this._footstepTime += dt;
		if (this._footstepTime < 0.4) return;
		this._footstepTime = 0;
		const list = FOOTSTEPS[surface] || FOOTSTEPS.stone;
		const file = list[(Math.random() * list.length) | 0];
		const a = audio(file);
		a.volume = 0.5;
		a.playbackRate = 0.92 + Math.random() * 0.16;
		a.play().catch(() => {});
	}

	play(name, atWorldPos) {
		const file = ONESHOTS[name];
		if (!file) return;
		const a = audio(file);
		a.volume = this._volumeFor(atWorldPos);
		a.play().catch(() => {});
	}

	startLoop(name, atWorldPos) {
		const file = LOOPS[name];
		if (!file) return;
		if (this._loops.has(name)) return;
		const a = audio(file);
		a.loop = true;
		a.volume = this._volumeFor(atWorldPos);
		a.play().catch(() => {});
		this._loops.set(name, a);
	}

	stopLoop(name) {
		const a = this._loops.get(name);
		if (!a) return;
		fadeTo(a, 0, 0.4, () => { a.pause(); a.currentTime = 0; });
		this._loops.delete(name);
	}

	_volumeFor(pos) {
		if (!pos) return 0.6;
		const dx = pos.x - this._cameraPos.x;
		const dy = pos.y - this._cameraPos.y;
		const dz = pos.z - this._cameraPos.z;
		const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
		return Math.max(0, Math.min(0.8, 0.8 - d / 16));
	}
}

function fadeTo(audio, target, seconds, onEnd) {
	const start = audio.volume;
	const t0 = performance.now();
	const step = () => {
		const dt = (performance.now() - t0) / 1000;
		const t = Math.min(1, dt / seconds);
		audio.volume = start + (target - start) * t;
		if (t < 1) requestAnimationFrame(step);
		else if (onEnd) onEnd();
	};
	step();
}
