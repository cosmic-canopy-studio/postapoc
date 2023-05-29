import { Container } from 'inversify';
import { Scene } from 'phaser';
import { TimeSystem } from '@src/time/timeSystem';
import { PhaserTimeController } from '@src/time/phaserTimeController';
import { ITimeController } from '@src/config/interfaces';
import { TIME_CONTROLLER_FACTORY, TIME_SYSTEM } from '@src/config/constants';

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
