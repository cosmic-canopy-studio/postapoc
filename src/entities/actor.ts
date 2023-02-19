import { Scene } from 'phaser';
import PlayerInput from '../systems/playerInput';
import Interactable from './interactable';

export default class Actor extends Interactable {
  private playerInput?: PlayerInput;
  private status: Phaser.GameObjects.Text;

  constructor(scene: Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.sprite.play('idle-down');
    this.status = scene.add.text(0, -50, 'Focus: none');
    scene.add.existing(this.sprite);
    scene.physics.add.existing(this.sprite);
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
    this.playerInput.update(this);
    this.status.setText(
      `Focus: ${this.playerInput.getFocus()?.thing.id || 'none'}`
    );
  }

  setFocus(interactable: Interactable) {
    if (!this.playerInput) {
      return;
    }
    if (interactable.thing.id === this.thing.id) {
      this.playerInput.setFocus(undefined);
      this.status.setText('No focus');
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

    this.scene.add.existing(actor.sprite);
    this.scene.physics.add.existing(actor.sprite);

    return actor;
  }
);
