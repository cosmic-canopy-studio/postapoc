import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    // Load assets here
    this.load.image('player', 'assets/player.png');
  }

  create() {
    // Move to the main game scene
    this.scene.start('MainScene');
  }
}
