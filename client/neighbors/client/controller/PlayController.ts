import {Module} from "oak-studio/lib/model/module/Module";
import HeaderView from '../view/Header.ejs';
import MapView from '../view/Map.ejs';
import {ejs, generateStateTemplate} from "../app";
import {ApplicationRouter} from "oak-studio/lib/model/ApplicationRouter";
import {Surface} from "oak-studio/lib/model/rendering/Surface";
import {VAOHandler} from "oak-studio/lib/model/rendering/VAOHandler";
import {VAOLightHandler} from "oak-studio/lib/model/rendering/VAOLightHandler";
import {VBOHandler} from "oak-studio/lib/model/rendering/VBOHandler";
import VAOCameraVertexGLSL from "oak-studio/lib/model/rendering/VAO/VAOCameraVertex.glsl";
import VAOCameraFragmentGLSL from "oak-studio/lib/model/rendering/VAO/VAOCameraFragment.glsl";
import VAOLightVertexGLSL from "oak-studio/lib/model/rendering/VAO/VAOLightVertex.glsl";
import VAOLightFragmentGLSL from "oak-studio/lib/model/rendering/VAO/VAOLightFragment.glsl";
import {GameSurfaceGL} from "oak-studio/lib/model/rendering/GameSurfaceGL";
import {Camera} from "oak-studio/lib/model/interactive/Camera";
import {Vec3} from "oak-studio/lib/model/math/Vec3";

import Test00 from "../ply/Test05.ply";
import {BufferedMesh} from "oak-studio/lib/model/rendering/BufferedMesh";
import {FakePhysics} from "oak-studio/lib/model/interactive/FakePhysics";
import {QuickInput, QuickInputEvent} from "oak-studio/lib/model/interactive/QuickInput";
import {arrayMedian, DegToRad} from "oak-studio/lib/model/Utils";
import {RGB} from "oak-studio/lib/model/RGB";
import {MeshCharacterOptions} from "oak-studio/lib/model/rendering/MeshCharacterOptions";
import {MeshCharacterGenerator} from "oak-studio/lib/model/rendering/MeshCharacterGenerator";
import {
    getTransformsForMesh, MeshBook01, MeshDagger01,
    MeshHumanFace01,
    MeshHumanWizardHat01
} from "oak-studio/lib/model/rendering/HumanArmatureTransforms";
import {Vec2} from "../../../../lib/model/math/Vec2";
import {HumanoidArmatureTransform} from "../../../../lib/model/rendering/Armature";
import {GamepadInput} from "../../../../lib/model/interactive/GamepadInput";


export const GameSurfaceGLCamera = new Camera();
GameSurfaceGLCamera.fov = 20;
GameSurfaceGLCamera.zoom = 40;
GameSurfaceGLCamera.from = Vec3.fromArray([0, 2, 2]);
GameSurfaceGLCamera.to = Vec3.fromArray([0, 0, 1]);
GameSurfaceGLCamera.up = Vec3.fromArray([0, 0, 1]);

export const GameSurfaceGLLight = new Camera();
GameSurfaceGLLight.from = Vec3.fromArray([4, 2, 5]);
GameSurfaceGLLight.to = Vec3.fromArray([0, 0, 0]);
GameSurfaceGLLight.up = Vec3.fromArray([0, 0, 1]);

export const VAOCamera = new VAOHandler();
VAOCamera.setProgram(false, VAOCameraVertexGLSL, VAOCameraFragmentGLSL);

export const VAOLight = new VAOLightHandler();
VAOLight.setProgram(false, VAOLightVertexGLSL, VAOLightFragmentGLSL);

export const VBOStatic = new VBOHandler();
export const VBODynamic = new VBOHandler();
VBODynamic.setDynamic(true);
export const VBOCasters = new VBOHandler();


export const gameSurface2D = new Surface();
export let gameSurfaceGL;


let red = new RGB(235, 5, 5);
let skin = new RGB(241, 177, 148);
let blue = new RGB(5, 5, 230);
let brown = new RGB(143, 96, 65);

let head = new Vec3();
head.set(0.3, 0.3, 0.35);

let torso = new Vec3();
torso.set(0.5, 0.25, 0.4);

let hip = new Vec3();
hip.set(0.48, 0.25, 0.1);

let leg = new Vec3();
leg.set(0.15, 0.15, 0.4);

