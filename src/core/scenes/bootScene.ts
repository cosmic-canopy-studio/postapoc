import tilesetAssets from '@src/core/assets/kennynl/tilesetAssets.json';
import itemAssets from '@src/core/assets/prototype/itemAssets.json';
import menuAssets from '@src/core/assets/prototype/menuAssets.json';
import objectAssets from '@src/core/assets/prototype/objectAssets.json';
import terrainAssets from '@src/core/assets/prototype/terrainAssets.json';
import uiAssets from '@src/core/assets/prototype/uiAssets.json';

import { createFallbackSVG } from '@src/core/utils/svgUtils';
import logger from '@src/telemetry/systems/logger';
import Phaser from 'phaser';

interface Asset {
  key: string;
  url: string;
  width?: number;
  height?: number;
}

interface Tilemap extends Asset {
  key: string;
  type: 'tilemap';
  url: string;
  tilesets: Asset[];
}

interface TilesetProperty {
  name: string;
  value: string;
}

interface Tileset {
  id: number;
  name: string;
  properties: TilesetProperty[];
  tilewidth: number;
  tileheight: number;
  columns: number;
  tiles: Tile[];
}

interface Tile {
  id: number;
  properties: TilesetProperty[];
}

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
    this.loadTilesetAssets(tilesetAssets as Tilemap[]);
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

      tilesetJson.tilesets.forEach((tileset: Tileset) => {
        console.log('Processing tileset: ', tileset);
        const image = this.textures.get(tileset.name).getSourceImage();
        console.log(
          `Processing tileset ${
            tileset.name
          }. Texture cache state: ${this.textures.getTextureKeys()}`
        ); // New log
        const tilesetImageCanvas = this.createCanvasFromImage(
          image as HTMLImageElement
        );
        this.processTiles(tileset, tilesetImageCanvas);
      });
    });
  }

  private processTiles(
    tileset: Tileset,
    tilesetImageCanvas: HTMLCanvasElement
  ) {
    tileset.tiles.forEach((tile: Tile) => {
      if (
        tile.properties &&
        tile.properties.some((property) => property.name === 'type')
      ) {
        const typeProperty = tile.properties.find(
          (property) => property.name === 'type'
        );
        if (!typeProperty) {
          throw new Error('Tile property type not found');
        } else {
          console.log('typeProperty: ', typeProperty);
        }
        this.processTile(
          typeProperty,
          tile,
          tileset.tiles,
          tileset,
          tilesetImageCanvas
        );
      }
    });
  }

  private processTile(
    typeProperty: TilesetProperty,
    tile: Tile,
    tiles: Tile[],
    tileset: Tileset,
    tilesetImageCanvas: HTMLCanvasElement
  ) {
    const match = typeProperty.value.match(/(.*)-(\d+)x(\d+)$/);

    if (match) {
      const baseName = match[1];
      const height = parseInt(match[2]);
      const width = parseInt(match[3]);

      let combinedCanvas: HTMLCanvasElement;
      const targetTiles: Tile[] = [];
      let canCombine = true;

      for (let h = 0; h < height; h++) {
        for (let w = 0; w < width; w++) {
          const nextTileTypeName = `${baseName}-${h + 1}x${w + 1}`;
          const nextTile = this.findNextTile(tiles, nextTileTypeName);
          canCombine = this.pushTargetTile(targetTiles, nextTile);
        }
      }

      if (this.textures.exists(baseName)) {
        logger.info(
          `Removing existing texture ${baseName} in favor of tileset texture`
        );
        this.textures.remove(baseName);
      }

      if (canCombine) {
        console.log('can combine: ', baseName);
        combinedCanvas = this.combineTiles(
          targetTiles,
          width,
          tileset,
          tilesetImageCanvas
        );

        this.textures.addCanvas(baseName, combinedCanvas);
      }
    }

    const baseName = typeProperty.value;
    if (this.textures.exists(baseName)) {
      logger.info(`Removing existing texture ${baseName}`);
      this.textures.remove(baseName);
    }
    const tileImage = this.getTileImage(tile, tileset, tilesetImageCanvas);
    this.textures.addCanvas(baseName, tileImage);
  }

  private findNextTile(tiles: Tile[], typeName: string) {
    return tiles.find((tile: Tile) =>
      tile.properties.find(
        (property: TilesetProperty) =>
          property.name === 'type' && property.value === typeName
      )
    );
  }

  private pushTargetTile(targetTiles: Tile[], tile: Tile | undefined): boolean {
    if (tile) {
      targetTiles.push(tile);
      return true;
    } else {
      return false;
    }
  }

  private combineTiles(
    tiles: Tile[],
    width: number,
    tileset: Tileset,
    tilesetImageCanvas: HTMLCanvasElement
  ): HTMLCanvasElement {
    const combinedCanvas = document.createElement('canvas');
    combinedCanvas.width = tileset.tilewidth * width;
    combinedCanvas.height = tileset.tileheight * (tiles.length / width);

    const context = combinedCanvas.getContext('2d');

    if (!context) {
      throw new Error('Could not get context from combined canvas');
    }

    tiles.forEach((tile: Tile, index: number) => {
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

  private getTileImage(
    tile: Tile,
    tileset: Tileset,
    tilesetImageCanvas: HTMLCanvasElement
  ): HTMLCanvasElement {
    const [x, y] = this.getTileCoordinates(tile, tileset);
    console.log(`Drawing tile with id ${tile.id} at coordinates (${x}, ${y})`); // New log
    const canvas = document.createElement('canvas');
    canvas.width = tileset.tilewidth;
    canvas.height = tileset.tileheight;
    console.log('tilesetImageCanvas in getTileImage', tilesetImageCanvas); // New log
    console.log('canvas in getTileImage', canvas); // New log
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get context from combined canvas');
    }
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

  private createCanvasFromImage(image: HTMLImageElement): HTMLCanvasElement {
    console.log('Image in createCanvasFromImage: ', image); // New log
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    console.log('Canvas in createCanvasFromImage: ', canvas); // New log
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get context from combined canvas');
    }
    context.drawImage(image, 0, 0);
    return canvas;
  }

  private getTileCoordinates(tile: Tile, tileset: Tileset): [number, number] {
    const x = (tile.id % tileset.columns) * tileset.tilewidth;
    const y = Math.floor(tile.id / tileset.columns) * tileset.tileheight;

    return [x, y];
  }

  private loadTilesetAssets(assets: Tilemap[]) {
    assets.forEach((asset: Tilemap) => {
      this.load.json(asset.key + 'Tilemap', asset.url);
      for (const tileset of asset.tilesets) {
        this.load.image(tileset.key, tileset.url);
      }
    });
  }

  private loadAssets(assets: Asset[]) {
    assets.forEach((asset: Asset) => {
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
