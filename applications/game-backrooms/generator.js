/**
 * Procedural generation for the Backrooms world.
 *
 * Each biome occupies a fixed vertical band; the generator runs over every
 * (x,y,z) cell in a chunk and decides which block to place. Stable hashing
 * (worldSeed + cell coords) makes neighbouring chunks produce coherent
 * walls/doors/ladders without any explicit chunk-stitching pass.
 *
 * Biome bands (per spec — 25 blocks each, separated by 5-block stone):
 *   -5 House    y ∈ [-150 .. -126]
 *   -4 Hotel    y ∈ [-120 ..  -96]
 *   -3 Site     y ∈ [ -90 ..  -66]
 *   -2 Hospital y ∈ [ -60 ..  -36]
 *   -1 Parking  y ∈ [ -30 ..   -6]
 *    0 Pool     y ∈ [   0 ..   24]
 */
import { CHUNK_SIZE, WORLD_Y_MIN, WORLD_Y_MAX } from './world.js';

const S = CHUNK_SIZE;
const FLOOR_H = 5;

// ── Stable hashing ────────────────────────────────────────
export function hash3(seed, x, y, z) {
	let h = (seed ^ 0x9e3779b9) >>> 0;
	h = Math.imul(h ^ x, 0x85ebca6b);
	h = (h ^ (h >>> 13)) >>> 0;
	h = Math.imul(h ^ y, 0xc2b2ae35);
	h = (h ^ (h >>> 16)) >>> 0;
	h = Math.imul(h ^ z, 0x27d4eb2f);
	h = (h ^ (h >>> 13)) >>> 0;
	return h >>> 0;
}
const frac = (h) => (h / 0xffffffff);

export const BIOMES = [
	{ id: 'house',    yMin: -150, yMax: -126 },
	{ id: 'hotel',    yMin: -120, yMax:  -96 },
	{ id: 'site',     yMin:  -90, yMax:  -66 },
	{ id: 'hospital', yMin:  -60, yMax:  -36 },
	{ id: 'parking',  yMin:  -30, yMax:   -6 },
	{ id: 'pool',     yMin:    0, yMax:   24 },
];

export function biomeAt(y) {
	for (const b of BIOMES) if (y >= b.yMin && y <= b.yMax) return b.id;
	return 'stone';
}

function floorInBiome(y, biome) {
	const b = BIOMES.find(x => x.id === biome);
	if (!b) return -1;
	return Math.floor((y - b.yMin) / FLOOR_H);
}
function yInFloor(y, biome) {
	const b = BIOMES.find(x => x.id === biome);
	if (!b) return 0;
	return ((y - b.yMin) % FLOOR_H + FLOOR_H) % FLOOR_H;
}

const ROOMS = {
	house:    { tile: 10, wall: 10, carpet: 11, ceil: 12, baseboard: 13, lamp: 14, exit: 15 },
	hotel:    { tile: 10, wall: 20, carpet: 21, ceil: 22, baseboard: 23, lamp: 14, exit: 15, woodAccent: 24 },
	hospital: { tile: 10, wall: 40, carpet: 41, ceil: 42, baseboard: 43, lamp: 14, exit: 15 },
};

// ── Elevator column placement ────────────────────────────
function hasElevator(seed, biomeId, cellX, cellZ) {
	const h = hash3(seed ^ 0xe1e1, cellX, biomeId.charCodeAt(0), cellZ);
	return (h % 12) === 0;
}

function elevatorCenter(seed, biome, x, z) {
	if (biome === 'house' || biome === 'hotel' || biome === 'hospital') {
		const cellX = Math.floor(x / 10), cellZ = Math.floor(z / 10);
		const lx = ((x % 10) + 10) % 10, lz = ((z % 10) + 10) % 10;
		if (lx === 5 && lz === 5 && hasElevator(seed, biome, cellX, cellZ)) return { cellX, cellZ };
	} else if (biome === 'parking') {
		const cellX = Math.floor(x / 16), cellZ = Math.floor(z / 16);
		const lx = ((x % 16) + 16) % 16, lz = ((z % 16) + 16) % 16;
		if (lx === 8 && lz === 8 && hasElevator(seed, biome, cellX, cellZ)) return { cellX, cellZ };
	} else if (biome === 'site' || biome === 'pool') {
		const cellX = Math.floor(x / 20), cellZ = Math.floor(z / 20);
		const lx = ((x % 20) + 20) % 20, lz = ((z % 20) + 20) % 20;
		if (lx === 10 && lz === 10 && hasElevator(seed, biome, cellX, cellZ)) return { cellX, cellZ };
	}
	return null;
}

function elevatorRail(seed, biome, x, z) {
	if (elevatorCenter(seed, biome, x - 1, z)) return 'left';
	if (elevatorCenter(seed, biome, x + 1, z)) return 'right';
	return null;
}

