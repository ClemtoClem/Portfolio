/**
 * Character configuration + procedural mesh builder.
 *
 * Boxes only (no rigged model), but a flexible config drives every
 * visible part: skin colour, hair, beard, eyes, clothing colours,
 * silhouette (height × build), hat and glasses style.
 *
 * Persisted via the app's scoped Storage under the key "character".
 */
import * as THREE from 'https://esm.sh/three@0.160.0';

export const HAIR_STYLES    = ['none', 'short', 'medium', 'long'];
export const BEARD_STYLES   = ['none', 'stubble', 'full'];
export const HAT_STYLES     = ['none', 'cap', 'widebrim', 'beanie'];
export const GLASSES_STYLES = ['none', 'round', 'square'];
export const BUILDS         = ['slim', 'normal', 'heavy'];

export const DEFAULT_CHARACTER = {
	name:         'Player',
	height:       1.0,             // multiplier 0.85 – 1.15
	build:        'normal',
	skin:         '#e0b89c',
	hairColor:    '#3a2a18',
	hairStyle:    'short',
	beard:        'none',
	eyeColor:     '#3a2a18',
	shirtColor:   '#3498db',
	pantsColor:   '#222',
	shoesColor:   '#111',
	hat:          'none',
	hatColor:     '#222',
	glasses:      'none',
};

export const CHARACTER_SCHEMA = [
	// [field, label-fr, label-en, type, opts]
	{ key: 'name',       fr: 'Nom',                en: 'Name',          type: 'text' },
	{ key: 'height',     fr: 'Taille',             en: 'Height',        type: 'range', min: 0.85, max: 1.15, step: 0.01 },
	{ key: 'build',      fr: 'Carrure',            en: 'Build',         type: 'select', options: BUILDS },
	{ key: 'skin',       fr: 'Couleur de peau',    en: 'Skin colour',   type: 'color' },
	{ key: 'eyeColor',   fr: 'Couleur des yeux',   en: 'Eye colour',    type: 'color' },
	{ key: 'hairStyle',  fr: 'Coupe',              en: 'Hair style',    type: 'select', options: HAIR_STYLES },
	{ key: 'hairColor',  fr: 'Couleur cheveux',    en: 'Hair colour',   type: 'color' },
	{ key: 'beard',      fr: 'Barbe',              en: 'Beard',         type: 'select', options: BEARD_STYLES },
	{ key: 'shirtColor', fr: 'Couleur du haut',    en: 'Shirt colour',  type: 'color' },
	{ key: 'pantsColor', fr: 'Couleur du bas',     en: 'Pants colour',  type: 'color' },
	{ key: 'shoesColor', fr: 'Couleur chaussures', en: 'Shoes colour',  type: 'color' },
	{ key: 'hat',        fr: 'Couvre-chef',        en: 'Hat',           type: 'select', options: HAT_STYLES },
	{ key: 'hatColor',   fr: 'Couleur du couvre-chef', en: 'Hat colour', type: 'color' },
	{ key: 'glasses',    fr: 'Lunettes',           en: 'Glasses',       type: 'select', options: GLASSES_STYLES },
];

export function loadCharacter(storage) {
	return { ...DEFAULT_CHARACTER, ...(storage.get('character', {}) || {}) };
}
export function saveCharacter(storage, config) {
	storage.set('character', { ...DEFAULT_CHARACTER, ...config });
}

