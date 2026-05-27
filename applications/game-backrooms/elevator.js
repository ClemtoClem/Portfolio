/**
 * Elevator system.
 *
 * The world generator carves elevator columns through each biome. This
 * system tracks one elevator per shaft (created lazily when the player
 * gets close), spawns a visible cabin mesh, and animates rides between
 * floors. Cabin movement takes over the FP controller for the duration
 * of the ride.
 *
 * Triggering: pressing E (or right-click) when the player is inside or
 * directly facing the elevator column.
 */
import * as THREE from 'https://esm.sh/three@0.160.0';
import { biomeAt, BIOMES } from './generator.js';
import { CHUNK_SIZE } from './world.js';

const CABIN_SPEED = 4;            // blocks per second (spec said 0.5/s → too slow for play)
const CABIN_BIOME_HEIGHT = 25;
const STONE_TRANSITION   = 5;

export class ElevatorSystem {
	/**
	 * @param {THREE.Scene} scene
	 * @param {FirstPersonController} controller
	 * @param {(name)=>number[4]} uvOf — texture atlas lookup (unused for now).
	 * @param {AudioBus} audio
	 */
	constructor(scene, controller, uvOf, audio) {
		this.scene = scene;
		this.controller = controller;
		this.uvOf = uvOf;
		this.audio = audio;

		/** key `${x}|${z}|${biome}` → cabin mesh */
		this.cabins = new Map();
		this.active = null; // currently-riding elevator state

		this._group = new THREE.Group();
		scene.add(this._group);
	}

	/** Returns the shaft the player is standing in, or null. */
	playerShaft() {
		const p = this.controller.position;
		const seed = this._seed;
		const here = biomeAt(Math.floor(p.y));
		const candidates = (here === 'stone') ? this._neighbourBiomes(p.y) : [here];
		for (const biome of candidates) {
			const center = nearestShaftCentre(seed, biome, Math.floor(p.x), Math.floor(p.z));
			if (center && Math.abs(center.x + 0.5 - p.x) < 1.5 && Math.abs(center.z + 0.5 - p.z) < 1.5) {
				return { x: center.x, z: center.z, biome };
			}
		}
		return null;
	}

	_neighbourBiomes(y) {
		const out = [];
		for (const b of BIOMES) {
			if (Math.abs(b.yMax - y) <= STONE_TRANSITION + 1) out.push(b.id);
			if (Math.abs(b.yMin - y) <= STONE_TRANSITION + 1) out.push(b.id);
		}
		return [...new Set(out)];
	}

	bindSeed(seed) { this._seed = seed >>> 0; }

	/** Trigger an elevator ride if the player is at a shaft. */
	trigger() {
		if (this.active) return;
		const shaft = this.playerShaft();
		if (!shaft) return;
		const biome = BIOMES.find(b => b.id === shaft.biome);
		if (!biome) return;

		const py = this.controller.position.y;
		// Decide destination: closer to bottom floor → go up; closer to top → go down.
		const midY = (biome.yMin + biome.yMax) / 2;
		const going = py < midY ? 'up' : 'down';
		const fromY = Math.round(py);
		// Destination is the floor of the adjacent biome.
		let destY = null;
		if (going === 'up') {
			const above = BIOMES.find(b => b.yMin > biome.yMax);
			if (above) destY = above.yMin + 1; // stand on the floor of next biome
		} else {
			const below = BIOMES.find(b => b.yMax < biome.yMin);
			if (below) destY = below.yMax - 4; // stand on top floor of lower biome
		}
		if (destY === null) {
			this.audio.play('ding', this.controller.position);
			return;
		}

		// Build a cabin mesh if not already present.
		const cabin = this._getOrSpawnCabin(shaft.x, shaft.z, fromY);

		this.active = {
			shaft,
			fromY,
			destY,
			cabin,
			t: 0,
			direction: going === 'up' ? 1 : -1,
		};

		this.controller.controlsExternal = true;
		this.controller.velocity.set(0, 0, 0);
		// Snap player to centre of cabin
		this.controller.setPosition(shaft.x + 0.5, fromY + 0.1, shaft.z + 0.5);
		this.audio.play('ding', this.controller.position);
		this.audio.startLoop('elevator_hum', this.controller.position);
	}

