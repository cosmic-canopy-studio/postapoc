// Part: src/core/systems/inversify.config.ts
// Code Reference: https://github.com/inversify/InversifyJS
// Documentation: https://inversify.io/

import { TIME_CONTROLLER_FACTORY, TIME_SYSTEM } from '@src/core/constants';
import { ITimeController } from '@src/core/interfaces';
import { PhaserTimeController } from '@src/core/systems/phaserTimeController';
import { TimeSystem } from '@src/core/systems/timeSystem';
import { Container } from 'inversify';
import { Scene } from 'phaser';

const container = new Container();

container.bind(TIME_SYSTEM).to(TimeSystem).inSingletonScope();
container
  .bind<ITimeController>(TIME_CONTROLLER_FACTORY)
  .toFactory<ITimeController>((context) => {
    return (scene: Scene) => {
      return new PhaserTimeController(scene);
    };
  });

export default container;
