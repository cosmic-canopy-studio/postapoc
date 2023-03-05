import { EventBus, PlayerControl } from '.';
import { Actor, Interactable } from '@entities/.';
import { Sprite } from '@components/sprite';
import { GameScene } from '@scenes/gameScene';

export class Universe {
    public eventBus: EventBus;
    private currentScene: Phaser.Scene;
    private currentControlledActor?: Actor;
    private interactables: Map<string, Interactable> = new Map();
    private playerControl: PlayerControl;
    private dirtyInteractables: Interactable[] = [];

    constructor(currentScene: Phaser.Scene) {
        this.currentScene = currentScene;
        this.eventBus = new EventBus();
        this.playerControl = new PlayerControl(this.eventBus);
        this.playerControl.loadKeyEvents(currentScene);
        this.eventBus.subscribe(
            'interactableDirty',
            this.markInteractableDirty
        );
        this.eventBus.subscribe(
            'interactableDestroyed',
            this.deleteInteractable
        );
    }

    public markInteractableDirty = (interactable: Interactable): void => {
        if (!this.dirtyInteractables.includes(interactable)) {
            this.dirtyInteractables.push(interactable);
        }
    };

    setControlledActor(actor: Actor) {
        this.currentControlledActor = actor;
    }

    getControlledActor() {
        if (this.currentControlledActor) {
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
    }

    setCurrentScene(scene: GameScene) {
        this.currentScene = scene;
        this.playerControl.loadKeyEvents(scene);
    }

    getCurrentScene() {
        return this.currentScene;
    }

    deleteInteractable(interactable: Interactable) {
        interactable.destroy();
        this.interactables.delete(interactable.id);
    }

    addInteractable(interactable: Interactable) {
        if (!this.interactables.has(interactable.id)) {
            this.interactables.set(interactable.id, interactable);
            interactable.subscribe(this.eventBus);
        }
    }

    update() {
        for (const interactable of this.dirtyInteractables) {
            if (this.interactables.has(interactable.id)) {
                this.interactables.get(interactable.id)?.update();
            }
        }
        this.dirtyInteractables = [];
    }
}
