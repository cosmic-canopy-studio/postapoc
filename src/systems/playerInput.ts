import { injectable } from 'inversify';
import Interactable from '../entities/interactable';
import Actor from '../entities/actor';
import { Logger } from 'tslog';

const logger = new Logger({ type: 'pretty' });
@injectable()
export default class PlayerInput {
  private cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys;
  private interactionTriggered = false;
  private focus?: Interactable;
  private direction = 'down';
  private speed = 100;

  setCursors(cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys) {
    this.cursorKeys = cursorKeys;
  }

  update(actor: Actor) {
    // Every frame, we create a new velocity for the sprite based on what keys the player is holding down.
    const velocity = new Phaser.Math.Vector2(0, 0);
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
    if (this.cursorKeys.up.isDown) {
      velocity.y -= 1;
      this.direction = 'up';
      this.focus = undefined;
    }
    if (this.cursorKeys.down.isDown) {
      velocity.y += 1;
      this.direction = 'down';
      this.focus = undefined;
    } else {
      actor.play('idle-'.concat(this.direction));
    }

    actor.playAfterRepeat('walk-'.concat(this.direction));

    // We normalize the velocity so that the player is always moving at the same speed, regardless of direction.
    const normalizedVelocity = velocity.normalize();
    actor.setVelocity(
      normalizedVelocity.x * this.speed,
      normalizedVelocity.y * this.speed
    );

    if (this.cursorKeys.space.isDown) {
      if (!this.interactionTriggered) {
        actor.play(`action-${this.direction}`);
        this.interact();
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
    return this.focus.getId();
  }

  setFocus(interactable: Interactable | undefined) {
    this.focus = interactable;
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

    target.damage();
  }
}
