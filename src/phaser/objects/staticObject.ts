// Part: src/phaser/objects/staticObject.ts

import Phaser from "phaser";

export default class StaticObject extends Phaser.GameObjects.Rectangle {
  public collisionModifier: number;
  public minX: number;
  public minY: number;
  public maxX: number;
  public maxY: number;
  public name: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | null,
    width?: number,
    height?: number,
    name?: string
  ) {
    super(scene, x, y, width ?? 32, height ?? 32);

    this.collisionModifier = 0;

    scene.add.existing(this);

    if (texture) {
      const sprite = scene.add.sprite(x, y, texture);
      sprite.setOrigin(0, 0);
      this.name = name ?? texture;
    } else {
      this.name = name ?? "unnamed";
    }

    this.minX = this.x;
    this.minY = this.y;
    this.maxX = this.x + this.width;
    this.maxY = this.y + this.height;
  }

  setPosition(x: number, y: number): this {
    super.setPosition(x, y);
    this.updateBoundingBox();
    return this;
  }

  private updateBoundingBox(): void {
    this.minX = this.x;
    this.minY = this.y;
    this.maxX = this.x + this.width;
    this.maxY = this.y + this.height;
  }
}
