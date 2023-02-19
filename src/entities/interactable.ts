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
}

Phaser.GameObjects.GameObjectFactory.register(
  'interactable',
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string
  ) {
    const interactable = new Interactable(this.scene, x, y, texture);

    this.scene.add.existing(interactable.sprite);
    this.scene.physics.add.existing(interactable.sprite);

    if (interactable.thing.moveable) {
      interactable.sprite.setDrag(200, 200);
    } else {
      interactable.sprite.setImmovable(true);
    }

    return interactable;
  }
);
