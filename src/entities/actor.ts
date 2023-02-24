import { Directions } from '../systems';
import { log } from '../utilities';
import Interactable from './interactable';

export default class Actor extends Interactable {
  protected focus?: Interactable;
  protected speed = 100;
  protected direction = 'down';

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

  getFocus() {
    return this.focus;
  }

  update() {
    if (this.sprite) {
      if (this.thing.health < 1) {
        log.debug(`${this.thing.id} dead`);
        this.sprite.destroy();
        return;
      } else {
        if (
          this.sprite.body.velocity.x === 0 &&
          this.sprite.body.velocity.y === 0
        ) {
          this.sprite.play(`idle-${this.direction}`, true);
        }
      }
    }
  }

  setFocus(interactable: Interactable) {
    this.focus = interactable;
  }

  clearFocus() {
    this.focus = undefined;
  }

  attack() {
    if (this.focus) {
      this.focus.thing.takeDamage(1);
      this.sprite?.play(`action-${this.direction}`);
    } else {
      log.debug('Nothing to attack');
    }
  }

  move(direction: Directions) {
    if (this.sprite) {
      const normalizedVelocity = this.calcVelocity(direction);
      this.sprite.setVelocity(
        normalizedVelocity.x * this.speed,
        normalizedVelocity.y * this.speed
      );
      this.sprite.play(`walk-${direction}`, true);
      this.direction = direction;
      this.focus = undefined;
    }
  }

  calcVelocity(direction: string) {
    const velocity = new Phaser.Math.Vector2(0, 0);
    switch (direction) {
      case 'up':
        velocity.y -= 1;
        break;
      case 'down':
        velocity.y += 1;
        break;
      case 'left':
        velocity.x -= 1;
        break;
      case 'right':
        velocity.x += 1;
        break;
    }
    return velocity.normalize();
  }

  stop() {
    if (this.sprite) {
      this.sprite.setVelocity(0, 0);
      this.sprite.play(`idle-${this.direction}`, true);
    }
  }

  setSpeed(speed: number) {
    this.speed = speed;
  }

  getSpeed() {
    return this.speed;
  }

  setDirection(direction: string) {
    this.direction = direction;
  }

  getDirection() {
    return this.direction;
  }
}
