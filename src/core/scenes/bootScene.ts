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
      console.log(`Asset: ${asset.key}, Image: `, image);

      const tilesetImageCanvas = this.createCanvasFromImage(
        this.textures.get(asset.key).getSourceImage()
      );

      tilesetJson.tilesets.forEach((tileset) => {
        this.processTiles(tileset, tilesetImageCanvas);
      });
    });
  }

  private processTiles(tileset, tilesetImageCanvas) {
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
          tileset,
          tilesetImageCanvas
        );
      }
    });
  }

  private processTile(typeProperty, tile, tiles, tileset, tilesetImageCanvas) {
    const match = typeProperty.value.match(/(.*)-(\d+)x(\d+)$/);

    if (match) {
      const baseName = match[1];
      const height = parseInt(match[2]);
      const width = parseInt(match[3]);

      let combinedCanvas;
      const targetTiles = [];
      let canCombine = true;

      for (let h = 0; h < height; h++) {
        for (let w = 0; w < width; w++) {
          const nextTileTypeName = `${baseName}-${h + 1}x${w + 1}`;
          const nextTile = this.findNextTile(tiles, nextTileTypeName);
          canCombine = this.pushTargetTile(targetTiles, nextTile, canCombine);
        }
      }

      if (canCombine) {
        combinedCanvas = this.combineTiles(
          targetTiles,
          width,
          tileset,
          tilesetImageCanvas
        );
      }

      if (this.textures.exists(baseName)) {
        logger.info(
          `Removing existing texture ${baseName} in favor of tileset texture`
        );
        this.textures.remove(baseName);
      }

      if (canCombine) {
        this.textures.addCanvas(baseName, combinedCanvas);
      }
    }

    // handle single tile assets
    //TODO: Handle dynamic texture variety sizes

    const baseName = typeProperty.value;
    if (this.textures.exists(baseName)) {
      logger.info(`Removing existing texture ${baseName}`);
      this.textures.remove(baseName);
    }
    const tileImage = this.getTileImage(tile, tileset, tilesetImageCanvas);
    this.textures.addCanvas(baseName, tileImage);
  }

  private findNextTile(tiles, typeName) {
    return tiles.find((tile) =>
      tile.properties.find(
        (property) => property.name === 'type' && property.value === typeName
      )
    );
  }

  private pushTargetTile(targetTiles, tile) {
    if (tile) {
      targetTiles.push(tile);
      return true;
    } else {
      return false;
    }
  }

  private combineTiles(tiles, width, tileset, tilesetImageCanvas) {
    const combinedCanvas = document.createElement('canvas');
    combinedCanvas.width = tileset.tilewidth * width;
    combinedCanvas.height = tileset.tileheight * (tiles.length / width);

    const context = combinedCanvas.getContext('2d');

    tiles.forEach((tile, index) => {
      const tileImage = this.getTileImage(tile, tileset, tilesetImageCanvas);
      const row = Math.floor(index / width);
      const col = index % width;
      context.drawImage(
        tileImage,
        0,
        0,
        tileset.tilewidth,
        tileset.tileheight,
        col * tileset.tilewidth,
        row * tileset.tileheight,
        tileset.tilewidth,
        tileset.tileheight
      );
    });

    return combinedCanvas;
  }

  private getTileImage(tile, tileset, tilesetImageCanvas) {
    const [x, y] = this.getTileCoordinates(tile, tileset);
    const canvas = document.createElement('canvas');
    canvas.width = tileset.tilewidth;
    canvas.height = tileset.tileheight;
    console.log('tilesetImageCanvas in getTileImage', tilesetImageCanvas); // New log
    console.log('canvas in getTileImage', canvas); // New log
    const context = canvas.getContext('2d');
    context.drawImage(
      tilesetImageCanvas,
      x,
      y,
      tileset.tilewidth,
      tileset.tileheight,
      0,
      0,
      tileset.tilewidth,
      tileset.tileheight
    );
    return canvas;
  }

  private createCanvasFromImage(image) {
    console.log('Image in createCanvasFromImage: ', image); // New log
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);

    return canvas;
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
