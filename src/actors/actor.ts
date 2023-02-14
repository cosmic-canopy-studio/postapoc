import { Scene } from 'phaser';
import PlayerInputState from '../states/playerInputState';
import Interactable from '../interactables/interactable';

export default class Actor extends Phaser.GameObjects.Sprite {
  private id: string;
  private health: number;
  private controlState?: PlayerInputState;
  private focus?: Interactable | string;

  constructor(scene: Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.id = texture;
    this.health = 5;
    this.play('idle-down');
  }

  setControlState(controlState: PlayerInputState) {
    this.controlState = controlState;
  }

  getId() {
    return this.id;
  }

  getFocus() {
    if (this.focus) {
      if (this.focus === typeof Interactable) {
        return this.focus.getId();
      } else {
        return this.focus;
      }
    }
    return 'none';
  }

  update() {
    if (!this.controlState) {
      return;
    }

    this.controlState.update(this.id);
  }

  setFocus(interactable: Interactable | string) {
    if (interactable === this.id) {
      this.focus = 'none';
    } else {
      this.focus = interactable;
    }
  }

  interact(interactable?: Interactable) {
    let target = interactable;
    if (!target) {
      if (this.focus) {
        target = this.focus;
      } else {
        return;
      }
    }
    // face target
    // check distance
    // animate
    // calculate
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
