// staticObject.ts
import Phaser from "phaser";

export default class StaticObject extends Phaser.GameObjects.Sprite {
  public collisionModifier: number;
  public minX: number;
  public minY: number;
  public maxX: number;
  public maxY: number;
  public name: string;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, "");

    this.collisionModifier = 0;
    this.minX = this.x;
    this.minY = this.y;
    this.maxX = this.x + this.width;
    this.maxY = this.y + this.height;
    this.name = "";

    scene.add.existing(this);
  }

  initialize(x: number, y: number, texture: string, name?: string): void {
    this.setTexture(texture);
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.name = name ?? texture;
  }

  setPosition(x: number, y: number) {
    super.setPosition(x, y);
    this.updateBoundingBox();
    return this;
  }

  setSize(width: number, height: number) {
    super.setSize(width, height);
    this.updateBoundingBox();
    return this;
  }

  deinitialize(): void {
    this.setActive(false);
    this.setVisible(false);
    this.setTexture("");
    this.setPosition(0, 0);
    this.name = "";
  }

  private updateBoundingBox(): void {
    this.minX = this.x;
    this.minY = this.y;
    this.maxX = this.x + this.width;
    this.maxY = this.y + this.height;
  }
}
