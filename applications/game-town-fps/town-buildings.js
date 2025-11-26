import * as THREE from "https://esm.sh/three@0.160.0";

export function populateBuildings(scene, options) {
    const {
        texLoader,
        groundSize,
        roadXs,
        roadZs,
        roadWidth,
        sidewalkWidth,
        streetHelpers,
        spawnSafeRadius = 4.5
    } = options;

    const { isInsideStreetOrSidewalkWithRadius, isOnRoadWithRadius } = streetHelpers;

    const buildingTex = texLoader.load(
        "./applications/game-town-fps/textures/brick_diffuse.jpg"
    );
    buildingTex.wrapS = buildingTex.wrapT = THREE.RepeatWrapping;
    buildingTex.repeat.set(1.5, 2.5);

    const buildings = [];
    const buildingPositions = [];

    const baseBuildingColors = [0xffcdd2, 0xbbdefb, 0xc8e6c9, 0xffe0b2, 0xd1c4e9];
    const buildingGeo = new THREE.BoxGeometry(8, 12, 8);
    let buildingColorIndex = 0;

    const addBuilding = (x, z, heightMultiplier = 1, scaleXZ = 1, radius = 6) => {
        const color = baseBuildingColors[buildingColorIndex % baseBuildingColors.length];
        buildingColorIndex += 1;

        const mat = new THREE.MeshStandardMaterial({
            color,
            roughness: 0.8,
            metalness: 0.05,
            map: buildingTex
        });

        const mesh = new THREE.Mesh(buildingGeo, mat);
        mesh.scale.set(scaleXZ, heightMultiplier, scaleXZ);

        const collisionHalfSize = 4 * scaleXZ;
        mesh.userData.collisionHalfSize = collisionHalfSize;

        mesh.position.set(x, (12 * heightMultiplier) / 2, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
        buildings.push(mesh);
        buildingPositions.push({ x, z, radius });
    };

    const isTooCloseToOtherBuildings = (x, z, radius) => {
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

    const numBuildings = 44;
    const marginFromEdge = 20;
    const minX = -groundSize / 2 + marginFromEdge;
    const maxX = groundSize / 2 - marginFromEdge;
    const minZ = -groundSize / 2 + marginFromEdge;
    const maxZ = groundSize / 2 - marginFromEdge;

    const centralLimit = 60;
    const cornerHardLimit = 80;

    for (let i = 0; i < numBuildings; i++) {
        let placed = false;
        let attempts = 0;

        let scaleXZ = 1.0;

        while (!placed && attempts < 240) {
            attempts++;

            if (attempts > 160) {
                scaleXZ = 0.8;
            } else if (attempts > 100) {
                scaleXZ = 0.85;
            } else if (attempts > 60) {
                scaleXZ = 0.9;
            }

            const x = THREE.MathUtils.lerp(minX, maxX, Math.random());
            const z = THREE.MathUtils.lerp(minZ, maxZ, Math.random());

            if (x * x + z * z < spawnSafeRadius * spawnSafeRadius) continue;

            const radius = 6 * scaleXZ;

            const ax = Math.abs(x);
            const az = Math.abs(z);
            if (ax > cornerHardLimit || az > cornerHardLimit) continue;
            if (ax > centralLimit && az > centralLimit) continue;

            if (
                isInsideStreetOrSidewalkWithRadius(x, z, radius) ||
                isOnRoadWithRadius(x, z, radius)
            )
                continue;

            if (isTooCloseToOtherBuildings(x, z, radius)) continue;

            const hBase = 1.1 + Math.random() * 0.8;
            const heightMultiplier = hBase * THREE.MathUtils.lerp(0.9, 1.1, scaleXZ);

            addBuilding(x, z, heightMultiplier, scaleXZ, radius);
            placed = true;
        }
    }

    return { buildings, buildingPositions };
}