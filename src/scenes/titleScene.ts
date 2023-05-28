import Phaser from 'phaser';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    this.add.image(400, 300, 'starry_night');

    const forestSilhouette = this.add.image(400, 300, 'forest_silhouette');
    forestSilhouette.setScale(1);

    const title = this.add.image(400, 150, 'postapoc_title');
    title.setScale(2);

    this.input.on('pointerdown', () => this.startMainScene());
    if (!this.input.keyboard) {
      throw new Error('No keyboard found');
    }
    this.input.keyboard.on('keydown', () => this.startMainScene());
  }

  private async startMainScene() {
    await this.growMushroomCloud();
    this.scene.start('MainScene');
  }

  private async growMushroomCloud() {
    return new Promise<void>((resolve) => {
      const mushroomCloud = this.add.image(400, 300, 'mushroom_cloud');
      mushroomCloud.setScale(0.1).setDepth(1);
      mushroomCloud.setOrigin(mushroomCloud.originX, mushroomCloud.height);
      this.tweens.add({
        targets: mushroomCloud,
        scale: 20,
        duration: 2000,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          resolve();
        },
      });

      // Add the screen overlay
      const orangeRect = this.add.rectangle(400, 300, 800, 600, 0xff6600, 0);
      orangeRect.setDepth(2);

      const blackRect = this.add.rectangle(400, 300, 800, 600, 0x000000, 0);
      blackRect.setDepth(3);

      this.tweens.add({
        targets: orangeRect,
        fillAlpha: 0.5,
        duration: 800,
        ease: 'Linear',
        onComplete: () => {
          this.tweens.add({
            targets: blackRect,
            fillAlpha: 1,
            duration: 1600,
            ease: 'Expo.easeOut',
            onComplete: () => {
              resolve();
            },
          });
        },
      });
    });
  }
}
