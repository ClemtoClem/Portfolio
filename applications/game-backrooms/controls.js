/**
 * First-person controller for the Backrooms voxel world.
 *
 *   • WASD / ZQSD or virtual joystick to walk.
 *   • Mouse / touch drag to look. Pointer-locked on desktop click.
 *   • Space = jump (or climb ladder upward).
 *   • Ladders: vertical motion when player is colliding with a ladder
 *     block and either pressing forward or W.
 *   • Water: gravity is halved, vertical control via Space / Ctrl.
 *
 * Collisions use a swept-AABB against the voxel grid (per-axis resolution).
 */
import * as THREE from 'https://esm.sh/three@0.160.0';
import { isSolid, isLadder, isWater } from './blocks.js';

const PLAYER_RADIUS = 0.32;
const PLAYER_HEIGHT = 1.75;
const EYE_OFFSET    = 1.65;
const STEP_HEIGHT   = 0.55;
const GRAVITY       = -22;
const WALK_SPEED    = 4.5;
const SPRINT_MULT   = 1.7;
const JUMP_SPEED    = 8.2;
const SWIM_SPEED    = 3;

const THIRD_DISTANCE = 3.5;
const THIRD_HEIGHT   = 0.5;
export const VIEW_MODES = ['first', 'third-back', 'third-front'];

export class FirstPersonController {
	constructor(camera, domElement, world) {
		this.camera     = camera;
		this.domElement = domElement;
		this.world      = world;

		this.yaw   = 0;
		this.pitch = 0;
		this.viewMode = 'first';

		// `yawObject` lives at the player's feet and rotates with yaw. The
		// character body is attached to it via `bodyMount` so it follows the
		// player. The camera is placed manually each frame on the scene root
		// — that decouples third-person camera math from the head pitch.
		this.yawObject = new THREE.Object3D();
		this.bodyMount = new THREE.Group();
		this.yawObject.add(this.bodyMount);

		this.position = this.yawObject.position;
		this.velocity = new THREE.Vector3();

		this.input = { f: 0, b: 0, l: 0, r: 0, jump: false, sprint: false, down: false };
		this.lookDx = 0; this.lookDy = 0;
		this.lookSpeed = 0.0025;

		this.onGround = false;
		this.onLadder = false;
		this.inWater  = false;
		this.controlsExternal = false; // disabled while in an elevator

		this._bindKeyboard();
		this._bindPointer();
	}

	get object() { return this.yawObject; }

	setPosition(x, y, z) {
		this.yawObject.position.set(x, y, z);
		this.velocity.set(0, 0, 0);
	}

	/**
	 * If the player is overlapping any solid block (because chunk generation
	 * placed a wall, ceiling or elevator at the spawn point), bump them up
	 * one block at a time until they're in clear air. Caller should make
	 * sure the chunks around the spawn have already been generated.
	 */
	ensureNotStuck(maxLift = 30) {
		for (let i = 0; i < maxLift; i++) {
			if (!this._collides(this.position)) return;
			this.position.y += 1;
		}
	}

	pause()  { this._paused = true; }
	resume() { this._paused = false; }

	setViewMode(mode) {
		if (!VIEW_MODES.includes(mode)) return;
		this.viewMode = mode;
		this.bodyMount.visible = mode !== 'first';
	}
	cycleView() {
		const i = (VIEW_MODES.indexOf(this.viewMode) + 1) % VIEW_MODES.length;
		this.setViewMode(VIEW_MODES[i]);
	}

	dispose() {
		this._unbind?.();
	}

