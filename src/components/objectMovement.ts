import { inject, injectable } from "inversify";
import { TYPES } from '../constants/types';
import { Direction } from 'grid-engine';
import IMovement from '../interfaces/IMovement';
import GridEngineController from './gridEngineController';

@injectable()
export default class ObjectMovement implements IMovement {
  @inject(TYPES.GridEngineController) private controller!: GridEngineController;

  public move(gridActor: string, direction: Direction) {
    const engine = this.controller.getEngine();

    engine.move(gridActor, direction);
  }
}
