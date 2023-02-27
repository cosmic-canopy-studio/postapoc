import Thing from '../components/thing';
import { Directions } from '../systems';
import { log } from '../utilities';

export default class Interactable {
  public thing: Thing;
  public sprite?: Phaser.Physics.Arcade.Sprite;
  protected speed = 100;
  protected direction = Directions.down;

  constructor(id: string) {
    this.thing = new Thing(id);
  }

  setSpeed(speed: number) {
    this.speed = speed;
  }

  getSpeed(): number {
    return this.speed;
  }

  setSprite(sprite: Phaser.Physics.Arcade.Sprite) {
    this.sprite = sprite;
  }

  unsetSprite() {
    this.sprite?.destroy();
  }

  get health() {
    return this.thing.health;
  }

  set health(health: number) {
    this.thing.health = health;
  }

  get id() {
    return this.thing.id;
  }

  setDirection(direction: Directions) {
    this.direction = direction;
  }

  getDirection() {
    return this.direction;
  }

  update() {
    if (this.thing.health < 1) {
      log.info(`${this.thing.id} has died.`);
      if (this.sprite) {
        this.sprite.destroy();
      }
      return;
    }
    if (this.thing.health < 2) {
      if (this.sprite && this.sprite.texture.key !== 'bench-broken') {
        this.sprite.setTexture('bench-broken');
      }
      log.info(`${this.thing.id} is broken`);
    }
  }
}
