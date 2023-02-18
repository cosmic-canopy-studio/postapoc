import { GridEngine, GridEngineConfig } from 'grid-engine';
import { injectable } from 'inversify';

@injectable()
export default class GridEngineController {
  private engine!: GridEngine;

  create(
    scene: Phaser.Scene,
    tilemap: Phaser.Tilemaps.Tilemap,
    config: GridEngineConfig
  ) {
    this.engine = new GridEngine(scene);
    this.update(tilemap, config);
  }

  update(tilemap: Phaser.Tilemaps.Tilemap, config: GridEngineConfig) {
    this.engine.create(tilemap, config);
  }

  getEngine() {
    return this.engine;
  }
}