let arm = new Vec3();
arm.set(0.12, .12, 0.5);

const characterOptions: MeshCharacterOptions = {
    color: {arm: skin, head: skin, leg: brown, torso: red, hip: brown},
    sizes: {arm, head, leg, legSpread: 0.18, hip, torso},
};
export const _MeshCharacter = new MeshCharacterGenerator(characterOptions);


export const MeshTest00 = new BufferedMesh();
MeshTest00.parsePLY(Test00);


const fakePhysics = new FakePhysics();

const gamepadController = new GamepadInput();

enum EquipSlot {
    NONE = 0,
    HEAD = 1,
    ARM1 = 2,
    ARM2 = 3,
    TORSO = 4,
    CAPE = 5,
    HIP = 6,
    LEGS = 7,
    HAND1 = 8,
    HAND2 = 9
}

class GameItem {
    equipable: boolean | EquipSlot;
}

class EquipmentController {

}

export class HealthAttribute {
    current: number = 5;
    max: number = 5;
    effects: any[] = [];

    constructor(health?) {
        if (health) {
            this.current = health.current;
            this.max = health.max;
            this.effects = health.effects;
        }
    }
}


class CharacterController {
    attacking: number;
    equipment: EquipmentController;
    inventory: GameItem[];
    health: HealthAttribute;
    jumpHeight:number = 0.6;

    constructor() {
        this.attacking = 0;
        this.equipment = new EquipmentController();
        this.inventory = [];
        this.health = new HealthAttribute();
    }

    callAttack() {
        if (this.attacking) {
            return false;
        }
        this.attacking = Date.now();
        window.setTimeout(() => {
            this.attacking = 0;
        }, 250);
    }

    getAttackPercent() {
        return (Date.now() - this.attacking) / 250;
    }
}

export class HealthBarHelper {
    health: HealthAttribute;
    element;
    filler;
    fillerSecondary;
    span;
    lastMax;
    lastHealth;

    constructor(health: HealthAttribute) {
        this.health = health;

        this.element = document.createElement('div');
        this.element.className = "healthbar";

        this.fillerSecondary = document.createElement("div");
        this.fillerSecondary.className = "filler secondary";

        this.filler = document.createElement("div");
        this.filler.className = "filler";

        this.span = document.createElement("span");
        this.span.className = "";


        this.element.appendChild(this.fillerSecondary);
        this.element.appendChild(this.filler);
        this.element.appendChild(this.span);

        this.updateHealth(health, true);

    }

    setElement(el) {
        try {
            el.removeChild(this.element);
        } catch (e) {

        }
        el.appendChild(this.element);
        this.updateHealth(this.health, true);
    }

    updateHealth(health: HealthAttribute, force?) {
        this.health = health;

        if (force || !this.lastHealth || this.lastHealth.current !== this.health.current || this.lastHealth.max != this.health.max) {
            this.render();
        }
        this.lastHealth = new HealthAttribute(this.health);
    }

    render() {
        let width = (window.innerWidth > 680) ? 200 : 100;

        let addW = 0;
        if (this.health.current <= 0) {

            let pct = 0;
            this.filler.style.width = Math.floor(pct * 100) + "%";
            this.fillerSecondary.style.width = Math.floor(pct * 100) + "%";
            this.span.innerHTML = `<i class="fa-solid fa-fw fa-sm fa-skull"></i> ${this.health.current} / ${this.health.max}`;
            if (!this.element.classList.contains("dead")) {
                this.element.classList.add("dead")
            }
        } else {
            if (this.element.classList.contains("dead")) {
                this.element.classList.remove("dead")
            }
            if (this.health.current <= this.health.max) {
                this.lastMax = 0;
                let pct = (this.health.current / this.health.max);
                this.filler.style.width = Math.floor(pct * 100) + "%";
                this.fillerSecondary.style.width = Math.floor(pct * 100) + "%";
                this.span.innerHTML = `<i class="fa-solid fa-fw fa-sm fa-${pct < 0.4 ? "heart-crack" : "heart"}"></i> ${this.health.current} / ${this.health.max}`;
            } else {
                this.lastMax = Math.max(this.lastMax, this.health.current);
                let pct = ((this.health.max) / (this.lastMax));
                addW = this.lastMax - this.health.max;
                this.filler.style.width = Math.floor(pct * 100) + "%";
                let _pctSecondary = (this.health.current - this.health.max) / (this.lastMax - this.health.max);
                let pct2 = pct + ((1 - pct) * _pctSecondary);
                this.fillerSecondary.style.width = Math.floor(pct2 * 100) + "%";
                this.span.innerHTML = `<i class="fa-solid fa-fw fa-sm fa-heart-circle-plus"></i> ${this.health.current} / ${this.health.max}`;
            }

        }
        this.element.style.width = (width + (addW * 20)) + "px";

        return addW;
    }
}


