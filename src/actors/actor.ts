import { Scene } from 'phaser';

export default class Actor extends Phaser.GameObjects.Sprite {
  private health: number;
  private alive: boolean;

  constructor(scene: Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    if (texture == 'player') {
      this.health = 5;
      this.alive = true;
    } else {
      this.health = 3;
      this.alive = true;
    }
  }

  attack(target: Actor) {
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
