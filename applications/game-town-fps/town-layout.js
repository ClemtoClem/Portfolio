import * as THREE from "https://esm.sh/three@0.160.0";

export function createGroundAndStreets(scene, texLoader) {
    // Ground & textures
    const groundSize = 400;

    const groundTex = texLoader.load(
        "./applications/game-town-fps/textures/grass.jpg"
    );
    groundTex.wrapS = groundTex.wrapT = THREE.RepeatWrapping;
    groundTex.repeat.set(40, 40);

    const concreteTex = texLoader.load(
        "./applications/game-town-fps/textures/stone.webp"
    );
    concreteTex.wrapS = concreteTex.wrapT = THREE.RepeatWrapping;
    concreteTex.repeat.set(10, 10);

    const groundGeo = new THREE.PlaneGeometry(groundSize, groundSize);
    const groundMat = new THREE.MeshStandardMaterial({
        color: 0x8aa27a,
        roughness: 0.95,
        metalness: 0.0,
        map: groundTex
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Roads
    const roadMat = new THREE.MeshStandardMaterial({
        color: 0x666666,
        roughness: 0.9,
        map: concreteTex
    });

    const roadWidth = 8;
    const roadLength = groundSize;
    const roadGeoLong = new THREE.PlaneGeometry(roadWidth, roadLength);
    const roadGeoWide = new THREE.PlaneGeometry(roadLength, roadWidth);

    const makeRoadLong = (x = 0) => {
        const m = new THREE.Mesh(roadGeoLong, roadMat);
        m.rotation.x = -Math.PI / 2;
        m.position.set(x, 0.01, 0);
        scene.add(m);
        return m;
    };

    const makeRoadWide = (z = 0) => {
        const m = new THREE.Mesh(roadGeoWide, roadMat);
        m.rotation.x = -Math.PI / 2;
        m.position.set(0, 0.011, z);
        scene.add(m);
        return m;
    };

    const road1 = makeRoadLong(0);
    const road2 = makeRoadWide(0);

    const gridOffset = 40;
    const road1L = makeRoadLong(-gridOffset);
    const road1R = makeRoadLong(gridOffset);
    const road2F = makeRoadWide(gridOffset);
    const road2B = makeRoadWide(-gridOffset);

    // Center lines
    const lineMat = new THREE.MeshStandardMaterial({
        color: 0xffe066,
        roughness: 0.7
    });

    const lineGeoLong = new THREE.PlaneGeometry(0.2, roadLength);
    const lineGeoWide = new THREE.PlaneGeometry(roadLength, 0.2);

    const addCenterLinesForLongRoad = (x) => {
        const l1 = new THREE.Mesh(lineGeoLong, lineMat);
        l1.rotation.x = -Math.PI / 2;
        l1.position.set(x + roadWidth * 0.25, 0.0125, 0);
        scene.add(l1);

        const l2 = l1.clone();
        l2.position.x = x - roadWidth * 0.25;
        scene.add(l2);
    };

    const addCenterLinesForWideRoad = (z) => {
        const l1 = new THREE.Mesh(lineGeoWide, lineMat);
        l1.rotation.x = -Math.PI / 2;
        l1.position.set(0, 0.0125, z + roadWidth * 0.25);
        scene.add(l1);

        const l2 = l1.clone();
        l2.position.z = z - roadWidth * 0.25;
        scene.add(l2);
    };

    addCenterLinesForLongRoad(road1.position.x);
    addCenterLinesForLongRoad(road1L.position.x);
    addCenterLinesForLongRoad(road1R.position.x);

    addCenterLinesForWideRoad(road2.position.z);
    addCenterLinesForWideRoad(road2F.position.z);
    addCenterLinesForWideRoad(road2B.position.z);

    // Sidewalks
    const sidewalkMat = new THREE.MeshStandardMaterial({
        color: 0x9a9a9a,
        roughness: 0.95,
        metalness: 0.0
    });

    const sidewalkWidth = 2;
    const sidewalkHeightOffset = 0.012;

    const intersectionsX = [road1.position.x, road1L.position.x, road1R.position.x];
    const intersectionsZ = [road2.position.z, road2F.position.z, road2B.position.z];

    const buildSegments = (fullMin, fullMax, centers, gapSize) => {
        const half = gapSize / 2;
        const bounds = [fullMin];
        centers
            .slice()
            .sort((a, b) => a - b)
            .forEach((c) => {
                bounds.push(c - half, c + half);
            });
        bounds.push(fullMax);

        const segments = [];
        for (let i = 0; i < bounds.length - 1; i += 2) {
            const start = bounds[i];
            const end = bounds[i + 1];
            if (end - start > 0.1) {
                segments.push([start, end]);
            }
        }
        return segments;
    };

    const addSidewalksForLongRoad = (x) => {
        const fullMin = -groundSize / 2;
        const fullMax = groundSize / 2;
        const gapSize = roadWidth;
        const segments = buildSegments(fullMin, fullMax, intersectionsZ, gapSize);

        segments.forEach(([zStart, zEnd]) => {
            const length = zEnd - zStart;
            const centerZ = (zStart + zEnd) / 2;

            const rightGeo = new THREE.PlaneGeometry(sidewalkWidth, length);
            const right = new THREE.Mesh(rightGeo, sidewalkMat);
            right.rotation.x = -Math.PI / 2;
            right.position.set(
                x + roadWidth / 2 + sidewalkWidth / 2,
                sidewalkHeightOffset,
                centerZ
            );
            scene.add(right);

            const leftGeo = new THREE.PlaneGeometry(sidewalkWidth, length);
            const left = new THREE.Mesh(leftGeo, sidewalkMat);
            left.rotation.x = -Math.PI / 2;
            left.position.set(
                x - roadWidth / 2 - sidewalkWidth / 2,
                sidewalkHeightOffset,
                centerZ
            );
            scene.add(left);
        });
    };

    const addSidewalksForWideRoad = (z) => {
        const fullMin = -groundSize / 2;
        const fullMax = groundSize / 2;
        const gapSize = roadWidth;
        const segments = buildSegments(fullMin, fullMax, intersectionsX, gapSize);

        segments.forEach(([xStart, xEnd]) => {
            const length = xEnd - xStart;
            const centerX = (xStart + xEnd) / 2;

            const topGeo = new THREE.PlaneGeometry(length, sidewalkWidth);
            const top = new THREE.Mesh(topGeo, sidewalkMat);
            top.rotation.x = -Math.PI / 2;
            top.position.set(
                centerX,
                sidewalkHeightOffset,
                z + roadWidth / 2 + sidewalkWidth / 2
            );
            scene.add(top);

            const bottomGeo = new THREE.PlaneGeometry(length, sidewalkWidth);
            const bottom = new THREE.Mesh(bottomGeo, sidewalkMat);
            bottom.rotation.x = -Math.PI / 2;
            bottom.position.set(
                centerX,
                sidewalkHeightOffset,
                z - roadWidth / 2 - sidewalkWidth / 2
            );
            scene.add(bottom);
        });
    };

    addSidewalksForLongRoad(road1.position.x);
    addSidewalksForLongRoad(road1L.position.x);
    addSidewalksForLongRoad(road1R.position.x);

    addSidewalksForWideRoad(road2.position.z);
    addSidewalksForWideRoad(road2F.position.z);
    addSidewalksForWideRoad(road2B.position.z);

    // Helpers for street checks
    const roadXs = [road1.position.x, road1L.position.x, road1R.position.x];
    const roadZs = [road2.position.z, road2F.position.z, road2B.position.z];

    const isOnRoad = (x, z) => {
        for (const rx of roadXs) {
            if (Math.abs(x - rx) < roadWidth / 2) return true;
        }
        for (const rz of roadZs) {
            if (Math.abs(z - rz) < roadWidth / 2) return true;
        }
        return false;
    };

    const roadPlusSidewalkHalfWidth = roadWidth / 2 + sidewalkWidth;

    const isInsideStreetOrSidewalk = (x, z) => {
        for (const rx of roadXs) {
            if (Math.abs(x - rx) < roadPlusSidewalkHalfWidth) return true;
        }
        for (const rz of roadZs) {
            if (Math.abs(z - rz) < roadPlusSidewalkHalfWidth) return true;
        }
        return false;
    };

    const isInsideStreetOrSidewalkWithRadius = (x, z, radius) => {
        const band = roadPlusSidewalkHalfWidth + radius;
        for (const rx of roadXs) {
            if (Math.abs(x - rx) < band) return true;
        }
        for (const rz of roadZs) {
            if (Math.abs(z - rz) < band) return true;
        }
        return false;
    };

    const isOnRoadWithRadius = (x, z, radius) => {
        const halfWithRadius = roadWidth / 2 + radius;
        for (const rx of roadXs) {
            if (Math.abs(x - rx) < halfWithRadius) return true;
        }
        for (const rz of roadZs) {
            if (Math.abs(z - rz) < halfWithRadius) return true;
        }
        return false;
    };

    // Invisible street walls (for potential future use; currently not used for collision)
    const streetWalls = [];
    const wallHeight = 4;
    const wallMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.0,
        depthWrite: false
    });

    roadXs.forEach((rx) => {
        const width = roadPlusSidewalkHalfWidth * 2;
        const depth = groundSize;
        const geo = new THREE.BoxGeometry(width, wallHeight, depth);
        const mesh = new THREE.Mesh(geo, wallMat);
        mesh.position.set(rx, wallHeight / 2, 0);
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        scene.add(mesh);
        streetWalls.push(mesh);
    });

    roadZs.forEach((rz) => {
        const width = groundSize;
        const depth = roadPlusSidewalkHalfWidth * 2;
        const geo = new THREE.BoxGeometry(width, wallHeight, depth);
        const mesh = new THREE.Mesh(geo, wallMat);
        mesh.position.set(0, wallHeight / 2, rz);
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        scene.add(mesh);
        streetWalls.push(mesh);
    });

    const streetHelpers = {
        isOnRoad,
        isInsideStreetOrSidewalk,
        isInsideStreetOrSidewalkWithRadius,
        isOnRoadWithRadius
    };

    return {
        ground,
        groundSize,
        roadXs,
        roadZs,
        roadWidth,
        sidewalkWidth,
        roadPlusSidewalkHalfWidth,
        gridOffset,
        streetWalls,
        streetHelpers
    };
}