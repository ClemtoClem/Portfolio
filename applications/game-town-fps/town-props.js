import * as THREE from "https://esm.sh/three@0.160.0";
import { RoundedBoxGeometry } from "https://esm.sh/three@0.160.0/examples/jsm/geometries/RoundedBoxGeometry.js";

export function populateProps(scene, options) {
    const {
        groundSize,
        roadXs,
        roadZs,
        roadWidth,
        sidewalkWidth,
        streetHelpers,
        spawnSafeRadius = 4.5,
        buildingPositions
    } = options;

    const {
        isInsideStreetOrSidewalkWithRadius,
        isOnRoadWithRadius
    } = streetHelpers;

    const propGroup = new THREE.Group();
    scene.add(propGroup);

    const treeTrunkGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.2, 8);
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.9 });
    const treeCrownGeo = new THREE.SphereGeometry(0.9, 12, 12);

    const bushGeo = new RoundedBoxGeometry(1.2, 0.8, 1.2, 3, 0.18);

    const benchSeatGeo = new THREE.BoxGeometry(2.2, 0.4, 0.7);
    const benchBackGeo = new THREE.BoxGeometry(2.2, 0.7, 0.2);
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x795548, roughness: 0.7 });

    const makeLeafMaterial = () => {
        const color = new THREE.Color();
        const h = THREE.MathUtils.lerp(0.16, 0.33, Math.random());
        const s = THREE.MathUtils.lerp(0.35, 0.55, Math.random());
        const l = THREE.MathUtils.lerp(0.4, 0.6, Math.random());
        color.setHSL(h, s, l);
        return new THREE.MeshStandardMaterial({ color, roughness: 0.85 });
    };

    const isTooCloseToOther = (x, z, radius) => {
        for (const pos of buildingPositions) {
            const dx = x - pos.x;
            const dz = z - pos.z;
            const minDist = radius + pos.radius + 2;
            if (dx * dx + dz * dz < minDist * minDist) {
                return true;
            }
        }
        return false;
    };

    const marginFromEdge = 20;
    const minX = -groundSize / 2 + marginFromEdge;
    const maxX = groundSize / 2 - marginFromEdge;
    const minZ = -groundSize / 2 + marginFromEdge;
    const maxZ = groundSize / 2 - marginFromEdge;

    const centralLimit = 60;
    const cornerHardLimit = 80;

    // Trees & bushes
    const numProps = 80;
    for (let i = 0; i < numProps; i++) {
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < 160) {
            attempts++;

            const x = THREE.MathUtils.lerp(minX, maxX, Math.random());
            const z = THREE.MathUtils.lerp(minZ, maxZ, Math.random());

            if (x * x + z * z < spawnSafeRadius * spawnSafeRadius) continue;

            const ax = Math.abs(x);
            const az = Math.abs(z);
            if (ax > cornerHardLimit || az > cornerHardLimit) continue;
            if (ax > centralLimit && az > centralLimit) continue;

            const radius = 0.8 + Math.random() * 0.6;

            if (
                isInsideStreetOrSidewalkWithRadius(x, z, radius) ||
                isOnRoadWithRadius(x, z, radius)
            )
                continue;

            if (isTooCloseToOther(x, z, radius)) continue;

            const r = Math.random();
            if (r < 0.7) {
                // Tree
                const trunk = new THREE.Mesh(treeTrunkGeo, treeTrunkMat);
                const crownMat = makeLeafMaterial();
                const crown = new THREE.Mesh(treeCrownGeo, crownMat);
                const tree = new THREE.Group();

                trunk.position.set(0, 0.6, 0);
                crown.position.set(0, 1.5, 0);
                tree.add(trunk);
                tree.add(crown);

                const offsetSign = Math.random() < 0.5 ? -1 : 1;
                const offsetMag = Math.pow(Math.random(), 2);
                const scaleFactor = THREE.MathUtils.clamp(2 + offsetSign * offsetMag, 1, 3);
                tree.scale.set(scaleFactor, scaleFactor, scaleFactor);

                tree.position.set(x, 0, z);
                tree.traverse((o) => {
                    if (o.isMesh) {
                        o.castShadow = true;
                        o.receiveShadow = true;
                    }
                });
                propGroup.add(tree);

                const trunkCollisionRadius = 0.5 * scaleFactor;
                trunk.userData.collisionHalfSize = trunkCollisionRadius;
                // trees (trunk) have collision
                // reused by controller for collisions
                // buildings-like array will include these trunks
                // 'buildingPositions' stores spacing radius
                const spacingRadius = Math.max(radius, 1.2 * scaleFactor);
                buildingPositions.push({ x, z, radius: spacingRadius });
            } else {
                // Bush (no collision)
                const bushMat = makeLeafMaterial();
                const bush = new THREE.Mesh(bushGeo, bushMat);

                const bushScale = THREE.MathUtils.lerp(0.7, 1.3, Math.random());
                bush.scale.set(bushScale, bushScale, bushScale);
                bush.position.set(x, 0.4 * bushScale, z);
                bush.castShadow = true;
                bush.receiveShadow = true;
                propGroup.add(bush);

                buildingPositions.push({ x, z, radius });
            }

            placed = true;
        }
    }

    // Benches (no collision) – random on grass
    const benchRadius = 2.0;
    const numBenches = 20;

    for (let i = 0; i < numBenches; i++) {
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < 160) {
            attempts++;

            const x = THREE.MathUtils.lerp(minX, maxX, Math.random());
            const z = THREE.MathUtils.lerp(minZ, maxZ, Math.random());

            const ax = Math.abs(x);
            const az = Math.abs(z);
            if (ax > cornerHardLimit || az > cornerHardLimit) continue;
            if (ax > centralLimit && az > centralLimit) continue;

            if (x * x + z * z < spawnSafeRadius * spawnSafeRadius) continue;
            if (
                isInsideStreetOrSidewalkWithRadius(x, z, benchRadius) ||
                isOnRoadWithRadius(x, z, benchRadius)
            ) {
                continue;
            }

            if (isTooCloseToOther(x, z, benchRadius)) continue;

            const bench = new THREE.Group();

            const seat = new THREE.Mesh(benchSeatGeo, benchMat);
            seat.position.set(0, 0.2, 0);
            seat.castShadow = true;
            seat.receiveShadow = true;

            const back = new THREE.Mesh(benchBackGeo, benchMat);
            back.position.set(0, 0.75, -0.2);
            back.castShadow = true;
            back.receiveShadow = true;

            bench.add(seat);
            bench.add(back);

            bench.position.set(x, 0, z);
            propGroup.add(bench);

            buildingPositions.push({ x, z, radius: benchRadius });

            placed = true;
        }
    }

    return { propGroup, buildingPositions };
}