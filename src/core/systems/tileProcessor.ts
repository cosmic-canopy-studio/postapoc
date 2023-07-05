import { Tile, Tilemap, Tileset, TilesetProperty } from '@src/core/data/types';
import logger, { getLogger } from '@src/telemetry/systems/logger';
import Phaser from 'phaser';

export default class TileProcessor {
  private logger = getLogger('core');

  constructor(private textures: Phaser.Textures.TextureManager) {}

  processTilesetAssets(
    tilesetAssets: Tilemap[],
    cache: Phaser.Cache.CacheManager
  ) {
    tilesetAssets.forEach((asset) => {
      const tilesetJson = cache.json.get(asset.key + 'Tilemap');

      tilesetJson.tilesets.forEach((tileset: Tileset) => {
        this.logger.debug('Processing tileset: ', tileset);
        this.logger.debug('Textures: ', this.textures);
        const image = this.textures.get(tileset.name).getSourceImage();
        this.logger.debug(
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
          this.logger.warn('Tile property type not found for tile', tile);
          return;
        } else {
          this.logger.debug('typeProperty: ', typeProperty);
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
        this.logger.debug('can combine: ', baseName);
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
    this.logger.debug(
      `Drawing tile with id ${tile.id} at coordinates (${x}, ${y})`
    ); // New log
    const canvas = document.createElement('canvas');
    canvas.width = tileset.tilewidth;
    canvas.height = tileset.tileheight;
    this.logger.debug('tilesetImageCanvas in getTileImage', tilesetImageCanvas); // New log
    this.logger.debug('canvas in getTileImage', canvas); // New log
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
    this.logger.debug('Image in createCanvasFromImage: ', image); // New log
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    this.logger.debug('Canvas in createCanvasFromImage: ', canvas); // New log
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get context from combined canvas');
    }
    context.drawImage(image, 0, 0);
    return canvas;
  }

  private getTileCoordinates(tile: Tile, tileset: Tileset): [number, number] {
    // Mask to remove the flipping and rotating bits
    const cleanTileId = tile.id & ~((1 << 31) | (1 << 30) | (1 << 29));

    const adjustedTileId = cleanTileId - 1;
    const x = (adjustedTileId % tileset.columns) * tileset.tilewidth;
    const y = Math.floor(adjustedTileId / tileset.columns) * tileset.tileheight;

    return [x, y];
  }
}