function overlayTransforms(anim1, anim2, props): HumanoidArmatureTransform {
    let a = anim1;

    props.forEach((prop) => {
        if (!a[prop]) {
            a[prop] = {};
        }
        if (anim2[prop].rotate) {
            a[prop].rotate = anim2[prop].rotate;
        }
    });

    return a;
}

const characterController = new CharacterController();
let healthBarHelper;
const physicsPlayer = fakePhysics.createBall();

const CONTEXT_MENU_OPEN = false;

let MAPS_UI_WINDOWS = {};

function createToggleWindow(name: string) {
    let w = document.getElementById("footer-window-" + name);
    let open = false;
    MAPS_UI_WINDOWS[name] = false;
    //let window_status = MAPS_UI_WINDOWS[name];
    //if (window_status) {

    function setActive(el, v) {
        if (v) {
            el.classList.add('selected');
        } else {
            el.classList.remove('selected');
        }
    }

    if (!MAPS_UI_WINDOWS[name]) {
        w.style.display = "none";
    } else {
        w.style.display = "block";
    }
    //}


    let t = document.getElementById("toggle-" + name);
    setActive(t, MAPS_UI_WINDOWS[name]);
    t.onclick = async () => {
        open = !MAPS_UI_WINDOWS[name];
        // if (window_status) {
        MAPS_UI_WINDOWS[name] = open;//.set(open);
        //}
        if (!open) {
            w.style.display = "none";
        } else {
            w.style.display = "block";
        }
        setActive(t, MAPS_UI_WINDOWS[name]);
    }

}


export class PlayController extends Module {

    quickInput: QuickInput;

    use = (app?: ApplicationRouter) => {
        let self = this;

        return new Promise<void>(function (resolve, reject) {
            document.body.innerHTML = (app.render(HeaderView + MapView, generateStateTemplate(), ejs.render, self));
            app.focusModule(self);
            resolve();
        });

    };

