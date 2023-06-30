import itemAssets from '@src/core/assets/prototype/itemAssets.json';
import menuAssets from '@src/core/assets/prototype/menuAssets.json';
import objectAssets from '@src/core/assets/prototype/objectAssets.json';
import terrainAssets from '@src/core/assets/prototype/terrainAssets.json';
import uiAssets from '@src/core/assets/prototype/uiAssets.json';
import tilesetAssets from '@src/core/assets/kennynl/tilesetAssets.json';

import { createFallbackSVG } from '@src/core/utils/svgUtils';
import Phaser from 'phaser';
import logger from '@src/telemetry/systems/logger';

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

    // Load other assets
    this.loadAssets(itemAssets);
    this.loadAssets(objectAssets);
    this.loadAssets(terrainAssets);
    this.loadAssets(menuAssets);
    this.loadAssets(uiAssets);
    this.loadTilesetAssets(tilesetAssets);
  }

  create() {
    this.processTilesetAssets();

    if (import.meta.env.DEV) {
      this.scene.start('MainScene');
    } else {
      this.scene.start('TitleScene');
    }
  }

  private processTilesetAssets() {
    tilesetAssets.forEach((asset) => {
      const tilesetJson = this.cache.json.get(asset.key + 'Tilemap');
      const image = this.textures.get(asset.key).getSourceImage();

      const tilesetImageCanvas = this.createCanvasFromImage(image);

      tilesetJson.tilesets.forEach((tileset) => {
        this.processTiles(tileset, tilesetImageCanvas, image);
      });
    });
  }

  private processTiles(tileset, tilesetImageCanvas, image) {
    tileset.tiles.forEach((tile, i, tiles) => {
      if (
        tile.properties &&
        tile.properties.some((property) => property.name === 'type')
      ) {
        const typeProperty = tile.properties.find(
          (property) => property.name === 'type'
        );

        this.processTile(
          typeProperty,
          tile,
          tiles,
          i,
          tileset,
          tilesetImageCanvas,
          image
        );
      }
    });
  }

  private processTile(
    typeProperty,
    tile,
    tiles,
    tileIndex,
    tileset,
    tilesetImageCanvas
  ) {
    const match = typeProperty.value.match(/(.*)-1$/);

    if (match) {
      const baseName = match[1];
      const nextTile = tiles[tileIndex + 1];

      if (
        nextTile &&
        nextTile.properties.find(
          (property) =>
            property.name === 'type' && property.value === baseName + '-2'
        )
      ) {
        const combinedCanvas = this.combineTiles(
          tile,
          nextTile,
          tileset,
          tilesetImageCanvas
        );

        if (this.textures.exists(baseName)) {
          logger.info(
            `Removing existing texture ${baseName} in favor of combined tileset texture`
          );
          this.textures.remove(baseName);
        }

        this.textures.addCanvas(baseName, combinedCanvas);
      }
    }
  }

  private createCanvasFromImage(image) {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);

    return canvas;
  }

  private combineTiles(tile1, tile2, tileset, canvas) {
    const [x1, y1] = this.getTileCoordinates(tile1, tileset);
    const [x2, y2] = this.getTileCoordinates(tile2, tileset);

    const combinedCanvas = document.createElement('canvas');
    combinedCanvas.width = tileset.tilewidth * 2;
    combinedCanvas.height = tileset.tileheight;

    const context = combinedCanvas.getContext('2d');
    context.drawImage(
      canvas,
      x1,
      y1,
      tileset.tilewidth,
      tileset.tileheight,
      0,
      0,
      tileset.tilewidth,
      tileset.tileheight
    );
    context.drawImage(
      canvas,
      x2,
      y2,
      tileset.tilewidth,
      tileset.tileheight,
      tileset.tilewidth,
      0,
      tileset.tilewidth,
      tileset.tileheight
    );

    return combinedCanvas;
  }

  private getTileCoordinates(tile, tileset) {
    const x = (tile.id % tileset.columns) * tileset.tilewidth;
    const y = Math.floor(tile.id / tileset.columns) * tileset.tileheight;

    return [x, y];
  }

  private loadTilesetAssets(assets: any[]) {
    assets.forEach((asset) => {
      this.load.image(asset.key, asset.url);
      this.load.json(asset.key + 'Tilemap', asset.mapUrl);
    });
  }

  private loadAssets(assets: any[]) {
    assets.forEach((asset) => {
      const extension = asset.url.split('.').pop();

      switch (extension) {
        case 'png':
          this.load.image(asset.key, asset.url);
          break;
        case 'svg':
          if (asset.width && asset.height) {
            this.load.svg(asset.key, asset.url, {
              width: asset.width,
              height: asset.height,
            });
          } else {
            this.load.svg(asset.key, asset.url);
          }
          break;
        default:
          console.warn(`Unsupported file extension ${extension}`);
      }
    });
  }
}
