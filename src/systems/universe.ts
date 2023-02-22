import { Actor, Interactable } from '../entities';
import { GameScene } from '../scenes/gameScene';
import PlayerInput from './playerInput';

export class Universe {
  private currentScene: Phaser.Scene;
  private currentControlledActor?: Actor;
  private cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys;
  private actors: Actor[] = [];
  private interactables: Interactable[] = [];
  private playerInput?: PlayerInput;

  constructor(currentScene: Phaser.Scene) {
    this.currentScene = currentScene;
    this.setCursorKeys();
  }

  setControlledActor(actor: Actor) {
    if (this.currentControlledActor) {
      this.currentControlledActor.unsetControlState();
    }
    this.currentControlledActor = actor;
    if (this.playerInput) {
      actor.setControlState(this.playerInput);
    } else {
      throw new Error('No player input');
    }
  }

  getControlledActor() {
    if (this.currentControlledActor) {
      return this.currentControlledActor;
    } else {
      throw new Error('No player actor');
    }
  }

  setSceneCameraToPlayer() {
    if (this.currentControlledActor) {
      this.currentScene.cameras.main.startFollow(
        this.currentControlledActor.sprite,
        true
      );
      this.currentScene.cameras.main.setFollowOffset(
        -this.currentControlledActor.sprite.width,
        -this.currentControlledActor.sprite.height
      );
    } else {
      throw new Error('No player actor for camera to follow');
    }
  }

  setCursorKeys() {
    this.cursorKeys = this.currentScene.input.keyboard.createCursorKeys();
    this.setPlayerInput();
  }

  private setPlayerInput() {
    this.playerInput = new PlayerInput(this.cursorKeys);
  }

  setCurrentScene(scene: GameScene) {
    this.currentScene = scene;
    this.setCursorKeys();
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
    this.interactables = this.interactables.filter((i) => i !== interactable);
  }

  addActor(actor: Actor) {
    this.actors.push(actor);
  }

  addInteractable(interactable: Interactable) {
    this.interactables.push(interactable);
  }

  update() {
    this.actors.forEach((actor) => actor.update());
    this.interactables.forEach((interactable) => interactable.update());
  }
}
