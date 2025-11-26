import * as THREE from "https://esm.sh/three@0.160.0";
import nipplejs from "https://esm.sh/nipplejs@0.9.1";

export class FirstPersonController {
    /**
     * 
     * @param {*} camera 
     * @param {*} domElement 
     * @param {*} groundMesh 
     * @param {*} buildingMeshes 
     */
    constructor(camera, domElement, groundMesh, buildingMeshes = []) {
        this.camera = camera;
        this.domElement = domElement;
        this.groundMesh = groundMesh;
        this.buildingMeshes = buildingMeshes;

        // Movement
        this.moveForward = 0;
        this.moveRight = 0;
        this.velocity = new THREE.Vector3();

        // Base movement settings
        this.baseWalkSpeed = 12; // updated default walk speed
        this.walkSpeed = this.baseWalkSpeed;
        this.sprintMultiplier = 2.0;
        this.movementIntensity = 0.61; // overall movement multiplier

        this.isSprinting = false;

        // Sliding
        this.isSliding = false;
        this.slideDirection = new THREE.Vector3();
        this.slideMomentum = 0;
        this.slideInitialMomentum = 10; // maps walk=1, sprint=2 (slide starts at 10)
        this.slideDecayPerSecond = 4; // lose about 4 per second
        this.slideCooldown = 1.0; // 1 second cooldown between slides
        this.slideCooldownTimer = 0;

        // Jump / gravity
        this.standHeight = 1.7;
        this.verticalVelocity = 0;
        this.gravity = -20;
        this.jumpSpeed = 10;
        this.isOnGround = true;

        // Look
        this.yaw = 0;
        this.pitch = 0;
        this.lookSpeedBase = 0.0025;
        this.lookIntensity = 1.4; // reduced default look sensitivity (30% lower)
        this.touchLookSpeed = 0.004;

        // Keyboard turn (arrow keys)
        this.turnLeft = 0;
        this.turnRight = 0;
        this.lookUp = 0;
        this.lookDown = 0;

        this.isPointerLocked = false;
        this.isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;
        this.externalInteractionActive = false;

        // Hierarchy for rotation
        this.yawObject = new THREE.Object3D();
        this.pitchObject = new THREE.Object3D();
        this.yawObject.add(this.pitchObject);
        this.pitchObject.add(this.camera);
        this.camera.position.set(0, 0, 0); // camera at origin of pitch
        this.yawObject.position.set(0, this.standHeight, 0);

        // Initial view
        this.yaw = 0;
        this.pitch = 0;
        this.updateRotation();

        // External scene access: place player at origin-ish
        if (this.groundMesh) {
            this.yawObject.position.set(0, this.standHeight, 0);
        }

        this.domElement.parentElement.__playerRoot = this.yawObject;

        this._initEvents();
        if (this.isMobile) {
            this._initMobileControls();
        } else {
            this._initDesktopLook();
        }
    }

    getObject() {
        return this.yawObject;
    }

    // Public setters for tuning from UI
    setLookIntensity(value) {
        this.lookIntensity = value;
    }

    setMovementIntensity(value) {
        this.movementIntensity = value;
    }

    setWalkSpeed(value) {
        this.walkSpeed = value;
    }

    setSprintSpeed(value) {
        // sprint speed is absolute; convert to multiplier relative to walkSpeed
        if (this.walkSpeed > 0) {
            this.sprintMultiplier = value / this.walkSpeed;
        }
    }

    setJumpSpeed(value) {
        this.jumpSpeed = value;
    }

    setExternalInteractionActive(flag) {
        this.externalInteractionActive = !!flag;
    }

