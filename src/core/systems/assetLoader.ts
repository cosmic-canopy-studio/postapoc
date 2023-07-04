import { Asset, Tilemap } from '@src/core/data/types';
import { getLogger } from '@src/telemetry/systems/logger';
import Phaser from 'phaser';

export default class AssetLoader {
  private logger = getLogger('core');

  constructor(private load: Phaser.Loader.LoaderPlugin) {}

  loadTilesetAssets(assets: Tilemap[]) {
    assets.forEach((asset: Tilemap) => {
      this.load.json(asset.key + 'Tilemap', asset.url);
      for (const tileset of asset.tilesets) {
        this.load.image(tileset.key, tileset.url);
      }
    });
  }

  loadAssets(assets: Asset[]) {
    assets.forEach((asset: Asset) => {
      const extension = asset.url.split('.').pop();
      this.logger.debug('Loading asset: ', asset);
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
            this.logger.debug('Loading SVG without width and height: ', asset);
            this.logger.debug(this.load);
            this.load.svg(asset.key, asset.url);
          }
          break;
        default:
          console.warn(`Unsupported file extension ${extension}`);
      }
    });
  }
}
