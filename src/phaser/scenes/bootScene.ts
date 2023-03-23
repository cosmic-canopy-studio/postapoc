// Part: src/phaser/scenes/bootScene.ts

import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    // Move to the next scene
    this.scene.start('PreloadScene');
  }
}
