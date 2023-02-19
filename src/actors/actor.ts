import { Scene } from 'phaser';
import PlayerInput from '../components/playerInput';
import Interactable from '../interactables/interactable';

export default class Actor extends Interactable {
  private playerInput?: PlayerInput;

  constructor(scene: Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.health = 5;
    this.play('idle-down');
  }

  setControlState(playerInput: PlayerInput) {
    this.playerInput = playerInput;
  }

  getFocus() {
    if (!this.playerInput) {
      return;
    }
    return this.playerInput.getFocus();
  }

  update() {
    if (!this.playerInput) {
      return;
    }
    this.playerInput.update(this.id);
  }

  setFocus(interactable: Interactable) {
    if (!this.playerInput) {
      return;
    }
    if (interactable.getId() === this.id) {
      this.playerInput.setFocus(undefined);
    } else {
      this.playerInput.setFocus(interactable);
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  'actor',
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string
  ) {
    const actor = new Actor(this.scene, x, y, texture);

    this.displayList.add(actor);
    this.updateList.add(actor);

    return actor;
  }
);
