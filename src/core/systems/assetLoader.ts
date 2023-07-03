import { Asset, Tilemap } from '@src/core/data/types';
import Phaser from 'phaser';

export default class AssetLoader {
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
      console.log('Loading asset: ', asset);
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
            console.log('Loading SVG without width and height: ', asset);
            console.log(this.load);
            this.load.svg(asset.key, asset.url);
          }
          break;
        default:
          console.warn(`Unsupported file extension ${extension}`);
      }
    });
  }
}