/** Build a fresh THREE.Group for the given config. Disposable. */
export function buildCharacterMesh(config) {
	const cfg = { ...DEFAULT_CHARACTER, ...config };
	const root = new THREE.Group();
	root.name = 'character';

	const skin   = new THREE.MeshBasicMaterial({ color: cfg.skin });
	const shirt  = new THREE.MeshBasicMaterial({ color: cfg.shirtColor });
	const pants  = new THREE.MeshBasicMaterial({ color: cfg.pantsColor });
	const shoes  = new THREE.MeshBasicMaterial({ color: cfg.shoesColor });
	const hair   = new THREE.MeshBasicMaterial({ color: cfg.hairColor });
	const eye    = new THREE.MeshBasicMaterial({ color: cfg.eyeColor });
	const hat    = new THREE.MeshBasicMaterial({ color: cfg.hatColor });
	const black  = new THREE.MeshBasicMaterial({ color: 0x111111 });

	// Silhouette multipliers
	const h = cfg.height;
	const w = cfg.build === 'slim' ? 0.85 : cfg.build === 'heavy' ? 1.25 : 1.0;

	const legH = 0.9 * h, legW = 0.22 * w;
	const torsoH = 0.7 * h, torsoW = 0.55 * w;
	const armH = 0.7 * h, armW = 0.18 * w;
	const headSize = 0.32 * Math.min(1.1, h);

	const addBox = (mat, sx, sy, sz, x, y, z) => {
		const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), mat);
		m.position.set(x, y, z);
		root.add(m);
		return m;
	};

	// Legs + shoes
	addBox(pants, legW, legH, 0.28, -0.13, legH / 2, 0);
	addBox(pants, legW, legH, 0.28,  0.13, legH / 2, 0);
	addBox(shoes, legW + 0.04, 0.12, 0.36, -0.13, 0.06, 0.04);
	addBox(shoes, legW + 0.04, 0.12, 0.36,  0.13, 0.06, 0.04);

	// Torso
	addBox(shirt, torsoW, torsoH, 0.3, 0, legH + torsoH / 2, 0);

	// Arms
	const armX = torsoW / 2 + armW / 2 - 0.01;
	addBox(shirt, armW, armH, 0.22, -armX, legH + armH / 2 + 0.04, 0);
	addBox(shirt, armW, armH, 0.22,  armX, legH + armH / 2 + 0.04, 0);
	// Hands
	const handY = legH + 0.04;
	addBox(skin, armW, 0.16, 0.22, -armX, handY, 0);
	addBox(skin, armW, 0.16, 0.22,  armX, handY, 0);

	// Head
	const headY = legH + torsoH + headSize / 2 + 0.05;
	const head = addBox(skin, headSize, headSize, headSize, 0, headY, 0);

	// Eyes
	addBox(eye, 0.05, 0.04, 0.02, -0.07, headY + 0.04, headSize / 2 + 0.001);
	addBox(eye, 0.05, 0.04, 0.02,  0.07, headY + 0.04, headSize / 2 + 0.001);

	// Hair
	if (cfg.hairStyle !== 'none') {
		const hLen = cfg.hairStyle === 'short' ? 0.05
			: cfg.hairStyle === 'medium' ? 0.14 : 0.30;
		addBox(hair, headSize + 0.02, hLen, headSize + 0.02,
			0, headY + headSize / 2 - hLen / 2 + 0.05, 0);
		if (cfg.hairStyle === 'long') {
			addBox(hair, headSize + 0.02, 0.18, 0.05,
				0, headY - 0.08, -headSize / 2 + 0.01);
		}
	}

	// Beard
	if (cfg.beard !== 'none') {
		const bH = cfg.beard === 'stubble' ? 0.03 : 0.10;
		addBox(hair, headSize - 0.05, bH, 0.02, 0, headY - 0.07, headSize / 2 + 0.002);
	}

	// Hat
	if (cfg.hat === 'cap') {
		addBox(hat, headSize + 0.02, 0.08, headSize + 0.02, 0, headY + headSize / 2 + 0.06, 0);
		addBox(hat, headSize + 0.04, 0.02, headSize + 0.12, 0, headY + headSize / 2 + 0.03, headSize / 2 + 0.02);
	} else if (cfg.hat === 'widebrim') {
		addBox(hat, headSize + 0.30, 0.03, headSize + 0.30, 0, headY + headSize / 2 + 0.04, 0);
		addBox(hat, headSize - 0.02, 0.16, headSize - 0.02, 0, headY + headSize / 2 + 0.13, 0);
	} else if (cfg.hat === 'beanie') {
		addBox(hat, headSize + 0.04, 0.18, headSize + 0.04, 0, headY + headSize / 2 + 0.09, 0);
	}

	// Glasses
	if (cfg.glasses !== 'none') {
		const lensSize = cfg.glasses === 'square' ? 0.10 : 0.10;
		const lensH    = cfg.glasses === 'square' ? 0.07 : 0.06;
		addBox(black, lensSize, lensH, 0.02, -0.08, headY + 0.045, headSize / 2 + 0.002);
		addBox(black, lensSize, lensH, 0.02,  0.08, headY + 0.045, headSize / 2 + 0.002);
		addBox(black, 0.06,     0.015, 0.02,  0,    headY + 0.045, headSize / 2 + 0.002);
	}

	root.userData.totalHeight = headY + headSize + 0.05;
	return root;
}
