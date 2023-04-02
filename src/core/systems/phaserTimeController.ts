// Part: src/ecs/systems/phaserTimeController.ts
// Code Reference:
// Documentation:

import { getLogger } from '@src/core/components/logger';
import { TIME_CONTROLLER } from '@src/core/constants';
import { ITimeController } from '@src/core/interfaces';
import EventBus from '@src/core/systems/eventBus';
import { inject, injectable } from 'inversify';
import { Scene } from 'phaser';

@injectable()
export class PhaserTimeController implements ITimeController {
  private scene: Scene;
  private logger = getLogger('time');

  constructor(@inject(TIME_CONTROLLER) scene: Scene) {
    this.scene = scene;
    EventBus.on('togglePause', this.togglePause.bind(this));
    EventBus.on('toggleSlowTime', this.toggleSlowTime.bind(this));
    this.logger.debug('Initialized');
  }

  setTimeScale(scale: number) {
    this.scene.time.timeScale = scale;
    this.logger.debug(`Time scale: ${this.scene.time.timeScale}`);
  }

  togglePause() {
    if (this.scene.time.timeScale === 0) {
      this.setTimeScale(1);
    } else if (this.scene.time.timeScale === 1) {
      this.setTimeScale(0);
    } else {
      this.setTimeScale(1);
    }
  }

  toggleSlowTime() {
    if (this.scene.time.timeScale === 1) {
      this.setTimeScale(0.5);
    } else {
      this.setTimeScale(1);
    }
  }
}
