/**
 * Tiny ECS used by the Backrooms game.
 *
 * Entities are integer IDs. Components are stored in per-type Maps so
 * lookups are O(1) and "find all entities that have component X" is just
 * iterating its Map's keys.
 *
 *   const ecs = new Ecs();
 *   const e = ecs.create();
 *   ecs.add(e, 'position', { x: 0, y: 0, z: 0 });
 *   ecs.addSystem((dt, ecs) => { … });
 *   ecs.update(0.016);
 */
export class Ecs {
	constructor() {
		this._nextId = 1;
		this.entities = new Set();
		/** @type {Map<string, Map<number, any>>} */
		this.components = new Map();
		this.systems = [];
	}

	create() {
		const id = this._nextId++;
		this.entities.add(id);
		return id;
	}

	destroy(entity) {
		for (const store of this.components.values()) store.delete(entity);
		this.entities.delete(entity);
	}

	add(entity, name, data) {
		let store = this.components.get(name);
		if (!store) {
			store = new Map();
			this.components.set(name, store);
		}
		store.set(entity, data);
		return data;
	}

	get(entity, name) {
		return this.components.get(name)?.get(entity);
	}

	has(entity, name) {
		return this.components.get(name)?.has(entity) === true;
	}

	remove(entity, name) {
		this.components.get(name)?.delete(entity);
	}

	/** Iterate every entity that has ALL the listed components. */
	*query(...names) {
		if (!names.length) { yield* this.entities; return; }
		const stores = names.map(n => this.components.get(n));
		if (stores.some(s => !s)) return;
		// Pick the smallest store to iterate.
		stores.sort((a, b) => a.size - b.size);
		outer: for (const e of stores[0].keys()) {
			for (let i = 1; i < stores.length; i++) {
				if (!stores[i].has(e)) continue outer;
			}
			yield e;
		}
	}

	addSystem(fn) { this.systems.push(fn); return fn; }

	update(dt) {
		for (const sys of this.systems) sys(dt, this);
	}
}
