import { PlayerControl } from '.';
import { Actor, Interactable } from '../entities';
import { GameScene } from '../scenes/gameScene';

export class Universe {
    private currentScene: Phaser.Scene;
    private currentControlledActor?: Actor;
    private actors: Actor[] = [];
    private interactables: Interactable[] = [];
    private playerControl: PlayerControl;

    constructor(currentScene: Phaser.Scene) {
        this.currentScene = currentScene;
        this.playerControl = new PlayerControl(this);
        this.playerControl.loadKeyEvents(currentScene);
    }

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
        if (this.currentControlledActor?.sprite) {
            this.currentScene.cameras.main.startFollow(
                this.currentControlledActor.sprite,
                true
            );
            this.currentScene.cameras.main.setFollowOffset(
                -this.currentControlledActor.sprite.width,
                -this.currentControlledActor.sprite.height
            );
        } else {
            throw Error('No player actor for camera to follow');
        }
    }

    setCurrentScene(scene: GameScene) {
        this.currentScene = scene;
        this.playerControl.loadKeyEvents(scene);
    }

    getCurrentScene() {
        return this.currentScene;
    }

    getActors() {
        return this.actors;
    }

    getInteractables() {
        return this.interactables;
    }

    deleteActor(actor: Actor) {
        this.actors = this.actors.filter((a) => a !== actor);
    }

    deleteInteractable(interactable: Interactable) {
        interactable.destroy();
        this.interactables = this.interactables.filter(
            (i) => i !== interactable
        );
    }

    addActor(actor: Actor) {
        this.actors.push(actor);
    }

    addInteractable(interactable: Interactable) {
        this.interactables.push(interactable);
    }

    update() {
        for (const actor of this.actors) actor.update();
        for (const interactable of this.interactables) {
            if (interactable.health <= 0) {
                this.deleteInteractable(interactable);
            } else {
                interactable.update();
            }
        }
    }
}
