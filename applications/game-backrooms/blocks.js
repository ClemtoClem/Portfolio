/**
 * Block registry.
 *
 * Each block has a numeric id used in the voxel array, plus metadata:
 *   • textures: per-face tile names (top/bottom/side/front)
 *   • solid:    collides with player
 *   • opaque:   hides neighbouring faces (for mesher culling)
 *   • light:    emissive (handled with vertex tint, no real lighting)
 *   • ladder, water, elevator-part flags for special behaviour
 *
 * Texture tile names map to PNG filenames in textures/ via the TEXTURE_TILES
 * list in textures.js.
 */
export const AIR = 0;

export const BLOCKS = {};

function reg(id, name, opts = {}) {
	const def = {
		id, name,
		solid: opts.solid ?? true,
		opaque: opts.opaque ?? true,
		light: opts.light ?? 0,
		ladder: opts.ladder ?? false,
		water: opts.water ?? false,
		category: opts.category ?? null,
		footstep: opts.footstep ?? 'stone',
		// textures: { top, bottom, side, front, back, left, right }
		textures: typeof opts.textures === 'string'
			? { all: opts.textures }
			: (opts.textures || {}),
	};
	BLOCKS[id] = def;
	return def;
}

// ── Generic / fillers ───────────────────────────────────────
reg(1,  'stone',         { textures: 'backrooms_stone',         footstep: 'stone' });
reg(2,  'outer',         { textures: 'backrooms_outer',         footstep: 'stone' });

// ── Niveau -5 — Maison ──────────────────────────────────────
reg(10, 'house_wallpaper', { textures: 'backrooms_house_wallpaper', category: 'house', footstep: 'stone' });
reg(11, 'house_carpet',    { textures: 'backrooms_house_carpet',    category: 'house', footstep: 'carpet' });
reg(12, 'house_ceil',      { textures: 'backrooms_house_ceil',      category: 'house', footstep: 'stone' });
reg(13, 'baseboard',       { textures: 'backrooms_baseboard',       category: 'house', footstep: 'wood' });
reg(14, 'lamp',            { textures: 'backrooms_lamp', light: 14, category: 'house' });
reg(15, 'exit_sign',       { textures: 'backrooms_exit_sign', light: 8, solid: false, opaque: false, category: 'house' });

// ── Niveau -4 — Hôtel ───────────────────────────────────────
reg(20, 'hotel_wallpaper', { textures: 'backrooms_hotel_wallpaper', category: 'hotel' });
reg(21, 'hotel_carpet',    { textures: 'backrooms_hotel_carpet',    category: 'hotel', footstep: 'carpet' });
reg(22, 'hotel_ceil',      { textures: 'backrooms_hotel_ceil',      category: 'hotel' });
reg(23, 'dark_wood',       { textures: 'backrooms_dark_wood',       category: 'hotel', footstep: 'wood' });
reg(24, 'mahogany',        { textures: 'backrooms_mahogany',        category: 'hotel', footstep: 'wood' });

// ── Niveau -3 — Chantier ────────────────────────────────────
reg(30, 'concrete',        { textures: 'backrooms_concrete',        category: 'site' });
reg(31, 'concrete_dark',   { textures: 'backrooms_concrete_dark',   category: 'site' });
reg(32, 'scaffold',        { textures: 'backrooms_scaffold',        category: 'site', solid: false, opaque: false, footstep: 'metal' });
reg(33, 'asphalt',         { textures: 'backrooms_asphalt',         category: 'site' });
reg(34, 'road_line',       { textures: 'backrooms_road_line',       category: 'site' });
reg(35, 'glass',           { textures: 'backrooms_glass', opaque: false, footstep: 'glass' });

// ── Niveau -2 — Hôpital ─────────────────────────────────────
reg(40, 'hospital_wall',   { textures: 'backrooms_hospital_wall',   category: 'hospital' });
reg(41, 'hospital_floor',  { textures: 'backrooms_hospital_floor',  category: 'hospital' });
reg(42, 'hospital_ceil',   { textures: 'backrooms_hospital_ceil',   category: 'hospital' });
reg(43, 'blue_tile',       { textures: 'backrooms_blue_tile',       category: 'hospital' });

