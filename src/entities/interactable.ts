import { Scene } from 'phaser';
import Thing from '../components/thing';
export default class Interactable extends Phaser.Physics.Arcade.Sprite {
  public thing: Thing;

  constructor(scene: Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.thing = new Thing(texture);
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

    this.scene.add.existing(interactable);
    this.scene.physics.add.existing(interactable);

    if (interactable.thing.moveable) {
      interactable.setDrag(200, 200);
    } else {
      interactable.setImmovable(true);
    }

    return interactable;
  }
);
