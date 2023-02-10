import { Scene } from 'phaser';

export default class Object extends Phaser.GameObjects.Sprite {
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

    this.scene.add.existing(this);
  }

  attack(target: Object) {
    // face target
    // check distance
    // animate
    // calculate
  }
}
