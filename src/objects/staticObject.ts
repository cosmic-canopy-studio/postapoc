// Part: src/objects/staticObject.ts

import Phaser from "phaser";

export default class StaticObject extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    // Enable physics for the static object (but make it immovable)
    scene.physics.add.existing(this);
    (this.body as Phaser.Physics.Arcade.Body).setImmovable(true);
    (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

    // Add the static object to the scene
    scene.add.existing(this);
  }
}
