import { getLogger } from '@src/telemetry/logger';
import EventBus from '@src/coreSystems/eventBus';
import { injectable } from 'inversify';
import { ITimeSystem } from '@src/config/interfaces';

export enum TimeState {
  PAUSED = 0,
  RUNNING = 1,
  SLOW_MOTION = 0.5,
}

@injectable()
export class TimeSystem implements ITimeSystem {
  private timeState: TimeState;
  private timeFactor!: number;
  private logger = getLogger('time');
  private lastUpdateTime: number;

  constructor() {
    this.timeState = TimeState.RUNNING;
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
    this.logger.debug(`Time state: ${TimeState[this.timeState]}`);
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
    this.logger.debug(`Adjusted delta time: ${adjustedDeltaTime}`);
    return adjustedDeltaTime;
  }

  togglePause() {
    this.setTimeState(
      this.timeState === TimeState.PAUSED ? TimeState.RUNNING : TimeState.PAUSED
    );
  }

  toggleSlowTime() {
    this.setTimeState(
      this.timeState === TimeState.SLOW_MOTION
        ? TimeState.RUNNING
        : TimeState.SLOW_MOTION
    );
  }
}
