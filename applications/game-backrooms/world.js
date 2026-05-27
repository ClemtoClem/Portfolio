/**
 * Voxel world.
 *
 * The world is infinite in X/Z and bounded in Y. It is divided into
 * fixed-size chunks (`CHUNK_SIZE`³). Blocks inside a chunk live in a flat
 * Uint16Array indexed by `x + z * S + y * S * S` (Y-major, so all blocks
 * of one horizontal slice are contiguous — friendlier for meshing).
 *
 * Chunks are keyed by their integer chunk coords: `cx|cy|cz`.
 *
 *   const w = new World();
 *   w.setBlock(0, 0, 0, 1);        // world coords
 *   w.getBlock(0, 0, 0);           // 1
 *
 * Listeners can react to chunk changes:
 *   w.onChunkDirty((cx, cy, cz) => …)
 */
import { AIR } from './blocks.js';

export const CHUNK_SIZE = 16;
const S = CHUNK_SIZE;
const VOL = S * S * S;

/** Vertical bounds of the world (in blocks). Spec: 6 biomes stacked. */
export const WORLD_Y_MIN = -160;
export const WORLD_Y_MAX = 32;

export class Chunk {
	constructor(cx, cy, cz) {
		this.cx = cx; this.cy = cy; this.cz = cz;
		this.blocks = new Uint16Array(VOL);
		this.generated = false;
		this.dirty = true; // mesh needs rebuild
	}

	idx(lx, ly, lz) { return lx + lz * S + ly * S * S; }

	get(lx, ly, lz) { return this.blocks[this.idx(lx, ly, lz)]; }
	set(lx, ly, lz, v) {
		const i = this.idx(lx, ly, lz);
		if (this.blocks[i] !== v) {
			this.blocks[i] = v;
			this.dirty = true;
		}
	}
}

export class World {
	constructor() {
		/** @type {Map<string, Chunk>} */
		this.chunks = new Map();
		this._dirtyListeners = [];
	}

	static key(cx, cy, cz) { return `${cx}|${cy}|${cz}`; }

	chunkAt(cx, cy, cz, createIfMissing = false) {
		const k = World.key(cx, cy, cz);
		let c = this.chunks.get(k);
		if (!c && createIfMissing) {
			c = new Chunk(cx, cy, cz);
			this.chunks.set(k, c);
		}
		return c;
	}

	hasChunk(cx, cy, cz) {
		return this.chunks.has(World.key(cx, cy, cz));
	}

	dropChunk(cx, cy, cz) {
		this.chunks.delete(World.key(cx, cy, cz));
	}

	/** World → chunk coords. Handles negative blocks correctly. */
	worldToChunk(x, y, z) {
		return [Math.floor(x / S), Math.floor(y / S), Math.floor(z / S)];
	}
	worldToLocal(x, y, z) {
		return [((x % S) + S) % S, ((y % S) + S) % S, ((z % S) + S) % S];
	}

	getBlock(x, y, z) {
		if (y < WORLD_Y_MIN || y > WORLD_Y_MAX) return AIR;
		const [cx, cy, cz] = this.worldToChunk(x, y, z);
		const c = this.chunkAt(cx, cy, cz);
		if (!c) return AIR;
		const [lx, ly, lz] = this.worldToLocal(x, y, z);
		return c.get(lx, ly, lz);
	}

	setBlock(x, y, z, v) {
		if (y < WORLD_Y_MIN || y > WORLD_Y_MAX) return;
		const [cx, cy, cz] = this.worldToChunk(x, y, z);
		const c = this.chunkAt(cx, cy, cz, true);
		const [lx, ly, lz] = this.worldToLocal(x, y, z);
		c.set(lx, ly, lz, v);
		this._markDirty(cx, cy, cz);
		// Neighbouring chunks need a re-mesh if the change touched their border.
		if (lx === 0)     this._markDirty(cx - 1, cy, cz);
		if (lx === S - 1) this._markDirty(cx + 1, cy, cz);
		if (ly === 0)     this._markDirty(cx, cy - 1, cz);
		if (ly === S - 1) this._markDirty(cx, cy + 1, cz);
		if (lz === 0)     this._markDirty(cx, cy, cz - 1);
		if (lz === S - 1) this._markDirty(cx, cy, cz + 1);
	}

	/** Fast in-chunk setter — caller passes a pre-fetched Chunk. */
	setLocal(chunk, lx, ly, lz, v) { chunk.set(lx, ly, lz, v); }

	onChunkDirty(fn) { this._dirtyListeners.push(fn); }
	_markDirty(cx, cy, cz) {
		const c = this.chunkAt(cx, cy, cz);
		if (c) {
			c.dirty = true;
			for (const fn of this._dirtyListeners) fn(cx, cy, cz);
		}
	}
}
