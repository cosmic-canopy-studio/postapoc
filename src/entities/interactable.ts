import { Scene } from 'phaser';
import Thing from '../components/thing';
export default class Interactable {
  public thing: Thing;
  public sprite: Phaser.Physics.Arcade.Sprite;
  constructor(
    scene: Scene,
    x: number,
    y: number,
    texture: string,
    staticBody = false
  ) {
    this.thing = new Thing(texture);
    this.sprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, texture);
    console.log(scene);
    scene.add.existing(this.sprite);
    scene.physics.add.existing(this.sprite, staticBody);
    this.sprite;

    if (this.thing.moveable) {
      this.sprite.setPushable(true);
      this.sprite.setDrag(200, 200);
    } else {
      this.sprite.setPushable(false);
      this.sprite.setImmovable(true);
    }
  }

  update() {
    if (this.thing.health < 2 && this.sprite?.texture.key !== 'bench-broken') {
      this.sprite.setTexture('bench-broken');
    }
    if (this.thing.health < 1 && this.sprite) {
      this.sprite.destroy();
    }
  }
}
