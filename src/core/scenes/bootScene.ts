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
    tilesetAssets.forEach((asset) => {
      const tilesetJson = this.cache.json.get(asset.key + 'Tilemap');
      const image = this.textures.get(asset.key).getSourceImage();
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);

      console.log(tilesetJson);

      tilesetJson.tilesets.forEach((tileset) => {
        tileset.tiles.forEach((tile, i, tiles) => {
          if (
            tile.properties &&
            tile.properties.some((property) => property.name === 'type')
          ) {
            const typeProperty = tile.properties.find(
              (property) => property.name === 'type'
            );

            const match = typeProperty.value.match(/(.*)-1$/); // check if the tile name ends with "-1"

            if (match) {
              const baseName = match[1]; // the part of the tile name before "-1"
              const nextTile = tiles[i + 1];

              if (
                nextTile.properties.find(
                  (property) =>
                    property.name === 'type' &&
                    property.value === baseName + '-2'
                )
              ) {
                // Combine the two tiles into a single texture
                const x1 = (tile.id % tileset.columns) * tileset.tilewidth;
                const y1 =
                  Math.floor(tile.id / tileset.columns) * tileset.tileheight;
                const x2 = (nextTile.id % tileset.columns) * tileset.tilewidth;
                const y2 =
                  Math.floor(nextTile.id / tileset.columns) *
                  tileset.tileheight;

                const combinedCanvas = document.createElement('canvas');
                combinedCanvas.width = tileset.tilewidth * 2; // the combined texture is twice as wide
                combinedCanvas.height = tileset.tileheight; // assuming both tiles have the same height
                const combinedContext = combinedCanvas.getContext('2d');

                combinedContext.drawImage(
                  image,
                  x1,
                  y1,
                  tileset.tilewidth,
                  tileset.tileheight,
                  0,
                  0,
                  tileset.tilewidth,
                  tileset.tileheight
                );
                combinedContext.drawImage(
                  image,
                  x2,
                  y2,
                  tileset.tilewidth,
                  tileset.tileheight,
                  tileset.tilewidth,
                  0,
                  tileset.tilewidth,
                  tileset.tileheight
                );

                if (this.textures.exists(baseName)) {
                  logger.info(
                    `Removing existing texture ${baseName} in favor of preferred tileset texture`
                  );
                  this.textures.remove(baseName);
                }

                this.textures.addCanvas(baseName, combinedCanvas);
              }
            }
          }
        });
      });
    });

    if (import.meta.env.DEV) {
      this.scene.start('MainScene');
    } else {
      this.scene.start('TitleScene');
    }
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
