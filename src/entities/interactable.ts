import { Scene } from 'phaser';

export default class Interactable extends Phaser.Physics.Arcade.Sprite {
  protected id: string;
  protected health: number;
  protected moveable = false;

  constructor(scene: Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.id = texture;
    this.health = 3;
  }

  getId() {
    return this.id;
  }

  isMoveable() {
    return this.moveable;
  }

  damage() {
    if (this.health > 1) {
      this.health -= 1;
      console.log(this.health);
    } else if (this.health === 1) {
      this.health = 0;
      console.log(this.id + ' out of health');
      this.setTexture('bench-broken');
    } else {
      this.destroy();
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

    this.scene.add.existing(interactable);
    this.scene.physics.add.existing(interactable);
    if (interactable.isMoveable()) {
      interactable.setDrag(200, 200);
    } else {
      interactable.setImmovable(true);
    }

    return interactable;
  }
);
