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

  loadAssets(assets: Asset[], scene: Phaser.Scene) {
    assets.forEach((asset: Asset) => {
      this.logger.debug('Loading asset: ', asset);
      if (scene.textures.exists(asset.key)) {
        this.logger.debug(`Removing existing texture ${asset.key}`);
        scene.textures.remove(asset.key);
      }
      this.loadAsset(asset);
    });
  }

  loadAsset(asset: Asset) {
    const extension = asset.url.split('.').pop();
    switch (extension) {
      case 'png':
        this.logger.debugVerbose('Loading PNG: ', asset);
        this.load.image(asset.key, asset.url);
        break;
      case 'svg':
        if (asset.width && asset.height) {
          this.logger.debugVerbose('Loading SVG: ', asset);
          this.load.svg(asset.key, asset.url, {
            width: asset.width,
            height: asset.height,
          });
        } else {
          this.logger.debugVerbose(
            'Loading SVG without width and height: ',
            asset
          );
          this.load.svg(asset.key, asset.url);
        }
        break;
      default:
        this.logger.error(`Unsupported file extension ${extension}`);
    }
  }
}
