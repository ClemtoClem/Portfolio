/**
 * Texture atlas.
 *
 * Loads every block texture into a single canvas-backed Texture so the
 * mesher can emit one geometry per chunk with a single material. Each
 * tile is given a fixed-size cell in the atlas grid; the public `uv(name)`
 * returns the [u0, v0, u1, v1] rectangle for a tile.
 */
import * as THREE from 'https://esm.sh/three@0.160.0';

export const TILE = 16;        // each source tile is 16×16
export const PAD  = 1;          // bleed padding so neighbours don't bleed
const CELL = TILE + PAD * 2;    // padded cell size on the atlas

export const TILE_NAMES = [
	'backrooms_stone', 'backrooms_outer',
	'backrooms_house_wallpaper', 'backrooms_house_carpet', 'backrooms_house_ceil',
	'backrooms_baseboard', 'backrooms_lamp', 'backrooms_exit_sign',
	'backrooms_hotel_wallpaper', 'backrooms_hotel_carpet', 'backrooms_hotel_ceil',
	'backrooms_dark_wood', 'backrooms_mahogany', 'backrooms_light_wood', 'backrooms_wood',
	'backrooms_concrete', 'backrooms_concrete_dark', 'backrooms_scaffold',
	'backrooms_asphalt', 'backrooms_road_line', 'backrooms_glass', 'backrooms_glass_detail',
	'backrooms_hospital_wall', 'backrooms_hospital_floor', 'backrooms_hospital_ceil', 'backrooms_blue_tile',
	'backrooms_pillar', 'backrooms_parking_mark', 'backrooms_ventilation',
	'backrooms_pool_tile', 'backrooms_pool_floor', 'backrooms_water',
	'backrooms_ladder_steel',
	'backrooms_elevator_rail_top', 'backrooms_elevator_rail_side', 'backrooms_elevator_rail_face',
	'backrooms_elevator_cable', 'backrooms_elevator_cable_top',
	'backrooms_elevator_motor_top', 'backrooms_elevator_motor_bottom',
	'backrooms_elevator_motor_side', 'backrooms_elevator_motor_front',
	'backrooms_elevator_cabin_wall', 'backrooms_elevator_cabin_door',
	'backrooms_elevator_cabin_top', 'backrooms_elevator_cabin_panel',
];

/**
 * Build the atlas asynchronously. Resolves with `{ texture, uv(name) }`.
 */
export async function buildAtlas(basePath = './applications/game-backrooms/textures') {
	// Square grid that fits every tile.
	const n = Math.ceil(Math.sqrt(TILE_NAMES.length));
	const px = n * CELL;
	const canvas = document.createElement('canvas');
	canvas.width = px; canvas.height = px;
	const ctx = canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;
	// Pink default so missing tiles are visible during dev.
	ctx.fillStyle = '#ff00ff';
	ctx.fillRect(0, 0, px, px);

	/** name → {u0, v0, u1, v1} (in texture coordinates) */
	const uvs = new Map();

	await Promise.all(TILE_NAMES.map(async (name, i) => {
		const col = i % n, row = Math.floor(i / n);
		const x = col * CELL + PAD;
		const y = row * CELL + PAD;
		try {
			const img = await loadImage(`${basePath}/${name}.png`);
			// Paint the image then bleed one pixel on each side so mipmaps
			// / NearestFilter sampling don't catch neighbouring tiles.
			ctx.drawImage(img, x - 1, y, TILE + 2, TILE);
			ctx.drawImage(img, x, y - 1, TILE, TILE + 2);
			ctx.drawImage(img, x, y, TILE, TILE);
		} catch (e) {
			console.warn(`backrooms: failed to load ${name}`, e);
		}
		const u0 =  x          / px;
		const u1 = (x + TILE)  / px;
		// Atlas is built top-down but three.js UV origin is bottom-left.
		const v1 = 1 - (y          / px);
		const v0 = 1 - ((y + TILE) / px);
		uvs.set(name, [u0, v0, u1, v1]);
	}));

	const texture = new THREE.CanvasTexture(canvas);
	texture.magFilter = THREE.NearestFilter;
	texture.minFilter = THREE.NearestFilter;
	texture.generateMipmaps = false;
	texture.colorSpace = THREE.SRGBColorSpace;

	function uv(name) {
		return uvs.get(name) || uvs.get('backrooms_outer') || [0, 0, 1, 1];
	}
	return { texture, uv };
}

function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}