	update(dt) {
		if (this._paused) return;
		this._applyLook();
		if (this.controlsExternal) return;

		const px = this.position.x, py = this.position.y, pz = this.position.z;
		this.onLadder = this._touchesLadder(px, py, pz);
		this.inWater  = isWater(this.world.getBlock(Math.floor(px), Math.floor(py - 1.2), Math.floor(pz)))
		             || isWater(this.world.getBlock(Math.floor(px), Math.floor(py - 0.4), Math.floor(pz)));

		const f = this.input.f - this.input.b;
		const r = this.input.r - this.input.l;
		const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
		const right   = new THREE.Vector3( Math.cos(this.yaw), 0, -Math.sin(this.yaw));
		const wish = new THREE.Vector3()
			.addScaledVector(forward, f)
			.addScaledVector(right,   r);
		if (wish.lengthSq() > 0) wish.normalize();

		const speed = (this.input.sprint ? WALK_SPEED * SPRINT_MULT : WALK_SPEED);
		this.velocity.x = wish.x * speed;
		this.velocity.z = wish.z * speed;

		if (this.onLadder) {
			const climb = (f !== 0) ? Math.sign(f) * Math.max(0.4, -Math.sin(this.pitch))
			                        : (this.input.jump ? 1 : this.input.down ? -1 : 0);
			this.velocity.y = climb * 3.2;
		} else if (this.inWater) {
			this.velocity.y += GRAVITY * 0.25 * dt;
			if (this.input.jump) this.velocity.y = SWIM_SPEED;
			else if (this.input.down) this.velocity.y = -SWIM_SPEED;
		} else {
			this.velocity.y += GRAVITY * dt;
			if (this.input.jump && this.onGround) this.velocity.y = JUMP_SPEED;
		}
		if (this.velocity.y < -30) this.velocity.y = -30;

		this._moveAxis('x', this.velocity.x * dt);
		this._moveAxis('z', this.velocity.z * dt);
		this.onGround = false;
		this._moveAxis('y', this.velocity.y * dt);
	}

	_moveAxis(axis, delta) {
		if (delta === 0) return;
		const newPos = this.position.clone();
		newPos[axis] += delta;
		if (this._collides(newPos)) {
			if ((axis === 'x' || axis === 'z') && this.onGround) {
				const stepUp = newPos.clone();
				stepUp.y += STEP_HEIGHT;
				if (!this._collides(stepUp)) {
					this.position.copy(stepUp);
					return;
				}
			}
			if (axis === 'y') {
				if (delta < 0) this.onGround = true;
				this.velocity.y = 0;
			} else {
				this.velocity[axis] = 0;
			}
			return;
		}
		this.position.copy(newPos);
	}

	_collides(pos) {
		const minX = Math.floor(pos.x - PLAYER_RADIUS);
		const maxX = Math.floor(pos.x + PLAYER_RADIUS);
		const minY = Math.floor(pos.y);
		const maxY = Math.floor(pos.y + PLAYER_HEIGHT);
		const minZ = Math.floor(pos.z - PLAYER_RADIUS);
		const maxZ = Math.floor(pos.z + PLAYER_RADIUS);
		for (let y = minY; y <= maxY; y++) {
			for (let z = minZ; z <= maxZ; z++) {
				for (let x = minX; x <= maxX; x++) {
					if (isSolid(this.world.getBlock(x, y, z))) return true;
				}
			}
		}
		return false;
	}

	_touchesLadder(x, y, z) {
		for (let dy = 0; dy <= 1; dy++) {
			for (let dx = -1; dx <= 1; dx++) {
				for (let dz = -1; dz <= 1; dz++) {
					if (isLadder(this.world.getBlock(
						Math.floor(x + dx * 0.4), Math.floor(y + dy), Math.floor(z + dz * 0.4)))) {
						return true;
					}
				}
			}
		}
		return false;
	}

