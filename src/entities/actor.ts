import PlayerInput from '../systems/playerInput';
import Interactable from './interactable';

export default class Actor extends Interactable {
  private playerInput?: PlayerInput;

  constructor(id: string) {
    super(id);
  }

  setSprite(sprite: Phaser.Physics.Arcade.Sprite): void {
    super.setSprite(sprite);
    if (this.sprite) {
      this.sprite.setCollideWorldBounds(true);
      this.sprite.setPushable(false);
      this.sprite.setImmovable(false);
      this.sprite.play('idle-down');
    } else {
      throw new Error('No sprite defined for actor');
    }
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
  }

  setFocus(interactable: Interactable) {
    if (!this.playerInput) {
      return;
    }
    if (interactable.noun.id === this.noun.id) {
      this.playerInput.setFocus(undefined);
    } else {
      this.playerInput.setFocus(interactable);
    }
  }
}
