// Part: src/phaser/scenes/preloadScene.ts

import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene {
  private progressBar!: Phaser.GameObjects.Graphics;
  private titleScreen!: Phaser.GameObjects.Graphics;

  constructor() {
    super('PreloadScene');
  }

  preload() {
    // Load assets here
    this.load.svg('player', 'assets/player.svg', { width: 20, height: 20 });

    // Set up the progress bar
    this.progressBar = this.add.graphics();
    this.progressBar.fillStyle(0xffffff, 1);
    this.progressBar.fillRect(240, 290, 320, 20);

    // Set up the background for the progress bar
    const backgroundBar = this.add.graphics();
    backgroundBar.lineStyle(4, 0xffffff, 1);
    backgroundBar.strokeRect(240, 290, 320, 20);

    // Update the progress bar during loading
    this.load.on('progress', (value: number) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0xffffff, 1);
      this.progressBar.fillRect(240, 290, 320 * value, 20);
    });
  }

  create() {
    // Show the title screen
    this.titleScreen = this.add.graphics();
    this.titleScreen.fillStyle(0x9d9d9d, 1);
    this.titleScreen.fillRect(0, 0, 800, 600);

    // Set up input listeners
    this.input.on('pointerdown', () => this.startMainScene());
    this.input.keyboard.on('keydown', () => this.startMainScene());
  }

  private startMainScene() {
    this.scene.start('MainScene');
  }
}
