// Part: src/phaser/objects/moveableObject.ts

import Phaser from "phaser";

export default class MovableObject extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    // Enable physics for the movable object
    scene.physics.add.existing(this);
    (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

    // Add the movable object to the scene
    scene.add.existing(this);
  }
}
