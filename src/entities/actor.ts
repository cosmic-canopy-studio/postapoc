import { Scene } from 'phaser';
import PlayerInput from '../systems/playerInput';
import Interactable from './interactable';

export default class Actor extends Interactable {
  private playerInput?: PlayerInput;
  private status: Phaser.GameObjects.Text;

  constructor(scene: Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture, false);

    this.status = scene.add.text(0, -50, 'Focus: none');
    scene.add.existing(this.sprite);
    scene.physics.add.existing(this.sprite);

    this.sprite.setCollideWorldBounds(true);
    this.sprite.setPushable(false);
    this.sprite.setImmovable(false);
    this.sprite.play('idle-down');
  }

  setControlState(playerInput: PlayerInput) {
    this.playerInput = playerInput;
  }

  unsetControlState() {
    this.playerInput = undefined;
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
      `Focus: ${this.playerInput.getFocus()?.noun.id || 'none'}`
    );
  }

  setFocus(interactable: Interactable) {
    if (!this.playerInput) {
      return;
    }
    if (interactable.noun.id === this.noun.id) {
      this.playerInput.setFocus(undefined);
      this.status.setText('No focus');
    } else {
      this.playerInput.setFocus(interactable);
    }
  }
}
