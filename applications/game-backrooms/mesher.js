/**
 * Chunk mesher.
 *
 * Walks every voxel and emits the visible cube faces — i.e. those whose
 * outward neighbour is transparent (`!isOpaque`). For each emitted face
 * we push 4 vertices + 2 triangles + per-vertex UVs sampled from the
 * texture atlas, and a per-vertex `light` tint (used by emissive blocks
 * like the lamp / exit sign / motor).
 *
 * `light` is 0..1 per vertex; the shader simply multiplies the texel.
 * We bake "AO-like" ambient occlusion into the same channel: a face whose
 * top has two opaque neighbours gets darker.
 */
import * as THREE from 'https://esm.sh/three@0.160.0';
import { CHUNK_SIZE } from './world.js';
import { AIR, BLOCKS, isOpaque, blockFaceTexture } from './blocks.js';

const S = CHUNK_SIZE;

const FACES = [
	// [normal, vertices (CCW from outside), uv corners, name]
	{ n: [ 1, 0, 0], v: [[1,0,0],[1,0,1],[1,1,1],[1,1,0]], name: '+x' },
	{ n: [-1, 0, 0], v: [[0,0,1],[0,0,0],[0,1,0],[0,1,1]], name: '-x' },
	{ n: [ 0, 1, 0], v: [[0,1,1],[1,1,1],[1,1,0],[0,1,0]], name: 'top' },
	{ n: [ 0,-1, 0], v: [[0,0,0],[1,0,0],[1,0,1],[0,0,1]], name: 'bottom' },
	{ n: [ 0, 0, 1], v: [[1,0,1],[0,0,1],[0,1,1],[1,1,1]], name: '+z' },
	{ n: [ 0, 0,-1], v: [[0,0,0],[1,0,0],[1,1,0],[0,1,0]], name: '-z' },
];

/**
 * Build a geometry for one chunk.
 *
 * @param {Chunk} chunk
 * @param {(x,y,z)=>number} sampleNeighbour — read a block that may be in
 *   another chunk (so faces on chunk borders cull correctly).
 * @param {(name)=>number[4]} uvOf — atlas UV rect lookup.
 */
export function meshChunk(chunk, sampleNeighbour, uvOf) {
	const positions = [];
	const normals   = [];
	const uvs       = [];
	const colors    = [];
	const indices   = [];

	const baseX = chunk.cx * S, baseY = chunk.cy * S, baseZ = chunk.cz * S;
	let vertexCount = 0;

	const getBlock = (x, y, z) => {
		if (x >= 0 && x < S && y >= 0 && y < S && z >= 0 && z < S) {
			return chunk.get(x, y, z);
		}
		return sampleNeighbour(baseX + x, baseY + y, baseZ + z);
	};

	for (let y = 0; y < S; y++) {
		for (let z = 0; z < S; z++) {
			for (let x = 0; x < S; x++) {
				const block = chunk.get(x, y, z);
				if (block === AIR) continue;
				const def = BLOCKS[block];
				if (!def) continue;

				for (const face of FACES) {
					const nx = x + face.n[0], ny = y + face.n[1], nz = z + face.n[2];
					const neighbour = getBlock(nx, ny, nz);
					// Don't draw a face that abuts an opaque block (cull),
					// but DO draw it when the neighbour is the same
					// non-opaque type as us (otherwise two adjacent water
					// blocks would have a hidden border face).
					if (isOpaque(neighbour) && neighbour !== block) continue;
					if (!isOpaque(neighbour) && neighbour === block && !def.opaque) continue;

					const tex = blockFaceTexture(block, face.name);
					const [u0, v0, u1, v1] = uvOf(tex);
					const uvCorners = [
						[u0, v0], [u1, v0], [u1, v1], [u0, v1],
					];

					// Emissive lighting: vertex colour multiplier.
					const emissive = def.light > 0 ? Math.min(1, 0.55 + def.light / 18) : 0.85;
					// Slight per-face tint so the cube reads
					// volumetrically without real lighting.
					const tint =
						face.name === 'top'    ? 1.0 :
						face.name === 'bottom' ? 0.55 :
						face.name === '-z' || face.name === '+x' ? 0.85 :
						0.75;
					const light = def.light > 0 ? emissive : tint;

					for (let i = 0; i < 4; i++) {
						const v = face.v[i];
						positions.push(x + v[0], y + v[1], z + v[2]);
						normals.push(face.n[0], face.n[1], face.n[2]);
						uvs.push(uvCorners[i][0], uvCorners[i][1]);
						colors.push(light, light, light);
					}
					indices.push(
						vertexCount, vertexCount + 1, vertexCount + 2,
						vertexCount, vertexCount + 2, vertexCount + 3
					);
					vertexCount += 4;
				}
			}
		}
	}

	if (vertexCount === 0) return null;

	const geo = new THREE.BufferGeometry();
	geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
	geo.setAttribute('normal',   new THREE.Float32BufferAttribute(normals,   3));
	geo.setAttribute('uv',       new THREE.Float32BufferAttribute(uvs,       2));
	geo.setAttribute('color',    new THREE.Float32BufferAttribute(colors,    3));
	geo.setIndex(indices);
	return geo;
}
