import { Scene } from 'phaser';
import Noun from '../components/noun';
export default class Interactable {
  public noun: Noun;
  public sprite: Phaser.Physics.Arcade.Sprite;
  constructor(
    scene: Scene,
    x: number,
    y: number,
    texture: string,
    staticBody = false
  ) {
    this.noun = new Noun(texture);
    this.sprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, texture);
    console.log(scene);
    scene.add.existing(this.sprite);
    scene.physics.add.existing(this.sprite, staticBody);
    this.sprite;

    if (this.noun.moveable) {
      this.sprite.setPushable(true);
      this.sprite.setDrag(200, 200);
    } else {
      this.sprite.setPushable(false);
      this.sprite.setImmovable(true);
    }
  }

  update() {
    if (this.noun.health < 2 && this.sprite?.texture.key !== 'bench-broken') {
      this.sprite.setTexture('bench-broken');
    }
    if (this.noun.health < 1 && this.sprite) {
      this.sprite.destroy();
    }
  }
}
