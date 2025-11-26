import * as THREE from "https://esm.sh/three@0.160.0";

export function addStreetLamps(scene, options) {
    const { gridOffset } = options;

    const lampGroup = new THREE.Group();
    const poleGeo = new THREE.CylinderGeometry(0.15, 0.15, 4, 8);
    const poleMat = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        metalness: 0.6,
        roughness: 0.4
    });
    const headGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({
        color: 0xfff8e1,
        emissive: 0xffe8a0,
        emissiveIntensity: 0.8
    });

    const makeLamp = (x, z) => {
        const pole = new THREE.Mesh(poleGeo, poleMat);
        const head = new THREE.Mesh(headGeo, headMat);
        pole.position.set(0, 2, 0);
        head.position.set(0, 4.2, 0);

        const lamp = new THREE.Group();
        lamp.add(pole);
        lamp.add(head);
        lamp.position.set(x, 0, z);
        lamp.castShadow = true;
        lamp.receiveShadow = false;
        lampGroup.add(lamp);
    };

    makeLamp(6, 6);
    makeLamp(-6, 6);
    makeLamp(6, -6);
    makeLamp(-6, -6);

    makeLamp(gridOffset + 6, 6);
    makeLamp(-gridOffset - 6, 6);
    makeLamp(6, gridOffset + 6);
    makeLamp(6, -gridOffset - 6);

    scene.add(lampGroup);
}