// Door & ladder helpers (rooms biomes)
function hasNorthDoor(seed, biome, cellX, cellZ) {
	return frac(hash3(seed ^ 0xd00d, biome.charCodeAt(0), cellX, cellZ)) < 0.66;
}
function hasEastDoor(seed, biome, cellX, cellZ) {
	return frac(hash3(seed ^ 0xd0e1, biome.charCodeAt(0), cellX, cellZ)) < 0.66;
}
function hasLadder(seed, biome, cellX, cellZ, floor) {
	return frac(hash3(seed ^ (0x1a4d + floor), biome.charCodeAt(0), cellX, cellZ)) < 0.25;
}

export class BackroomsGenerator {
	constructor(seed = 1337) { this.seed = seed >>> 0; }

	generate(chunk) {
		if (chunk.generated) return;
		const baseX = chunk.cx * S, baseY = chunk.cy * S, baseZ = chunk.cz * S;
		for (let ly = 0; ly < S; ly++) {
			const y = baseY + ly;
			if (y < WORLD_Y_MIN || y > WORLD_Y_MAX) continue;
			for (let lz = 0; lz < S; lz++) {
				for (let lx = 0; lx < S; lx++) {
					const x = baseX + lx, z = baseZ + lz;
					const block = this.sample(x, y, z);
					if (block !== 0) chunk.set(lx, ly, lz, block);
				}
			}
		}
		chunk.generated = true;
		chunk.dirty = true;
	}

	sample(x, y, z) {
		const biome = biomeAt(y);
		if (biome === 'stone') {
			const below = this._biomeBelow(y);
			// Drill an elevator shaft (3-wide column → centre + 2 rails).
			if (below && elevatorCenter(this.seed, below, x, z)) return 0;
			if (below && elevatorRail(this.seed, below, x, z))   return 80;
			return 1;
		}
		if (biome === 'house' || biome === 'hotel' || biome === 'hospital')
			return this._roomsBlock(x, y, z, biome);
		if (biome === 'parking')  return this._parkingBlock(x, y, z);
		if (biome === 'site')     return this._siteBlock(x, y, z);
		if (biome === 'pool')     return this._poolBlock(x, y, z);
		return 0;
	}

	_biomeBelow(y) {
		let best = null;
		for (const b of BIOMES) if (b.yMax < y && (!best || b.yMax > best.yMax)) best = b;
		return best?.id ?? null;
	}

	// ── Rooms biomes (house / hotel / hospital) ───────────
	_roomsBlock(x, y, z, biome) {
		const R = ROOMS[biome];
		const cellX = Math.floor(x / R.tile);
		const cellZ = Math.floor(z / R.tile);
		const lx = ((x % R.tile) + R.tile) % R.tile;
		const lz = ((z % R.tile) + R.tile) % R.tile;
		const floor = floorInBiome(y, biome);
		const yf = yInFloor(y, biome);

		// Elevator column
		if (elevatorCenter(this.seed, biome, x, z)) return 0;
		if (elevatorRail(this.seed, biome, x, z))   return 80;

		const onWestWall  = lx === 0;
		const onSouthWall = lz === 0;
		const wallId = R.wall;

		// Floor slab (with possible ladder hole)
		if (yf === 0) {
			if (floor > 0 && lx === 2 && lz === 2 &&
				hasLadder(this.seed, biome, cellX, cellZ, floor - 1)) {
				return 0;
			}
			return R.carpet;
		}
		// Ceiling slab
		if (yf === FLOOR_H - 1) {
			if (lx === 5 && lz === 5 &&
				frac(hash3(this.seed ^ 0xdada, cellX, floor, cellZ)) < 0.4) return R.lamp;
			return R.ceil;
		}

		// Walls with door openings (2 wide, 3 tall)
		if (onWestWall) {
			const doorHere = hasNorthDoor(this.seed, biome, cellX, cellZ) ||
				hasNorthDoor(this.seed, biome, cellX - 1, cellZ);
			if (doorHere && yf <= FLOOR_H - 2 && lz >= 4 && lz <= 5) return 0;
			if (yf === 1) return R.baseboard;
			if (yf === 3 && lz === 7 &&
				frac(hash3(this.seed ^ 0xe817, cellX, floor, cellZ)) < 0.12) return R.exit;
			return wallId;
		}
		if (onSouthWall) {
			const doorHere = hasEastDoor(this.seed, biome, cellX, cellZ) ||
				hasEastDoor(this.seed, biome, cellX, cellZ - 1);
			if (doorHere && yf <= FLOOR_H - 2 && lx >= 4 && lx <= 5) return 0;
			if (yf === 1) return R.baseboard;
			return wallId;
		}

		// Ladder inside the cell
		if (lx === 2 && lz === 2 &&
			hasLadder(this.seed, biome, cellX, cellZ, floor)) {
			return 70;
		}

		return 0;
	}