    startSlide() {
        if (this.isSliding) return;
        if (!this.isOnGround) return;
        // Respect cooldown
        if (this.slideCooldownTimer > 0) return;
        // Only slide if moving at all
        if (this.moveForward === 0 && this.moveRight === 0) return;

        // Direction based on current movement and yaw
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.yawObject.quaternion);
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.yawObject.quaternion);
        this.slideDirection
            .copy(forward)
            .multiplyScalar(this.moveForward)
            .addScaledVector(right, this.moveRight);

        if (this.slideDirection.lengthSq() === 0) return;
        this.slideDirection.normalize();

        this.isSliding = true;
        this.slideMomentum = this.slideInitialMomentum;

        // Lower camera slightly while sliding
        this.camera.position.y = -0.5;
    }

    stopSlide() {
        if (!this.isSliding) return;
        this.isSliding = false;
        this.slideMomentum = 0;
        // Start cooldown when a slide ends
        this.slideCooldownTimer = this.slideCooldown;

        // Reset camera height
        this.camera.position.y = 0;
    }

    updateRotation() {
        const maxPitch = Math.PI / 2 - 0.1;
        this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));
        this.yawObject.rotation.y = this.yaw;
        this.pitchObject.rotation.x = this.pitch;
    }

    _initEvents() {
        // Keyboard
        const onKeyDown = (event) => {
            switch (event.code) {
                case "KeyW":
                    this.moveForward = 1;
                    break;
                case "KeyS":
                    this.moveForward = -1;
                    break;
                case "KeyA":
                    this.moveRight = -1;
                    break;
                case "KeyD":
                    this.moveRight = 1;
                    break;
                case "ArrowUp":
                    event.preventDefault();
                    // inverted: up now maps to lookDown
                    this.lookDown = 1;
                    break;
                case "ArrowDown":
                    event.preventDefault();
                    // inverted: down now maps to lookUp
                    this.lookUp = 1;
                    break;
                case "ArrowLeft":
                    event.preventDefault();
                    // inverted: left now maps to turnRight
                    this.turnRight = 1;
                    break;
                case "ArrowRight":
                    event.preventDefault();
                    // inverted: right now maps to turnLeft
                    this.turnLeft = 1;
                    break;
                case "Space":
                    if (this.isOnGround) {
                        this.verticalVelocity = this.jumpSpeed;
                        this.isOnGround = false;
                        // If you jump while sliding, stop sliding and still get a jump
                        this.stopSlide();
                    }
                    break;
                case "ShiftLeft":
                    this.isSprinting = true;
                    break;
                case "ControlLeft":
                case "ControlRight":
                case "KeyC":
                    // Start a slide if you're sprinting on the ground
                    if (this.isSprinting && this.isOnGround) {
                        this.startSlide();
                    }
                    break;
            }
        };

        const onKeyUp = (event) => {
            switch (event.code) {
                case "KeyW":
                    if (this.moveForward > 0) this.moveForward = 0;
                    break;
                case "KeyS":
                    if (this.moveForward < 0) this.moveForward = 0;
                    break;
                case "KeyA":
                    if (this.moveRight < 0) this.moveRight = 0;
                    break;
                case "KeyD":
                    if (this.moveRight > 0) this.moveRight = 0;
                    break;
                case "ArrowUp":
                    event.preventDefault();
                    // inverted: clear lookDown for ArrowUp
                    this.lookDown = 0;
                    break;
                case "ArrowDown":
                    event.preventDefault();
                    // inverted: clear lookUp for ArrowDown
                    this.lookUp = 0;
                    break;
                case "ArrowLeft":
                    event.preventDefault();
                    // inverted: clear turnRight for ArrowLeft
                    this.turnRight = 0;
                    break;
                case "ArrowRight":
                    event.preventDefault();
                    // inverted: clear turnLeft for ArrowRight
                    this.turnLeft = 0;
                    break;
                case "ShiftLeft":
                    this.isSprinting = false;
                    break;
            }
        };

        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("keyup", onKeyUp);

        this._keyboardListeners = { onKeyDown, onKeyUp };

        // Mobile look via touch drag
        if (this.isMobile) {
            let active = false;
            let lastX = 0;
            let lastY = 0;

            const start = (e) => {
                if (this.externalInteractionActive) return;
                const touch = e.touches[0];
                active = true;
                lastX = touch.clientX;
                lastY = touch.clientY;
            };

            const move = (e) => {
                if (!active || this.externalInteractionActive) return;
                const touch = e.touches[0];
                const dx = touch.clientX - lastX;
                const dy = touch.clientY - lastY;
                lastX = touch.clientX;
                lastY = touch.clientY;

                this.yaw -= dx * this.touchLookSpeed * this.lookIntensity;
                this.pitch -= dy * this.touchLookSpeed * this.lookIntensity;
                this.updateRotation();
            };

            const end = () => {
                active = false;
            };

            this.domElement.addEventListener("touchstart", start, { passive: true });
            this.domElement.addEventListener("touchmove", move, { passive: true });
            this.domElement.addEventListener("touchend", end, { passive: true });
            this.domElement.addEventListener("touchcancel", end, { passive: true });

            this._touchLookListeners = { start, move, end };
        }
    }

    _initDesktopLook() {
        if (this.isMobile) return;

        const onPointerLockChange = () => {
            this.isPointerLocked = document.pointerLockElement === this.domElement;
        };

        const onPointerLockError = () => {
            this.isPointerLocked = false;
        };

        const onMouseDown = (event) => {
            // Left or right click to lock pointer, ignore if external interaction (dragging) is active
            if (event.button !== 0 && event.button !== 2) return;
            if (this.externalInteractionActive) return;
            if (!this.isPointerLocked) {
                this.domElement.requestPointerLock();
            }
        };

        const onMouseMove = (event) => {
            if (!this.isPointerLocked) return;

            const dx = event.movementX || 0;
            const dy = event.movementY || 0;

            const lookSpeed = this.lookSpeedBase * this.lookIntensity;

            this.yaw -= dx * lookSpeed;
            this.pitch -= dy * lookSpeed;
            this.updateRotation();
        };

        // Prevent default context menu so right-click drag feels natural
        this.domElement.addEventListener("contextmenu", (e) => e.preventDefault());

        document.addEventListener("pointerlockchange", onPointerLockChange);
        document.addEventListener("pointerlockerror", onPointerLockError);
        this.domElement.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mousemove", onMouseMove);

        this._desktopLookListeners = {
            onPointerLockChange,
            onPointerLockError,
            onMouseDown,
            onMouseMove
        };
    }

    _initMobileControls() {
        const moveContainer = document.getElementById("joystick-container");
        const lookContainer = document.getElementById("look-joystick-container");
        if (!moveContainer) return;

        moveContainer.style.pointerEvents = "auto";
        if (lookContainer) {
            lookContainer.style.pointerEvents = "auto";
        }

        // Movement joystick (bottom-left)
        const moveJoystick = nipplejs.create({
            zone: moveContainer,
            mode: "static",
            position: { left: "60px", top: "60px" },
            color: "white",
            size: 90
        });

        moveJoystick.on("move", (evt, data) => {
            if (!data.vector) return;
            const { x, y } = data.vector;
            // y: up is -1, down is 1
            this.moveForward = y;
            this.moveRight = x;
        });

        moveJoystick.on("end", () => {
            this.moveForward = 0;
            this.moveRight = 0;
        });

        this._joystick = moveJoystick;

        // Look joystick (bottom-right)
        if (lookContainer) {
            const lookJoystick = nipplejs.create({
                zone: lookContainer,
                mode: "static",
                position: { left: "60px", top: "60px" },
                color: "white",
                size: 90
            });

            const deadZone = 0.1;

            lookJoystick.on("move", (evt, data) => {
                if (!data.vector) return;
                const { x, y } = data.vector;

                const lx = Math.abs(x) > deadZone ? x : 0;
                const ly = Math.abs(y) > deadZone ? y : 0;

                // Horizontal controls yaw (left/right)
                this.turnLeft = lx > 0 ? lx : 0;
                this.turnRight = lx < 0 ? -lx : 0;

                // Vertical controls pitch (up/down)
                // joystick up is -1 => look up
                this.lookUp = ly < 0 ? -ly : 0;
                this.lookDown = ly > 0 ? ly : 0;
            });

            lookJoystick.on("end", () => {
                this.turnLeft = 0;
                this.turnRight = 0;
                this.lookUp = 0;
                this.lookDown = 0;
            });

            this._lookJoystick = lookJoystick;
        }
    }

    // Simple AABB collision against building footprints in XZ
    _resolveCollisions(currentPos, proposedPos) {
        if (!this.buildingMeshes || this.buildingMeshes.length === 0) {
            return proposedPos;
        }

        // Player "radius" in XZ
        const playerHalfSize = 0.6;
        const padding = 0.1;

        let newPos = proposedPos.clone();

        // Resolve X separately
        let testPosX = new THREE.Vector3(newPos.x, currentPos.y, currentPos.z);
        for (const mesh of this.buildingMeshes) {
            const buildingHalfSize =
                (mesh.userData && mesh.userData.collisionHalfSize) || 4.0;
            const totalHalf = buildingHalfSize + playerHalfSize + padding;

            const bx = mesh.position.x;
            const bz = mesh.position.z;
            if (
                Math.abs(testPosX.x - bx) < totalHalf &&
                Math.abs(testPosX.z - bz) < totalHalf
            ) {
                // Block X movement
                testPosX.x = currentPos.x;
                break;
            }
        }

        // Resolve Z separately
        let testPosZ = new THREE.Vector3(testPosX.x, currentPos.y, newPos.z);
        for (const mesh of this.buildingMeshes) {
            const buildingHalfSize =
                (mesh.userData && mesh.userData.collisionHalfSize) || 4.0;
            const totalHalf = buildingHalfSize + playerHalfSize + padding;

            const bx = mesh.position.x;
            const bz = mesh.position.z;
            if (
                Math.abs(testPosZ.x - bx) < totalHalf &&
                Math.abs(testPosZ.z - bz) < totalHalf
            ) {
                // Block Z movement
                testPosZ.z = currentPos.z;
                break;
            }
        }

        return testPosZ;
    }

    update(delta) {
        // Decrease slide cooldown timer
        if (this.slideCooldownTimer > 0) {
            this.slideCooldownTimer -= delta;
            if (this.slideCooldownTimer < 0) this.slideCooldownTimer = 0;
        }

        // Keyboard-based turning with arrow keys
        if (!this.isMobile) {
            const turnSpeed = 1.8 * this.lookIntensity; // radians per second
            const yawDelta = (this.turnRight - this.turnLeft) * turnSpeed * delta;
            const pitchDelta = (this.lookUp - this.lookDown) * turnSpeed * delta;

            if (yawDelta !== 0 || pitchDelta !== 0) {
                this.yaw += yawDelta;
                this.pitch -= pitchDelta; // up arrow should look up
                this.updateRotation();
            }
        } else {
            // On mobile, the same turnLeft/turnRight/lookUp/lookDown values can be driven by the look joystick
            const turnSpeed = 1.8 * this.lookIntensity;
            const yawDelta = (this.turnRight - this.turnLeft) * turnSpeed * delta;
            const pitchDelta = (this.lookUp - this.lookDown) * turnSpeed * delta;

            if (yawDelta !== 0 || pitchDelta !== 0) {
                this.yaw += yawDelta;
                this.pitch -= pitchDelta;
                this.updateRotation();
            }
        }

        // Effective speed based on walk/sprint + overall movement multiplier
        const base = this.walkSpeed;
        const currentSpeed = this.isSprinting
            ? base * this.sprintMultiplier
            : base;
        const speed = currentSpeed * this.movementIntensity;

        // Direction in local space
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(this.yawObject.quaternion);

        const right = new THREE.Vector3(1, 0, 0);
        right.applyQuaternion(this.yawObject.quaternion);

        const moveDir = new THREE.Vector3();
        moveDir.addScaledVector(forward, this.moveForward);
        moveDir.addScaledVector(right, this.moveRight);

        const currentPos = this.yawObject.position.clone();

        if (this.isSliding) {
            // Sliding: momentum-based movement, slightly faster than sprint
            const sprintSpeed = base * this.sprintMultiplier * this.movementIntensity;
            const slideSpeed = sprintSpeed * 1.2 * (this.slideMomentum / this.slideInitialMomentum);

            const moveStep = this.slideDirection
                .clone()
                .multiplyScalar(slideSpeed * delta);

            const proposedPos = currentPos.clone().add(
                new THREE.Vector3(moveStep.x, 0, moveStep.z)
            );

            const resolvedPos = this._resolveCollisions(currentPos, proposedPos);
            this.yawObject.position.x = resolvedPos.x;
            this.yawObject.position.z = resolvedPos.z;

            // Decay momentum
            this.slideMomentum -= this.slideDecayPerSecond * delta;
            if (this.slideMomentum < 6) {
                this.stopSlide();
            }
        } else {
            if (moveDir.lengthSq() > 0) {
                moveDir.normalize();
                const moveStep = moveDir.multiplyScalar(speed * delta);
                const proposedPos = currentPos.clone().add(
                    new THREE.Vector3(moveStep.x, 0, moveStep.z)
                );

                const resolvedPos = this._resolveCollisions(currentPos, proposedPos);
                this.yawObject.position.x = resolvedPos.x;
                this.yawObject.position.z = resolvedPos.z;
            }
        }

        // Vertical movement (jump + gravity)
        const groundY = 0;
        this.verticalVelocity += this.gravity * delta;
        this.yawObject.position.y += this.verticalVelocity * delta;

        const minY = this.standHeight + groundY;
        if (this.yawObject.position.y <= minY) {
            this.yawObject.position.y = minY;
            this.verticalVelocity = 0;
            this.isOnGround = true;
        }
    }
}