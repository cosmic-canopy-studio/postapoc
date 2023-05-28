import { getLogger } from '@src/telemetry/logger';
import EventBus from '@src/coreSystems/eventBus';
import { inject, injectable } from 'inversify';
import { Scene } from 'phaser';
import { ITimeController } from '@src/definitions/interfaces';
import { TIME_CONTROLLER } from '@src/definitions/constants';

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