	_applyLook() {
		this.yaw   -= this.lookDx * this.lookSpeed;
		this.pitch -= this.lookDy * this.lookSpeed;
		this.pitch = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, this.pitch));
		this.lookDx = 0; this.lookDy = 0;
		this.yawObject.rotation.y = this.yaw;
		this._updateCamera();
	}

	/**
	 * Place the camera in world space. Called every frame from _applyLook.
	 *
	 *   first       → at eye level, look along (yaw, pitch)
	 *   third-back  → behind & above the player, look at the head
	 *   third-front → in front & above the player, look at the head
	 *
	 * In third-person modes pitch lifts/lowers the camera (orbit), so it
	 * still acts as a vertical look control.
	 */
	_updateCamera() {
		const px = this.position.x, py = this.position.y, pz = this.position.z;
		const headX = px;
		const headY = py + EYE_OFFSET;
		const headZ = pz;

		// Player forward in world space (yaw=0 ⇒ -Z).
		const fx = -Math.sin(this.yaw);
		const fz = -Math.cos(this.yaw);

		if (this.viewMode === 'first') {
			this.camera.position.set(headX, headY, headZ);
			// three.js default camera looks toward -Z; rotation order YXZ so
			// yaw doesn't tip the horizon when pitched up.
			this.camera.rotation.order = 'YXZ';
			this.camera.rotation.set(this.pitch, this.yaw, 0);
			return;
		}

		// In third-person, raise the orbit slightly with pitch (clamped).
		const elev = THIRD_HEIGHT - this.pitch * 1.5;
		const dist = THIRD_DISTANCE;
		const sign = this.viewMode === 'third-back' ? -1 : 1;
		this.camera.position.set(
			headX + fx * dist * sign,
			headY + elev,
			headZ + fz * dist * sign,
		);
		this.camera.lookAt(headX, headY - 0.1, headZ);
	}

	_bindKeyboard() {
		const down = (e) => {
			if (this._paused === true) return;
			switch (e.code) {
				case 'KeyW': case 'ArrowUp':   case 'KeyZ': this.input.f = 1; break;
				case 'KeyS': case 'ArrowDown':              this.input.b = 1; break;
				case 'KeyA': case 'ArrowLeft': case 'KeyQ': this.input.l = 1; break;
				case 'KeyD': case 'ArrowRight':             this.input.r = 1; break;
				case 'Space':         this.input.jump   = true; e.preventDefault(); break;
				case 'ControlLeft':   this.input.down   = true; break;
				case 'ShiftLeft':     this.input.sprint = true; break;
				case 'KeyC':          this.cycleView();         break;
			}
		};
		const up = (e) => {
			switch (e.code) {
				case 'KeyW': case 'ArrowUp':   case 'KeyZ': this.input.f = 0; break;
				case 'KeyS': case 'ArrowDown':              this.input.b = 0; break;
				case 'KeyA': case 'ArrowLeft': case 'KeyQ': this.input.l = 0; break;
				case 'KeyD': case 'ArrowRight':             this.input.r = 0; break;
				case 'Space':         this.input.jump   = false; break;
				case 'ControlLeft':   this.input.down   = false; break;
				case 'ShiftLeft':     this.input.sprint = false; break;
			}
		};
		document.addEventListener('keydown', down);
		document.addEventListener('keyup',   up);
		this._unbindKeyboard = () => {
			document.removeEventListener('keydown', down);
			document.removeEventListener('keyup',   up);
		};
	}

	_bindPointer() {
		const el = this.domElement;
		let locked = false;
		let dragging = false;
		let lastX = 0, lastY = 0;
		let pid = null;

		const onClick = () => {
			if (this._paused) return;
			if (el.requestPointerLock) el.requestPointerLock();
		};
		const onLockChange = () => {
			locked = (document.pointerLockElement === el);
		};
		const onMove = (e) => {
			if (this._paused) return;
			if (locked) {
				this.lookDx += e.movementX;
				this.lookDy += e.movementY;
			}
		};

		const onPDown = (e) => {
			if (this._paused) return;
			if (locked) return;
			pid = e.pointerId;
			dragging = true;
			lastX = e.clientX; lastY = e.clientY;
			try { el.setPointerCapture(e.pointerId); } catch (_) {}
		};
		const onPMove = (e) => {
			if (this._paused) return;
			if (dragging && e.pointerId === pid) {
				this.lookDx += (e.clientX - lastX);
				this.lookDy += (e.clientY - lastY);
				lastX = e.clientX; lastY = e.clientY;
			}
		};
		const onPUp = (e) => {
			if (dragging && e.pointerId === pid) {
				dragging = false; pid = null;
				try { el.releasePointerCapture(e.pointerId); } catch (_) {}
			}
		};

		el.addEventListener('click',       onClick);
		document.addEventListener('pointerlockchange', onLockChange);
		document.addEventListener('mousemove', onMove);
		el.addEventListener('pointerdown', onPDown);
		el.addEventListener('pointermove', onPMove);
		el.addEventListener('pointerup',   onPUp);
		el.addEventListener('pointercancel', onPUp);

		this._unbindPointer = () => {
			el.removeEventListener('click', onClick);
			document.removeEventListener('pointerlockchange', onLockChange);
			document.removeEventListener('mousemove', onMove);
			el.removeEventListener('pointerdown', onPDown);
			el.removeEventListener('pointermove', onPMove);
			el.removeEventListener('pointerup', onPUp);
			el.removeEventListener('pointercancel', onPUp);
			if (document.pointerLockElement === el) document.exitPointerLock();
		};
		this._unbind = () => {
			this._unbindKeyboard?.();
			this._unbindPointer?.();
		};
	}
}