    focus = () => {

        gameSurface2D.setElement(document.getElementById('canvas-surface-2d'));
        gameSurface2D.maximize();
        gameSurface2D.fill("red");

        if (!gameSurfaceGL) {
            gameSurfaceGL = new GameSurfaceGL(document.getElementById('canvas-surface-gl'));
            console.warn("FOCUS", gameSurfaceGL);
            gameSurfaceGL.setupCanvas();
            gameSurfaceGL.initWebGL();
            gameSurfaceGL.maximize(true);
        } else {
            console.log('game surface already exists, inject onto page?', gameSurfaceGL);
            let a = document.getElementById('canvas-surface-gl');
            let p = a.parentNode;
            p.removeChild(a);
            p.appendChild(gameSurfaceGL.canvas);
        }

        createToggleWindow('spells');
        createToggleWindow('map');


        this.quickInput = new QuickInput(gameSurfaceGL.canvas, {
            key: (event: QuickInputEvent) => {
                console.info("KEY", event.key);

                if (event.key === "Space" && physicsPlayer.onGround) {
                    physicsPlayer.velocity.z = characterController.jumpHeight;
                }

            },
            tap: (event: QuickInputEvent) => {
                if (CONTEXT_MENU_OPEN) {
                    return
                }

                console.log('TAP EVENT', event);
                //physicsPlayer.velocity.z = 1;
                characterController.callAttack();
                console.log(characterController);

            },
            context: (event: QuickInputEvent) => {
                if (CONTEXT_MENU_OPEN) {
                    return
                }

                /*
                                GameSurfaceGLCamera.projection.set(GameSurfaceGLCamera);
                                let worldPos = GameSurfaceGLCamera.projection.toWorld(this.gameSurfaceGL, event.context, GameSurfaceGLCamera.getFromWithUserZoomPositionRotation());

                                const context = async () => {
                                    let actions = await getContextActions(this.mapManager, worldPos, this.selectedSpellUUID, this.selectedPrefabUUID, AppCache.getAccount().mapUUID, character.uuid);
                                    console.log("AVAILABLE ACTIONS FROM XONTEXT", actions);
                                    let selection: any = await contextMenu(this.quickInput, (new Vec2().copy(event.context)), actions);
                                    console.log('CLOSED CONTEXT MENU');
                                    //mapController.contextLastClosed = Date.now();
                                    //mapController.contextOpen = false;
                                    if (selection) {
                                        let input = ContextActionToMapInput(selection);
                                        console.log("ACTION", input);
                                        socket.send({input});
                                    }
                                }
                                context();*/
            }, drag: (event: QuickInputEvent) => {
                //console.log('DRAG', event);

                if (event.drag) {
                    GameSurfaceGLCamera.userRotation.z += DegToRad(event.drag.x);
                    GameSurfaceGLCamera.userRotation.x -= DegToRad(event.drag.y);
                    GameSurfaceGLCamera.userRotation.x = arrayMedian([-0.7, GameSurfaceGLCamera.userRotation.x, 0.7])
                    // keep_rotating = Date.now();
                }
            },
            scale: (event: QuickInputEvent) => {
                if (CONTEXT_MENU_OPEN) {
                    return
                }

                GameSurfaceGLCamera.zoom /= event.scale;
                GameSurfaceGLCamera.zoom = arrayMedian([4, GameSurfaceGLCamera.zoom, 400]);
                console.log('SCALE', event);
            },
            wheel: (event: QuickInputEvent) => {
                if (CONTEXT_MENU_OPEN) {
                    return
                }

                //GameSurfaceGLCamera.userRotation.rotZ(DegToRad(event.rotate * 4));
                GameSurfaceGLCamera.zoom += event.wheel.y * 1;//delta.getDeltaT();
                GameSurfaceGLCamera.zoom = arrayMedian([4, GameSurfaceGLCamera.zoom, 400]);
                console.log('wheel', event, GameSurfaceGLCamera);
            }
        });


        fakePhysics.collisionMesh = MeshTest00;

        this.loop = requestAnimationFrame(this.update);
    };


    defocus = () => {
        window.cancelAnimationFrame(this.loop);
    };

