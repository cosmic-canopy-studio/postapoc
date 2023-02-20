import { Scene } from 'phaser';
import PlayerInputState from '../states/playerInputState';
import Interactable from '../interactables/interactable';

export default class Actor extends Interactable {
  private controlState?: PlayerInputState;

  constructor(scene: Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.health = 5;
    this.play('idle-down');
  }

  setControlState(controlState: PlayerInputState) {
    this.controlState = controlState;
  }

  getFocus() {
    if (!this.controlState) {
      return;
    }
    return this.controlState.getFocus();
  }

  update() {
    if (!this.controlState) {
      return;
    }
    this.controlState.update(this.id);
  }

  setFocus(interactable: Interactable) {
    if (!this.controlState) {
      return;
    }
    if (interactable.getId() === this.id) {
      this.controlState.setFocus(undefined);
    } else {
      this.controlState.setFocus(interactable);
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
