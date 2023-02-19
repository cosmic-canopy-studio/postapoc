import { Direction, GridEngine, GridEngineConfig } from 'grid-engine';
import { injectable } from 'inversify';
import { Logger } from 'tslog';

const logger = new Logger();
@injectable()
export default class GridEngineController {
  private engine!: GridEngine;

  create(
    scene: Phaser.Scene,
    tilemap: Phaser.Tilemaps.Tilemap,
    config: GridEngineConfig
  ) {
    this.engine = new GridEngine(scene);
    logger.debug('engine created');
    this.update(tilemap, config);
  }

  update(tilemap: Phaser.Tilemaps.Tilemap, config: GridEngineConfig) {
    this.engine.create(tilemap, config);
    logger.debug('engine updated');
  }

  getEngine() {
    logger.debug('getEngine');
    return this.engine;
  }

  move(gridActor: string, direction: Direction) {
    let isMoving = this.engine.isMoving(gridActor);
    logger.debug(
      `engine exists: ${this.engine !== null && this.engine !== undefined}
      move: ${gridActor} ${direction} is moving: ${isMoving}`
    );
    if (isMoving) {
      this.engine.stopMovement(gridActor);
    } else {
      this.engine.move(gridActor, direction);
    }
  }
}
