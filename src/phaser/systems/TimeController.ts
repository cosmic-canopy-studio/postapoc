// Part: src/phaser/systems/TimeController.ts

// src/phaser/systems/TimeController.ts

import { Scene } from 'phaser';
import { ITimeController } from '@src/utils/interfaces';
import EventBus from '@src/core/EventBus';

export class TimeController implements ITimeController {
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
    EventBus.on('timeScaleChange', this.setTimeScale.bind(this));
  }

  setTimeScale(factor: number) {
    this.scene.time.timeScale = factor;
  }
}
