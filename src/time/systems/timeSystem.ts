import EventBus from '@src/core/systems/eventBus';
import { getLogger } from '@src/telemetry/systems/logger';

import { ITimeSystem } from '@src/time/data/interfaces';
import { injectable } from 'inversify';

export enum TimeState {
  PAUSED = 0,
  NORMAL = 1,
  SLOW = 0.5,
}

@injectable()
export class TimeSystem implements ITimeSystem {
  private timeState: TimeState;
  private timeFactor!: number;
  private logger = getLogger('time');
  private lastUpdateTime: number;

  constructor() {
    this.timeState = TimeState.NORMAL;
    this.setTimeFactor(this.timeState);
    this.lastUpdateTime = Date.now();
    EventBus.on('togglePause', this.togglePause.bind(this));
    EventBus.on('toggleSlowTime', this.toggleSlowTime.bind(this));
    this.logger.debug('Initialized');
  }

  setTimeState(timeState: TimeState) {
    this.timeState = timeState;
    this.setTimeFactor(timeState);
    this.logger.debug(`Time state: ${TimeState[this.timeState]}`);
  }

  getTimeState(): TimeState {
    this.logger.debugVerbose(`Time state: ${TimeState[this.timeState]}`);
    return this.timeState;
  }

  setTimeFactor(timeFactor: number) {
    this.logger.debug(`Time factor: ${timeFactor}`);
    this.timeFactor = timeFactor;
  }

  getTimeFactor(): number {
    this.logger.debug(`Time factor: ${this.timeFactor}`);
    return this.timeFactor;
  }

  getAdjustedDeltaTime(deltaTime: number): number {
    const adjustedDeltaTime = deltaTime * this.timeFactor;
    this.logger.debugVerbose(`Adjusted delta time: ${adjustedDeltaTime}`);
    return adjustedDeltaTime;
  }

  togglePause() {
    this.setTimeState(
      this.timeState === TimeState.PAUSED ? TimeState.NORMAL : TimeState.PAUSED
    );
  }

  toggleSlowTime() {
    this.setTimeState(
      this.timeState === TimeState.SLOW ? TimeState.NORMAL : TimeState.SLOW
    );
  }
}
