// Part: src/phaser/scenes/bootScene.ts
// Code Reference:
// Documentation:

import { createFallbackSVG } from '@src/utils/svgUtils';
import Phaser from 'phaser';
import objectAssets from '@src/assets/objectAssets.json';
import terrainAssets from '@src/assets/terrainAssets.json';
import menuAssets from '@src/assets/menuAssets.json';
import uiAssets from '@src/assets/uiAssets.json';

export default class BootScene extends Phaser.Scene {
  private progressBar!: Phaser.GameObjects.Graphics;

  constructor() {
    super('BootScene');
  }

  preload() {
    this.progressBar = this.add.graphics();
    this.progressBar.fillStyle(0xffffff, 1);
    this.progressBar.fillRect(240, 290, 320, 20);

    const backgroundBar = this.add.graphics();
    backgroundBar.lineStyle(4, 0xffffff, 1);
    backgroundBar.strokeRect(240, 290, 320, 20);

    this.load.on('progress', (value: number) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0xffffff, 1);
      this.progressBar.fillRect(240, 290, 320 * value, 20);
    });

    this.load.on(
      Phaser.Loader.Events.FILE_LOAD_ERROR,
      (file: Phaser.Loader.File) => {
        const key = file.key;
        file.destroy();
        const fallbackSVG = createFallbackSVG(key, 32, 32);
        if (this.textures.exists(key)) {
          this.textures.remove(key);
        }
        console.log(fallbackSVG);
        this.load.svg(key, fallbackSVG);
        this.load.emit(Phaser.Loader.Events.FILE_COMPLETE, file);
      },
      this
    );

    this.loadAssets(objectAssets);
    this.loadAssets(terrainAssets);
    this.loadAssets(menuAssets);
    this.loadAssets(uiAssets);
  }

  create() {
    if (import.meta.env.DEV) {
      this.scene.start('MainScene');
    } else {
      this.scene.start('TitleScene');
    }
  }

  private loadAssets(assets: any[]) {
    assets.forEach((asset) => {
      if (asset.width && asset.height) {
        this.load.svg(asset.key, asset.url, {
          width: asset.width,
          height: asset.height,
        });
      } else {
        this.load.svg(asset.key, asset.url);
      }
    });
  }
}
