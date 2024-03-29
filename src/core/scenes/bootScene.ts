import biomeJSONCache from '@src/biome/systems/biomeJSONCache';
import knlObjectAssets from '@src/core/assets/kennynl/objectAssets.json';
import tilesetAssets from '@src/core/assets/kennynl/tilesetAssets.json';
import itemAssets from '@src/core/assets/prototype/itemAssets.json';
import menuAssets from '@src/core/assets/prototype/menuAssets.json';
import objectAssets from '@src/core/assets/prototype/objectAssets.json';
import terrainAssets from '@src/core/assets/prototype/terrainAssets.json';
import uiAssets from '@src/core/assets/prototype/uiAssets.json';
import { Tilemap } from '@src/core/data/types';
import AssetLoader from '@src/core/systems/assetLoader';
import TileProcessor from '@src/core/systems/tileProcessor';

import { createFallbackSVG } from '@src/core/utils/svgUtils';
import { getLogger } from '@src/telemetry/systems/logger';
import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  private logger = getLogger('core');
  private progressBar!: Phaser.GameObjects.Graphics;
  private tileProcessor!: TileProcessor;
  private assetLoader!: AssetLoader;

  constructor() {
    super('BootScene');
  }

  preload() {
    this.createProgressBar();
    this.handleLoadErrors();
    this.tileProcessor = new TileProcessor(this.textures);
    this.assetLoader = new AssetLoader(this.load);
    this.loadAllAssets();
  }

  create() {
    this.tileProcessor.processTilesetAssets(
      tilesetAssets as Tilemap[],
      this.cache
    );

    if (import.meta.env.DEV) {
      this.scene.start('MainScene');
    } else {
      this.scene.start('TitleScene');
    }
  }

  private loadAllAssets() {
    this.assetLoader.loadAssets(itemAssets, this);
    this.assetLoader.loadAssets(objectAssets, this);
    this.assetLoader.loadAssets(terrainAssets, this);
    this.assetLoader.loadAssets(menuAssets, this);
    this.assetLoader.loadAssets(uiAssets, this);
    this.assetLoader.loadAssets(knlObjectAssets, this);
    this.assetLoader.loadTilesetAssets(tilesetAssets as Tilemap[]);

    this.load.on('complete', () => {
      const shelterData = this.cache.json.get('shelterData');
      this.logger.debugVerbose('bootScene Shelter Data:', shelterData);
      biomeJSONCache.set('shelterData', shelterData);
    });

    this.load.json('shelterData', 'assets/biome/shelter/shelter.json');
  }

  private handleLoadErrors() {
    this.load.on(
      Phaser.Loader.Events.FILE_LOAD_ERROR,
      (file: Phaser.Loader.File) => {
        const key = file.key;
        file.destroy();
        const fallbackSVG = createFallbackSVG(key, 32, 32);
        if (this.textures.exists(key)) {
          this.textures.remove(key);
        }
        this.logger.debug(fallbackSVG);
        this.load.svg(key, fallbackSVG);
        this.load.emit(Phaser.Loader.Events.FILE_COMPLETE, file);
      },
      this
    );
  }

  private createProgressBar() {
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
  }
}
