import { Container } from 'inversify';
import { Scene } from 'phaser';
import { TimeSystem } from '@src/time/systems/timeSystem';
import { PhaserTimeController } from '@src/time/systems/phaserTimeController';
import { ITimeController } from '@src/core/config/interfaces';
import {
  TIME_CONTROLLER_FACTORY,
  TIME_SYSTEM,
} from '@src/core/config/constants';

const container = new Container();

container.bind(TIME_SYSTEM).to(TimeSystem).inSingletonScope();
container
  .bind<ITimeController>(TIME_CONTROLLER_FACTORY)
  .toFactory<ITimeController>((context) => {
    console.debug('context: ', context);
    return (...args: unknown[]) => {
      const scene = args[0] as Scene;
      return new PhaserTimeController(scene);
    };
  });

export default container;
