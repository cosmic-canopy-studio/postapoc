import { inject, injectable } from 'inversify';
import { TYPES } from '../constants/types';
import { Direction } from 'grid-engine';
import IMovement from '../interfaces/IMovement';
import GridEngineController from './gridEngineController';
import { Logger } from 'tslog';

const logger = new Logger({ type: 'hidden' });
@injectable()
export default class ObjectMovement implements IMovement {
  @inject(TYPES.GridEngineController) private controller!: GridEngineController;

  public move(gridActor: string, direction: Direction) {
    logger.debug(`move ${gridActor} ${direction}`);
    this.controller.move(gridActor, direction);
  }
}