    update = () => {

        gameSurface2D.maximize(true);
        gameSurface2D.setSize(window.innerWidth, window.innerHeight);
        gameSurface2D.clear();
        gameSurfaceGL.maximize(true);
        // gameSurfaceGL.setSize(window.innerWidth, window.innerHeight);


        //delta.sample();

        // this.tick++;
        GameSurfaceGLCamera.aspect = gameSurfaceGL.getWidth() / gameSurfaceGL.getHeight();
        GameSurfaceGLCamera.projection.set(GameSurfaceGLCamera);

        VAOCamera.update(gameSurfaceGL.gl);
        VAOLight.update(gameSurfaceGL.gl);
        //VAOScreenSpace.update(gameSurfaceGL.gl);

        VBOStatic.update(gameSurfaceGL.gl);
        VBODynamic.update(gameSurfaceGL.gl);


        let characterHealth = characterController.health;

        if (!healthBarHelper) {
            if (characterHealth) {
                healthBarHelper = new HealthBarHelper(characterController.health);
                let area = document.getElementById("health-area");
                if (area) {
                    healthBarHelper.setElement(area);
                }
            } else {
                console.error('no character health', characterController);
            }
        } else {
            healthBarHelper.updateHealth(characterHealth)
        }


        let facing = GameSurfaceGLCamera.getFromWithUserZoomPositionRotation().pointTo(GameSurfaceGLCamera.getToWithUserPosition());
        facing.z = 0;
        facing.normalize();

        let move_vel = new Vec3();

        if (this.quickInput.pressedKeys.indexOf("KeyW") !== -1) {
            //physicsPlayer.velocity.y += -0.25;
            move_vel.add(facing.clone());
        }
        if (this.quickInput.pressedKeys.indexOf("KeyA") !== -1) {
            move_vel.add(facing.clone().rotZ(-Math.PI / 2));
        }
        if (this.quickInput.pressedKeys.indexOf("KeyS") !== -1) {
            // physicsPlayer.velocity.y += 0.25;
            move_vel.add(facing.clone().rotZ(Math.PI));
        }
        if (this.quickInput.pressedKeys.indexOf("KeyD") !== -1) {
            move_vel.add(facing.clone().rotZ(Math.PI / 2));
        }

        if (move_vel.mag() > 0){
            move_vel.normalize()
        }

        const controllerId = gamepadController.getLowestId();

        if (gamepadController.gamepads[controllerId]) {
            ///console.log(gamepadController.getButtonStatus(0));
            // console.log(gamepadController.gamepads[0], gamepadController.getAnalogLeft(0),gamepadController.getAnalogRight(0));


            let buttonStatus = gamepadController.getButtonStatus(controllerId);

            if (buttonStatus[0].pressed && physicsPlayer.onGround) {
                physicsPlayer.velocity.z = characterController.jumpHeight;
            }

            if (buttonStatus[8].pressed) {
                physicsPlayer.velocity.z = 0;
                physicsPlayer.position.set(0,0,2)
            }

            if (buttonStatus[5].pressed) {
                characterController.callAttack();
            }

            if (buttonStatus[12].pressed) {
                GameSurfaceGLCamera.zoom += -2;//delta.getDeltaT();
                GameSurfaceGLCamera.zoom = arrayMedian([4, GameSurfaceGLCamera.zoom, 400]);
            }

            if (buttonStatus[13].pressed) {
                GameSurfaceGLCamera.zoom += 2;//delta.getDeltaT();
                GameSurfaceGLCamera.zoom = arrayMedian([4, GameSurfaceGLCamera.zoom, 400]);
            }

            let leftAnalog = gamepadController.getAnalogLeft(controllerId);

            if (leftAnalog.mag() > 0.075) {
                let dir = (Vec2.fromValues(facing.x, facing.y).mulI(-1)).toRad();
                move_vel.add((Vec3.fromValues(leftAnalog.x,leftAnalog.y,0)).rotZ(-dir));
            }
            if (gamepadController.getAnalogRight(controllerId).mag() > 0.075) {
                let r = gamepadController.getAnalogRight(controllerId);
                GameSurfaceGLCamera.userRotation.z += DegToRad(-r.x * 4);
                GameSurfaceGLCamera.userRotation.x -= DegToRad(-r.y * 3);
                GameSurfaceGLCamera.userRotation.x = arrayMedian([-0.7, GameSurfaceGLCamera.userRotation.x, 0.7])

            }

        }

        if (move_vel.mag() > 0) {
            physicsPlayer.velocity.add(move_vel.divI(2));

            if (move_vel.mag() > 0.01) {
                physicsPlayer.direction.z = -Vec2.fromValues(move_vel.x, move_vel.y).toRad();
            }
        }

        fakePhysics.runPhysicsForActor(physicsPlayer);


        let characterModel = new BufferedMesh();
        //characterModel.join(MeshCube, {
        //    position: physicsPlayer.position,
        //    rotation: new Vec3()
        //});

        let anim = "idle";
        if (physicsPlayer.velocity.mag() > 0.01) {
            anim = "run";
        }
        if (!physicsPlayer.onGround) {
            if ((physicsPlayer.velocity.z) < 0) {
                anim = "fall";
            } else {
                anim = "jump";
            }
        }

        let playerTransforms = getTransformsForMesh(anim,{velocity:physicsPlayer.velocity});

        if (characterController.attacking) {
            playerTransforms = overlayTransforms(playerTransforms, getTransformsForMesh("attack", {percent: characterController.getAttackPercent()}), ["arm1", "torso"]);
        }

        playerTransforms.head.attachment = [MeshHumanWizardHat01, MeshHumanFace01];
        playerTransforms.arm1.attachment = [MeshDagger01];
        playerTransforms.arm2.attachment = [MeshBook01];

        characterModel.join(_MeshCharacter.getMesh(playerTransforms), {
            position: physicsPlayer.position,
            rotation: physicsPlayer.direction,
            scale: Vec3.fromValues(2, 2, 2)
        });


        GameSurfaceGLCamera.userPosition.copy(physicsPlayer.position);


        VBODynamic.queueBufferedMeshToBufferedMeshHandler(`character`, characterModel, true);
        VBOStatic.queueBufferedMeshToBufferedMeshHandler(`mesh-test-00`, MeshTest00);


        this.loop = window.requestAnimationFrame(this.update);


        VAOLight.renderVBO([VBOStatic, VBODynamic]);
        VAOCamera.bindDepthTexturesVAOProvider(VAOLight);
        VAOCamera.renderVBO([VBOStatic, VBODynamic]);
    }

}
