import { Scene } from 'phaser';

export default class Interactable extends Phaser.GameObjects.Sprite {
  private id: string;
  private health: number;

  constructor(scene: Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.id = texture;
    this.health = 3;
  }

  getId() {
    return this.id;
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

    this.displayList.add(interactable);
    this.updateList.add(interactable);

    return interactable;
  }
);
