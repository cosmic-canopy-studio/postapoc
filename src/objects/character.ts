// Part: src/objects/character.ts

import Phaser from 'phaser';

export default class Character extends Phaser.GameObjects.Sprite {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private speed: number;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    // Initialize the character's speed
    this.speed = 200;

    // Enable physics for the character
    scene.physics.add.existing(this);
    (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

    // Set up the keyboard input
    this.cursors = scene.input.keyboard.createCursorKeys();

    // Add the character to the scene
    scene.add.existing(this);
  }

  update(delta: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    if (
      this.cursors.left.isDown ||
      this.cursors.right.isDown ||
      this.cursors.up.isDown ||
      this.cursors.down.isDown
    ) {
      if (this.cursors.left.isDown) {
        body.setVelocityX(-this.speed * delta);
      } else if (this.cursors.right.isDown) {
        body.setVelocityX(this.speed * delta);
      }

      if (this.cursors.up.isDown) {
        body.setVelocityY(-this.speed * delta);
      } else if (this.cursors.down.isDown) {
        body.setVelocityY(this.speed * delta);
      }
    }
  }
}
