import { Interactable, Actor } from '../entities/';
import { Verbs, Verb } from './verbs';

export default class PlayerInput {
  private cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys;
  private interactionTriggered = false;
  private focus?: Interactable;
  private direction = 'down';
  private speed = 100;

  constructor(cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys) {
    this.cursorKeys = cursorKeys;
  }

  update(actor: Actor) {
    // Every frame, we create a new velocity for the sprite based on what keys the player is holding down.
    const velocity = new Phaser.Math.Vector2(0, 0);
    if (this.cursorKeys.up.isDown) {
      velocity.y -= 1;
      this.direction = 'up';
      this.focus = undefined;
    }
    if (this.cursorKeys.down.isDown) {
      velocity.y += 1;
      this.direction = 'down';
      this.focus = undefined;
    }
    if (this.cursorKeys.left.isDown) {
      velocity.x -= 1;
      this.direction = 'left';
      this.focus = undefined;
    }
    if (this.cursorKeys.right.isDown) {
      velocity.x += 1;
      this.direction = 'right';
      this.focus = undefined;
    }

    if (velocity.x === 0 && velocity.y === 0) {
      actor.sprite.play('idle-'.concat(this.direction));
    } else {
      const key = actor.sprite.anims.currentAnim?.key;
      if (key.startsWith('idle-')) {
        // logger.debug('breaking idle animation');
        actor.sprite.play('walk-'.concat(this.direction));
      } else {
        actor.sprite.play('walk-'.concat(this.direction), true);
      }
    }

    // We normalize the velocity so that the player is always moving at the same speed, regardless of direction.
    const normalizedVelocity = velocity.normalize();
    actor.sprite.setVelocity(
      normalizedVelocity.x * this.speed,
      normalizedVelocity.y * this.speed
    );

    if (this.cursorKeys.space.isDown) {
      if (!this.interactionTriggered) {
        actor.sprite.play(`action-${this.direction}`, true);
        this.interact(Verbs.attack);
        this.interactionTriggered = true;
      }
    } else {
      this.interactionTriggered = false;
    }
  }

  getFocus() {
    if (!this.focus) {
      return;
    }
    return this.focus;
  }

  setFocus(interactable: Interactable | undefined) {
    this.focus = interactable;
  }

  interact(verb: Verbs, interactable?: Interactable) {
    Verb.interact(verb, interactable);
  }
}
