import { ActionSystem, EventBus, PlayerControl } from '.';
import { Actor, Interactable } from '@entities/.';
import { Sprite } from '@components/sprite';
import { GameScene } from '@scenes/gameScene';
import { Debuggable } from '@systems/debuggable';
import { log } from '@src/utilities';

export class Universe extends Debuggable {
    public universeEventBus: EventBus;
    private currentScene: Phaser.Scene;
    private currentControlledActor?: Actor;
    private interactables: Map<string, Interactable> = new Map();
    private playerControl: PlayerControl;
    private dirtyInteractables: Interactable[] = [];
    private actionSystem: ActionSystem;

    constructor(currentScene: Phaser.Scene) {
        super();
        this.currentScene = currentScene;
        this.universeEventBus = new EventBus('universeEventBus');
        this.universeEventBus.initGlobalEventBusForInstance();
        this.playerControl = new PlayerControl(this.universeEventBus);
        this.playerControl.loadKeyEvents(currentScene);
        this.actionSystem = new ActionSystem(this.universeEventBus);
        this.universeEventBus.subscribe(
            'interactableDirty',
            this.markInteractableDirty,
            this.constructor.name
        );
        this.universeEventBus.subscribe(
            'interactableDestroyed',
            this.deleteInteractable,
            this.constructor.name
        );
        if (this.debug) log.debug(`Universe created`);
    }

    public markInteractableDirty = (interactable: Interactable): void => {
        if (!this.dirtyInteractables.includes(interactable)) {
            if (this.debug)
                log.debug(`Interactable ${interactable.id} marked dirty`);
            this.dirtyInteractables.push(interactable);
        }
    };

    setControlledActor(actor: Actor) {
        this.currentControlledActor = actor;
        if (this.debug) log.debug(`Actor ${actor.id} is now being controlled`);
    }

    getControlledActor() {
        if (this.currentControlledActor) {
            if (this.debug)
                log.debug(
                    `Actor ${this.currentControlledActor.id} is currently being controlled.`
                );
            return this.currentControlledActor;
        }

        throw Error('No player actor');
    }

    setSceneCameraToPlayer() {
        const controlledActor = this.getControlledActor();
        const sprite = controlledActor.getComponent(Sprite);
        if (!sprite) {
            throw Error('Player actor has no sprite');
        }
        this.currentScene.cameras.main.startFollow(sprite.sprite);
        if (this.debug) log.debug(`Camera set to follow player`);
    }

    setCurrentScene(scene: GameScene) {
        this.currentScene = scene;
        this.playerControl.loadKeyEvents(scene);
        if (this.debug) log.debug(`Current scene set to ${scene.scene.key}`);
    }

    getCurrentScene() {
        if (this.debug)
            log.debug(`Current scene is ${this.currentScene.scene.key}`);
        return this.currentScene;
    }

    deleteInteractable(interactable: Interactable) {
        if (this.debug)
            log.debug(`Interactable ${interactable.id} to be destroyed`);
        interactable.destroy();
        this.interactables.delete(interactable.id);
    }

    addInteractable(interactable: Interactable) {
        if (!this.interactables.has(interactable.id)) {
            if (this.debug)
                log.debug(`Interactable ${interactable.id} added to universe`);
            this.interactables.set(interactable.id, interactable);
            interactable.subscribe(this.universeEventBus);
        }
    }

    update() {
        const dirtyInteractables = this.dirtyInteractables;
        this.dirtyInteractables = [];
        for (const interactable of dirtyInteractables) {
            if (this.interactables.has(interactable.id)) {
                if (this.debug)
                    log.debug(`Interactable ${interactable.id} updated`);
                this.interactables.get(interactable.id)?.update();
            }
        }
    }
}