	update(dt) {
		if (!this.active) return;
		const a = this.active;
		const step = CABIN_SPEED * dt * a.direction;
		const newY = a.cabin.position.y + step;
		const reached = (a.direction > 0 && newY >= a.destY) ||
		                (a.direction < 0 && newY <= a.destY);

		if (reached) {
			a.cabin.position.y = a.destY;
			this.controller.setPosition(
				a.shaft.x + 0.5,
				a.destY + 0.1,
				a.shaft.z + 1.5, // step out forward
			);
			this.controller.controlsExternal = false;
			this.audio.stopLoop('elevator_hum');
			this.audio.play('ding', this.controller.position);
			this.active = null;
			return;
		}
		a.cabin.position.y = newY;
		this.controller.setPosition(a.shaft.x + 0.5, newY + 0.1, a.shaft.z + 0.5);
	}

	_getOrSpawnCabin(x, z, y) {
		const key = `${x}|${z}`;
		if (this.cabins.has(key)) {
			const mesh = this.cabins.get(key);
			mesh.position.y = y;
			return mesh;
		}
		const cabin = buildCabinMesh();
		cabin.position.set(x + 0.5, y, z + 0.5);
		this._group.add(cabin);
		this.cabins.set(key, cabin);
		return cabin;
	}

	dispose() {
		this.scene.remove(this._group);
	}
}

function nearestShaftCentre(seed, biome, x, z) {
	// Reuse the generator's elevatorCenter logic by scanning ±2 around player.
	const pitch = (biome === 'parking') ? 16 : (biome === 'site' || biome === 'pool') ? 20 : 10;
	const cx = Math.floor((x + pitch / 2) / pitch);
	const cz = Math.floor((z + pitch / 2) / pitch);
	const center = (pitch === 10) ? 5 : (pitch === 16 ? 8 : 10);
	const wx = cx * pitch + center;
	const wz = cz * pitch + center;
	// Stable elevator presence test (matches generator.hasElevator).
	const h = hash3(seed ^ 0xe1e1, cx, biome.charCodeAt(0), cz);
	if ((h % 12) !== 0) return null;
	return { x: wx, z: wz };
}

function hash3(seed, x, y, z) {
	let h = (seed ^ 0x9e3779b9) >>> 0;
	h = Math.imul(h ^ x, 0x85ebca6b);
	h = (h ^ (h >>> 13)) >>> 0;
	h = Math.imul(h ^ y, 0xc2b2ae35);
	h = (h ^ (h >>> 16)) >>> 0;
	h = Math.imul(h ^ z, 0x27d4eb2f);
	h = (h ^ (h >>> 13)) >>> 0;
	return h >>> 0;
}

function buildCabinMesh() {
	const group = new THREE.Group();
	const mat = new THREE.MeshBasicMaterial({ color: 0x8a8a8a });
	const door = new THREE.MeshBasicMaterial({ color: 0xb8b8b8 });
	const top = new THREE.MeshBasicMaterial({ color: 0xffffaa });
	// 1×2×1 box
	const back  = new THREE.Mesh(new THREE.PlaneGeometry(1, 2), mat);
	back.position.set(0, 1, -0.5); back.rotation.y = Math.PI;
	const left  = new THREE.Mesh(new THREE.PlaneGeometry(1, 2), mat);
	left.position.set(-0.5, 1, 0); left.rotation.y =  Math.PI / 2;
	const right = new THREE.Mesh(new THREE.PlaneGeometry(1, 2), mat);
	right.position.set( 0.5, 1, 0); right.rotation.y = -Math.PI / 2;
	const ceil = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), top);
	ceil.position.set(0, 2, 0); ceil.rotation.x = Math.PI / 2;
	group.add(back, left, right, ceil);
	return group;
}
