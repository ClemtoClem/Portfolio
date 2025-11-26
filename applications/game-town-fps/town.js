import * as THREE from "https://esm.sh/three@0.160.0";
import { createGroundAndStreets } from "./town-layout.js";
import { populateBuildings } from "./town-buildings.js";
import { populateProps } from "./town-props.js";
import { addStreetLamps } from "./town-lamps.js";

export function createTown(scene) {
    const texLoader = new THREE.TextureLoader();

    const {
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
    } = createGroundAndStreets(scene, texLoader);

    const spawnSafeRadius = 4.5;

    const { buildings, buildingPositions } = populateBuildings(scene, {
        texLoader,
        groundSize,
        roadXs,
        roadZs,
        roadWidth,
        sidewalkWidth,
        streetHelpers,
        spawnSafeRadius
    });

    const { buildingPositions: finalBuildingPositions } = populateProps(scene, {
        groundSize,
        roadXs,
        roadZs,
        roadWidth,
        sidewalkWidth,
        streetHelpers,
        spawnSafeRadius,
        buildingPositions
    });

    // Currently finalBuildingPositions is not used elsewhere, but returned in case
    // we want it for future logic.
    addStreetLamps(scene, { gridOffset });

    return { ground, buildings, streetWalls };
}