// ── Niveau -1 — Parking ─────────────────────────────────────
reg(50, 'pillar',          { textures: 'backrooms_pillar',          category: 'parking' });
reg(51, 'parking_mark',    { textures: 'backrooms_parking_mark',    category: 'parking' });
reg(52, 'ventilation',     { textures: 'backrooms_ventilation', opaque: false, category: 'parking' });

// ── Niveau 0 — Piscine ──────────────────────────────────────
reg(60, 'pool_tile',       { textures: 'backrooms_pool_tile',       category: 'pool' });
reg(61, 'pool_floor',      { textures: 'backrooms_pool_floor',      category: 'pool' });
reg(62, 'water',           { textures: 'backrooms_water', water: true, solid: false, opaque: false, footstep: 'water' });

// ── Common ──────────────────────────────────────────────────
reg(70, 'ladder',          { textures: 'backrooms_ladder_steel', ladder: true, solid: false, opaque: false, footstep: 'metal' });
reg(71, 'wood',            { textures: 'backrooms_wood',  footstep: 'wood' });
reg(72, 'light_wood',      { textures: 'backrooms_light_wood', footstep: 'wood' });

// ── Elevator parts ──────────────────────────────────────────
reg(80, 'elevator_rail',   {
	textures: { top: 'backrooms_elevator_rail_top', bottom: 'backrooms_elevator_rail_top',
		side: 'backrooms_elevator_rail_side', front: 'backrooms_elevator_rail_face',
		back: 'backrooms_elevator_rail_face' },
	footstep: 'metal',
});
reg(81, 'elevator_cable', {
	textures: { top: 'backrooms_elevator_cable_top', bottom: 'backrooms_elevator_cable_top',
		side: 'backrooms_elevator_cable', front: 'backrooms_elevator_cable',
		back: 'backrooms_elevator_cable' },
	opaque: false, solid: false, footstep: 'metal',
});
reg(82, 'elevator_motor', {
	textures: { top: 'backrooms_elevator_motor_top', bottom: 'backrooms_elevator_motor_bottom',
		side: 'backrooms_elevator_motor_side', front: 'backrooms_elevator_motor_front',
		back: 'backrooms_elevator_motor_side' },
	footstep: 'metal',
});
reg(83, 'elevator_cabin_wall', {
	textures: 'backrooms_elevator_cabin_wall', footstep: 'metal',
});
reg(84, 'elevator_cabin_door', {
	textures: { top: 'backrooms_elevator_cabin_top', bottom: 'backrooms_elevator_cabin_top',
		side: 'backrooms_elevator_cabin_wall', front: 'backrooms_elevator_cabin_door',
		back: 'backrooms_elevator_cabin_wall' },
	footstep: 'metal',
});
reg(85, 'elevator_cabin_top', {
	textures: 'backrooms_elevator_cabin_top', footstep: 'metal',
});
reg(86, 'elevator_cabin_panel', {
	textures: 'backrooms_elevator_cabin_panel', footstep: 'metal',
});

/** Resolve the texture name for a given face of a block. */
export function blockFaceTexture(blockId, face /* 'top'|'bottom'|'+x'|'-x'|'+z'|'-z' */) {
	const def = BLOCKS[blockId];
	if (!def) return null;
	const t = def.textures;
	if (t.all) return t.all;
	if (face === 'top')    return t.top    ?? t.side ?? t.all;
	if (face === 'bottom') return t.bottom ?? t.side ?? t.all;
	if (face === '+z')     return t.front  ?? t.side ?? t.all;
	if (face === '-z')     return t.back   ?? t.side ?? t.all;
	if (face === '+x')     return t.right  ?? t.side ?? t.all;
	if (face === '-x')     return t.left   ?? t.side ?? t.all;
	return t.side ?? t.all;
}

export function isSolid(blockId) {
	if (blockId === AIR) return false;
	return BLOCKS[blockId]?.solid ?? true;
}

export function isOpaque(blockId) {
	if (blockId === AIR) return false;
	return BLOCKS[blockId]?.opaque ?? true;
}

export function isLadder(blockId) { return BLOCKS[blockId]?.ladder ?? false; }
export function isWater(blockId)  { return BLOCKS[blockId]?.water  ?? false; }
export function footstepGroup(blockId) { return BLOCKS[blockId]?.footstep ?? 'stone'; }