	// ── Parking ────────────────────────────────────────────
	_parkingBlock(x, y, z) {
		const yf = yInFloor(y, 'parking');
		const lx = ((x % 16) + 16) % 16;
		const lz = ((z % 16) + 16) % 16;

		if (elevatorCenter(this.seed, 'parking', x, z)) return 0;
		if (elevatorRail(this.seed, 'parking', x, z))   return 80;

		if (yf === 0) {
			if (((lx + 2) % 4 === 0) && lz >= 2 && lz <= 6) return 51;
			return 30;
		}
		if (yf === FLOOR_H - 1) {
			if (lx === 4 && lz === 4) return 14;
			return 30;
		}
		// Pillars at the 4 corners of each 8-block sub-cell
		if ((lx === 4 || lx === 12) && (lz === 4 || lz === 12)) return 50;
		if (lx === 0 || lz === 0) {
			if (yf === FLOOR_H - 2 && (lz === 8 || lx === 8)) return 52;
			return 30;
		}
		return 0;
	}

	// ── Construction site ─────────────────────────────────
	_siteBlock(x, y, z) {
		const yf = yInFloor(y, 'site');
		const floor = floorInBiome(y, 'site');
		const mx = ((x % 24) + 24) % 24;
		const mz = ((z % 24) + 24) % 24;
		const onRoadX = mx < 4;
		const onRoadZ = mz < 4;

		if (onRoadX || onRoadZ) {
			if (yf === 0) {
				if (onRoadX && mz === 12) return 34;
				if (onRoadZ && mx === 12) return 34;
				return 33;
			}
			return 0;
		}

		if (elevatorCenter(this.seed, 'site', x, z)) return 0;
		if (elevatorRail(this.seed, 'site', x, z))   return 80;

		const bx = mx - 4, bz = mz - 4; // 0..19
		const onWall = bx === 0 || bz === 0 || bx === 19 || bz === 19;

		if (yf === 0) return 30;
		if (onWall) {
			if (floor === 0 && yf <= 2 && bz === 0 && bx >= 9 && bx <= 10) return 0;
			if (floor > 0 && yf === 2 && (bx % 4) === 1) return 35;
			if (floor >= 3 && bx === 0) return 32;
			return 30;
		}
		if (bx === 2 && bz === 2) return 70;
		if (yf === FLOOR_H - 1) return 31;
		return 0;
	}

	// ── Pool ──────────────────────────────────────────────
	_poolBlock(x, y, z) {
		const yf = yInFloor(y, 'pool');
		const floor = floorInBiome(y, 'pool');
		const cellX = Math.floor(x / 20), cellZ = Math.floor(z / 20);
		const lx = ((x % 20) + 20) % 20, lz = ((z % 20) + 20) % 20;

		if (elevatorCenter(this.seed, 'pool', x, z)) return 0;
		if (elevatorRail(this.seed, 'pool', x, z))   return 80;

		if (yf === FLOOR_H - 1 && floor === 4) return 60;
		if (floor === 0 && yf === 0) {
			const w = 6 + (hash3(this.seed ^ 0xb0b0, cellX, 0, cellZ) % 7);
			const l = 6 + (hash3(this.seed ^ 0xb1b1, cellX, 0, cellZ) % 9);
			const ox = (20 - w) / 2, oz = (20 - l) / 2;
			if (lx >= ox && lx < ox + w && lz >= oz && lz < oz + l) return 61;
			return 60;
		}
		if (floor === 0 && yf === 1) {
			const w = 6 + (hash3(this.seed ^ 0xb0b0, cellX, 0, cellZ) % 7);
			const l = 6 + (hash3(this.seed ^ 0xb1b1, cellX, 0, cellZ) % 9);
			const ox = (20 - w) / 2, oz = (20 - l) / 2;
			if (lx >= ox + 1 && lx < ox + w - 1 && lz >= oz + 1 && lz < oz + l - 1) return 62;
		}
		return 0;
	}
}

/** Spawn near the middle of the bottom (House) biome. */
export function defaultSpawn() {
	return { x: 5.5, y: -149 + 1.7, z: 5.5 };
}

/** Find every elevator centre near a (cx,cz) chunk pos, for a given biome. */
export function findElevators(seed, biome, cx, cz, radius = 2) {
	const out = [];
	for (let dx = -radius; dx <= radius; dx++) {
		for (let dz = -radius; dz <= radius; dz++) {
			const ox = (cx + dx) * CHUNK_SIZE, oz = (cz + dz) * CHUNK_SIZE;
			for (let z = oz; z < oz + CHUNK_SIZE; z++) {
				for (let x = ox; x < ox + CHUNK_SIZE; x++) {
					if (elevatorCenter(seed, biome, x, z)) {
						out.push({ x, z, biome });
					}
				}
			}
		}
	}
	return out;
}
